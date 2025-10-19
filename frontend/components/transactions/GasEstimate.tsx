'use client'

import { useState, useEffect } from 'react'
import { GasPump, Lightning, Clock } from '@phosphor-icons/react'
import { Badge } from '@/components/common/Badge'

type GasSpeed = 'slow' | 'standard' | 'fast'

interface GasOption {
  speed: GasSpeed
  icon: any
  time: string
  gwei: string
  usd: string
  label: string
}

const gasOptions: GasOption[] = [
  {
    speed: 'slow',
    icon: Clock,
    time: '~5 min',
    gwei: '15',
    usd: '2.50',
    label: 'Slow'
  },
  {
    speed: 'standard',
    icon: GasPump,
    time: '~2 min',
    gwei: '25',
    usd: '4.20',
    label: 'Standard'
  },
  {
    speed: 'fast',
    icon: Lightning,
    time: '~30 sec',
    gwei: '35',
    usd: '5.80',
    label: 'Fast'
  }
]

export function GasEstimate() {
  const [selectedSpeed, setSelectedSpeed] = useState<GasSpeed>('standard')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching gas prices
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-md">
        <div className="flex items-center space-x-2 text-gray-400">
          <GasPump size={16} className="animate-pulse" />
          <span className="text-sm">Estimating gas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-semibold text-sm">Gas Fee</h4>
        <Badge variant="purple" size="sm">Network: Ethereum</Badge>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {gasOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedSpeed === option.speed
          
          return (
            <button
              key={option.speed}
              onClick={() => setSelectedSpeed(option.speed)}
              className={`
                p-3 rounded-md border-2 transition-all text-center
                ${isSelected
                  ? 'border-primary-green bg-primary-green/10'
                  : 'border-gray-800 hover:border-gray-700'
                }
              `}
            >
              <Icon 
                size={20} 
                weight="fill"
                className={`mx-auto mb-2 ${isSelected ? 'text-primary-green' : 'text-gray-400'}`}
              />
              <p className="text-xs text-gray-400 mb-1">{option.label}</p>
              <p className="text-sm font-bold text-white">{option.gwei} Gwei</p>
              <p className="text-xs text-gray-500">${option.usd}</p>
              <p className="text-xs text-gray-600 mt-1">{option.time}</p>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
        <span className="text-sm text-gray-400">Estimated Gas Fee</span>
        <span className="text-white font-semibold">
          ${gasOptions.find(opt => opt.speed === selectedSpeed)?.usd}
        </span>
      </div>
    </div>
  )
}
