# Smart Study Assistant - Auth Fix & Rebuild Instructions

## ✅ FIXES APPLIED

### 1. Auth 404 Error Fixed
- **File**: `.env.production`
  - Changed `NEXTAUTH_URL` from `http://localhost:3015` → `https://smartstudy.neverlands.xyz`
  - Added `AUTH_TRUST_HOST="true"`

- **File**: `src/lib/auth.ts`
  - Added `trustHost: true` to authConfig

## 🔧 HOW TO TEST LOCALLY

### Step 1: Unpause Docker Desktop
```
1. Click Docker icon in system tray (whale icon)
2. Click "Resume" or open Docker Desktop and click Resume button
```

### Step 2: Rebuild and Test
```powershell
# Navigate to project directory
cd "C:\Users\Admin\OneDrive\Documents\ITK\Semester 7\ProjectIPPL\ProjectIPPL\smart-study-assistant"

# Stop old containers
docker-compose -f docker-compose.prod.yml down

# Rebuild with no cache
docker-compose -f docker-compose.prod.yml build --no-cache

# Start containers
docker-compose -f docker-compose.prod.yml up -d

# Wait 30 seconds for services to start
Start-Sleep -Seconds 30

# Check if running
docker-compose -f docker-compose.prod.yml ps
```

### Step 3: Test Auth Endpoints
Open browser and test:
- http://localhost:3015 (Main page)
- http://localhost:3015/api/auth/signin (Should show NextAuth page, NOT 404)
- http://localhost:3015/api/auth/csrf (Should return JSON with CSRF token)
- http://localhost:3015/api/health (Should return {"status":"ok"})

### Step 4: Test Login/Register
1. Click "Daftar" (Register)
2. Fill in email and password
3. Should successfully register without 404 error
4. Test login with credentials

## 📦 CREATE DEPLOYMENT ZIP

Once local testing is successful:

```powershell
# Run zip script
.\zip-project.ps1
```

This will create: `smart-study-assistant-YYYYMMDD-HHMMSS.zip`

## 🚀 DEPLOY TO PRODUCTION

### Option 1: Docker Deployment (Recommended)
```bash
# On server:
unzip smart-study-assistant-YYYYMMDD-HHMMSS.zip
cd smart-study-assistant

# IMPORTANT: Edit .env.production
# Change NEXTAUTH_URL to your production domain
# Example: https://smartstudy.neverlands.xyz

docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Update Existing Deployment
Just update these files on your server:
- `.env.production` (update NEXTAUTH_URL)
- `src/lib/auth.ts` (has trustHost: true)

Then rebuild:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## ✅ VERIFICATION CHECKLIST

After deployment:
- [ ] https://smartstudy.neverlands.xyz loads without error
- [ ] Click "Login" button - no 404 error
- [ ] Click "Daftar" button - no 404 error
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Auth endpoints work:
  - `/api/auth/signin` - works
  - `/api/auth/callback/credentials` - works
  - `/api/auth/csrf` - returns JSON

## 🔍 TROUBLESHOOTING

### Still getting 404 on production?
1. Check `.env.production` has correct `NEXTAUTH_URL`
2. Verify `AUTH_TRUST_HOST="true"` is set
3. Rebuild docker: `docker-compose -f docker-compose.prod.yml build --no-cache`
4. Check logs: `docker-compose -f docker-compose.prod.yml logs -f app`

### Auth works locally but not on production?
- Make sure production `.env.production` has your actual domain
- Don't use `http://localhost` in production
- Use HTTPS in production: `https://yourdomain.com`

## 📝 SUMMARY OF CHANGES

**Files Modified:**
1. `.env.production` - Updated NEXTAUTH_URL for production
2. `src/lib/auth.ts` - Added trustHost: true
3. `FIX_AUTH_404.md` - Documentation of fix
4. `rebuild-and-test.ps1` - Automated test script
5. `AUTH_FIX_INSTRUCTIONS.md` - This file

**Ready for deployment!** ✅
