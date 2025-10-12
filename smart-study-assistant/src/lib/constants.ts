// Application configuration constants

export const APP_CONFIG = {
  name: 'SmartStudy AI',
  description: 'Asisten Belajar Cerdas dengan Kecerdasan Buatan',
  version: '1.0.0',
  author: 'SmartStudy Team',
  website: 'https://smartstudy-ai.vercel.app'
} as const

export const FILE_UPLOAD = {
  maxSizeMB: 10,
  allowedTypes: ['.pdf'],
  allowedMimeTypes: ['application/pdf']
} as const

export const QUIZ_CONFIG = {
  maxQuestions: 10,
  minQuestions: 3,
  defaultQuestions: 5,
  multipleChoiceOptions: 4,
  types: {
    MULTIPLE_CHOICE: 'multiple_choice',
    ESSAY: 'essay'
  }
} as const

export const SUMMARY_CONFIG = {
  minTextLength: 50,
  maxKeyPoints: 8,
  defaultKeyPoints: 5,
  targetCompressionRatio: 30 // 30% of original length
} as const

export const API_ENDPOINTS = {
  extractText: '/api/extract-text',
  generateQuiz: '/api/generate-quiz',
  generateSummary: '/api/generate-summary'
} as const

export const UI_CONFIG = {
  animations: {
    fadeInDuration: '0.6s',
    slideUpDistance: '20px'
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px'
  },
  colors: {
    primary: '#111827',
    secondary: '#4B5563',
    accent: '#6B7280',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    border: '#E5E7EB'
  }
} as const

export const MESSAGES = {
  errors: {
    fileRequired: 'Silakan pilih file PDF atau masukkan teks',
    modeRequired: 'Pilih mode yang diinginkan (Kuis atau Ringkasan)',
    fileSize: `Ukuran file maksimal ${FILE_UPLOAD.maxSizeMB}MB`,
    fileType: 'Hanya file PDF yang diperbolehkan',
    textTooShort: `Teks minimal ${SUMMARY_CONFIG.minTextLength} karakter`,
    processingFailed: 'Terjadi kesalahan saat memproses request',
    networkError: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
    pdfExtractFailed: 'Gagal mengekstrak teks dari PDF. Pastikan file tidak terlindungi.'
  },
  success: {
    textExtracted: 'Teks berhasil diekstrak dari PDF',
    quizGenerated: 'Kuis berhasil dibuat',
    summaryGenerated: 'Ringkasan berhasil dibuat',
    copied: 'Hasil berhasil disalin ke clipboard'
  },
  loading: {
    extracting: 'Mengekstrak teks dari PDF...',
    generating: 'Sedang memproses dengan AI...',
    processing: 'Memproses...'
  }
} as const

export const PLACEHOLDER_TEXTS = {
  textInput: 'Tempel atau ketik materi pembelajaran di sini...\n\nContoh:\n- Materi sejarah Indonesia\n- Konsep matematika\n- Teori fisika\n- Dan materi pembelajaran lainnya',
  emptyState: 'Masukkan materi dan pilih mode untuk memulai'
} as const

// SEO and metadata
export const SEO = {
  title: 'SmartStudy AI - Asisten Belajar Cerdas',
  description: 'Platform AI untuk membuat kuis dan ringkasan dari materi pembelajaran Anda. Upload PDF atau input teks, dapatkan kuis pilihan ganda, esai, atau ringkasan otomatis.',
  keywords: 'AI, pembelajaran, kuis, ringkasan, pendidikan, study assistant, artificial intelligence, quiz generator, summary generator',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
} as const

// Analytics and tracking (for future implementation)
export const ANALYTICS = {
  events: {
    fileUpload: 'file_upload',
    textInput: 'text_input',
    quizGenerated: 'quiz_generated',
    summaryGenerated: 'summary_generated',
    resultCopied: 'result_copied'
  }
} as const