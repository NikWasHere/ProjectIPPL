/**
 * FREE LLM Integration using Groq API
 * Models: Llama 3, Mixtral, Gemma - ALL FREE & FAST!
 * 
 * Groq provides FREE unlimited inference for:
 * - llama3-70b-8192 (70B, very powerful)
 * - llama3-8b-8192 (8B, fast)
 * - mixtral-8x7b-32768 (MoE, excellent quality)
 * - gemma-7b-it (7B, Google model)
 * 
 * Get free API key: https://console.groq.com/keys
 * Docs: https://console.groq.com/docs
 */

import axios from 'axios'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || '' // Backup

// Groq API - FREE & FASTEST inference
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama3-70b-8192' // 70B model, FREE, very powerful for Indonesian

interface AIResponse {
  generated_text?: string
  error?: string
}

/**
 * Call Groq API (FREE LLM inference)
 * Using Llama 3 70B - FREE unlimited, super fast
 */
async function callGroqLLM(prompt: string): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your-groq-api-key-here') {
    throw new Error(
      'Groq API key not configured. ' +
      'Please add GROQ_API_KEY to your .env file. ' +
      'Get FREE key from: https://console.groq.com/keys (no credit card needed!)'
    )
  }

  try {
    console.log(`🚀 Calling Groq ${GROQ_MODEL}...`)
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "Anda adalah asisten AI yang ahli membuat soal ujian dan ringkasan. Selalu jawab dalam bahasa Indonesia dengan format JSON yang valid dan struktural."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.95,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    )

    const result = response.data?.choices?.[0]?.message?.content
    if (!result) {
      throw new Error('No response from Groq LLM')
    }

    console.log(`✅ Groq response received (${result.length} chars)`)
    return result.trim()
    
  } catch (error: any) {
    console.error('Groq API error:', error.response?.data || error.message)
    
    // Better error messages
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    } else if (error.response?.status === 401) {
      throw new Error('Invalid Groq API key. Check your token at https://console.groq.com/keys')
    } else if (error.response?.status === 400) {
      throw new Error('Invalid request format.')
    }
    
    throw error
  }
}

/**
 * Generate quiz questions using Hugging Face
 */
export async function generateQuizWithHuggingFace(
  text: string,
  type: 'multiple_choice' | 'essay',
  count: number = 5
) {
  const limitedText = text.substring(0, 4000) // Groq has large context

  const prompt = type === 'multiple_choice'
    ? `Berdasarkan teks berikut, buatlah ${count} soal pilihan ganda dalam bahasa Indonesia:

TEKS:
${limitedText}

INSTRUKSI:
- Buat ${count} soal pilihan ganda berkualitas tinggi
- Setiap soal harus punya 4 pilihan jawaban
- Tandai jawaban yang benar
- Soal harus menguji pemahaman mendalam, bukan hafalan

OUTPUT HARUS JSON VALID (tanpa markdown, tanpa penjelasan):
{
  "questions": [
    {
      "question": "Pertanyaan?",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctAnswer": "Pilihan A",
      "type": "multiple_choice"
    }
  ]
}

Jawab HANYA dengan JSON di atas, tidak ada teks lain.`
    : `Berdasarkan teks berikut, buatlah ${count} soal essay dalam bahasa Indonesia:

TEKS:
${limitedText}

INSTRUKSI:
- Buat ${count} soal essay yang mendalam dan analitis
- Sertakan panduan jawaban lengkap untuk setiap soal
- Soal harus menguji analisis dan pemikiran kritis

OUTPUT HARUS JSON VALID (tanpa markdown, tanpa penjelasan):
{
  "questions": [
    {
      "question": "Pertanyaan essay?",
      "correctAnswer": "Panduan jawaban lengkap",
      "type": "essay"
    }
  ]
}

Jawab HANYA dengan JSON di atas, tidak ada teks lain.`

  try {
    const response = await callGroqLLM(prompt)
    
    // Extract JSON from response
    let jsonStr = response
    
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*"questions"[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    // Clean up common issues
    jsonStr = jsonStr
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    
    const data = JSON.parse(jsonStr)
    return data.questions || []
  } catch (error) {
    console.error('Failed to generate quiz with Groq LLM:', error)
    throw error
  }
}

/**
 * Generate summary using Hugging Face
 */
export async function generateSummaryWithHuggingFace(text: string) {
  const limitedText = text.substring(0, 4000) // Groq has large context

  const prompt = `Buatkan ringkasan dari teks berikut dalam bahasa Indonesia:

TEKS:
${limitedText}

INSTRUKSI:
- Buat ringkasan yang jelas dan padat (2-3 paragraf)
- Ekstrak 6-8 poin kunci yang paling penting
- Fokus pada ide utama dan konsep penting
- Gunakan bahasa yang mudah dipahami

OUTPUT HARUS JSON VALID (tanpa markdown, tanpa penjelasan):
{
  "summary": "Ringkasan dalam 2-3 paragraf...",
  "keyPoints": [
    "Poin kunci 1",
    "Poin kunci 2",
    "Poin kunci 3"
  ]
}

Jawab HANYA dengan JSON di atas, tidak ada teks lain.`

  try {
    const response = await callGroqLLM(prompt)
    
    // Extract JSON from response
    let jsonStr = response
    
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*"summary"[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    // Clean up common issues
    jsonStr = jsonStr
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    
    const data = JSON.parse(jsonStr)
    return {
      summary: data.summary || '',
      keyPoints: data.keyPoints || []
    }
  } catch (error) {
    console.error('Failed to generate summary with Groq LLM:', error)
    throw error
  }
}

// Check if Groq LLM is configured
export const USE_HUGGINGFACE = !!GROQ_API_KEY && !GROQ_API_KEY.includes('your-groq-api-key')

console.log(`🚀 Groq LLM configured: ${USE_HUGGINGFACE ? 'Yes' : 'No'}`)
if (USE_HUGGINGFACE) {
  console.log(`   Model: ${GROQ_MODEL} (Llama 3 70B)`)
  console.log(`   API: Groq (FREE, unlimited, super fast!)`)
  console.log(`   Get key: https://console.groq.com/keys`)
}
