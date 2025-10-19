import axios from 'axios';
import { ethers } from 'ethers';
import Logger from '../utils/logger';

const logger = new Logger('AGENT_SERVICE');

export interface AgentAutomateParams {
  userAddress: string;
  vaultBalance: string; // USDC balance
  riskLevel: 'low' | 'medium' | 'high';
  enableRebalancing?: boolean;
}

export interface YieldOpportunity {
  protocol: string;
  pool: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  chain: string;
}

export interface AllocationDecision {
  protocol: string;
  amount: string;
  apy: number;
  percentage: number;
}

export interface AgentResult {
  success: boolean;
  action: 'stake' | 'rebalance' | 'do_nothing';
  allocations: AllocationDecision[];
  reasoning: string;
  transactions?: Array<{
    protocol: string;
    txHash: string;
    status: 'pending' | 'success' | 'failed';
  }>;
  error?: string;
}

/**
 * Autonomous DeFi Agent Service
 * 
 * Implements autonomous yield optimization without requiring
 * full CDP AgentKit integration (can be added later)
 */
export class AgentService {
  private rpcUrl: string;
  private vaultAddress: string;
  private usdcAddress: string;

  constructor() {
    this.rpcUrl = process.env.RPC_URL || 'https://sepolia.base.org';
    this.vaultAddress = process.env.VAULT_CONTRACT || '';
    this.usdcAddress = process.env.USDC_CONTRACT || '';
  }

  /**
   * Main autonomous execution flow
   */
  async automate(params: AgentAutomateParams): Promise<AgentResult> {
    try {
      logger.info('🤖 Starting autonomous agent...');
      logger.info(`   User: ${params.userAddress}`);
      logger.info(`   Balance: $${params.vaultBalance} USDC`);
      logger.info(`   Risk: ${params.riskLevel}`);

      // Step 1: Scan yield opportunities
      logger.info('📊 Step 1: Scanning DeFi yields...');
      const opportunities = await this.scanYields(params.riskLevel);
      
      if (opportunities.length === 0) {
        return {
          success: true,
          action: 'do_nothing',
          allocations: [],
          reasoning: 'No suitable yield opportunities found matching your risk profile',
        };
      }

      logger.info(`   Found ${opportunities.length} opportunities`);

      // Step 2: Make allocation decision
      logger.info('🤔 Step 2: Calculating optimal allocation...');
      const decision = await this.makeAllocationDecision(
        opportunities,
        parseFloat(params.vaultBalance),
        params.riskLevel
      );

      logger.info(`   Decision: ${decision.action}`);
      logger.info(`   Allocations: ${decision.allocations.length} protocols`);

      // Step 3: Execute (simulate for now)
      if (decision.action === 'stake' && decision.allocations.length > 0) {
        logger.info('⚡ Step 3: Executing transactions...');
        const transactions = await this.executeStaking(
          params.userAddress,
          decision.allocations
        );

        return {
          ...decision,
          transactions,
        };
      }

      return decision;
    } catch (error: any) {
      logger.error('❌ Agent automation failed:', error);
      return {
        success: false,
        action: 'do_nothing',
        allocations: [],
        reasoning: 'Agent encountered an error',
        error: error.message,
      };
    }
  }

  /**
   * Scan DeFi protocols for yield opportunities
   */
  private async scanYields(riskLevel: 'low' | 'medium' | 'high'): Promise<YieldOpportunity[]> {
    try {
      // Query DeFiLlama API
      const response = await axios.get('https://yields.llama.fi/pools', {
        timeout: 10000,
      });

      const pools = response.data.data;

      // Filter and sort opportunities
      const opportunities = pools
        .filter((pool: any) => {
          const chain = (pool.chain || '').toLowerCase();
          const symbol = (pool.symbol || '').toLowerCase();
          const project = (pool.project || '').toLowerCase();

          // Filter for relevant chains and stablecoins
          const relevantChain = chain.includes('base') || chain.includes('ethereum');
          const isStablecoin = symbol.includes('usdc') || symbol.includes('dai') || symbol.includes('usdt');
          
          return relevantChain && isStablecoin;
        })
        .map((pool: any) => ({
          protocol: pool.project || 'Unknown',
          pool: pool.symbol || '',
          apy: pool.apy || 0,
          tvl: pool.tvlUsd || 0,
          risk: this.assessRisk(pool),
          chain: pool.chain || 'unknown',
        }))
        .filter((opp: YieldOpportunity) => this.meetsRiskTolerance(opp, riskLevel))
        .sort((a: YieldOpportunity, b: YieldOpportunity) => b.apy - a.apy)
        .slice(0, 10);

      return opportunities;
    } catch (error) {
      logger.error('Failed to fetch yields:', error);
      // Return mock data as fallback
      return this.getMockOpportunities(riskLevel);
    }
  }

