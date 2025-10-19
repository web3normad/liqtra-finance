import { ButtonHTMLAttributes, ReactNode } from 'react'
import { SpinnerGap } from '@phosphor-icons/react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-green to-primary-green-light text-white hover:opacity-90 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700',
    outline: 'bg-transparent border-2 border-primary-green text-primary-green hover:bg-primary-green/10',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50',
    danger: 'bg-danger text-white hover:bg-danger/90',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm space-x-1.5',
    md: 'px-4 py-2.5 text-sm space-x-2',
    lg: 'px-6 py-3 text-base space-x-2.5',
  }
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <SpinnerGap size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
