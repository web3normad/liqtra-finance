'use client'

import { Clock } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'

const periods = [
  { value: '1month', label: '1 Month', multiplier: '1x' },
  { value: '3months', label: '3 Months', multiplier: '1.2x' },
  { value: '6months', label: '6 Months', multiplier: '1.5x', popular: true },
  { value: '1year', label: '1 Year', multiplier: '2x' },
]

interface InvestmentPeriodProps {
  selected: string
  onChange: (value: string) => void
}

export function InvestmentPeriod({ selected, onChange }: InvestmentPeriodProps) {
  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-green/20 rounded-lg flex items-center justify-center">
          <Clock size={20} className="text-primary-green" weight="fill" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Investment Period</h3>
          <p className="text-sm text-gray-400">Longer periods earn bonus rewards</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onChange(period.value)}
            className={`
              relative p-4 rounded-md border-2 transition-all
              ${selected === period.value
                ? 'border-primary-green bg-primary-green/10'
                : 'border-gray-800 hover:border-gray-700'
              }
            `}
          >
            {period.popular && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="px-2 py-0.5 bg-primary-green text-white text-xs rounded-full">
                  Popular
                </span>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-white font-bold mb-1">{period.label}</p>
              <p className="text-xs text-gray-400">
                {period.multiplier} rewards
              </p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}

