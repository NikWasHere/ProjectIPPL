import { NextRequest, NextResponse } from 'next/server'

// PDF text extraction using pdf-parse library
async function parsePDF(buffer: Buffer) {
  try {
    // Dynamic import to handle ES module
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: buffer })
    const textResult = await parser.getText()
    await parser.destroy()
    
    return {
      text: textResult.text,
      numpages: textResult.total
    }
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('Gagal mengekstrak teks dari PDF')
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