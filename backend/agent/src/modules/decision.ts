import { OpenAIService } from '../services/openai.service';
import { BlockchainService } from '../services/blockchain.service';
import { CONFIG } from '../config/constants';
import { PortfolioContext, AgentDecision } from '../types';
import Logger from '../utils/logger';

const logger = new Logger('DECISION');

export class DecisionModule {
  constructor(
    private openai: OpenAIService,
    private blockchain: BlockchainService
  ) {}

  /**
   * Make a decision based on perceived context
   */
  async decide(context: PortfolioContext): Promise<AgentDecision> {
    try {
      logger.info(`Making decision for user: ${context.user.wallet_address}`);

      // Pre-flight checks
      const preflight = await this.preflightChecks(context);
      if (!preflight.canProceed) {
        return {
          action: 'do_nothing',
          reason: preflight.reason,
        };
      }

      // Ask AI to make decision
      const decision = await this.openai.makeDecision(context);

      // Validate AI decision
      const validated = await this.validateDecision(decision, context);

      logger.info('Decision made', {
        user: context.user.wallet_address,
        action: validated.action,
        reason: validated.reason,
      });

      return validated;

    } catch (error) {
      logger.error('Decision failed', { user: context.user.wallet_address, error });
      return {
        action: 'do_nothing',
        reason: 'Error making decision',
      };
    }
  }

  /**
   * Pre-flight checks before making decision
   */
  private async preflightChecks(context: PortfolioContext): Promise<{
    canProceed: boolean;
    reason: string;
  }> {
    // Check 1: Minimum balance
    const minBalance = 100n * 1_000_000n; // $100
    if (context.balances.vault < minBalance) {
      return {
        canProceed: false,
        reason: `Balance too low: $${this.blockchain.formatUSDC(context.balances.vault)}`,
      };
    }

    // Check 2: Gas price too high
    const maxGasPrice = 50n * 1_000_000_000n; // 50 gwei
    if (context.gas_price > maxGasPrice) {
      return {
        canProceed: false,
        reason: `Gas price too high: ${Number(context.gas_price) / 1e9} gwei`,
      };
    }

    // Check 3: APY difference too small
    const apys = [context.market.aave_apy, context.market.compound_apy, context.market.moonwell_apy];
    const maxAPY = Math.max(...apys);
    const minAPY = Math.min(...apys.filter(a => a > 0));
    const difference = maxAPY - minAPY;

    if (difference < CONFIG.MIN_APY_DIFFERENCE) {
      return {
        canProceed: false,
        reason: `APY difference too small: ${difference.toFixed(2)}%`,
      };
    }

    // Check 4: Agent has enough ETH for gas
    const agentBalance = await this.blockchain.getAgentBalance();
    const minAgentBalance = 10n ** 16n; // 0.01 ETH in wei
    // 0.01 ETH
    if (agentBalance < minAgentBalance) {
      return {
        canProceed: false,
        reason: `Agent balance too low: ${Number(agentBalance) / 1e18} ETH`,
      };
    }

    return { canProceed: true, reason: 'All checks passed' };
  }

  /**
   * Validate AI decision
   */
  private async validateDecision(
    decision: AgentDecision,
    context: PortfolioContext
  ): Promise<AgentDecision> {
    // If do nothing, pass through
    if (decision.action === 'do_nothing') {
      return decision;
    }

    // Validate rebalance decision
    if (decision.action === 'rebalance') {
      // Check amount is not more than vault balance
      if (decision.amount && decision.amount > context.balances.vault) {
        logger.warn('AI suggested amount exceeds balance, adjusting');
        decision.amount = context.balances.vault;
      }

      // Check gas cost vs amount
      const gasCost = await this.blockchain.estimateGasCost(decision.amount!);
      const gasCostUSD = Number(gasCost) / 1e18 * 2000; // Rough ETH price
      const amountUSD = Number(decision.amount!) / 1e6;
      const gasCostPercentage = (gasCostUSD / amountUSD) * 100;

      if (gasCostPercentage > CONFIG.MAX_GAS_PERCENTAGE) {
        return {
          action: 'do_nothing',
          reason: `Gas cost too high: ${gasCostPercentage.toFixed(2)}% of amount`,
        };
      }

      // Check protocols are enabled
      const enabledProtocols = CONFIG.PROTOCOLS.filter(p => p.enabled).map(p => p.name.toLowerCase());
      
      if (decision.to_protocol && !enabledProtocols.includes(decision.to_protocol)) {
        return {
          action: 'do_nothing',
          reason: `Target protocol not enabled: ${decision.to_protocol}`,
        };
      }
    }

    return decision;
  }

  /**
   * Get protocol address by name
   */
  getProtocolAddress(protocolName: string): string {
    const protocol = CONFIG.PROTOCOLS.find(
      p => p.name.toLowerCase() === protocolName.toLowerCase()
    );
    return protocol?.address || '';
  }
}
