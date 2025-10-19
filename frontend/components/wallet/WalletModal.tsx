// components/wallet/WalletModal.tsx
'use client'

import { useConnect, useAccount } from 'wagmi'
import { X, Wallet, Lightning, Globe, Coin } from '@phosphor-icons/react'
import { useEffect } from 'react'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const walletIcons = {
  'MetaMask': '🦊',
  'WalletConnect': '🔗',
  'Coinbase Wallet': '🔵',
  'Injected': '💼',
}

const walletColors = {
  'MetaMask': 'from-orange-500/20 to-orange-600/20 border-orange-500/50',
  'WalletConnect': 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
  'Coinbase Wallet': 'from-blue-500/20 to-blue-700/20 border-blue-500/50',
  'Injected': 'from-gray-500/20 to-gray-600/20 border-gray-500/50',
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectors, connect, status, error } = useConnect()
  const { isConnected } = useAccount()

  // Close modal when wallet connects
  useEffect(() => {
    if (isConnected) {
      onClose()
    }
  }, [isConnected, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-md border border-gray-800 w-full max-w-md shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <p className="text-sm text-gray-400 mt-1">
                Choose how you want to connect to Liqtra Finance
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Wallet Options */}
          <div className="p-6 space-y-3">
            {connectors.map((connector) => {
              const walletName = connector.name as keyof typeof walletIcons
              const icon = walletIcons[walletName] || '💼'
              const colorClass = walletColors[walletName] || walletColors['Injected']
              
              return (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  disabled={status === 'pending'}
                  className={`
                    w-full flex items-center space-x-4 p-4 rounded-md 
                    bg-gradient-to-r ${colorClass}
                    hover:opacity-90 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="text-3xl">{icon}</div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold">{connector.name}</p>
                    <p className="text-xs text-gray-400">
                      {status === 'pending' ? 'Connecting...' : 'Connect with ' + connector.name}
                    </p>
                  </div>
                  {status === 'pending' && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 pb-6">
              <div className="p-3 rounded-lg bg-danger/20 border border-danger/50">
                <p className="text-danger text-sm">{error.message}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/50">
            <p className="text-xs text-gray-500 text-center">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
