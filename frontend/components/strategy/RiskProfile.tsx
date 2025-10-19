'use client'

import { useState } from 'react'
import { ShieldCheck, TrendUp, FireSimple } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'

const riskLevels = [
  { value: 1, label: 'Very Low', color: 'bg-success' },
  { value: 2, label: 'Low', color: 'bg-success/80' },
  { value: 3, label: 'Medium', color: 'bg-warning' },
  { value: 4, label: 'High', color: 'bg-danger/80' },
  { value: 5, label: 'Very High', color: 'bg-danger' },
]

interface RiskProfileProps {
  value: number
  onChange: (value: number) => void
}

export function RiskProfile({ value, onChange }: RiskProfileProps) {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Risk Tolerance</h3>
        <p className="text-sm text-gray-400">
          How much risk are you comfortable with?
        </p>
      </div>

      {/* Risk Slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {riskLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange(level.value)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                transition-all
                ${value === level.value 
                  ? `${level.color} ring-4 ring-offset-2 ring-offset-card` 
                  : 'bg-gray-800 hover:bg-gray-700'
                }
              `}
            >
              <span className="text-white text-sm font-bold">{level.value}</span>
            </button>
          ))}
        </div>

        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-success via-warning to-danger transition-all duration-300"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Conservative</span>
          <span>Aggressive</span>
        </div>
      </div>

      {/* Risk Level Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ShieldCheck size={20} className="text-success" weight="fill" />
          </div>
          <p className="text-xs text-gray-400">Protected</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TrendUp size={20} className="text-warning" weight="fill" />
          </div>
          <p className="text-xs text-gray-400">Balanced</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-danger/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <FireSimple size={20} className="text-danger" weight="fill" />
          </div>
          <p className="text-xs text-gray-400">Maximum</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-md">
        <p className="text-sm text-gray-300">
          Current selection: <span className="font-bold text-white">
            {riskLevels[value - 1]?.label}
          </span>
        </p>
      </div>
    </Card>
  )
}