import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { TrendUp, CalendarBlank, Coins } from '@phosphor-icons/react'

export function RewardProjection() {
  const projections = [
    { period: '7 Days', amount: '$23.85', apy: '6.82%' },
    { period: '30 Days', amount: '$102.13', apy: '6.82%' },
    { period: '90 Days', amount: '$306.40', apy: '6.82%' },
    { period: '1 Year', amount: '$1,225.60', apy: '6.82%' }
  ]

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Reward Projection</h3>
          <p className="text-sm text-gray-400">Expected earnings at current APY</p>
        </div>
        <Badge variant="purple" size="sm">
          <span className="flex items-center space-x-1">
            <TrendUp size={12} weight="bold" />
            <span>6.82% APY</span>
          </span>
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        {projections.map((proj, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-md hover:bg-gray-800 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-green/20 rounded-lg flex items-center justify-center">
                <CalendarBlank size={20} weight="fill" className="text-primary-green" />
              </div>
              <div>
                <p className="text-white font-medium">{proj.period}</p>
                <p className="text-xs text-gray-500">Estimated earnings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-success font-bold">{proj.amount}</p>
              <p className="text-xs text-gray-500">{proj.apy} APY</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="p-4 bg-gradient-to-br from-primary-green/10 to-primary-green-light/10 rounded-md border border-primary-green/30">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Coins size={20} weight="fill" className="text-primary-green" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold mb-1">Annual Projection</p>
            <p className="text-2xl font-bold text-primary-green mb-2">$1,225.60</p>
            <p className="text-xs text-gray-400">
              Based on current balance of 5,247.83 USDC at 6.82% APY. 
              Actual earnings may vary with rate changes.
            </p>
          </div>
        </div>
      </div>

      {/* Compound Interest Calculator */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-400">With Auto-Compounding</p>
          <Badge variant="success" size="sm">+12.5% more</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-800/50 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">Without Compound</p>
            <p className="text-white font-bold">$1,225.60</p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg text-center border border-success/30">
            <p className="text-xs text-gray-500 mb-1">With Compound</p>
            <p className="text-success font-bold">$1,378.80</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
