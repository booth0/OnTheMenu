export type RecipeApiItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featuredImage: string | null;
  author: { id: string; username: string } | null;
  viewsCount: number;
  createdAt: string;
  _count: { likes: number; reviews: number };
};
