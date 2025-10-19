'use client'

import { Bell, X } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { useState } from 'react'

interface Alert {
  id: string
  type: 'opportunity' | 'warning' | 'info'
  title: string
  message: string
  time: string
  variant: 'success' | 'warning' | 'purple'
}

const initialAlerts: Alert[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'New High Yield Detected',
    message: 'Aave V3 on Base now offering 8.2% APY on USDC',
    time: '5 min ago',
    variant: 'success'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Protocol Risk Alert',
    message: 'Unusual activity detected in one of your positions',
    time: '1 hour ago',
    variant: 'warning'
  }
]

export function AIAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-green/20 rounded-lg flex items-center justify-center">
            <Bell size={20} weight="fill" className="text-primary-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Alerts</h3>
            <p className="text-xs text-gray-400">{alerts.length} active alerts</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 bg-gray-800/50 rounded-md border border-gray-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-semibold text-sm">{alert.title}</h4>
                    <Badge variant={alert.variant} size="sm">{alert.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}