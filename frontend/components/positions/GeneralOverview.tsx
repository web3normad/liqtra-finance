import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'

export function GeneralOverview() {
  const details = [
    { label: 'Protocol', value: 'Aave V3', badge: 'Verified' },
    { label: 'Asset', value: 'USDC', badge: 'Stablecoin' },
    { label: 'Chain', value: 'Ethereum', badge: 'Mainnet' },
    { label: 'Position Type', value: 'Supply', badge: 'Low Risk' },
    { label: 'Health Factor', value: 'N/A', badge: 'Not Borrowing' },
    { label: 'Liquidation Risk', value: 'None', badge: 'Safe' }
  ]

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">General Overview</h3>
      
      <div className="space-y-3">
        {details.map((detail, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <span className="text-sm text-gray-400">{detail.label}</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{detail.value}</span>
              <Badge variant="purple" size="sm">{detail.badge}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
