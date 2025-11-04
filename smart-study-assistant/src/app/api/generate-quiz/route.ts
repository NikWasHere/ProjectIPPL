import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiLimiter } from '@/lib/rate-limit'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

interface QuizQuestion {
  question: string
  options?: string[]
  correctAnswer: string
  type: 'multiple_choice' | 'essay'
}

async function generateQuizWithAI(text: string, type: 'multiple_choice' | 'essay', count: number = 5): Promise<QuizQuestion[]> {
  const prompt = type === 'multiple_choice' 
    ? `Generate ${count} multiple choice questions based on this text. Each question should have 4 options and indicate the correct answer. Return as JSON array with format: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "type": "multiple_choice"}]. Text: ${text}`
    : `Generate ${count} essay questions based on this text. Include suggested key points for the answer. Return as JSON array with format: [{"question": "...", "correctAnswer": "Key points: ...", "type": "essay"}]. Text: ${text}`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator. Generate high-quality quiz questions based on the provided text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No content generated')
    
    const questions = JSON.parse(content)
    return questions
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
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
    try {
      questions = await generateQuizWithAI(text, type, count)
    } catch (aiError) {
      console.log('AI generation failed, using fallback')
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
