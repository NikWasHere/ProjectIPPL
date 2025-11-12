# 🤖 Cara Mengaktifkan Google Gemini AI

## 📋 Langkah-langkah Mendapatkan API Key

### 1. Kunjungi Google AI Studio
Buka browser dan pergi ke: **https://makersuite.google.com/app/apikey**

Atau alternatif: **https://aistudio.google.com/app/apikey**

### 2. Login dengan Akun Google
- Gunakan akun Google Anda untuk login
- Jika belum punya akun Google, buat terlebih dahulu di: https://accounts.google.com

### 3. Buat API Key Baru
1. Klik tombol **"Create API Key"** atau **"Get API Key"**
2. Pilih atau buat Google Cloud Project
   - Jika belum punya project, pilih **"Create new project"**
   - Beri nama project (contoh: "SmartStudy AI")
3. Klik **"Create API key in new project"**
4. API key akan muncul - **COPY** dan simpan dengan aman

### 4. Tambahkan API Key ke Aplikasi

Buka file `.env` di root folder aplikasi dan update:

```bash
# AI Configuration
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**PENTING**: Ganti `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` dengan API key yang Anda dapatkan!

### 5. Restart Development Server

Setelah menambahkan API key, restart aplikasi:

```bash
# Tekan Ctrl+C untuk stop server
# Kemudian jalankan lagi:
npm run dev
```

---

## ✅ Verifikasi API Key Aktif

Setelah restart, coba generate quiz atau summary. Anda akan melihat log di terminal:

```bash
✅ Generating quiz with Gemini AI...
✅ Gemini AI generation successful
```

Jika melihat log ini, berarti Gemini AI sudah aktif! 🎉

Jika gagal, akan muncul:
```bash
⚠️ Gemini AI failed, using fallback mock data
```

---

## 🆓 Free Tier & Limits

### Gemini 1.5 Flash (Model yang Digunakan)

**Free Tier:**
- ✅ 15 requests per minute (RPM)
- ✅ 1 million tokens per minute (TPM)
- ✅ 1,500 requests per day (RPD)

**Cukup untuk aplikasi development dan testing!**

### Rate Limits yang Diterapkan Aplikasi:
- AI Generation: 3 requests per menit per user
- General API: 10 requests per menit
- Auth: 5 requests per 15 menit

---

## 🔐 Keamanan API Key

### ⚠️ JANGAN:
- ❌ Commit API key ke Git/GitHub
- ❌ Share API key di publik
- ❌ Hardcode API key di kode

### ✅ LAKUKAN:
- ✅ Simpan di file `.env` (sudah ada di `.gitignore`)
- ✅ Gunakan environment variables
- ✅ Rotate API key secara berkala

---

## 🚀 Keunggulan Gemini AI

### 1. **Gratis & Generous Limits**
- Free tier sangat besar untuk development
- Cocok untuk aplikasi pembelajaran

### 2. **Gemini 1.5 Flash - Cepat & Efisien**
- Response time < 2 detik
- Optimized untuk tugas generasi teks
- Support bahasa Indonesia dengan baik

### 3. **Multimodal (Future)**
- Support text, image, audio, video
- Bisa dikembangkan untuk fitur lain

### 4. **Context Window Besar**
- Up to 1 million tokens
- Bisa proses PDF panjang

---

## 📝 Model yang Digunakan

Aplikasi ini menggunakan **`gemini-1.5-flash`**:

- **Kecepatan**: ⚡ Sangat Cepat
- **Biaya**: 💰 Gratis (Free tier)
- **Use Case**: Quiz generation, Summary creation
- **Bahasa**: ✅ Support Indonesia
- **Context**: 1M tokens

---

## 🔄 Fallback Mechanism

Aplikasi ini memiliki **smart fallback**:

```
1. Coba Gemini AI ✅
   ↓ (jika gagal)
2. Gunakan Mock Data 📝
   ↓
3. User tetap bisa generate ✅
```

**Tidak ada downtime!** User selalu bisa menggunakan aplikasi.

---

## 🧪 Testing Gemini Integration

### Test 1: Generate Quiz
1. Input teks atau upload PDF
2. Pilih "Generate Quiz"
3. Check terminal logs
4. Verifikasi hasil quiz relevan dengan input

### Test 2: Generate Summary
1. Input teks panjang (>500 karakter)
2. Klik "Generate Summary"
3. Check terminal logs
4. Verifikasi ringkasan akurat

### Test 3: PDF Upload
1. Upload PDF file
2. Teks ter-ekstrak otomatis
3. Generate quiz/summary dari PDF
4. Verifikasi hasil sesuai konten PDF

---

## 🐛 Troubleshooting

### Problem: "Gemini AI failed"

**Solusi:**
1. Check API key benar di `.env`
2. Check tidak ada spasi di awal/akhir API key
3. Verifikasi API key aktif di Google AI Studio
4. Check internet connection
5. Restart development server

### Problem: "403 Forbidden"

**Solusi:**
- API key salah atau expired
- Generate API key baru
- Update di `.env`

### Problem: "429 Too Many Requests"

**Solusi:**
- Rate limit tercapai
- Tunggu 1 menit
- Atau upgrade ke paid plan (opsional)

---

## 💡 Tips Penggunaan

### 1. Input Quality
- Berikan teks yang jelas dan terstruktur
- Minimal 100 karakter untuk quiz
- Minimal 50 karakter untuk summary

### 2. Quiz Generation
- Multiple choice: Best untuk fakta & konsep
- Essay: Best untuk analisis & pemahaman
- Count: 3-10 pertanyaan optimal

### 3. Summary Generation
- Teks 200-5000 karakter: hasil optimal
- Terlalu pendek: summary kurang berguna
- Terlalu panjang: mungkin ter-truncate

### 4. PDF Upload
- Format PDF standar (bukan scan)
- Teks harus bisa di-select
- Max size: sesuai konfigurasi server

---

## 📊 Monitoring Usage

### Check di Google AI Studio:
1. Login ke https://aistudio.google.com
2. Pilih API key Anda
3. View usage statistics
4. Monitor quota remaining

---

## 🎓 Dokumentasi Resmi

- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **Models**: https://ai.google.dev/models
- **Quickstart**: https://ai.google.dev/tutorials/quickstart

---

## ✨ Next Steps

Setelah Gemini AI aktif:

1. ✅ Test semua fitur (quiz, summary, PDF)
2. ✅ Monitor usage di Google AI Studio
3. ✅ Adjust rate limits jika perlu
4. ✅ Consider paid plan untuk production
5. ✅ Implement caching untuk efisiensi

---

**🎉 Selamat! Gemini AI siap digunakan dalam aplikasi Anda!**

Jika ada pertanyaan atau masalah, check troubleshooting section atau dokumentasi resmi Google.
