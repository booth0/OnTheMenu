import Link from "next/link";
import React from "react";

type Author = {
	id: string;
	name?: string | null;
	avatarUrl?: string | null;
};

export type RecipeCardRecipe = {
	id: string;
	slug: string;
	title: string;
	description?: string | null;
	featuredImage?: string | null;
	author?: Author | null;
	viewsCount?: number;
	createdAt?: string | Date;
	likesCount?: number;
	reviewsCount?: number;
};

interface RecipeCardProps {
	recipe: RecipeCardRecipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
	const {
		slug,
		title,
		description,
		featuredImage,
		author,
		viewsCount,
		createdAt,
		likesCount,
		reviewsCount,
	} = recipe;

	return (
		<article>
			{featuredImage && (
				<div>
					<img src={featuredImage} alt={title}/>
				</div>
			)}

			<h3>
				<Link href={`/recipe/${slug}`}>{title}</Link>
			</h3>

			{description && <p>{description}</p>}

			<div>
                {author?.name ? `By ${author.name}` : ""}
                {createdAt ? ` • ${createdAt}` : ""}
			</div>

			<div>
				<span>Likes: {likesCount ?? 0}</span>
				<span>Reviews: {reviewsCount ?? 0}</span>
				<span>Views: {viewsCount ?? 0}</span>
			</div>
		</article>
	);
}

