import { SpinnerGap } from '@phosphor-icons/react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

export function LoadingSpinner({
  size = 'md',
  className = '',
  text,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 20,
    md: 32,
    lg: 48,
    xl: 64,
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <SpinnerGap
        size={sizes[size]}
        className="text-primary-green animate-spin"
        weight="bold"
      />
      {text && (
        <p className="text-gray-400 text-sm mt-3">{text}</p>
      )}
    </div>
  )
}
