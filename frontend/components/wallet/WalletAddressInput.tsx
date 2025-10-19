'use client'

import { useState } from 'react'
import { isAddress } from 'viem'
import { MagnifyingGlass, CheckCircle, WarningCircle } from '@phosphor-icons/react'

interface WalletAddressInputProps {
  onAddressChange?: (address: string, isValid: boolean) => void
  placeholder?: string
}

export function WalletAddressInput({ 
  onAddressChange,
  placeholder = "Enter wallet address (0x...)"
}: WalletAddressInputProps) {
  const [address, setAddress] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const handleChange = (value: string) => {
    setAddress(value)
    
    if (value.length === 0) {
      setIsValid(null)
      onAddressChange?.(value, false)
      return
    }

    const valid = isAddress(value)
    setIsValid(valid)
    onAddressChange?.(value, valid)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlass 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          value={address}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full bg-gray-800/50 border rounded-md pl-12 pr-12 py-3 
            text-sm text-white placeholder-gray-500 
            focus:outline-none focus:ring-2 transition-all
            ${isValid === true ? 'border-success focus:ring-success/50' : ''}
            ${isValid === false ? 'border-danger focus:ring-danger/50' : 'border-gray-700 focus:ring-primary-green/50'}
          `}
        />
        
        {isValid !== null && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle size={20} className="text-success" weight="fill" />
            ) : (
              <WarningCircle size={20} className="text-danger" weight="fill" />
            )}
          </div>
        )}
      </div>

      {isValid === false && address.length > 0 && (
        <p className="text-xs text-danger mt-2 ml-1">
          Please enter a valid Ethereum address
        </p>
      )}
    </div>
  )
}
