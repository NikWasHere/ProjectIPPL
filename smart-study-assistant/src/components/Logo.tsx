import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Brain Icon dengan desain modern */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main brain shape */}
          <path
            d="M25 35c-5 0-10 5-10 12s5 12 10 12c0 8 6 15 15 15h20c9 0 15-7 15-15 5 0 10-5 10-12s-5-12-10-12c0-8-6-15-15-15H40c-9 0-15 7-15 15z"
            fill="currentColor"
            className="text-gray-900"
          />
          
          {/* Brain details/patterns */}
          <path
            d="M35 30c3 2 7 2 10 0M35 40c3 2 7 2 10 0M55 30c3 2 7 2 10 0M55 40c3 2 7 2 10 0"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Central connecting line */}
          <line
            x1="50"
            y1="25"
            x2="50"
            y2="65"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
          
          {/* Small dots for neural connections */}
          <circle cx="30" cy="35" r="1.5" fill="white" />
          <circle cx="40" cy="45" r="1.5" fill="white" />
          <circle cx="60" cy="35" r="1.5" fill="white" />
          <circle cx="70" cy="45" r="1.5" fill="white" />
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]} leading-tight`}>
          SmartStudy
        </span>
        <span className="text-xs text-gray-600 font-medium tracking-wide">
          AI ASSISTANT
        </span>
      </div>
    </div>
  )
}