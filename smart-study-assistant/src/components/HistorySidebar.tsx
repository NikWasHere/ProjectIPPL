'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { X, FileText, ClipboardList, Calendar, Loader2 } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'

interface HistoryItem {
  id: string
  type: 'quiz' | 'summary'
  title: string
  createdAt: string
  content: any
}

export function HistorySidebar({ isOpen, onClose }: { 
  isOpen: boolean
  onClose: () => void
}) {
  const { data: session } = useSession()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)

  useEffect(() => {
    if (isOpen && session?.user) {
      fetchHistory()
    }
  }, [isOpen, session])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/history')
      if (res.ok) {
        const data = await res.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No history yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your generated quizzes and summaries will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'quiz' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {item.type === 'quiz' ? (
                        <ClipboardList className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{selectedItem.title}</h3>
                <button onClick={() => setSelectedItem(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="prose max-w-none">
                {selectedItem.type === 'quiz' ? (
                  <div className="space-y-4">
                    {selectedItem.content.questions?.map((q: any, i: number) => (
                      <div key={i} className="border-b pb-4">
                        <p className="font-medium">Q{i + 1}: {q.question}</p>
                        {q.options && (
                          <ul className="mt-2 space-y-1">
                            {q.options.map((opt: string, j: number) => (
                              <li key={j} className={opt === q.correctAnswer ? 'text-green-600 font-medium' : ''}>
                                {opt}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{selectedItem.content.content}</div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
