OnTheMenu — Phased Implementation Plan

Overview
- Stack: Next.js (React) frontend, PostgreSQL via Supabase for data/storage, hosted SSR-capable frontend (Vercel or similar). Images: Cloudinary or Supabase Storage (TBD).
- MVP priority (from user): Recipe CRUD → Likes/Reviews → Moderation → Related/Recommended → Trending → Recipe Books

Phases

Phase 0 — Project Setup & Foundation (week 0)
- Goals: repo, basic infra, developer experience, CI, coding standards.
- Key tasks:
  - Initialize monorepo (or single Next.js app) and README. (AC: devs can run project locally)
  - Add linters/formatters: ESLint, Prettier. (AC: lint runs in CI)
  - Create `package.json` scripts for dev/build/test. (AC: `npm run dev`, `build`, `test` work)
  - Create Supabase project stub and tenant notes. (AC: Supabase project exists for dev)
  - Create initial database schema migration folder. (AC: migration applies)

Phase 1 — Core MVP Backend & Frontend (weeks 1–3)
- Goals: basic recipe CRUD, auth, and public view flows.
- Key tasks:
  - Auth: Email/username+password (profile username unique). (AC: signup/login/logout works)
  - Recipe model & API: create/read/update/delete endpoints, access control for `visibility`. (AC: private recipes inaccessible to others)
  - Frontend pages: recipe create/edit form, recipe detail, profile, list pages. (AC: form submits and shows recipe)
  - Image upload integration (placeholder): support image attachments for recipes (defer CDN choice). (AC: images upload and display)
  - Tests: unit tests for core business logic; basic e2e for recipe create/view. (AC: CI passes tests)

Phase 2 — Social + Moderation (weeks 3–5)
- Goals: likes, reviews, moderation flows, admin controls.
- Key tasks:
  - Likes API and UI (one like per user per recipe). (AC: like/unlike reflected in UI and DB)
  - Reviews model & UI (rating 1–5, text, optional images). (AC: reviews stored, displayed, and aggregate rating calculated)
  - Moderation: flagging, moderator queue, admin role for assigning moderators. (AC: moderators can act; audit logs recorded)
  - Add moderation tests and audit log checks. (AC: moderation actions logged and auditable)

Phase 3 — Discovery & Recommendations (weeks 5–8)
- Goals: search/trending and basic recommendations component.
- Key tasks:
  - Search: index recipes (title, ingredients, tags), filters, and pagination. (AC: relevant results returned)
  - Trending endpoint: implement scoring (views, saves, likes, reviews) with time-decay. (AC: trending list available)
  - Related/Recommended component: tag/ingredient and collaborative fallback. (AC: component returns >=3 items)
  - Caching and background jobs (recommendation compute). (AC: recommenders run off main request path)

Phase 4 — Polish, Scale, and Release (weeks 8–12)
- Goals: recipe books, shopping list prototype, observability, perf and accessibility.
- Key tasks:
  - Recipe books (collections): create/edit/add/remove recipes. (AC: users manage collections)
  - Optional features: shopping lists and pantry-based recommendations (prototype). (AC: basic shopping list export)
  - Performance budgets, instrumentation, SLOs, and accessibility audits. (AC: meet defined thresholds)
  - Prepare production Supabase project, secrets, and deploy to chosen hosting. (AC: production deployment configured)

Kanban-style Tasks (suggested Trello/Board cards)

Backlog (future / low priority)
- Import/export recipes
- Social follow feeds
- Multi-language support

To Do (high priority)
- Repo: Initialize Next.js + TypeScript skeleton — owner: dev, estimate: 1d
- Supabase: Create dev project and initial migrations — owner: dev, estimate: 1d
- Auth: Implement email+username+password auth — owner: backend, estimate: 2d
- Recipe CRUD API endpoints — owner: backend, estimate: 3d
- Recipe create/edit UI + image upload flow — owner: frontend, estimate: 3d

In Progress (example cards)
- Implement likes API and UI — owner: frontend/backend, estimate: 2d
- Implement reviews model and UI — owner: frontend/backend, estimate: 3d

Done (example)
- Linter & formatting configured

Card Template (copy into Trello card description)
- Title: [Short title]
- Description: [What this does and why]
- Acceptance Criteria: - [ ] criteria 1 - [ ] criteria 2
- Assignee: [name]
- Estimate: [days]
- Labels: backend/frontend/infra/UX/QA

Acceptance & Release Criteria
- MVP release when: Recipe CRUD, Auth, Likes/Reviews, Moderation basic flows, Search/Trending basic, and CI passing.

Next actions I can take
- Expand Phase 1 into detailed epics/stories with API contracts and DB schema, or
- Create a Trello-friendly CSV of cards ready for import.

Notes
- We will use Supabase for Postgres and optional Edge Functions; prefer Vercel for Next.js hosting unless you prefer Supabase platform for simplicity.
