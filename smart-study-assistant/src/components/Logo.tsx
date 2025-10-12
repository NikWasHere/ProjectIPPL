import React from 'react'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  }

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
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