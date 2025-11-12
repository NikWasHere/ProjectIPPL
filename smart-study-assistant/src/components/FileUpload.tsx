import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validatePDFFile } from '@/lib/helpers'
import { FILE_UPLOAD, MESSAGES } from '@/lib/constants'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onTextExtracted: (text: string, fileName: string) => void
  className?: string
  accept?: string
  maxSize?: number // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onTextExtracted,
  className,
  accept = '.pdf',
  maxSize = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const file = files[0]
    setError('')
    
    // Validate file using helper function
    const validation = validatePDFFile(file)
    if (!validation.isValid) {
      setError(validation.error || MESSAGES.errors.fileType)
      return
    }
    
    setSelectedFile(file)
    onFileSelect(file)
    
    // Extract text from PDF
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Gagal mengekstrak teks dari PDF')
      }
      
      const data = await response.json()
      onTextExtracted(data.text, file.name)
    } catch (error) {
      console.error('Error extracting text:', error)
      setError(MESSAGES.errors.pdfExtractFailed)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />
      
      {!selectedFile ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-colors',
            dragActive
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 mb-2 sm:mb-3 md:mb-4" />
          <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
            Upload File PDF
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-2">
            Seret dan lepas file PDF di sini, atau klik untuk memilih file
          </p>
          <Button variant="outline" type="button" size="sm" className="text-xs sm:text-sm">
            Pilih File PDF
          </Button>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
            Maksimal {FILE_UPLOAD.maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {isProcessing && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-gray-300 border-t-gray-900"></div>
                  <span className="hidden sm:inline">Memproses...</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={isProcessing}
                className="p-1 sm:p-2"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="mt-2 text-xs sm:text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      )}
      
      {error && !selectedFile && (
        <div className="mt-2 text-xs sm:text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  )
}