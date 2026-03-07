
OnTheMenu — Accelerated Implementation Plan (deadline: 2026-04-07)

Overview
- Stack: Next.js (React) frontend, PostgreSQL via Supabase for data/storage, hosted on an SSR-capable platform (Vercel or Supabase). Images: Cloudinary or Supabase Storage (TBD).
- Hard deadline: 2026-04-07. Plan compressed to meet that date — prioritizes the true MVP scope: Recipe CRUD, Auth, Likes/Reviews, Moderation, Basic Recommendations, and basic Search/Trending.

Schedule & Phases (compressed)

Sprint A — Setup & Core API (Mar 7 — Mar 13)
- Goals: project foundation, auth, core recipe model and DB migrations.
- Must-have deliverables:
  - Repo scaffold: Next.js + TypeScript, scripts (`dev`, `build`, `test`).
  - CI basic: lint + test pipeline.
  - Supabase dev project & initial migrations.
  - Auth: Email/username+password (unique username).
  - Recipe API: basic create/read/update/delete with `visibility` enforcement.

Sprint B — Frontend Recipe Flows & Images (Mar 14 — Mar 20)
- Goals: recipe create/edit UI, detail pages, image upload integration (temporary storage if CDN undecided), and tests.
- Must-have deliverables:
  - Recipe create/edit form with image upload and client-side validation.
  - Recipe detail and list pages.
  - Unit tests and at least one e2e test for recipe creation and view.

Sprint C — Social Features & Moderation (Mar 21 — Mar 27)
- Goals: likes, reviews (rating+text+images), flagging, moderator queue, admin assignment.
- Must-have deliverables:
  - Likes API + UI (enforce one like per user).
  - Reviews model & UI (rating 1–5, optional text/images).
  - Moderation: flagging endpoint, moderator queue UI/filters, admin role to manage moderators, audit logging of actions.

Sprint D — Discovery (Search & Trending) + Recommendations (Mar 28 — Apr 3)
- Goals: basic search, trending endpoint, and related/recommendations component.
- Must-have deliverables:
  - Search API (title, ingredients, tags) with filters and pagination.
  - Trending endpoint using views/saves/likes/reviews with simple time-decay.
  - Related/Recommended component (tag/ingredient-based fallback; collaborative signals if available).

Hardening & Release (Apr 4 — Apr 7)
- Goals: testing, performance checks, accessibility, deploy to staging/production.
- Must-have deliverables:
  - Run full CI, fix critical failures.
  - Performance smoke checks and accessibility baseline (WCAG AA spot checks).
  - Configure production Supabase (secrets, backups), deploy Next.js to hosting, and run smoke tests.
  - Buffer for critical bug fixes and final polish.

Scope adjustments to meet deadline
- Defer non-essential features to backlog: Recipe Books, Shopping lists, advanced recommenders, import/export, multi-language.
- Use managed services where possible (Supabase Auth/Storage, Cloudinary) to reduce ops work.

Kanban / Priority Cards (top-priority for April 7)
- Repo scaffold: Next.js + TypeScript, CI (lint/test)
- Supabase dev project + migrations
- Auth: Email/username+password
- Recipe CRUD API
- Recipe create/edit UI + image upload
- Unit & e2e tests for recipe flow
- Likes API/UI
- Reviews model/UI
- Flagging + moderator queue + admin management
- Search API
- Trending endpoint
- Related/Recommended component

Acceptance & Release Criteria (by 2026-04-07)
- Core user flows: signup, create recipe, publish (make public), view recipe, like, and review — all working end-to-end.
- Moderation: flags appear in queue; moderators/admins can take actions with audit logs.
- Basic discovery: search + trending + related recipes available and functional.
- CI passing and production deployment completed with basic smoke tests.

Risks & Mitigations
- Risk: Too many features for time window → Mitigation: freeze scope to the prioritized list; move others to backlog.
- Risk: Image/CDN integration delays → Mitigation: use Supabase Storage or direct Cloudinary uploads (choose fastest integration).
- Risk: Unexpected infra/config issues → Mitigation: allocate buffer days (Apr 4–7) for deployment and fixes.

Next steps I can take
- Break Sprint A into detailed subtasks and create Trello/GitHub cards, or
- Generate DB schema and API contracts for Sprint A items.

