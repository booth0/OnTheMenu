---
description: Generate a new Architecture Decision Record (ADR) in the OnTheMenu format using project-specific context and scorecard metrics supplied in user input.
---

## User Input

``` text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).
If critical details are missing, make reasonable assumptions **only when
clearly implied** by the input; otherwise, output a short "Missing
Inputs" section and a ready-to-fill ADR draft using placeholders.

## Goal

Create a complete ADR following the **OnTheMenu --- Architecture
Decision Record** template:

1.  Context\
2.  Decision\
3.  Rationale (Data-Based) --- **exactly 3 concrete metrics**\
4.  Consequences and Risks --- include mitigations\
5.  Alternatives Considered --- explain why the runner-up was not chosen

The output MUST be a single Markdown document suitable to paste into an
`adr-YYYY-MM-DD-<slug>.md` file.

## Operating Constraints

**NON-DESTRUCTIVE OUTPUT ONLY**: Do not modify any repository files. Do
not reference tools or claim you ran benchmarks unless the user input
explicitly provides results.

**Truthfulness**:\
- Only cite metrics that appear in user input.\
- If the user provides qualitative scores (e.g., "Docs: 5/5"), treat
those as metrics.\
- If metrics are missing, do **not** invent them---use placeholders like
`[METRIC_NEEDED: ...]`.

**Template Fidelity**: Keep headings and section order exactly as the
OnTheMenu template. Use concise, decision-focused writing.

## Execution Steps

### 1. Parse User Input Into a Decision Packet

Extract (if present):

-   **Decision Title**
-   **Status** (Proposed/Accepted)
-   **Date** (YYYY-MM-DD; if absent, use today's date if not specified)
-   **Problem/constraints** driving the decision
-   **Candidates considered** (at least 2 options: winner + runner-up)
-   **Chosen option**
-   **Scorecard/metrics** (numbers, percentages, ratings, timings,
    bundle sizes, etc.)
-   **Key trade-offs** and risks mentioned
-   **Mitigations** mentioned or implied

If any of these are absent, list them under **Missing Inputs** (short,
bullet list).

### 2. Draft Section 1: Context

Write 3--6 sentences describing:

-   What needed to be decided and why now
-   Constraints (team skills, deadlines, hosting, scalability, security,
    performance, maintainability)
-   What evaluation method was used (bakeoff, spike, prototype, PoC,
    comparison matrix) **only if stated**

Avoid generic filler like "we want the best stack"; be specific to the
provided problem.

### 3. Draft Section 2: Decision

Write **one sentence**:

"We will use **X** as **Y** for **Z**."

Example structure: - "We will use PostgreSQL as the primary relational
datastore for the OnTheMenu backend."

### 4. Draft Section 3: Rationale (Data-Based)

Include **exactly 3 bullet metrics**:

-   Use **specific** numbers, scores, or deltas.
-   Prefer comparative phrasing (winner vs runner-up) if available.
-   If only qualitative metrics exist, phrase as scored criteria (e.g.,
    "Docs: 5/5 vs 3/5").

If fewer than 3 metrics are provided, include placeholders:

-   **Metric B:** `[METRIC_NEEDED: ...]`

### 5. Draft Section 4: Consequences and Risks

Provide:

-   2--5 consequences (trade-offs) as bullets or a short paragraph
-   1--3 risks with **mitigation** each (explicit "Risk → Mitigation")

Do not claim mitigations are already implemented unless stated.

### 6. Draft Section 5: Alternatives Considered

Name the runner-up and explain (2--4 sentences):

-   Why it was close (if true per input)
-   The 1--2 key reasons it lost (tie directly to metrics or
    constraints)
-   Avoid dunking; keep it factual

If runner-up is not provided, use:
`[ALTERNATIVE_NEEDED: name the 2nd place option]`

### 7. Output Rules

-   Output a single Markdown ADR document.
-   Use the exact template structure and separators.
-   Do not include analysis, internal reasoning, or extra sections
    **except** an optional **Missing Inputs** block at the very top when
    necessary.

## Output Template (MUST FOLLOW)

If inputs are sufficient, output only the ADR below. If not sufficient,
prepend a short **Missing Inputs** list, then still output the ADR with
placeholders.

------------------------------------------------------------------------

# OnTheMenu --- Architecture Decision Record

**Decision Title:** ... **Status:** ... **Date:** ...

------------------------------------------------------------------------

## 1. Context

...

------------------------------------------------------------------------

## 2. Decision

...

------------------------------------------------------------------------

## 3. Rationale (Data-Based)

-   **Metric A:** ...
-   **Metric B:** ...
-   **Metric C:** ...

------------------------------------------------------------------------

## 4. Consequences and Risks

...

------------------------------------------------------------------------

## 5. Alternatives Considered

...

## Context

\$ARGUMENTS
