import { NextRequest, NextResponse } from 'next/server'

// Simple PDF text extraction - for now returns placeholder
// In production, you would use a proper PDF parsing library
async function parsePDF(buffer: Buffer) {
  // This is a placeholder implementation
  // For a real implementation, you would use pdf-parse or similar library
  // For now, we'll return a sample text to test the functionality
  
  return {
    text: `Ini adalah contoh teks yang diekstrak dari PDF.
    
Materi Pembelajaran:
1. Sejarah Indonesia dimulai dari zaman prasejarah
2. Proklamasi kemerdekaan dibacakan oleh Soekarno
3. Pancasila adalah dasar negara Indonesia
4. UUD 1945 adalah konstitusi negara
5. Bhinneka Tunggal Ika adalah semboyan persatuan

Silakan ganti dengan teks asli dari PDF Anda untuk pengujian yang lebih akurat.`,
    numpages: 1
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Tidak ada file yang diunggah' },
        { status: 400 }
      )
    }
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Hanya file PDF yang diperbolehkan' },
        { status: 400 }
      )
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Parse PDF
    const pdfData = await parsePDF(buffer)
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tidak dapat mengekstrak teks dari PDF. Pastikan PDF tidak terlindungi.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      text: pdfData.text,
      numPages: pdfData.numpages,
      fileName: file.name
    })
    
  } catch (error) {
    console.error('Error processing PDF:', error)
    return NextResponse.json(
      { error: 'Gagal memproses file PDF' },
      { status: 500 }
    )
  }
}