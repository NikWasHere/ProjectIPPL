import { NextRequest, NextResponse } from 'next/server'

interface QuizQuestion {
  question: string
  options?: string[]
  correctAnswer: string
  type: 'multiple_choice' | 'essay'
}

// Mock AI service untuk generate kuis
// Dalam implementasi nyata, ini akan menggunakan OpenAI API atau AI service lainnya
function generateQuizQuestions(text: string, type: 'multiple_choice' | 'essay', count: number = 5): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  
  if (type === 'multiple_choice') {
    // Generate multiple choice questions based on text content
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
      },
      {
        question: "Siapa yang menjadi wakil presiden pertama Indonesia?",
        options: ["Soekarno", "Mohammad Hatta", "Sutan Sjahrir", "Tan Malaka"],
        correctAnswer: "Mohammad Hatta",
        type: "multiple_choice" as const
      },
      {
        question: "Apa arti dari 'Bhinneka Tunggal Ika'?",
        options: ["Berbeda-beda tetapi tetap satu", "Satu untuk semua", "Persatuan dalam keberagaman", "Bersatu kita teguh"],
        correctAnswer: "Berbeda-beda tetapi tetap satu",
        type: "multiple_choice" as const
      }
    ]
    
    return sampleQuestions.slice(0, count)
  } else {
    // Generate essay questions
    const sampleEssayQuestions = [
      {
        question: "Jelaskan proses persiapan Proklamasi Kemerdekaan Indonesia dan peran tokoh-tokoh penting dalam peristiwa bersejarah tersebut!",
        correctAnswer: "Jawaban harus mencakup: persiapan PPKI, peran Soekarno-Hatta, penculikan ke Rengasdengklok, perumusan teks proklamasi, dan pembacaan proklamasi pada 17 Agustus 1945.",
        type: "essay" as const
      },
      {
        question: "Analisis pentingnya Pancasila sebagai dasar negara Indonesia dan bagaimana implementasinya dalam kehidupan berbangsa dan bernegara!",
        correctAnswer: "Jawaban harus mencakup: filosofi Pancasila, relevansi dengan keberagaman Indonesia, implementasi dalam UUD 1945, dan penerapan dalam kehidupan sehari-hari.",
        type: "essay" as const
      },
      {
        question: "Bagaimana peran pemuda dalam perjuangan kemerdekaan Indonesia dan apa relevansinya dengan pemuda masa kini?",
        correctAnswer: "Jawaban harus mencakup: peran pemuda dalam Sumpah Pemuda, perjuangan kemerdekaan, dan tantangan pemuda di era modern.",
        type: "essay" as const
      },
      {
        question: "Jelaskan makna persatuan dan kesatuan bangsa Indonesia dalam konteks 'Bhinneka Tunggal Ika'!",
        correctAnswer: "Jawaban harus mencakup: keberagaman suku, agama, ras, dan antargolongan, serta upaya menjaga persatuan di tengah perbedaan.",
        type: "essay" as const
      },
      {
        question: "Uraikan dampak Proklamasi Kemerdekaan Indonesia terhadap bangsa Indonesia dan dunia internasional!",
        correctAnswer: "Jawaban harus mencakup: dampak politik, sosial, ekonomi bagi Indonesia, serta pengakuan internasional dan posisi Indonesia di dunia.",
        type: "essay" as const
      }
    ]
    
    return sampleEssayQuestions.slice(0, count)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, type, count = 5 } = await request.json()
    
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
    
    // Generate questions using AI (mocked for now)
    const questions = generateQuizQuestions(text, type, count)
    
    return NextResponse.json({
      questions,
      totalQuestions: questions.length,
      type,
      generatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json(
      { error: 'Gagal membuat kuis' },
      { status: 500 }
    )
  }
}