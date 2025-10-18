import { BlockchainService } from '../services/blockchain.service';
import { MarketDataService } from '../services/market-data.service';
import { DatabaseService } from '../services/database.service';
import { PortfolioContext, User } from '../types';
import { CONFIG } from '../config/constants';
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

      // 1. Get vault balance
      const vaultBalance = await this.blockchain.getUserVaultBalance(user.wallet_address);
      
      // 2. Get protocol balances from vault contract
      // These track how much the user has deployed to each protocol
      const [aaveBalance, compoundBalance, moonwellBalance] = await Promise.all([
        this.blockchain.getUserProtocolBalance(
          user.wallet_address, 
          CONFIG.CONTRACTS.AAVE_POOL
        ),
        this.blockchain.getUserProtocolBalance(
          user.wallet_address,
          CONFIG.CONTRACTS.COMPOUND_COMET
        ),
        this.blockchain.getUserProtocolBalance(
          user.wallet_address,
          CONFIG.CONTRACTS.MOONWELL
        ),
      ]);

      const balances = {
        vault: vaultBalance,
        aave: aaveBalance,
        compound: compoundBalance,
        moonwell: moonwellBalance,
      };

      // 3. Get market data (APYs)
      const market = await this.marketData.getAllAPYs();

      // 4. Get gas price
      const gasPrice = await this.blockchain.getGasPrice();

      // Calculate total balance for logging
      const totalBalance = vaultBalance + aaveBalance + compoundBalance + moonwellBalance;

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
        aaveBalance: this.blockchain.formatUSDC(aaveBalance),
        compoundBalance: this.blockchain.formatUSDC(compoundBalance),
        moonwellBalance: this.blockchain.formatUSDC(moonwellBalance),
        totalBalance: this.blockchain.formatUSDC(totalBalance),
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
   * ✅ MISSING METHOD: Check if user has enough balance to warrant action
   */
  isActionable(context: PortfolioContext): boolean {
    const minBalance = 100n * 1_000_000n; // $100 minimum
    
    // Check total balance across all locations
    const totalBalance = 
      context.balances.vault + 
      context.balances.aave + 
      context.balances.compound + 
      context.balances.moonwell;
    
    return totalBalance >= minBalance;
  }

  /**
   * ✅ MISSING METHOD: Get summary for logging
   */
  getSummary(context: PortfolioContext): string {
    const totalBalance = 
      context.balances.vault + 
      context.balances.aave + 
      context.balances.compound + 
      context.balances.moonwell;

    return `
User: ${context.user.wallet_address}
Risk Level: ${context.user.risk_level}
Total Balance: $${this.blockchain.formatUSDC(totalBalance)}

Balances:
  Vault: $${this.blockchain.formatUSDC(context.balances.vault)}
  Aave: $${this.blockchain.formatUSDC(context.balances.aave)}
  Compound: $${this.blockchain.formatUSDC(context.balances.compound)}
  Moonwell: $${this.blockchain.formatUSDC(context.balances.moonwell)}

Market APYs:
  Aave: ${context.market.aave_apy}%
  Compound: ${context.market.compound_apy}%
  Moonwell: ${context.market.moonwell_apy}%

Gas Price: ${Number(context.gas_price) / 1e9} gwei
    `.trim();
  }
}