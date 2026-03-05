**OnTheMenu — Project Specification**

- **Name:** OnTheMenu
- **Type:** Web application — recipe sharing and discovery
- **Primary goal:** Allow users to create, share, discover, and organize recipes with flexible privacy, social features, and personalized recommendations.

**Key Principles:**
- **Privacy-first:** Recipes may be public or private; owners control sharing.
- **Discoverability:** Trending, search, and recommendations drive discovery.
- **Reusability:** Recipes surface related/recommended recipes as components.
- **Consistency:** UI follows the provided color palette and shared UX patterns.

**Color Palette:** #FEFAED, #F1CCB7, #C39259, #597A9C, #FFB5C0

**Actors**
- **Guest:** Browse public recipes, view trending, search.
- **Registered User (Creator):** Create/edit recipes; set visibility (private/public); save to recipe books; follow others; flag content.
- **Moderator:** Review flagged content, take moderation actions.
- **System:** Recommender, trending calculator, search indexer.

**High-level Features**
- **Recipe CRUD**: Create, Read, Update, Delete recipes with fields: title, description, ingredients (list with quantities), steps, prep/cook time, servings, tags, images, source/credits, visibility (private|public), author, created/updated timestamps.
- **Visibility controls:** Recipe owner sets `visibility` = private or public. Private recipes accessible only to owner and explicit collaborators (future feature).
- **Trending page:** Shows recipes ranked by a time-weighted score (combination of views, saves, likes, comments). Default timeframe: last 7 days.
- **Search page:** Full-text search over title, ingredients, tags, and author; filters for visibility (public only for guests), tags, cook time, difficulty, and sort options (relevance, newest, trending).
- **Recipe Books:** Users can create named recipe books (collections) and add saved recipes; books can be private or public.
- **Moderation:** Flagging flows; moderators can review flagged items and perform actions (dismiss, remove content, suspend user). Audit logs of moderation actions retained.
- **Related / Recommended Recipes component:** On recipe pages, surface related recipes based on tag overlap, ingredient similarity, and collaborative signals (users who saved this also saved...). The component is reusable and embeddable in lists and detail views.

**Optional / Future Features**
- **Shopping lists:** Convert recipe ingredients into shopping lists; combine multiple recipes into one list.
- **Similar-ingredient recipes:** Find recipes using the same subset of ingredients (for pantry optimization).
- **What's in my fridge recommendations:** User supplies inventory; system suggests recipes matching available ingredients.

**User Scenarios & Acceptance Tests**
- **Create recipe (Registered User):** Given the user is authenticated, when they submit a recipe form with required fields, then the recipe appears in their profile and (if public) is searchable and visible on the trending page when criteria met.
- **Private recipe visibility:** Given a recipe marked private, when a guest or other user requests it, then the system returns 404/forbidden.
- **Save to recipe book:** Given a user views a public recipe, when they save it to a named recipe book, then the recipe is added to that book and visible in the user's collections.
- **Flagging & moderation:** Given a user flags a recipe, when a moderator reviews it, then they can mark action (dismiss/remove/suspend) and an audit entry is recorded.
- **Related recipes present:** Given a recipe page loads, then the Related/Recommended component displays at least 3 other recipes based on tag/ingredient overlap or collaborative signals.

**Functional Requirements (Testable)**
- FR-01: Recipe entities must support `visibility` with values `public` and `private` and enforce access control.
- FR-02: Only public recipes are returned to unauthenticated search queries and trending calculations.
- FR-03: Trending endpoint returns a ranked list where scores include at least two signals (views, saves, likes) and respects a configurable timeframe.
- FR-04: Search endpoint returns results ranked by relevance and supports filters: tags, cook time range, difficulty, author.
- FR-05: Users can create named recipe books and add/remove recipes; books have `visibility` similar to recipes.
- FR-06: Moderation queue exposes flagged items to moderators with metadata and allows actions with audit logging.
- FR-07: Related/Recommended component must return at least 3 recommendations, with the ability to fall back to tag-based recommendations if collaborative signals are insufficient.

