import { useQuery } from '@tanstack/react-query';
import { pricesAPI } from '@/lib/api/prices';

export function useProtocolData() {
  // Get common DeFi token prices
  const { data: prices, isLoading: isLoadingPrices, refetch: refetchPrices } = useQuery({
    queryKey: ['prices', 'defi'],
    queryFn: () => pricesAPI.getDeFiPrices(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refresh every minute
  });

  // Get ETH price
  const { data: ethPrice } = useQuery({
    queryKey: ['prices', 'eth'],
    queryFn: () => pricesAPI.getEthPrice(),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const getTokenPrice = (symbol: string) => {
    const tokenId = pricesAPI.getTokenId(symbol);
    return prices?.[tokenId]?.usd || 0;
  };

  const getToken24hChange = (symbol: string) => {
    const tokenId = pricesAPI.getTokenId(symbol);
    return prices?.[tokenId]?.usd_24h_change || 0;
  };

  return {
    prices,
    ethPrice: ethPrice || 0,
    isLoadingPrices,
    getTokenPrice,
    getToken24hChange,
    refetchPrices,
  };
}
