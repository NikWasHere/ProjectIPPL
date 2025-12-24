# Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SRS)

**Asisten Belajar Cerdas (Smart Study Assistant)**  
**Quiz & Summary Generator dengan AI**

**Versi:** 1.0  
**Tanggal:** 9 Desember 2024

---

## BAB 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini bertujuan untuk mendefinisikan secara detail dan lengkap semua kebutuhan fungsional dan non-fungsional untuk projek perangkat lunak **"Asisten Belajar Cerdas (Smart Study Assistant)"**. Dokumen ini menjadi acuan utama bagi pengembang selama siklus hidup pengembangan, pengujian, dan evaluasi proyek.

### 1.2 Ruang Lingkup

Perangkat lunak yang akan dikembangkan adalah sebuah **aplikasi web** yang berfungsi sebagai alat bantu belajar berbasis AI. Ruang lingkup utamanya meliputi:

1. **Input Fleksibel**: Menerima materi pelajaran dari berbagai sumber, termasuk:
   - Input teks langsung (copy-paste)
   - Unggahan file PDF

2. **Generasi Kuis Otomatis**: Menghasilkan dua jenis kuis dari materi yang diberikan:
   - **Pilihan Ganda (Multiple Choice Questions - MCQ)**: Lengkap dengan pilihan jawaban yang salah (distractor)
   - **Esai (Essay Questions)**: Pertanyaan terbuka untuk menguji pemahaman mendalam

3. **Generasi Ringkasan Otomatis**: Membuat ringkasan (summary) yang padat dan informatif dari materi pelajaran dalam dua format:
   - **Paragraph**: Ringkasan dalam bentuk paragraf
   - **Bullet Points**: Ringkasan dalam bentuk poin-poin

4. **Sistem Autentikasi**: Login dan registrasi pengguna dengan berbagai metode:
   - Email & Password
   - Google OAuth
   - GitHub OAuth

5. **History Management**: Menyimpan, melihat, dan menghapus riwayat quiz dan summary yang pernah dibuat (untuk pengguna yang login)

6. **Database Persistence**: Penyimpanan data pengguna dan history secara permanen dengan SQLite database

### 1.3 Target Pengguna

1. **Mahasiswa/Siswa**: Sebagai pengguna utama untuk membuat latihan soal dan ringkasan materi untuk mempersiapkan diri sebelum ujian
2. **Guru/Dosen**: Sebagai alat bantu untuk membuat bank soal atau materi dengan lebih cepat dan efisien
3. **Pelajar Mandiri**: Individu yang ingin meningkatkan pemahaman materi secara otodidak

### 1.4 Definisi dan Akronim

| Akronim | Kepanjangan | Deskripsi |
|---------|-------------|-----------|
| **AI** | Artificial Intelligence | Kecerdasan Buatan |
| **ML** | Machine Learning | Pembelajaran Mesin |
| **NLP** | Natural Language Processing | Pemrosesan Bahasa Alami |
| **SRS** | Software Requirements Specification | Spesifikasi Kebutuhan Perangkat Lunak |
| **PDF** | Portable Document Format | Format dokumen portabel |
| **MCQ** | Multiple Choice Question | Pertanyaan Pilihan Ganda |
| **UI** | User Interface | Antarmuka Pengguna |
| **API** | Application Programming Interface | Antarmuka Pemrograman Aplikasi |
| **OAuth** | Open Authorization | Protokol otorisasi terbuka |
| **JWT** | JSON Web Token | Token autentikasi berbasis JSON |
| **ORM** | Object-Relational Mapping | Pemetaan objek ke database relasional |

---

## BAB 2. DESKRIPSI UMUM

### 2.1 Perspektif Produk

Produk ini adalah **sistem web independen** yang tidak bergantung pada perangkat lunak lain, selain browser untuk mengaksesnya. Sistem ini memanfaatkan teknologi AI modern:

- **AI Engine Utama**: **Qwen2 7B** (model bahasa besar yang berjalan secara lokal via Ollama)
- **AI Fallback**: **Google Gemini API** (cadangan jika Ollama tidak tersedia)
- **Mock Data Fallback**: Data contoh jika kedua AI tidak tersedia (development mode)

**Arsitektur Sistem:**
```
Browser (Client) 
    ↓
Next.js App (Frontend + Backend API)
    ↓
┌─────────────────────────────────┐
│  AI Priority Chain:             │
│  1. Qwen2 (Local Ollama)        │
│  2. Gemini API (Fallback)       │
│  3. Mock Data (Dev Mode)        │
└─────────────────────────────────┘
    ↓
SQLite Database (via Prisma ORM)
```

### 2.2 Fungsi-Fungsi Sistem

Sistem ini menyediakan fungsi-fungsi berikut:

#### 2.2.1 Fungsi Input & Ekstraksi
- **Ekstraksi Teks**: Sistem mampu mengekstrak teks dari file PDF dan input teks langsung
- **Validasi Input**: Sistem memvalidasi input (minimal panjang teks, format file, ukuran file)

#### 2.2.2 Fungsi AI & NLP
- **Analisis Konten**: Sistem menggunakan model NLP untuk memahami konteks dan informasi kunci dari teks yang diberikan
- **Generate Pertanyaan**: Berdasarkan analisis, sistem menghasilkan pertanyaan essay dan pilihan ganda
- **Generate Distractor**: Untuk MCQ, sistem menghasilkan pilihan jawaban salah (distractor) yang relevan dan masuk akal
- **Generate Ringkasan**: Sistem menghasilkan ringkasan abstrak (membuat kalimat baru) atau ekstraktif (mengambil kalimat penting)

#### 2.2.3 Fungsi Autentikasi & User Management
- **Register**: Pengguna dapat mendaftar dengan email & password
- **Login**: Pengguna dapat login dengan:
  - Email & Password (Credentials)
  - Google OAuth
  - GitHub OAuth
- **Session Management**: Sistem mengelola sesi pengguna dengan aman menggunakan JWT tokens
- **Logout**: Pengguna dapat keluar dari sistem

