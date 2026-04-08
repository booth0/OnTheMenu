import { type RecipeCardRecipe } from './RecipeCard'

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'title-az'
  | 'title-za'
  | 'most-liked'
  | 'most-reviewed'
  | 'most-viewed'

const SORT_LABELS: Record<SortOption, string> = {
  'newest': 'Newest First',
  'oldest': 'Oldest First',
  'title-az': 'Title A–Z',
  'title-za': 'Title Z–A',
  'most-liked': 'Most Liked',
  'most-reviewed': 'Most Reviewed',
  'most-viewed': 'Most Viewed',
}

export function sortRecipes(recipes: RecipeCardRecipe[], sort: SortOption): RecipeCardRecipe[] {
  const sorted = [...recipes]
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
    case 'title-az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'title-za':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case 'most-liked':
      return sorted.sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0))
    case 'most-reviewed':
      return sorted.sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0))
    case 'most-viewed':
      return sorted.sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0))
  }
}

interface RecipeSortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
  id: string
}

export default function RecipeSortSelect({ value, onChange, id }: RecipeSortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      id={id}
      style={{
        padding: '8px 12px',
        borderRadius: '0.5em',
        border: '2px solid var(--secondary-color)',
        fontSize: '1em',
        fontFamily: 'inherit',
        fontWeight: 'bold',
        cursor: 'pointer',
        background: 'white',
        color: 'var(--text-color)',
        marginBottom: '1em',
      }}
    >
      {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
  )
}
