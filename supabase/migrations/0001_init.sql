-- Phase 0: extensions, timestamp triggers, app metadata
create extension if not exists citext;
create extension if not exists pg_trgm;

create or replace function set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table if not exists app_meta (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table app_meta enable row level security;

-- Insert Phase 0 initialization record
insert into app_meta (key, value) values ('phase', '0')
on conflict (key) do update set value = excluded.value, updated_at = now();
