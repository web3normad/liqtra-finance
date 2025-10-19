import { useAccount, useBalance, useReadContract, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { useProtocolData } from './useProtocolData';
import { getUSDCAddress } from '@/lib/web3/contracts/addresses';
import { ERC20_ABI } from '@/lib/web3/contracts/abis';

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceRaw: bigint;
  decimals: number;
  priceUSD: number;
  valueUSD: number;
  logo: string;
  address?: string;
  change24h?: number;
}

// Common ERC20 tokens on Base Sepolia (you can add more)
const BASE_SEPOLIA_TOKENS = {
  USDC: {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`,
    decimals: 6,
    name: 'USD Coin',
    logo: '/assets/icons/usdc.svg',
  },
  // Add more tokens as needed
};

export function useWalletBalances() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { getTokenPrice } = useProtocolData();
  const usdcAddress = getUSDCAddress(chainId);

  // Get ETH balance (native token)
  const { data: ethBalance, isLoading: isLoadingETH, refetch: refetchETH } = useBalance({
    address,
  });

  // Get USDC balance
  const { data: usdcBalanceRaw, isLoading: isLoadingUSDC, refetch: refetchUSDC, error: usdcError } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!usdcAddress,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  // Debug log
  if (usdcError) {
    console.error('USDC Balance Error:', usdcError);
  }
  if (address && usdcAddress) {
    console.log('USDC Query:', {
      address,
      usdcAddress,
      usdcBalanceRaw,
      isLoadingUSDC,
    });
  }

  // Get token prices
  const ethPrice = getTokenPrice('ETH');
  const usdcPrice = getTokenPrice('USDC');
  const btcPrice = getTokenPrice('BTC'); // In case user has wrapped BTC

  // Format balances
  const ethBalanceFormatted = ethBalance?.value ? formatUnits(ethBalance.value, 18) : '0';
  const usdcBalanceFormatted = usdcBalanceRaw ? formatUnits(usdcBalanceRaw as bigint, 6) : '0';

  // Calculate USD values
  const ethValueUSD = parseFloat(ethBalanceFormatted) * ethPrice;
  const usdcValueUSD = parseFloat(usdcBalanceFormatted) * usdcPrice;

  // Build token balances array
  const tokens: TokenBalance[] = [];

  // Add ETH if balance > 0 or always show
  if (address) {
    tokens.push({
      symbol: 'ETH',
      name: 'Ethereum',
      balance: ethBalanceFormatted,
      balanceRaw: ethBalance?.value || BigInt(0),
      decimals: 18,
      priceUSD: ethPrice,
      valueUSD: ethValueUSD,
      logo: '/eth-logo.svg',
      change24h: 2.5, // Could fetch real data from API
    });

    tokens.push({
      symbol: 'USDC',
      name: 'USD Coin',
      balance: usdcBalanceFormatted,
      balanceRaw: (usdcBalanceRaw as bigint) || BigInt(0),
      decimals: 6,
      priceUSD: usdcPrice,
      valueUSD: usdcValueUSD,
      logo: '/assets/icons/usdc.svg',
      address: usdcAddress,
      change24h: 0.01,
    });
  }

  // Calculate total USD value
  const totalValueUSD = tokens.reduce((sum, token) => sum + token.valueUSD, 0);

  // Calculate total change (weighted average)
  const totalChange24h = tokens.length > 0
    ? tokens.reduce((sum, token) => {
        const weight = totalValueUSD > 0 ? token.valueUSD / totalValueUSD : 0;
        return sum + (token.change24h || 0) * weight;
      }, 0)
    : 0;

  const refetchAll = () => {
    refetchETH();
    refetchUSDC();
  };

  return {
    tokens,
    totalValueUSD,
    totalChange24h,
    isLoading: isLoadingETH || isLoadingUSDC,
    refetch: refetchAll,
  };
}
