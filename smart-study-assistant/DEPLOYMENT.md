# Deployment Guide - SmartStudy AI

## 🚀 Langkah-langkah Deployment

### 1. Persiapan Environment

```bash
# Clone repository
git clone <repository-url>
cd smart-study-assistant

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan konfigurasi yang sesuai
```

### 2. Database Setup (MySQL)

```sql
-- Buat database
CREATE DATABASE smart_study_assistant;

-- Buat user (opsional)
CREATE USER 'smartstudy'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON smart_study_assistant.* TO 'smartstudy'@'localhost';
FLUSH PRIVILEGES;
```

Update .env.local:
```env
DATABASE_URL="mysql://smartstudy:your-password@localhost:3306/smart_study_assistant"
```

### 3. Prisma Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Opsional) Seed database dengan data sample
npx prisma db seed
```

### 4. Build & Run

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## 📋 Testing Checklist

### ✅ Functional Testing

- [ ] **Upload PDF**
  - [ ] Upload file PDF valid (<10MB)
  - [ ] Reject file non-PDF
  - [ ] Reject file >10MB
  - [ ] Ekstraksi teks berhasil
  - [ ] Display teks hasil ekstraksi

- [ ] **Input Manual**
  - [ ] Input teks via textarea
  - [ ] Validasi panjang teks minimum
  - [ ] Clear input setelah reset

- [ ] **Mode Selection**
  - [ ] Switch antara Kuis dan Ringkasan
  - [ ] UI update sesuai mode
  - [ ] Validasi mode selected

- [ ] **Quiz Generation**
  - [ ] Generate pilihan ganda (4 opsi)
  - [ ] Generate esai dengan panduan
  - [ ] Switch tipe kuis
  - [ ] Display hasil kuis dengan benar

- [ ] **Summary Generation**
  - [ ] Generate ringkasan
  - [ ] Display poin-poin kunci
  - [ ] Hitung compression ratio

- [ ] **Copy Functionality**
  - [ ] Copy quiz hasil
  - [ ] Copy summary hasil
  - [ ] Feedback visual saat copy

- [ ] **Error Handling**
  - [ ] Display error messages
  - [ ] Handle network errors
  - [ ] Handle API errors

### ✅ UI/UX Testing

- [ ] **Responsive Design**
  - [ ] Mobile (< 640px)
  - [ ] Tablet (640px - 1024px)
  - [ ] Desktop (> 1024px)

- [ ] **Loading States**
  - [ ] File upload progress
  - [ ] Generation loading
  - [ ] Smooth transitions

- [ ] **Accessibility**
  - [ ] Keyboard navigation
  - [ ] Focus indicators
  - [ ] Screen reader compatible
  - [ ] Color contrast

### ✅ Performance Testing

- [ ] **Load Testing**
  - [ ] Handle multiple concurrent users
  - [ ] Memory usage normal
  - [ ] No memory leaks

- [ ] **File Processing**
  - [ ] Large PDF handling (up to 10MB)
  - [ ] Text processing speed
  - [ ] API response time < 5s

## 🌐 Deployment Platforms

### Vercel (Recommended)

1. **Setup Repository**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Vercel Configuration**
   - Connect GitHub repository
   - Set environment variables:
     ```
     DATABASE_URL=your-production-db-url
     NEXTAUTH_SECRET=your-production-secret
     ```

3. **Database Setup**
   - Use PlanetScale, Railway, atau Supabase untuk MySQL
   - Update DATABASE_URL di Vercel

### Manual Deployment (VPS)

1. **Server Setup**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   npm install -g pm2

   # Clone and setup
   git clone <repo-url>
   cd smart-study-assistant
   npm install
   npm run build
   ```

2. **Process Management**
   ```bash
   # Start with PM2
   pm2 start npm --name "smartstudy" -- start
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Monitoring & Maintenance

### Health Checks

```bash
# API health check
curl http://localhost:3000/api/health

# Database connection check
npx prisma db execute --command "SELECT 1"
```

### Log Monitoring

```bash
# PM2 logs
pm2 logs smartstudy

# Next.js logs
tail -f .next/server.log
```

### Performance Monitoring

- Setup Vercel Analytics
- Monitor API response times
- Track error rates
- Database performance metrics

## 🔐 Security Considerations

- [ ] Environment variables secured
- [ ] File upload validation
- [ ] API rate limiting
- [ ] CORS configuration
- [ ] HTTPS enabled
- [ ] Database access restricted

## 📊 Analytics Setup

### Google Analytics (Optional)

```typescript
// Add to layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database server running
   - Check network connectivity

2. **PDF Upload Not Working**
   - Check file size limits
   - Verify MIME type validation
   - Check server upload limits

3. **Build Errors**
   - Clear .next folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

4. **Performance Issues**
   - Enable compression middleware
   - Optimize images and assets
   - Check database query performance

## ✅ Go-Live Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Error tracking enabled (Sentry)
- [ ] Performance baseline established
- [ ] Documentation updated