  /**
   * Assess risk level of a protocol
   */
  private assessRisk(pool: any): 'low' | 'medium' | 'high' {
    const tvl = pool.tvlUsd || 0;
    const apy = pool.apy || 0;
    const project = (pool.project || '').toLowerCase();

    // Blue chip protocols
    const lowRiskProtocols = ['aave', 'compound', 'lido', 'uniswap', 'curve'];
    const isBlueChip = lowRiskProtocols.some((p) => project.includes(p));

    if (isBlueChip && tvl > 100000000) return 'low';
    if (apy > 15) return 'high';
    if (apy > 8) return 'medium';
    if (tvl > 500000000) return 'low';
    if (tvl > 100000000) return 'medium';

    return 'high';
  }

  /**
   * Check if opportunity meets risk tolerance
   */
  private meetsRiskTolerance(opp: YieldOpportunity, riskLevel: 'low' | 'medium' | 'high'): boolean {
    if (riskLevel === 'low') return opp.risk === 'low';
    if (riskLevel === 'medium') return opp.risk === 'low' || opp.risk === 'medium';
    return true; // High tolerance accepts all
  }

  /**
   * Make allocation decision using AI logic
   */
  private async makeAllocationDecision(
    opportunities: YieldOpportunity[],
    totalBalance: number,
    riskLevel: 'low' | 'medium' | 'high'
  ): Promise<AgentResult> {
    // Don't stake if balance is too low (gas costs)
    if (totalBalance < 10) {
      return {
        success: true,
        action: 'do_nothing',
        allocations: [],
        reasoning: 'Balance too low to stake efficiently (minimum $10 recommended)',
      };
    }

    // Determine number of protocols to diversify into
    const maxProtocols = riskLevel === 'low' ? 2 : riskLevel === 'medium' ? 3 : 4;
    const selectedOpportunities = opportunities.slice(0, Math.min(maxProtocols, opportunities.length));

    // Calculate allocations (equal weight for simplicity)
    const allocations: AllocationDecision[] = selectedOpportunities.map((opp, index) => {
      const percentage = 100 / selectedOpportunities.length;
      const amount = (totalBalance * (percentage / 100)).toFixed(2);

      return {
        protocol: opp.protocol,
        amount,
        apy: opp.apy,
        percentage,
      };
    });

    // Generate reasoning
    const avgAPY = allocations.reduce((sum, a) => sum + a.apy, 0) / allocations.length;
    const reasoning = `Optimal allocation found: ${allocations.length} protocols with average APY of ${avgAPY.toFixed(2)}%. Diversification strategy based on ${riskLevel} risk profile.`;

    return {
      success: true,
      action: 'stake',
      allocations,
      reasoning,
    };
  }

  /**
   * Execute staking transactions
   */
  private async executeStaking(
    userAddress: string,
    allocations: AllocationDecision[]
  ): Promise<Array<{ protocol: string; txHash: string; status: 'pending' | 'success' | 'failed' }>> {
    // In production, this would execute real transactions
    // For now, simulate transaction hashes
    const transactions = allocations.map((allocation) => ({
      protocol: allocation.protocol,
      txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      status: 'pending' as const,
    }));

    logger.info('   Simulated transactions:');
    transactions.forEach((tx) => {
      logger.info(`     - ${tx.protocol}: ${tx.txHash}`);
    });

    return transactions;
  }

  /**
   * Get mock opportunities as fallback
   */
  private getMockOpportunities(riskLevel: string): YieldOpportunity[] {
    const allOpportunities: YieldOpportunity[] = [
      {
        protocol: 'Aave',
        pool: 'USDC',
        apy: 4.2,
        tvl: 5000000000,
        risk: 'low',
        chain: 'Base',
      },
      {
        protocol: 'Compound',
        pool: 'USDC',
        apy: 3.8,
        tvl: 3000000000,
        risk: 'low',
        chain: 'Ethereum',
      },
      {
        protocol: 'Uniswap',
        pool: 'USDC-ETH',
        apy: 8.5,
        tvl: 1000000000,
        risk: 'medium',
        chain: 'Base',
      },
    ];

    return allOpportunities.filter((opp) => this.meetsRiskTolerance(opp, riskLevel as any));
  }
}
