# OnTheMenu

OnTheMenu is a web app for sharing, discovering, and organizing recipes. It focuses on privacy-controlled publishing (private/public recipes), social signals (likes and reviews), moderation for community-safety, and discovery via search, trending, and related recommendations.

Tech stack
- Frontend: Next.js + React (SSR capable)
- Backend / Data: PostgreSQL hosted on Supabase (Auth, Storage, and Edge Functions optional)
- Images: Supabase Storage or Cloudinary (TBD)

Core features
- Recipe CRUD with private/public visibility
- Likes and reviews (rating + text + optional images)
- Trending and search (basic discovery)
- Related / recommended recipes component
- Moderation: flagging, moderator queue, admin management

Getting started (development)
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Configure a Supabase project for local development and set environment variables (see docs/specs/on-the-menu-spec.md and docs/plans/implementation-plan.md)

Docs & plans
- Project specification: docs/specs/on-the-menu-spec.md
- Implementation plan: docs/plans/implementation-plan.md
- Kanban cards CSV: docs/plans/kanban-cards.csv

Contributing
- Open issues or create PRs against the main branch. Follow code style (ESLint/Prettier) and include tests for new functionality.
