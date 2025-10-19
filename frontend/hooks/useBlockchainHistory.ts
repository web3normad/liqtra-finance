import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { apiClient } from '@/lib/api/client';

export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
  type: 'deposit' | 'withdraw' | 'approve' | 'transfer';
  gasUsed?: string;
  gasPrice?: string;
}

export function useTransactionHistory() {
  const { address } = useAccount();
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 84532;
  const explorerApiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;

  // Get transaction history from backend
  const { data: backendTxs, isLoading: isLoadingBackend } = useQuery({
    queryKey: ['transactions', 'backend', address],
    queryFn: () => address ? apiClient.getActions(address, 50) : null,
    enabled: !!address,
    refetchInterval: 30000,
  });

  // Get blockchain transactions from explorer API
  const { data: blockchainTxs, isLoading: isLoadingBlockchain } = useQuery({
    queryKey: ['transactions', 'blockchain', address],
    queryFn: async () => {
      if (!address) return [];
      
      try {
        const vaultAddress = process.env.NEXT_PUBLIC_VAULT_CONTRACT;
        
        // Base Sepolia explorer API
        const apiUrl = `https://api-sepolia.basescan.org/api`;
        
        const params = {
          module: 'account',
          action: 'txlist',
          address: address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 50,
          sort: 'desc',
          apikey: explorerApiKey || 'YourApiKeyToken',
        };

        const response = await axios.get(apiUrl, { params });
        
        if (response.data.status === '1' && response.data.result) {
          return response.data.result
            .filter((tx: any) => 
              // Filter for transactions related to our vault
              tx.to?.toLowerCase() === vaultAddress?.toLowerCase() ||
              tx.from?.toLowerCase() === vaultAddress?.toLowerCase()
            )
            .map((tx: any) => ({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value,
              timestamp: Number(tx.timeStamp),
              status: tx.isError === '0' ? 'success' : 'failed',
              type: determineTransactionType(tx),
              gasUsed: tx.gasUsed,
              gasPrice: tx.gasPrice,
            })) as BlockchainTransaction[];
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching blockchain transactions:', error);
        return [];
      }
    },
    enabled: !!address,
    staleTime: 30000,
  });

  const allTransactions = [
    ...(blockchainTxs || []),
  ].sort((a, b) => b.timestamp - a.timestamp);

  return {
    transactions: allTransactions,
    backendActions: backendTxs?.data || [],
    isLoading: isLoadingBackend || isLoadingBlockchain,
    isLoadingBackend,
    isLoadingBlockchain,
  };
}

function determineTransactionType(tx: any): 'deposit' | 'withdraw' | 'approve' | 'transfer' {
  const input = tx.input?.toLowerCase() || '';
  
  // Check function signatures
  if (input.startsWith('0x095ea7b3')) return 'approve';
  if (input.startsWith('0xb6b55f25') || input.startsWith('0xd0e30db0')) return 'deposit';
  if (input.startsWith('0x2e1a7d4d') || input.startsWith('0x3ccfd60b')) return 'withdraw';
  
  return 'transfer';
}
