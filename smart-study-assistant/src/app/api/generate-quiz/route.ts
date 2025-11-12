import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiLimiter } from '@/lib/rate-limit'
import { generateQuizWithGemini, USE_GEMINI } from '@/lib/gemini'
import { generateQuizWithHuggingFace, USE_HUGGINGFACE } from '@/lib/huggingface'

interface QuizQuestion {
  question: string
  options?: string[]
  correctAnswer: string
  type: 'multiple_choice' | 'essay'
}

function generateMockQuestions(type: 'multiple_choice' | 'essay', count: number): QuizQuestion[] {
  if (type === 'multiple_choice') {
    const sampleQuestions = [
      {
        question: "Siapakah yang membacakan teks Proklamasi Kemerdekaan Indonesia?",
        options: ["Mohammad Hatta", "Soekarno", "Sutan Sjahrir", "Ki Hajar Dewantara"],
        correctAnswer: "Soekarno",
        type: "multiple_choice" as const
      },
      {
        question: "Kapan Proklamasi Kemerdekaan Indonesia dibacakan?",
        options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "15 Agustus 1945"],
        correctAnswer: "17 Agustus 1945",
        type: "multiple_choice" as const
      },
      {
        question: "Apa yang menjadi dasar negara Indonesia?",
        options: ["UUD 1945", "Pancasila", "Bhinneka Tunggal Ika", "Garuda Pancasila"],
        correctAnswer: "Pancasila",
        type: "multiple_choice" as const
      }
    ]
    return sampleQuestions.slice(0, count)
  } else {
    const sampleEssayQuestions = [
      {
        question: "Jelaskan proses persiapan Proklamasi Kemerdekaan Indonesia!",
        correctAnswer: "Jawaban harus mencakup: persiapan PPKI, peran Soekarno-Hatta, dan pembacaan proklamasi.",
        type: "essay" as const
      },
      {
        question: "Analisis pentingnya Pancasila sebagai dasar negara Indonesia!",
        correctAnswer: "Jawaban harus mencakup: filosofi Pancasila dan relevansi dengan keberagaman Indonesia.",
        type: "essay" as const
      }
    ]
    return sampleEssayQuestions.slice(0, count)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get auth session
    const session = await auth()
    const { text, type, count = 5, saveToHistory = true } = await request.json()
    
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const canProceed = await aiLimiter.consume(ip).catch(() => false)
    
    if (!canProceed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      )
    }
    
    if (!text) {
      return NextResponse.json(
        { error: 'Teks tidak boleh kosong' },
        { status: 400 }
      )
    }
    
    if (!type || !['multiple_choice', 'essay'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipe kuis harus multiple_choice atau essay' },
        { status: 400 }
      )
    }
    
    let questions: QuizQuestion[]
    
    // Try multiple AI providers with fallback
    if (USE_GEMINI) {
      try {
        console.log('🤖 Trying Gemini AI...')
        questions = await generateQuizWithGemini(text, type, count)
        console.log('✅ Gemini AI generation successful')
      } catch (geminiError: any) {
        console.log('⚠️ Gemini AI failed:', geminiError.message)
        
        // Fallback to Hugging Face
        if (USE_HUGGINGFACE) {
          try {
            console.log('🤗 Trying Hugging Face AI...')
            questions = await generateQuizWithHuggingFace(text, type, count)
            console.log('✅ Hugging Face generation successful')
          } catch (hfError: any) {
            console.log('⚠️ Hugging Face failed:', hfError.message)
            console.log('📝 Using fallback mock data')
            questions = generateMockQuestions(type, count)
          }
        } else {
          console.log('📝 Using fallback mock data')
          questions = generateMockQuestions(type, count)
        }
      }
    } else if (USE_HUGGINGFACE) {
      try {
        console.log('🤗 Generating quiz with Hugging Face AI...')
        questions = await generateQuizWithHuggingFace(text, type, count)
        console.log('✅ Hugging Face generation successful')
      } catch (hfError) {
        console.log('⚠️ Hugging Face failed, using mock data')
        questions = generateMockQuestions(type, count)
      }
    } else {
      console.log('⚠️ No AI configured, using mock data')
      questions = generateMockQuestions(type, count)
    }
    
    // Save to history disabled for now - will be enabled when auth is configured
    // Save to database if user is logged in and saveToHistory is true
    if (session?.user?.id && saveToHistory) {
      try {
        const document = await prisma.document.create({
          data: {
            userId: session.user.id,
            title: `Quiz Document - ${new Date().toLocaleDateString()}`,
            content: text.substring(0, 5000), // Limit content length
            fileType: 'text'
          }
        })
        
        await prisma.quiz.create({
          data: {
            userId: session.user.id,
            documentId: document.id,
            title: `${type === 'multiple_choice' ? 'Multiple Choice' : 'Essay'} Quiz`,
            type: type === 'multiple_choice' ? 'MULTIPLE_CHOICE' : 'ESSAY',
            questions: JSON.parse(JSON.stringify(questions))
          }
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue even if DB save fails
      }
    }
    
    return NextResponse.json({
      questions,
      success: true,
      totalQuestions: questions.length,
      generatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Quiz generation error:', error)
    
    return NextResponse.json(
      { error: 'Gagal membuat kuis. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