#### 2.2.4 Fungsi History Management
- **Simpan History**: Sistem menyimpan hasil quiz dan summary ke database (hanya untuk user yang login)
- **View History**: Pengguna dapat melihat riwayat quiz dan summary yang pernah dibuat
- **Delete History**: Pengguna dapat menghapus item history yang tidak diperlukan
- **Persistence**: History disimpan secara permanen di SQLite database

#### 2.2.5 Fungsi Output & Penyajian
- **Penyajian Hasil**: Sistem menampilkan kuis dan ringkasan dalam format yang jelas dan mudah dibaca
- **Copy to Clipboard**: Hasil dapat disalin ke clipboard dengan satu klik
- **Download**: Hasil dapat diunduh sebagai file teks

### 2.3 Karakteristik Pengguna

Pengguna sistem ini memiliki karakteristik sebagai berikut:

| Karakteristik | Deskripsi |
|---------------|-----------|
| **Literasi Digital** | Dasar hingga menengah - mampu mengoperasikan browser web |
| **Pengetahuan Teknis** | Tidak memerlukan pengetahuan teknis khusus |
| **Perangkat** | PC, laptop, atau tablet dengan browser modern |
| **Koneksi Internet** | Diperlukan untuk akses sistem (AI lokal tetap memerlukan server lokal) |
| **Materi Belajar** | Memiliki materi dalam bentuk digital (teks atau PDF berbasis teks) |

### 2.4 Batasan

#### 2.4.1 Batasan Bahasa
- Sistem ini difokuskan untuk memproses teks dalam **Bahasa Indonesia** dan **Bahasa Inggris**
- Hasil output akan disesuaikan dengan bahasa input

#### 2.4.2 Batasan Teknis
- **Dependensi AI**: 
  - Sistem memerlukan **Ollama server running** untuk AI lokal (Qwen2)
  - Dengan **Gemini API** sebagai fallback jika Ollama tidak tersedia
  - Mock data tersedia untuk development/testing tanpa AI
  
- **Format Input**: 
  - Sistem hanya mendukung input teks dan file **PDF berbasis teks**
  - **TIDAK mendukung** PDF hasil scan/gambar (OCR tidak tersupport)
  
- **Ukuran File**: 
  - Maksimal ukuran file PDF: **10 MB**
  - Maksimal panjang teks: **50,000 karakter**

#### 2.4.3 Batasan Kualitas
- **Kualitas Hasil**: Kualitas pertanyaan dan ringkasan yang dihasilkan bersifat probabilistik dan mungkin tidak selalu 100% sempurna atau akurat secara pedagogis
- **Variasi Output**: Hasil dapat bervariasi tergantung pada kualitas input dan performa model AI

#### 2.4.4 Batasan Operasional
- **Rate Limiting**: Maksimal 10 requests per menit per user untuk mencegah penyalahgunaan
- **Session Timeout**: Sesi pengguna akan berakhir setelah 7 hari tidak aktif

---

## BAB 3. KEBUTUHAN SPESIFIK

### 3.1 Kebutuhan Fungsional

#### 3.1.1 Fungsi Input

##### F-INPUT-001: Unggah File PDF
- **Deskripsi**: Pengguna dapat mengunggah file PDF dari perangkat lokal
- **Input**: File PDF (ukuran maksimal 10 MB)
- **Proses**: 
  1. Validasi format file (harus PDF)
  2. Validasi ukuran file (< 10 MB)
  3. Upload ke server untuk diproses
- **Output**: Konfirmasi upload berhasil atau error message
- **Prioritas**: TINGGI

##### F-INPUT-002: Input Teks Langsung
- **Deskripsi**: Pengguna dapat menyalin-tempel teks ke dalam area teks interface
- **Input**: Teks (minimal 100 karakter, maksimal 50,000 karakter)
- **Proses**: Validasi panjang teks
- **Output**: Konfirmasi teks siap diproses atau error message
- **Prioritas**: TINGGI

##### F-INPUT-003: Ekstraksi Teks dari PDF
- **Deskripsi**: Sistem mampu mengekstrak seluruh konten teks yang dapat dibaca dari file PDF yang diupload
- **Input**: File PDF
- **Proses**: 
  1. Parse PDF menggunakan library PDF parser
  2. Ekstrak semua teks
  3. Cleaning teks (hapus karakter khusus yang tidak perlu)
- **Output**: Teks yang terekstrak atau error jika PDF tidak valid/tidak ada teks
- **Prioritas**: TINGGI

#### 3.1.2 Fungsi Pemilihan Mode & Opsi

##### F-MODE-001: Pilihan Mode Utama
- **Deskripsi**: Pengguna dapat memilih antara:
  - Buat Quiz
  - Buat Ringkasan (Summary)
- **Input**: Pilihan user (radio button atau tabs)
- **Output**: UI berubah sesuai mode yang dipilih
- **Prioritas**: TINGGI

##### F-MODE-002: Pilihan Tipe Quiz
- **Deskripsi**: Ketika mode "Buat Quiz" dipilih, pengguna dapat memilih tipe quiz:
  - Multiple Choice (Pilihan Ganda)
  - Essay (Uraian)
- **Input**: Pilihan user
- **Output**: UI menampilkan opsi sesuai tipe quiz
- **Prioritas**: TINGGI

##### F-MODE-003: Pilihan Format Summary
- **Deskripsi**: Ketika mode "Buat Ringkasan" dipilih, pengguna dapat memilih format:
  - Paragraph (Paragraf)
  - Bullet Points (Poin-poin)
- **Input**: Pilihan user
- **Output**: UI menampilkan opsi sesuai format summary
- **Prioritas**: SEDANG

##### F-MODE-004: Pengaturan Jumlah Pertanyaan
- **Deskripsi**: Pengguna dapat menentukan jumlah pertanyaan quiz yang akan dihasilkan
- **Input**: Angka (default: 5, range: 3-20)
- **Output**: Jumlah pertanyaan sesuai input user
- **Prioritas**: SEDANG

##### F-MODE-005: Tombol Generate
- **Deskripsi**: Terdapat tombol "Generate" untuk memulai proses AI
- **Input**: Klik tombol
- **Proses**: Trigger API call ke backend
- **Output**: Loading state → Hasil atau error
- **Prioritas**: TINGGI

