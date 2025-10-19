import { useAccount, useBalance, useDisconnect, useChainId } from 'wagmi';
import { useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { apiClient } from '@/lib/api/client';
import toast from 'react-hot-toast';

export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();

  // Get ETH balance
  const { data: ethBalance, isLoading: isLoadingBalance } = useBalance({
    address,
  });

  // Register user on backend when wallet connects (optional - gracefully handle if backend is down)
  useEffect(() => {
    if (address && isConnected) {
      apiClient
        .connectWallet(address)
        .then(() => {
          console.log('User registered/connected to backend');
        })
        .catch((error) => {
          console.warn('Backend API unavailable, continuing with limited features:', error);
          // Don't show error toast - backend is optional for basic functionality
        });
    }
  }, [address, isConnected]);

  const connect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isReconnecting,
    chainId,
    ethBalance: ethBalance?.formatted || '0',
    ethBalanceSymbol: ethBalance?.symbol || 'ETH',
    connect,
    disconnect: handleDisconnect,
  };
}
