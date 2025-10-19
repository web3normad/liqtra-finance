import { Lightbulb, TrendUp, ShieldCheck } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'

const recommendations = [
  {
    id: '1',
    title: 'Move to Higher Yield',
    description: 'Transfer $5,000 USDC from Compound (4.2%) to Aave Arbitrum (6.8%)',
    impact: '+$130/year',
    risk: 'Low',
    icon: TrendUp,
    color: 'success'
  },
  {
    id: '2',
    title: 'Diversify Protocol Risk',
    description: 'Split your position across 3 protocols instead of 1',
    impact: 'Safer portfolio',
    risk: 'None',
    icon: ShieldCheck,
    color: 'purple'
  }
]

export function AIRecommendations() {
  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-green/20 rounded-lg flex items-center justify-center">
          <Lightbulb size={20} weight="fill" className="text-primary-green" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
          <p className="text-sm text-gray-400">Optimized for your portfolio</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon
          return (
            <div key={rec.id} className="p-4 bg-gray-800/50 rounded-md">
              <div className="flex items-start space-x-3 mb-3">
                <div className={`w-10 h-10 bg-${rec.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} weight="fill" className={`text-${rec.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-semibold">{rec.title}</h4>
                    <Badge variant={rec.color as any} size="sm">{rec.risk} Risk</Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{rec.description}</p>
                  <p className="text-success text-sm font-medium">{rec.impact}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" fullWidth>
                Apply Recommendation
              </Button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
