# CONCEPTION — USA Federal Jobs Radar

Status: v1 draft, consolidated from the owner/architect brainstorming. If this file conflicts with `AGENTS.md`, `AGENTS.md` wins; open an ADR to reconcile.

---

## 1. Vision

A clean, fast, trustworthy "radar" of US federal jobs for people who are **new to federal hiring**. USAJOBS has the data but is hard to understand. We win on clarity, freshness, and alerts, not on owning the data.

**Success looks like**: a first-time visitor understands within 30 seconds what a job is, whether they can apply, what it pays, and when it closes, and leaves with an alert set up.

## 2. Audience and jobs-to-be-done

| Segment (v1)                  | Situation                                                 | Main pain                                                                 |
| ----------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| First-time federal applicants | Heard "federal jobs are stable", opened USAJOBS, got lost | Jargon (GS grade, series, hiring path), unclear eligibility, long process |
| Students and recent graduates | Looking for internships and entry-level roles             | Not knowing which programs and hiring paths apply to them                 |

**Owner-ranked priorities (most to least important)**

1. New jobs every day + alerts before jobs close.
2. Quick plain-English eligibility ("can I apply?").
3. How to write a federal resume and apply, step by step.
4. Real salary (GS pay scale, locality pay) and benefits.
5. Commute / location fit (later).

## 3. Product principles

1. **Accuracy over cleverness.** Eligibility and pay are derived from structured source data and always show their source. Missing data says "Not specified".
2. **No login.** Email is the only identity; token links manage preferences.
3. **Fast and calm.** Mobile-first, no popups, minimal ads (later).
4. **Progressive disclosure.** Simple first, power later (filters, alerts).
5. **Original value on every page.** We add explanation, not copies.
6. **Not an official site.** Clear disclaimer and non-governmental visual identity.

## 4. Information architecture (sitemap)

```
/                         Home: search box, "closing soon", "new today", alert CTA, top guides
/jobs                     List + filters + sort (newest, closing soon)
/jobs/[slug]              Job detail
/agencies/[slug]          Jobs by agency (SEO landing)
/states/[state]           Jobs by state (SEO landing)
/series/[code]            Jobs by occupational series (SEO landing)
/guides                   Guide index
/guides/[slug]            Sourced guides (federal resume, GS scale, hiring paths, Pathways, ...)
/alerts                   Create alert (simple, then advanced)
/alerts/confirm           Double opt-in landing
/alerts/manage?t=<token>  Manage/pause/delete alerts (token link; noindex, Referrer-Policy no-referrer)
/unsubscribe?t=<token>    One-click unsubscribe
/about /contact /privacy /terms /disclaimer
/sitemap.xml /robots.txt /api/health
```

## 5. Key user journeys

**J1 — Discover and apply (SEO visitor)**: search result → job detail → understands "who can apply" → clicks "Apply on USAJOBS" (official site) → sees "Get alerts like this" CTA before leaving.

**J2 — Set up alerts**: home or job page → alert form with 3–4 inputs (keywords, state, level, hiring path) → live preview "about N matching jobs now" → email entered → Turnstile → confirmation email → confirm → first digest at the chosen frequency → every email has manage + one-click unsubscribe.

**J3 — Learn**: guide page (e.g., federal resume) → inline links to relevant open jobs → alert CTA.

## 6. Page specifications

### Job list (`/jobs`)

- Scannable cards: title, agency, location, pay range (with interval), "closes in N days", "Open to" badges.
- Filters v1: keywords, state, grade level, hiring path. "More filters": series, salary min, agency, schedule, telework, closing within N days.
- Sort: newest, closing soon. Keyset pagination. URL reflects filters (shareable, back-button safe).
- Empty state suggests broadening filters and offers an alert.

### Job detail (`/jobs/[slug]`)

Order: title + agency → key facts (pay, location, grade, closes) → **Who can apply** (plain English + source text) → plain-English summary (templated) → duties and qualifications (from source) → **Apply on USAJOBS** button (external) → alert CTA → disclaimer + last synced + source link. Closed jobs show a banner and links to similar open jobs.

### Plain-English eligibility block (design rule)

Built by a deterministic mapper from `hiring_paths` and related fields using a hand-written dictionary of official meanings. Each line shows: plain-English statement + "Source: <field/text>". If a value is unknown to the dictionary, show the raw official text unchanged. **No LLM in v1.**

### Alerts

- Data model supports full custom filters from day 1 (see `DATABASE.md`).
- UI starts simple; "Add more filters" reveals the rest.
- Frequencies: daily or weekly digest, plus an optional closing-soon reminder per search. Cap digest size (e.g., top N + "see all" link).
- Limits: max saved searches per email (default 5) to prevent abuse.

