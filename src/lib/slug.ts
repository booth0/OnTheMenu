// src/lib/slug.ts
import { nanoid } from 'nanoid';
export function slugify(s: string) {
  const base = s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,100);
  return base || `recipe-${nanoid(6)}`;
}