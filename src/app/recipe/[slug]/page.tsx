"use client"
import { Star, ThumbsUp, Bookmark, BookPlus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

type ReviewImage = { id: string; url: string };

type Review = {
    id: string;
    rating: number;
    body: string | null;
    createdAt: string;
    author: { id: string; username: string };
    images: ReviewImage[];
};

async function getAuthorName(authorId: string | null | undefined) {
    if (!authorId) return "Unknown Author";
    try {
        const response = await fetch(`/api/users/${authorId}`);
        if (!response.ok) return "Unknown Author";
        const userInfo = (await response.json()) as UserResponse | null;
        return userInfo?.username ?? "Unknown Author";
    } catch {
        return "Unknown Author";
    }
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <span style={{ display: "inline-flex", gap: "0.15em", cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size="1.4em"
                    fill={(hovered || value) >= i ? "yellow" : "white"}
                    color="var(--primary-color)"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(i)}
                    style={{ cursor: "pointer" }}
                />
            ))}
        </span>
    );
}

function StarDisplay({ rating, size = "1em" }: { rating: number; size?: string }) {
    return (
        <span style={{ display: "inline-flex", gap: "0.1em" }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={size} fill={rating >= i ? "yellow" : "white"} color="var(--primary-color)" />
            ))}
        </span>
    );
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
    const [likesCount, setLikesCount] = useState(0);
    const [savesCount, setSavesCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [bookMenuOpen, setBookMenuOpen] = useState(false);
    const [books, setBooks] = useState<RecipeBookOption[]>([]);
    const [bookMessage, setBookMessage] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const [reviewRating, setReviewRating] = useState(0);
    const [reviewBody, setReviewBody] = useState("");
    const [reviewImageUrl, setReviewImageUrl] = useState<string | null>(null);
    const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [reviewImageUploading, setReviewImageUploading] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const isLoggedIn = document.cookie.split(";").some(c => c.trim().startsWith("loggedIn="));
        setLoggedIn(isLoggedIn);
    }, []);

    useEffect(() => {
        if (!loggedIn) return;
        fetch("/api/users/me").then(async res => {
            if (res.ok) {
                const data = await res.json();
                setCurrentUserId(data?.id ?? null);
            }
        }).catch(() => { });
    }, [loggedIn]);

    useEffect(() => {
        if (!slug) { setError("Recipe slug is missing."); setLoading(false); return; }
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(`/api/recipes/${slug}`)
            .then(res => res.json().then(data => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
                if (cancelled) return;
                if (!ok) throw new Error(data?.error ?? "Failed to load recipe.");
                setRecipe(data);
                setLikedByUser(!!data.likedByUser);
                setSavedByUser(!!data.savedByUser);
                setLikesCount(data.likes ?? 0);
                setSavesCount(data.saves ?? 0);
                setReviewsCount(data.reviews ?? 0);
            })
            .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load recipe."); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [slug]);

    useEffect(() => {
        let cancelled = false;
        getAuthorName(recipe?.authorId).then(name => { if (!cancelled) setAuthorName(name); });
        return () => { cancelled = true; };
    }, [recipe?.authorId]);

    useEffect(() => {
        if (!slug) return;
        let cancelled = false;
        setReviewsLoading(true);
        fetch(`/api/recipes/${slug}/reviews`)
            .then(res => res.json())
            .then(data => { if (!cancelled) setReviews(Array.isArray(data) ? data : []); })
            .catch(() => { if (!cancelled) setReviews([]); })
            .finally(() => { if (!cancelled) setReviewsLoading(false); });
        return () => { cancelled = true; };
    }, [slug]);

    async function toggleBookMenu() {
        if (!bookMenuOpen) {
            const res = await fetch("/api/recipe-books");
            if (res.ok) setBooks(await res.json());
        }
        setBookMessage(null);
        setBookMenuOpen(!bookMenuOpen);
    }

    async function addToBook(bookId: string) {
        if (!recipe) return;
        const res = await fetch("/api/recipe-books/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId, recipeId: (recipe as any).id }),
        });
        const data = await res.json();
        if (res.ok) { setBookMessage("Added!"); setTimeout(() => { setBookMenuOpen(false); setBookMessage(null); }, 1200); }
        else setBookMessage(data.error ?? "Failed to add");
    }

    async function handleToggleLike() {
        if (!loggedIn) { router.push("/auth/login"); return; }
        const prev = likedByUser;
        setLikedByUser(!prev);
        setLikesCount(c => prev ? c - 1 : c + 1);
        try {
            const res = await fetch(`/api/recipes/${slug}/like`, { method: "POST" });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setLikedByUser(data.liked);
        } catch {
            setLikedByUser(prev);
            setLikesCount(c => prev ? c + 1 : c - 1);
        }
    }

    async function handleToggleSave() {
        if (!loggedIn) { router.push("/auth/login"); return; }
        const prev = savedByUser;
        setSavedByUser(!prev);
        setSavesCount(c => prev ? Math.max(0, c - 1) : c + 1);
        try {
            const res = await fetch(`/api/recipes/${slug}/save`, { method: "POST" });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setSavedByUser(!!data.saved);
        } catch {
            setSavedByUser(prev);
            setSavesCount(c => prev ? c + 1 : Math.max(0, c - 1));
        }
    }

    async function handleReviewImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setReviewImagePreview(URL.createObjectURL(file));
        setReviewImageUploading(true);
        setReviewError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/uploads/cloudinary", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Upload failed");
            setReviewImageUrl(data.url);
        } catch (err) {
            setReviewError(err instanceof Error ? err.message : "Image upload failed");
            setReviewImageUrl(null);
            setReviewImagePreview(null);
        } finally {
            setReviewImageUploading(false);
        }
    }

    async function handleReviewSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!loggedIn) { router.push("/auth/login"); return; }
        if (reviewRating === 0) { setReviewError("Please select a rating."); return; }
        setReviewSubmitting(true);
        setReviewError(null);
        try {
            const res = await fetch(`/api/recipes/${slug}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: reviewRating, body: reviewBody || null, imageUrl: reviewImageUrl }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Failed to submit review");
            setReviews(prev => [data, ...prev]);
            setReviewsCount(c => c + 1);
            setReviewRating(0);
            setReviewBody("");
            setReviewImageUrl(null);
            setReviewImagePreview(null);
            if (imageInputRef.current) imageInputRef.current.value = "";
        } catch (err) {
            setReviewError(err instanceof Error ? err.message : "Failed to submit review");
        } finally {
            setReviewSubmitting(false);
        }
    }

    async function handleDeleteReview(reviewId: string) {
        if (!confirm("Delete this review?")) return;
        const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
        if (res.ok) {
            setReviews(prev => prev.filter(r => r.id !== reviewId));
            setReviewsCount(c => Math.max(0, c - 1));
        }
    }

    if (loading) return <main><div className="container"><div className="card"><h1>Loading recipe...</h1></div></div></main>;
    if (error || !recipe) return <main><div className="container"><div className="card"><h1>Unable to load recipe</h1><p>{error ?? "Recipe not found."}</p></div></div></main>;

    const { title, featuredImage } = recipe;
    const rating = recipe.rating ?? 0;
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const directions = Array.isArray(recipe.directions) ? recipe.directions : [];

    return (
        <main>
            <style>{`
                span, button { display: inline-flex; align-items: center; gap: 0.25em; }
                .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1em; }
                ul, ol { list-style: none; display: flex; flex-direction: column; gap: 0.5em; }
                .buttons { display: flex; gap: 1em; position: relative; flex-wrap: wrap; }
                .book-dropdown { position: absolute; top: 100%; right: 0; background: white; border: 1px solid #ccc; border-radius: 8px; padding: 0.5em; min-width: 200px; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 0.25em; }
                .book-dropdown button { display: block; width: 100%; text-align: left; padding: 0.4em 0.6em; border: none; background: none; cursor: pointer; border-radius: 4px; }
                .book-dropdown button:hover { background: var(--primary-color); color: white; }
                .overview { display: grid; grid-template-columns: 1fr 1fr; align-items: start; }
                .ingredient { border: 3px dashed var(--primary-color); padding: 0.5em; border-radius: 10px; }
                .direction { border: 3px solid var(--secondary-color); border-radius: 10px; padding: 0.8em; display: grid; grid-template-columns: 52px 1fr; gap: 0.8em; }
                .direction .index { font-weight: bold; color: var(--text-light-color); background: var(--secondary-color); width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 10px; box-shadow: 0 8px 0 var(--primary-color); }
                .review-card { border: 2px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1em; display: flex; flex-direction: column; gap: 0.5em; }
                .review-header { display: flex; justify-content: space-between; align-items: center; }
                .review-author { font-weight: bold; }
                .review-date { font-size: 0.8em; opacity: 0.6; }
                .review-image { max-width: 320px; border-radius: 8px; margin-top: 0.5em; display: block; }
                .review-form { display: flex; flex-direction: column; gap: 0.75em; }
                .review-form textarea { width: 100%; min-height: 100px; padding: 0.6em; border-radius: 8px; border: 2px solid var(--border-color, #e2e8f0); font-family: inherit; font-size: 1em; resize: vertical; box-sizing: border-box; background: transparent; color: var(--text-color); background-color: white; }
                .review-image-preview { max-width: 240px; border-radius: 8px; margin-top: 0.25em; display: block; }
                .delete-btn { background: none; border: none; cursor: pointer; color: #e53e3e; padding: 0.2em; }
                .delete-btn:hover { opacity: 0.7; }
                .upload-btn-label { display: inline-flex; align-items: center; gap: 0.4em; cursor: pointer; background: var(--secondary-color, #edf2ff); border-radius: 8px; padding: 0.4em 0.9em; font-size: 0.95em; width: fit-content; }
                .star-row { display: flex; align-items: center; gap: 0.5em; }
                .reviews-list { display: flex; flex-direction: column; gap: 1em; margin-top: 0.5em; }
            `}</style>
            <div className="container">
                <div className="card">
                    <div className="overview">
                        <div className="info">
                            <h1>{title}</h1>
                            <h3>By <span>{authorName}</span></h3>
                        </div>
                        <div className="buttons">
                            <Button onClick={handleToggleLike} type="primary">
                                <ThumbsUp fill={likedByUser ? "currentColor" : "none"} size="1em" />
                                {likedByUser ? "Unlike" : "Like"}
                            </Button>
                            <Button onClick={handleToggleSave} type="secondary">
                                <Bookmark fill={savedByUser ? "currentColor" : "none"} size="1em" />
                                {savedByUser ? "Unsave" : "Save"}
                            </Button>
                            <Button onClick={toggleBookMenu} type="secondary">
                                <BookPlus size="1em" /> Add to Book
                            </Button>
                            {bookMenuOpen && (
                                <div className="book-dropdown">
                                    {bookMessage && <p style={{ margin: 0, padding: "0.3em 0.6em", fontWeight: "bold" }}>{bookMessage}</p>}
                                    {!bookMessage && books.map(b => <button key={b.id} onClick={() => addToBook(b.id)}>{b.title}</button>)}
                                    {!bookMessage && books.length === 0 && <p style={{ margin: 0, padding: "0.3em 0.6em" }}>No recipe books yet</p>}
                                    {!bookMessage && <button onClick={() => router.push("/recipe-books/new")} style={{ borderTop: "1px solid #eee", fontWeight: "bold" }}>+ Create New Book</button>}
                                </div>
                            )}
                        </div>
                    </div>
                    <h4 className="metrics">
                        <div className="card light centered">
                            Rating:<br />
                            <span style={{ marginTop: "0.25em" }}>
                                {rating > 0 ? rating.toFixed(1) : "—"}&nbsp;<StarDisplay rating={Math.round(rating)} />
                            </span>
                        </div>
                        <div className="card light centered">Likes:<br /> {likesCount}</div>
                        <div className="card light centered">Saves:<br /> {savesCount}</div>
                        <div className="card light centered">Reviews:<br /> {reviewsCount}</div>
                    </h4>
                </div>

                {featuredImage && (
                    <div className="card">
                        <ImageViewer title={title} featuredImageUrl={featuredImage} images={[featuredImage]} />
                    </div>
                )}

                <div className="card light">
                    <h2>Ingredients — <span>{ingredients.length}</span></h2>
                    <ul>
                        {ingredients.map((ing, i) => <li className="ingredient" key={i}>{ing}</li>)}
                    </ul>
                </div>

                <div className="card light">
                    <h2>Directions</h2>
                    <ol>
                        {directions.map((dir, i) => (
                            <li className="direction" key={i}>
                                <span className="index">{i + 1}</span>
                                <span>{dir}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="card">
                    <h2>Reviews</h2>

                    {loggedIn ? (
                        <form className="review-form" onSubmit={handleReviewSubmit}>
                            <h3 style={{ margin: 0 }}>Write a Review</h3>
                            <div className="star-row">
                                <span style={{ fontWeight: 600 }}>Rating:</span>
                                <StarPicker value={reviewRating} onChange={setReviewRating} />
                                {reviewRating > 0 && <span style={{ fontSize: "0.9em", opacity: 0.7 }}>{reviewRating}/5</span>}
                            </div>
                            <textarea
                                placeholder="Share your thoughts... (optional)"
                                value={reviewBody}
                                onChange={e => setReviewBody(e.target.value)}
                            />
                            <div>
                                <label className="upload-btn-label">
                                    <Upload size="1em" />
                                    {reviewImageUploading ? "Uploading…" : reviewImageUrl ? "Change Photo" : "Add a Photo"}
                                    <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleReviewImageSelect} disabled={reviewImageUploading} />
                                </label>
                                {reviewImagePreview && <img src={reviewImagePreview} alt="Preview" className="review-image-preview" />}
                            </div>
                            {reviewError && <p style={{ color: "#e53e3e", margin: 0 }}>{reviewError}</p>}
                            <div>
                                <Button type="primary" disabled={reviewSubmitting || reviewImageUploading}>
                                    {reviewSubmitting ? "Submitting…" : "Submit Review"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <p><a href="/auth/login" style={{ color: "var(--primary-color)" }}>Log in</a> to leave a review.</p>
                    )}

                    <hr style={{ margin: "1.5em 0", opacity: 0.15 }} />

                    {reviewsLoading && <p>Loading reviews…</p>}
                    {!reviewsLoading && reviews.length === 0 && <p style={{ opacity: 0.6 }}>No reviews yet. Be the first!</p>}
                    {!reviewsLoading && reviews.length > 0 && (
                        <div className="reviews-list">
                            {reviews.map(review => (
                                <div key={review.id} className="review-card">
                                    <div className="review-header">
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.15em" }}>
                                            <span className="review-author">{review.author.username}</span>
                                            <StarDisplay rating={review.rating} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                                            <span className="review-date">
                                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                                            </span>
                                            {currentUserId === review.author.id && (
                                                <button className="delete-btn" onClick={() => handleDeleteReview(review.id)} title="Delete review">
                                                    <Trash2 size="1em" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {review.body && <p style={{ margin: 0 }}>{review.body}</p>}
                                    {review.images.map(img => (
                                        <img key={img.id} src={img.url} alt="Review photo" className="review-image" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}