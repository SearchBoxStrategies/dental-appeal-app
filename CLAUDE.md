# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SaaS application for dental offices to automate insurance claim appeal letters. Dental staff submit denied claim details; Claude API generates the appeal letter; Stripe handles per-practice subscription billing.

## Commands

```bash
# Backend (from /server)
npm run dev        # ts-node-dev with hot reload on port 3001
npm run build      # tsc → dist/
npm run start      # run compiled build
npm run migrate    # psql $DATABASE_URL -f src/db/migrations/001_initial.sql

# Frontend (from /client)
npm run dev        # Vite dev server on port 5173
npm run build      # tsc + vite build
npm run typecheck  # tsc --noEmit
npm run preview    # preview production build
```

Run both together by opening two terminals: one in `/server`, one in `/client`.

The Vite dev server proxies `/api/*` → `http://localhost:3001`, so no CORS issues in dev.

## Architecture

Two-package structure: `/client` (React + TypeScript + Vite) and `/server` (Node.js + Express + TypeScript).

### Domain model

| Entity | Description |
|--------|-------------|
| **Practice** | A dental office — the paying customer/tenant. All data is scoped by `practice_id`. |
| **User** | Staff member belonging to a practice. Role: `admin` or `staff`. |
| **Claim** | A denied insurance claim submitted by a practice user. |
| **Appeal** | A generated appeal letter tied to a claim. Stores prompt + full letter content for auditability. |

### Data flow

1. User submits claim details (patient info, CDT procedure codes, denial reason)
2. `POST /api/appeals/generate/:claimId` calls `generateAppealLetter()` in `server/src/services/claude.ts`
3. The dental system prompt is cached via `cache_control: ephemeral` + `anthropic-beta: prompt-caching-2024-07-31`
4. Generated letter is stored in `appeals` table alongside the raw prompt
5. Frontend navigates to `/appeals/:id` to display, copy, or print the letter

### Multi-tenancy

Every DB table with user data has a `practice_id` FK. All API routes scope queries to `req.user.practiceId` from the JWT. **Never query claims or appeals without this filter.**

### Authentication

JWT-based. Payload: `{ userId, practiceId, role, practiceName }`. Token stored in `localStorage`. The Axios instance in `client/src/lib/api.ts` injects the Bearer token and redirects to `/login` on 401.

### Stripe integration

- Subscription billing per practice (not per user)
- `POST /api/billing/checkout` — creates or reuses a Stripe Customer, starts a Checkout Session
- `POST /api/billing/portal` — opens the Stripe Billing Portal for plan management
- `POST /api/webhook` — receives Stripe events; updates `practices.subscription_status` in DB
- **Critical:** The webhook route is registered before `express.json()` so it receives the raw body for signature verification
- Appeal generation is gated behind `requireActiveSubscription` middleware (returns 402 if inactive)
- Never trust client-side subscription state — always read from DB (set by webhook)

### Claude API usage

`server/src/services/claude.ts` — uses `claude-sonnet-4-6`. The dental system prompt (CDT code reference + denial strategy guide) is marked `cache_control: ephemeral` to reduce cost on repeated requests. The raw prompt and model name are stored with each appeal for auditability.

### Key files

| Path | Purpose |
|------|---------|
| `server/src/index.ts` | Express entry point, route mounting, webhook raw-body setup |
| `server/src/middleware/auth.ts` | JWT verification, populates `req.user` |
| `server/src/middleware/subscription.ts` | 402 guard for inactive practices |
| `server/src/services/claude.ts` | Appeal letter generation with prompt caching |
| `server/src/routes/webhook.ts` | Stripe webhook → updates subscription_status |
| `server/src/db/migrations/001_initial.sql` | Full DB schema |
| `client/src/context/AuthContext.tsx` | Auth state, login/register/logout, practice subscription status |
| `client/src/lib/api.ts` | Axios instance with JWT interceptor |
| `client/src/pages/ClaimDetail.tsx` | Claim view + "Generate Appeal" trigger |
| `client/src/pages/AppealDetail.tsx` | Letter display with copy/print |
| `client/src/pages/Billing.tsx` | Subscription checkout and portal |

## Environment setup

Copy `.env.example` to `.env` in `/server` and populate:

```
DATABASE_URL          PostgreSQL connection string
JWT_SECRET            Long random string
ANTHROPIC_API_KEY     From console.anthropic.com
STRIPE_SECRET_KEY     From Stripe dashboard (test: sk_test_...)
STRIPE_WEBHOOK_SECRET From `stripe listen` CLI or dashboard webhook endpoint
STRIPE_PRICE_ID       Monthly subscription price ID (price_...)
CLIENT_URL            http://localhost:5173 in dev
```

Copy `.env.example` to `.env` in `/client`:
```
VITE_STRIPE_PUBLISHABLE_KEY   pk_test_... (only needed if adding client-side Stripe Elements)
```

Run the DB migration once after creating the database:
```bash
psql $DATABASE_URL -c "CREATE DATABASE dental_appeals;"
cd server && npm run migrate
```

For local Stripe webhooks: `stripe listen --forward-to localhost:3001/api/webhook`
