import axios from 'axios';

const DEFILLAMA_YIELDS_URL = process.env.NEXT_PUBLIC_YIELDS_API_URL || 'https://yields.llama.fi';

export interface YieldPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
  pool: string;
  poolMeta?: string;
  rewardTokens?: string[];
  underlyingTokens?: string[];
  il7d?: number;
  apyPct1D?: number;
  apyPct7D?: number;
  apyPct30D?: number;
  stablecoin?: boolean;
  ilRisk?: string;
  exposure?: string;
  predictions?: {
    predictedClass?: string;
    predictedProbability?: number;
    binnedConfidence?: number;
  };
}

export interface ProtocolYield {
  protocol: string;
  chain: string;
  pool: string;
  symbol: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  category: 'staking' | 'lending' | 'liquid-staking' | 'dex';
}

class YieldsAPI {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  private async fetchWithCache(url: string) {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const response = await axios.get(url);
    this.cache.set(url, { data: response.data, timestamp: Date.now() });
    return response.data;
  }

  /**
   * Get all yield pools from DeFiLlama
   */
  async getAllPools(): Promise<YieldPool[]> {
    try {
      const data = await this.fetchWithCache(`${DEFILLAMA_YIELDS_URL}/pools`);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching yields:', error);
      return [];
    }
  }

  /**
   * Get yields for specific protocols (Lido, Rocket Pool, Aave, etc.)
   */
  async getProtocolYields(protocols: string[]): Promise<ProtocolYield[]> {
    try {
      const allPools = await this.getAllPools();
      
      const filteredPools = allPools
        .filter(pool => 
          protocols.some(p => 
            pool.project.toLowerCase().includes(p.toLowerCase())
          )
        )
        .map(pool => this.transformToProtocolYield(pool))
        .sort((a, b) => b.apy - a.apy);

      return filteredPools;
    } catch (error) {
      console.error('Error getting protocol yields:', error);
      return [];
    }
  }

  /**
   * Get Lido staking yields across chains
   */
  async getLidoYields(): Promise<ProtocolYield[]> {
    return this.getProtocolYields(['lido']);
  }

  /**
   * Get Rocket Pool yields
   */
  async getRocketPoolYields(): Promise<ProtocolYield[]> {
    return this.getProtocolYields(['rocket pool', 'rocketpool']);
  }

  /**
   * Get Aave lending yields across chains
   */
  async getAaveYields(): Promise<ProtocolYield[]> {
    return this.getProtocolYields(['aave', 'aave-v3']);
  }

  /**
   * Get Compound yields
   */
  async getCompoundYields(): Promise<ProtocolYield[]> {
    return this.getProtocolYields(['compound']);
  }

  /**
   * Get yields by chain
   */
  async getYieldsByChain(chain: string): Promise<ProtocolYield[]> {
    try {
      const allPools = await this.getAllPools();
      
      return allPools
        .filter(pool => pool.chain.toLowerCase() === chain.toLowerCase())
        .map(pool => this.transformToProtocolYield(pool))
        .sort((a, b) => b.apy - a.apy)
        .slice(0, 50); // Top 50 yields
    } catch (error) {
      console.error(`Error getting yields for ${chain}:`, error);
      return [];
    }
  }

  /**
   * Get top yields across all chains
   */
  async getTopYields(limit: number = 20, minTvl: number = 1000000): Promise<ProtocolYield[]> {
    try {
      const allPools = await this.getAllPools();
      
      return allPools
        .filter(pool => pool.tvlUsd >= minTvl && pool.apy > 0 && pool.apy < 1000) // Filter outliers
        .map(pool => this.transformToProtocolYield(pool))
        .sort((a, b) => b.apy - a.apy)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting top yields:', error);
      return [];
    }
  }

  /**
   * Get stablecoin yields only
   */
  async getStablecoinYields(): Promise<ProtocolYield[]> {
    try {
      const allPools = await this.getAllPools();
      
      return allPools
        .filter(pool => pool.stablecoin === true)
        .map(pool => this.transformToProtocolYield(pool))
        .sort((a, b) => b.apy - a.apy)
        .slice(0, 30);
    } catch (error) {
      console.error('Error getting stablecoin yields:', error);
      return [];
    }
  }

  /**
   * Get liquid staking yields (Lido, Rocket Pool, etc.)
   */
  async getLiquidStakingYields(): Promise<ProtocolYield[]> {
    const liquidStakingProtocols = [
      'lido', 
      'rocket pool', 
      'frax', 
      'stakewise',
      'swell',
      'stader'
    ];
    return this.getProtocolYields(liquidStakingProtocols);
  }

  /**
   * Transform DeFiLlama pool to our format
   */
  private transformToProtocolYield(pool: YieldPool): ProtocolYield {
    return {
      protocol: pool.project,
      chain: pool.chain,
      pool: pool.poolMeta || pool.symbol,
      symbol: pool.symbol,
      apy: pool.apy || 0,
      tvl: pool.tvlUsd || 0,
      risk: this.assessRisk(pool),
      category: this.categorizePool(pool),
    };
  }

  /**
   * Assess risk level based on pool characteristics
   */
  private assessRisk(pool: YieldPool): 'low' | 'medium' | 'high' {
    // High risk indicators
    if (pool.apy > 50 || pool.tvlUsd < 1000000 || pool.ilRisk === 'yes') {
      return 'high';
    }
    
    // Low risk indicators
    if (pool.stablecoin || pool.tvlUsd > 100000000 || 
        ['lido', 'aave', 'compound', 'rocket pool'].includes(pool.project.toLowerCase())) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Categorize pool type
   */
  private categorizePool(pool: YieldPool): 'staking' | 'lending' | 'liquid-staking' | 'dex' {
    const project = pool.project.toLowerCase();
    
    if (['lido', 'rocket pool', 'frax', 'stakewise', 'swell'].includes(project)) {
      return 'liquid-staking';
    }
    
    if (['aave', 'compound', 'benqi', 'venus'].includes(project)) {
      return 'lending';
    }
    
    if (pool.symbol.includes('LP') || pool.poolMeta?.includes('pool')) {
      return 'dex';
    }
    
    return 'staking';
  }

  /**
   * Search yields by keyword
   */
  async searchYields(keyword: string): Promise<ProtocolYield[]> {
    try {
      const allPools = await this.getAllPools();
      const searchTerm = keyword.toLowerCase();
      
      return allPools
        .filter(pool => 
          pool.project.toLowerCase().includes(searchTerm) ||
          pool.symbol.toLowerCase().includes(searchTerm) ||
          pool.chain.toLowerCase().includes(searchTerm)
        )
        .map(pool => this.transformToProtocolYield(pool))
        .sort((a, b) => b.apy - a.apy)
        .slice(0, 20);
    } catch (error) {
      console.error('Error searching yields:', error);
      return [];
    }
  }
}

export const yieldsAPI = new YieldsAPI();
