# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AnMind is a mental wellness/mindfulness application consisting of two independent workspaces:
- **`backend/`** — NestJS REST API (Node.js + TypeScript)
- **`mobile/`** — Expo React Native app (iOS, Android, Web)

Dependencies must be installed and commands run from within each workspace directory.

## Commands

### Backend (`cd backend`)

```bash
npm run start:dev      # Dev server with hot reload
npm run build          # Compile TypeScript to dist/
npm run start:prod     # Run compiled production build
npm run lint           # ESLint with auto-fix
npm run format         # Prettier formatting
npm test               # Jest unit tests
npm run test:watch     # Jest watch mode
npm run test:cov       # Jest with coverage
npm run test:e2e       # E2E tests
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

## Architecture

### Backend

NestJS application entry at [backend/src/main.ts](backend/src/main.ts). Listens on `PORT` env var (default 3000). Uses standard NestJS module pattern: modules → controllers → services.

Planned features per README: WebSocket support for real-time meditation sessions, Redis caching, mood tracking, habit tracking, and master guidance system.

### Mobile

Expo Router with file-based routing under [mobile/app/](mobile/app/). Current screens: `index.tsx` (landing), `choose-topic.tsx`, `home.tsx`, `modal.tsx`, `_layout.tsx` (root navigation).

Reusable UI lives in [mobile/components/](mobile/components/) with themed variants. Custom hooks in [mobile/hooks/](mobile/hooks/). Theme constants in [mobile/constants/](mobile/constants/).

New React Native Architecture and experimental React Compiler are both enabled.

## CI/CD

GitHub Actions workflow at [.github/workflows/test.yml](.github/workflows/test.yml) triggers on pushes to `develop` branch. Runs tests for both backend and mobile, then uploads coverage to SonarCloud.

- Development branch: `develop`
- Production branch: `main`

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | NestJS 11, Node.js 20 |
| Backend language | TypeScript (ES2023, strict) |
| Mobile framework | Expo 54, React Native 0.81 |
| Mobile routing | Expo Router (file-based) |
| Testing | Jest (both workspaces) |
| Linting | ESLint + TypeScript plugin |
| Formatting | Prettier |
| CI/CD | GitHub Actions + SonarCloud |
| Mobile builds | Expo EAS |
