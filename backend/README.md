# AnMind Backend

## Overview

This service is the NestJS backend targeted for Azure Container Apps deployment.
It exposes:

- `GET /` for basic service metadata
- `GET /health` for smoke tests and deployment readiness

The health endpoint is designed to evolve into a database-aware readiness check for CI/CD and post-deploy validation.

## Required Environment Variables

```env
PORT=8080
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/anmind?sslmode=require
JWT_SECRET=<jwt-secret>
AGORA_APP_ID=<agora-app-id>
AGORA_APP_CERTIFICATE=<agora-app-certificate>
```

## Install Dependencies

```bash
npm install
```

## Local Development

```bash
npm run start:dev
```

The backend defaults to port `8080` when `PORT` is not set.

## Local Production Run

```bash
npm run build
npm run start:prod
```

## Tests

```bash
npm test -- --ci
npm run test:e2e
npm run test:cov
```

Note: in restricted sandboxes, the e2e suite may require elevated execution because `supertest` binds a local listener during test execution.

## Docker Build

```bash
docker build -f backend/Dockerfile backend -t backend-anmind:test
docker run --rm -p 8080:8080 --env PORT=8080 backend-anmind:test
```

## Deployment Notes

- Azure Container App target: `ca-anmind-dev`
- Azure resource group: `rg-anmind-dev`
- ACR registry name: `anmind`
- PostgreSQL host: `flixzone-pg.postgres.database.azure.com`
