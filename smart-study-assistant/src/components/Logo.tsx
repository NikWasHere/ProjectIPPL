import React from 'react'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 sm:w-12 sm:h-12',
    md: 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28'
  }

  const textSizeClasses = {
    sm: 'text-base sm:text-lg md:text-xl',
    md: 'text-lg sm:text-xl md:text-2xl',
    lg: 'text-xl sm:text-2xl md:text-3xl'
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center flex-shrink-0`}>
        <Image
          src="/LogoAI.png"
          alt="SmartStudy AI Logo"
          width={size === 'sm' ? 96 : size === 'md' ? 160 : 224}
          height={size === 'sm' ? 96 : size === 'md' ? 160 : 224}
          className="w-full h-full object-contain drop-shadow-md"
          style={{
            filter: 'contrast(1.1) brightness(1.05)',
            imageRendering: 'crisp-edges'
          }}
          quality={100}
          priority
          unoptimized={false}
        />
      </div>
      
      <div className="flex flex-col min-w-0">
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]} leading-tight truncate`}>
          SmartStudy
        </span>
        <span className="text-[10px] sm:text-xs text-gray-600 font-medium tracking-wide">
          AI ASSISTANT
        </span>
      </div>
    </div>
  )
}