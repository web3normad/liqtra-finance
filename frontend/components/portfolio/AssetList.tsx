'use client'

import { AssetItem } from './AssetItem'
import { Card } from '@/components/common/Card'
import { Tabs } from '@/components/common/Tabs'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Input } from '@/components/common/Input'
import { useState } from 'react'

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

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'USD Coin',
    symbol: 'USDC',
    protocol: 'Aave V3',
    balance: '5,000',
    value: '$5,000',
    apy: '6.8%',
    change24h: '+2.3%',
    logo: '💵'
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    protocol: 'Lido',
    balance: '2.5',
    value: '$8,750',
    apy: '3.5%',
    change24h: '+5.2%',
    logo: '💎'
  },
  {
    id: '3',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    protocol: 'Compound',
    balance: '0.25',
    value: '$10,817.89',
    apy: '4.2%',
    change24h: '+1.8%',
    logo: '₿'
  }
]

export function AssetList() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssets = mockAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.protocol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Your Assets</h2>
            <p className="text-sm text-gray-400">
              {mockAssets.length} assets across {new Set(mockAssets.map(a => a.protocol)).size} protocols
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Input
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<MagnifyingGlass size={20} />}
        />
      </div>

      <Tabs
        tabs={[
          { label: 'All Assets', value: 'all', badge: mockAssets.length },
          { label: 'Earning', value: 'earning' },
          { label: 'Staked', value: 'staked' }
        ]}
      >
        {(activeTab) => (
          <div className="space-y-3">
            {filteredAssets.map((asset) => (
              <AssetItem key={asset.id} asset={asset} />
            ))}

            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No assets found</p>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </Card>
  )
}
