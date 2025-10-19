'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'

interface DropdownOption {
  label: string
  value: string
  icon?: ReactNode
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-md text-white hover:bg-gray-700 transition-colors"
      >
        <span className="flex items-center space-x-2">
          {selectedOption?.icon}
          <span className="text-sm">
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <CaretDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-gray-800 rounded-md shadow-xl z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`
                w-full flex items-center justify-between px-4 py-2.5 text-sm
                transition-colors
                ${option.value === value
                  ? 'bg-primary-green/20 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
                }
              `}
            >
              <span className="flex items-center space-x-2">
                {option.icon}
                <span>{option.label}</span>
              </span>
              {option.value === value && (
                <Check size={16} className="text-primary-green" weight="bold" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
