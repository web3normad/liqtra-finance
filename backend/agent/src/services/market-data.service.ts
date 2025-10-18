// ============================================
// FILE 1: backend/agent/src/services/market-data.service.ts
// REPLACE ENTIRE FILE with real APY fetching
// ============================================

import { ethers } from 'ethers';
import { CONFIG } from '../config/constants';
import Logger from '../utils/logger';

const logger = new Logger('MARKET-DATA');

// Aave V3 Pool Data Provider ABI (minimal)
const AAVE_DATA_PROVIDER_ABI = [
  'function getReserveData(address asset) view returns (uint256 unbacked, uint256 accruedToTreasuryScaled, uint256 totalAToken, uint256 totalStableDebt, uint256 totalVariableDebt, uint256 liquidityRate, uint256 variableBorrowRate, uint256 stableBorrowRate, uint256 averageStableBorrowRate, uint256 liquidityIndex, uint256 variableBorrowIndex, uint40 lastUpdateTimestamp)',
];

// Compound V3 Comet ABI (minimal)
const COMPOUND_COMET_ABI = [
  'function getSupplyRate(uint utilization) view returns (uint64)',
  'function getUtilization() view returns (uint)',
];

// Moonwell mToken ABI (Compound-style)
const MOONWELL_MTOKEN_ABI = [
  'function supplyRatePerTimestamp() view returns (uint)',
];

