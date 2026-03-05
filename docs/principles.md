**Principles — Code Quality, Testing, UX Consistency, Performance**

- **Code Quality:** MUST maintain readable, reviewable, and maintainable code. All production code MUST be reviewed via pull requests, follow the project's style rules, and include concise inline rationale for non-obvious decisions. Automation (linters, formatters) MUST run in CI and block merges on new lint errors.

- **Testing Standards:** MUST have automated tests that validate behavior. Unit tests SHOULD cover core business logic (target 70%+ for critical modules), integration tests MUST verify API/database contracts, and end-to-end tests SHOULD cover primary user journeys. CI MUST run tests and prevent regressions; flaky tests MUST be fixed or quarantined with justification.

- **User Experience Consistency:** MUST follow the project UI/UX guidelines and component library. Visual and interaction patterns MUST be reusable and documented; accessibility basics (keyboard navigation, semantic markup, color contrast) MUST be validated for public-facing screens. Design deviations require a short ADR or designer sign‑off.

- **Performance Requirements:** MUST set and enforce measurable performance budgets: initial page load (TTFB/LCP targets), client bundle size limits per route, and API response SLOs (e.g., 95% requests < 500ms). Performance regressions detected in CI or monitoring MUST block releases until triaged.

Notes:
- Specific numeric thresholds and tools (linters, test frameworks, perf budgets) will be captured in follow-up ADRs or README sections.
- These principles are declarative and meant to be enforced via CI, code review, and periodic audits.
