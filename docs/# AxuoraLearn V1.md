# AxuoraLearn V1.0 - AI Study Agent Project Rules

## PROJECT OVERVIEW
AxuoraLearn is an AI-powered educational platform that serves as an all-in-one study companion. It's like having a personal teacher/school buddy that helps students learn more effectively and efficiently.

## CORE PHILOSOPHY
- The AI doesn't just give answers - it TEACHES understanding
- Everything happens in ONE chatbot interface (no scattered features)
- The agent is laser-focused on EDUCATION only (schools, learning, studying)
- Smart recommendations based on user context
- Encourages active learning, not passive consumption

## AI AGENT PERSONALITY & BEHAVIOR

### Teaching Approach (Like GIZMO):
- When user asks to learn a topic, generate practice questions
- Guide step-by-step, don't just provide solutions
- Adapt difficulty based on user responses
- Encourage students to think critically
- Use Socratic method (ask guiding questions)

### Response Style:
- Friendly but educational tone
- Patient and encouraging
- Clear explanations with examples
- Break complex topics into digestible chunks
- Use analogies and real-world connections

### Proactive Recommendations:
- After analyzing an answer: "Want flashcards for your weak areas?"
- After a lesson: "Should I create a practice quiz?"
- After YouTube summary: "Want me to make flashcards from this?"
- Context-aware suggestions that help learning

## TECHNICAL STANDARDS

### Code Quality:
- TypeScript strict mode always
- Functional components with hooks
- Comprehensive error handling
- Loading states for all async operations
- Accessibility (ARIA labels, keyboard navigation)
- Mobile-first responsive design

### File Structure: app/
(marketing)/          # Landing page, pricing
(auth)/               # Login, signup
(dashboard)/          # Main app
chat/               # Main chatbot interface
flashcards/         # Flashcard review
lessons/            # Audio lessons
analytics/          # Progress tracking
components/
ui/                   # shadcn components
chat/                 # Chat-specific components
features/             # Feature-specific components
lib/
supabase/             # Supabase client
api/                  # API integrations
hooks/                # Custom React hooks
utils/                # Helper functions
supabase/
migrations/           # Database migrations
functions/            # Edge Functions

### Naming Conventions:
- Components: PascalCase (ChatInterface.tsx)
- Utilities: camelCase (formatMessage.ts)
- Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)
- Database tables: snake_case (flashcard_sets)

### API Integration Rules:
- NEVER expose API keys in frontend
- All API calls through Supabase Edge Functions
- Implement rate limiting
- Graceful error handling with user-friendly messages
- Retry logic for failed requests
- Loading indicators for all API calls

## FEATURE SPECIFICATIONS

### 1. CHATBOT INTERFACE (Primary Interface)
**Design:**
- Clean, minimal design like Claude/ChatGPT
- Message bubbles with smooth animations
- Typing indicators
- Code syntax highlighting when relevant
- LaTeX rendering for math equations
- File upload zone (drag & drop)

**Behavior:**
- Stream responses (show text as it generates)
- Context aware (remembers conversation history)
- Auto-scroll to new messages
- Quick action buttons (Create Flashcards, Start Lesson, etc.)
- Smart feature suggestions appear inline

**Features Embedded in Chat:**
- "📚 Create Flashcards" button appears after explanations
- "🎧 Listen to this" for audio lessons
- "📊 Analyze this answer" for full marks feature
- "🎯 Practice quiz" to test understanding

### 2. FULL MARKS ANALYZER
**Purpose:** Deep technical analysis of student answers

**Input Methods:**
- Text paste
- File upload (PDF, DOCX, images)
- Voice input (transcribed)

**Analysis Output:**
- Current Score: X/100
- Strengths: What was done well
- Missing Elements: What's needed for full marks
- Specific Improvements: Actionable feedback
- Model Answer: Example of perfect answer
- Study Recommendations: Suggested flashcards/lessons

**Technical Details:**
- Use Gemini API for analysis
- Compare against marking rubrics
- Extract key concepts missed
- Generate improvement roadmap

### 3. AI LIVE LESSONS
**Purpose:** Interactive teaching sessions with voice

**Flow:**
1. User: "Teach me [topic]"
2. AI generates lesson plan
3. Starts interactive session
4. User can ask questions mid-lesson
5. AI adapts based on understanding

**Features:**
- Voice input/output (Deepgram + ElevenLabs/Web Speech)
- Visual aids (diagrams, examples)
- Practice questions throughout
- Progress checkpoints
- Can pause/resume
- Save lesson transcript

**Adaptive Learning:**
- If user struggles, slow down and add examples
- If user excels, increase difficulty
- Track comprehension in real-time

### 4. FLASHCARDS GENERATOR
**Generation:**
- From any content (text, PDF, YouTube, lessons)
- AI extracts key concepts automatically
- Front/back with optional hints
- Tags for organization

