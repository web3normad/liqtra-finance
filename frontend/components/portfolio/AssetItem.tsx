'use client'

import { ArrowRight, TrendUp } from '@phosphor-icons/react'
import { Badge } from '@/components/common/Badge'

interface Asset {
  id: string
  name: string
  symbol: string
  protocol: string
  balance: string
  value: string
  apy: string
  change24h: string
  logo: string
}

interface AssetItemProps {
  asset: Asset
  onClick?: () => void
}

export function AssetItem({ asset, onClick }: AssetItemProps) {
  const isPositive = asset.change24h.startsWith('+')

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-gray-800/50 hover:bg-gray-800 rounded-md transition-all group"
    >
      <div className="flex items-center justify-between">
        {/* Left: Asset Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center text-2xl">
            {asset.logo}
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-white font-semibold">{asset.symbol}</h4>
              <Badge variant="purple" size="sm">{asset.protocol}</Badge>
            </div>
            <p className="text-sm text-gray-400">{asset.name}</p>
          </div>
        </div>

        {/* Center: Balance & Value */}
        <div className="text-center hidden md:block">
          <p className="text-white font-semibold mb-1">
            {asset.balance} {asset.symbol}
          </p>
          <p className="text-sm text-gray-400">{asset.value}</p>
        </div>

        {/* Right: Performance */}
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1 justify-end">
            <Badge variant="success" size="sm">
              {asset.apy} APY
            </Badge>
          </div>
          <div className="flex items-center space-x-1 justify-end">
            <TrendUp size={14} className={isPositive ? 'text-success' : 'text-danger'} weight="bold" />
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
              {asset.change24h}
            </span>
          </div>
        </div>

        {/* Arrow Icon */}
        <ArrowRight 
          size={20} 
          className="text-gray-600 group-hover:text-primary-green transition-colors ml-4"
        />
      </div>
    </button>
  )
}
