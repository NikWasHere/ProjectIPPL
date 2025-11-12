import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'API key not configured' 
      })
    }

    console.log('Testing Gemini API with key:', apiKey.substring(0, 10) + '...')

    // First, list available models
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    const listResponse = await fetch(listUrl)
    const modelsList = await listResponse.json()
    
    console.log('Available models:', modelsList)

    // Test dengan model yang tersedia
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say hello in Indonesian'
          }]
        }]
      })
    })

    const data = await response.json()
    
    console.log('Gemini API response:', data)

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        status: response.status,
        error: data
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Gemini API is working!',
      availableModels: modelsList,
      testResponse: data
    })

  } catch (error: any) {
    console.error('Gemini API test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}
