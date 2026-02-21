-- Waitlist signups: store emails from landing page / waitlist form.
-- Count is read by GET /api/waitlist-count. Uses anon key only (no service role needed).

create table if not exists public.waitlist_signups (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  created_at timestamp with time zone default now(),
  unique(email)
);

alter table public.waitlist_signups enable row level security;

-- Anon can insert (join waitlist) and run the count function. No service role required.
create policy "Anyone can join waitlist"
  on public.waitlist_signups for insert
  with check (true);

-- Safe count: only this function exposes count; anon cannot read rows.
create or replace function public.get_waitlist_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*)::bigint from public.waitlist_signups;
$$;

grant execute on function public.get_waitlist_count() to anon;
grant execute on function public.get_waitlist_count() to authenticated;

create index if not exists waitlist_signups_created_at on public.waitlist_signups (created_at desc);
