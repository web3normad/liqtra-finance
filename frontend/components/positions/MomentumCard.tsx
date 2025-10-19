import { Card } from '@/components/common/Card'
import { TrendDown } from '@phosphor-icons/react'
import { Badge } from '@/components/common/Badge'

export function MomentumCard() {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Momentum</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-md">
          <div>
            <p className="text-sm text-gray-400 mb-1">Growth Dynamics</p>
            <div className="flex items-center space-x-2">
              <p className="text-3xl font-bold text-danger">-0.82%</p>
              <Badge variant="danger" size="sm">24h</Badge>
            </div>
          </div>
          <TrendDown size={32} className="text-danger" weight="bold" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">7 Day Trend</p>
            <p className="text-success font-bold">+2.34%</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">30 Day Trend</p>
            <p className="text-success font-bold">+8.12%</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
