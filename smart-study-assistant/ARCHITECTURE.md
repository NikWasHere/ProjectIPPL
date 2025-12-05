# 📚 Smart Study Assistant - Architecture & Documentation

## 🎯 Deskripsi Project

**Smart Study Assistant** adalah aplikasi web berbasis AI yang membantu siswa/mahasiswa dalam:
- 🤖 **Generate Quiz** otomatis (pilihan ganda & essay) dari text/PDF
- 📝 **Generate Summary** otomatis dengan key points
- 💾 **History Management** untuk menyimpan hasil quiz dan summary
- 🔐 **Authentication** dengan Google, GitHub, atau Credentials

**Tech Stack:**
- **Frontend:** Next.js 15.5.4, React, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes (Server-side)
- **Database:** SQLite + Prisma ORM
- **AI/ML:** Qwen2 7B (Local via Ollama), Gemini API (Fallback)
- **Auth:** NextAuth.js v5

---

## 📁 Struktur Folder Project

```
smart-study-assistant/
├── prisma/
│   └── schema.prisma              # Database schema (models & relations)
│
├── public/                        # Static assets
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # Backend API Routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts   # NextAuth handler
│   │   │   │   └── register/
│   │   │   │       └── route.ts   # User registration
│   │   │   │
│   │   │   ├── generate-quiz/
│   │   │   │   └── route.ts       # Quiz generation endpoint
│   │   │   │
│   │   │   ├── generate-summary/
│   │   │   │   └── route.ts       # Summary generation endpoint
│   │   │   │
│   │   │   ├── extract-text/
│   │   │   │   └── route.ts       # PDF text extraction
│   │   │   │
│   │   │   ├── history/
│   │   │   │   └── route.ts       # Get user history
│   │   │   │
│   │   │   ├── quiz/[id]/
│   │   │   │   └── route.ts       # Get/Delete specific quiz
│   │   │   │
│   │   │   └── summary/[id]/
│   │   │       └── route.ts       # Get/Delete specific summary
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page (main UI)
│   │   └── globals.css            # Global styles
│   │
│   ├── components/                # React components
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── loader.tsx
│   │   │
│   │   ├── AuthModal.tsx          # Login/Signup modal
│   │   ├── FileUpload.tsx         # PDF upload component
│   │   ├── HistorySidebar.tsx     # History sidebar
│   │   ├── Logo.tsx               # App logo
│   │   └── UserMenu.tsx           # User profile menu
│   │
│   └── lib/                       # Backend logic & utilities
│       ├── auth.ts                # NextAuth configuration
│       ├── db.ts                  # Prisma client instance
│       ├── gemini.ts              # Gemini AI integration
│       ├── qwen2-local.ts         # Qwen2 Local (Ollama) integration
│       ├── huggingface.ts         # Groq API integration (backup)
│       ├── rate-limit.ts          # Rate limiting
│       ├── helpers.ts             # Helper functions
│       ├── constants.ts           # App constants
│       └── utils.ts               # Utility functions
│
├── test-qwen2.js                  # Test script untuk Qwen2
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── next.config.ts                 # Next.js config
├── .env                           # Environment variables
└── README.md                      # Project README
```

---

## 🗄️ Database Schema (Prisma)

### **File:** `prisma/schema.prisma`

### **Tables & Models:**

#### 1️⃣ **User** (Users table)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Hashed password untuk credentials
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts  Account[]   // OAuth accounts (Google, GitHub)
  sessions  Session[]   // Login sessions
  documents Document[]  // Uploaded documents
  quizzes   Quiz[]      // Generated quizzes
  summaries Summary[]   // Generated summaries
}
```

**Purpose:** Menyimpan data user (email, password, profile)

---

#### 2️⃣ **Account** (OAuth Accounts)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String  // "google" | "github"
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

**Purpose:** Menyimpan OAuth account data (Google/GitHub login)

---

#### 3️⃣ **Session** (Login Sessions)
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Purpose:** Menyimpan session data untuk autentikasi

---

#### 4️⃣ **Document** (Uploaded Documents)
```prisma
model Document {
  id          String   @id @default(cuid())
  userId      String?
  title       String
  content     String   // Text content (extracted from PDF/text input)
  fileName    String?
  fileType    String   @default("text")  // "text" | "pdf"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizzes   Quiz[]     // Quizzes generated from this document
  summaries Summary[]  // Summaries generated from this document
}
```

**Purpose:** Menyimpan document yang diupload user (text atau PDF)

---

#### 5️⃣ **Quiz** (Generated Quizzes)
```prisma
model Quiz {
  id         String   @id @default(cuid())
  userId     String?
  documentId String
  title      String
  type       QuizType @default(MULTIPLE_CHOICE)  // MULTIPLE_CHOICE | ESSAY
  questions  Json     // Array of questions (JSON format)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  user     User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
}

