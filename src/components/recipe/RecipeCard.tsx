import Link from "next/link";
import Image from "next/image";
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
	currentUserId?: string | null;
	priority?: boolean;
	actionSlot?: React.ReactNode;
}

export default function RecipeCard({ recipe, currentUserId, priority, actionSlot }: RecipeCardProps) {
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

	const formatDate = (date: string | Date) => {
		const d = typeof date === "string" ? new Date(date) : date;
		return d.toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};
	const href = `/recipe/${slug}`;

	return (
		<article className="card">
			<style>
				{`
					.featuredImage {
						width: 100%;
						aspect-ratio: 4 / 3;
						max-width: 400px;
						align-self: center;
						border-radius: 12px;
						object-fit: cover;
					}
					.title {
						font-size: 1.2em;
						font-weight: bold;
						color: var(--secondary-color);
						text-decoration: none;
					}
					.metrics{
						display: flex;
						gap: 10px;
					}
					article.card > .card {
						flex: 1;
					}
				`}
			</style>
			{featuredImage && (
				<Image src={featuredImage} alt={title} className="featuredImage" width={400} height={300} priority={priority}/>
			)}

			<div className="card light centered">
				<h3>
					<Link href={href} className="title">{title}</Link>
				</h3>

				{description && <p>{description}</p>}

				<div>
					{author?.name ? `By ${author.name}` : ""}
					{createdAt ? ` • ${formatDate(createdAt)}` : ""}
				</div>

				<div className="metrics">
					<span>Likes: {likesCount ?? 0}</span>
					<span>Reviews: {reviewsCount ?? 0}</span>
				</div>
			</div>
			{actionSlot}
		</article>
	);
}

