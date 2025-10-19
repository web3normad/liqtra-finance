import axios from 'axios';

const COINGECKO_API = process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';

export interface TokenPrice {
  symbol: string;
  usd: number;
  usd_24h_change: number;
  usd_market_cap?: number;
  last_updated: number;
}

export interface TokenPrices {
  [key: string]: TokenPrice;
}

class PricesAPI {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 60 * 1000; // 1 minute cache

  /**
   * Get prices for multiple tokens
   */
  async getTokenPrices(tokenIds: string[]): Promise<TokenPrices> {
    try {
      const cacheKey = tokenIds.sort().join(',');
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
        return cached.data;
      }

      const ids = tokenIds.join(',');
      const response = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: {
          ids,
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_last_updated_at: true,
        },
      });

      const prices: TokenPrices = {};
      Object.entries(response.data).forEach(([id, data]: [string, any]) => {
        prices[id] = {
          symbol: id,
          usd: data.usd || 0,
          usd_24h_change: data.usd_24h_change || 0,
          usd_market_cap: data.usd_market_cap,
          last_updated: data.last_updated_at || Date.now() / 1000,
        };
      });

      this.cache.set(cacheKey, { data: prices, timestamp: Date.now() });
      return prices;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return {};
    }
  }

  /**
   * Get price for a single token
   */
  async getTokenPrice(tokenId: string): Promise<TokenPrice | null> {
    const prices = await this.getTokenPrices([tokenId]);
    return prices[tokenId] || null;
  }

  /**
   * Get common DeFi token prices
   */
  async getDeFiPrices(): Promise<TokenPrices> {
    const commonTokens = [
      'ethereum',
      'usd-coin',
      'tether',
      'dai',
      'wrapped-bitcoin',
      'staked-ether', // Lido stETH
      'rocket-pool-eth', // rETH
      'aave',
      'compound-governance-token',
      'uniswap',
      'chainlink',
    ];

    return this.getTokenPrices(commonTokens);
  }

  /**
   * Get ETH price
   */
  async getEthPrice(): Promise<number> {
    const price = await this.getTokenPrice('ethereum');
    return price?.usd || 0;
  }

  /**
   * Get historical price data
   */
  async getHistoricalPrices(tokenId: string, days: number = 30): Promise<[number, number][]> {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/${tokenId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days,
        },
      });

      return response.data.prices || [];
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      return [];
    }
  }

  /**
   * Map common symbols to CoinGecko IDs
   */
  getTokenId(symbol: string): string {
    const symbolMap: { [key: string]: string } = {
      'ETH': 'ethereum',
      'WETH': 'ethereum',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'DAI': 'dai',
      'WBTC': 'wrapped-bitcoin',
      'stETH': 'staked-ether',
      'rETH': 'rocket-pool-eth',
      'AAVE': 'aave',
      'COMP': 'compound-governance-token',
      'UNI': 'uniswap',
      'LINK': 'chainlink',
      'MATIC': 'matic-network',
      'OP': 'optimism',
      'ARB': 'arbitrum',
    };

    return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
  }
}

export const pricesAPI = new PricesAPI();
