'use client'

import { TrendUp, Wallet, ArrowsLeftRight, ChartLine } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'

export function PortfolioSummary() {
  const stats = [
    {
      label: 'Total Value',
      value: '$24,567.89',
      change: '+12.5%',
      changeType: 'positive',
      icon: Wallet,
      color: 'purple'
    },
    {
      label: 'Total Earned',
      value: '$2,345.67',
      change: '+8.3%',
      changeType: 'positive',
      icon: TrendUp,
      color: 'success'
    },
    {
      label: 'Active Positions',
      value: '8',
      change: '+2',
      changeType: 'neutral',
      icon: ArrowsLeftRight,
      color: 'blue'
    },
    {
      label: 'Average APY',
      value: '9.8%',
      change: '+1.2%',
      changeType: 'positive',
      icon: ChartLine,
      color: 'warning'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Overview</h1>
          <p className="text-gray-400">Track your DeFi investments in real-time</p>
        </div>
        <Badge variant="success" size="lg">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            <span>Live</span>
          </span>
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} variant="default" hoverable>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}/20 rounded-md flex items-center justify-center`}>
                  <Icon size={24} weight="fill" className={`text-${stat.color}`} />
                </div>
                {stat.changeType === 'positive' && (
                  <Badge variant="success" size="sm">{stat.change}</Badge>
                )}
                {stat.changeType === 'neutral' && (
                  <Badge variant="purple" size="sm">{stat.change}</Badge>
                )}
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card variant="glass">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Quick Actions</h3>
            <p className="text-gray-400 text-sm">Manage your portfolio</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-primary-green/20 text-primary-green rounded-lg hover:bg-primary-green/30 transition-colors text-sm font-medium">
              Rebalance
            </button>
            <button className="px-4 py-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors text-sm font-medium">
              Add Funds
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