#### 3.1.3 Fungsi Generate Quiz

##### F-QUIZ-001: Generate Pertanyaan Essay
- **Deskripsi**: Sistem dapat menghasilkan pertanyaan terbuka (essay) yang mendorong pemahaman konseptual dari teks
- **Input**: 
  - Teks materi
  - Jumlah pertanyaan
- **Proses**: 
  1. Analisis teks menggunakan AI (Qwen2/Gemini)
  2. Identifikasi konsep-konsep kunci
  3. Generate pertanyaan yang menguji pemahaman mendalam
- **Output**: 
  ```json
  {
    "questions": [
      {
        "question": "Jelaskan konsep X dan bagaimana hubungannya dengan Y...",
        "type": "essay"
      }
    ]
  }
  ```
- **Kriteria Kualitas**:
  - Pertanyaan harus relevan dengan materi
  - Pertanyaan harus menguji pemahaman, bukan hafalan
  - Pertanyaan harus jelas dan tidak ambigu
- **Prioritas**: TINGGI

##### F-QUIZ-002: Generate Pertanyaan Multiple Choice (MCQ)
- **Deskripsi**: Sistem dapat menghasilkan pertanyaan MCQ beserta jawaban yang benar
- **Input**: 
  - Teks materi
  - Jumlah pertanyaan
- **Proses**: 
  1. Analisis teks menggunakan AI
  2. Identifikasi fakta-fakta penting
  3. Generate pertanyaan dan jawaban benar
- **Output**: 
  ```json
  {
    "questions": [
      {
        "question": "Apa yang dimaksud dengan X?",
        "correctAnswer": "Definisi X adalah...",
        "type": "multiple_choice"
      }
    ]
  }
  ```
- **Prioritas**: TINGGI

##### F-QUIZ-003: Generate Distractor (Pilihan Salah)
- **Deskripsi**: Sistem dapat menghasilkan 3-4 pilihan jawaban salah (distractor) yang terdengar masuk akal untuk setiap pertanyaan MCQ
- **Input**: 
  - Pertanyaan MCQ
  - Jawaban benar
  - Konteks teks
- **Proses**: 
  1. Analisis jawaban benar
  2. Generate jawaban salah yang:
     - Mirip dengan jawaban benar (plausible)
     - Tidak terlalu mudah/jelas salah
     - Tetap dalam konteks materi
- **Output**: 
  ```json
  {
    "question": "Apa yang dimaksud dengan X?",
    "correctAnswer": "Definisi X adalah...",
    "options": [
      "Definisi X adalah...",      // correct
      "Definisi Y adalah...",       // distractor 1
      "Definisi Z adalah...",       // distractor 2
      "Definisi W adalah..."        // distractor 3
    ]
  }
  ```
- **Kriteria Kualitas Distractor**:
  - Distractor harus relevan dengan topik
  - Distractor harus logis tetapi salah
  - Distractor tidak boleh terlalu mudah ditebak
- **Prioritas**: TINGGI

#### 3.1.4 Fungsi Generate Summary

##### F-SUMMARY-001: Generate Ringkasan Paragraph
- **Deskripsi**: Sistem dapat menghasilkan ringkasan teks yang koheren dalam bentuk paragraf
- **Input**: 
  - Teks materi
  - Format: "paragraph"
- **Proses**: 
  1. Analisis struktur dan konten teks
  2. Identifikasi ide-ide utama
  3. Generate ringkasan dalam bentuk paragraf yang koheren
  4. Pastikan ringkasan lebih pendek dari teks asli (30-40% panjang asli)
- **Output**: 
  ```json
  {
    "summary": "Teks ini membahas tentang X yang merupakan... Konsep Y dijelaskan sebagai... Kesimpulannya adalah...",
    "format": "paragraph"
  }
  ```
- **Prioritas**: TINGGI

##### F-SUMMARY-002: Generate Ringkasan Bullet Points
- **Deskripsi**: Sistem dapat menghasilkan ringkasan dalam bentuk poin-poin (bullet points)
- **Input**: 
  - Teks materi
  - Format: "bullet_points"
- **Proses**: 
  1. Analisis teks
  2. Identifikasi konsep-konsep kunci
  3. Generate 5-10 bullet points yang merangkum materi
- **Output**: 
  ```json
  {
    "summary": "• Konsep X adalah...\n• Y berperan dalam...\n• Z memiliki karakteristik...",
    "format": "bullet_points",
    "keyPoints": [
      "Konsep X adalah...",
      "Y berperan dalam...",
      "Z memiliki karakteristik..."
    ]
  }
  ```
- **Prioritas**: TINGGI

#### 3.1.5 Fungsi Output & Penyajian Hasil

##### F-OUTPUT-001: Tampilan Hasil
- **Deskripsi**: Hasil kuis atau ringkasan ditampilkan di area output yang terpisah dan jelas
- **Komponen UI**:
  - Area output dengan border yang jelas
  - Formatting yang rapi (numbered list untuk quiz, bullet points untuk summary)
  - Syntax highlighting jika diperlukan
- **Prioritas**: TINGGI

##### F-OUTPUT-002: Copy to Clipboard
- **Deskripsi**: Terdapat tombol atau fungsi untuk menyalin hasil yang di-generate ke clipboard pengguna dengan mudah
- **Input**: Klik tombol "Copy"
- **Proses**: Copy hasil ke clipboard browser
- **Output**: 
  - Notifikasi sukses "Copied to clipboard!"
  - Teks tersalin ke clipboard
- **Prioritas**: SEDANG

##### F-OUTPUT-003: Download Hasil
- **Deskripsi**: Pengguna dapat mengunduh hasil sebagai file teks
- **Input**: Klik tombol "Download"
- **Proses**: Generate file .txt dengan konten hasil
- **Output**: File teks terunduh ke perangkat user
- **Format**: 
  ```
  Smart Study Assistant - Quiz Result
  Generated: 2024-12-09 15:30:00
  
  [Konten quiz/summary]
  ```
- **Prioritas**: RENDAH

