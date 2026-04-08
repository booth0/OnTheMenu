# OnTheMenu — Architecture Decision Record

**Decision Title:** Use server-side cookie authentication for recipe mutations and engagement actions
**Status:** Accepted
**Date:** 2026-03-24

---

## 1. Context

The project needed a reliable way to identify the logged-in user for recipe creation, editing, likes, saves, and reviews. Earlier client-driven checks were sufficient for UI gating but were not a safe source of truth for ownership or mutation data. This became urgent when mutation payloads carried invalid identity information and caused recipe creation issues. The main constraints were secure user association, compatibility with Next.js App Router route handlers, and minimal friction for client-side page behavior.

---

## 2. Decision

We will use **server-side JWT cookie authentication** as the identity mechanism for recipe mutations and engagement features in OnTheMenu.

---

## 3. Rationale (Data-Based)

- **Metric A:** The auth design uses `2` cookies: an httpOnly `token` cookie and a client-visible `loggedIn` cookie.
- **Metric B:** Protected interaction routes return `401` when no authenticated user is present.
- **Metric C:** A client-side identity error produced `1` malformed `authorId` value (`true`), which showed the mutation path could not trust browser-supplied identity data.

---

## 4. Consequences and Risks

This keeps user identity on the server for all writes and removes the need to trust client-supplied ownership fields. It also preserves a lightweight way for the UI to show or hide actions using the `loggedIn` cookie. The trade-off is that route handlers must consistently enforce auth and the client must gracefully handle expired or missing cookies.

- Risk: UI state can imply a user is logged in when the server rejects the request. → Mitigation: treat the `loggedIn` cookie as a UI hint only and enforce all writes with server-side auth checks.
- Risk: Different routes may drift in how they enforce authentication. → Mitigation: centralize identity resolution with `getAuthUser()` and reuse it across mutation handlers.
- Risk: Expired cookies can interrupt user actions such as saving or reviewing. → Mitigation: return `401` consistently and redirect users back to login from the recipe UI.

---

## 5. Alternatives Considered

The runner-up was **client-side session-driven identity in mutation payloads**. It was close because it reduced server implementation work and matched the initial page-level gating approach. It was not chosen because it already produced invalid identity data during recipe creation and did not provide a trustworthy authorization boundary for writes.
