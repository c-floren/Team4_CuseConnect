-- CuseConnect database setup.
-- Paste this whole file into the Supabase SQL Editor and click Run.
-- Safe to run more than once: tables and policies are only created if missing,
-- and seed clubs are skipped if a club with that name already exists.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.clubs (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  description text not null,
  -- Matches an option id from quiz question 1 (src/features/quiz/data/quizQuestions.js),
  -- so quiz answers can be matched to clubs later.
  category    text not null check (
    category in ('arts', 'service', 'sports', 'tech', 'business', 'culture', 'media', 'outdoors')
  ),
  tags        text[] not null default '{}',
  meets       text,
  image_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.quiz_responses (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  -- Shape mirrors QuizContext answers, e.g.
  -- {"interests": ["tech", "arts"], "workingStyle": "small-team", "commitment": "weekly"}
  answers    jsonb not null
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- The browser uses the public anon key, so these policies are what actually
-- protect the data. Anything not allowed here is denied.
-- ---------------------------------------------------------------------------

alter table public.clubs enable row level security;
alter table public.quiz_responses enable row level security;

-- Table-level access for the app's roles. Newer Supabase projects don't grant
-- this automatically, and without it every request fails with "permission
-- denied" before the policies below are even checked.
grant select on public.clubs to anon, authenticated;
grant insert on public.quiz_responses to anon, authenticated;

-- Anyone can read clubs. No one can edit them from the app (use the dashboard).
drop policy if exists "Clubs are readable by everyone" on public.clubs;
create policy "Clubs are readable by everyone"
  on public.clubs for select
  to anon, authenticated
  using (true);

-- Anyone can submit a quiz response, but can't read, edit, or delete others'.
drop policy if exists "Anyone can submit a quiz response" on public.quiz_responses;
create policy "Anyone can submit a quiz response"
  on public.quiz_responses for insert
  to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Seed data (sample clubs for development, not an official SU list)
-- The first six match the club discovery screen (artifacts/club-discovery_1.html).
-- ---------------------------------------------------------------------------

insert into public.clubs (name, description, category, tags, meets, image_url) values
  ('SU Robotics Club',
   'Students design, build, and compete with robots. No experience needed — just curiosity and a willingness to get hands-on.',
   'tech', '{robotics,engineering,competition}', 'Thursdays, 6 PM · Link Hall',
   'https://picsum.photos/seed/robotics/200'),
  ('Orange Filmworks',
   'A student-run production team that writes, shoots, and edits short films together each semester.',
   'media', '{film,video,storytelling}', 'Tuesdays, 7 PM · Newhouse 3',
   'https://picsum.photos/seed/film/200'),
  ('Cuse Hacks',
   'Syracuse''s student hackathon community. Build projects, learn new tools, and meet other builders on campus.',
   'tech', '{hackathons,coding,projects}', 'Mondays, 8 PM · CST Building',
   'https://picsum.photos/seed/hacks/200'),
  ('SU Outing Club',
   'Weekend hikes, camping trips, and climbing outings around Central New York for students of any experience level.',
   'outdoors', '{hiking,camping,climbing}', 'Weekends · Meet at Schine',
   'https://picsum.photos/seed/outing/200'),
  ('Best Buddies Syracuse',
   'Builds one-to-one friendships between SU students and members of the local community with intellectual disabilities.',
   'service', '{volunteering,community,friendship}', 'Wednesdays, 5 PM · Schine 304A',
   'https://picsum.photos/seed/buddies/200'),
  ('WAER Sports Broadcasting',
   'Student broadcasters calling live Syracuse sports, producing shows, and building a demo reel for the industry.',
   'media', '{broadcasting,sports,radio}', 'Game days · Newhouse Studios',
   'https://picsum.photos/seed/waer/200'),
  ('Orange Investment Group',
   'Students research stocks, pitch ideas, and manage a mock portfolio together. Great prep for finance internships.',
   'business', '{investing,finance,case-competitions}', 'Wednesdays, 7 PM · Whitman School',
   'https://picsum.photos/seed/invest/200'),
  ('Caribbean Student Association',
   'A home away from home celebrating Caribbean culture through food, music, dance, and the annual cultural showcase.',
   'culture', '{heritage,community,events}', 'Fridays, 6 PM · Schine 228',
   'https://picsum.photos/seed/caribbean/200'),
  ('Clay Collective',
   'Open studio nights for wheel throwing and hand building. Beginners welcome — materials provided.',
   'arts', '{ceramics,studio,making}', 'Tuesdays, 6 PM · Comstock Art Facility',
   'https://picsum.photos/seed/clay/200'),
  ('Club Ultimate Frisbee',
   'Competitive and casual ultimate frisbee. Practice on the Quad, travel to tournaments, or just come throw.',
   'sports', '{ultimate,frisbee,intramural}', 'Mon & Thu, 5 PM · Skytop Fields',
   'https://picsum.photos/seed/ultimate/200')
on conflict (name) do nothing;
