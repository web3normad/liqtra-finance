import { TrendUp, Coin, ChartLine, Calendar } from '@phosphor-icons/react'

export function PositionMetrics() {
  const metrics = [
    {
      label: 'Current Balance',
      value: '5,247.83',
      unit: 'USDC',
      icon: Coin,
      color: 'purple'
    },
    {
      label: 'Current APY',
      value: '6.82%',
      change: '+0.15%',
      icon: TrendUp,
      color: 'success'
    },
    {
      label: 'Total Earned',
      value: '$247.83',
      change: '+$12.50',
      icon: ChartLine,
      color: 'blue'
    },
    {
      label: 'Position Age',
      value: '47 days',
      icon: Calendar,
      color: 'warning'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <div key={idx} className="p-4 bg-gray-800/50 rounded-md">
            <div className="flex items-center space-x-2 mb-3">
              <div className={`w-8 h-8 bg-${metric.color}/20 rounded-lg flex items-center justify-center`}>
                <Icon size={16} weight="fill" className={`text-${metric.color}`} />
              </div>
              <p className="text-xs text-gray-400">{metric.label}</p>
            </div>
            <p className="text-xl font-bold text-white mb-1">
              {metric.value} {metric.unit}
            </p>
            {metric.change && (
              <p className="text-xs text-success">{metric.change} today</p>
            )}
          </div>
        )
      })}
    </div>
  )
}