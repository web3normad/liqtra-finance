'use client'

import { useState } from 'react'
import { Shield, TrendUp, Lightning, Check } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'

const strategies = [
  {
    id: 'conservative',
    name: 'Conservative',
    icon: Shield,
    description: 'Low risk, stable returns with blue-chip protocols',
    expectedAPY: '3-6%',
    riskLevel: 'Low',
    color: 'success',
    features: ['Aave & Compound only', 'Stablecoin focus', 'Auto-rebalancing']
  },
  {
    id: 'balanced',
    name: 'Balanced',
    icon: TrendUp,
    description: 'Medium risk, balanced approach across multiple protocols',
    expectedAPY: '6-12%',
    riskLevel: 'Medium',
    color: 'purple',
    features: ['Multiple protocols', 'Mixed assets', 'Smart routing']
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    icon: Lightning,
    description: 'Higher risk, maximum yields from emerging opportunities',
    expectedAPY: '12-25%',
    riskLevel: 'High',
    color: 'warning',
    features: ['New protocols', 'Liquid staking', 'Yield farming']
  }
]

interface StrategySelectorProps {
  selected?: string
  onSelect: (strategyId: string) => void
}

export function StrategySelector({ selected, onSelect }: StrategySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Choose Your Strategy</h2>
        <p className="text-gray-400 text-sm">
          Select an investment strategy that matches your risk tolerance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategies.map((strategy) => {
          const isSelected = selected === strategy.id
          const Icon = strategy.icon
          
          return (
            <button
              key={strategy.id}
              onClick={() => onSelect(strategy.id)}
              className="text-left"
            >
              <Card
                className={`
                  relative transition-all
                  ${isSelected 
                    ? 'ring-2 ring-primary-green shadow-lg shadow-primary-green/20' 
                    : 'hover:border-gray-700'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary-green rounded-full flex items-center justify-center">
                      <Check size={16} weight="bold" className="text-white" />
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-md bg-${strategy.color}/20 flex items-center justify-center`}>
                    <Icon size={24} weight="fill" className={`text-${strategy.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{strategy.name}</h3>
                    <p className="text-xs text-gray-400">{strategy.riskLevel} Risk</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  {strategy.description}
                </p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                  <span className="text-xs text-gray-500">Expected APY</span>
                  <span className="text-lg font-bold text-primary-green">
                    {strategy.expectedAPY}
                  </span>
                </div>

                <div className="space-y-2">
                  {strategy.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Check size={14} className="text-success" weight="bold" />
                      <span className="text-xs text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
