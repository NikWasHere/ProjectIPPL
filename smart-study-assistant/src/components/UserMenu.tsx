'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { User, LogOut, History, ChevronDown, LogIn } from 'lucide-react'
import { Button } from './ui/button'

export function UserMenu({ 
  onHistoryClick, 
  onAuthClick 
}: { 
  onHistoryClick?: () => void
  onAuthClick?: (mode: 'login' | 'signup') => void
}) {
  const { data: session } = useSession()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAuthClick?.('login')}
          className="flex items-center space-x-2"
        >
          <LogIn className="h-4 w-4" />
          <span>Masuk</span>
        </Button>
        <Button
          size="sm"
          onClick={() => onAuthClick?.('signup')}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          Daftar
        </Button>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
          {(session.user?.name || session.user?.email || 'U')[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-900 hidden sm:block">
          {session.user?.name || session.user?.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
          </div>
          
          <button
            onClick={() => {
              onHistoryClick?.()
              setShowMenu(false)
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <History className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">View History</span>
          </button>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
