import { useQuery } from '@tanstack/react-query';
import { yieldsAPI, type ProtocolYield } from '@/lib/api/yields';

export function useYieldData() {
  // Get all top yields
  const { data: topYields, isLoading: isLoadingTop } = useQuery({
    queryKey: ['yields', 'top'],
    queryFn: () => yieldsAPI.getTopYields(20, 1000000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });

  // Get liquid staking yields
  const { data: liquidStakingYields, isLoading: isLoadingLiquidStaking } = useQuery({
    queryKey: ['yields', 'liquid-staking'],
    queryFn: () => yieldsAPI.getLiquidStakingYields(),
    staleTime: 5 * 60 * 1000,
  });

  // Get stablecoin yields
  const { data: stablecoinYields, isLoading: isLoadingStablecoin } = useQuery({
    queryKey: ['yields', 'stablecoin'],
    queryFn: () => yieldsAPI.getStablecoinYields(),
    staleTime: 5 * 60 * 1000,
  });

  // Get Lido yields
  const { data: lidoYields } = useQuery({
    queryKey: ['yields', 'lido'],
    queryFn: () => yieldsAPI.getLidoYields(),
    staleTime: 5 * 60 * 1000,
  });

  // Get Rocket Pool yields
  const { data: rocketPoolYields } = useQuery({
    queryKey: ['yields', 'rocket-pool'],
    queryFn: () => yieldsAPI.getRocketPoolYields(),
    staleTime: 5 * 60 * 1000,
  });

  // Get Aave yields
  const { data: aaveYields } = useQuery({
    queryKey: ['yields', 'aave'],
    queryFn: () => yieldsAPI.getAaveYields(),
    staleTime: 5 * 60 * 1000,
  });

  const getYieldsByChain = (chain: string) => {
    return useQuery({
      queryKey: ['yields', 'chain', chain],
      queryFn: () => yieldsAPI.getYieldsByChain(chain),
      staleTime: 5 * 60 * 1000,
      enabled: !!chain,
    });
  };

  const searchYields = (keyword: string) => {
    return useQuery({
      queryKey: ['yields', 'search', keyword],
      queryFn: () => yieldsAPI.searchYields(keyword),
      staleTime: 5 * 60 * 1000,
      enabled: !!keyword && keyword.length > 2,
    });
  };

  return {
    topYields,
    liquidStakingYields,
    stablecoinYields,
    lidoYields,
    rocketPoolYields,
    aaveYields,
    isLoading: isLoadingTop || isLoadingLiquidStaking || isLoadingStablecoin,
    getYieldsByChain,
    searchYields,
  };
}
