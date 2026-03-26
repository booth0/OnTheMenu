import React from "react";
import RecipeCard, { RecipeCardRecipe } from "../recipe/RecipeCard";

export type RecipeBookItem = {
  id: string;
  bookId?: string;
  recipeId?: string;
  recipe?: RecipeCardRecipe | null;
  position?: number | null;
  addedAt?: string | Date;
};

export type RecipeBook = {
  id: string;
  ownerId?: string;
  title: string;
  description?: string | null;
  items?: RecipeBookItem[];
  createdAt?: string | Date;
};

interface RecipeBookProps {
  book: RecipeBook;
}

export default function RecipeBook({ book }: RecipeBookProps) {
  const { title, description, items, createdAt } = book;

  return (
    <main>
      <header>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
        <div>
          <span>{Array.isArray(items) ? items.length : 0}</span>{' '}
          {Array.isArray(items) && items.length === 1 ? 'recipe' : 'recipes'}
        </div>
        {createdAt ? <div>Created: {String(createdAt)}</div> : null}
      </header>

      <section>
        {Array.isArray(items) && items.length > 0 ? (
          <div>
            {items.map((item) =>
              item.recipe ? (
                <RecipeCard key={item.id} recipe={item.recipe} />
              ) : (
                <div key={item.id}>Recipe not found</div>
              )
            )}
          </div>
        ) : (
          <p>No recipes in this book.</p>
        )}
      </section>
    </main>
  );
}
