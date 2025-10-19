'use client'

import { useState } from 'react'
import { Lightning, ArrowsClockwise, Shield, Bell } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'

interface AutomationSettingsProps {
  settings: {
    autoRebalance: boolean
    autoCompound: boolean
    riskProtection: boolean
    alertsEnabled: boolean
  }
  onChange: (settings: any) => void
}

export function AutomationSettings({ settings, onChange }: AutomationSettingsProps) {
  const toggleSetting = (key: keyof typeof settings) => {
    onChange({ ...settings, [key]: !settings[key] })
  }

  const features = [
    {
      key: 'autoRebalance' as const,
      icon: ArrowsClockwise,
      title: 'Auto Rebalance',
      description: 'Automatically rebalance portfolio for optimal yields',
      badge: 'Recommended'
    },
    {
      key: 'autoCompound' as const,
      icon: Lightning,
      title: 'Auto Compound',
      description: 'Reinvest earnings automatically for compound growth',
      badge: 'Popular'
    },
    {
      key: 'riskProtection' as const,
      icon: Shield,
      title: 'Risk Protection',
      description: 'Withdraw funds if protocol risks are detected',
      badge: 'Pro'
    },
    {
      key: 'alertsEnabled' as const,
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Get notified about important portfolio events',
    }
  ]

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Automation Settings</h3>
        <p className="text-sm text-gray-400">
          Let AI manage your portfolio 24/7
        </p>
      </div>

      <div className="space-y-4">
        {features.map((feature) => {
          const Icon = feature.icon
          const isEnabled = settings[feature.key]
          
          return (
            <button
              key={feature.key}
              onClick={() => toggleSetting(feature.key)}
              className={`
                w-full flex items-start space-x-4 p-4 rounded-md border-2
                transition-all text-left
                ${isEnabled
                  ? 'border-primary-green bg-primary-green/10'
                  : 'border-gray-800 hover:border-gray-700'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0
                ${isEnabled ? 'bg-primary-green/20' : 'bg-gray-800'}
              `}>
                <Icon 
                  size={24} 
                  weight="fill"
                  className={isEnabled ? 'text-primary-green' : 'text-gray-400'}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-white font-semibold">{feature.title}</h4>
                  {feature.badge && (
                    <Badge variant="purple" size="sm">{feature.badge}</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>

              <div className={`
                w-12 h-6 rounded-full relative transition-colors flex-shrink-0
                ${isEnabled ? 'bg-primary-green' : 'bg-gray-700'}
              `}>
                <div className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                  ${isEnabled ? 'right-1' : 'left-1'}
                `} />
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
