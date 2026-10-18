# DATABASE — Supabase Postgres design (v1)

Authoritative reference for the schema. The DDL below is a **reference draft**: the agent must split it into migrations per phase (`supabase/migrations/`), test it from scratch, and verify every statement (especially the generated `tsvector` column) against the Postgres version Supabase runs. Do not paste blindly.

## 1. Principles

- Supabase Postgres, schema changes **only through migrations**.
- UTC `timestamptz` everywhere; display in US time zones in the UI.
- **RLS enabled on every table, no policies for `anon`/`authenticated`.** The app reads and writes server-side with the service role key (never in client code).
- Idempotent ingestion keyed on `(source, source_id)`. Never hard-delete jobs in the sync.
- Store token **hashes**, never raw tokens. Collect the minimum personal data.
- Everything that is filtered gets an index; everything listed is paginated (keyset).

## 2. Migration plan by phase

| Phase | Migration content                                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------------------------------- |
| 0     | extensions (`citext`, `pg_trgm`), `set_updated_at()` function, minimal `app_meta` table                                     |
| 1     | `jobs`, `sync_runs` + indexes                                                                                               |
| 3     | `subscribers`, `saved_searches`, `alert_deliveries` (the generic daily digest is a default saved search with empty filters) |
| 4     | `email_events` and any extra indexes needed by the custom-filter UI                                                         |

## 3. Reference DDL

```sql
-- Phase 0
create extension if not exists citext;
create extension if not exists pg_trgm;

create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table app_meta (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);
alter table app_meta enable row level security;

-- Phase 1
create table jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'usajobs',
  source_id text not null,                 -- stable posting id from the API (verify field in Phase 1)
  slug text not null unique,
  title text not null,
  agency_name text,
  department_name text,
  summary_plain text,                      -- templated plain-English summary (no LLM in v1)
  description_raw jsonb not null default '{}'::jsonb,  -- original fields kept for audit
  locations jsonb not null default '[]'::jsonb,
  state_codes text[] not null default '{}',
  remote_or_telework boolean not null default false,
  pay_min numeric(12,2),
  pay_max numeric(12,2),
  pay_interval text,                       -- e.g. per year / per hour (normalized)
  pay_plan text,                           -- e.g. GS
  grade_low smallint,
  grade_high smallint,
  series_code text,
  schedule text,
  appointment_type text,
  hiring_paths text[] not null default '{}',  -- normalized to our own enum via the field map
  security_clearance text,
  opens_at timestamptz,
  closes_at timestamptz,
  apply_url text not null,
  source_url text,
  status text not null default 'open' check (status in ('open','closed','withdrawn')),
  content_hash text not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  closed_at timestamptz,
  search tsvector generated always as (
    setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(agency_name, '') || ' ' || coalesce(department_name, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(summary_plain, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, source_id)
);

create index jobs_search_idx on jobs using gin (search);
create index jobs_status_closes_idx on jobs (status, closes_at);
create index jobs_open_recent_idx on jobs (first_seen_at desc) where status = 'open';
create index jobs_hiring_paths_idx on jobs using gin (hiring_paths);
create index jobs_state_codes_idx on jobs using gin (state_codes);
create index jobs_series_idx on jobs (series_code);
create index jobs_agency_trgm_idx on jobs using gin (agency_name gin_trgm_ops);
create trigger jobs_updated_at before update on jobs
  for each row execute function set_updated_at();
alter table jobs enable row level security;

create table sync_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running','success','failed')),
  fetched_count int not null default 0,
  inserted_count int not null default 0,
  updated_count int not null default 0,
  closed_count int not null default 0,
  error text
);
create index sync_runs_started_idx on sync_runs (started_at desc);
alter table sync_runs enable row level security;

-- Phase 3
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  status text not null default 'pending'
    check (status in ('pending','active','unsubscribed','bounced')),
  confirmed_at timestamptz,
  confirm_token_hash text,
  confirm_token_expires_at timestamptz,
  manage_token_hash text unique,
  consent_text_version text not null,
  consent_at timestamptz not null default now(),
  source_page text,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger subscribers_updated_at before update on subscribers
  for each row execute function set_updated_at();
alter table subscribers enable row level security;

-- Phase 3 (continued)
create table saved_searches (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  name text not null,
  filters jsonb not null,                   -- validated by versioned Zod schema
  filters_version smallint not null default 1,
  frequency text not null default 'daily' check (frequency in ('daily','weekly')),
  notify_closing_soon boolean not null default true,
  active boolean not null default true,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index saved_searches_active_idx on saved_searches (active, frequency);
create index saved_searches_subscriber_idx on saved_searches (subscriber_id);
create trigger saved_searches_updated_at before update on saved_searches
  for each row execute function set_updated_at();
alter table saved_searches enable row level security;

create table alert_deliveries (
  id uuid primary key default gen_random_uuid(),
  saved_search_id uuid not null references saved_searches(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  kind text not null default 'new' check (kind in ('new','closing_soon')),
  sent_at timestamptz not null default now(),
  unique (saved_search_id, job_id, kind)    -- no duplicate alerts, but a closing-soon reminder is still allowed
);
alter table alert_deliveries enable row level security;

-- Phase 4
create table email_events (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references subscribers(id) on delete set null,
  provider_message_id text,
  type text not null,                       -- delivered, bounced, complained, ...
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table email_events enable row level security;
```

