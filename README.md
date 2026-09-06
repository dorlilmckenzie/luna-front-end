# Period Tracker — Frontend

A standalone **Next.js (App Router) + TypeScript** web client for the Period Tracker
application. It is a pure API consumer: it never touches PostgreSQL or Prisma and talks
only to the backend REST API over HTTP.

Design goals: calm, modern, mobile-first, accessible. Soft neutral background, gentle rose
and plum accents, rounded cards, large touch targets, bottom navigation on small screens.

---

## Requirements

- Node.js 18+ (20 LTS recommended)
- npm
- A running instance of **period-tracker-backend** (see its README)

## Installation

```bash
cd period-tracker-frontend
npm install
cp .env.example .env.local
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend REST API, e.g. `http://localhost:5000/api` |

The API URL is **never hardcoded** — every request goes through `src/services/api.ts`,
which reads `NEXT_PUBLIC_API_URL` via `src/lib/config.ts`.

## Running locally

```bash
npm run dev      # http://localhost:3000
```

The backend must be running (default `http://localhost:5000/api`) and its `FRONTEND_URL`
must match this app's origin so CORS and the refresh-token cookie work.

## Building for production

```bash
npm run build
npm start
```

## Running tests

```bash
npm test
```

Jest + React Testing Library. Covered flows: form validation schemas, API error mapping,
login (validation, success redirect, error message), signup (password-mismatch guard,
successful registration), the dashboard (loading / empty / populated states), the period
form (validation + normalised payload) and the calendar (month navigation, day selection).

---

## Backend API dependency

This app cannot function without the backend. It expects:

- `POST /auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`,
  `/auth/forgot-password`, `/auth/reset-password`, `GET /auth/me`
- `GET/PATCH/DELETE /users/me`, `PATCH /users/me/password`
- `GET/POST /periods`, `GET/PATCH/DELETE /periods/:id`
- `GET/POST /symptoms`, `PATCH/DELETE /symptoms/:id`
- `GET/POST /moods`, `PATCH/DELETE /moods/:id`
- `GET /cycles`, `/cycles/statistics`, `/cycles/summary`
- `GET /predictions`, `/predictions/calendar`
- `GET/PATCH /reminders`

All responses use the envelope `{ success, data, message }`.

---

## Architecture & decisions

```
src/
├── app/
│   ├── page.tsx              landing page (public)
│   ├── privacy/              privacy notice (public)
│   ├── (auth)/               login, signup, forgot-password, reset-password
│   └── (app)/                authenticated shell + dashboard, calendar, history,
│                             statistics, settings
├── components/
│   ├── ui/                   design system: Button, Input, Select, Textarea, Card,
│   │                         Badge, Modal, Alert, Toast, Spinner, EmptyState
│   ├── forms/                PeriodForm, SymptomForm, MoodForm (RHF + zod)
│   ├── layout/               Sidebar, BottomNav, AppHeader, PageHeading
│   ├── calendar/             MonthCalendar
│   ├── QueryState.tsx        shared loading / error / empty wrapper
│   ├── QuickLog.tsx          quick-action modals for logging
│   └── Providers.tsx         React Query + Auth + Toast providers
├── hooks/                    useAuth (context) + TanStack Query hooks per resource
├── services/                 the API layer — api.ts + one module per resource
├── lib/                      config (API URL), zod validators, query keys
├── types/                    shared API types
└── utils/                    date/label formatting helpers
```

- **State management.** Server state is TanStack Query (loading/error/empty states,
  cache invalidation after mutations, no manual refetch plumbing). UI state is local
  React state. Auth state is a small React context.
- **Auth storage.** The access token lives **in memory only** (React state + a module
  variable in `api.ts`) — not in `localStorage`. The refresh token is an `httpOnly`
  cookie set by the backend. On load, the app calls `POST /auth/refresh` to restore the
  session; on a `401` the axios interceptor refreshes once and retries, and on failure
  the user is redirected to `/login`.
- **API layer.** Components never call `axios`/`fetch` directly — they call typed
  service functions, which call the shared `api` instance.
- **Validation.** Every form validates client-side with zod + React Hook Form for instant
  feedback; the backend re-validates independently. Field-level backend errors are mapped
  back onto the matching form fields.
- **Error handling.** `toFriendlyMessage()` converts axios errors into human sentences
  ("Your email or password is incorrect." / "Something went wrong. Please try again.").
- **Predictions** are always fetched from the backend and shown with a confidence level
  and a persistent "estimates, not medical advice, not contraception" disclaimer.
- **Responsiveness.** Bottom navigation under `md`, sidebar from `md` up. Layouts use
  flex/grid and relative units; wide content scrolls within its own container.
- **Config file.** Next.js 14 does not support a TypeScript `next.config`, so the config
  lives in `next.config.mjs` (still ESM/typed via a JSDoc annotation). Everything else in
  `src/` is TypeScript.
