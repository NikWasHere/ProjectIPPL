# Smart Study Assistant - Deployment Ready Package 🚀

## 📦 Package Contents

This ZIP file contains a **production-ready** Smart Study Assistant with:

✅ **Working AI Integration** (Ollama/Qwen2 7B)
✅ **Docker Configuration** (All issues fixed)
✅ **Complete Documentation**
✅ **Auto-setup Scripts**

## 🎯 What's Included

### Application Files
- Full Next.js 15 application
- Prisma database schema
- API routes for quiz & summary generation
- Authentication with NextAuth.js

### Docker Setup (Ready to Deploy)
- `Dockerfile` - Multi-stage build with permissions fixed
- `docker-compose.yml` - Includes Ollama service
- `.env.production` - Environment template

### Helper Scripts
- `rebuild-docker.ps1` - One-click rebuild & setup
- `test-ai.ps1` - Test AI functionality
- `setup-ollama.ps1` - Setup Ollama model

### Documentation
- `DEPLOYMENT.md` - Full deployment guide
- `DOCKER_DEPLOYMENT.md` - Docker-specific instructions
- `QUICK_DEPLOY_GUIDE.md` - Quick start guide
- `USER_GUIDE.md` - User manual

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Docker Desktop installed and running
- 10 GB free disk space (for Ollama model)

### Deployment Steps

```bash
# 1. Extract the ZIP
unzip smart-study-assistant-YYYYMMDD-HHMMSS.zip
cd smart-study-assistant

# 2. Configure environment (optional)
# Edit .env.production if needed (default works fine)

# 3. Build and start
docker-compose build
docker-compose up -d

# 4. Wait for Ollama to download model (~5-10 minutes first time)
docker-compose logs -f ollama

# 5. Access application
# Open browser: http://localhost:3015
```

### Windows Users (PowerShell)

```powershell
# Extract ZIP to desired location
cd smart-study-assistant

# Run rebuild script (does everything automatically)
.\rebuild-docker.ps1

# Test AI functionality
.\test-ai.ps1
```

## 🧪 Verify Installation

### Check Services
```bash
docker-compose ps
```

Expected output:
- `ollama-server` - Running on port 11434
- `smart-study-assistant` - Running on port 3015

### Test AI
```bash
# Test Ollama
docker exec ollama-server ollama list

# Should show: qwen2:7b (4.4 GB)
```

### Test Application
1. Open http://localhost:3015
2. Create account or skip login
3. Upload a PDF or paste text
4. Generate Quiz or Summary
5. ✅ AI should generate content (not mock data)

## 🔧 Configuration

### Ports
- **3015** - Application (can be changed in docker-compose.yml)
- **11434** - Ollama API (internal)

### AI Model
- **Default**: qwen2:7b (4.4 GB, ~7B parameters)
- **Change model**: Edit `OLLAMA_MODEL` in docker-compose.yml
- **Available models**: https://ollama.com/library

### Environment Variables
Edit `docker-compose.yml` or create `.env` file:

```env
# Application URL
NEXTAUTH_URL=http://localhost:3015

# Database (SQLite)
DATABASE_URL=file:/app/data/dev.db

# Ollama Configuration
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=qwen2:7b

# Optional: Add Gemini as fallback
GEMINI_API_KEY=your-key-here
```

## 📊 System Requirements

### Minimum
- 4 GB RAM
- 15 GB Disk Space
- Docker 20.10+

### Recommended
- 8 GB RAM
- 20 GB Disk Space
- SSD for better performance

## 🛠️ Troubleshooting

### Ollama model not found
```bash
# Pull model manually
docker exec ollama-server ollama pull qwen2:7b
```

### Permission denied errors
```bash
# Rebuild with no-cache
docker-compose build --no-cache
docker-compose up -d
```

### App not generating AI content
```bash
# Check Ollama is running
docker-compose logs ollama

# Test connection
docker exec smart-study-assistant wget -qO- http://ollama:11434/api/tags
```

### Port already in use
Edit `docker-compose.yml`:
```yaml
ports:
  - "3016:3000"  # Change 3015 to any available port
```

## 📚 Additional Resources

- Ollama Documentation: https://ollama.com/
- Next.js Documentation: https://nextjs.org/
- Prisma Documentation: https://www.prisma.io/

## 🔄 Updates & Maintenance

### Update Application
```bash
docker-compose pull
docker-compose up -d --build
```

### Update Ollama Model
```bash
docker exec ollama-server ollama pull qwen2:7b
docker-compose restart app
```

### Backup Database
```bash
# SQLite database is in Docker volume
docker run --rm -v smart-study-assistant_sqlite-data:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz -C /data .
```

## 💡 Tips

1. **First run takes 5-10 minutes** (downloading Ollama model)
2. **Subsequent starts are instant** (model is cached)
3. **Use `docker-compose logs -f`** to monitor startup
4. **Model runs on CPU by default** (GPU support available)

## 🎓 Features

- ✅ PDF Text Extraction
- ✅ AI Quiz Generation (Multiple Choice & Essay)
- ✅ AI Summary Generation
- ✅ User Authentication
- ✅ History Tracking
- ✅ Local AI (No API costs)
- ✅ Offline Capable

## 📝 License & Credits

Smart Study Assistant - Final Year Project
- Built with Next.js, Prisma, Ollama
- AI Model: Qwen2 7B (Apache 2.0 License)

---

## 🆘 Support

If you encounter issues:

1. Check `docker-compose logs app`
2. Check `docker-compose logs ollama`
3. Run `test-ai.ps1` for diagnostics
4. Review DEPLOYMENT.md for detailed troubleshooting

**Ready to deploy! 🚀**
