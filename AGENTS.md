# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
AxuoraLearn is a Next.js 14 (App Router) AI study platform. See `README.md` for full details.

### Running the app
- `npm run dev` — starts at http://localhost:3000
- `npm run lint` — ESLint (uses `.eslintrc.json` with `next/core-web-vitals`)
- `npm run build` — production build

### Known caveats
- **`npm run build` fails** due to pre-existing `react/no-unescaped-entities` lint errors in several files. TypeScript compilation itself succeeds. `npm run dev` works fine regardless.
- **`.eslintrc.json`** was not originally in the repo — it was added to enable non-interactive `npm run lint`. It extends `next/core-web-vitals`.
- **External services** (Supabase, Bytez API, Gemini API) require real API keys in `.env.local` for dashboard/AI features. The landing page, features, pricing, blogs, waitlist, and contact pages all work without any keys.
- **Environment variables**: copy `.env.example` to `.env.local` and fill in keys. See `.env.example` for detailed instructions per variable.

### Services overview
| Service | Required for | Env vars needed |
|---------|-------------|-----------------|
| Next.js dev server | Everything | — |
| Supabase | Auth, database, edge functions | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Bytez API | AI Chat | `BYTEZ_API_KEY` |
| Google Gemini (via Supabase Edge Functions) | Flashcards, Analyzer, Chat fallback | `GEMINI_API_KEY` (Supabase secret) |
| YouTube Data API | Video search in chat | `YOUTUBE_API_KEY` (optional) |
| Google OAuth | Google sign-in, Calendar | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (optional) |
