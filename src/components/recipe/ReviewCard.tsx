import React from "react";

type Author = {
	id: string;
	name?: string | null;
	avatarUrl?: string | null;
};

export type ReviewCardReview = {
	id: string;
	recipeId: string;
	author?: Author | null;
	rating: number;
	body?: string | null;
	images?: string[];
	createdAt?: string | Date;
};

interface ReviewCardProps {
	review: ReviewCardReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
	const { author, rating, body, images, createdAt } = review;

	return (
		<article>
			<div>
				<span>{author?.name ?? "Anonymous"}</span>
				<span>Rating: {rating}/5</span>
				{createdAt ? <span>{String(createdAt)}</span> : null}
			</div>

			{body ? <p>{body}</p> : null}

			{Array.isArray(images) && images.length > 0 && (
				<div>
					{images.map((src, i) => (
						<img key={i} src={src} alt={`review-image-${i}`}/>
					))}
				</div>
			)}
		</article>
	);
}

