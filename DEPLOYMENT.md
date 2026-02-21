# AxuoraLearn V1.0 - Deployment Guide

## 🎯 What's Been Built

### ✅ Complete Features
1. **Authentication System** (Email, Google OAuth, session management)
2. **Dashboard** with sidebar navigation and get-started checklist
3. **AI Chat** with GIZMO interactive teaching mode
4. **Flashcards** with SM-2 spaced repetition algorithm
5. **Full Marks Analyzer** for exam answer feedback
6. **Audio Lessons** with recording and playback
7. **YouTube Extractor** for transcript extraction
8. **Progress Dashboard** with charts and analytics
9. **Analytics Integration** (Amplitude)
10. **Error Tracking** (Sentry)

### 📁 Project Structure
```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                  # Main dashboard
│   │   ├── chat/page.tsx             # AI chat with GIZMO mode
│   │   ├── flashcards/page.tsx       # Flashcard generator & review
│   │   ├── analyzer/page.tsx         # Full marks analyzer
│   │   ├── lessons/page.tsx          # Audio lessons
│   │   ├── youtube/page.tsx          # YouTube extractor
│   │   └── progress/page.tsx         # Progress dashboard
│   ├── sign-in/page.tsx              # Sign in page
│   ├── sign-up/page.tsx              # Sign up page
│   └── onboarding/page.tsx           # User onboarding
├── components/
│   ├── chat/ClaudeChatInput.tsx      # Chat input component
│   ├── flashcards/FlashcardReview.tsx
│   ├── dashboard/
│   │   ├── DashboardSidebar.tsx      # Dark themed sidebar
│   │   └── GetStartedCard.tsx        # Onboarding checklist
│   └── AnalyticsProvider.tsx         # Analytics wrapper
├── lib/
│   ├── api.ts                        # API functions for all features
│   ├── spaced-repetition.ts          # SM-2 algorithm
│   ├── analytics.ts                  # Amplitude integration
│   ├── sentry.ts                     # Error tracking
│   └── supabase/
│       ├── client.ts
│       └── server.ts
└── supabase/
    ├── migrations/
    │   └── 001_core_tables.sql       # Database schema
    └── functions/
        ├── gemini-chat/index.ts      # AI chat endpoint
        ├── analyze-answer/index.ts   # Answer analyzer
        ├── extract-youtube/index.ts  # YouTube extractor
        └── generate-flashcards/index.ts  # Flashcard generator
```

## 🚀 Deployment Steps

### 1. Database Setup (Supabase)

1. Create a new Supabase project at https://supabase.com
2. Run the migration:
   ```bash
   # In Supabase SQL Editor, paste contents of:
   supabase/migrations/001_core_tables.sql
   ```

### 2. Edge Functions Deployment

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy gemini-chat
supabase functions deploy analyze-answer
supabase functions deploy extract-youtube
supabase functions deploy generate-flashcards

# Set secrets
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
supabase secrets set YOUTUBE_API_KEY=your_youtube_api_key
```

### 3. Environment Variables

Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id

# Analytics
NEXT_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_key
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

## 🔧 Configuration

### Google OAuth Setup
1. Follow the guide in `docs/GOOGLE_OAUTH_SETUP.md`
2. Add redirect URLs in Google Cloud Console:
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### Amplitude Setup
1. Create account at https://amplitude.com
2. Create new project
3. Copy API key to `.env.local`

### Sentry Setup
1. Create account at https://sentry.io
2. Create new Next.js project
3. Copy DSN to `.env.local`

## 📊 Feature Usage

### Flashcards
- Users can generate flashcards by topic
- SM-2 algorithm schedules reviews based on recall quality
- Cards are stored per user with review history

### Full Marks Analyzer
- Students paste exam questions and their answers
- AI provides:
  - Score (0-100)
  - Strengths identified
  - Missing elements
  - Improvement suggestions
  - Model answer

### GIZMO Mode
- Toggle in chat header
- Interactive teaching: AI guides students to discover answers
- Uses Socratic questioning approach

### Progress Dashboard
- Charts showing study time, cards reviewed, analyses
- Streak counter for consecutive study days
- 30-day activity overview

## 🔐 Security Notes

- All tables use Row Level Security (RLS)
- Users can only access their own data
- Edge Functions validate authentication
- API keys are stored in Supabase secrets

## 📝 Next Steps (Optional Enhancements)

1. **Email Templates**: Customize Supabase auth emails
2. **File Upload**: Implement Supabase Storage for images in flashcards
3. **Real-time Transcript**: Integrate Web Speech API or Deepgram
4. **Mobile App**: Build with React Native + Expo
5. **Study Groups**: Add collaborative features
6. **Gamification**: Add achievements, leaderboards

## 🐛 Troubleshooting

### Edge Functions not working
- Check secrets are set: `supabase secrets list`
- View logs: `supabase functions logs gemini-chat`
- Ensure CORS headers are present in function responses

### Authentication issues
- Verify redirect URLs in Supabase dashboard
- Check Google OAuth credentials
- Ensure cookies are enabled in browser

### Database errors
- Verify RLS policies are in place
- Check user is authenticated
- Review Supabase logs in dashboard

## 📧 Support

For issues or questions:
- Check Supabase docs: https://supabase.com/docs
- Gemini API docs: https://ai.google.dev/docs
- Next.js docs: https://nextjs.org/docs

---

Built with ❤️ by teens, for teens.