### Guides

MDX with required frontmatter (`sources`, `lastReviewed`, `reviewedBy`). Build fails if `sources` is empty. Each guide links to relevant open jobs and the alert CTA.

## 7. UI direction

Modern, friendly, clean, trustworthy. Plain language, generous spacing, strong typographic hierarchy, restrained color, no government iconography (flags, eagles, seals). Trust signals visible: source, last synced, disclaimer, About page. Design tokens defined once (color, spacing, type, radius). WCAG 2.2 AA, mobile-first, no layout shift (ad-slot space reserved later).

## 8. System architecture

```
USAJOBS API
    │  (scheduled: GitHub Actions → POST /api/cron/sync, bearer secret)
    ▼
Sync service (Next.js route handler → lib/usajobs → lib/jobs)
    │  validate (Zod) → normalize → upsert (idempotent) → mark closed → log sync_runs
    ▼
Supabase Postgres  ── jobs, sync_runs, subscribers, saved_searches, alert_deliveries
    │                      ▲
    │                      │ read (server-side, service role)
    ▼                      │
Next.js (Vercel) ── RSC pages with ISR cache ── users (browsers, Google)
    │
    └── Alert engine (after each sync): match new/changed jobs → saved_searches
            → build digests → EmailSender (Resend) → alert_deliveries (dedup)
```

Key decisions: monolith (Next.js) + Postgres; no queues/Redis in v1; Postgres FTS for search; scheduled work through GitHub Actions; all DB access server-side with RLS deny-by-default.

## 9. Alert engine design

1. After each successful sync, for every active `saved_search` of an `active` subscriber that is due (`daily`: last run more than ~20h ago; `weekly`: more than ~6 days ago), select jobs with `first_seen_at > saved_searches.last_run_at` that match its filters. For `notify_closing_soon`, also select open jobs closing within the reminder window.
2. Insert `alert_deliveries (saved_search_id, job_id, kind)` with `ON CONFLICT DO NOTHING`; only rows actually inserted go into the email. This guarantees no duplicate sends, while a job can still trigger one `new` and one `closing_soon` alert.
3. Group per subscriber into one email; throttle sends; retry transient failures; update `last_run_at` only after the email is accepted by the provider. Record provider events (bounce/complaint) and deactivate bounced addresses.
4. Filter compilation uses a fixed, parameterized query builder driven by a versioned Zod schema. User JSON is never interpolated into SQL.
5. Token links (manage/unsubscribe) carry a random token that is stored hashed; those pages are `noindex` with `Referrer-Policy: no-referrer`, and state-changing actions use POST.

## 10. Non-functional requirements

Performance: LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile. Reliability: stale-but-available beats blank; every external call has timeout/retry. Security/privacy: see `AGENTS.md` section 9. Observability: structured logs, Sentry, `/api/health` with last-sync age, alert if no sync in 6 hours. Accessibility: WCAG 2.2 AA with automated axe checks.

## 11. Metrics (cookieless)

Subscription conversion rate, alert open and click rate, returning visitors, time to first relevant job, sync freshness (minutes), page speed (CWV), and later RPM and ad-viewability.

## 12. Monetization design (Phase 5, not v1 code)

1. Display ads (AdSense first). Max 2–3 placements/page, clearly separated from content, never on forms or alert flows, reserved space.
2. Affiliate placements only for relevant job-seeker tools, with clear disclosure.
3. Later: newsletter sponsorship. Never sell "access" to government jobs.
   Pre-requisites: legal pages, consent handling as required, 15–30 quality pages, commercial-use-capable hosting plan.

## 13. Roadmap

See `AGENTS.md` section 16 (Phases 0–5) for gates and Definition of Done.

## 14. Risks and mitigations

| Risk                                          | Mitigation                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Federal hiring volume is low or volatile      | Measure new jobs/day in Phase 1; invest in guides and tools so the site has value even on slow days |
| Thin or copied pages hurt SEO and ad approval | Templated original summaries, eligibility blocks, pay context, sourced guides                       |
| Wrong eligibility info destroys trust         | Deterministic mapping, show sources, disclaimers, tests with fixtures                               |
| API changes or outages                        | Zod validation, fail loudly, stale banner, sync health alerts                                       |
| Email deliverability                          | Double opt-in, proper headers, authentication (SPF/DKIM/DMARC), throttling                          |
| Free-tier limits                              | Document in `costs-and-limits.md`, design throttling, upgrade only with owner approval              |
| Scope creep (custom alerts, extras)           | Phase gates; progressive UI; ADRs for changes                                                       |
