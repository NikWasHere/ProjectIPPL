'use client'

import React, { useState } from 'react'
import { Logo } from '@/components/Logo'
import { FileUpload } from '@/components/FileUpload'
import { UserMenu } from '@/components/UserMenu'
import { HistorySidebar } from '@/components/HistorySidebar'
import { AuthModal } from '@/components/AuthModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader } from '@/components/ui/loader'
import { 
  BookOpen, 
  FileQuestion, 
  ClipboardList, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Brain,
  Target,
  History
} from 'lucide-react'

interface QuizQuestion {
  question: string
  options?: string[]
  correctAnswer: string
  type: 'multiple_choice' | 'essay'
}

interface Summary {
  summary: string
  keyPoints: string[]
  compressionRatio: number
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [selectedMode, setSelectedMode] = useState<'quiz' | 'summary' | null>(null)
  const [quizType, setQuizType] = useState<'multiple_choice' | 'essay'>('multiple_choice')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<QuizQuestion[] | Summary | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [showHistory, setShowHistory] = useState(false)

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name)
    setError('')
  }

  const handleTextExtracted = (text: string, fileName: string) => {
    setInputText(text)
    setError('')
  }

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Silakan masukkan teks atau upload file PDF terlebih dahulu')
      return
    }

    if (!selectedMode) {
      setError('Pilih mode yang diinginkan (Kuis atau Ringkasan)')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      if (selectedMode === 'quiz') {
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: inputText, 
            type: quizType,
            count: 5 
          })
        })

        if (!response.ok) {
          throw new Error('Gagal membuat kuis')
        }

        const data = await response.json()
        setResult(data.questions)
      } else {
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText })
        })

        if (!response.ok) {
          throw new Error('Gagal membuat ringkasan')
        }

        const data = await response.json()
        setResult(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Terjadi kesalahan saat memproses request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return

    let textToCopy = ''

    if (Array.isArray(result)) {
      // Quiz format
      textToCopy = result.map((q, index) => {
        if (q.type === 'multiple_choice') {
          return `${index + 1}. ${q.question}\n${q.options?.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}\n\nJawaban: ${q.correctAnswer}\n`
        } else {
          return `${index + 1}. ${q.question}\n\nPanduan Jawaban: ${q.correctAnswer}\n`
        }
      }).join('\n---\n\n')
    } else {
      // Summary format
      textToCopy = `RINGKASAN:\n\n${result.summary}\n\nPOIN UTAMA:\n${result.keyPoints.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n')}`
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const reset = () => {
    setInputText('')
    setSelectedMode(null)
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Logo size="md" />
            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
              <div className="hidden sm:flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">AI Powered</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <History className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Riwayat</span>
              </Button>
              <UserMenu 
                onHistoryClick={() => setShowHistory(true)}
                onAuthClick={(mode) => {
                  setAuthMode(mode)
                  setShowAuthModal(true)
                }} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitch={setAuthMode}
      />

      {/* History Sidebar */}
      <HistorySidebar
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gray-900 rounded-xl sm:rounded-2xl">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent px-4">
            Asisten Belajar Cerdas
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 px-4">
            Ubah materi pembelajaran Anda menjadi kuis interaktif atau ringkasan yang mudah dipahami 
            dengan bantuan kecerdasan buatan
          </p>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <FileQuestion className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-gray-900">Kuis Otomatis</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-gray-900">Ringkasan Cerdas</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-gray-900">Pembelajaran Efektif</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-xl p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Input Materi</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Upload file PDF atau masukkan teks materi pembelajaran Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* File Upload */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Upload File PDF</h3>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onTextExtracted={handleTextExtracted}
                />
              </div>

              {/* Text Input */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Atau Masukkan Teks Manual</h3>
                <Textarea
                  placeholder="Tempel atau ketik materi pembelajaran di sini..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[150px] sm:min-h-[200px] resize-none text-sm"
                />
              </div>

              {/* Mode Selection */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Pilih Mode</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant={selectedMode === 'quiz' ? 'default' : 'outline'}
                    className="h-auto p-3 sm:p-4 justify-start"
                    onClick={() => setSelectedMode('quiz')}
                  >
                    <div className="text-left">
                      <FileQuestion className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                      <div className="font-medium text-xs sm:text-sm">Buat Kuis</div>
                      <div className="text-[10px] sm:text-xs opacity-80">Pilihan ganda atau esai</div>
                    </div>
                  </Button>
                  <Button
                    variant={selectedMode === 'summary' ? 'default' : 'outline'}
                    className="h-auto p-3 sm:p-4 justify-start"
                    onClick={() => setSelectedMode('summary')}
                  >
                    <div className="text-left">
                      <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                      <div className="font-medium text-xs sm:text-sm">Buat Ringkasan</div>
                      <div className="text-[10px] sm:text-xs opacity-80">Poin-poin penting</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Quiz Type Selection */}
              {selectedMode === 'quiz' && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Tipe Kuis</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Button
                      variant={quizType === 'multiple_choice' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setQuizType('multiple_choice')}
                      className="text-xs sm:text-sm"
                    >
                      Pilihan Ganda
                    </Button>
                    <Button
                      variant={quizType === 'essay' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setQuizType('essay')}
                      className="text-xs sm:text-sm"
                    >
                      Esai
                    </Button>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !inputText.trim() || !selectedMode}
                  className="flex-1 text-xs sm:text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader size="sm" className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Memproses...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Generate {selectedMode === 'quiz' ? 'Kuis' : 'Ringkasan'}</span>
                      <span className="sm:hidden">Generate</span>
                    </>
                  )}
                </Button>
                {result && (
                  <Button variant="outline" onClick={reset} className="text-xs sm:text-sm px-3 sm:px-4">
                    Reset
                  </Button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs sm:text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-xl p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {selectedMode === 'quiz' ? (
                    <FileQuestion className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  ) : (
                    <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  )}
                  <span className="text-base sm:text-lg truncate">Hasil {selectedMode === 'quiz' ? 'Kuis' : 'Ringkasan'}</span>
                </div>
                {result && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs sm:text-sm flex-shrink-0"
                  >
                    {copied ? (
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin'}</span>
                  </Button>
                )}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {!result 
                  ? 'Hasil akan muncul di sini setelah diproses'
                  : selectedMode === 'quiz' 
                    ? `${Array.isArray(result) ? result.length : 0} pertanyaan ${quizType === 'multiple_choice' ? 'pilihan ganda' : 'esai'}`
                    : 'Ringkasan materi pembelajaran'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {!result ? (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    {selectedMode === 'quiz' ? (
                      <FileQuestion className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    ) : (
                      <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm px-4">Masukkan materi dan pilih mode untuk memulai</p>
                </div>
              ) : Array.isArray(result) ? (
                // Quiz Results
                <div className="space-y-3 sm:space-y-4 md:space-y-6 max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto">
                  {result.map((question, index) => (
                    <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                        {index + 1}. {question.question}
                      </div>
                      
                      {question.type === 'multiple_choice' && question.options ? (
                        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className={`p-2 rounded border text-xs sm:text-sm ${
                                option === question.correctAnswer
                                  ? 'bg-green-100 border-green-300 text-green-800 font-medium'
                                  : 'bg-white border-gray-200 text-gray-700'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {option === question.correctAnswer && (
                                <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs">(Jawaban Benar)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded text-xs sm:text-sm text-blue-800">
                          <strong>Panduan Jawaban:</strong> {question.correctAnswer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // Summary Results
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Ringkasan</h3>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 leading-relaxed text-xs sm:text-sm">
                      {result.summary}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Poin Utama</h3>
                    <ul className="space-y-2">
                      {result.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gray-900 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-xs sm:text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {result.compressionRatio && (
                    <div className="text-[10px] sm:text-xs text-gray-500 text-center pt-3 sm:pt-4 border-t border-gray-200">
                      Tingkat kompresi: {result.compressionRatio}%
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8 sm:mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-xs sm:text-sm px-4">
              © 2025 SmartStudy AI Crafted with ❤️ by Niko Afandi (11221039) Informatika · Institut Teknologi Kalimantan
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}