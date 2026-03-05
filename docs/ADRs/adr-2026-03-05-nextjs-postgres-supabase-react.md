**Missing Inputs**
- None remaining: qualitative metrics captured; numerical metrics and detailed mitigations are deferred to follow-up ADRs as requested.

------------------------------------------------------------------------

# OnTheMenu --- Architecture Decision Record

**Decision Title:** Adopt Next.js + React with PostgreSQL (Supabase)
**Status:** Accepted
**Date:** 2026-03-05

------------------------------------------------------------------------

## 1. Context

We need to select a full-stack web architecture for the OnTheMenu project that balances fast developer iteration, reliable hosted Postgres, and an ecosystem-friendly frontend. The immediate driver: the team already has experience with React frameworks and PostgreSQL, so we wanted a stack that would be easy to get started with and minimize ramp time. Constraints include limited development time for the capstone, hosting on modern cloud platforms, and a preference for managed database services to reduce ops burden.

------------------------------------------------------------------------

## 2. Decision

We will use **Next.js** (with **React**) as the primary web framework and **PostgreSQL** hosted via **Supabase** as the primary relational datastore for the OnTheMenu backend.

------------------------------------------------------------------------

## 3. Rationale (Data-Based)

- **Metric A:** Developer Experience — team familiarity with React frameworks favored Next.js for faster onboarding and iteration.
- **Metric B:** Operational — Supabase offers managed PostgreSQL which reduces ops overhead compared to self-hosted Postgres.
- **Metric C:** Performance — Next.js provides server-side rendering and incremental static regeneration helpful for initial page load and SEO.

------------------------------------------------------------------------

## 4. Consequences and Risks

- Consequence: Rapid frontend development using React/Next.js and built-in routing and SSR/ISR features.
- Consequence: Managed Postgres via Supabase reduces operational overhead and accelerates prototyping.
- Consequence: Vendor lock-in risk for managed Supabase-specific features (e.g., Row Level Security dashboard, Auth) which may require migration effort.

-- Risk → Mitigation: Increased dependency on Supabase managed services → Mitigation: Limit use of proprietary Supabase extensions where possible and keep SQL/schema portable. (Detailed mitigation steps to be defined in a follow-up ADR.)
-- Risk → Mitigation: Larger bundle sizes or SSR complexity in Next.js → Mitigation: Enforce performance budgets and use Next.js built-in optimization features (image, code-splitting, edge functions where appropriate). (Further remediation plans deferred.)

------------------------------------------------------------------------

## 5. Alternatives Considered

- **Runner-up:** SvelteKit

SvelteKit was considered and was close because of its small runtime and strong performance characteristics. However, it lost primarily because the team is more familiar with React and Next.js tooling, which would have increased ramp time and initial implementation effort given the capstone timeline.

## Context

Create an ADR that shows that we are using Next.js, PostgreSQL with Supabase, and React. Ask me questions for the information you need to fill in, and export it to the ADRs directory as a new file (See <attachments> above for file contents. You may not need to search or read the file again.)
