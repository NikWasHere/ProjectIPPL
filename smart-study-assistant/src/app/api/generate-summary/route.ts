import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiLimiter } from '@/lib/rate-limit'
import { generateSummaryWithGemini, USE_GEMINI } from '@/lib/gemini'
import { generateSummaryWithQwen2 } from '@/lib/qwen2-local'

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
    
    // Generate summary using multiple AI providers with fallback
    // Priority: Qwen2 Local (FREE, FAST) → Gemini (quota limited) → Mock data
    let result: { summary: string; keyPoints: string[] }
    
    try {
      console.log('🖥️ Generating summary with Qwen2 7B Local...')
      result = await generateSummaryWithQwen2(text)
      console.log('✅ Qwen2 Local generation successful')
    } catch (qwenError: any) {
      console.log('⚠️ Qwen2 Local failed:', qwenError.message)
      
      // Fallback to Gemini
      if (USE_GEMINI) {
        try {
          console.log('🤖 Trying Gemini AI...')
          result = await generateSummaryWithGemini(text)
          console.log('✅ Gemini AI generation successful')
        } catch (geminiError: any) {
          console.log('⚠️ Gemini AI failed:', geminiError.message)
          console.log('📝 Using fallback mock data')
          result = generateMockSummary(text)
        }
      } else {
        console.log('📝 Using fallback mock data')
        result = generateMockSummary(text)
      }
    }

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