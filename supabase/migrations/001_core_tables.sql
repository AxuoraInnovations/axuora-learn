-- Migration: Core Tables for AxuoraLearn V1.0
-- Run with: psql -d your_db < 001_core_tables.sql

-- Users table (extends Supabase auth.users)
create table public.user_profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  avatar_url text,
  preferences jsonb default '{"theme": "light", "notifications": true}'::jsonb,
  streak_count integer default 0,
  total_study_time integer default 0,
  onboarding_data jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Conversations table
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles not null,
  title text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.conversations enable row level security;

create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Users can create conversations"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on public.conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete own conversations"
  on public.conversations for delete
  using (auth.uid() = user_id);

-- Messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

alter table public.messages enable row level security;

create policy "Users can view messages from own conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can create messages in own conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- Flashcard sets
create table public.flashcard_sets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles not null,
  title text not null,
  description text,
  tags text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.flashcard_sets enable row level security;

create policy "Users can manage own flashcard sets"
  on public.flashcard_sets for all
  using (auth.uid() = user_id);

-- Flashcards with SM-2 algorithm fields
create table public.flashcards (
  id uuid default gen_random_uuid() primary key,
  set_id uuid references public.flashcard_sets on delete cascade not null,
  front text not null,
  back text not null,
  hint text,
  image_url text,
  ease_factor float default 2.5,
  interval integer default 0,
  repetitions integer default 0,
  next_review timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table public.flashcards enable row level security;

create policy "Users can manage flashcards in own sets"
  on public.flashcards for all
  using (
    exists (
      select 1 from public.flashcard_sets
      where flashcard_sets.id = flashcards.set_id
      and flashcard_sets.user_id = auth.uid()
    )
  );

-- Full marks analyses
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles not null,
  question text not null,
  answer text not null,
  score integer check (score >= 0 and score <= 100),
  feedback jsonb not null,
  created_at timestamp with time zone default now()
);

alter table public.analyses enable row level security;

create policy "Users can manage own analyses"
  on public.analyses for all
  using (auth.uid() = user_id);

-- Audio lessons
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles not null,
  topic text not null,
  transcript text,
  duration integer,
  audio_url text,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.lessons enable row level security;

create policy "Users can manage own lessons"
  on public.lessons for all
  using (auth.uid() = user_id);

-- User progress tracking
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles not null,
  date date not null default current_date,
  study_time integer default 0,
  cards_reviewed integer default 0,
  lessons_completed integer default 0,
  quizzes_taken integer default 0,
  analyses_count integer default 0,
  topics text[],
  unique(user_id, date)
);

alter table public.user_progress enable row level security;

create policy "Users can manage own progress"
  on public.user_progress for all
  using (auth.uid() = user_id);

-- Function to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to tables
create trigger user_profiles_updated_at before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger conversations_updated_at before update on public.conversations
  for each row execute function public.handle_updated_at();

create trigger flashcard_sets_updated_at before update on public.flashcard_sets
  for each row execute function public.handle_updated_at();
