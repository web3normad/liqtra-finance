import { ChartLine, TrendUp, Warning } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'

const insights = [
  {
    type: 'positive',
    icon: TrendUp,
    title: 'Portfolio performing well',
    description: 'Your average APY is 2.3% above market average',
    color: 'success'
  },
  {
    type: 'neutral',
    icon: ChartLine,
    title: 'Gas fees optimization',
    description: 'Best time to rebalance: Tonight at 2 AM UTC',
    color: 'purple'
  },
  {
    type: 'warning',
    icon: Warning,
    title: 'Concentration risk detected',
    description: '65% of funds in single protocol - consider diversifying',
    color: 'warning'
  }
]

export function AIInsights() {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">AI Insights</h3>
      
      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon
          return (
            <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <div className={`w-8 h-8 bg-${insight.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} weight="bold" className={`text-${insight.color}`} />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm mb-1">{insight.title}</h4>
                <p className="text-xs text-gray-400">{insight.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
