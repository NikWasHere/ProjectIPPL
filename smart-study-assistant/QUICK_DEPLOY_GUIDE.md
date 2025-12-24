# 🚀 Quick Deploy Guide - Smart Study Assistant

## LANGKAH CEPAT DEPLOY KE VERCEL (15-30 MENIT)

### Prerequisites
- [x] Akun GitHub
- [x] Akun Vercel (gratis di https://vercel.com)
- [x] Gemini API Key (sudah ada)

---

## STEP 1: Persiapan Database (5 menit)

### Pilih salah satu (Gratis):

#### Option A: Neon (PostgreSQL) - RECOMMENDED ⭐
1. Go to https://neon.tech
2. Sign up (gratis)
3. Create new project: "smart-study-assistant"
4. Copy connection string:
   ```
   postgresql://username:password@ep-xxx.region.neon.tech/dbname?sslmode=require
   ```

#### Option B: Supabase (PostgreSQL)
1. Go to https://supabase.com
2. New Project
3. Get connection string dari Settings → Database

#### Option C: PlanetScale (MySQL)
1. Go to https://planetscale.com
2. New Database
3. Get connection string

**Simpan connection string ini! Anda akan butuh di Step 3.**

---

## STEP 2: Generate NextAuth Secret (1 menit)

Buka terminal dan jalankan:

```bash
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Atau
openssl rand -base64 32
```

Copy output (contoh: `abc123XYZ...`)  
**Simpan secret ini! Anda akan butuh di Step 3.**

---

## STEP 3: Push ke GitHub (5 menit)

```bash
# Masuk ke folder project
cd "C:\Users\Admin\OneDrive\Documents\ITK\Semester 7\ProjectIPPL\ProjectIPPL\smart-study-assistant"

# Pastikan .gitignore sudah benar
# File .env TIDAK boleh di-commit!

# Initialize Git (jika belum)
git init

# Add remote repository (ganti dengan repo Anda)
git remote add origin https://github.com/username/smart-study-assistant.git

# Commit dan push
git add .
git commit -m "Ready for deployment"
git push -u origin main
```

**Jika belum punya repository:**
1. Go to https://github.com/new
2. Create repository: "smart-study-assistant"
3. Jangan initialize dengan README (sudah ada)
4. Copy URL dan gunakan di command di atas

---

## STEP 4: Deploy ke Vercel (10 menit)

### 4.1 Import Project
1. Go to https://vercel.com/new
2. Import Git Repository
3. Pilih repository: `smart-study-assistant`
4. Framework: **Next.js** (auto-detected)
5. Root Directory: `smart-study-assistant` (atau sesuaikan)

### 4.2 Environment Variables
Klik "Environment Variables" dan tambahkan:

```env
# Database
DATABASE_URL=postgresql://... (dari Step 1)

# NextAuth
NEXTAUTH_URL=https://your-project.vercel.app (akan otomatis)
NEXTAUTH_SECRET=<generated-secret-dari-step-2>

# AI
GEMINI_API_KEY=AIzaSyBndhiFjhlB2pOF20MXxVoMBSFVn80fHoQ
```

**Tips:** Copy paste satu-satu, pastikan tidak ada spasi di awal/akhir.

### 4.3 Deploy
1. Klik **Deploy**
2. Tunggu 2-3 menit
3. ✅ Deploy sukses!

---

## STEP 5: Database Migration (3 menit)

### Option A: Menggunakan Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Link project
cd smart-study-assistant
vercel link

# Run Prisma migration
npx prisma db push
```

### Option B: Menggunakan Vercel UI
1. Go to project di Vercel Dashboard
2. Settings → Functions
3. Terminal (jika tersedia)
4. Atau gunakan local dengan production DATABASE_URL:
   ```bash
   DATABASE_URL="<production-url>" npx prisma db push
   ```

---

## STEP 6: Testing (5 menit)

1. **Buka URL deployment** (contoh: `https://smart-study-assistant.vercel.app`)

2. **Test basic functionality:**
   - [ ] Home page loads
   - [ ] Register new user
   - [ ] Login
   - [ ] Upload PDF test file
   - [ ] Generate quiz
   - [ ] Generate summary
   - [ ] Check history

3. **Test API Health:**
   ```
   https://your-project.vercel.app/api/health
   https://your-project.vercel.app/api/test-gemini
   ```

---

## 🎉 DONE! Website Live!

Your Smart Study Assistant is now live at:
**https://your-project.vercel.app**

---

## 🔧 Troubleshooting

### Error: "DATABASE_URL is not defined"
- Check Environment Variables di Vercel Dashboard
- Redeploy project

### Error: "Prisma Client not generated"
- Go to Project Settings → General → Build & Development Settings
- Install Command: `npm install && npx prisma generate`
- Redeploy

### Error: "NextAuth configuration error"
- Check NEXTAUTH_URL matches deployment URL
- Check NEXTAUTH_SECRET is set
- Redeploy

### Database connection failed
- Verify DATABASE_URL is correct
- Check database is accessible (not IP restricted)
- For Neon: Make sure SSL mode is enabled

### PDF upload not working
- Check file size < 10MB
- Check file type is PDF
- Check Vercel function timeout (default 10s)

---

## 🔄 Update Deployment

Setiap kali ada perubahan code:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel akan **otomatis re-deploy**! 🚀

---

## 📊 Monitor Deployment

**Vercel Dashboard:**
- https://vercel.com/dashboard
- Analytics
- Logs
- Performance metrics

**Useful Links:**
- Deployment logs: Project → Deployments → Latest → Function Logs
- Analytics: Project → Analytics
- Environment Variables: Project → Settings → Environment Variables

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Project Docs:** `DEPLOYMENT.md` dan `DEPLOYMENT_READINESS_REPORT.md`

---

**Good luck with your deployment! 🚀**