enum QuizType {
  MULTIPLE_CHOICE
  ESSAY
}
```

**Purpose:** Menyimpan quiz yang di-generate oleh AI

**Questions JSON Format:**
```json
[
  {
    "question": "Apa itu fotosintesis?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "...",
    "type": "multiple_choice"
  }
]
```

---

#### 6️⃣ **Summary** (Generated Summaries)
```prisma
model Summary {
  id         String      @id @default(cuid())
  userId     String?
  documentId String
  title      String
  content    String      // Summary text + key points
  type       SummaryType @default(PARAGRAPH)  // PARAGRAPH | BULLET_POINTS
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  
  user     User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
}

enum SummaryType {
  PARAGRAPH
  BULLET_POINTS
}
```

**Purpose:** Menyimpan summary yang di-generate oleh AI

---

## 🔄 Alur Kerja (Workflow)

### **1. Generate Quiz Flow**

```mermaid
graph TD
    A[User Input Text/PDF] --> B{Upload PDF?}
    B -->|Yes| C[POST /api/extract-text]
    B -->|No| D[Use Text Input]
    C --> E[Extract Text from PDF]
    E --> D
    D --> F[POST /api/generate-quiz]
    F --> G{Check Auth}
    G -->|Logged In| H[Rate Limit by User ID]
    G -->|Guest| I[Rate Limit by IP]
    H --> J{Valid Input?}
    I --> J
    J -->|No| K[Return 400 Error]
    J -->|Yes| L[Call AI Provider]
    L --> M{Qwen2 Available?}
    M -->|Yes| N[Generate with Qwen2 Local]
    M -->|No| O{Gemini Available?}
    O -->|Yes| P[Generate with Gemini]
    O -->|No| Q[Use Mock Data]
    N --> R[Parse JSON Response]
    P --> R
    Q --> R
    R --> S{Save to DB?}
    S -->|Yes| T[Save to Database]
    S -->|No| U[Skip Save]
    T --> V[Return Questions JSON]
    U --> V
    V --> W[Display in UI]
