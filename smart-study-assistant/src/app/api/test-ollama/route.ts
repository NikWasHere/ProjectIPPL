import { NextResponse } from 'next/server'
import { generateQuizWithQwen2 } from '@/lib/qwen2-local'

export async function GET() {
  try {
    console.log('🧪 Testing Ollama/Qwen2 connection...')
    
    const testText = "Python is a high-level programming language. It was created by Guido van Rossum and first released in 1991. Python emphasizes code readability and simplicity."
    
    // Test quiz generation
    const questions = await generateQuizWithQwen2(testText, 'multiple_choice', 2)
    
    return NextResponse.json({
      success: true,
      message: 'Ollama/Qwen2 is working!',
      test: {
        text: testText,
        generatedQuestions: questions,
        questionCount: questions.length
      },
      ollamaConfig: {
        baseUrl: process.env.OLLAMA_BASE_URL,
        model: process.env.OLLAMA_MODEL
      }
    })
    
  } catch (error: any) {
    console.error('❌ Ollama test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      ollamaConfig: {
        baseUrl: process.env.OLLAMA_BASE_URL,
        model: process.env.OLLAMA_MODEL
      }
    }, { status: 500 })
  }
}
