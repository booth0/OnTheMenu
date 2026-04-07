import React from "react";

export function RecipeCardSkeleton() {
	return (
		<div className="skeleton">
			<div className="skeleton-image" />
			<div className="skeleton-title" />
			<div className="skeleton-line medium" />
			<div className="skeleton-line short" />
			<div className="skeleton-metrics">
				<span /><span /><span />
			</div>
		</div>
	);
}

export function RecipeGridSkeleton({ count = 3 }: { count?: number }) {
	return (
		<div className="featured-grid">
			{Array.from({ length: count }).map((_, i) => (
				<RecipeCardSkeleton key={i} />
			))}
		</div>
	);
}
