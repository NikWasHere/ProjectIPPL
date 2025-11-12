/**
 * Fetch polyfill untuk Node.js environment
 * Menggunakan undici sebagai implementasi fetch
 * 
 * File ini di-import SEBELUM GoogleGenerativeAI SDK
 * agar fetch tersedia saat SDK diinisialisasi
 */

// Check Node.js version - Node 18+ has native fetch
const nodeVersion = process.versions.node
const [major] = nodeVersion.split('.').map(Number)

if (major >= 18) {
  console.log(`✅ Node.js ${nodeVersion} has native fetch support`)
} else {
  console.log(`⚠️ Node.js ${nodeVersion} - loading fetch polyfill...`)
  
  if (typeof globalThis.fetch === 'undefined') {
    // Dynamic import dengan await di top-level (ES module support)
    import('undici').then(undici => {
      ;(globalThis as any).fetch = undici.fetch
      ;(globalThis as any).Headers = undici.Headers
      ;(globalThis as any).Request = undici.Request  
      ;(globalThis as any).Response = undici.Response
      console.log('✅ Fetch polyfill loaded (undici)')
    }).catch(err => {
      console.error('❌ Failed to load undici polyfill:', err)
    })
  }
}

export {}
