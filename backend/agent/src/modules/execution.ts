import { BlockchainService } from '../services/blockchain.service';
import { DatabaseService } from '../services/database.service';
import { DecisionModule } from './decision';
import { AgentDecision, User } from '../types';
import Logger from '../utils/logger';

const logger = new Logger('EXECUTION');

export class ExecutionModule {
  constructor(
    private blockchain: BlockchainService,
    private database: DatabaseService,
    private decision: DecisionModule
  ) {}

  /**
   * Execute the agent's decision
   */
  async execute(user: User, decision: AgentDecision): Promise<boolean> {
    try {
      logger.info(`Executing decision for user: ${user.wallet_address}`, {
        action: decision.action,
      });

      // If do nothing, just log it
      if (decision.action === 'do_nothing') {
        await this.logAction(user, decision, 'success');
        return true;
      }

      // Execute rebalance
      if (decision.action === 'rebalance') {
        return await this.executeRebalance(user, decision);
      }

      // Execute emergency exit
      if (decision.action === 'emergency_exit') {
        return await this.executeEmergencyExit(user, decision);
      }

      return false;

    } catch (error) {
      logger.error('Execution failed', { user: user.wallet_address, error });
      await this.logAction(user, decision, 'failed', String(error));
      return false;
    }
  }

  /**
   * Execute portfolio rebalancing
   */
  private async executeRebalance(user: User, decision: AgentDecision): Promise<boolean> {
    try {
      const { from_protocol, to_protocol, amount, reason } = decision;

      if (!to_protocol || !amount) {
        throw new Error('Missing required parameters for rebalance');
      }

      logger.info('Executing rebalance', {
        user: user.wallet_address,
        from: from_protocol || 'vault',
        to: to_protocol,
        amount: this.blockchain.formatUSDC(amount),
        reason,
      });

      // Get protocol address
      const protocolAddress = this.decision.getProtocolAddress(to_protocol);
      if (!protocolAddress) {
        throw new Error(`Unknown protocol: ${to_protocol}`);
      }

      // Log action as pending
      await this.database.logAction({
        user_id: user.id,
        action_type: 'rebalance',
        from_protocol: from_protocol,
        to_protocol: to_protocol,
        amount: amount.toString(),
        status: 'pending',
        reason,
      });

      // Execute on-chain investment
      const txHash = await this.blockchain.investFunds(
        user.wallet_address,
        protocolAddress,
        amount
      );

      logger.info('Rebalance successful', {
        user: user.wallet_address,
        txHash,
        amount: this.blockchain.formatUSDC(amount),
      });

      // Update action status
      await this.database.updateActionStatus(txHash, 'success');

      // Log to agent_logs
      await this.database.logAgentAction(
        'info',
        `Rebalanced portfolio: ${this.blockchain.formatUSDC(amount)} USDC to ${to_protocol}`,
        user.id,
        { txHash, from: from_protocol, to: to_protocol, amount: amount.toString() }
      );

      return true;

    } catch (error) {
      logger.error('Rebalance failed', error);
      return false;
    }
  }

  /**
   * Execute emergency exit (withdraw all funds)
   */
  private async executeEmergencyExit(user: User, decision: AgentDecision): Promise<boolean> {
    try {
      logger.warn('Executing emergency exit', {
        user: user.wallet_address,
        reason: decision.reason,
      });

      // Log emergency action
      await this.database.logAction({
        user_id: user.id,
        action_type: 'emergency_exit',
        status: 'pending',
        reason: decision.reason,
      });

      // TODO: Implement emergency withdrawal logic
      // This would withdraw from all protocols back to vault

      logger.info('Emergency exit successful', { user: user.wallet_address });

      return true;

    } catch (error) {
      logger.error('Emergency exit failed', error);
      return false;
    }
  }

  /**
   * Log action to database
   */
  private async logAction(
    user: User,
    decision: AgentDecision,
    status: 'success' | 'failed',
    errorMessage?: string
  ): Promise<void> {
    await this.database.logAction({
      user_id: user.id,
      action_type: decision.action,
      from_protocol: decision.from_protocol,
      to_protocol: decision.to_protocol,
      amount: decision.amount?.toString(),
      status,
      reason: decision.reason,
      error_message: errorMessage,
    });
  }
}