**Study Modes:**
- Standard Review: Flip through cards
- Speed Drill: Timed practice
- Hard Cards Only: Focus weak areas
- Learn Mode: New cards first

**Spaced Repetition:**
- SM-2 algorithm implementation
- Cards scheduled based on performance
- "Again", "Hard", "Good", "Easy" buttons
- Track retention metrics

**Features:**
- Edit cards inline
- Add images to cards
- Audio pronunciation for language learning
- Export/import decks
- Share with classmates

### 5. NOTES SUMMARIZER
**Input:**
- Upload PDFs, DOCX, images
- Paste text
- YouTube transcripts
- Lesson recordings

**Output:**
- Structured summary (bullet points)
- Key concepts highlighted
- Visual hierarchy (headers, subheaders)
- Suggested flashcards from summary
- Related topics to explore

**Smart Features:**
- Detect main topics automatically
- Extract definitions and formulas
- Identify important dates/facts
- Create concept maps

### 6. PODCAST CREATOR
**Purpose:** Convert any content to audio lessons

**Features:**
- Natural voice synthesis (ElevenLabs or Web Speech)
- Background music option
- Speed control (0.5x - 2x)
- Chapter markers
- Downloadable MP3
- Offline listening

**Use Cases:**
- Listen while commuting
- Review while exercising
- Accessibility for visual impairments
- Multi-tasking study

### 7. YOUTUBE EXTRACTOR
**Purpose:** Learn from YouTube educational content

**Process:**
1. User pastes YouTube URL
2. Extract transcript (YouTube Transcript API)
3. AI summarizes key points
4. Highlight important timestamps
5. Offer to create flashcards/notes

**Features:**
- Jump to specific timestamps
- Create notes from sections
- Generate quiz questions
- Save to study library

### 8. INTERACTIVE TEACHING (GIZMO MODE)
**Purpose:** Learn by doing, not just reading

**Flow:**User: "Teach me fractions"
AI: "Let's start with basics. What's 1/2 + 1/4?"
User: "3/4?"
AI: "Not quite! Let's think about it. If you have 1/2 of a pizza..."
[Guides with examples, not answers]
User: "Oh! It's 3/4?"
AI: "Exactly! Now try this: 2/3 + 1/6 = ?"

**Behavior:**
- Generate progressive difficulty questions
- Provide hints, not answers
- Celebrate correct answers
- Encourage on mistakes
- Track mastery level
- Adapt pacing to student

## ANALYTICS & TRACKING

### Events to Track (Amplitude):
- feature_used: {feature_name, timestamp}
- flashcard_created: {topic, count}
- lesson_started: {topic, duration}
- analysis_completed: {score, topic}
- youtube_extracted: {video_id, topic}
- quiz_taken: {score, topic, time_spent}
- daily_streak: {days_count}

### User Progress Metrics:
- Total study time
- Cards mastered
- Topics covered
- Lessons completed
- Improvement trajectory
- Retention rate
- Weak areas identified

## DESIGN SYSTEM

### Colors:
- Primary: #4F46E5 (Indigo)
- Secondary: #06B6D4 (Cyan)
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Background: #FFFFFF (White)
- Surface: #F9FAFB (Light Gray)
- Text Primary: #111827 (Near Black)
- Text Secondary: #6B7280 (Gray)

### Gradients:
- Hero: from-indigo-600 to-cyan-500
- Cards: from-indigo-50 to-cyan-50
- Buttons: from-indigo-600 to-indigo-700

### Typography:
- Headings: Inter (font-bold)
- Body: Inter (font-normal)
- Code: JetBrains Mono

### Spacing:
- Button padding: px-6 py-3
- Card padding: p-6
- Section spacing: space-y-8
- Border radius: rounded-3xl (25px)

### Animations:
- Page transitions: Dissolve fade (Framer Motion)
- Button hover: Scale 1.02, shadow increase
- Card hover: Lift effect (translateY -2px)
- Loading: Smooth skeleton screens
- Message appear: Fade up from bottom

## DATABASE SCHEMA

### users
- id: uuid (primary key)
- email: text
- created_at: timestamp
- preferences: jsonb (study preferences, notification settings)
- streak_count: integer
- total_study_time: integer (minutes)

### conversations
- id: uuid (primary key)
- user_id: uuid (foreign key)
- title: text (auto-generated from first message)
- created_at: timestamp
- updated_at: timestamp

### messages
- id: uuid (primary key)
- conversation_id: uuid (foreign key)
- role: text ('user' | 'assistant')
- content: text
- metadata: jsonb (tool calls, attachments, etc.)
- created_at: timestamp

### flashcard_sets
- id: uuid (primary key)
- user_id: uuid (foreign key)
- title: text
- description: text
- tags: text[]
- created_at: timestamp

### flashcards
- id: uuid (primary key)
- set_id: uuid (foreign key)
- front: text
- back: text
- hint: text (nullable)
- image_url: text (nullable)
- ease_factor: float (for SM-2)
- interval: integer (days until next review)
- repetitions: integer
- next_review: timestamp
- created_at: timestamp

