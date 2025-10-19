import { TrendUp, Shield, Lightning } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'

interface StrategyCardProps {
  name: string
  type: 'conservative' | 'balanced' | 'aggressive'
  apy: string
  tvl: string
  protocols: string[]
  isActive?: boolean
  onClick?: () => void
}

export function StrategyCard({
  name,
  type,
  apy,
  tvl,
  protocols,
  isActive = false,
  onClick
}: StrategyCardProps) {
  const icons = {
    conservative: Shield,
    balanced: TrendUp,
    aggressive: Lightning
  }

  const colors = {
    conservative: 'success',
    balanced: 'purple',
    aggressive: 'warning'
  }

  const Icon = icons[type]
  const color = colors[type]

  return (
    <Card 
      hoverable 
      onClick={onClick}
      className={isActive ? 'ring-2 ring-primary-green' : ''}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-${color}/20 rounded-md flex items-center justify-center`}>
            <Icon size={24} weight="fill" className={`text-${color}`} />
          </div>
          <div>
            <h3 className="text-white font-bold">{name}</h3>
            <Badge variant={color as any} size="sm">{type}</Badge>
          </div>
        </div>
        {isActive && (
          <Badge variant="success" size="sm">Active</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">APY</p>
          <p className="text-xl font-bold text-primary-green">{apy}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">TVL</p>
          <p className="text-xl font-bold text-white">{tvl}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Protocols</p>
        <div className="flex flex-wrap gap-2">
          {protocols.map((protocol) => (
            <span 
              key={protocol}
              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg"
            >
              {protocol}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}
