'use client'
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export default function NewRecipePage() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
      useEffect(() => {
                setLoggedIn(document.cookie.split(';').some(c => c.trim().startsWith('loggedIn=')))
      }, [])
      
    let recipe = {
        title: "",
        description: "",
        ingredients: [] as string[],
        directions: [] as string[],
        visibility: "PRIVATE",
        featuredImageUrl: null as string | null
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let featuredImageUrl: string | null = null;
            const formData = new FormData(e.currentTarget);

            const imageFile = formData.get("featuredImage") as File;
            if (imageFile && imageFile.size > 0) {
                setUploadingImage(true);
                const imageForm = new FormData();
                imageForm.append("file", imageFile);

                const uploadResponse = await fetch("/api/uploads/cloudinary", {
                    method: "POST",
                    body: imageForm
                });

                const uploadJson = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(uploadJson.error || "Image upload failed");
                }

                featuredImageUrl = uploadJson.url;
            }

            recipe.title = formData.get("title") as string;
            recipe.description = formData.get("description") as string;
            recipe.visibility = (formData.get("visibility") as string).toUpperCase();
            recipe.ingredients = (formData.get("ingredients") as string).split("\n").map(line => line.trim()).filter(line => line);
            recipe.directions = (formData.get("directions") as string).split("\n").map(line => line.trim()).filter(line => line);
            recipe.featuredImageUrl = featuredImageUrl;

            console.log("Submitting recipe:", recipe); // Debug log
            const res = await fetch("/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(recipe)
            });

            let payload: any = null;
            try {
                payload = await res.json();
            } catch {
                payload = null;
            }

            if (res.ok) {
                window.location.href = `/recipe/${payload.slug}`;
            } else {
                alert(`Error: ${payload?.error ?? `Request failed with status ${res.status}`}`);
            }
        } catch (err) {
            console.error("Error submitting recipe:", err); // Debug log
            alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setSubmitting(false);
            setUploadingImage(false);
        }
    };

    if (!loggedIn) {
        return (
            <main className="container">
                <h1>You must be logged in to create a recipe.</h1>
            </main>
        )
    }
    return (
        <main className="container">
            <style>
                {`
                form{
                    display: flex;
                    flex-direction: column;
                    >select, >input, >textarea{
                        margin-bottom: 1em;
                    }
                }
                
                select, input, textarea{
                    padding: 0.5em;
                    font-size: 1em;
                    border: 2px solid var(--primary-color);
                    border-radius: 5px;
                }
                
                `}
            </style>
            <h1>New Recipe</h1>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="visibility">Is this recipe public or private?</label>
                    <select id="visibility" name="visibility" required>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" required />
                    <label htmlFor="featuredImage">Featured Image (optional)</label>
                    <input type="file" id="featuredImage" name="featuredImage" accept="image/*" />
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" required></textarea>
                    <label htmlFor="ingredients">Ingredients (one per line)</label>
                    <textarea id="ingredients" name="ingredients" required></textarea>
                    <label htmlFor="directions">Directions (one per line)</label>
                    <textarea id="directions" name="directions" required></textarea>
                    <button type="submit" className="primary" disabled={submitting || uploadingImage}>{uploadingImage ? "Uploading Image..." : submitting ? "Creating Recipe..." : "Create Recipe"}</button>
                </form>
            </div>
        </main>
    );
}