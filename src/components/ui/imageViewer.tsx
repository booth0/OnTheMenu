import { useState } from "react";

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
            <img src={currentImageUrl} className="featuredImage" alt={title}/>
            <div className="imageMinis">
                {images.map((url, index) => (
                    <img key={index} src={url} className={`miniImage ${index === imageIndex ? "active" : ""}`} alt={`${title} - ${index + 1}`} onClick={() => {setCurrentImageUrl(url); setImageIndex(index); }} />
                ))}
            </div>
        </div>
    )
}