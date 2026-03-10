git**OnTheMenu — Project Specification**

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
- **Registered User (Creator):** Create/edit recipes; set visibility (private/public); save to recipe books; follow others; flag content; like and review recipes; upload images for recipes and reviews.
- **Moderator:** Review flagged content, take moderation actions (dismiss, remove, suspend), moderate reviews and images.
- **Admin:** Manage moderator access and policies; assign/revoke moderators; configure moderation queues/policies; view/export moderation audit logs; full moderation-level access.
- **System:** Recommender, trending calculator, search indexer.

**High-level Features**
- **Recipe CRUD**: Create, Read, Update, Delete recipes with fields: title, description, ingredients (list with quantities), steps, prep/cook time, servings, tags, images (one or more), source/credits, visibility (private|public), author, created/updated timestamps.
- **Visibility controls:** Recipe owner sets `visibility` = private or public. Private recipes accessible only to owner and explicit collaborators (future feature). Newly created recipes are `private` by default.
- **Trending page:** Shows recipes ranked by a time-weighted score combining views, saves, likes, and reviews/comments (configurable weighting and time-decay). Default timeframe: last 7 days.
- **Search page:** Full-text search over title, ingredients, tags, and author; filters for visibility (public only for guests), tags, cook time, difficulty, and sort options (relevance, newest, trending).
- **Recipe Books:** Users can create named recipe books (collections) and add saved recipes; books can be private or public.
- **Likes & Reviews:** Registered users can like/unlike recipes (one active like per user per recipe) and submit reviews with a numeric rating (1–5), optional text, and optional images. Reviews appear on recipe pages and feed into recommendation/trending signals; reviews are subject to moderation.
- **Moderation:** Community flagging surfaces items to a manual moderator review queue. Moderators take actions (dismiss/remove/suspend) with audit logs. Admins manage moderator assignments and moderation configurations.
- **Related / Recommended Recipes component:** Surface related recipes based on tag overlap, ingredient similarity, and collaborative signals (saves, likes, reviews); component is reusable and embeddable.

**Optional / Future Features**
- **Shopping lists:** Convert recipe ingredients into shopping lists; combine multiple recipes into one list.
- **Similar-ingredient recipes:** Find recipes using the same subset of ingredients.
- **What's in my fridge recommendations:** User supplies inventory; system suggests recipes matching available ingredients.

**User Scenarios & Acceptance Tests**
- **Create recipe (Registered User):** Authenticated user submits a recipe form (including optional images); recipe appears in their profile. Default visibility: `private` until owner publishes it.
- **Private recipe visibility:** Private recipes return 404/forbidden to unauthorized users.
- **Save to recipe book:** User saves a public recipe to a recipe book; recipe appears in the user's collection.
- **Like a recipe:** Registered user likes a recipe; like count increments and user cannot like again until they unlike.
- **Review a recipe:** Registered user submits a review with rating/text/images; review is stored, displayed (when published), and included in trending/recommendation signals; moderators may hide/remove reviews.
- **Flagging & moderation:** Community flags surface items for manual moderator review; moderators record actions and an audit trail.
- **Related recipes present:** Recipe page shows at least 3 related recommendations.

**Functional Requirements (Testable)**
- FR-01: Recipe entities must support `visibility` with values `public` and `private` and enforce access control.
- FR-02: Only public recipes are returned to unauthenticated search queries and trending calculations.
- FR-03: Trending endpoint returns a ranked list where scores include views, saves, likes, and reviews/comments with configurable weighting and time-decay.
- FR-04: Search endpoint returns results ranked by relevance and supports filters: tags, cook time range, difficulty, author.
- FR-05: Users can create named recipe books and add/remove recipes; books have `visibility` similar to recipes.
- FR-06: Moderation queue exposes flagged items to moderators with metadata and allows actions with audit logging; moderation is manual.
- FR-07: Related/Recommended component must return at least 3 recommendations and fall back to tag-based recommendations if collaborative signals are insufficient.
- FR-08: Admin users can assign/revoke moderator roles, configure moderation queues/policies, and view/export moderation audit logs; admin actions are audited.
- FR-09: Registered users can like/unlike recipes; system enforces one active like per user per recipe and records timestamps.
- FR-10: Registered users can submit reviews with rating (1–5), optional text, and optional images; reviews are storable, displayed, and subject to moderation/removal.

**Key Entities / Data Model (high-level)**
- `User` {id, username, display_name, email, bio, avatar, role}
- `Recipe` {id, author_id, title, description, ingredients[], steps[], images[], tags[], visibility, prep_time, cook_time, servings, timestamps}
- `RecipeBook` {id, owner_id, name, description, visibility, recipe_ids[]}
- `Flag` {id, recipe_id, reporter_id, reason, status, moderator_id, action, timestamps}
- `Review` {id, recipe_id, author_id, rating:int(1-5), body:text, images:[], status (published|pending|removed), created_at, updated_at}
- `Like` {id, recipe_id, user_id, created_at}
- `Recommendation` (logical) produced by recommender service
- `TrendingScore` (logical) produced by aggregator

**Non-functional Requirements**
- **Performance:** Page load target LCP < 2.5s on 75% of cold mobile 4G loads; API 95th percentile < 500ms for common endpoints.
- **Scalability:** System must handle bursts to trending pages; recommendation calculations may be asynchronous and cached.
- **Security & Privacy:** Private recipes only accessible by owner; PII protected per law; image uploads scanned/validated and subject to moderation.
- **Accessibility:** Public pages meet WCAG AA baseline for primary flows.
- **Observability:** Monitor trending, search, and recommendation pipelines; log business metrics (recipes created, saves, likes, reviews, flags).

**UX / UI Guidelines**
- Follow the color palette: background `#FEFAED`, surfaces `#F1CCB7`, accents `#C39259`, highlights `#FFB5C0`, and supportive `#597A9C`.
- Display recipe hero image(s) prominently; show rating summary (avg rating, count), like button, and review list; surface Related/Recommended component below the recipe content.

**Assumptions**
- Team uses React/Next.js and Supabase/Postgres (separate ADRs). Trending/recommendation algorithm specifics and numeric thresholds will be defined in follow-up design docs.

**Decisions / Resolutions**
1. Default recipe visibility: `private` by default.
2. Moderation model: manual moderator review with community flagging; admins manage moderator access and policies.
3. Trending signals: include views, saves, likes, and reviews/comments with time-decay and configurable weighting.

**Next steps**
- Break spec into epics and user stories; define API contracts and data schemas in follow-up docs.