##### F-OUTPUT-004: Save to History (Login Required)
- **Deskripsi**: Pengguna yang login dapat menyimpan hasil ke history
- **Input**: Klik tombol "Save to History"
- **Proses**: 
  1. Cek status login
  2. Simpan ke database dengan user ID
  3. Refresh history sidebar
- **Output**: Notifikasi "Saved to history!" dan hasil muncul di sidebar
- **Prioritas**: TINGGI

#### 3.1.6 Fungsi Autentikasi & User Management

##### F-AUTH-001: Register dengan Email & Password
- **Deskripsi**: Pengguna dapat mendaftar akun baru dengan email dan password
- **Input**: 
  - Email (format email valid)
  - Password (minimal 8 karakter)
  - Nama (opsional)
- **Validasi**:
  - Email harus format valid
  - Email belum terdaftar
  - Password minimal 8 karakter
- **Proses**: 
  1. Validasi input
  2. Hash password dengan bcrypt
  3. Simpan user ke database
  4. Buat session
- **Output**: 
  - Sukses: User login otomatis, redirect ke dashboard
  - Gagal: Error message (email sudah terdaftar, password terlalu pendek, dll)
- **Prioritas**: TINGGI

##### F-AUTH-002: Login dengan Email & Password
- **Deskripsi**: Pengguna dapat login dengan email dan password
- **Input**: 
  - Email
  - Password
- **Proses**: 
  1. Validasi input
  2. Cari user di database
  3. Verify password dengan bcrypt
  4. Buat session dengan JWT
- **Output**: 
  - Sukses: User login, session dibuat
  - Gagal: Error "Invalid credentials"
- **Prioritas**: TINGGI

##### F-AUTH-003: Login dengan Google OAuth
- **Deskripsi**: Pengguna dapat login menggunakan akun Google
- **Proses**: 
  1. Redirect ke Google OAuth
  2. User authorize aplikasi
  3. Terima token dari Google
  4. Buat/update user di database
  5. Buat session
- **Output**: User login dengan akun Google
- **Prioritas**: SEDANG

##### F-AUTH-004: Login dengan GitHub OAuth
- **Deskripsi**: Pengguna dapat login menggunakan akun GitHub
- **Proses**: Sama seperti Google OAuth, tapi dengan GitHub provider
- **Output**: User login dengan akun GitHub
- **Prioritas**: SEDANG

##### F-AUTH-005: Session Management
- **Deskripsi**: Sistem mengelola sesi pengguna dengan aman
- **Teknologi**: NextAuth.js v5 + JWT tokens
- **Fitur**:
  - Session expiry (7 hari)
  - Auto refresh token
  - Secure cookie storage
- **Prioritas**: TINGGI

##### F-AUTH-006: Logout
- **Deskripsi**: Pengguna dapat keluar dari sistem
- **Input**: Klik tombol "Logout"
- **Proses**: 
  1. Hapus session dari database
  2. Clear cookies
  3. Redirect ke home page
- **Output**: User logout, session berakhir
- **Prioritas**: TINGGI

#### 3.1.7 Fungsi History Management

##### F-HISTORY-001: Simpan Quiz ke History
- **Deskripsi**: Sistem menyimpan hasil quiz ke database ketika user klik "Save"
- **Prerequisite**: User harus login
- **Input**: 
  - Quiz data (questions, type)
  - Document info (title, content)
- **Proses**: 
  1. Cek user session
  2. Simpan document ke tabel `Document`
  3. Simpan quiz ke tabel `Quiz` dengan relasi ke document & user
- **Output**: Data tersimpan di database, muncul di history sidebar
- **Prioritas**: TINGGI

##### F-HISTORY-002: Simpan Summary ke History
- **Deskripsi**: Sistem menyimpan hasil summary ke database
- **Prerequisite**: User harus login
- **Proses**: Sama seperti F-HISTORY-001, tapi untuk summary
- **Prioritas**: TINGGI

##### F-HISTORY-003: View History List
- **Deskripsi**: Pengguna dapat melihat daftar semua quiz dan summary yang pernah dibuat
- **UI Component**: Sidebar di sebelah kanan dengan list item
- **Data yang ditampilkan**:
  - Judul/Title
  - Tipe (Quiz/Summary)
  - Tanggal dibuat
  - Preview singkat
- **Proses**: 
  1. Fetch history dari API `/api/history`
  2. Filter berdasarkan user ID
  3. Sort berdasarkan tanggal (terbaru di atas)
- **Output**: List history di sidebar
- **Prioritas**: TINGGI

##### F-HISTORY-004: View History Detail
- **Deskripsi**: Pengguna dapat klik item history untuk melihat detail lengkap
- **Input**: Klik item di history sidebar
- **Proses**: 
  1. Fetch detail dari API `/api/quiz/[id]` atau `/api/summary/[id]`
  2. Tampilkan di area output utama
- **Output**: Detail quiz/summary ditampilkan
- **Prioritas**: TINGGI

##### F-HISTORY-005: Delete History Item
- **Deskripsi**: Pengguna dapat menghapus item dari history
- **Input**: Klik tombol "Delete" di item history
- **Proses**: 
  1. Konfirmasi delete
  2. Hapus dari database via API
  3. Refresh history list
- **Output**: Item terhapus dari history
- **Prioritas**: SEDANG

##### F-HISTORY-006: Database Persistence
- **Deskripsi**: Semua history disimpan secara permanen di SQLite database
- **Schema**:
  ```
  User (id, email, name, password)
    ↓
  Document (id, userId, title, content)
    ↓
  Quiz (id, userId, documentId, questions, type)
  Summary (id, userId, documentId, content, format)
  ```
- **Relasi**: 
  - User has many Documents
  - Document has many Quizzes
  - Document has many Summaries
  - Cascade delete (hapus user → hapus semua documents → hapus semua quiz/summary)
- **Prioritas**: TINGGI

---

### 3.2 Kebutuhan Non-Fungsional

#### 3.2.1 Performance (Kinerja)

