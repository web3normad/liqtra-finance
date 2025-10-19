import { Card } from '@/components/common/Card'
import { ShieldCheck, Warning } from '@phosphor-icons/react'
import { Badge } from '@/components/common/Badge'

export function RiskAssessment() {
  const riskScore = 2.3 // out of 10

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Risk Assessment</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Risk Score</span>
          <Badge variant="success" size="sm">Low Risk</Badge>
        </div>
        
        <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-success via-warning to-danger rounded-full transition-all"
            style={{ width: `${(riskScore / 10) * 100}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <span>Safe</span>
          <span>{riskScore}/10</span>
          <span>High Risk</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg border border-success/30">
          <ShieldCheck size={20} className="text-success flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="text-white font-medium text-sm mb-1">Protocol Security</p>
            <p className="text-xs text-gray-400">Aave is audited and battle-tested with $12B+ TVL</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Smart Contract Risk</p>
            <p className="text-success font-bold text-sm">Very Low</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Liquidity Risk</p>
            <p className="text-success font-bold text-sm">Very Low</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Market Risk</p>
            <p className="text-success font-bold text-sm">Low</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Impermanent Loss</p>
            <p className="text-success font-bold text-sm">None</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
          <Warning size={20} className="text-warning flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="text-white font-medium text-sm mb-1">Concentration Risk</p>
            <p className="text-xs text-gray-400">
              This position represents 21% of your portfolio. Consider diversifying.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}