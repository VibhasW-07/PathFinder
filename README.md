## Supabase Setup

Run these SQL snippets in your Supabase project to create tables and basic RLS. Adjust to your org needs.

```sql
-- Users
create table if not exists public.users (
  user_id uuid primary key,
  email text not null,
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

-- Profiles
create table if not exists public.user_profiles (
  profile_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  academic_level text,
  stream text,
  subjects jsonb,
  location jsonb,
  career_goals text,
  preferences jsonb,
  assessment_completed_at timestamp with time zone,
  last_updated timestamp with time zone default now()
);

-- Assessment history
create table if not exists public.assessment_history (
  assessment_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  assessment_data jsonb not null,
  completed_at timestamp with time zone default now(),
  version int default 1
);

-- Course interactions
create table if not exists public.course_interactions (
  interaction_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  course_id text not null,
  interaction_type text not null,
  timestamp timestamp with time zone default now()
);

-- Scholarship tracking
create table if not exists public.scholarship_tracking (
  tracking_id text primary key,
  user_id uuid not null references public.users(user_id) on delete cascade,
  scholarship_id text not null,
  application_status text,
  applied_at timestamp with time zone
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.assessment_history enable row level security;
alter table public.course_interactions enable row level security;
alter table public.scholarship_tracking enable row level security;

-- Policies: each user sees only own rows
create policy if not exists "users.self" on public.users
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "profiles.self" on public.user_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "assessment.self" on public.assessment_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "course_interactions.self" on public.course_interactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "scholarship_tracking.self" on public.scholarship_tracking
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

After running, update your Supabase URL/key in `src/integrations/supabase/client.ts` if needed.

## Additional Setup Notes

1. **Authentication**: Make sure Supabase Auth is enabled in your project settings
2. **RLS Policies**: The policies above ensure users can only access their own data
3. **Profile Fields**: The `user_profiles` table stores additional fields like `name`, `age`, `dob`, `institution`, `fieldOfStudy`, etc. in the JSONB columns
4. **Assessment Data**: Each assessment completion is stored with version tracking for retake functionality
5. **Tracking**: Course interactions and scholarship applications are automatically tracked for analytics

