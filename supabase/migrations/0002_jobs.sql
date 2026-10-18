-- Phase 1: Jobs table, indexes, FTS generated column, sync runs
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'usajobs',
  source_id text not null,
  slug text not null unique,
  title text not null,
  agency_name text,
  department_name text,
  summary_plain text,
  description_raw jsonb not null default '{}'::jsonb,
  locations jsonb not null default '[]'::jsonb,
  state_codes text[] not null default '{}',
  remote_or_telework boolean not null default false,
  pay_min numeric(12,2),
  pay_max numeric(12,2),
  pay_interval text,
  pay_plan text,
  grade_low smallint,
  grade_high smallint,
  series_code text,
  schedule text,
  appointment_type text,
  hiring_paths text[] not null default '{}',
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

create index if not exists jobs_search_idx on jobs using gin (search);
create index if not exists jobs_status_closes_idx on jobs (status, closes_at);
create index if not exists jobs_open_recent_idx on jobs (first_seen_at desc) where status = 'open';
create index if not exists jobs_hiring_paths_idx on jobs using gin (hiring_paths);
create index if not exists jobs_state_codes_idx on jobs using gin (state_codes);
create index if not exists jobs_series_idx on jobs (series_code);
create index if not exists jobs_agency_trgm_idx on jobs using gin (agency_name gin_trgm_ops);

drop trigger if exists jobs_updated_at on jobs;
create trigger jobs_updated_at before update on jobs
  for each row execute function set_updated_at();

alter table jobs enable row level security;

create table if not exists sync_runs (
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

create index if not exists sync_runs_started_idx on sync_runs (started_at desc);

alter table sync_runs enable row level security;