```

**Step-by-Step:**

1. **User Input** (`page.tsx`):
   - User paste text atau upload PDF
   - Click "Buat Kuis" button

2. **PDF Extraction** (jika upload PDF):
   - Frontend call: `POST /api/extract-text`
   - Backend extract text using PDF parser
   - Return extracted text

3. **Generate Quiz Request**:
   - Frontend call: `POST /api/generate-quiz`
   - Body: `{ text, type: 'multiple_choice', count: 5 }`

4. **Backend Processing** (`src/app/api/generate-quiz/route.ts`):
   ```typescript
   export async function POST(request: NextRequest) {
     // 1. Get session (auth)
     const session = await auth()
     
     // 2. Rate limiting
     const ip = request.headers.get('x-forwarded-for') || 'unknown'
     await aiLimiter.consume(ip)
     
     // 3. Validate input
     if (!text || text.length < 50) {
       return NextResponse.json({ error: '...' }, { status: 400 })
     }
     
     // 4. Try AI providers (fallback chain)
     try {
       // Priority 1: Qwen2 Local (FREE, FAST, OFFLINE)
       questions = await generateQuizWithQwen2(text, type, count)
     } catch {
       try {
         // Priority 2: Gemini (quota limited)
         questions = await generateQuizWithGemini(text, type, count)
       } catch {
         // Priority 3: Mock data
         questions = generateMockQuestions(type, count)
       }
     }
     
     // 5. Save to database (if logged in)
     if (session?.user?.id) {
       const doc = await prisma.document.create({...})
       await prisma.quiz.create({...})
     }
     
     // 6. Return response
     return NextResponse.json({ questions, success: true })
   }
   ```

5. **AI Generation** (`src/lib/qwen2-local.ts`):
   ```typescript
   export async function generateQuizWithQwen2(
     text: string,
     type: 'multiple_choice' | 'essay',
     count: number = 5
   ) {
     const prompt = `Buatlah ${count} soal ${type} dari teks berikut:
     
     ${text}
     
     Format JSON:
     {
       "questions": [
         {
           "question": "...",
           "options": ["A", "B", "C", "D"],
           "correctAnswer": "A",
           "explanation": "...",
           "type": "multiple_choice"
         }
       ]
     }`
     
     // Call Ollama API
     const response = await axios.post('http://localhost:11434/api/generate', {
       model: 'qwen2:7b',
       prompt: prompt,
       stream: false,
       format: 'json'
     })
     
     // Parse & validate response
     const result = JSON.parse(response.data.response)
     return result.questions
   }
   ```

6. **Display Result** (`page.tsx`):
   - Frontend receive questions array
   - Render quiz questions with options
   - Show correct answers

---

### **2. Generate Summary Flow**

```mermaid
graph TD
    A[User Input Text/PDF] --> B[POST /api/generate-summary]
    B --> C{Check Auth}
    C --> D[Rate Limiting]
    D --> E{Valid Input?}
    E -->|No| F[Return 400 Error]
    E -->|Yes| G[Call AI Provider]
    G --> H{Qwen2 Available?}
    H -->|Yes| I[Generate with Qwen2]
    H -->|No| J{Gemini Available?}
    J -->|Yes| K[Generate with Gemini]
    J -->|No| L[Use Mock Data]
    I --> M[Parse Response]
    K --> M
    L --> M
    M --> N{Save to DB?}
    N -->|Yes| O[Save Summary]
    N -->|No| P[Skip Save]
    O --> Q[Return Summary JSON]
    P --> Q
    Q --> R[Display in UI]
```

**Backend:** `src/app/api/generate-summary/route.ts`

**AI Logic:** `src/lib/qwen2-local.ts` → `generateSummaryWithQwen2()`

**Response Format:**
```json
{
  "summary": "Ringkasan lengkap dalam paragraf...",
  "keyPoints": [
    "Poin penting 1",
    "Poin penting 2",
    "Poin penting 3"
  ],
  "originalLength": 1000,
  "summaryLength": 250,
  "compressionRatio": 25
}
```

---

### **3. Authentication Flow**

```mermaid
graph TD
    A[User Click Login] --> B{Login Method?}
    B -->|Google| C[NextAuth Google OAuth]
    B -->|GitHub| D[NextAuth GitHub OAuth]
    B -->|Email| E[POST /api/auth/register or Login]
    C --> F[Create/Update User in DB]
    D --> F
    E --> G{New User?}
    G -->|Yes| H[Hash Password with bcrypt]
    G -->|No| I[Verify Password]
    H --> J[Create User]
    I --> K{Password Match?}
    K -->|Yes| L[Create Session]
    K -->|No| M[Return Error]
    J --> L
    F --> L
    L --> N[Set Session Cookie]
    N --> O[User Logged In]
