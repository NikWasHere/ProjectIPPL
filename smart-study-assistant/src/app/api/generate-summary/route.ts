import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiLimiter } from '@/lib/rate-limit'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-demo-key'
})

const USE_REAL_AI = !!process.env.OPENAI_API_KEY

// Mock AI service untuk generate ringkasan (fallback)
function generateMockSummary(text: string): { summary: string; keyPoints: string[] } {
  const keyPoints = [
    "Proklamasi Kemerdekaan Indonesia dibacakan pada 17 Agustus 1945 oleh Soekarno",
    "Pancasila merupakan dasar negara Indonesia yang terdiri dari lima sila",
    "Mohammad Hatta menjadi wakil presiden pertama Indonesia",
    "UUD 1945 adalah konstitusi negara yang menjadi landasan hukum tertinggi",
    "Bhinneka Tunggal Ika menjadi semboyan persatuan dalam keberagaman"
  ]
  
  const summary = `
Indonesia merupakan negara yang merdeka sejak 17 Agustus 1945, ketika Proklamasi Kemerdekaan dibacakan oleh Soekarno. Negara ini berdiri atas dasar Pancasila sebagai ideologi dan falsafah bangsa, dengan UUD 1945 sebagai konstitusi. Mohammad Hatta menjadi wakil presiden pertama yang mendampingi Soekarno. 

Keberagaman Indonesia tercermin dalam semboyan "Bhinneka Tunggal Ika" yang berarti berbeda-beda tetapi tetap satu. Hal ini menunjukkan bahwa meskipun terdiri dari berbagai suku, agama, ras, dan antargolongan, Indonesia tetap satu kesatuan yang utuh.

Perjuangan kemerdekaan melibatkan berbagai kalangan, terutama para pemuda yang memiliki peran penting dalam sejarah bangsa. Proklamasi kemerdekaan tidak hanya berdampak bagi bangsa Indonesia, tetapi juga mempengaruhi dunia internasional dalam konteks dekolonisasi.
  `.trim()
  
  return { summary, keyPoints }
}

// Real AI service using OpenAI
async function generateAISummary(text: string): Promise<{ summary: string; keyPoints: string[] }> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Anda adalah asisten yang ahli dalam membuat ringkasan teks. Tugas Anda:
1. Buat ringkasan yang jelas dan padat dari teks yang diberikan
2. Ekstrak 5-7 poin kunci paling penting
3. Pastikan ringkasan mempertahankan informasi penting
4. Gunakan bahasa yang mudah dipahami`
        },
        {
          role: 'user',
          content: `Buatkan ringkasan dan poin-poin kunci dari teks berikut:\n\n${text}\n\nFormat output sebagai JSON dengan struktur: { "summary": "...", "keyPoints": ["poin 1", "poin 2", ...] }`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(responseText)
    
    return {
      summary: result.summary || 'Ringkasan tidak dapat dibuat',
      keyPoints: result.keyPoints || []
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    // Fallback to mock if AI fails
    return generateMockSummary(text)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get auth session
    const session = await auth()
    const { text, saveToHistory = true } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'Teks tidak boleh kosong' },
        { status: 400 }
      )
    }
    
    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Teks terlalu pendek untuk diringkas' },
        { status: 400 }
      )
    }

    // Rate limiting for AI requests
    const identifier = session?.user?.email || 'anonymous'
    try {
      await aiLimiter.consume(identifier)
    } catch (rateLimitError) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
        { status: 429 }
      )
    }
    
    // Generate summary using AI (real or mock based on API key availability)
    const result = USE_REAL_AI 
      ? await generateAISummary(text)
      : generateMockSummary(text)

    // Save to database if user is logged in and saveToHistory is true
    if (session?.user?.id && saveToHistory) {
      try {
        const document = await prisma.document.create({
          data: {
            userId: session.user.id,
            title: `Summary Document - ${new Date().toLocaleDateString()}`,
            content: text.substring(0, 5000), // Limit content length
            fileType: 'text'
          }
        })
        
        // Store summary with key points embedded in content
        const summaryContent = `${result.summary}\n\n### Poin Kunci:\n${result.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}`
        
        await prisma.summary.create({
          data: {
            userId: session.user.id,
            documentId: document.id,
            title: 'Summary',
            content: summaryContent
          }
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue even if DB save fails
      }
    }
    
    return NextResponse.json({
      summary: result.summary,
      keyPoints: result.keyPoints,
      originalLength: text.length,
      summaryLength: result.summary.length,
      compressionRatio: Math.round((result.summary.length / text.length) * 100),
      generatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Gagal membuat ringkasan' },
      { status: 500 }
    )
  }
}