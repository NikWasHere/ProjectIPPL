# SmartStudy AI - Asisten Belajar Cerdas 🧠

Website asisten belajar cerdas yang responsive menggunakan Next.js dan MySQL. Aplikasi ini membantu mengubah materi pembelajaran menjadi kuis interaktif atau ringkasan yang mudah dipahami dengan bantuan kecerdasan buatan.

## ✨ Fitur Utama

### 📚 Input Materi
- **Upload PDF**: Upload file PDF dan ekstrak teks secara otomatis
- **Input Manual**: Masukkan teks materi pembelajaran langsung
- **Validasi File**: Validasi ukuran dan format file PDF

### 🎯 Mode Pembelajaran
- **Kuis Otomatis**: 
  - Pilihan Ganda dengan 4 opsi jawaban
  - Esai dengan panduan jawaban
  - Pengacakan pertanyaan berdasarkan materi
- **Ringkasan Cerdas**:
  - Poin-poin kunci dari materi
  - Kompresi teks yang efektif
  - Format yang mudah dibaca

### 💡 Fitur Tambahan
- **Salin Hasil**: Copy hasil kuis/ringkasan dengan satu klik
- **Responsive Design**: Tampilan optimal di semua perangkat
- **Loading Indicator**: Feedback visual saat pemrosesan
- **Error Handling**: Pesan error yang informatif

## 🛠️ Teknologi

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Database**: MySQL dengan Prisma ORM
- **PDF Processing**: PDF-Parse library
- **UI Components**: Custom shadcn/ui components

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables (buat .env.local)
DATABASE_URL="mysql://username:password@localhost:3306/smart_study_assistant"

# Generate Prisma Client
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📖 Cara Penggunaan

### 1. Input Materi
- **Upload PDF**: Klik tombol upload atau drag & drop file PDF
- **Input Manual**: Ketik atau paste teks di textarea

### 2. Pilih Mode
- **Kuis**: Untuk membuat pertanyaan dari materi
- **Ringkasan**: Untuk meringkas materi menjadi poin-poin kunci

### 3. Pilih Tipe (khusus Kuis)
- **Pilihan Ganda**: 4 pilihan dengan 1 jawaban benar
- **Esai**: Pertanyaan terbuka dengan panduan jawaban

### 4. Generate & Salin
- Klik tombol "Generate" untuk memproses
- Gunakan tombol "Salin" untuk copy hasil

## 🏗️ Struktur Project

```
smart-study-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── extract-text/          # PDF text extraction
│   │   │   ├── generate-quiz/         # Quiz generation
│   │   │   └── generate-summary/      # Summary generation
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   ├── FileUpload.tsx            # PDF upload component
│   │   └── Logo.tsx                  # Brand logo
│   └── lib/
│       ├── db.ts                     # Database connection
│       └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma                 # Database schema
└── public/                           # Static assets
```

## 🎨 Design System (Monochrome)

- **Primary**: Gray-900 (#111827)
- **Secondary**: Gray-600 (#4B5563) 
- **Background**: White (#FFFFFF)
- **Surface**: Gray-50 (#F9FAFB)
- **Typography**: Geist Sans & Mono

## 📱 Responsive Design

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🔧 Kustomisasi

### Menambah AI Provider Real
Edit file API routes untuk mengintegrasikan dengan OpenAI atau provider AI lainnya:

```typescript
// src/app/api/generate-quiz/route.ts
const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: prompt }]
})
```

## 📄 API Endpoints

- `POST /api/extract-text` - Ekstrak teks dari PDF
- `POST /api/generate-quiz` - Generate kuis dari teks  
- `POST /api/generate-summary` - Generate ringkasan dari teks

## 🚀 Deployment

### Vercel (Recommended)
1. Push ke GitHub
2. Connect di Vercel
3. Setup environment variables
4. Deploy

### Build Production
```bash
npm run build
npm start
```

---

**SmartStudy AI** - Membuat pembelajaran lebih efektif dengan kecerdasan buatan! 🎓✨