## 4. Saved-search filter schema (v1, versioned)

Validated with Zod; unknown keys are rejected. All fields optional.

```
{
  "version": 1,
  "keywords": string[]            // max 10, each max 50 chars
  "states": string[]              // 2-letter codes
  "gradeMin": number, "gradeMax": number
  "series": string[]              // occupational series codes
  "hiringPaths": string[]         // our normalized enum, not raw API strings
  "payMin": number
  "agencies": string[]
  "schedule": "full_time" | "part_time" | ...
  "telework": boolean
  "closingWithinDays": number
}
```

A **generic digest** is a saved search with `{ "version": 1 }` (no filters), capped to the newest N jobs per email.

The query builder maps each field to a fixed, parameterized predicate (FTS for keywords, `&&` for arrays, ranges for grade/pay). **Never interpolate user JSON into SQL.**

## 5. Access and security rules

- Security advisors may report "RLS enabled, no policy" as informational on these tables. That is intentional (deny by default, server-only access). Document it; do not "fix" it by adding permissive policies.

- No `anon` or `authenticated` policies. A test must prove `anon` cannot select from `subscribers`, `saved_searches`, `alert_deliveries`, `email_events`, `jobs`, `sync_runs`.
- Public pages read through server components using the service role client (server-only module).
- Mask emails in logs. Provide a token-based "delete my data" path that deletes the subscriber and cascades.
- Limit saved searches per subscriber in application code (default 5); also consider a DB-level guard later.
- Slug rule: `slugify(title) + '-' + short source_id`, generated once at insert and never changed, so URLs stay stable and collisions are impossible.
- Cleanup (pending subscribers, old sync runs, old email events) runs from the same scheduled workflow as the sync, through a protected route.

## 6. Retention

- `jobs`: keep closed jobs; the site serves `410` after 90 days closed and drops them from the sitemap. Rows can stay for analytics. Revisit if storage nears free-tier limits.
- `sync_runs`: keep 90 days.
- `subscribers` with status `pending` older than 7 days: delete.
- `email_events`: keep 90 days.

## 7. Capacity notes

Expected volume is small (thousands of active postings; tens of thousands of rows per year). The free-tier database size limit is likely sufficient at first, but verify current limits and track size monthly (`docs/costs-and-limits.md`). Avoid storing large raw payloads beyond what is needed; compress or trim `description_raw` if size grows.

## 8. Verification checklist for the agent

1. Apply all migrations from scratch on local Supabase; no errors.
2. Confirm the generated `tsvector` column compiles; if not, use a trigger-maintained column instead and document in an ADR.
3. `EXPLAIN` the main list, search, and alert-matching queries; confirm indexes are used.
4. Run the anon-access denial tests.
5. Test idempotent upsert (run sync twice → no duplicates, no unnecessary updates).
