# AGENTS.md

## Project Overview

AnMind is a mental wellness mobile application focused on helping users quickly reset their mental state through guided breathing and minimal interactions.

The goal is to create a calm, immersive, and low-friction experience that enables users to regain control in stressful moments within seconds.

---

## Core Principles

1. **Instant Action First**
   - Users must be able to start a reset within 1–2 seconds
   - Avoid unnecessary steps or friction

2. **Low Cognitive Load**
   - Keep UI minimal and distraction-free
   - Avoid complex layouts or dense information

3. **Calm & Immersive Experience**
   - Use smooth animations and soft transitions
   - Maintain visual consistency (dark, soft glow)

4. **Short, Effective Interactions**
   - Sessions should be quick (1–5 minutes)
   - Prioritize usability in real-life situations

---

## Design Language

### Visual Style
- Dark theme (deep navy / purple gradient)
- Soft glow effects
- Rounded UI elements (16px–24px radius)
- Minimal and clean layout

### Colors
- Primary: Purple (#8B5CF6 range)
- Background: Dark (near black / deep blue)
- Accent: Soft blue / green for calm feedback
- Text:
  - Primary: White
  - Secondary: Gray

---

## Typography

- Font: Inter or system font (SF Pro equivalent)
- Large headings for emphasis
- Clear hierarchy
- Avoid long paragraphs

---

## UX Patterns

### Core Flow (Reset)
- Home → Reset Screen → Start → Session → Complete

### Optional Features
- Mood check (before/after session)
- Progress tracking
- Meditation sessions

### Authentication
- Login is optional
- Only required for syncing data
- Never block primary experience

---

## Landing Page Structure

The landing page MUST include:

1. Hero
2. Problem
3. Insight
4. Solution
5. How It Works
6. Core Experience
7. Key Features

---

## Development Guidelines

### Tech Stack
- React (functional components)
- Tailwind CSS
- Mobile-first responsive design

### Code Style
- Use reusable components
- Keep components small and focused
- Avoid inline styles
- Use semantic HTML

### Layout
- Use Auto Layout principles (flex/grid)
- Max width: ~1200px
- Centered content
- Responsive across breakpoints

---

## Component Guidelines

Create reusable components such as:
- Container
- Section wrapper
- Button
- Feature card
- Step item

---

## Animation Guidelines

- Use subtle animations only
- Avoid fast or aggressive transitions
- Preferred:
  - fade-in
  - soft scale
  - glow pulse

---

## Tone & Content

- Calm
- Minimal
- Encouraging
- Non-judgmental

Avoid:
- Technical jargon
- Long explanations
- Overly promotional language

---

## Do NOT

- Do NOT design like an e-commerce app
- Do NOT add unnecessary features
- Do NOT increase cognitive load
- Do NOT block users with login

---

## Goal

Deliver a clean, modern, and emotionally calming experience that helps users reset quickly and build a healthy mental habit.