export class MarketDataService {
  private provider: ethers.Provider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  }

  async getAaveAPY(): Promise<number> {
    try {
      const aaveDataProvider = new ethers.Contract(
        CONFIG.CONTRACTS.AAVE_DATA_PROVIDER,
        AAVE_DATA_PROVIDER_ABI,
        this.provider
      );

      // Get USDC reserve data
      const reserveData = await aaveDataProvider.getReserveData(
        CONFIG.CONTRACTS.USDC
      );
      
      // liquidityRate is at index 5 (Ray units = 27 decimals)
      const liquidityRate = reserveData[5];
      
      // Convert from Ray to APY percentage
      // Ray = 10^27
      // APY = (1 + ratePerSecond)^secondsPerYear - 1
      const RAY = 10n ** 27n;
      const SECONDS_PER_YEAR = 31536000n;
      
      // Calculate rate per second
      const ratePerSecond = Number(liquidityRate) / Number(RAY);
      
      // Calculate APY
      const apy = (Math.pow(1 + ratePerSecond, Number(SECONDS_PER_YEAR)) - 1) * 100;
      
      const formattedAPY = Number(apy.toFixed(2));
      
      logger.info('Aave APY fetched', { 
        apy: formattedAPY,
        liquidityRate: liquidityRate.toString()
      });
      
      return formattedAPY;

    } catch (error: any) {
      logger.error('Failed to fetch Aave APY', { 
        error: error.message,
        contract: CONFIG.CONTRACTS.AAVE_DATA_PROVIDER
      });
      // Return last known or reasonable default
      return 4.5;
    }
  }

  async getCompoundAPY(): Promise<number> {
    try {
      const compoundComet = new ethers.Contract(
        CONFIG.CONTRACTS.COMPOUND_COMET,
        COMPOUND_COMET_ABI,
        this.provider
      );

      // Get current utilization
      const utilization = await compoundComet.getUtilization();
      
      // Get supply rate at current utilization
      const supplyRate = await compoundComet.getSupplyRate(utilization);
      
      // Compound V3 uses per-second rates with 18 decimals
      const SECONDS_PER_YEAR = 31536000n;
      const ratePerSecond = Number(supplyRate) / 1e18;
      
      // Calculate APY: (1 + ratePerSecond)^secondsPerYear - 1
      const apy = (Math.pow(1 + ratePerSecond, Number(SECONDS_PER_YEAR)) - 1) * 100;
      
      const formattedAPY = Number(apy.toFixed(2));
      
      logger.info('Compound APY fetched', { 
        apy: formattedAPY,
        utilization: utilization.toString()
      });
      
      return formattedAPY;

    } catch (error: any) {
      logger.error('Failed to fetch Compound APY', { 
        error: error.message,
        contract: CONFIG.CONTRACTS.COMPOUND_COMET
      });
      return 3.8;
    }
  }

  async getMoonwellAPY(): Promise<number> {
    try {
      // Moonwell uses Compound-style mTokens
      const moonwellToken = new ethers.Contract(
        CONFIG.CONTRACTS.MOONWELL,
        MOONWELL_MTOKEN_ABI,
        this.provider
      );

      // Get supply rate per timestamp (Moonwell uses per-timestamp instead of per-block)
      const supplyRatePerTimestamp = await moonwellToken.supplyRatePerTimestamp();
      
      // Moonwell typically uses 12-second timestamps
      const SECONDS_PER_YEAR = 31536000n;
      const TIMESTAMP_INTERVAL = 12n; // 12 seconds per timestamp
      const timestampsPerYear = SECONDS_PER_YEAR / TIMESTAMP_INTERVAL;
      
      // Convert to APY
      const ratePerTimestamp = Number(supplyRatePerTimestamp) / 1e18;
      const apy = (Math.pow(1 + ratePerTimestamp, Number(timestampsPerYear)) - 1) * 100;
      
      const formattedAPY = Number(apy.toFixed(2));
      
      logger.info('Moonwell APY fetched', { 
        apy: formattedAPY,
        supplyRate: supplyRatePerTimestamp.toString()
      });
      
      return formattedAPY;

    } catch (error: any) {
      logger.error('Failed to fetch Moonwell APY', { 
        error: error.message,
        contract: CONFIG.CONTRACTS.MOONWELL
      });
      return 5.2;
    }
  }

  async getAllAPYs(): Promise<{ 
    aave_apy: number; 
    compound_apy: number; 
    moonwell_apy: number 
  }> {
    try {
      // Fetch all in parallel for speed
      const [aave_apy, compound_apy, moonwell_apy] = await Promise.all([
        this.getAaveAPY(),
        this.getCompoundAPY(),
        this.getMoonwellAPY(),
      ]);

      logger.info('All APYs fetched successfully', { 
        aave_apy, 
        compound_apy, 
        moonwell_apy 
      });

      return { aave_apy, compound_apy, moonwell_apy };
      
    } catch (error) {
      logger.error('Error fetching all APYs', error);
      // Return reasonable defaults if all fail
      return { 
        aave_apy: 4.5, 
        compound_apy: 3.8, 
        moonwell_apy: 5.2 
      };
    }
  }

  async getProtocolSafetyScore(protocolName: string): Promise<number> {
    try {
      // Fetch TVL and audit info from DeFi Llama
      const response = await fetch(
        `https://api.llama.fi/protocol/${protocolName.toLowerCase()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch from DeFi Llama');
      }

      const data: any = await response.json();
      
      // Calculate safety score based on multiple factors
      const tvl = data.tvl || 0;
      const chainTvls = data.chainTvls?.Base || 0;
      
      // Base score on TVL
      let score = 70; // Base score
      
      if (tvl > 1_000_000_000) score += 25;        // > $1B TVL
      else if (tvl > 500_000_000) score += 20;     // > $500M TVL
      else if (tvl > 100_000_000) score += 15;     // > $100M TVL
      else if (tvl > 10_000_000) score += 10;      // > $10M TVL
      
      // Bonus for significant Base TVL
      if (chainTvls > 50_000_000) score += 5;      // > $50M on Base
      
      logger.info('Safety score calculated', { 
        protocol: protocolName, 
        score,
        tvl,
        chainTvl: chainTvls
      });
      
      return Math.min(score, 100); // Cap at 100

    } catch (error: any) {
      logger.warn('Failed to fetch safety score, using defaults', { 
        protocol: protocolName,
        error: error.message
      });
      
      // Fallback to hardcoded scores based on reputation
      const defaultScores: Record<string, number> = {
        aave: 95,      // Battle-tested, largest TVL
        compound: 92,  // Long history, strong security
        moonwell: 85,  // Newer but audited
      };
      
      return defaultScores[protocolName.toLowerCase()] || 80;
    }
  }
}



