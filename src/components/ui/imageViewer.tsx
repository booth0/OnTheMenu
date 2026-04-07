import { useState } from "react";
import Image from "next/image";

export default function ImageViewer({
    images,
    title,
    featuredImageUrl,
}: {
    images: string[];
    title: string;
    featuredImageUrl: string;
}) {
    let [imageIndex, setImageIndex] = useState(0);
    let [currentImageUrl, setCurrentImageUrl] = useState(featuredImageUrl);
    return (
        <div className="imageViewer">
            <Image src={currentImageUrl} className="featuredImage" alt={title} width={500} height={375}/>
            <div className="imageMinis">
                {images.map((url, index) => (
                    <Image key={index} src={url} className={`miniImage ${index === imageIndex ? "active" : ""}`} alt={`${title} - ${index + 1}`} width={100} height={100} onClick={() => {setCurrentImageUrl(url); setImageIndex(index); }} />
                ))}
            </div>
        </div>
    )
}