"use client"
import { Star, ThumbsUp, Bookmark, BookPlus } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import ImageViewer from "@/components/ui/imageViewer";
import { useParams, useRouter } from "next/navigation";


type RecipeResponse = {
    id: string;
    title: string;
    featuredImage: string | null;
    rating?: number;
    likes?: number;
    saves?: number;
    reviews?: number;
    likedByUser?: boolean;
    savedByUser?: boolean;
    ingredients: string[];
    directions: string[];
    authorId?: string | null;
};

type UserResponse = {
    id: string;
    username: string;
}

type RecipeBookOption = {
    id: string;
    title: string;
}

async function getAuthorName(authorId: string | null | undefined) {
    if (!authorId) return "Unknown Author";
    try {
        const response = await fetch(`/api/users/${authorId}`);
        if (!response.ok) {
            return "Unknown Author";
        }
        const userInfo = (await response.json()) as UserResponse | null;
        return userInfo?.username ?? "Unknown Author";
    } catch {
        return "Unknown Author";
    }
}

export default function RecipePage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;
    const router = useRouter();

    const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
    const [authorName, setAuthorName] = useState<string>("Unknown Author");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [likedByUser, setLikedByUser] = useState(false);
    const [savedByUser, setSavedByUser] = useState(false);
    const [bookMenuOpen, setBookMenuOpen] = useState(false);
    const [books, setBooks] = useState<RecipeBookOption[]>([]);
    const [bookMessage, setBookMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setError("Recipe slug is missing.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        const loadRecipe = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/recipes/${slug}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.error ?? "Failed to load recipe.");
                }

                if (cancelled) {
                    return;
                }

                setRecipe(data);
                setLikedByUser(!!data.likedByUser);
                setSavedByUser(!!data.savedByUser);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load recipe.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadRecipe();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    useEffect(() => {
        let cancelled = false;

        const fetchAuthorName = async () => {
            const name = await getAuthorName(recipe?.authorId);
            if (!cancelled) {
                setAuthorName(name);
            }
        };

        fetchAuthorName();

        return () => {
            cancelled = true;
        };
    }, [recipe?.authorId]);

    async function toggleBookMenu() {
        if (!bookMenuOpen) {
            const res = await fetch('/api/recipe-books');
            if (res.ok) {
                const data = await res.json();
                setBooks(data);
            }
        }
        setBookMessage(null);
        setBookMenuOpen(!bookMenuOpen);
    }

    async function addToBook(bookId: string) {
        if (!recipe) return;
        const res = await fetch('/api/recipe-books/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, recipeId: (recipe as any).id }),
        });
        const data = await res.json();
        if (res.ok) {
            setBookMessage('Added!');
            setTimeout(() => { setBookMenuOpen(false); setBookMessage(null); }, 1200);
        } else {
            setBookMessage(data.error ?? 'Failed to add');
        }
    }

    if (loading) {
        return (
            <main>
                <div className="container">
                    <div className="card">
                        <h1>Loading recipe...</h1>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !recipe) {
        return (
            <main>
                <div className="container">
                    <div className="card">
                        <h1>Unable to load recipe</h1>
                        <p>{error ?? "Recipe not found."}</p>
                    </div>
                </div>
            </main>
        );
    }

    const title = recipe.title;
    const featuredImage = recipe.featuredImage;
    const rating = recipe.rating ?? 0;
    const likes = recipe.likes ?? 0;
    const saves = recipe.saves ?? 0;
    const reviews = recipe.reviews ?? 0;
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const directions = Array.isArray(recipe.directions) ? recipe.directions : [];

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
                        position: relative;
                    }
                    .book-dropdown{
                        position: absolute;
                        top: 100%;
                        right: 0;
                        background: white;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        padding: 0.5em;
                        min-width: 200px;
                        z-index: 10;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        display: flex;
                        flex-direction: column;
                        gap: 0.25em;
                    }
                    .book-dropdown button{
                        display: block;
                        width: 100%;
                        text-align: left;
                        padding: 0.4em 0.6em;
                        border: none;
                        background: none;
                        cursor: pointer;
                        border-radius: 4px;
                    }
                    .book-dropdown button:hover{
                        background: var(--primary-color);
                        color: white;
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
                            <h3>By <span>{authorName}</span></h3>
                        </div>
                        <div className="buttons">
                            <Button onClick={() => setLikedByUser(!likedByUser)} type="primary"><ThumbsUp fill={likedByUser ? "currentColor" : "none"} size={"1em"} /> {likedByUser ? "Unlike Recipe" : "Like Recipe"}</Button>
                            <Button onClick={() => setSavedByUser(!savedByUser)} type="secondary"><Bookmark fill={savedByUser ? "currentColor" : "none"} size={"1em"} /> {savedByUser ? "Unsave Recipe" : "Save Recipe"}</Button>
                            <Button onClick={toggleBookMenu} type="secondary"><BookPlus size={"1em"} /> Add to Book</Button>
                            {bookMenuOpen && (
                                <div className="book-dropdown">
                                    {bookMessage && <p style={{ margin: 0, padding: '0.3em 0.6em', fontWeight: 'bold' }}>{bookMessage}</p>}
                                    {!bookMessage && books.length > 0 && books.map((b) => (
                                        <button key={b.id} onClick={() => addToBook(b.id)}>{b.title}</button>
                                    ))}
                                    {!bookMessage && books.length === 0 && <p style={{ margin: 0, padding: '0.3em 0.6em' }}>No recipe books yet</p>}
                                    {!bookMessage && <button onClick={() => router.push('/recipe-books/new')} style={{ borderTop: '1px solid #eee', fontWeight: 'bold' }}>+ Create New Book</button>}
                                </div>
                            )}
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
                {featuredImage && <div className="card">
                    <ImageViewer title={title} featuredImageUrl={featuredImage ?? ""} images={featuredImage ? [featuredImage] : []} />
                </div>}
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