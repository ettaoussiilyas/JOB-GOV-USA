# ADR-0001: Technology Stack & Pinned Baseline Versions

- **Status**: Accepted
- **Date**: 2026-10-17
- **Deciders**: Owner, AI Pair Programmer

## Context

Phase 0 establishes the foundational architecture for the US Federal Jobs Radar ("FedJobs Radar"). To ensure long-term stability, strict reproducibility, zero supply-chain drift, and compliance with free-tier operational constraints (Vercel Hobby, Supabase Free Tier), all core framework, runtime, language, and testing dependencies must be pinned to verified stable versions.

## Decision

We adopt the following stack and pinned dependency versions:

### Core Web Framework & Runtime

- **Next.js (App Router)**: `16.4.2` (React Server Components first, static export/ISR caching, API route handlers).
- **React & React DOM**: `19.3.1` (concurrent rendering, server actions, zero hydration mismatches).
- **TypeScript**: `7.0.2` (strict mode enabled, `noImplicitAny`, strict null checks, path aliases `@/*`).
- **Node.js**: LTS (`v24.13.1` detected in environment).
- **Package Manager**: `pnpm` (`v12.14.0`), pinned with lockfile committed.

### Styling & Design System

- **Tailwind CSS**: `4.3.3` with `@tailwindcss/postcss` (`4.3.3`) and `postcss` (`8.5.30`).
- Tokens implemented as CSS variables in `src/app/globals.css` with semantic color pairs for WCAG 2.2 AA compliance. No third-party UI framework bloat; lightweight accessible primitives and pure CSS/inline SVGs.

### Database & Ingestion

- **Supabase Postgres**: Postgres 17.11 on staging project `rujjqtgvqgmbcpoujflj` (`us-west-2`).
- **Client Libraries**: `@supabase/supabase-js` (`2.118.0`), `@supabase/ssr` (`0.12.7`), `server-only` (`0.0.1`).
- Migrations managed declaratively in `supabase/migrations/` and applied strictly through CLI / MCP migration pipelines.
- Row Level Security (RLS) enabled on all tables by default. Notice regarding `app_meta`: "RLS enabled, no policy" is intentional, as all database operations are executed server-side via the service role key and anon access is strictly denied.

### Validation & Schema

- **Zod**: `4.6.7` for runtime validation of environment variables (`src/lib/env.ts`), HTTP requests, and upcoming Phase 1 USAJOBS API payloads.

### Testing & Quality Gates

- **Unit Testing**: `vitest` (`5.0.5`) with node environment and path alias support.
- **End-to-End Testing**: `@playwright/test` (`1.64.1`) across Desktop Chromium and Mobile Chrome (Pixel 7).
- **Accessibility Testing**: `@axe-core/playwright` (`4.14.0`) integrated into e2e test suites to guarantee zero WCAG 2.2 AA violations on all routes.
- **Linting & Formatting**: `eslint` (`10.13.0`) with `eslint-config-next` (`16.4.2`), `prettier` (`3.9.10`), `husky` (`9.1.7`), and `lint-staged` (`17.6.0`).

### Open Decisions & Baseline Defaults

- **Site Name**: "FedJobs Radar" (configured in `src/config/site.ts`).
- **Email Provider**: Resend interface abstraction (deferred to Phase 3/4).
- **Closed Jobs Policy**: 90-day retention with banner before 410 Gone status.
- **Content Policy**: Deterministic templating from official USAJOBS structured fields; no LLM-generated eligibility or legal statements.

## Consequences

- Highly performant, predictable build with zero unexpected version upgrades.
- Strict type checking and linting prevents bugs before CI execution.
- Security headers and server-only modules prevent database secret exposure.
