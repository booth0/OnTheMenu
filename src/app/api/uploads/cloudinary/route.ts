import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
    try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

        console.log("[cloudinary] cloudName:", cloudName ?? "MISSING");
        console.log("[cloudinary] uploadPreset:", uploadPreset ?? "MISSING");

        if( !cloudName || !uploadPreset) {
            return NextResponse.json({error: 'Cloudinary configuration is missing'}, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File size exceeds the 5MB limit" }, { status: 400 });
        }
        
        const cloudinaryForm = new FormData();
        cloudinaryForm.append("file", file);
        cloudinaryForm.append("upload_preset", uploadPreset);
        cloudinaryForm.append("folder", "recipes");

        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: "POST",
            body: cloudinaryForm,
        });

        const payload = await cloudinaryResponse.json();

        if (!cloudinaryResponse.ok) {
            return NextResponse.json({ error: payload.error.message || "Cloudinary upload failed" }, { status: 500 });
        }

        return NextResponse.json({ url: payload.secure_url, publicId: payload.public_id }, { status: 201 });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "An unexpected error occurred during upload" }, { status: 500 });
    }
}