```markdown
**OnTheMenu — Project Specification**

- **Name:** OnTheMenu
- **Type:** Web application — recipe sharing and discovery
- **Primary goal:** Allow users to create, share, discover, and organize recipes with flexible privacy, social features, and personalized recommendations.

**Key Principles:**
- **Privacy-first:** Recipes may be public or private; owners control sharing.
- **Discoverability:** Trending, search, and recommendations drive discovery.
- **Reusability:** Recipes surface related/recommended recipes as components.
- **Consistency:** UI follows the provided color palette and shared UX patterns.

**Color Palette:** #FEFAED, #F1CCB7, #C39259, #597A9C, #FFB5C0

**Actors**
- **Guest:** Browse public recipes, view trending, search.
- **Registered User (Creator):** Create/edit recipes; set visibility (private/public); save to recipe books; follow others; flag content.
- **Moderator:** Review flagged content, take moderation actions.
- **System:** Recommender, trending calculator, search indexer.

**High-level Features**
- **Recipe CRUD**: Create, Read, Update, Delete recipes with fields: title, description, ingredients (list with quantities), steps, prep/cook time, servings, tags, images, source/credits, visibility (private|public), author, created/updated timestamps.
- **Visibility controls:** Recipe owner sets `visibility` = private or public. Private recipes accessible only to owner and explicit collaborators (future feature). Newly created recipes are `private` by default.
- **Trending page:** Shows recipes ranked by a time-weighted score (combination of views, saves, likes, reviews/comments) with a default timeframe of the last 7 days.
- **Search page:** Full-text search over title, ingredients, tags, and author; filters for visibility (public only for guests), tags, cook time, difficulty, and sort options (relevance, newest, trending).
- **Recipe Books:** Users can create named recipe books (collections) and add saved recipes; books can be private or public.
- **Moderation:** Flagging flows; moderators can review flagged items and perform actions (dismiss, remove content, suspend user). Audit logs of moderation actions retained. Moderation is manual; community flagging surfaces items to the moderator queue.
- **Related / Recommended Recipes component:** On recipe pages, surface related recipes based on tag overlap, ingredient similarity, and collaborative signals (users who saved this also saved...). The component is reusable and embeddable in lists and detail views.

**Optional / Future Features**
- **Shopping lists:** Convert recipe ingredients into shopping lists; combine multiple recipes into one list.
- **Similar-ingredient recipes:** Find recipes using the same subset of ingredients (for pantry optimization).
- **What's in my fridge recommendations:** User supplies inventory; system suggests recipes matching available ingredients.

**User Scenarios & Acceptance Tests**
- **Create recipe (Registered User):** Given the user is authenticated, when they submit a recipe form with required fields, then the recipe appears in their profile. Newly created recipes are `private` by default and only become discoverable after the owner sets them to `public`.
- **Private recipe visibility:** Given a recipe marked private, when a guest or other user requests it, then the system returns 404/forbidden.
- **Save to recipe book:** Given a user views a public recipe, when they save it to a named recipe book, then the recipe is added to that book and visible in the user's collections.
- **Flagging & moderation:** Given a user flags a recipe, when a moderator reviews it, then they can mark action (dismiss/remove/suspend) and an audit entry is recorded.
- **Related recipes present:** Given a recipe page loads, then the Related/Recommended component displays at least 3 other recipes based on tag/ingredient overlap or collaborative signals.

**Functional Requirements (Testable)**
- FR-01: Recipe entities must support `visibility` with values `public` and `private` and enforce access control.
- FR-02: Only public recipes are returned to unauthenticated search queries and trending calculations.
- FR-03: Trending endpoint returns a ranked list where scores include multiple signals (views, saves, likes, reviews/comments) with configurable weighting and respects a configurable timeframe with time-decay.
- FR-04: Search endpoint returns results ranked by relevance and supports filters: tags, cook time range, difficulty, author.
- FR-05: Users can create named recipe books and add/remove recipes; books have `visibility` similar to recipes.
- FR-06: Moderation queue exposes flagged items to moderators with metadata and allows actions with audit logging. Moderation is manual: community flagging surfaces items into a moderator review queue for human decision and action.
- FR-07: Related/Recommended component must return at least 3 recommendations, with the ability to fall back to tag-based recommendations if collaborative signals are insufficient.

**Success Criteria (Measurable)**
- SC-01: New users can create and publish a recipe within 5 minutes of signup.
- SC-02: Trending page shows expected trending items (manual QA) and 90% of top-20 trending results are relevant in weekly spot checks.
- SC-03: Search returns relevant results for 95% of tested queries in a QA set.
- SC-04: Private recipe access control passes 100% of authorization tests in CI.
- SC-05: Related/Recommended component provides at least 3 items for 90% of recipe pages in a sample of 1,000 recipes.

**Key Entities / Data Model (high-level)**
- `User` {id, username, display_name, email, bio, avatar, role}
- `Recipe` {id, author_id, title, description, ingredients[], steps[], images[], tags[], visibility, prep_time, cook_time, servings, timestamps}
- `RecipeBook` {id, owner_id, name, description, visibility, recipe_ids[]}
- `Flag` {id, recipe_id, reporter_id, reason, status, moderator_id, action, timestamps}
- `Recommendation` (logical) produced by recommender service
- `TrendingScore` (logical) produced by aggregator

**Non-functional Requirements**
- **Performance:** Page load times target LCP < 2.5s on 75% of cold loads on mobile 4G; API 95th percentile < 500ms for common endpoints.
- **Scalability:** System must handle bursts of traffic to trending pages; recommendation calculations can be asynchronous and cached.
- **Security & Privacy:** Private recipes only accessible by owner; PII encrypted at rest where required by law; standard auth (email/OAuth) required for content creation.
- **Accessibility:** Public pages must meet WCAG AA baseline for primary flows.
- **Observability:** Monitor trending, search, and recommendation pipelines; log errors and key business metrics (recipes created, saves, flags).

**UX / UI Guidelines**
- Follow the provided color palette for primary and supporting UI elements. Use high-contrast combinations for accessibility. Define component tokens: background `#FEFAED`, surfaces `#F1CCB7`, accents `#C39259` and `#597A9C`, highlights `#FFB5C0`.
- Use consistent card and list components for recipe previews; recipe pages should prioritize hero image, key metadata (time, servings, tags), steps, and Related/Recommended component.

**Assumptions**
- Team prefers React/Next.js stack (handled in separate ADR).
- Supabase/Postgres will be used for primary storage (managed DB); recommendation and trending may rely on additional services or jobs.
- Detailed thresholds and algorithms for trending/recommendations will be defined in separate technical design documents.

**Decisions / Resolutions**
1. Default visibility for newly created recipes: `private` by default.
2. Moderation model: manual moderator review; community flagging will surface items into the moderator queue.
3. Trending signals: include views, saves, likes, and reviews/comments with time-decay and configurable weighting.

**Next steps**
- Confirm remaining details or accept the stated decisions.
- Break spec into epics: Recipe CRUD, Search & Indexing, Trending & Recommendations, Recipe Books, Moderation, Future features.

```

