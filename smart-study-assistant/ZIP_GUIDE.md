# Smart Study Assistant - Panduan Zip Project

## File yang Perlu Di-zip

Pastikan Anda meng-zip file dan folder berikut:

```
smart-study-assistant/
├── src/                    # Source code
├── prisma/                # Database schema
├── public/                # Static files
├── scripts/               # Utility scripts
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
├── .dockerignore          # Docker ignore file
├── .env.example           # Environment template
├── next.config.ts         # Next.js config
├── package.json           # Dependencies
├── package-lock.json      # Lock file
├── tsconfig.json          # TypeScript config
├── postcss.config.mjs     # PostCSS config
├── eslint.config.mjs      # ESLint config
└── DOCKER_DEPLOYMENT.md   # Deployment guide
```

## File yang TIDAK Perlu Di-zip

Jangan sertakan file/folder berikut (akan di-generate otomatis):

```
node_modules/          # Dependencies (akan di-install otomatis)
.next/                # Build output
.env                  # Environment variables (buat manual)
*.db                  # Database files
*.db-journal          # Database journals
.git/                 # Git history (optional)
```

## Cara Zip Project

### Windows (PowerShell)

```powershell
# Navigasi ke folder parent
cd "C:\Users\Admin\OneDrive\Documents\ITK\Semester 7\ProjectIPPL\ProjectIPPL"

# Zip project
Compress-Archive -Path smart-study-assistant -DestinationPath smart-study-assistant.zip
```

### Linux/Mac

```bash
# Navigasi ke folder parent
cd /path/to/project/parent

# Zip project
zip -r smart-study-assistant.zip smart-study-assistant/ \
  -x "smart-study-assistant/node_modules/*" \
  -x "smart-study-assistant/.next/*" \
  -x "smart-study-assistant/.git/*" \
  -x "smart-study-assistant/*.db"
```

## Deployment di Server

### 1. Extract File

```bash
unzip smart-study-assistant.zip
cd smart-study-assistant
```

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env dengan editor favorit
nano .env
# atau
vi .env
```

**Minimal yang harus diatur:**
- `NEXTAUTH_SECRET` - Generate dengan: `openssl rand -base64 32`
- `NEXTAUTH_URL` - URL server (e.g., http://your-ip:3000)
- `GEMINI_API_KEY` - (Optional) Jika pakai Gemini

### 3. Deploy dengan Docker

```bash
# Build dan jalankan
docker-compose up -d

# Monitor logs
docker-compose logs -f app

# Cek status
docker-compose ps
```

### 4. Akses Aplikasi

Buka browser: `http://your-server-ip:3000`

## Checklist Deployment

- [ ] File sudah di-zip dengan benar
- [ ] Upload ke server
- [ ] Extract file
- [ ] Copy `.env.example` ke `.env`
- [ ] Edit `.env` dengan konfigurasi yang benar
- [ ] Jalankan `docker-compose up -d`
- [ ] Cek logs: `docker-compose logs -f`
- [ ] Test aplikasi di browser
- [ ] (Optional) Setup Ollama model: `docker exec -it ollama-server ollama pull qwen2:1.5b`

## Troubleshooting

### Jika ada error "port already in use"

Edit `docker-compose.yml`, ubah port:
```yaml
ports:
  - "8080:3000"  # Ganti dari 3000 ke port lain
```

### Jika database tidak terbuat

```bash
docker-compose exec app npx prisma db push
```

### Reset semua (HATI-HATI: hapus data!)

```bash
docker-compose down -v
docker-compose up -d
```

## Ukuran File

File zip akan sekitar:
- Tanpa node_modules & .next: ~5-10 MB
- Dengan node_modules: ~300-500 MB (TIDAK DISARANKAN)

**Rekomendasi:** Zip tanpa node_modules, biarkan Docker yang install dependencies.
