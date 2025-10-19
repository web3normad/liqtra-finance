import { useQuery } from '@tanstack/react-query';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { apiClient } from '@/lib/api/client';
import { getVaultAddress, getUSDCAddress } from '@/lib/web3/contracts/addresses';
import { VAULT_ABI, ERC20_ABI } from '@/lib/web3/contracts/abis';

export function usePortfolio() {
  const { address } = useAccount();
  const chainId = useChainId();
  const vaultAddress = getVaultAddress(chainId);
  const usdcAddress = getUSDCAddress(chainId);

  // Get vault balance from smart contract
  const { data: vaultBalance, isLoading: isLoadingVault, refetch: refetchVault } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'balances',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get USDC wallet balance
  const { data: usdcBalance, isLoading: isLoadingUSDC, refetch: refetchUSDC } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get USDC allowance
  const { data: usdcAllowance, refetch: refetchAllowance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && vaultAddress ? [address, vaultAddress] : undefined,
    query: {
      enabled: !!address && !!vaultAddress,
    },
  });

  // Get user risk level
  const { data: riskLevel, refetch: refetchRiskLevel } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'userRiskLevel',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get portfolio data from backend API (optional - gracefully handle if backend is down)
  const { data: portfolioData, isLoading: isLoadingPortfolio, refetch: refetchPortfolio } = useQuery({
    queryKey: ['portfolio', address],
    queryFn: async () => {
      if (!address) return null;
      try {
        return await apiClient.getPortfolio(address);
      } catch (error) {
        console.warn('Backend API unavailable:', error);
        return null;
      }
    },
    enabled: !!address,
    retry: false, // Don't retry on failure
    refetchInterval: false, // Disable auto-refetch since backend may not be running
  });

  // Get portfolio history (optional - gracefully handle if backend is down)
  const { data: portfolioHistory } = useQuery({
    queryKey: ['portfolio-history', address],
    queryFn: async () => {
      if (!address) return null;
      try {
        return await apiClient.getPortfolioHistory(address, 30);
      } catch (error) {
        console.warn('Backend API unavailable:', error);
        return null;
      }
    },
    enabled: !!address,
    retry: false, // Don't retry on failure
  });

  const refetchAll = () => {
    refetchVault();
    refetchUSDC();
    refetchAllowance();
    refetchRiskLevel();
    refetchPortfolio();
  };

  const formattedVaultBalance = vaultBalance ? formatUnits(vaultBalance as bigint, 6) : '0';
  const formattedUSDCBalance = usdcBalance ? formatUnits(usdcBalance as bigint, 6) : '0';
  const formattedAllowance = usdcAllowance ? formatUnits(usdcAllowance as bigint, 6) : '0';

  const needsApproval = !usdcAllowance || usdcAllowance === BigInt(0);


  return {
    // Blockchain data
    vaultBalance: formattedVaultBalance,
    vaultBalanceRaw: vaultBalance,
    usdcBalance: formattedUSDCBalance,
    usdcBalanceRaw: usdcBalance,
    usdcAllowance: formattedAllowance,
    needsApproval,
    riskLevel: riskLevel !== undefined ? Number(riskLevel) : undefined,
    
    // Backend data
    portfolioData: portfolioData?.data,
    portfolioHistory: portfolioHistory?.data,
    
    // Loading states
    isLoading: isLoadingVault || isLoadingUSDC || isLoadingPortfolio,
    isLoadingVault,
    isLoadingUSDC,
    isLoadingPortfolio,
    
    // Refetch functions
    refetch: refetchAll,
    refetchVault,
    refetchUSDC,
    refetchAllowance,
    refetchRiskLevel,
    refetchPortfolio,
  };
}
