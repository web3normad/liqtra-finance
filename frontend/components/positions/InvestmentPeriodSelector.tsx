'use client'

import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Clock, Lightning } from '@phosphor-icons/react'

const periods = [
  { 
    value: '1m', 
    label: '1 Month', 
    multiplier: 1.0, 
    bonus: '0%',
    earnings: '$102.13'
  },
  { 
    value: '3m', 
    label: '3 Months', 
    multiplier: 1.1, 
    bonus: '+10%',
    earnings: '$336.70',
    popular: true
  },
  { 
    value: '6m', 
    label: '6 Months', 
    multiplier: 1.25, 
    bonus: '+25%',
    earnings: '$765.00'
  },
  { 
    value: '1y', 
    label: '1 Year', 
    multiplier: 1.5, 
    bonus: '+50%',
    earnings: '$1,838.40'
  }
]

interface InvestmentPeriodSelectorProps {
  onSelect?: (period: string) => void
}

export function InvestmentPeriodSelector({ onSelect }: InvestmentPeriodSelectorProps) {
  const [selected, setSelected] = useState('3m')

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect?.(value)
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-green/20 rounded-lg flex items-center justify-center">
          <Clock size={20} weight="fill" className="text-primary-green" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Lock Period Bonus</h3>
          <p className="text-sm text-gray-400">Earn more by locking your position</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => handleSelect(period.value)}
            className={`
              relative p-4 rounded-md border-2 transition-all text-left
              ${selected === period.value
                ? 'border-primary-green bg-primary-green/10'
                : 'border-gray-800 hover:border-gray-700'
              }
            `}
          >
            {period.popular && (
              <div className="absolute -top-2 right-2">
                <Badge variant="purple" size="sm">
                  <Lightning size={10} weight="fill" />
                  <span className="ml-1">Popular</span>
                </Badge>
              </div>
            )}
            
            <div className="mb-3">
              <p className="text-white font-bold mb-1">{period.label}</p>
              <p className="text-xs text-gray-400">Lock period</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Bonus APY</span>
                <Badge 
                  variant={period.multiplier > 1 ? 'success' : 'default'} 
                  size="sm"
                >
                  {period.bonus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Est. Earnings</span>
                <span className="text-success font-bold text-sm">{period.earnings}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-800/50 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Selected Period</span>
          <Badge variant="purple" size="sm">
            {periods.find(p => p.value === selected)?.label}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Total Bonus</span>
          <span className="text-success font-bold">
            {periods.find(p => p.value === selected)?.bonus}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-primary-green/10 rounded-lg border border-primary-green/30">
        <p className="text-xs text-gray-400">
          💡 <span className="text-white font-medium">Tip:</span> Longer lock periods earn bonus rewards. 
          You can still withdraw early with a small penalty.
        </p>
      </div>
    </Card>
  )
}
