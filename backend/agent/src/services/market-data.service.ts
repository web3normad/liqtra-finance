import Logger from '../utils/logger';

const logger = new Logger('MARKET-DATA');

export class MarketDataService {
  
  // In production, fetch from real APIs
  // For now, mock data with some randomness
  
  async getAaveAPY(): Promise<number> {
    // TODO: Fetch from Aave API
    // https://aave.com/api or use The Graph
    const baseAPY = 4.5;
    const variance = (Math.random() - 0.5) * 0.5;
    return Number((baseAPY + variance).toFixed(2));
  }

  async getCompoundAPY(): Promise<number> {
    // TODO: Fetch from Compound API
    const baseAPY = 3.8;
    const variance = (Math.random() - 0.5) * 0.5;
    return Number((baseAPY + variance).toFixed(2));
  }

  async getMoonwellAPY(): Promise<number> {
    // TODO: Fetch from Moonwell API
    const baseAPY = 5.2;
    const variance = (Math.random() - 0.5) * 0.5;
    return Number((baseAPY + variance).toFixed(2));
  }

  async getAllAPYs(): Promise<{ aave_apy: number; compound_apy: number; moonwell_apy : number }> {
    try {
      const [aave_apy, compound_apy, moonwell_apy] = await Promise.all([
        this.getAaveAPY(),
        this.getCompoundAPY(),
        this.getMoonwellAPY(),
      ]);

      logger.info('Fetched market APYs', { aave_apy, compound_apy, moonwell_apy });

      return { aave_apy, compound_apy, moonwell_apy };
    } catch (error) {
      logger.error('Error fetching APYs', error);
      // Return default values
      return { aave_apy: 4.5, compound_apy: 3.8, moonwell_apy : 5.2 };
    }
  }

  async getProtocolSafetyScore(protocolName: string): Promise<number> {
    // TODO: Fetch from DeFi Llama or similar
    const scores: Record<string, number> = {
      aave: 95,
      compound: 92,
      moonwell: 85,
    };
    return scores[protocolName.toLowerCase()] || 80;
  }
}
