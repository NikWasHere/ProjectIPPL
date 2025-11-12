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
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAuthClick?.('login')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
        >
          <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Masuk</span>
        </Button>
        <Button
          size="sm"
          onClick={() => onAuthClick?.('signup')}
          className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm px-2 sm:px-3"
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
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0">
          {(session.user?.name || session.user?.email || 'U')[0].toUpperCase()}
        </div>
        <span className="text-xs sm:text-sm font-medium text-gray-900 hidden md:block max-w-[120px] truncate">
          {session.user?.name || session.user?.email}
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform flex-shrink-0 ${showMenu ? 'rotate-180' : ''}`} />
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate">{session.user?.email}</p>
          </div>
          
          <button
            onClick={() => {
              onHistoryClick?.()
              setShowMenu(false)
            }}
            className="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 sm:gap-3 transition-colors"
          >
            <History className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-700">View History</span>
          </button>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => signOut()}
              className="w-full px-3 sm:px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 sm:gap-3 text-red-600 transition-colors"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