##### NF-PERF-001: Response Time
- **Requirement**: Waktu pemrosesan untuk dokumen 2500 kata harus dibawah batasan berikut:
  - **Qwen2 Local (Ollama)**: < 60 detik
  - **Gemini API (Fallback)**: < 30 detik
  - **Page Load Time**: < 3 detik
- **Measurement**: 95% request harus memenuhi target di atas
- **Prioritas**: TINGGI

##### NF-PERF-002: Scalability
- **Requirement**: Sistem dapat menangani multiple users concurrent dengan rate limiting:
  - **Rate Limit**: Maksimal 10 requests per menit per user
  - **Concurrent Users**: Minimal 10 users simultan tanpa degradasi performa
- **Prioritas**: SEDANG

##### NF-PERF-003: Database Performance
- **Requirement**: 
  - Query response time < 100ms untuk 95% queries
  - Database size < 1GB untuk 1000 users
- **Prioritas**: SEDANG

#### 3.2.2 Usability (Kemudahan Penggunaan)

##### NF-USABILITY-001: Intuitive Interface
- **Requirement**: 
  - Alur kerja harus intuitif dan mudah dipahami tanpa dokumentasi
  - Minimal 80% pengguna baru dapat menggunakan fitur utama tanpa tutorial
- **Guideline**:
  - Gunakan label yang jelas
  - Berikan placeholder dan tooltip
  - Gunakan icon yang familiar
- **Prioritas**: TINGGI

##### NF-USABILITY-002: Responsive Design
- **Requirement**: 
  - UI harus responsive untuk berbagai ukuran layar:
    - Desktop (> 1024px)
    - Tablet (768px - 1024px)
    - Mobile (< 768px)
- **Prioritas**: SEDANG

##### NF-USABILITY-003: Accessibility
- **Requirement**: 
  - Minimal memenuhi WCAG 2.1 Level A
  - Keyboard navigation support
  - Screen reader friendly
- **Prioritas**: RENDAH

#### 3.2.3 Reliability (Keandalan)

##### NF-RELIABILITY-001: Error Handling
- **Requirement**: 
  - Sistem harus memberikan notifikasi yang jelas kepada pengguna jika terjadi kegagalan
  - Error messages harus informatif dan actionable
- **Contoh Error**:
  - "Format file tidak didukung. Harap upload file PDF."
  - "Teks input terlalu pendek (minimal 100 karakter)."
  - "Ollama server tidak tersedia. Menggunakan Gemini API sebagai fallback."
- **Prioritas**: TINGGI

##### NF-RELIABILITY-002: Availability & Fallback Mechanism
- **Requirement**: 
  - Sistem memiliki fallback mechanism untuk memastikan availability:
    1. **Primary**: Qwen2 Local (via Ollama) - 0 cost, private
    2. **Fallback 1**: Gemini API - minimal cost, reliable
    3. **Fallback 2**: Mock Data - development/demo mode
- **Target Availability**: 95% uptime (excluding scheduled maintenance)
- **Prioritas**: TINGGI

##### NF-RELIABILITY-003: Data Persistence
- **Requirement**: 
  - Data history harus persistent (tidak hilang saat server restart)
  - Backup database secara otomatis (jika deployed ke production)
- **Prioritas**: TINGGI

#### 3.2.4 Security (Keamanan)

##### NF-SECURITY-001: Authentication & Authorization
- **Requirement**: 
  - Password hashing dengan **bcrypt** (salt rounds: 10)
  - Session management dengan **JWT tokens**
  - OAuth authentication untuk Google & GitHub
  - Secure cookie storage (httpOnly, secure, sameSite)
- **Prioritas**: TINGGI

##### NF-SECURITY-002: Data Privacy
- **Requirement**: 
  - File yang diunggah dan teks yang dimasukkan harus dihapus dari server segera setelah sesi pengguna berakhir (untuk guest user)
  - History hanya dapat diakses oleh user yang membuatnya
  - Tidak ada sharing data antar user
- **Prioritas**: TINGGI

##### NF-SECURITY-003: Input Validation
- **Requirement**: 
  - Semua input harus divalidasi (format, ukuran, tipe)
  - Prevent SQL injection (menggunakan Prisma ORM)
  - Prevent XSS attacks (sanitize output)
- **Prioritas**: TINGGI

##### NF-SECURITY-004: Rate Limiting
- **Requirement**: 
  - Rate limiting untuk prevent abuse:
    - 10 requests per menit per user
    - 100 requests per jam per IP
- **Prioritas**: SEDANG

#### 3.2.5 Maintainability (Pemeliharaan)

##### NF-MAINTAINABILITY-001: Code Quality
- **Requirement**: 
  - Code harus modular dan well-documented
  - Menggunakan TypeScript untuk type safety
  - Follow coding conventions (ESLint + Prettier)
- **Prioritas**: SEDANG

##### NF-MAINTAINABILITY-002: Testing
- **Requirement**: 
  - Unit tests untuk fungsi-fungsi kritis
  - Integration tests untuk API endpoints
  - Target code coverage: > 70%
- **Prioritas**: RENDAH (untuk v1.0)

##### NF-MAINTAINABILITY-003: Logging & Monitoring
- **Requirement**: 
  - Log semua error ke console/file
  - Monitor API response times
  - Track AI fallback usage
- **Prioritas**: SEDANG

#### 3.2.6 Compatibility (Kompatibilitas)

##### NF-COMPATIBILITY-001: Browser Support
- **Requirement**: 
  - Support browser modern:
    - Chrome (latest 2 versions)
    - Firefox (latest 2 versions)
    - Safari (latest 2 versions)
    - Edge (latest 2 versions)
- **Prioritas**: TINGGI

##### NF-COMPATIBILITY-002: Platform Support
- **Requirement**: 
  - Server dapat berjalan di:
    - Windows 10/11
    - macOS 12+
    - Linux (Ubuntu 20.04+)
- **Prioritas**: SEDANG

---

## BAB 4. SPESIFIKASI TEKNIS

### 4.1 Tech Stack

