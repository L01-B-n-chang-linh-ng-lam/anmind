# AnMind

> A mobile meditation application that helps users quickly reduce stress, regain focus, and build sustainable mental wellness habits through short guided meditation sessions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

---

## Table of Contents

* [Overview](#overview)
* [Business Problem](#business-problem)
* [Target Users](#target-users)
* [Core Features](#core-features)
* [Business Processes](#business-processes)
* [Business Rules](#business-rules)
* [Technology Stack](#technology-stack)
* [System Architecture](#system-architecture)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [API Overview](#api-overview)
* [Database Overview](#database-overview)
* [Implementation Notes](#implementation-notes)
* [Testing Requirements](#testing-requirements)
* [Deployment](#deployment)

---

## Overview

AnMind is a mobile application designed to help users stabilize their mental state when they feel stressed, anxious, or distracted.

The application focuses on one core objective:

> Help a user move from feeling overwhelmed to feeling calmer within a few minutes.

Unlike traditional meditation platforms that emphasize large content libraries, AnMind is designed as a lightweight utility. Users can open the application, complete a guided breathing session lasting 3 to 10 minutes, and immediately see how their mood changes.

---

## Business Problem

Many people experience short periods of stress throughout the day, such as:

* Before an exam.
* During work deadlines.
* Before a presentation.
* When struggling to focus.
* Before going to sleep.

Existing meditation applications often require:

* Searching through extensive content libraries.
* Completing long onboarding flows.
* Committing to lengthy sessions.

This creates unnecessary friction when users need immediate support.

AnMind addresses this problem by providing a simple and structured reset process that can be completed in a few minutes.

---

## Target Users

* University students.
* Office workers.
* Software engineers.
* Individuals experiencing occasional stress.

---

# Core Features

## 1. Reset System

The Reset System is the primary feature of the application.

It guides users through a short meditation session and measures mood improvement.

### How Users Use This Feature

1. Open the application.
2. Tap **Reset Now**.
3. Select a mood score from 1 to 5.
4. Follow the breathing animation and haptic feedback.
5. Complete the session (3–10 minutes).
6. Select a mood score again.
7. View the improvement.
8. Save the session to history.

### Example

* Mood before: 2
* Mood after: 4
* Improvement: +2

---

## 2. Mood Check-In

Users rate their emotional state before and after each Reset session.

### Mood Scale

| Score | Meaning       |
| ----: | ------------- |
|     1 | Very stressed |
|     2 | Stressed      |
|     3 | Neutral       |
|     4 | Calm          |
|     5 | Very calm     |

### Purpose

* Help users reflect on their emotional state.
* Measure the immediate impact of meditation.
* Provide data for analytics.

---

## 3. Progress Dashboard

The dashboard shows how the user has improved over time.

### Information Displayed

* Total number of completed sessions.
* Average mood improvement.
* Current streak.
* Recent session history.
* Mood trends.

### How Users Use This Feature

1. Open the Progress screen.
2. Review charts and metrics.
3. Compare recent sessions.
4. Track long-term consistency.

---

## 4. Meditation Station

Meditation Station allows users to join live community meditation sessions.

### How Users Use This Feature

1. Open the Meditation Station screen.
2. View upcoming sessions.
3. Select a session.
4. Tap **Join Session**.
5. Enter the Agora video room.
6. Complete the session.

### Information Displayed

* Session title.
* Description.
* Start time.
* Duration.
* Participant count.

---

## 5. Local Reminders

Users can schedule reminders to maintain a meditation habit.

### How Users Use This Feature

1. Open Settings.
2. Configure reminder time.
3. Save the reminder.
4. Receive device notifications.

### Example Reminder Times

* 7:00 AM.
* 1:00 PM.
* 10:00 PM.

---

## 6. Offline-First Synchronization

The application continues to function without internet access.

### Offline Behavior

* Reset sessions can still be completed.
* Data is saved locally.
* Users can review history.

### Online Behavior

* Unsynced data is uploaded automatically.
* Server updates are downloaded.

---

## 7. Authentication

Users can create accounts and log in.

### How Users Use This Feature

#### Sign Up

1. Open the Sign Up screen.
2. Enter username and password.
3. Tap **Create Account**.
4. Local data is merged into the new account.

#### Login

1. Open the Login screen.
2. Enter username and password.
3. Tap **Login**.
4. Receive a JWT token.

---

# Business Processes

## Process 1: Complete a Reset Session

```text
Open App
→ Tap Reset Now
→ Select Mood Before
→ Complete Meditation
→ Select Mood After
→ View Improvement
→ Save Session
```

## Process 2: Sync Local Data

```text
Detect Internet Connection
→ Send Unsynced Records
→ Server Saves Data
→ Server Returns Updates
→ Local Database Updated
```

## Process 3: Join Community Meditation

```text
Open Meditation Station
→ Select Session
→ Join Agora Room
→ Complete Session
→ Participation Recorded
```

## Process 4: Track Progress

```text
Open Progress Screen
→ Load Analytics
→ Display Charts and Metrics
```

---

# Business Rules

## Reset Rules

1. Session duration must be between 3 and 10 minutes.
2. Mood scores must be between 1 and 5.
3. Each Reset session has exactly one mood entry.
4. Improvement is calculated as:

```text
score_after - score_before
```

## Authentication Rules

1. Username must be unique.
2. Username and password are required.
3. JWT is required for protected endpoints.

## Sync Rules

1. Local data must never be lost.
2. Unsynced data is retried automatically.
3. Server returns records newer than `lastSyncedAt`.

## Reminder Rules

1. Reminders are stored locally.
2. Reminders work without internet.

## MVP Rules

1. Passwords are hashed with bcryptjs.
2. JWT tokens expire — clients must handle re-authentication.

---

# Technology Stack

## Mobile Application

* React Native 0.81 / Expo 54
* TypeScript
* Expo Router (file-based routing)
* Expo Notifications
* Expo Haptics
* AsyncStorage / SQLite (planned — offline session queue)
* React Native Reanimated (breathing animations)
* Sentry (crash reporting)

## Backend

* NestJS 11 / Node.js 20
* TypeScript
* Prisma ORM (schema at `backend/prisma/schema.prisma`)
* Passport JWT + bcryptjs
* Swagger (OpenAPI) — available at `/api-docs`

## Database

* PostgreSQL

## Real-Time Communication

* Agora

## Quality Assurance

* Jest
* SonarCloud

## DevOps

* GitHub Actions
* Expo Application Services (EAS)

---

# System Architecture

```text
React Native Mobile App
          ↓
       REST API
        (NestJS)
          ↓
       Prisma ORM
          ↓
      PostgreSQL
          ↓
  External Services
       (Agora)
```

---

# Getting Started

## Prerequisites

* Node.js 20
* PostgreSQL (local or remote)
* [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Backend Setup

```bash
cd backend
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET, Agora keys
npm install
npx prisma migrate dev        # create tables and generate Prisma client
npm run start:dev             # http://localhost:8080
```

## Mobile Setup

```bash
cd mobile
npm install
npm start                     # choose platform from Expo dev menu
```

---

# Project Structure

```text
project-root/
├── mobile/
├── backend/
│   └── prisma/
│       └── schema.prisma
├── database/
│   ├── init.sql
│   └── seed.sql
├── docs/
├── .github/workflows/
└── README.md
```

---

# API Overview

### Authentication

* `POST /auth/signup`
* `POST /auth/login`

### Reset

* `POST /reset`

### History

* `GET /history`

### Analytics

* `GET /analytics/summary`
* `GET /analytics/trend`

### Sync

* `POST /sync`

### Meditation Sessions

* `GET /meditation-sessions`
* `POST /meditation-sessions/{id}/join`

### API Documentation

* `/api-docs`

---

# Database Overview

## Main Tables

* `user`
* `reset_session`
* `mood_entry`
* `meditation_session`
* `user_meditation_session`

## SQL Files

* `database/init.sql`
* `database/seed.sql`

---

# Implementation Notes

## Critical Engineering Rules

1. All IDs must use UUID format.
2. Use TypeScript for both mobile and backend.
3. Follow the OpenAPI schema exactly.
4. Validate all request payloads.
5. Use a standardized error response.
6. Keep the Reset flow as a single API request.
7. Core functionality must work offline.
8. Do not hardcode secrets.
9. Maintain clean modular architecture.
10. Keep the MVP simple.

## Core Product Principle

> A stressed user should be able to open the application and start a meditation session within a few seconds.

---

# Testing Requirements

## Coverage Target

* Minimum 80% code coverage.

## Test Types

* Unit tests.
* Integration tests.
* End-to-end tests.

---

# Deployment

## Mobile

* Build Android APK.
* Publish to Expo.

## Backend

* Deploy to a public cloud environment.

## Database

* Deploy PostgreSQL.

## CI/CD Pipeline

```text
Push to develop
→ Run Tests (backend + mobile)
→ Measure Coverage
→ SonarCloud Analysis
```

## Hosting Requirement

Use a free-tier or low-cost cloud provider suitable for long-term deployment.
