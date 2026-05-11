# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AnMind is a mobile meditation app — a lightweight stress-reset utility. Users open the app, rate their mood (1–5), complete a 3–10 minute guided breathing session, rate their mood again, and see the improvement. Two independent workspaces:

- **`backend/`** — NestJS REST API (Node.js + TypeScript + Prisma + PostgreSQL)
- **`mobile/`** — Expo React Native app (iOS, Android, Web)

Install dependencies and run commands from within each workspace directory.

## Commands

### Backend (`cd backend`)

```bash
npm run start:dev         # Dev server with hot reload
npm run build             # Compile TypeScript to dist/
npm run start:prod        # Run compiled production build
npm run lint              # ESLint with auto-fix
npm run format            # Prettier formatting
npm test                  # Jest unit tests
npm run test:watch        # Jest watch mode
npm run test:cov          # Jest with coverage
npm run test:e2e          # E2E tests

# Prisma
npx prisma migrate dev    # Apply migrations (dev)
npx prisma migrate deploy # Apply migrations (prod)
npx prisma generate       # Regenerate client after schema change
npx prisma studio         # GUI database browser
```

### Mobile (`cd mobile`)

```bash
npm start              # Expo dev server (choose platform interactively)
npm run android        # Android emulator
npm run ios            # iOS simulator
npm run web            # Web browser
npm run lint           # ESLint
npm test               # Jest unit tests
npm run test:watch     # Jest watch mode
```

## Environment Variables

### Backend (`backend/.env`)

```
PORT=8080
DATABASE_URL="postgresql://user:password@localhost:5432/anmind?schema=public"
JWT_SECRET=your_jwt_secret_here
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
```

### Mobile (`mobile/.env.local`)

Sentry DSN and auth token only. Backend API base URL is not yet wired up.

## Architecture

### Backend

Entry: [backend/src/main.ts](backend/src/main.ts). Standard NestJS module pattern — each feature is a self-contained module with controller, service, and DTOs.

**Feature modules in `backend/src/`:**

| Module | Routes | Notes |
|---|---|---|
| `auth` | `POST /auth/signup`, `POST /auth/login` | Returns JWT; bcryptjs password hashing |
| `reset` | `POST /reset` | Submit a completed session (JWT required); validates duration 1–30 min, mood 1–5 |
| `history` | `GET /history` | User's past reset sessions (JWT required) |
| `analytics` | `GET /analytics/summary`, `GET /analytics/trend` | Mood improvement stats (JWT required) |
| `sync` | `POST /sync` | Batch upload of offline-queued sessions (JWT required) |
| `meditation` | `GET /meditation-sessions`, `POST /meditation-sessions/:id/join` | Community sessions; Agora integration pending |

**Cross-cutting (`backend/src/common/`):**
- `jwt-auth.guard.ts` / `jwt.strategy.ts` — Passport JWT guard applied to protected routes
- `global-exception.filter.ts` — Standardized error response shape
- `logging.interceptor.ts` — Request/response logging

**ORM:** Prisma with schema at [backend/prisma/schema.prisma](backend/prisma/schema.prisma). Client generated to `backend/src/generated/prisma`. All IDs are UUID. `ResetSession` carries an `externalId` field for offline-generated records.

**Database:** [database/init.sql](database/init.sql) has the raw schema (5 tables: `user`, `reset_session`, `mood_entry`, `meditation_session`, `user_meditation_session`). [database/seed.sql](database/seed.sql) has sample data. Prisma is the canonical source for migrations in development.

Swagger UI available at `/api-docs` when the server is running.

### Mobile

Expo Router with file-based routing under [mobile/app/](mobile/app/). New React Native Architecture and experimental React Compiler are both enabled. Reanimated 4.1 used for animations.

**Screens (current):**

| File | Screen | Status |
|---|---|---|
| `index.tsx` | Welcome / landing | Done |
| `choose-topic.tsx` | Topic picker (6 cards) | Done (hardcoded topics) |
| `home.tsx` | Main dashboard | Skeleton — tabs not functional |
| `modal.tsx` | Modal placeholder | Stub |

**Screens (planned — not yet built):**
- Mood selector (pre/post session, 1–5 scale)
- Breathing animation + haptic feedback session timer
- Session results / improvement view
- Progress dashboard with mood trend charts
- Meditation Station (community sessions with Agora video)
- Authentication screens (login / sign up)
- Settings / local reminder scheduler

Reusable UI lives in [mobile/components/](mobile/components/). Theme constants in [mobile/constants/theme.ts](mobile/constants/theme.ts). Custom hooks in [mobile/hooks/](mobile/hooks/) (color scheme, theme color).

**The mobile app has no API integration yet.** Backend calls, offline SQLite/AsyncStorage queue, and sync logic all need to be built.

## Business Rules (enforced in code)

- Session duration: 1–30 minutes (DTO validation; README says 3–10 min UX guideline)
- Mood scores: 1–5 (both `scoreBefore` and `scoreAfter` on `MoodEntry`)
- Improvement = `scoreAfter - scoreBefore`
- Each `ResetSession` has exactly one `MoodEntry` (unique constraint)
- `userId` is nullable on `ResetSession` to support offline (pre-auth) records
- `externalId` on `ResetSession` is the client-generated UUID used for deduplication during sync
- JWT required on all endpoints except `/auth/signup` and `/auth/login`
- Reminders are local-only (device notifications, no backend involvement)

## CI/CD

GitHub Actions at [.github/workflows/test.yml](.github/workflows/test.yml) triggers on pushes to `develop` branch. Runs tests for both workspaces, then uploads coverage to SonarCloud.

- Development branch: `develop`
- Production branch: `main`
- Mobile builds: Expo EAS

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | NestJS 11, Node.js 20 |
| ORM | Prisma 7.8 |
| Database | PostgreSQL |
| Auth | Passport JWT + bcryptjs |
| Mobile framework | Expo 54, React Native 0.81 |
| Mobile routing | Expo Router 6 (file-based) |
| Animations | React Native Reanimated 4.1 |
| Error tracking | Sentry (mobile) |
| Real-time (planned) | Agora (community meditation sessions) |
| Testing | Jest (both workspaces), 80% coverage target |
| CI/CD | GitHub Actions + SonarCloud + Expo EAS |
