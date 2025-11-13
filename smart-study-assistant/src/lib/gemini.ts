// Import polyfill terlebih dahulu
import './fetch-polyfill'
import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

console.log(`🔑 Gemini API configured: ${apiKey ? 'Yes' : 'No'}`)

// Cache for available model (avoid repeated API calls)
let availableModel: string | null = null

// Helper function to get first available model
async function getAvailableModel(): Promise<string> {
  if (availableModel) return availableModel
  
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )
    
    const models = response.data.models || []
    console.log(`📋 Found ${models.length} models`)
    
    // Find first model that supports generateContent
    for (const model of models) {
      const supportedMethods = model.supportedGenerationMethods || []
      if (supportedMethods.includes('generateContent')) {
        const modelName = model.name.replace('models/', '')
        availableModel = modelName
        console.log(`✅ Using model: ${modelName}`)
        return modelName
      }
    }
    
    throw new Error('No models support generateContent')
  } catch (error: any) {
    console.error('❌ Failed to list models:', error.response?.data || error.message)
    // Fallback to known model name
    return 'gemini-2.5-pro'
  }
}

// Helper function to call Gemini API directly dengan axios (lebih reliable)
async function callGeminiAPI(prompt: string, temperature: number = 0.7, maxTokens: number = 2000) {
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  // Get available model dynamically
  const modelName = await getAvailableModel()
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`
    
  try {
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    })

    // Extract text dari response
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      throw new Error('No text in Gemini response')
    }

    console.log(`✅ Successfully generated content with ${modelName}`)
    return text
    
  } catch (error: any) {
    console.error(`❌ Gemini API error with ${modelName}:`, error.response?.data || error.message)
    throw error
  }
}

export const USE_GEMINI = !!apiKey

// Helper function to validate API key format
function isValidApiKey(key: string): boolean {
  return key.startsWith('AIza') && key.length > 30
}

// Check if API key is valid
if (apiKey && !isValidApiKey(apiKey)) {
  console.warn('⚠️ GEMINI_API_KEY format appears invalid. Expected format: AIzaSy...')
}

/**
 * Generate quiz questions using Google Gemini AI
 * Menggunakan direct API call dengan axios untuk reliability
 */
export async function generateQuizWithGemini(
  text: string,
  type: 'multiple_choice' | 'essay',
  count: number = 5
) {
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  try {
    // Limit text length to prevent token overflow
    const limitedText = text.substring(0, 8000)

    const prompt = type === 'multiple_choice'
      ? `Buat ${count} soal pilihan ganda dalam bahasa Indonesia berdasarkan teks berikut.

TEKS:
${limitedText}

INSTRUKSI:
1. Buat ${count} pertanyaan pilihan ganda yang berkualitas
2. Setiap pertanyaan harus memiliki 4 pilihan jawaban (A, B, C, D)
3. Tandai jawaban yang benar
4. Pertanyaan harus menguji pemahaman materi
5. Gunakan bahasa yang jelas dan mudah dipahami

Format output dalam JSON:
{
  "questions": [
    {
      "question": "Pertanyaan di sini?",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctAnswer": "Pilihan A",
      "type": "multiple_choice"
    }
  ]
}

HANYA kirimkan JSON, tanpa teks tambahan.`
      : `Buat ${count} soal essay dalam bahasa Indonesia berdasarkan teks berikut.

TEKS:
${limitedText}

INSTRUKSI:
1. Buat ${count} pertanyaan essay yang mendalam
2. Pertanyaan harus mendorong analisis dan pemahaman
3. Sertakan jawaban yang diharapkan
4. Gunakan bahasa formal dan akademis

Format output dalam JSON:
{
  "questions": [
    {
      "question": "Pertanyaan essay di sini?",
      "correctAnswer": "Jawaban yang diharapkan",
      "type": "essay"
    }
  ]
}

HANYA kirimkan JSON, tanpa teks tambahan.`

    // Call Gemini API dengan axios
    const textResponse = await callGeminiAPI(prompt, 0.7, 2000)

    // Clean up response - remove markdown code blocks if present
    const cleanedText = textResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const data = JSON.parse(cleanedText)
    return data.questions || []
  } catch (error: any) {
    console.error('Gemini quiz generation error:', error)
    
    // Better error messages
    if (error?.message?.includes('fetch failed')) {
      throw new Error('Network error: Tidak dapat terhubung ke Gemini AI. Check koneksi internet Anda.')
    } else if (error?.message?.includes('API key')) {
      throw new Error('Invalid API key: Periksa GEMINI_API_KEY di file .env')
    } else {
      throw new Error('Gagal membuat kuis dengan Gemini AI')
    }
  }
}

/**
 * Generate summary using Google Gemini AI
 * Menggunakan direct API call dengan axios untuk reliability
 */
export async function generateSummaryWithGemini(text: string) {
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  try {
    // Limit text length to prevent token overflow
    const limitedText = text.substring(0, 8000)

    const prompt = `Buat ringkasan dan poin-poin kunci dari teks berikut dalam bahasa Indonesia.

TEKS:
${limitedText}

INSTRUKSI:
1. Buat ringkasan yang jelas dan padat (2-3 paragraf)
2. Ekstrak 5-7 poin kunci paling penting
3. Pertahankan informasi penting
4. Gunakan bahasa yang mudah dipahami
5. Fokus pada ide utama dan konsep penting

Format output dalam JSON:
{
  "summary": "Ringkasan teks dalam 2-3 paragraf...",
  "keyPoints": [
    "Poin kunci 1",
    "Poin kunci 2",
    "Poin kunci 3",
    "dan seterusnya..."
  ]
}

HANYA kirimkan JSON, tanpa teks tambahan.`

    // Call Gemini API dengan axios
    const textResponse = await callGeminiAPI(prompt, 0.7, 1000)

    // Clean up response - remove markdown code blocks if present
    const cleanedText = textResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const data = JSON.parse(cleanedText)
    return {
      summary: data.summary || '',
      keyPoints: data.keyPoints || []
    }
  } catch (error: any) {
    console.error('Gemini summary generation error:', error)
    
    // Better error messages
    if (error?.message?.includes('fetch failed')) {
      throw new Error('Network error: Tidak dapat terhubung ke Gemini AI. Check koneksi internet Anda.')
    } else if (error?.message?.includes('API key')) {
      throw new Error('Invalid API key: Periksa GEMINI_API_KEY di file .env')
    } else {
      throw new Error('Gagal membuat ringkasan dengan Gemini AI')
    }
  }
}

/**
 * Analyze PDF content with Gemini AI
 * Menggunakan direct API call dengan axios untuk reliability
 */
export async function analyzePDFWithGemini(text: string): Promise<{
  summary: string
  topics: string[]
  complexity: 'beginner' | 'intermediate' | 'advanced'
}> {
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  try {
    const prompt = `Analisis konten PDF berikut dan berikan:
1. Ringkasan singkat (1 paragraf)
2. Topik-topik utama yang dibahas (3-5 topik)
3. Tingkat kesulitan materi (beginner/intermediate/advanced)

TEKS:
${text.substring(0, 5000)}

Format output dalam JSON:
{
  "summary": "Ringkasan singkat...",
  "topics": ["Topik 1", "Topik 2", "Topik 3"],
  "complexity": "intermediate"
}

HANYA kirimkan JSON, tanpa teks tambahan.`

    // Call Gemini API dengan axios
    const textResponse = await callGeminiAPI(prompt)

    const cleanedText = textResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const data = JSON.parse(cleanedText)
    return {
      summary: data.summary || '',
      topics: data.topics || [],
      complexity: data.complexity || 'intermediate'
    }
  } catch (error) {
    console.error('Gemini PDF analysis error:', error)
    throw new Error('Gagal menganalisis PDF dengan Gemini AI')
  }
}
