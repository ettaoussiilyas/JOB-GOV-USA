# Free-Tier Operational Limits & Cost Tracking

This document outlines the free-tier service allowances, hard platform limits, failure modes upon reaching limits, and the upgrade strategy across all external dependencies supporting **FedJobs Radar**.

---

## 1. Supabase (Database & Backend)

### Free Plan Limits

- **Active Projects**: Up to 2 free projects (1 staging/dev, 1 production).
- **Database Storage**: 500 MB included.
- **Egress (Bandwidth)**: 5 GB / month included.
- **Monthly Active Users (MAU)**: 50,000 MAU.
- **Edge Function Invocations**: 500,000 / month.
- **Inactivity Pausing**: Projects with zero database traffic for 7 consecutive days may be paused.

### Behavior When Limits Are Exceeded

- **Storage Cap**: Database enters read-only mode if the 500 MB cap is exceeded until storage is trimmed or upgraded.
- **Bandwidth/Egress**: Additional egress is either throttled or blocked depending on project settings.
- **Inactivity Pause**: API returns `503 Service Unavailable` until restored in the Supabase Dashboard.

### Mitigations

- Ingestion pipeline computes SHA-256 `content_hash` to only update changed rows, preventing unnecessary storage bloat.
- Keyset pagination on all list queries.
- Scheduled cron sync keeps staging active and prevents inactivity pausing.
- Phase 1-5 upgrade gate: Upgrade to Pro Plan ($25/mo) only once validated by AdSense revenue.

---

## 2. Vercel (Web Hosting & Edge Network)

### Hobby Plan Terms & Limits

- **Bandwidth**: 100 GB / month.
- **Build Execution**: 6,000 build minutes / month.
- **Edge Middleware Invocations**: 1,000,000 / month.
- **Cron Jobs**: Restricted frequency (1 daily cron job on Hobby).
- **Commercial Use Restriction**: Vercel Hobby terms prohibit commercial monetization (display ads, affiliate monetization).

### Behavior When Limits Are Exceeded

- Deployments or builds will fail when build minutes are exhausted.
- Traffic exceeding bandwidth may result in temporary account suspension or throttling.

### Mitigations & Upgrade Plan

- All scheduled synchronization tasks are triggered via **GitHub Actions** (`POST /api/cron/sync`), avoiding Vercel cron frequency limitations entirely.
- **Commercial Gate**: Before enabling Google AdSense or affiliate links in Phase 5, the project must migrate to a commercial-compliant plan (Vercel Pro at $20/mo or a dedicated VPS/Fly.io deployment).

---

## 3. GitHub Actions (CI/CD & Cron Scheduling)

### Free Plan Limits

- **Public Repositories**: **Unlimited minutes** and runners.
- **Private Repositories**: 2,000 free minutes / month.

### Behavior When Limits Are Exceeded

- Workflows are queued or blocked from running until minutes reset.

### Mitigations

- Efficient workflow steps with `pnpm` caching and targeted triggers (`paths` filters on `db-migrate.yml`).
- Secret scanning via lightweight `gitleaks`.

---

## 4. Email Provider (Resend - Scheduled for Phase 3/4)

### Free Plan Limits

- **Daily Send Limit**: 100 emails / day.
- **Monthly Send Limit**: 3,000 emails / month.
- **Domains**: 1 custom sending domain with SPF, DKIM, and DMARC verification.

### Behavior When Limits Are Exceeded

- Outbound API requests return HTTP `429 Too Many Requests`.

### Mitigations

- Double opt-in prevents fake and bouncing email addresses.
- Bulk digests are grouped per subscriber and throttled.
- Upgrade to Pro ($20/mo for 50k emails) only after subscriber count exceeds free threshold.

---

## 5. Cloudflare Turnstile (Bot Protection - Phase 3/4)

### Free Plan Limits

- Completely free with unlimited challenges and zero invasive CAPTCHAs.