| Komponen | Teknologi | Versi | Alasan Pemilihan |
|----------|-----------|-------|------------------|
| **Frontend Framework** | Next.js | 15.5.4 | Server-side rendering, API routes, optimized performance |
| **UI Library** | React | 19+ | Component-based, large ecosystem |
| **Language** | TypeScript | 5+ | Type safety, better DX |
| **Styling** | TailwindCSS | 3+ | Utility-first, rapid development |
| **Database** | SQLite | 3+ | Lightweight, serverless, perfect for small-medium scale |
| **ORM** | Prisma | 6+ | Type-safe, migrations, easy to use |
| **Authentication** | NextAuth.js | 5+ | OAuth support, session management |
| **AI - Primary** | Qwen2 7B (Ollama) | Latest | Free, local, private, no API cost |
| **AI - Fallback** | Google Gemini | 1.5 Flash | Fast, affordable, reliable |
| **PDF Parser** | pdf-parse | Latest | Simple, effective for text extraction |

### 4.2 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │   React    │  │  Next.js   │  │   TailwindCSS    │  │
│  │ Components │  │  Frontend  │  │     Styling      │  │
│  └────────────┘  └────────────┘  └──────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS SERVER (Backend)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │              API Routes (REST)                    │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ /api/auth          - Authentication              │  │
│  │ /api/generate-quiz - Quiz generation             │  │
│  │ /api/generate-summary - Summary generation        │  │
│  │ /api/extract-text  - PDF text extraction         │  │
│  │ /api/history       - History management          │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                                │
│  ┌──────────────────────┼────────────────────────────┐ │
│  │   Business Logic     │    AI Integration          │ │
│  │   ┌──────────────┐   │   ┌──────────────────────┐│ │
│  │   │   Prisma     │   │   │  AI Priority Chain:  ││ │
│  │   │     ORM      │   │   │  1. Qwen2 (Ollama)   ││ │
│  │   └──────────────┘   │   │  2. Gemini API       ││ │
│  │   ┌──────────────┐   │   │  3. Mock Data        ││ │
│  │   │  NextAuth.js │   │   └──────────────────────┘│ │
│  │   └──────────────┘   │                            │ │
│  └──────────────────────┴────────────────────────────┘ │
└────────────────┬───────────────────────┬────────────────┘
                 │                       │
                 ▼                       ▼
      ┌──────────────────┐   ┌──────────────────────┐
      │  SQLite Database │   │   Ollama Server      │
      │   (Prisma ORM)   │   │  (localhost:11434)   │
      │                  │   │   ┌──────────────┐   │
      │  - Users         │   │   │  Qwen2 7B    │   │
      │  - Accounts      │   │   │   Model      │   │
      │  - Sessions      │   │   └──────────────┘   │
      │  - Documents     │   └──────────────────────┘
      │  - Quizzes       │
      │  - Summaries     │   ┌──────────────────────┐
      └──────────────────┘   │   Gemini API         │
                              │  (Fallback AI)       │
                              └──────────────────────┘
```

### 4.3 Database Schema

```prisma
// User - Tabel pengguna
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // bcrypt hashed
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts  Account[]    // OAuth accounts
  sessions  Session[]    // Active sessions
  documents Document[]   // User's documents
  quizzes   Quiz[]       // User's quizzes
  summaries Summary[]    // User's summaries
}

// Account - OAuth accounts (Google, GitHub)
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

// Session - User sessions (JWT)
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Document - Source text/PDF
model Document {
  id          String   @id @default(cuid())
  userId      String?
  title       String
  content     String   // Full text content
  fileName    String?
  fileType    String   @default("text")  // "text" | "pdf"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizzes   Quiz[]
  summaries Summary[]
}

// Quiz - Generated quizzes
model Quiz {
  id         String   @id @default(cuid())
  userId     String?
  documentId String
  title      String
  type       QuizType @default(MULTIPLE_CHOICE)
  questions  Json     // Array of questions
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  user     User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
}

enum QuizType {
  MULTIPLE_CHOICE
  ESSAY
}

// Summary - Generated summaries
model Summary {
  id         String       @id @default(cuid())
  userId     String?
  documentId String
  title      String
  content    String       // Summary text
  format     SummaryFormat @default(PARAGRAPH)
  keyPoints  Json?        // Array of key points (for bullet format)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  
  user     User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
}

enum SummaryFormat {
  PARAGRAPH
  BULLET_POINTS
}
```

### 4.4 API Endpoints

| Endpoint | Method | Auth | Description | Request Body | Response |
|----------|--------|------|-------------|--------------|----------|
| `/api/auth/register` | POST | No | Register new user | `{email, password, name?}` | `{success, user}` |
| `/api/auth/[...nextauth]` | POST | No | Login (email/OAuth) | Handled by NextAuth | Session cookie |
| `/api/extract-text` | POST | No | Extract text from PDF | `FormData {file}` | `{text, fileName}` |
| `/api/generate-quiz` | POST | No | Generate quiz | `{text, type, count}` | `{questions, title}` |
| `/api/generate-summary` | POST | No | Generate summary | `{text, format}` | `{summary, keyPoints?}` |
| `/api/history` | GET | Yes | Get user history | - | `{quizzes[], summaries[]}` |
| `/api/quiz/[id]` | GET | Yes | Get quiz detail | - | `{quiz, document}` |
| `/api/quiz/[id]` | DELETE | Yes | Delete quiz | - | `{success}` |
| `/api/summary/[id]` | GET | Yes | Get summary detail | - | `{summary, document}` |
| `/api/summary/[id]` | DELETE | Yes | Delete summary | - | `{success}` |
| `/api/user/profile` | GET | Yes | Get user profile | - | `{user}` |
| `/api/health` | GET | No | Health check | - | `{status, ai}` |

---

## BAB 5. USER INTERFACE SPECIFICATION

### 5.1 Main Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Smart Study Assistant          [Login] [Register]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │   INPUT SECTION         │  │   HISTORY SIDEBAR       │ │
│  │                         │  │   (Login Required)       │ │
│  │  [Text Input Area]      │  │                         │ │
│  │                         │  │  📝 Quiz #1 - 2024-12-09│ │
│  │  OR                     │  │  📝 Summary #1 - ...    │ │
│  │                         │  │  📝 Quiz #2 - ...       │ │
│  │  [Upload PDF Button]    │  │                         │ │
│  │                         │  │  [Load More]            │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   MODE SELECTION                                     │  │
│  │   ( ) Generate Quiz    ( ) Generate Summary          │  │
│  │                                                       │  │
│  │   IF Quiz:                                           │  │
│  │   - Type: [Multiple Choice] [Essay]                 │  │
│  │   - Count: [5] questions                            │  │
│  │                                                       │  │
│  │   IF Summary:                                        │  │
│  │   - Format: [Paragraph] [Bullet Points]             │  │
│  │                                                       │  │
│  │   [Generate ✨]                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   OUTPUT SECTION                                     │  │
│  │                                                       │  │
│  │   [Generated Quiz/Summary will appear here]          │  │
│  │                                                       │  │
│  │   [Copy] [Download] [Save to History]               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Screen Flow

```
┌─────────────┐
│  Home Page  │
│ (Not Login) │
└──────┬──────┘
       │
       ├──> [Input Text/PDF] ──> [Select Mode] ──> [Generate] ──> [View Result]
       │                                                  │
       │                                                  └──> [Copy/Download]
       │
       └──> [Login Button] ──> ┌──────────────────┐
                                │  Login Modal     │
                                │  - Email/Pass    │
                                │  - Google OAuth  │
                                │  - GitHub OAuth  │
                                └────────┬─────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Home Page      │
                                │  (Logged In)    │
                                │  + History      │
                                │  + Save Feature │
                                └─────────────────┘
