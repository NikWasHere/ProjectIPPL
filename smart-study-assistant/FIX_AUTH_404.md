# Fix Auth 404 Error - Deployment

## Masalah
Error 404 saat register/login karena `NEXTAUTH_URL` tidak sesuai dengan URL production.

## Solusi yang Diterapkan

### 1. Update `.env.production`
- ✅ Changed `NEXTAUTH_URL` dari `http://localhost:3015` → `https://smartstudy.neverlands.xyz`
- ✅ Added `AUTH_TRUST_HOST="true"`

### 2. Update `src/lib/auth.ts`
- ✅ Added `trustHost: true` ke authConfig

## Langkah Redeploy

### Jika menggunakan Docker:

```powershell
# 1. Rebuild Docker image
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 2. Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Jika menggunakan platform lain (Vercel/Netlify/Railway):

1. **Pastikan environment variable di platform:**
   - `NEXTAUTH_URL` = `https://smartstudy.neverlands.xyz`
   - `NEXTAUTH_SECRET` = secret key yang aman
   - `AUTH_TRUST_HOST` = `true`

2. **Redeploy aplikasi:**
   - Push changes ke git
   - Platform akan auto-deploy, atau trigger manual deploy

## Verifikasi

Setelah redeploy, test:
1. ✅ Buka https://smartstudy.neverlands.xyz
2. ✅ Click "Login" atau "Daftar"
3. ✅ Should not show 404 error
4. ✅ Auth routes should work: `/api/auth/signin`, `/api/auth/callback/credentials`

## Notes

- NextAuth memerlukan `NEXTAUTH_URL` yang sesuai dengan domain production
- `trustHost: true` penting untuk reverse proxy/production deployment
- Jangan lupa generate NEXTAUTH_SECRET yang kuat untuk production:
  ```bash
  openssl rand -base64 32
  ```
