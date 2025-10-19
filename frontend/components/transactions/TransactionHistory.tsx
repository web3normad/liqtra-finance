'use client'

import { ArrowDown, ArrowUp, ArrowsLeftRight, Clock } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Tabs } from '@/components/common/Tabs'

interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'swap'
  protocol: string
  amount: string
  asset: string
  status: 'completed' | 'pending' | 'failed'
  timestamp: Date
  txHash: string
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    protocol: 'Aave V3',
    amount: '5,000',
    asset: 'USDC',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000),
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    type: 'withdraw',
    protocol: 'Compound',
    amount: '2,500',
    asset: 'USDC',
    status: 'completed',
    timestamp: new Date(Date.now() - 7200000),
    txHash: '0x8765...4321'
  },
  {
    id: '3',
    type: 'swap',
    protocol: 'Uniswap',
    amount: '1,000',
    asset: 'USDC → ETH',
    status: 'pending',
    timestamp: new Date(Date.now() - 300000),
    txHash: '0xabcd...efgh'
  }
]

export function TransactionHistory() {
  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown size={16} weight="bold" className="text-success" />
      case 'withdraw':
        return <ArrowUp size={16} weight="bold" className="text-danger" />
      case 'swap':
        return <ArrowsLeftRight size={16} weight="bold" className="text-primary-green" />
    }
  }

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>
      case 'failed':
        return <Badge variant="danger" size="sm">Failed</Badge>
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Transaction History</h3>
          <p className="text-sm text-gray-400">All your DeFi transactions</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { label: 'All', value: 'all', badge: mockTransactions.length },
          { label: 'Deposits', value: 'deposits' },
          { label: 'Withdrawals', value: 'withdrawals' },
          { label: 'Swaps', value: 'swaps' }
        ]}
      >
        {(activeTab) => (
          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-md hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-white font-semibold text-sm capitalize">
                        {tx.type}
                      </p>
                      {getStatusBadge(tx.status)}
                    </div>
                    <p className="text-xs text-gray-400">
                      {tx.protocol} • {formatTime(tx.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold">
                    {tx.type === 'withdraw' && '-'}
                    {tx.type === 'deposit' && '+'}
                    {tx.amount} {tx.asset}
                  </p>
                  <a
                    href={`https://etherscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-green hover:text-primary-green-light transition-colors"
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}

            {mockTransactions.length === 0 && (
              <div className="text-center py-12">
                <Clock size={48} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No transactions yet</p>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </Card>
  )
}