```

---

## BAB 6. AI INTEGRATION SPECIFICATION

### 6.1 AI Priority Chain

Sistem menggunakan **3-tier fallback mechanism** untuk memastikan availability:

```
Request
   │
   ▼
┌────────────────────────────────────────┐
│  TIER 1: Qwen2 Local (Ollama)         │
│  - Priority: HIGHEST                   │
│  - Cost: FREE                          │
│  - Privacy: PRIVATE (local)            │
│  - Speed: ~30-60s                      │
│  - Requirement: Ollama server running  │
└─────────────┬──────────────────────────┘
              │ If failed ↓
┌────────────────────────────────────────┐
│  TIER 2: Gemini API (Fallback)        │
│  - Priority: MEDIUM                    │
│  - Cost: MINIMAL (~$0.001/request)     │
│  - Privacy: Google Cloud               │
│  - Speed: ~10-30s                      │
│  - Requirement: API key                │
└─────────────┬──────────────────────────┘
              │ If failed ↓
┌────────────────────────────────────────┐
│  TIER 3: Mock Data (Dev/Demo)         │
│  - Priority: LOWEST                    │
│  - Cost: FREE                          │
│  - Privacy: N/A                        │
│  - Speed: INSTANT                      │
│  - Requirement: None                   │
└────────────────────────────────────────┘
```

### 6.2 AI Model Specifications

#### 6.2.1 Qwen2 7B (Primary)

- **Model**: Qwen2-7B-Instruct
- **Size**: 4.4 GB
- **Context Length**: 32,768 tokens (~50,000 words)
- **Language Support**: 
  - 🇮🇩 Bahasa Indonesia (EXCELLENT)
  - 🇬🇧 English (EXCELLENT)
- **Strengths**:
  - Terbaik untuk bahasa Indonesia
  - Cepat untuk model 7B
  - Gratis dan private
  - Tidak perlu internet (setelah download)
- **Limitations**:
  - Butuh RAM ~8GB
  - Butuh Ollama server running

#### 6.2.2 Gemini 1.5 Flash (Fallback)

- **Model**: gemini-1.5-flash
- **Context Length**: 1,000,000 tokens
- **Language Support**: Multilingual
- **Strengths**:
  - Sangat cepat
  - Murah ($0.075 per 1M input tokens)
  - Reliable cloud service
- **Limitations**:
  - Butuh API key
  - Butuh internet
  - Privacy concerns (data dikirim ke Google)

### 6.3 Prompt Engineering

#### 6.3.1 Quiz Generation Prompt Template

```typescript
const QUIZ_PROMPT = `
Kamu adalah asisten pendidikan yang ahli dalam membuat soal ujian berkualitas tinggi.

TUGAS:
Buatlah ${count} soal ${type} dalam Bahasa Indonesia berdasarkan teks berikut.

TEKS:
${text}

PERSYARATAN ${type === 'multiple_choice' ? 'PILIHAN GANDA' : 'ESSAY'}:
${type === 'multiple_choice' ? `
- Setiap soal harus memiliki 4 pilihan (A, B, C, D)
- Hanya 1 jawaban benar
- Pilihan salah (distractor) harus masuk akal dan relevan
- Soal harus menguji pemahaman, bukan hafalan
` : `
- Pertanyaan harus terbuka dan mendalam
- Menguji analisis dan pemahaman konsep
- Memerlukan penjelasan detail
`}

FORMAT OUTPUT (JSON):
{
  "questions": [
    ${type === 'multiple_choice' ? `
    {
      "question": "Pertanyaan...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "explanation": "Penjelasan mengapa A benar..."
    }
    ` : `
    {
      "question": "Pertanyaan essay...",
      "sampleAnswer": "Contoh jawaban yang baik...",
      "keyPoints": ["Poin 1", "Poin 2", ...]
    }
    `}
  ]
}

Hasilkan JSON yang valid, tanpa markdown atau formatting tambahan.
`
```

#### 6.3.2 Summary Generation Prompt Template

```typescript
const SUMMARY_PROMPT = `
Kamu adalah asisten pendidikan yang ahli dalam merangkum materi pembelajaran.

TUGAS:
Buatlah ringkasan dari teks berikut dalam format ${format}.

TEKS:
${text}

PERSYARATAN:
- Ringkasan harus dalam Bahasa Indonesia
- Panjang: 30-40% dari teks asli
- Fokus pada konsep-konsep kunci dan informasi penting
- ${format === 'paragraph' ? 
   'Tulis dalam bentuk paragraf yang koheren dan mengalir' : 
   'Tulis dalam bentuk bullet points (5-10 poin)'
}

FORMAT OUTPUT (JSON):
{
  "summary": "${format === 'paragraph' ? 
    'Ringkasan dalam bentuk paragraf...' : 
    '• Poin 1\\n• Poin 2\\n• Poin 3...'
  }",
  ${format === 'bullet_points' ? 
    '"keyPoints": ["Poin 1", "Poin 2", "Poin 3", ...]' : 
    ''
  }
}

Hasilkan JSON yang valid, tanpa markdown atau formatting tambahan.
`
```

### 6.4 Error Handling & Fallback Logic

```typescript
async function generateWithAI(prompt: string) {
  let result = null
  let aiUsed = null
  
  // TIER 1: Try Qwen2 Local
  try {
    console.log('🖥️ Trying Qwen2 Local...')
    result = await callQwen2Local(prompt)
    aiUsed = 'qwen2-local'
    console.log('✅ Qwen2 success!')
    return { result, aiUsed }
  } catch (error) {
    console.warn('⚠️ Qwen2 failed:', error.message)
  }
  
  // TIER 2: Try Gemini API
  try {
    console.log('☁️ Trying Gemini API...')
    result = await callGeminiAPI(prompt)
    aiUsed = 'gemini'
    console.log('✅ Gemini success!')
    return { result, aiUsed }
  } catch (error) {
    console.warn('⚠️ Gemini failed:', error.message)
  }
  
  // TIER 3: Use Mock Data (Development/Demo)
  console.log('🎭 Using mock data (fallback)...')
  result = getMockData()
  aiUsed = 'mock'
  
  return { result, aiUsed }
}
```

---

## BAB 7. TESTING SPECIFICATION

### 7.1 Unit Testing

**Target Coverage**: 70%

**Tools**: Jest + React Testing Library

**Test Cases**:
- [ ] Auth functions (register, login, logout)
- [ ] PDF text extraction
- [ ] Input validation
- [ ] AI prompt generation
- [ ] Response parsing
- [ ] Database CRUD operations

### 7.2 Integration Testing

**Tools**: Playwright / Cypress

**Test Scenarios**:
- [ ] End-to-end user registration & login
- [ ] Generate quiz flow (guest user)
- [ ] Generate summary flow (guest user)
- [ ] Save to history flow (logged-in user)
- [ ] View history flow
- [ ] Delete history flow
- [ ] AI fallback mechanism

### 7.3 Performance Testing

**Tools**: Lighthouse + Apache JMeter

**Metrics**:
- [ ] Page load time < 3s
- [ ] API response time < 2s (excluding AI processing)
- [ ] AI processing time < 60s (Qwen2) / < 30s (Gemini)
- [ ] Handle 10 concurrent users

### 7.4 Security Testing

**Tools**: OWASP ZAP

**Test Cases**:
- [ ] SQL Injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication bypass attempts
- [ ] Rate limiting enforcement
- [ ] Input validation bypass attempts

---

## BAB 8. DEPLOYMENT SPECIFICATION

### 8.1 Development Environment

```bash
# Requirements
- Node.js 18+
- npm/yarn/pnpm
- Ollama (for local AI)
- Git

