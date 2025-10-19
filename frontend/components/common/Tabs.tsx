'use client'

import { ReactNode, useState } from 'react'

interface Tab {
  label: string
  value: string
  icon?: ReactNode
  badge?: number
}

interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  onChange?: (value: string) => void
  children: (activeTab: string) => ReactNode
}

export function Tabs({ tabs, defaultValue, onChange, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onChange?.(value)
  }

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex items-center space-x-2 border-b border-gray-800 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value
          
          return (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`
                flex items-center space-x-2 px-4 py-3 font-medium text-sm
                border-b-2 transition-all relative
                ${isActive
                  ? 'border-primary-green text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-2 py-0.5 text-xs bg-primary-green/20 text-primary-green rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>{children(activeTab)}</div>
    </div>
  )
}
