# CuseConnect

Club-matching app for Syracuse University. Vite + React + React Router, styled with CSS Modules.

This is the **single** app for the whole team — every feature is a folder under `src/features/`,
sharing one `package.json`, one router, and one set of design tokens.

## Getting started

Requires **Node 20+** ([nodejs.org](https://nodejs.org), or `winget install OpenJS.NodeJS.LTS`).

```bash
cd artifacts/cuseconnect
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173). It redirects to `/quiz/1`.

Other scripts: `npm run build`, `npm run preview`, `npm run db:check`.

## Connecting to the database

The team shares one [Supabase](https://supabase.com) project (hosted Postgres). Ask a teammate for
an invite to the **CuseConnect** project if you don't see it in your dashboard.

1. Copy the env template: `cp .env.example .env.local`
2. In the Supabase dashboard, open **Project Settings → API** and paste the **Project URL** and
   **anon public** key into `.env.local`.
3. Check the connection: `npm run db:check` — it should list the seeded clubs.
4. Restart `npm run dev` if it was already running (Vite reads env files on startup).

In code, import the shared client — don't create a new one:

```js
import { supabase } from '../../../lib/supabaseClient';

const { data, error } = await supabase.from('clubs').select('*');
```

**Keys:** `.env.local` is git-ignored, so keys stay off GitHub. The anon key ends up in the
browser anyway — Row Level Security is what protects the data. **Never** use or commit the
`service_role` key; it bypasses every security rule.

**Schema:** `supabase/setup.sql` creates the tables, security policies, and sample clubs. It's
already been run on the shared project; re-run it in the SQL Editor after changing it (it's safe
to run twice).

| Table            | What it holds                     | App can…           |
| ---------------- | --------------------------------- | ------------------ |
| `clubs`          | name, description, category, tags | read               |
| `quiz_responses` | quiz answers as JSON              | insert (not read)  |

## Layout

```
src/
  main.jsx              entry — mounts <App/> inside <BrowserRouter>
  App.jsx               every route, for every feature
  styles/
    tokens.css          colors, spacing, type — the single source of design values
    global.css          resets, body styles, the .srOnly helper
  components/           shared UI, used by 2+ features
  lib/
    supabaseClient.js   the one shared database client
  features/
    quiz/               3-question matching quiz
      data/             mock question content
      context/          answer state shared across quiz steps
      pages/            QuizPage, ResultsPage
      components/       quiz-only UI
```

## Conventions

- **One CSS Module per component**, colocated next to the `.jsx`. Keeps four people out of each
  other's way in git.
- **No raw hex values** in component CSS — reference `var(--ink)` and friends from `tokens.css`.
- **Feature-first.** New work starts in `src/features/<name>/`. A component moves up to
  `src/components/` only once a second feature needs it.
- **Real form controls.** Selectable cards wrap a real `<input>` hidden with `.srOnly`, so keyboard
  and screen-reader behavior comes from the browser rather than hand-rolled handlers.

## Adding a feature

1. `src/features/<name>/` with `pages/`, `components/`, and `data/` as needed.
2. Add its route to `src/App.jsx`.
3. Pull design values from `styles/tokens.css`.

## Current status

The quiz flow (`/quiz/1` → `/quiz/2` → `/quiz/3` → `/results`) is built against
`artifacts/quiz-wireframe.pdf`. The Welcome screen and real matching logic are separate stories;
`/results` is a placeholder.
