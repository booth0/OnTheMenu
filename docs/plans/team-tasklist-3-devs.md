Team Tasklist & Coordination Guide — OnTheMenu (3 developers)

Goal: enable three developers to work in parallel toward the April 7, 2026 MVP deadline. Tasks are grouped by sprint (A–D per implementation plan) with assignments, estimates, dependencies, and collaboration rules.

- DevC: CI pipeline (lint + test) and local dev running docs (0.5d).
- Parallel work: Once scaffolded, DevA and DevB can start working on auth integration in parallel; DevC prepares CI and e2e harness.
 
Team responsibilities
- All developers share responsibilities and rotate ownership of tasks. Every task is assigned to the whole team (`All Devs`) so anyone can pick it up. Keep tasks small and communicate ownership in the task card/PR description.

Workflow rules
- Branching: `feature/<id>-short-desc` from `main`; open PRs to `develop` (or `main` if no develop branch).
- PRs: 1 reviewer required (not author). CI must pass (lint + tests). Use small PRs (<300 LOC) where possible.
- Daily sync: 15-minute standup or short thread. Blockers posted to Slack/issue.
- Communication: add short PR descriptions + testing steps. Use issue templates for reproducible steps.
- Feature flags: use simple `enabled` flags for incomplete features to merge UI/backends early.

Sprint A — Setup & Core API (Mar 7 — Mar 13)
- All Devs: Repo scaffold & Supabase dev project (1d) — create migrations folder, seed data, env docs.
- All Devs: Next.js + TypeScript skeleton, ESLint/Prettier, base layout + component library (1d).
- All Devs: CI pipeline (lint + test) and local dev running docs (0.5d).
- Parallel work: Once scaffolded, the team coordinates on auth integration and CI/e2e harness.

Sprint B — Frontend Recipe Flows & Images (Mar 14 — Mar 20)
- All Devs: Recipe create/edit UI, validation, and list/detail pages (3d).
- All Devs: Recipe API endpoints (create/read/update/delete), access control for `visibility` (2d).
- All Devs: Image upload integration (Cloudinary or Supabase Storage, 1d) + API integration tests (1d).
- Handoff: Team coordinates via API contract docs and fixtures so UI work can proceed in parallel.

Sprint C — Social Features & Moderation (Mar 21 — Mar 27)
- All Devs: Likes API + DB unique constraint, Reviews DB model and moderation hooks (2d).
- All Devs: Likes & Reviews UI, review submission with images (2d).
- All Devs: Moderator queue UI and admin tools for assigning moderators + audit log viewer (2d).
- Tests: The team adds integration tests for like/review flows (1d).

Sprint D — Discovery (Search & Trending) + Recommendations (Mar 28 — Apr 3)
- All Devs: Search index + API (use Supabase full-text or simple Postgres ts_query) (2d).
- All Devs: Trending endpoint (views/saves/likes/reviews scoring) + background job skeleton (2d).
- All Devs: Related/Recommended component and integration (2d).

Hardening & Release (Apr 4 — Apr 7)
- All: Fix high-priority bugs, run accessibility spot checks, smoke tests, and deploy to staging/production.

Parallelization guidance
- Backend-heavy tasks → DevA primary, DevC backup for infra & jobs.
- Frontend-heavy tasks → DevB primary, DevC implements end-to-end tests.
- Cross-cutting (images, deployment) → DevC leads.

Task details (Kanban-ready, copy into board)
- [ ] T1 Repo scaffold & README — DevB — 1d — (blocking: none)
- [ ] T2 Supabase dev project + migrations — DevA — 1d — (depends: T1)
- [ ] T3 Next.js skeleton + ESLint/Prettier — DevB — 1d — (depends: T1)
- [ ] T4 CI (lint + test) — DevC — 0.5d — (depends: T3)
- [ ] T5 Auth (email/username+password) — DevA — 2d — (depends: T2,T3)
- [ ] T6 Recipe API (CRUD) — DevA — 3d — (depends: T5)
- [ ] T7 Recipe create/edit UI + image upload — DevB — 3d — (depends: T6,T4)
- [ ] T8 Image storage integration — DevC — 1d — (depends: T2)
- [ ] T9 Unit tests + e2e harness — DevC — 2d — (depends: T6,T7)
- [ ] T10 Likes API + UI — DevA/DevB — 2d — (depends: T6)
- [ ] T11 Reviews model + UI — DevA/DevB — 3d — (depends: T6)
- [ ] T12 Moderation queue + admin role — DevC/DevA — 3d — (depends: T11)
- [ ] T13 Search API — DevA — 2d — (depends: T6)
- [ ] T14 Trending endpoint + jobs — DevC — 2d — (depends: T9)
- [ ] T15 Related/Recommended component — DevB — 2d — (depends: T13,T14)
- [ ] T16 Release prep + deploy — DevC — 2d — (depends: all above)

Coordination & handoffs
- API contract doc: for every backend endpoint add a short spec file under `docs/api/` with request/response examples. DevA owns, DevB consumes.
- Mock server: If backend not ready, DevA provides JSON fixtures or a mock server so DevB can continue UI work.
- Shared environment: use a single Supabase dev instance (credentials in a shared secrets manager or env file) to avoid duplicated setup friction.

Collaboration conventions
- PR naming: `[sprintX][Txx] short-desc` and reference task ID.
- Commit messages: `Txx: short message` to map changes to tasks.
- Reviews: rotate reviewers (not author). Use quick checklists in PR templates (unit tests, manual test steps, accessibility note).

Risk management
- Long-running DB migrations → avoid breaking changes; use additive migrations during sprint and schedule destructive migrations in release windows.
- CI flakiness → quarantine flaky tests and keep CI fast by isolating heavy tests to nightly runs.

Optional: export these tasks as CSV (kanban) — ask me and I'll generate the file.

- [ ] T1 Repo scaffold & README — All Devs — 1d — (blocking: none)
- [ ] T2 Supabase dev project + migrations — All Devs — 1d — (depends: T1)
- [ ] T3 Next.js skeleton + ESLint/Prettier — All Devs — 1d — (depends: T1)
- [ ] T4 CI (lint + test) — All Devs — 0.5d — (depends: T3)
- [ ] T5 Auth (email/username+password) — All Devs — 2d — (depends: T2,T3)
- [ ] T6 Recipe API (CRUD) — All Devs — 3d — (depends: T5)
- [ ] T7 Recipe create/edit UI + image upload — All Devs — 3d — (depends: T6,T4)
- [ ] T8 Image storage integration — All Devs — 1d — (depends: T2)
- [ ] T9 Unit tests + e2e harness — All Devs — 2d — (depends: T6,T7)
- [ ] T10 Likes API + UI — All Devs — 2d — (depends: T6)
- [ ] T11 Reviews model + UI — All Devs — 3d — (depends: T6)
- [ ] T12 Moderation queue + admin role — All Devs — 3d — (depends: T11)
- [ ] T13 Search API — All Devs — 2d — (depends: T6)
- [ ] T14 Trending endpoint + jobs — All Devs — 2d — (depends: T9)
- [ ] T15 Related/Recommended component — All Devs — 2d — (depends: T13,T14)
- [ ] T16 Release prep + deploy — All Devs — 2d — (depends: all above)