### analyses
- id: uuid (primary key)
- user_id: uuid (foreign key)
- question: text
- answer: text (user's answer)
- score: integer (0-100)
- feedback: jsonb (strengths, missing, improvements)
- created_at: timestamp

### lessons
- id: uuid (primary key)
- user_id: uuid (foreign key)
- topic: text
- transcript: text
- duration: integer (seconds)
- audio_url: text (nullable)
- completed: boolean
- created_at: timestamp

### user_progress
- id: uuid (primary key)
- user_id: uuid (foreign key)
- date: date
- study_time: integer (minutes)
- cards_reviewed: integer
- lessons_completed: integer
- quizzes_taken: integer
- topics: text[]

## SECURITY & PERFORMANCE

### Security Checklist:
- ✅ All API keys in Supabase Secrets
- ✅ Row Level Security (RLS) on all tables
- ✅ Rate limiting on Edge Functions (10 req/min per user)
- ✅ Input validation with Zod schemas
- ✅ XSS prevention (sanitize user input)
- ✅ CSRF tokens for state-changing operations
- ✅ Secure file uploads (type/size validation)

### Performance Optimizations:
- ✅ Image optimization (Next.js Image component)
- ✅ Code splitting (dynamic imports)
- ✅ Lazy load heavy components
- ✅ Debounce search inputs
- ✅ Cache API responses (SWR or React Query)
- ✅ Optimize bundle size (<200KB initial)
- ✅ Lighthouse score >90

## ERROR HANDLING

### User-Facing Errors:
- Network error: "Couldn't connect. Check your internet."
- API error: "Something went wrong. Try again?"
- Rate limit: "You're going too fast! Take a break."
- Upload error: "File too large. Max 10MB please."

### Developer Errors:
- Log to Sentry with context
- Include user_id, action, timestamp
- Stack trace for debugging
- Never expose internal errors to users

## TESTING GUIDELINES

### Must Test:
- Chat message sending/receiving
- Flashcard spaced repetition logic
- File upload validation
- API rate limiting
- Authentication flow
- Mobile responsiveness
- Voice input/output
- YouTube URL extraction

### Edge Cases:
- Offline mode behavior
- Very long messages (>10K chars)
- Invalid file types
- Expired sessions
- Concurrent requests
- Empty states

## DEPLOYMENT

### Environment Variables:NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
DEEPGRAM_API_KEY=
ELEVENLABS_API_KEY=
AMPLITUDE_API_KEY=
SENTRY_DSN=

### Pre-Deploy Checklist:
- ✅ Run type check: `npm run type-check`
- ✅ Run linter: `npm run lint`
- ✅ Build succeeds: `npm run build`
- ✅ All env vars set in Vercel
- ✅ Database migrations applied
- ✅ Edge Functions deployed
- ✅ Analytics connected

## AI PROMPTING GUIDELINES

### When Generating AI Responses:
- Always maintain educational focus
- Ask follow-up questions to assess understanding
- Provide examples before asking practice questions
- Celebrate progress ("Great job!", "You're getting it!")
- Offer help on mistakes ("Let's try another way...")
- Connect new concepts to prior knowledge

### System Prompts for Features:

**Full Marks Analyzer:**

You are an expert educational assessor. Analyze the student's answer against the marking rubric. Provide:

Current score with justification
What was done well (strengths)
Missing elements for full marks
Specific, actionable improvements
A model answer example
Be constructive and encouraging.


**Interactive Teacher:**You are a patient, encouraging teacher. When teaching a topic:

Start with fundamentals
Use real-world examples
Generate practice questions
Guide with hints, not answers
Adapt difficulty based on responses
Celebrate understanding
Never just give the answer - help them discover it.


**Flashcard Generator:**Create flashcards from the content. Each card should:

Front: Clear, specific question
Back: Concise, complete answer
Focus on one concept per card
Use active recall format
Include context if needed
Aim for 10-15 cards per topic.


## IMPORTANT REMINDERS

### Always Remember:
1. **Education First**: This is a learning tool, not just an answer machine
2. **One Interface**: All features live in the chatbot - no scattered UI
3. **Smart Suggestions**: AI should proactively recommend relevant features
4. **Teach, Don't Tell**: Guide users to understanding, don't just provide solutions
5. **Context Aware**: Remember conversation history for better recommendations
6. **Mobile-First**: Many students study on phones
7. **Accessibility**: Make learning accessible to all students
8. **Privacy**: Student data is sensitive - handle with care

### Code Review Checklist:
- [ ] Does this teach or just tell?
- [ ] Is the UI intuitive for students?
- [ ] Are loading states present?
- [ ] Is error handling user-friendly?
- [ ] Is this accessible (a11y)?
- [ ] Is this mobile-responsive?
- [ ] Are API keys secure?
- [ ] Is user data protected?

---

END OF PROJECT RULES