import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full bg-gray-800/50 border rounded-md py-3 text-sm text-white 
              placeholder-gray-500 transition-all
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-12' : 'pl-4'}
              ${rightIcon ? 'pr-12' : 'pr-4'}
              ${error
                ? 'border-danger focus:ring-danger/50'
                : 'border-gray-700 focus:ring-primary-green/50 focus:border-transparent'
              }
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-danger mt-2">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-xs text-gray-500 mt-2">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
