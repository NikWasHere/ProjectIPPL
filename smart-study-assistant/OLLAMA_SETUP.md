# 🖥️ Setup Qwen2 Local (Tanpa API, 100% Offline)

## ✅ **CARA INSTALL QWEN2 DI KOMPUTER SENDIRI**

### **Step 1: Install Ollama**

**Windows:**
1. Download: https://ollama.com/download/windows
2. Jalankan installer
3. Ollama akan otomatis running di background

**Mac:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

---

### **Step 2: Download Qwen2 Model**

Buka terminal/PowerShell dan jalankan:

```powershell
# Download Qwen2 7B (4.4 GB)
ollama pull qwen2:7b

# ATAU Qwen2 14B jika RAM cukup (8.7 GB)
ollama pull qwen2:14b

# ATAU Qwen2 1.5B jika komputer lemah (934 MB)
ollama pull qwen2:1.5b
```

**Pilihan Model:**
- `qwen2:1.5b` - Paling ringan (RAM 2GB+)
- `qwen2:7b` ⭐ - Recommended (RAM 8GB+)
- `qwen2:14b` - Paling powerful (RAM 16GB+)

---

### **Step 3: Start Ollama Server**

```powershell
ollama serve
```

**Leave this terminal running!** Ollama akan serve di `http://localhost:11434`

---

### **Step 4: Test Qwen2**

Buka terminal baru:

```powershell
# Test quick chat
ollama run qwen2:7b "Halo, siapa kamu?"

# Seharusnya Qwen2 menjawab dalam bahasa Indonesia!
```

---

### **Step 5: Update Project**

1. Rename file di project:
   ```
   src/lib/huggingface.ts → src/lib/huggingface.ts.backup
   src/lib/qwen2-local.ts → src/lib/huggingface.ts
   ```

2. Restart development server:
   ```powershell
   npm run dev
   ```

---

## 🧪 **Test Integration**

Buat file `test-ollama.js`:

```javascript
const axios = require('axios');

async function testOllama() {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'qwen2:7b',
      prompt: 'Buatlah 1 soal pilihan ganda tentang AI dalam bahasa Indonesia.',
      stream: false
    });
    
    console.log('✅ Ollama working!');
    console.log('Response:', response.data.response);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Ollama not running! Run: ollama serve');
    }
  }
}

testOllama();
```

Jalankan:
```powershell
node test-ollama.js
```

---

## ⚙️ **Konfigurasi**

File: `src/lib/qwen2-local.ts`

```typescript
// Change model here
const QWEN_MODEL = 'qwen2:7b' // or 'qwen2:14b', 'qwen2:1.5b'

// Change Ollama URL if needed (default: localhost)
const OLLAMA_API_URL = 'http://localhost:11434/api/generate'
```

---

## 📊 **Perbandingan**

| Fitur | Ollama (Local) | Groq API | Hugging Face API |
|-------|----------------|----------|------------------|
| **Biaya** | 100% GRATIS | 100% GRATIS | API limit |
| **Privacy** | ✅ Total offline | ❌ Online | ❌ Online |
| **Speed** | Tergantung CPU/GPU | ⚡ Super fast | Slow (cold start) |
| **Setup** | Install Ollama | Sign up only | API key needed |
| **Model** | Qwen2 7B/14B | Llama 3 70B | Limited |
| **Internet** | ❌ Not needed | ✅ Required | ✅ Required |

---

## 🚀 **Keuntungan Ollama**

✅ **100% GRATIS** - No API key, no quota
✅ **PRIVACY** - Data tidak keluar dari komputer
✅ **OFFLINE** - Bisa tanpa internet
✅ **UNLIMITED** - Tidak ada rate limit
✅ **CUSTOM** - Bisa pake model apapun dari Ollama library

---

## 📋 **Model Alternatif (Ollama)**

Selain Qwen2, bisa pakai:

```powershell
# Llama 3 (by Meta)
ollama pull llama3:8b

# Mistral (excellent quality)
ollama pull mistral:7b

# Gemma (by Google)
ollama pull gemma:7b

# Phi-3 (by Microsoft, ringan!)
ollama pull phi3:mini
```

Ganti model di `qwen2-local.ts`:
```typescript
const QWEN_MODEL = 'llama3:8b' // or any model above
```

---

## 🔧 **System Requirements**

**Minimum (Qwen2 1.5B):**
- RAM: 2 GB
- Disk: 1 GB
- CPU: Any modern CPU

**Recommended (Qwen2 7B):**
- RAM: 8 GB
- Disk: 5 GB
- CPU: 4+ cores
- GPU: Optional (NVIDIA for acceleration)

**Optimal (Qwen2 14B):**
- RAM: 16 GB
- Disk: 10 GB
- CPU: 6+ cores
- GPU: NVIDIA RTX recommended

---

## 🐛 **Troubleshooting**

### **Error: "ECONNREFUSED"**
**Solusi:**
```powershell
ollama serve
```
Leave it running!

### **Error: "model not found"**
**Solusi:**
```powershell
ollama pull qwen2:7b
```

### **Slow inference**
**Solusi:**
1. Use smaller model (`qwen2:1.5b`)
2. Enable GPU acceleration (NVIDIA only)
3. Close other applications

---

## 🎯 **Rekomendasi**

**Untuk Development (Laptop biasa):**
- Use **Groq API** (FREE, super fast, no install)
- Get key: https://console.groq.com/keys

**Untuk Privacy/Offline:**
- Use **Ollama + Qwen2 7B**
- Install sekarang: https://ollama.com/

**Untuk Production:**
- Use **Gemini API** (reliable, good quality)
- Already configured in project!

---

**🎉 DONE! Qwen2 siap digunakan 100% offline tanpa API!**

Last Updated: November 24, 2025
Model: Qwen2 7B (via Ollama)
