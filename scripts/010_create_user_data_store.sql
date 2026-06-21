-- Create user_data_store table used by the app to persist user records
-- Run this in the Supabase SQL Editor (or psql as a superuser)

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists public.user_data_store (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  bucket text not null,
  data_key text not null,
  payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Unique constraint used by upsert in the application
do $$
begin
  if not exists (
    select 1 from pg_indexes where tablename = 'user_data_store' and indexname = 'user_data_store_user_bucket_key_uidx'
  ) then
    create unique index user_data_store_user_bucket_key_uidx on public.user_data_store (user_id, bucket, data_key);
  end if;
end $$;

-- Helpful index for listing by user
do $$
begin
  if not exists (
    select 1 from pg_indexes where tablename = 'user_data_store' and indexname = 'user_data_store_user_id_idx'
  ) then
    create index user_data_store_user_id_idx on public.user_data_store (user_id);
  end if;
end $$;

-- Grant basic access to authenticated role if desired (adjust as needed)
-- grant select, insert, update, delete on public.user_data_store to authenticated;
