import { BlockchainService } from '../services/blockchain.service';
import { DatabaseService } from '../services/database.service';
import { DecisionModule } from './decision';
import { AgentDecision, User } from '../types';
import Logger from '../utils/logger';
import { CONFIG } from '../config/constants';

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
     logger.warn('🚨 EXECUTING EMERGENCY EXIT', {
       user: user.wallet_address,
       reason: decision.reason,
     });
 
     // Log emergency action as pending
     await this.database.logAction({
       user_id: user.id,
       action_type: 'emergency_exit',
       status: 'pending',
       reason: decision.reason,
     });
 
     // Get all protocol balances
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
 
     const withdrawals: Promise<string>[] = [];
     const withdrawalDetails: any[] = [];
 
     // Withdraw from Aave if balance exists
     if (aaveBalance > 0n) {
       logger.info('Withdrawing from Aave', {
         amount: this.blockchain.formatUSDC(aaveBalance)
       });
       
       withdrawals.push(
         this.blockchain.withdrawFromProtocol(
           user.wallet_address,
           CONFIG.CONTRACTS.AAVE_POOL,
           aaveBalance
         )
       );
       
       withdrawalDetails.push({
         protocol: 'aave',
         amount: aaveBalance.toString(),
       });
     }
 
     // Withdraw from Compound if balance exists
     if (compoundBalance > 0n) {
       logger.info('Withdrawing from Compound', {
         amount: this.blockchain.formatUSDC(compoundBalance)
       });
       
       withdrawals.push(
         this.blockchain.withdrawFromProtocol(
           user.wallet_address,
           CONFIG.CONTRACTS.COMPOUND_COMET,
           compoundBalance
         )
       );
       
       withdrawalDetails.push({
         protocol: 'compound',
         amount: compoundBalance.toString(),
       });
     }
 
     // Withdraw from Moonwell if balance exists
     if (moonwellBalance > 0n) {
       logger.info('Withdrawing from Moonwell', {
         amount: this.blockchain.formatUSDC(moonwellBalance)
       });
       
       withdrawals.push(
         this.blockchain.withdrawFromProtocol(
           user.wallet_address,
           CONFIG.CONTRACTS.MOONWELL,
           moonwellBalance
         )
       );
       
       withdrawalDetails.push({
         protocol: 'moonwell',
         amount: moonwellBalance.toString(),
       });
     }
 
     // Check if there's anything to withdraw
     if (withdrawals.length === 0) {
       logger.info('No funds in protocols to withdraw');
       
       await this.database.logAction({
         user_id: user.id,
         action_type: 'emergency_exit',
         status: 'success',
         reason: 'No funds in protocols',
       });
       
       return true;
     }
 
     // Execute all withdrawals in parallel
     logger.info(`Executing ${withdrawals.length} withdrawal transaction(s)...`);
     const txHashes = await Promise.all(withdrawals);
 
     // Log each successful withdrawal
     for (let i = 0; i < txHashes.length; i++) {
       const txHash = txHashes[i];
       const detail = withdrawalDetails[i];
       
       logger.info('Emergency withdrawal successful', { 
         protocol: detail.protocol,
         amount: this.blockchain.formatUSDC(BigInt(detail.amount)),
         txHash
       });
 
       // Update action status
       await this.database.updateActionStatus(txHash, 'success');
       
       // Log to agent logs
       await this.database.logAgentAction(
         'warn',
         `Emergency withdrawal from ${detail.protocol}`,
         user.id,
         { 
           txHash, 
           protocol: detail.protocol,
           amount: detail.amount 
         }
       );
     }
 
     logger.info('✅ Emergency exit completed', { 
       user: user.wallet_address,
       withdrawals: withdrawals.length,
       transactions: txHashes
     });
 
     return true;
 
   } catch (error: any) {
     logger.error('❌ Emergency exit failed', { 
       user: user.wallet_address,
       error: error.message 
     });
     
     // Log failure
     await this.database.logAction({
       user_id: user.id,
       action_type: 'emergency_exit',
       status: 'failed',
       reason: decision.reason,
       error_message: error.message,
     });
     
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