# Setup
git clone <repo-url>
cd smart-study-assistant
npm install
npm run db:push      # Setup database
npm run dev          # Start dev server
```

### 8.2 Production Deployment

**Recommended Platforms**:
1. **Vercel** (easiest, best for Next.js)
2. **Railway** (supports Ollama via Docker)
3. **Self-hosted VPS** (full control)

**Environment Variables Required**:
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"

# OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# AI (optional)
GEMINI_API_KEY="..."
```

**Deployment Checklist**:
- [ ] Build passes (`npm run build`)
- [ ] Database migrated (`npx prisma migrate deploy`)
- [ ] Environment variables set
- [ ] Ollama server running (if using local AI)
- [ ] SSL certificate installed (HTTPS)
- [ ] Domain configured
- [ ] Rate limiting enabled
- [ ] Error monitoring setup (Sentry, etc.)

---

## BAB 9. MAINTENANCE & SUPPORT

### 9.1 Maintenance Plan

| Task | Frequency | Responsibility |
|------|-----------|----------------|
| Database backup | Daily | Auto (cron job) |
| Security updates | Weekly | Dev team |
| Performance monitoring | Daily | Auto (monitoring tool) |
| User feedback review | Weekly | Support team |
| Bug fixes | As needed | Dev team |
| Feature updates | Monthly | Product team |

### 9.2 Support Channels

- **Documentation**: README.md, ARCHITECTURE.md, USER_GUIDE.md
- **Issue Tracking**: GitHub Issues
- **Email**: support@smartstudyassistant.com (if applicable)
- **User Guide**: USER_GUIDE.md in repository

---

## APPENDIX A: GLOSSARY

| Term | Definition |
|------|------------|
| **Distractor** | Pilihan jawaban salah yang terdengar masuk akal dalam soal pilihan ganda |
| **Fallback** | Sistem cadangan yang digunakan jika sistem utama gagal |
| **JWT** | JSON Web Token - format token untuk autentikasi |
| **OAuth** | Protokol untuk login menggunakan akun pihak ketiga (Google, GitHub) |
| **ORM** | Object-Relational Mapping - layer abstraksi database |
| **Prisma** | ORM modern untuk Node.js & TypeScript |
| **Rate Limiting** | Pembatasan jumlah request untuk mencegah penyalahgunaan |
| **Session** | Sesi pengguna yang sedang login |
| **SQLite** | Database ringan berbasis file |

---

## APPENDIX B: REFERENCES

1. Next.js Documentation: https://nextjs.org/docs
2. Prisma Documentation: https://www.prisma.io/docs
3. NextAuth.js Documentation: https://next-auth.js.org
4. Ollama Documentation: https://ollama.com/docs
5. Qwen2 Model Card: https://ollama.com/library/qwen2
6. Google Gemini API: https://ai.google.dev/docs
7. WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

## DOCUMENT REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-09 | Development Team | Initial SRS document - Updated to reflect actual implementation with Qwen2, Gemini fallback, authentication, and history management features |

---

**END OF DOCUMENT**
