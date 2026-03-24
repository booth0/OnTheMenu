'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type RecipeFormState = {
  title: string;
  description: string;
  ingredients: string;
  directions: string;
  visibility: "PUBLIC" | "PRIVATE";
  featuredImageUrl: string | null;
  authorId?: string;
};

const emptyRecipe: RecipeFormState = {
  title: "",
  description: "",
  ingredients: "",
  directions: "",
  visibility: "PRIVATE",
  featuredImageUrl: null,
};

export default function EditRecipePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<RecipeFormState>(emptyRecipe);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('sessionId'));
  }, []);

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

        setRecipe({
          title: data.title ?? "",
          description: data.description ?? "",
          ingredients: Array.isArray(data.ingredients) ? data.ingredients.join("\n") : "",
          directions: Array.isArray(data.directions) ? data.directions.join("\n") : "",
          visibility: data.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
          featuredImageUrl: data.featuredImageUrl ?? null,
          authorId: data.authorId,
        });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipe((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!slug) {
      setError("Recipe slug is missing.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let featuredImageUrl = recipe.featuredImageUrl;
      const formData = new FormData(e.currentTarget);
      const imageFile = formData.get("featuredImage");

      if (imageFile instanceof File && imageFile.size > 0) {
        setUploadingImage(true);

        const imageForm = new FormData();
        imageForm.append("file", imageFile);

        const uploadResponse = await fetch("/api/uploads/cloudinary", {
          method: "POST",
          body: imageForm,
        });

        const uploadJson = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadJson.error ?? "Image upload failed");
        }

        featuredImageUrl = uploadJson.url;
      }

      const payload = {
        title: recipe.title,
        description: recipe.description,
        visibility: recipe.visibility,
        featuredImageUrl,
        ingredients: recipe.ingredients.split("\n").map((line) => line.trim()).filter(Boolean),
        directions: recipe.directions.split("\n").map((line) => line.trim()).filter(Boolean),
      };

      // TODO: Once current-user data is available, verify the editor matches recipe.authorId before allowing updates.
      const res = await fetch(`/api/recipes/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to update recipe.");
      }

      router.push(`/recipe/${slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update recipe.");
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  if (!loggedIn) {
    return (
      <main className="container">
        <h1>You must be logged in to edit a recipe.</h1>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container">
        <h1>Loading recipe...</h1>
      </main>
    );
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
      <h1>Edit Recipe</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="visibility">Is this recipe public or private?</label>
          <select id="visibility" name="visibility" value={recipe.visibility.toLowerCase()} onChange={handleChange} required>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={recipe.title} onChange={handleChange} required />

          <label htmlFor="featuredImage">Featured Image (optional)</label>
          <input type="file" id="featuredImage" name="featuredImage" accept="image/*" />

          {recipe.featuredImageUrl ? (
            <>
              <label>Current featured image</label>
              <img src={recipe.featuredImageUrl} alt={`${recipe.title} featured image`} style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "1em" }} />
            </>
          ) : null}

          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={recipe.description} onChange={handleChange} required></textarea>

          <label htmlFor="ingredients">Ingredients (one per line)</label>
          <textarea id="ingredients" name="ingredients" value={recipe.ingredients} onChange={handleChange} required></textarea>

          <label htmlFor="directions">Directions (one per line)</label>
          <textarea id="directions" name="directions" value={recipe.directions} onChange={handleChange} required></textarea>

          {error ? <p style={{ color: "crimson", marginBottom: "1em" }}>{error}</p> : null}

          <button type="submit" className="primary" disabled={submitting || uploadingImage}>
            {uploadingImage ? "Uploading Image..." : submitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}