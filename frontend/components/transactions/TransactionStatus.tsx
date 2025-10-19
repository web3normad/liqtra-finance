'use client'

import { CheckCircle, WarningCircle, Spinner, Clock } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'

type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed'

interface TransactionStatusProps {
  status: TransactionStatus
  txHash?: string
  amount?: string
  protocol?: string
  onClose?: () => void
}

export function TransactionStatus({
  status,
  txHash,
  amount,
  protocol,
  onClose
}: TransactionStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'warning',
      title: 'Transaction Pending',
      description: 'Waiting for wallet confirmation...',
      bgColor: 'bg-warning/20',
      textColor: 'text-warning'
    },
    processing: {
      icon: Spinner,
      color: 'purple',
      title: 'Processing Transaction',
      description: 'Your transaction is being processed on-chain',
      bgColor: 'bg-primary-green/20',
      textColor: 'text-primary-green'
    },
    success: {
      icon: CheckCircle,
      color: 'success',
      title: 'Transaction Successful!',
      description: 'Your transaction has been confirmed',
      bgColor: 'bg-success/20',
      textColor: 'text-success'
    },
    failed: {
      icon: WarningCircle,
      color: 'danger',
      title: 'Transaction Failed',
      description: 'Your transaction could not be completed',
      bgColor: 'bg-danger/20',
      textColor: 'text-danger'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card>
      <div className="text-center">
        {/* Icon */}
        <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon 
            size={32} 
            weight="fill" 
            className={`${config.textColor} ${status === 'processing' ? 'animate-spin' : ''}`}
          />
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
        <p className="text-gray-400 text-sm mb-6">{config.description}</p>

        {/* Transaction Details */}
        {(amount || protocol) && (
          <div className="space-y-3 p-4 bg-gray-800/50 rounded-md mb-6 text-left">
            {amount && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Amount</span>
                <span className="text-white font-medium">{amount}</span>
              </div>
            )}
            {protocol && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Protocol</span>
                <span className="text-white font-medium">{protocol}</span>
              </div>
            )}
            {txHash && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Transaction Hash</span>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-green text-sm hover:text-primary-green-light transition-colors"
                >
                  View on Explorer →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Status Badge */}
        <Badge variant={config.color as any} size="lg">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>

        {/* Action Button */}
        {(status === 'success' || status === 'failed') && (
          <Button
            variant="primary"
            fullWidth
            onClick={onClose}
            className="mt-6"
          >
            {status === 'success' ? 'Done' : 'Try Again'}
          </Button>
        )}
      </div>
    </Card>
  )
}
