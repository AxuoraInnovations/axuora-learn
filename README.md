# AxuoraLearn V1.0 - README

## 🎓 AI Study Agent Platform

AxuoraLearn is an AI-powered study platform built by teens, for teens. Prepare for exams faster with intelligent flashcards, answer analysis, and interactive teaching.

## ✨ Features

### 🤖 AI Chat with GIZMO Mode
- Chat with AI tutor for any subject
- **GIZMO Mode**: Interactive teaching through guided questions
- File upload and content paste support
- Context-aware responses

### 🎴 Smart Flashcards
- **AI-Generated**: Create flashcard sets from any topic
- **Spaced Repetition**: SM-2 algorithm optimizes review schedule
- **Audio Support**: Text-to-speech for flashcard content
- Track review progress and statistics

### 📝 Full Marks Analyzer
- Upload exam questions and your answers
- Get detailed feedback:
  - Score (0-100)
  - Identified strengths
  - Missing elements
  - Actionable improvements
  - Model answer example

### 🎧 Audio Lessons
- Record voice notes
- Generate AI audio lessons
- Playback and download support
- Automatic transcription (coming soon)

### 📺 YouTube Extractor
- Extract transcripts from educational videos
- Download transcripts as text
- Study from video content efficiently

### 📊 Progress Dashboard
- Track study time and activity
- Visualize learning patterns
- Monitor streak and achievements
- 30-day activity charts

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email + Google OAuth)
- **AI**: Google Gemini API
- **Analytics**: Amplitude
- **Error Tracking**: Sentry
- **Charts**: Recharts
- **Animations**: Framer Motion

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/axuoralearn.git
   cd axuoralearn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_key
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up database**
   - Create a Supabase project
   - Run the migration in `supabase/migrations/001_core_tables.sql`

5. **Deploy Edge Functions**
   ```bash
   supabase functions deploy gemini-chat
   supabase functions deploy analyze-answer
   supabase functions deploy extract-youtube
   supabase functions deploy generate-flashcards
   
   supabase secrets set GEMINI_API_KEY=your_key
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open http://localhost:3000

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── dashboard/          # Dashboard features
│   │   ├── sign-in/            # Authentication
│   │   └── onboarding/         # User onboarding
│   ├── components/             # React components
│   ├── lib/                    # Utilities and APIs
│   └── styles/                 # Global styles
├── supabase/
│   ├── migrations/             # Database schema
│   └── functions/              # Edge Functions
└── public/                     # Static assets
```

## 🎨 Design Philosophy

- **Clean & Modern**: Soft blue theme, 25px border radius
- **Smooth Animations**: Framer Motion for delightful UX
- **Mobile-First**: Responsive design for all devices
- **Accessible**: WCAG AA compliant

## 📚 Key Libraries

- `@supabase/ssr` - Server-side auth
- `@amplitude/analytics-browser` - Analytics
- `@sentry/nextjs` - Error tracking
- `recharts` - Data visualization
- `lucide-react` - Icons
- `framer-motion` - Animations

## 🔐 Security

- Row Level Security (RLS) on all tables
- Secure HTTP-only cookies for sessions
- API keys stored in environment variables
- CORS configured for Edge Functions

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Supabase](https://supabase.com)
- AI by [Google Gemini](https://ai.google.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📞 Support

- **Email**: support@axuoralearn.com
- **Documentation**: [docs.axuoralearn.com](https://docs.axuoralearn.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/axuoralearn/issues)

---

Made with ❤️ by teens, for teens
