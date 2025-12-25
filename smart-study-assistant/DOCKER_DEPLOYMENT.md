# Docker Deployment Guide

## Prerequisites
- Docker dan Docker Compose terinstall di server
- Port 3000 tersedia (atau ubah di docker-compose.yml)
- (Optional) Port 11434 untuk Ollama jika menggunakan AI lokal

## Quick Start

### 1. Persiapan Environment Variables

Copy file `.env.example` menjadi `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env` dan atur minimal:
- `NEXTAUTH_SECRET` - Generate dengan: `openssl rand -base64 32`
- `NEXTAUTH_URL` - URL server Anda (e.g., http://your-server-ip:3000)
- `GEMINI_API_KEY` - (Optional) Jika menggunakan Gemini AI

### 2. Build dan Jalankan

```bash
# Build dan start semua services
docker-compose up -d

# Lihat logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop dan hapus volumes (HATI-HATI: akan menghapus data!)
docker-compose down -v
```

### 3. Pull Model Ollama (Optional)

Jika menggunakan Ollama untuk AI lokal:

```bash
# Masuk ke container Ollama
docker exec -it ollama-server ollama pull qwen2:1.5b

# Atau model lain yang Anda inginkan
docker exec -it ollama-server ollama pull llama2
```

### 4. Akses Aplikasi

Buka browser dan akses:
- Aplikasi: `http://your-server-ip:3000`
- (Optional) Ollama API: `http://your-server-ip:11434`

## Konfigurasi Production

### Update docker-compose.yml untuk Production

1. **Ganti NEXTAUTH_SECRET** dengan secret yang aman
2. **Update NEXTAUTH_URL** dengan domain production Anda
3. **Hapus service Ollama** jika tidak digunakan
4. **Tambahkan reverse proxy** (Nginx/Traefik) jika perlu

### Contoh dengan Nginx Reverse Proxy

```yaml
services:
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network
```

## Maintenance

### Backup Database

```bash
# Backup SQLite database
docker cp smart-study-assistant:/app/data/dev.db ./backup-$(date +%Y%m%d).db
```

### Update Aplikasi

```bash
# Pull latest code
git pull

# Rebuild dan restart
docker-compose up -d --build
```

### View Logs

```bash
# All services
docker-compose logs -f

# Only app
docker-compose logs -f app

# Only Ollama
docker-compose logs -f ollama
```

### Monitoring Resource

```bash
# Lihat resource usage
docker stats

# Lihat container yang running
docker-compose ps
```

## Troubleshooting

### Database Migration Issues

```bash
# Reset database (HATI-HATI: menghapus semua data!)
docker-compose exec app npx prisma db push --force-reset

# Atau rebuild dengan volume baru
docker-compose down -v
docker-compose up -d
```

### Permission Issues

```bash
# Fix permission untuk SQLite
docker-compose exec app chown -R nextjs:nodejs /app/data
```

### Port Already in Use

Ubah port di `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Ganti 3000 menjadi port lain
```

## Security Checklist

- [ ] Ganti `NEXTAUTH_SECRET` dengan nilai yang aman
- [ ] Update `NEXTAUTH_URL` dengan domain production
- [ ] Jangan commit file `.env` ke git
- [ ] Gunakan HTTPS di production
- [ ] Setup firewall untuk limit akses port
- [ ] Regular backup database
- [ ] Update Docker images secara berkala
- [ ] Monitor logs untuk aktivitas mencurigakan

## File Structure dalam Container

```
/app/
├── data/              # SQLite database (persistent volume)
│   └── dev.db
├── public/
│   └── uploads/       # Uploaded files (persistent volume)
├── .next/            # Built Next.js files
├── prisma/           # Prisma schema
├── node_modules/     # Dependencies
└── server.js         # Entry point
```

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| DATABASE_URL | SQLite database path | Yes | file:/app/data/dev.db |
| NEXTAUTH_URL | Public URL aplikasi | Yes | - |
| NEXTAUTH_SECRET | Secret untuk NextAuth | Yes | - |
| GEMINI_API_KEY | Google Gemini API key | No | - |
| OLLAMA_BASE_URL | Ollama service URL | No | http://ollama:11434 |
| OLLAMA_MODEL | Model Ollama | No | qwen2:1.5b |
| NODE_ENV | Environment mode | No | production |
