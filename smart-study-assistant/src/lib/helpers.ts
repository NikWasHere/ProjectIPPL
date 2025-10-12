// PDF processing utilities
export const validatePDFFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'Hanya file PDF yang diperbolehkan' }
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'Ukuran file maksimal 10MB' }
  }

  return { isValid: true }
}

// Text processing utilities
export const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
    .trim()
}

export const chunkText = (text: string, chunkSize: number = 1000): string[] => {
  const words = text.split(' ')
  const chunks: string[] = []
  let currentChunk = ''

  for (const word of words) {
    if ((currentChunk + word).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = word
    } else {
      currentChunk += (currentChunk ? ' ' : '') + word
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

// Quiz utilities
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Summary utilities
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export const extractKeywords = (text: string, count: number = 10): string[] => {
  // Simple keyword extraction (in production, use more sophisticated NLP)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)

  const frequency: { [key: string]: number } = {}
  
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word)
}

// Date and time utilities
export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 30) return `${diffDays} hari yang lalu`
  
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Storage utilities for client-side caching
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Failed to get from localStorage:', error)
    return defaultValue
  }
}

// Error handling utilities
export const createErrorResponse = (message: string, status: number = 400) => {
  return Response.json({ error: message }, { status })
}

export const handleApiError = (error: unknown): Response => {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    return createErrorResponse(error.message, 500)
  }
  
  return createErrorResponse('Terjadi kesalahan internal server', 500)
}