```

**Auth Config:** `src/lib/auth.ts`

**Providers:**
1. **Google OAuth** - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
2. **GitHub OAuth** - `GITHUB_ID`, `GITHUB_SECRET`
3. **Credentials** - Email + Password (hashed with bcrypt)

**Session Management:**
- NextAuth.js v5 handles session
- Session stored in database (SQLite)
- Cookie-based authentication

---

### **4. History Management Flow**

```mermaid
graph TD
    A[User Click History] --> B[GET /api/history]
    B --> C{Check Auth}
    C -->|Not Logged In| D[Return 401]
    C -->|Logged In| E[Query Database]
    E --> F[Get User's Quizzes & Summaries]
    F --> G[Sort by Date]
    G --> H[Return JSON]
    H --> I[Display in Sidebar]
    I --> J{User Action?}
    J -->|View| K[GET /api/quiz/:id or /api/summary/:id]
    J -->|Delete| L[DELETE /api/quiz/:id or /api/summary/:id]
    K --> M[Display Content]
    L --> N[Remove from DB]
    N --> O[Refresh List]
```

**Endpoints:**
- `GET /api/history` - Get all user's quizzes & summaries
- `GET /api/quiz/[id]` - Get specific quiz
- `DELETE /api/quiz/[id]` - Delete quiz
- `GET /api/summary/[id]` - Get specific summary
- `DELETE /api/summary/[id]` - Delete summary

---

## 🤖 AI Provider Integration

### **Priority Order:**

```
1. Qwen2 7B Local (Ollama)  ← PRIMARY
   ├─ 100% FREE
   ├─ OFFLINE (no internet needed)
   ├─ FAST inference
   ├─ PRIVACY (data tidak keluar)
   └─ Requires: Ollama installed + model downloaded

2. Gemini 2.0 Flash Lite    ← FALLBACK #1
   ├─ FREE tier (quota limited)
   ├─ Online (requires internet)
   ├─ Fast & reliable
   └─ Requires: GEMINI_API_KEY

3. Mock Data                ← FALLBACK #2
   └─ Hardcoded sample data (for demo/testing)
```

### **Qwen2 Local Configuration:**

**File:** `src/lib/qwen2-local.ts`

**Setup:**
```bash
# 1. Install Ollama
Download from: https://ollama.com/

# 2. Download Qwen2 model
ollama pull qwen2:7b

# 3. Start Ollama server
ollama serve
```

**API Endpoint:** `http://localhost:11434/api/generate`

**Model:** `qwen2:7b` (4.4GB, 7 billion parameters)

---

### **Gemini Configuration:**

**File:** `src/lib/gemini.ts`

**Environment Variable:**
```env
GEMINI_API_KEY=AIzaSyBndhiFjhlB2pOF20MXxVoMBSFVn80fHoQ
```

**Model:** `gemini-2.0-flash-lite-001`

**API:** `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite-001:generateContent`

---

## 🔐 Environment Variables

**File:** `.env`

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# AI Providers
GEMINI_API_KEY="AIzaSyBndhiFjhlB2pOF20MXxVoMBSFVn80fHoQ"
HUGGINGFACE_API_KEY="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"
GROQ_API_KEY="your-groq-api-key-here"

# Note: Qwen2 Local (Ollama) tidak perlu API key!
```

---

## 🚀 How to Run

### **Prerequisites:**
1. Node.js 18+ installed
2. Ollama installed (untuk Qwen2)
3. Qwen2 model downloaded

### **Steps:**

```bash
# 1. Install dependencies
cd smart-study-assistant
npm install

# 2. Setup database
npx prisma generate
npx prisma db push

# 3. Start Ollama server (Terminal 1)
ollama serve

# 4. Verify Qwen2 model
ollama list  # Should show qwen2:7b

# 5. Start Next.js dev server (Terminal 2)
npm run dev

# 6. Open browser
http://localhost:3000
```

### **Test AI Integration:**

```bash
# Test Qwen2 with script
node test-qwen2.js

# Expected output:
# ✅ Qwen2 Local generation successful
# 📊 Generated 5 questions
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/generate-quiz` | Generate quiz dari text | ❌ No |
| `POST` | `/api/generate-summary` | Generate summary dari text | ❌ No |
| `POST` | `/api/extract-text` | Extract text dari PDF | ❌ No |
| `GET` | `/api/history` | Get user's history | ✅ Yes |
| `GET` | `/api/quiz/[id]` | Get specific quiz | ✅ Yes |
| `DELETE` | `/api/quiz/[id]` | Delete quiz | ✅ Yes |
| `GET` | `/api/summary/[id]` | Get specific summary | ✅ Yes |
| `DELETE` | `/api/summary/[id]` | Delete summary | ✅ Yes |
| `POST` | `/api/auth/register` | Register new user | ❌ No |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handlers | ❌ No |
| `GET` | `/api/health` | Health check | ❌ No |

---

## 🔧 Key Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| `next` | Framework | 15.5.4 |
| `react` | UI Library | 19.x |
| `prisma` | ORM | Latest |
| `next-auth` | Authentication | v5 |
| `axios` | HTTP Client | Latest |
| `@google/generative-ai` | Gemini API | Latest |
| `bcryptjs` | Password Hashing | Latest |
| `lucide-react` | Icons | Latest |
| `tailwindcss` | CSS Framework | Latest |

---

## 💡 Features

### **Core Features:**
✅ Generate quiz (multiple choice & essay)
✅ Generate summary (paragraph & bullet points)
✅ Upload PDF support
✅ Save history (untuk logged in users)
✅ Copy to clipboard
✅ Real-time loading states
✅ Error handling with retry

### **AI Features:**
✅ Multi-provider fallback (Qwen2 → Gemini → Mock)
✅ Local inference with Qwen2 (offline mode)
✅ Rate limiting (prevent abuse)
✅ Smart prompt engineering
✅ JSON response parsing

### **Auth Features:**
✅ Google OAuth login
✅ GitHub OAuth login
✅ Email/Password login
✅ User registration
✅ Session management
✅ Protected routes

### **UX Features:**
✅ Responsive design (mobile-friendly)
✅ Loading animations
✅ Error messages
✅ Success feedback
✅ History sidebar
✅ User profile menu

---

## 🐛 Troubleshooting

### **Qwen2 tidak jalan:**
```bash
# Check Ollama running
ollama list

# Restart Ollama
taskkill /F /IM ollama.exe
ollama serve
```

### **Database error:**
```bash
# Reset database
npx prisma db push --force-reset

# Regenerate Prisma client
npx prisma generate
```

### **Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

---

## 📝 Development Notes

### **Code Style:**
- TypeScript strict mode enabled
- ESLint configured
- Prettier for formatting
- Comments in Bahasa Indonesia (untuk clarity)

### **Best Practices:**
- Error handling with try-catch
- Type safety dengan TypeScript
- Database transactions untuk data integrity
- Rate limiting untuk API protection
- Environment variables untuk secrets

### **Testing:**
- Manual testing via browser UI
- Test scripts: `test-qwen2.js`
- API testing dengan curl/Postman

---

## 🎯 Future Improvements

- [ ] Add unit tests (Jest)
- [ ] Add e2e tests (Playwright)
- [ ] Improve AI prompt engineering
- [ ] Add more quiz types (true/false, matching)
- [ ] Export quiz to PDF/DOCX
- [ ] Add quiz attempt tracking (score, time)
- [ ] Add flashcards feature
- [ ] Improve PDF parsing (images, tables)
- [ ] Add collaboration features
- [ ] Deploy to production (Vercel)

---

## 👨‍💻 Developer Guide

### **Adding New AI Provider:**

1. Create file: `src/lib/new-provider.ts`
2. Implement functions:
   - `generateQuizWithNewProvider()`
   - `generateSummaryWithNewProvider()`
3. Update API routes:
   - `src/app/api/generate-quiz/route.ts`
   - `src/app/api/generate-summary/route.ts`
4. Add to fallback chain

### **Adding New Database Model:**

1. Update: `prisma/schema.prisma`
2. Run: `npx prisma db push`
3. Run: `npx prisma generate`
4. Create API route for CRUD operations
5. Update types in components

### **Adding New UI Component:**

1. Create: `src/components/NewComponent.tsx`
2. Import in `page.tsx`
3. Add to UI layout
4. Style with TailwindCSS

---

## 📞 Contact & Support

**Project:** Smart Study Assistant  
**Version:** 1.0.0  
**Last Updated:** December 6, 2025  

**Repository:** [GitHub - ProjectIPPL](https://github.com/NikWasHere/ProjectIPPL)

---

**Happy Coding! 🚀**
