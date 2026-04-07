# OnTheMenu — Architecture Decision Record

**Decision Title:** Use Prisma 7 configuration via prisma.config.ts and the Supabase session pooler for schema operations
**Status:** Accepted
**Date:** 2026-03-31

---

## 1. Context

The project needed a stable database configuration after recipe creation began failing due to schema drift and missing columns. At the same time, Prisma 7 changed where connection settings must be declared, so the previous datasource-only approach no longer matched the installed version. The team also hit a limitation where not every Supabase connection path supported schema-changing operations. The main constraints were Prisma 7 compatibility, working schema deployment, and the user's network limitations around direct database access.

---

## 2. Decision

We will use **Prisma 7 configured through `prisma.config.ts`** and the **Supabase session pooler on port 5432** for OnTheMenu schema-management workflows.

---

## 3. Rationale (Data-Based)

- **Metric A:** The working Supabase pooler path for schema operations was port `5432`.
- **Metric B:** The non-working transaction pooler path was port `6543` for the required schema-change flow.
- **Metric C:** The project is using Prisma major version `7`, which required moving `url` and `directUrl` configuration into `prisma.config.ts`.

---

## 4. Consequences and Risks

This gives the team one known-good path for schema pushes and aligns the configuration with the installed Prisma version. It also reduces future confusion about where database connection settings belong. The trade-off is that developers need to distinguish between operational database access and schema-management access, especially when multiple Supabase connection styles exist.

- Risk: Developers may reuse the wrong connection string for migrations or schema pushes. → Mitigation: document port `5432` as the schema-management path and avoid using `6543` for DDL workflows.
- Risk: Prisma version changes may alter setup expectations again. → Mitigation: keep Prisma-specific connection configuration centralized in `prisma.config.ts`.
- Risk: Environment-specific connectivity can still vary. → Mitigation: default to the session pooler path that is already proven to work in this project.

---

## 5. Alternatives Considered

The runner-up was **using the Supabase transaction pooler on port 6543 for all Prisma access**. It was close because a single connection pattern is easier to explain and maintain. It was not chosen because it failed the schema-change requirement, while the session pooler on `5432` supported the `db push` workflow that unblocked recipe creation.
