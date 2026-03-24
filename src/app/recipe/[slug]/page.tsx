"use client"
import { Star, ThumbsUp, Bookmark } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/button";
import ImageViewer from "@/components/ui/imageViewer";
import { useParams } from "next/navigation";


export default async function RecipePage() {
    
    const params = useParams<{ slug: string }>();
    const slug = params.slug;
    const recipe = await fetch(`/api/recipes/${slug}`).then(res => res.json());

    console.log("Recipe slug:", slug); // Debug log
    let title = recipe.title;
    let featuredImageUrl = recipe.featuredImageUrl;
    let author = recipe.author;
    let rating = recipe.rating;
    let likes = recipe.likes;
    let saves = recipe.saves;
    let reviews = recipe.reviews;
    let [likedByUser, setLikedByUser] = useState(recipe.likedByUser);
    let [savedByUser, setSavedByUser] = useState(recipe.savedByUser);
    let ingredients = recipe.ingredients;
    let directions = recipe.directions;
    return (
        <main>
            <style>
                {`
                    span, button{
                        display: inline-flex;
                        align-items: center;
                        gap: 0.25em;
                    }
                    .metrics{
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                        gap: 1em;
                        justify-content: center;
                    }
                    ul, ol{
                        list-style: none;
                        display: flex;
                        flex-direction: column;
                        gap: 0.5em;
                    }
                    .buttons{
                        display: flex;
                        gap: 1em;
                    }
                    .overview{
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        align-items: start;
                    }
                    .ingredient{
                        border: 3px dashed var(--primary-color);
                        padding: 0.5em;
                        border-radius: 10px;
                    }
                    .direction{
                        border: 3px solid var(--secondary-color);
                        border-radius: 10px;
                        padding: 0.8em;
                        display: grid;
                        grid-template-columns: 52px 1fr;
                        gap: 0.8em;
                        .index{
                            font-weight: bold;
                            color: var(--text-light-color);
                            background: var(--secondary-color);
                            width: 52px;
                            height: 52px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 10px;
                            box-shadow: 0 8px 0 var(--primary-color);
                        }
                    }
                `}
            </style>
            <div className="container">
                <div className="card">
                    <div className="overview">
                        <div className="info">
                            <h1 id="title">{title}</h1>
                            <h3>By <span>{author}</span></h3>
                        </div>
                        <div className="buttons">
                            <Button onClick={() => setLikedByUser(!likedByUser)} type="primary"><ThumbsUp fill={likedByUser ? "currentColor" : "none"} size={"1em"} /> {likedByUser ? "Unlike Recipe" : "Like Recipe"}</Button>
                            <Button onClick={() => setSavedByUser(!savedByUser)} type="secondary"><Bookmark fill={savedByUser ? "currentColor" : "none"} size={"1em"} /> {savedByUser ? "Unsave Recipe" : "Save Recipe"}</Button>
                        </div>
                    </div>
                    <h4 className="metrics">
                        <div className="card light centered">
                            Rating: <br /> {rating}
                            <span>{Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? <Star key={i} fill="currentColor" size={"1em"} /> : <Star key={i} size={"1em"} />)}</span>
                        </div>
                        <div className="card light centered">
                            Likes:<br /> {likes}
                        </div>
                        <div className="card light centered">
                            Saves:<br /> {saves}
                        </div>
                        <div className="card light centered">
                            Reviews:<br /> {reviews}
                        </div>
                    </h4>
                </div>
                <div className="card">
                    <ImageViewer title={title} featuredImageUrl={featuredImageUrl} images={[featuredImageUrl, "https://static.vecteezy.com/system/resources/thumbnails/045/132/934/small/a-beautiful-picture-of-the-eiffel-tower-in-paris-the-capital-of-france-with-a-wonderful-background-in-wonderful-natural-colors-photo.jpg"]} />
                </div>
                <div className="card light">
                    <h2>Ingredients - <span>{ingredients.length}</span></h2>
                    <ul>
                        {ingredients.map((ingredient: any, index: any) => <li className="ingredient" key={index}>{ingredient}</li>)}
                    </ul>
                </div>
                <div className="card light">
                    <h2>Directions</h2>
                    <ol>
                        {directions.map((direction: any, index: any) => <li className="direction" key={index}><span className="index">{index + 1}</span><span>{direction}</span></li>)}
                    </ol>
                </div>
            </div>
        </main>
    )
}