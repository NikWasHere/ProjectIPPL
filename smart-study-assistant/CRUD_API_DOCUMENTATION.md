# CRUD API Documentation

## Daftar Lengkap CRUD Endpoints

Dokumentasi ini menjelaskan semua CRUD API endpoints yang tersedia di Smart Study Assistant.

---

## 📋 Table of Contents

1. [Quiz CRUD](#1-quiz-crud)
2. [Summary CRUD](#2-summary-crud)
3. [User Profile CRUD](#3-user-profile-crud)
4. [Document Upload](#4-document-upload)
5. [History API](#5-history-api)
6. [Authentication](#6-authentication)

---

## 1. Quiz CRUD

### 📁 File Location
```
src/app/api/quiz/[id]/route.ts
```

### Endpoints

#### GET `/api/quiz/[id]`
Mengambil detail quiz berdasarkan ID.

**Request:**
```http
GET /api/quiz/123
Authorization: [Session Cookie Required]
```

**Response:**
```json
{
  "success": true,
  "quiz": {
    "id": "123",
    "title": "Programming Quiz",
    "questions": [
      {
        "question": "What is JavaScript?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A"
      }
    ],
    "document": {
      "id": "doc123",
      "title": "JavaScript Basics",
      "type": "pdf"
    },
    "createdAt": "2025-11-12T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (tidak login)
- `403` - Forbidden (bukan pemilik quiz)
- `404` - Quiz tidak ditemukan
- `500` - Server error

---

#### PUT `/api/quiz/[id]`
Update quiz title atau questions.

**Request:**
```http
PUT /api/quiz/123
Content-Type: application/json
Authorization: [Session Cookie Required]
```

**Body:**
```json
{
  "title": "Updated Quiz Title",
  "questions": [
    {
      "question": "Updated question?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz updated successfully",
  "quiz": {
    "id": "123",
    "title": "Updated Quiz Title",
    "questions": [...],
    "updatedAt": "2025-11-12T11:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Quiz tidak ditemukan
- `500` - Server error

---

#### DELETE `/api/quiz/[id]`
Hapus quiz berdasarkan ID.

**Request:**
```http
DELETE /api/quiz/123
Authorization: [Session Cookie Required]
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Quiz tidak ditemukan
- `500` - Server error

---

## 2. Summary CRUD

### 📁 File Location
```
src/app/api/summary/[id]/route.ts
```

### Endpoints

#### GET `/api/summary/[id]`
Mengambil detail summary berdasarkan ID.

**Request:**
```http
GET /api/summary/456
Authorization: [Session Cookie Required]
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "id": "456",
    "title": "JavaScript Summary",
    "content": "This is a summary of JavaScript basics...",
    "document": {
      "id": "doc123",
      "title": "JavaScript Basics",
      "type": "pdf"
    },
    "createdAt": "2025-11-12T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (bukan pemilik summary)
- `404` - Summary tidak ditemukan
- `500` - Server error

---

#### PUT `/api/summary/[id]`
Update summary title atau content.

**Request:**
```http
PUT /api/summary/456
Content-Type: application/json
Authorization: [Session Cookie Required]
```

**Body:**
```json
{
  "title": "Updated Summary Title",
  "content": "Updated content of the summary..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Summary updated successfully",
  "summary": {
    "id": "456",
    "title": "Updated Summary Title",
    "content": "Updated content...",
    "updatedAt": "2025-11-12T11:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Summary tidak ditemukan
- `500` - Server error

---

#### DELETE `/api/summary/[id]`
Hapus summary berdasarkan ID.

**Request:**
```http
DELETE /api/summary/456
Authorization: [Session Cookie Required]
```

**Response:**
```json
{
  "success": true,
  "message": "Summary deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Summary tidak ditemukan
- `500` - Server error

---

## 3. User Profile CRUD

### 📁 File Location
```
src/app/api/user/profile/route.ts
```

### Endpoints

#### GET `/api/user/profile`
Mengambil profil user yang sedang login beserta statistik.

**Request:**
```http
GET /api/user/profile
Authorization: [Session Cookie Required]
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://example.com/avatar.jpg",
    "stats": {
      "totalDocuments": 5,
      "totalQuizzes": 10,
      "totalSummaries": 8
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-11-12T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User tidak ditemukan
- `500` - Server error

---

#### PUT `/api/user/profile`
Update profil user (name, email, password, atau image).

**Request:**
```http
PUT /api/user/profile
Content-Type: application/json
Authorization: [Session Cookie Required]
```

**Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "password": "newpassword123",
  "image": "https://example.com/new-avatar.jpg"
}
```

**Notes:**
- Semua field optional
- Password minimal 6 karakter
- Email akan dicek duplikasi

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user123",
    "name": "John Updated",
    "email": "john.new@example.com",
    "image": "https://example.com/new-avatar.jpg",
    "updatedAt": "2025-11-12T11:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (email sudah dipakai / password terlalu pendek)
- `401` - Unauthorized
- `500` - Server error

---

#### DELETE `/api/user/profile`
Hapus akun user (dengan konfirmasi password).

**Request:**
```http
DELETE /api/user/profile
Content-Type: application/json
Authorization: [Session Cookie Required]
```

**Body:**
```json
{
  "confirmPassword": "userpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Notes:**
- Memerlukan konfirmasi password
- Akan menghapus semua data terkait (documents, quizzes, summaries) karena cascade delete

**Status Codes:**
- `200` - Success
- `400` - Password konfirmasi tidak diberikan
- `401` - Unauthorized / Password salah
- `404` - User tidak ditemukan
- `500` - Server error

---

## 4. Document Upload

### 📁 File Location
```
src/app/api/extract-text/route.ts
```

### Endpoint

#### POST `/api/extract-text`
Upload dan ekstrak teks dari file (PDF atau plain text).

**Request:**
```http
POST /api/extract-text
Content-Type: multipart/form-data
Authorization: [Session Cookie Required]
```

**Form Data:**
```
file: [Binary File]
```

**Supported Formats:**
- PDF (`.pdf`)
- Text (`.txt`)

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "doc123",
    "title": "document.pdf",
    "type": "pdf",
    "content": "Extracted text content...",
    "createdAt": "2025-11-12T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - No file / unsupported format
- `401` - Unauthorized
- `500` - Server error

---

## 5. History API

### 📁 File Location
```
src/app/api/history/route.ts
```

### Endpoint

#### GET `/api/history`
Mengambil riwayat quiz dan summary user.

**Request:**
```http
GET /api/history
Authorization: [Session Cookie Required]
```

**Response:**
```json
{
  "success": true,
  "history": {
    "quizzes": [
      {
        "id": "quiz1",
        "title": "Quiz 1",
        "documentTitle": "Doc 1",
        "createdAt": "2025-11-12T10:00:00Z"
      }
    ],
    "summaries": [
      {
        "id": "sum1",
        "title": "Summary 1",
        "documentTitle": "Doc 1",
        "createdAt": "2025-11-12T10:00:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

## 6. Authentication

### 📁 File Locations
```
src/app/api/auth/[...nextauth]/route.ts
src/app/api/auth/register/route.ts
```

### Endpoints

#### POST `/api/auth/register`
Registrasi user baru.

**Request:**
```http
POST /api/auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Email sudah terdaftar / data tidak lengkap
- `500` - Server error

---

#### POST `/api/auth/signin`
Login user (handled by NextAuth).

**Providers:**
- Credentials (email + password)
- Google OAuth
- GitHub OAuth

---

#### POST `/api/auth/signout`
Logout user (handled by NextAuth).

---

## 🔒 Security Features

Semua CRUD endpoints dilindungi dengan:

1. **Session Authentication** - Harus login untuk akses
2. **Authorization Check** - Hanya pemilik yang bisa update/delete
3. **Password Hashing** - Menggunakan bcrypt
4. **Email Validation** - Cegah duplikasi email
5. **Rate Limiting** - Batasi request berlebihan
6. **Error Handling** - Response error yang jelas

---

## 🧪 Testing Endpoints

### Menggunakan Browser (untuk GET)
```
http://localhost:3001/api/user/profile
```

### Menggunakan cURL (untuk POST/PUT/DELETE)
```bash
# Get Profile
curl http://localhost:3001/api/user/profile \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Update Profile
curl -X PUT http://localhost:3001/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{"name": "New Name"}'

# Delete Quiz
curl -X DELETE http://localhost:3001/api/quiz/123 \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### Menggunakan Postman
1. Import collection dari endpoints di atas
2. Set cookie/session di Headers
3. Test semua CRUD operations

---

## 📊 Database Schema

### User
```prisma
model User {
  id         String    @id @default(cuid())
  name       String?
  email      String    @unique
  password   String?
  image      String?
  documents  Document[]
  quizzes    Quiz[]
  summaries  Summary[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}
```

### Document
```prisma
model Document {
  id        String    @id @default(cuid())
  userId    String
  title     String
  content   String
  type      String
  quizzes   Quiz[]
  summaries Summary[]
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Quiz
```prisma
model Quiz {
  id         String    @id @default(cuid())
  userId     String
  documentId String
  title      String
  questions  Json
  createdAt  DateTime  @default(now())
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  document   Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)
}
```

### Summary
```prisma
model Summary {
  id         String    @id @default(cuid())
  userId     String
  documentId String
  title      String
  content    String
  createdAt  DateTime  @default(now())
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  document   Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)
}
```

---

## 📝 Notes

- Semua endpoint memerlukan authentication (session cookie)
- Timestamps menggunakan ISO 8601 format
- Questions di Quiz disimpan sebagai JSON
- Cascade delete: hapus user = hapus semua data terkait
- Rate limiting: 10 req/min untuk API endpoints
- File upload max: 10MB (PDF) atau 1MB (text)

---

**Last Updated:** November 12, 2025  
**Version:** 1.0.0
