# OnTheMenu — Architecture Decision Record

**Decision Title:** Use Cloudinary for user-uploaded recipe and review images
**Status:** Accepted
**Date:** 2026-03-18

---

## 1. Context

The project needed a production-ready image upload path for recipe creation, recipe editing, and review photos without adding more storage complexity to the main application server. The README had not finalized image storage and explicitly left the choice as Supabase Storage or Cloudinary. As image-backed recipe flows became necessary, the team needed a solution that could be integrated quickly into Next.js route handlers and support direct upload workflows. The main constraints were implementation speed, compatibility with existing forms, and support for optional user-provided images.

---

## 2. Decision

We will use **Cloudinary** as the primary image hosting service for recipe featured images and review images in OnTheMenu.

---

## 3. Rationale (Data-Based)

- **Metric A:** The application uses `1` dedicated upload route: `/api/uploads/cloudinary`.
- **Metric B:** The upload flow is configured around `1` Cloudinary upload preset: `recipes`.
- **Metric C:** Review submissions support `1` optional image attachment per review.

---

## 4. Consequences and Risks

Using Cloudinary keeps image handling outside the main app runtime and gives the project a single upload path for both featured recipe images and review photos. It also reduces the amount of file-management code that would otherwise need to live in the app. The main trade-off is a new external dependency and the need to manage Cloudinary environment variables carefully.

- Risk: Misconfigured environment variables or upload preset settings can break image uploads. → Mitigation: keep Cloudinary settings explicit in environment configuration and validate them through the server upload route.
- Risk: The app becomes dependent on a third-party image provider. → Mitigation: isolate uploads behind a single route so the backend integration can be swapped later if needed.
- Risk: Unsigned upload settings may need tighter governance as the app grows. → Mitigation: keep the preset scope narrow and route all uploads through the app-controlled server endpoint.

---

## 5. Alternatives Considered

The runner-up was **Supabase Storage**. It was a close option because the project already uses Supabase for PostgreSQL and keeping storage in the same platform would have simplified vendor count. It was not chosen because Cloudinary provided a faster path to working image uploads for recipe forms and review photos, while the image-storage choice in the README was still unresolved.
