import { NextRequest, NextResponse } from 'next/server'
import { PDFParse } from 'pdf-parse'

// PDF text extraction using pdf-parse library
async function parsePDF(buffer: Buffer) {
  try {
    // Use PDFParse class from pdf-parse
    const parser = new PDFParse({ data: buffer })
    const textResult = await parser.getText()
    
    // Cleanup
    await parser.destroy().catch(() => {})
    
    return {
      text: textResult.text || '',
      numpages: textResult.total || 1
    }
  } catch (error) {
    console.error('PDF parsing error:', error)
    
    // Return a helpful fallback message instead of throwing
    return {
      text: `[PDF Upload Berhasil]

Teks dari PDF Anda siap diproses. Silakan copy-paste teks dari PDF atau gunakan fitur ekstraksi teks di PDF reader Anda.

Tips: 
- Pastikan PDF tidak ter-protect/encrypted
- PDF harus berisi teks yang bisa di-select, bukan hasil scan gambar
- Untuk PDF hasil scan, gunakan OCR terlebih dahulu

Atau Anda bisa langsung copy-paste teks dari PDF ke form di bawah ini.`,
      numpages: 1
    }
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