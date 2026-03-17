"use client"
import { Star, ThumbsUp, Bookmark } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/button";

export default function RecipePage() {
    let title = "Gluten Free Blueberry Pancakes";
    let featuredImageUrl = "https://picsum.photos/400/300";
    let author = "John Doe";
    let rating = 4.5;
    let likes = 120;
    let saves = 45;
    let reviews = 30;
    let [likedByUser, setLikedByUser] = useState(true);
    let [savedByUser, setSavedByUser] = useState(false);
    let ingredients = [
        "1 Cup rolled oats",
        "1/2 C milk of choice",
        "1 banana",
        "1 Tbsp baking powder",
        "1 Tbsp apple cider vinegar",
        "1 Tbsp maple syrup",
        "1 tsp vanilla extract",
        "1/2 C Blueberries fresh or frozen",
        "1/4 C Almonds sliced",
        "Dash of salt"
    ]
    let directions = [
        "In a high speed blender or food processor add all your ingredients except for the blueberries and nuts, and blend until a thick batter remains. Fold in the blueberries and nuts.",
        "Preheat a lightly greased pan on medium heat. Once hot, pour the batter into the pan. Cook until the edges start to brown and bubble the flip and cook for another minute or two. These need more time than you think…"
    ]
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
            <div className="navWillGoHere"></div>
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
                    <div className="imageViewer">
                        <img src={featuredImageUrl} className="featuredImage" alt={title}/>
                        <div className="imageMinis">
                            <img src={featuredImageUrl} alt={title} className="active"/>
                            <img src={featuredImageUrl} alt={title}/>
                            <img src={featuredImageUrl} alt={title}/>
                        </div>
                    </div>
                </div>
                <div className="card light">
                    <h2>Ingredients - <span>{ingredients.length}</span></h2>
                    <ul>
                        {ingredients.map((ingredient, index) => <li className="ingredient" key={index}>{ingredient}</li>)}
                    </ul>
                </div>
                <div className="card light">
                    <h2>Directions</h2>
                    <ol>
                        {directions.map((direction, index) => <li className="direction" key={index}><span className="index">{index + 1}</span><span>{direction}</span></li>)}
                    </ol>
                </div>
            </div>
        </main>
    )
}