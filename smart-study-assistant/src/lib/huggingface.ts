/**
 * Hugging Face Inference API Integration
 * FREE & UNLIMITED - No credit card needed
 * Get API key: https://huggingface.co/settings/tokens
 */

import axios from 'axios'

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || ''

// Using Google Flan-T5 - Always available on free tier, multilingual
// Alternative: 'facebook/bart-large-cnn' for summarization
const MODEL = 'google/flan-t5-large'
const HF_API_URL = `https://api-inference.huggingface.co/models/${MODEL}`

interface HuggingFaceResponse {
  generated_text?: string
  error?: string
}

/**
 * Call Hugging Face Inference API
 */
async function callHuggingFace(prompt: string): Promise<string> {
  if (!HF_API_KEY || HF_API_KEY === 'your-huggingface-token-here') {
    throw new Error('Hugging Face API key not configured')
  }

  try {
    const response = await axios.post<HuggingFaceResponse[]>(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // Increase timeout for free tier
      }
    )

    const result = response.data[0]?.generated_text
    if (!result) {
      throw new Error('No response from Hugging Face')
    }

    return result.trim()
  } catch (error: any) {
    console.error('Hugging Face API error:', error.response?.data || error.message)
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
  const limitedText = text.substring(0, 4000) // Smaller limit for free tier

  const prompt = type === 'multiple_choice'
    ? `Generate ${count} multiple choice questions in Indonesian language based on the following text. Output must be valid JSON only.

TEXT:
${limitedText}

Create ${count} multiple choice questions with 4 options (A, B, C, D) and mark the correct answer.

Output JSON format (JSON ONLY, no other text):
{
  "questions": [
    {
      "question": "Question in Indonesian?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "type": "multiple_choice"
    }
  ]
}`
    : `Generate ${count} essay questions in Indonesian language based on the following text. Output must be valid JSON only.

TEXT:
${limitedText}

Create ${count} deep essay questions with expected answers.

Output JSON format (JSON ONLY, no other text):
{
  "questions": [
    {
      "question": "Essay question in Indonesian?",
      "correctAnswer": "Expected answer",
      "type": "essay"
    }
  ]
}`

  try {
    const response = await callHuggingFace(prompt)
    
    // Extract JSON from response
    let jsonStr = response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    const data = JSON.parse(jsonStr)
    return data.questions || []
  } catch (error) {
    console.error('Failed to parse Hugging Face response:', error)
    throw error
  }
}

/**
 * Generate summary using Hugging Face
 */
export async function generateSummaryWithHuggingFace(text: string) {
  const limitedText = text.substring(0, 4000)

  const prompt = `Summarize the following text in Indonesian language and extract key points. Output must be valid JSON only.

TEXT:
${limitedText}

Create a clear summary (2-3 paragraphs) and extract 5-7 most important key points.

Output JSON format (JSON ONLY, no other text):
{
  "summary": "Summary text in Indonesian in 2-3 paragraphs...",
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ]
}`

  try {
    const response = await callHuggingFace(prompt)
    
    // Extract JSON from response
    let jsonStr = response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    const data = JSON.parse(jsonStr)
    return {
      summary: data.summary || '',
      keyPoints: data.keyPoints || []
    }
  } catch (error) {
    console.error('Failed to parse Hugging Face response:', error)
    throw error
  }
}

export const USE_HUGGINGFACE = !!HF_API_KEY && HF_API_KEY !== 'your-huggingface-token-here'

console.log(`🤗 Hugging Face configured: ${USE_HUGGINGFACE ? 'Yes' : 'No'}`)
