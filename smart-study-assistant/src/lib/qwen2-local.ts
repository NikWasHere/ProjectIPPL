/**
 * Qwen2 Local Integration via Ollama
 * Run Qwen2 7B/14B on your own computer - NO API needed!
 * 
 * Setup:
 * 1. Install Ollama: https://ollama.com/download
 * 2. Run: ollama pull qwen2:7b (or qwen2:14b for larger model)
 * 3. Run: ollama serve (keeps running in background)
 * 4. Use this file instead of huggingface.ts
 */

import axios from 'axios'

// Ollama runs locally on port 11434
const OLLAMA_API_URL = 'http://localhost:11434/api/generate'
const QWEN_MODEL = 'qwen2:7b' // or 'qwen2:14b' for 14B version

interface OllamaResponse {
  model: string
  response: string
  done: boolean
}

/**
 * Call Qwen2 via Ollama (LOCAL, no API key needed)
 */
async function callQwen2Local(prompt: string): Promise<string> {
  try {
    console.log(`🖥️ Calling local Qwen2 via Ollama...`)
    
    const response = await axios.post(
      OLLAMA_API_URL,
      {
        model: QWEN_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.95,
          num_predict: 2000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minutes for inference
      }
    )

    const result = response.data?.response
    if (!result) {
      throw new Error('No response from local Qwen2')
    }

    console.log(`✅ Local Qwen2 response received (${result.length} chars)`)
    return result.trim()
    
  } catch (error: any) {
    console.error('Qwen2 Local error:', error.response?.data || error.message)
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        'Ollama not running! Please:\n' +
        '1. Install Ollama from https://ollama.com/\n' +
        '2. Run: ollama pull qwen2:7b\n' +
        '3. Run: ollama serve\n' +
        '4. Try again'
      )
    }
    
    throw error
  }
}

/**
 * Generate quiz questions using local Qwen2
 */
export async function generateQuizWithQwen2(
  text: string,
  type: 'multiple_choice' | 'essay',
  count: number = 5
) {
  const limitedText = text.substring(0, 4000)

  const prompt = type === 'multiple_choice'
    ? `<|im_start|>system
Anda adalah asisten AI ahli membuat soal ujian berkualitas tinggi.
<|im_end|>
<|im_start|>user
Berdasarkan teks berikut, buatlah ${count} soal pilihan ganda dalam bahasa Indonesia:

TEKS:
${limitedText}

INSTRUKSI:
- Buat ${count} soal pilihan ganda berkualitas
- Setiap soal harus punya 4 pilihan jawaban
- Tandai jawaban yang benar
- Soal harus menguji pemahaman mendalam

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

Jawab HANYA dengan JSON di atas.
<|im_end|>
<|im_start|>assistant`
    : `<|im_start|>system
Anda adalah asisten AI ahli membuat soal ujian berkualitas tinggi.
<|im_end|>
<|im_start|>user
Berdasarkan teks berikut, buatlah ${count} soal essay dalam bahasa Indonesia:

TEKS:
${limitedText}

INSTRUKSI:
- Buat ${count} soal essay yang mendalam
- Sertakan panduan jawaban lengkap
- Soal harus analitis dan kritis

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

Jawab HANYA dengan JSON di atas.
<|im_end|>
<|im_start|>assistant`

  try {
    const response = await callQwen2Local(prompt)
    
    // Extract JSON from response
    let jsonStr = response
    const jsonMatch = response.match(/\{[\s\S]*"questions"[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    // Clean up
    jsonStr = jsonStr
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/<\|im_end\|>/g, '')
      .trim()
    
    const data = JSON.parse(jsonStr)
    return data.questions || []
  } catch (error) {
    console.error('Failed to generate quiz with local Qwen2:', error)
    throw error
  }
}

/**
 * Generate summary using local Qwen2
 */
export async function generateSummaryWithQwen2(text: string) {
  const limitedText = text.substring(0, 4000)

  const prompt = `<|im_start|>system
Anda adalah asisten AI ahli membuat ringkasan berkualitas tinggi.
<|im_end|>
<|im_start|>user
Buatkan ringkasan dari teks berikut dalam bahasa Indonesia:

TEKS:
${limitedText}

INSTRUKSI:
- Buat ringkasan yang jelas dan padat (2-3 paragraf)
- Ekstrak 6-8 poin kunci yang paling penting
- Fokus pada ide utama dan konsep penting

OUTPUT HARUS JSON VALID (tanpa markdown, tanpa penjelasan):
{
  "summary": "Ringkasan dalam 2-3 paragraf...",
  "keyPoints": [
    "Poin kunci 1",
    "Poin kunci 2",
    "Poin kunci 3"
  ]
}

Jawab HANYA dengan JSON di atas.
<|im_end|>
<|im_start|>assistant`

  try {
    const response = await callQwen2Local(prompt)
    
    // Extract JSON from response
    let jsonStr = response
    const jsonMatch = response.match(/\{[\s\S]*"summary"[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    // Clean up
    jsonStr = jsonStr
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/<\|im_end\|>/g, '')
      .trim()
    
    const data = JSON.parse(jsonStr)
    return {
      summary: data.summary || '',
      keyPoints: data.keyPoints || []
    }
  } catch (error) {
    console.error('Failed to generate summary with local Qwen2:', error)
    throw error
  }
}

// Check if Ollama is available
export const USE_QWEN2_LOCAL = true // Always available once Ollama is set up

console.log(`🖥️ Qwen2 Local (Ollama) ready`)
console.log(`   Model: ${QWEN_MODEL}`)
console.log(`   API: Ollama (http://localhost:11434)`)
console.log(`   Setup: https://ollama.com/`)
