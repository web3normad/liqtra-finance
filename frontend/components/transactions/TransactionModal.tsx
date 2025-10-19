'use client'

import { useState } from 'react'
import { ArrowRight, X, Info } from '@phosphor-icons/react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Badge } from '@/components/common/Badge'
import { GasEstimate } from './GasEstimate'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'deposit' | 'withdraw' | 'swap'
  protocol?: string
  onConfirm?: (amount: string) => void
}

export function TransactionModal({
  isOpen,
  onClose,
  type,
  protocol = 'Aave',
  onConfirm
}: TransactionModalProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    onConfirm?.(amount)
    setIsLoading(false)
    onClose()
  }

  const titles = {
    deposit: 'Deposit to Protocol',
    withdraw: 'Withdraw from Protocol',
    swap: 'Swap Assets'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{titles[type]}</h2>
          <p className="text-gray-400 text-sm">
            {type === 'deposit' && 'Deposit your assets to start earning yield'}
            {type === 'withdraw' && 'Withdraw your assets and earnings'}
            {type === 'swap' && 'Swap between different assets'}
          </p>
        </div>

        {/* Protocol Info */}
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-md">
          <div>
            <p className="text-xs text-gray-500 mb-1">Protocol</p>
            <p className="text-white font-semibold">{protocol}</p>
          </div>
          <Badge variant="success" size="sm">6.8% APY</Badge>
        </div>

        {/* Amount Input */}
        <div>
          <Input
            type="number"
            label="Amount"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            helperText="Enter the amount you want to deposit"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">Available: 1,250.00 USDC</p>
            <button
              onClick={() => setAmount('1250')}
              className="text-xs text-primary-green hover:text-primary-green-light transition-colors"
            >
              Max
            </button>
          </div>
        </div>

        {/* Transaction Summary */}
        {amount && (
          <div className="space-y-3 p-4 bg-gray-800/50 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">You will receive</span>
              <span className="text-white font-medium">{amount} aUSDC</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Exchange rate</span>
              <span className="text-white font-medium">1:1</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Expected APY</span>
              <span className="text-success font-medium">6.8%</span>
            </div>
          </div>
        )}

        {/* Gas Estimate */}
        <GasEstimate />

        {/* Info Box */}
        <div className="flex items-start space-x-3 p-3 bg-primary-green/10 rounded-lg border border-primary-green/30">
          <Info size={20} className="text-primary-green flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="text-white text-sm font-medium mb-1">Transaction Details</p>
            <p className="text-gray-400 text-xs">
              Your funds will be deposited into {protocol} and start earning yield immediately. 
              You can withdraw at any time.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Confirm {type}
          </Button>
        </div>
      </div>
    </Modal>
  )
}