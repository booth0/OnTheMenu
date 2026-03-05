# climbersDen Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-15

## Active Technologies
- TypeScript 5.0+ fullstack with React Router v7 (001-climber-social-app)
- React 18+, Prisma ORM, Tailwind CSS, Radix UI (001-climber-social-app)
- PostgreSQL 15+, Cloudinary (images/videos + CDN), IndexedDB (001-climber-social-app)
- Socket.IO (real-time), Workbox (PWA), Dexie.js (offline storage) (001-climber-social-app)
- Vitest, Playwright, React Testing Library, MSW (testing) (001-climber-social-app)
- TypeScript 5.x, Node.js 18+ (LTS recommended) + SvelteKit, @sveltejs/adapter-node, svelte-preprocess, Tailwind CSS, Prisma (existing), Cloudinary SDK, Mapbox SDK, Socket.IO-client (or existing realtime client), Vitest, Playwright (001-climber-social-app)
- PostgreSQL via Prisma (unchanged) (001-climber-social-app)

## Project Structure

```text
app/                    # React Router v7 app directory (fullstack)
├── routes/             # File-based routing with loaders/actions
│   ├── _index.tsx
│   ├── auth.*.tsx     # Auth routes
│   ├── posts.*.tsx    # Posts & feed
│   ├── messages.*.tsx # Messaging
│   ├── crags.*.tsx    # Crags & weather
│   ├── ticks.*.tsx    # Route tracking
│   ├── journals.*.tsx # Journals
│   ├── gear.*.tsx     # Gear lists
│   └── api.*.ts       # Resource routes
│
├── lib/                # Server-side business logic
│   ├── auth.server.ts
│   ├── db.server.ts   # Prisma client
│   ├── cloudinary.server.ts
│   └── realtime.server.ts  # Socket.IO
│
├── components/         # React components (Radix UI + Tailwind)
├── hooks/              # Custom React hooks
├── types/              # TypeScript types
└── entry.*.tsx         # Remix entry points

prisma/
├── schema.prisma       # Database schema (18 entities)
└── migrations/

tests/
├── routes/             # Loader/action tests
├── lib/                # Business logic tests
├── components/         # RTL component tests
└── e2e/                # Playwright E2E tests
```

## Commands

```bash
# Development
npm run dev              # Start React Router v7 dev server with HMR
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run all tests
npm run test:unit        # Vitest unit tests
npm run test:e2e         # Playwright E2E tests
npm run test:coverage    # Coverage report

# Linting & Formatting
npm run lint             # ESLint + TypeScript check
npm run typecheck        # TypeScript compilation
npm run format           # Prettier formatting

# Database
npx prisma migrate dev   # Run migrations
npx prisma studio        # Database GUI
npm run db:seed          # Seed sample data
```

## Code Style

TypeScript 5.0+ with React Router v7:
- Use React Router loaders for data fetching (server-side)
- Use React Router actions for mutations (POST/PATCH/DELETE)
- Export types from loaders: `export type LoaderData = typeof loader`
- Use `useFetcher` for optimistic UI updates
- Progressive enhancement - forms work without JS
- ESLint + TypeScript + React + React Router + a11y plugins
- Format with Prettier
- Max cyclomatic complexity: 10
- Route-based file organization
- WCAG 2.1 AA accessibility
- Mobile-first responsive design (Tailwind)
- 80% minimum test coverage

## Authentication

- Session-based auth with React Router v7 encrypted cookies
- No JWTs - use `getSession()` in loaders/actions
- Bcrypt password hashing
- HttpOnly cookies prevent XSS

## Media Upload

- Cloudinary for all images/videos
- Direct upload from browser with signed URLs
- Store `public_id` in database, not full URLs
- On-the-fly transformations (resize, crop, format)
- Use upload presets: `profile_photos`, `post_media`, `journal_media`

## Real-time

- Socket.IO for messaging and gear list updates
- Session cookie authentication (no token needed)
- Rooms for conversations and gear lists
- Events: `message:new`, `gear:claimed`, `notification:new`

## Recent Changes
- 001-climber-social-app: Added TypeScript 5.x, Node.js 18+ (LTS recommended) + SvelteKit, @sveltejs/adapter-node, svelte-preprocess, Tailwind CSS, Prisma (existing), Cloudinary SDK, Mapbox SDK, Socket.IO-client (or existing realtime client), Vitest, Playwright
- 001-climber-social-app: Initial feature - React Router v7 fullstack framework with Cloudinary media storage

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
