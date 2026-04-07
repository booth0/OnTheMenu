# OnTheMenu — Architecture Decision Record

**Decision Title:** Add likes, saves, and review interactions directly to the recipe detail page
**Status:** Accepted
**Date:** 2026-04-03

---

## 1. Context

The project needed richer recipe engagement features that matched the product goals in the README. The recipe detail page was the natural place for users to react to a recipe, save it, and leave feedback without navigating elsewhere. The requested review experience was more than plain comments: it also needed star ratings and optional photos. The main constraints were keeping the experience simple, reusing the existing image upload path, and returning enough recipe state to drive user-specific actions on the page.

---

## 2. Decision

We will use **recipe-page likes, saves, and review submissions with optional images and five-star ratings** as the primary engagement model for OnTheMenu recipes.

---

## 3. Rationale (Data-Based)

- **Metric A:** The recipe page now supports `3` engagement actions: like, save, and review.
- **Metric B:** Reviews use a `5`-star rating scale.
- **Metric C:** Reviews support `1` optional image attachment in addition to text.

---

## 4. Consequences and Risks

This keeps user engagement on the recipe page and makes the page itself the central interaction surface for community feedback. It also creates a clearer data contract by returning like counts, save counts, review counts, and user-specific booleans with the recipe response. The trade-off is increased page complexity and more client state to keep synchronized after optimistic interactions.

- Risk: Optimistic UI updates can drift from server state if a request fails. → Mitigation: keep optimistic changes small and continue using API responses as the canonical source of truth.
- Risk: Review images add another failure point beyond text submission. → Mitigation: make image attachment optional and surface upload errors before review submission.
- Risk: More user-generated content increases moderation pressure over time. → Mitigation: rely on the existing moderation-oriented model and keep ownership-based deletion controls explicit.

---

## 5. Alternatives Considered

The runner-up was **keeping recipe books as the only save mechanism and using plain text comments without ratings or images**. It was close because it would have reduced UI complexity and required fewer routes. It was not chosen because the product already called for likes and reviews, and the requested review experience specifically needed both a `5`-star rating and optional photo support on the recipe page.