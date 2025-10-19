import { Tool } from '@langchain/core/tools';
import axios from 'axios';

export interface YieldOpportunity {
  protocol: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  chain: string;
}

export interface ScanYieldsInput {
  riskTolerance: 'low' | 'medium' | 'high';
}

/**
 * Tool to scan DeFi yield opportunities
 * Queries DeFiLlama API for latest yields
 */
export class ScanYieldsTool extends Tool {
  name = 'scan_yields';
  description = `Scan DeFi protocols for yield opportunities. 
    Input should be a JSON object with riskTolerance: 'low' | 'medium' | 'high'.
    Returns list of protocols with APY, TVL, and risk ratings.`;

  private riskTolerance: 'low' | 'medium' | 'high';

  constructor(config: ScanYieldsInput) {
    super();
    this.riskTolerance = config.riskTolerance;
  }

  async _call(input: string): Promise<string> {
    try {
      // Query DeFiLlama API
      const response = await axios.get('https://yields.llama.fi/pools');
      const pools = response.data.data;

      // Filter for Base network and stablecoins
      const opportunities = pools
        .filter((pool: any) => {
          const chain = pool.chain?.toLowerCase() || '';
          const symbol = pool.symbol?.toLowerCase() || '';
          
          return (
            (chain.includes('base') || chain.includes('ethereum')) &&
            (symbol.includes('usdc') || symbol.includes('dai') || symbol.includes('usdt'))
          );
        })
        .slice(0, 20) // Top 20
        .map((pool: any) => ({
          protocol: pool.project || 'Unknown',
          pool: pool.symbol || '',
          apy: pool.apy || 0,
          tvl: pool.tvlUsd || 0,
          risk: this.assessRisk(pool),
          chain: pool.chain || 'unknown',
        }))
        .filter((opp: any) => this.meetsRiskTolerance(opp))
        .sort((a: any, b: any) => b.apy - a.apy)
        .slice(0, 10); // Top 10 after filtering

      return JSON.stringify({
        success: true,
        opportunities,
        count: opportunities.length,
        riskTolerance: this.riskTolerance,
      });
    } catch (error: any) {
      return JSON.stringify({
        success: false,
        error: error.message,
        opportunities: [],
      });
    }
  }

  private assessRisk(pool: any): 'low' | 'medium' | 'high' {
    const tvl = pool.tvlUsd || 0;
    const apy = pool.apy || 0;

    // Blue chip protocols
    const lowRiskProtocols = ['aave', 'compound', 'lido', 'uniswap'];
    const protocol = (pool.project || '').toLowerCase();

    if (lowRiskProtocols.some((p) => protocol.includes(p)) && tvl > 100000000) {
      return 'low';
    }

    // High APY = High risk
    if (apy > 15) return 'high';
    if (apy > 8) return 'medium';

    // High TVL = Lower risk
    if (tvl > 500000000) return 'low';
    if (tvl > 100000000) return 'medium';

    return 'high';
  }

  private meetsRiskTolerance(opportunity: any): boolean {
    const { risk } = opportunity;

    if (this.riskTolerance === 'low') {
      return risk === 'low';
    }

    if (this.riskTolerance === 'medium') {
      return risk === 'low' || risk === 'medium';
    }

    // High tolerance accepts all
    return true;
  }
}
