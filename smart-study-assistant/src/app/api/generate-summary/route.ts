import { NextRequest, NextResponse } from 'next/server'

// Mock AI service untuk generate ringkasan
// Dalam implementasi nyata, ini akan menggunakan OpenAI API atau AI service lainnya
function generateSummary(text: string): { summary: string; keyPoints: string[] } {
  // Analisis teks dan buat ringkasan
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
    const { text } = await request.json()
    
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
    
    // Generate summary using AI (mocked for now)
    const result = generateSummary(text)
    
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