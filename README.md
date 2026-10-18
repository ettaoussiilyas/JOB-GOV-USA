# FedJobs Radar

> A clean, fast radar of US federal jobs designed for newcomers and students, featuring plain-English eligibility explanations and targeted email alerts.

[![CI](https://github.com/ettaoussiilyas/JOB-GOV-USA/actions/workflows/ci.yml/badge.svg)](https://github.com/ettaoussiilyas/JOB-GOV-USA/actions/workflows/ci.yml)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Quickstart (Under 15 Minutes)

### Prerequisites

- **Node.js**: LTS (`>= 22.x`)
- **Package Manager**: `pnpm` (`v12.x` installed globally via `npm install -g pnpm` or `corepack enable`)
- **Git**: Git installed and configured

### Installation & Local Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ettaoussiilyas/JOB-GOV-USA.git
   cd JOB-GOV-USA
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Copy the example environment template:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your local/staging credentials in `.env.local`:

   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://rujjqtgvqgmbcpoujflj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key
   CRON_SECRET=your-random-32-char-cron-secret
   ```

4. **Install Playwright browsers for E2E tests**:

   ```bash
   pnpm exec playwright install chromium
   ```

5. **Start the local development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Available Scripts

| Command             | Description                                                           |
| ------------------- | --------------------------------------------------------------------- |
| `pnpm dev`          | Starts local Next.js development server with Turbopack                |
| `pnpm build`        | Compiles optimized production build                                   |
| `pnpm start`        | Runs compiled production server locally                               |
| `pnpm lint`         | Runs ESLint flat config checking strict type and style rules          |
| `pnpm typecheck`    | Executes TypeScript type checking (`tsc --noEmit`)                    |
| `pnpm test`         | Runs unit and integration tests via Vitest                            |
| `pnpm test:e2e`     | Runs Playwright tests (Desktop & Mobile) with axe accessibility scans |
| `pnpm format:check` | Verifies code formatting with Prettier                                |
| `pnpm format`       | Auto-formats codebase with Prettier                                   |

---

## 3. Environment Variables Reference

| Variable                        | Scope           | Purpose                                                             | Example                                    |
| ------------------------------- | --------------- | ------------------------------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`          | Public / Client | Canonical URL of the website                                        | `https://fedjobsradar.com`                 |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public / Client | Supabase project API gateway endpoint                               | `https://rujjqtgvqgmbcpoujflj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Supabase anon/publishable API key                                   | `eyJhbGciOi...`                            |
| `SUPABASE_SERVICE_ROLE_KEY`     | **Server-Only** | Private admin key for server-side queries (never exposed to client) | `eyJhbGciOi...`                            |
| `CRON_SECRET`                   | **Server-Only** | Shared bearer secret for scheduled sync endpoints                   | `min-32-characters-cryptographic-secret`   |

---

## 4. Quality & Testing Architecture

- **Unit Testing**: Tests located in `tests/unit/` covering environment validation, structured logger with email masking, and health route error/timeout handling.
- **End-to-End Testing**: Tests located in `tests/e2e/` checking page landmarks, single `<h1>` hierarchy, exact disclaimer text matching, and 404 navigation.
- **Accessibility (a11y)**: Every core route is audited using `@axe-core/playwright` during E2E tests to enforce **zero WCAG 2.2 AA violations**.
- **Automated Screenshots**: Every E2E test run captures responsive screenshots (desktop + mobile) saved to `docs/screenshots/`.

---

## 5. Deployment Guide (Vercel)

1. **Import the repository** into Vercel.
2. **Framework Preset**: Next.js (automatically detected).
3. **Configure Environment Variables per Environment**:
   - **Preview Environment** (pull requests): Connect to the **Staging** Supabase project (`rujjqtgvqgmbcpoujflj`).
   - **Production Environment** (main branch): Connect to the **Production** Supabase project.
4. **Health Check Verification**:
   After deployment, visit `https://<your-deployment-url>/api/health`.
   It should return HTTP 200:
   ```json
   {
     "status": "ok",
     "time": "2026-10-18T00:00:00.000Z",
     "db": "ok",
     "lastSync": null
   }
   ```

---

## 6. Legal & Attribution Notice

- Data source: **Official USAJOBS Search API** (US Office of Personnel Management).
- **Disclaimer**: _Not affiliated with or endorsed by USAJOBS or any US government agency. Information may be incomplete or outdated. Always verify details and apply on the official USAJOBS posting._
