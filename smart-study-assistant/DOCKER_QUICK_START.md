# 🐳 Docker Deployment - Quick Reference

## 📋 Files Created

Saya telah membuat file-file berikut untuk deployment:

1. **Dockerfile** - Konfigurasi Docker image
2. **docker-compose.yml** - Orchestration file untuk multi-container
3. **.dockerignore** - File yang diabaikan saat build
4. **.env.example** - Template environment variables
5. **DOCKER_DEPLOYMENT.md** - Panduan deployment lengkap
6. **ZIP_GUIDE.md** - Panduan zip project
7. **zip-project.ps1** - Script auto-zip untuk Windows
8. **zip-project.sh** - Script auto-zip untuk Linux/Mac

## 🚀 Quick Deploy (3 Langkah)

### 1️⃣ Zip Project

**Windows:**
```powershell
.\zip-project.ps1
```

**Linux/Mac:**
```bash
chmod +x zip-project.sh
./zip-project.sh
```

### 2️⃣ Upload & Extract di Server

```bash
# Upload file zip ke server (gunakan scp, ftp, dll)
scp smart-study-assistant-*.zip user@server:/path/to/deploy/

# SSH ke server
ssh user@server

# Extract
unzip smart-study-assistant-*.zip
cd smart-study-assistant
```

### 3️⃣ Deploy

```bash
# Setup environment
cp .env.example .env
nano .env  # Edit sesuai kebutuhan

# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Deploy
docker-compose up -d
```

## 🔧 Environment Variables (Minimal)

Edit file `.env` dengan nilai berikut:

```env
DATABASE_URL="file:/app/data/dev.db"
NEXTAUTH_URL="http://your-server-ip:3000"
NEXTAUTH_SECRET="hasil-dari-openssl-rand-base64-32"
```

**Optional (jika pakai Gemini AI):**
```env
GEMINI_API_KEY="your-gemini-api-key"
```

## 📊 Services yang Akan Berjalan

1. **app** (Port 3000) - Next.js Application
2. **ollama** (Port 11434) - Local AI Model (Optional)

## 🔍 Monitoring

```bash
# Lihat status
docker-compose ps

# Lihat logs
docker-compose logs -f app

# Lihat resource usage
docker stats
```

## 🛑 Management

```bash
# Stop
docker-compose down

# Restart
docker-compose restart

# Update (setelah git pull)
docker-compose up -d --build
```

## 📚 Dokumentasi Lengkap

- **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)** - Panduan deployment detail
- **[ZIP_GUIDE.md](ZIP_GUIDE.md)** - Panduan zip project

## ⚠️ Notes

- Port 3000 harus available
- Butuh minimal 2GB RAM
- Docker & Docker Compose harus terinstall
- Untuk production, gunakan reverse proxy (Nginx)
- Setup firewall untuk keamanan

## 🔒 Security Checklist

- [ ] Ganti `NEXTAUTH_SECRET` dengan nilai random
- [ ] Update `NEXTAUTH_URL` dengan domain/IP server
- [ ] Jangan commit file `.env`
- [ ] Gunakan HTTPS di production
- [ ] Setup firewall rules
- [ ] Regular backup database

## 🐛 Troubleshooting

**Port sudah digunakan:**
```yaml
# Edit docker-compose.yml
ports:
  - "8080:3000"  # Ganti 3000 ke port lain
```

**Database error:**
```bash
docker-compose exec app npx prisma db push
```

**Reset semua (HAPUS DATA!):**
```bash
docker-compose down -v
docker-compose up -d
```

## 📞 Support

Baca dokumentasi lengkap atau check logs untuk troubleshooting.
