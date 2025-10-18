import { BlockchainService } from '../services/blockchain.service';
import { MarketDataService } from '../services/market-data.service';
import { DatabaseService } from '../services/database.service';
import { PortfolioContext, User } from '../types';
import Logger from '../utils/logger';

const logger = new Logger('PERCEPTION');

export class PerceptionModule {
  constructor(
    private blockchain: BlockchainService,
    private marketData: MarketDataService,
    private database: DatabaseService
  ) {}

  /**
   * Perceive the current state for a user
   * This is the "eyes and ears" of the agent
   */
  async perceive(user: User): Promise<PortfolioContext> {
    try {
      logger.info(`Perceiving state for user: ${user.wallet_address}`);

      // 1. Get blockchain data (balances)
      const vaultBalance = await this.blockchain.getUserVaultBalance(user.wallet_address);
      
      // For now, we assume all funds are in vault
      // Later, you'll query actual protocol balances
      const balances = {
        vault: vaultBalance,
        aave: 0n,      // TODO: Query Aave balance
        compound: 0n,  // TODO: Query Compound balance
        moonwell: 0n,  // TODO: Query Moonwell balance
      };

      // 2. Get market data (APYs)
      const market = await this.marketData.getAllAPYs();

      // 3. Get gas price
      const gasPrice = await this.blockchain.getGasPrice();

      // Build context
      const context: PortfolioContext = {
        user,
        balances,
        market,
        gas_price: gasPrice,
      };

      logger.debug('Perception complete', {
        user: user.wallet_address,
        vaultBalance: this.blockchain.formatUSDC(vaultBalance),
        apys: market,
        gasPrice: Number(gasPrice) / 1e9 + ' gwei',
      });

      return context;

    } catch (error) {
      logger.error('Perception failed', { user: user.wallet_address, error });
      throw error;
    }
  }

  /**
   * Check if user has enough balance to warrant action
   */
  isActionable(context: PortfolioContext): boolean {
    const minBalance = 100n * 1_000_000n; // $100 minimum
    return context.balances.vault >= minBalance;
  }

  /**
   * Get summary for logging
   */
  getSummary(context: PortfolioContext): string {
    return `
User: ${context.user.wallet_address}
Risk Level: ${context.user.risk_level}
Vault Balance: $${this.blockchain.formatUSDC(context.balances.vault)}
Market APYs: Aave ${context.market.aave_apy}% | Compound ${context.market.compound_apy}% | Moonwell ${context.market.moonwell_apy}%
Gas: ${Number(context.gas_price) / 1e9} gwei
    `.trim();
  }
}
