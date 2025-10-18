import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';
import { BlockchainService } from '../services/blockchain.service';
import Logger from '../utils/logger';

const logger = new Logger('TRANSACTION');

export class TransactionController {
  constructor(
    private database: DatabaseService,
    private blockchain: BlockchainService
  ) {}

  /**
   * Get user's USDC balance (in wallet)
   * GET /api/transactions/:address/balance
   */
  async getBalance(req: Request, res: Response) {
    try {
      const { address } = req.params;

      logger.info(`Getting balance for ${address}`);

      const [usdcBalance, vaultBalance, allowance] = await Promise.all([
        this.blockchain.getUSDCBalance(address),
        this.blockchain.getVaultBalance(address),
        this.blockchain.getUSDCAllowance(address),
      ]);

      res.json({
        success: true,
        data: {
          wallet_usdc: this.blockchain.formatUSDC(usdcBalance),
          vault_balance: this.blockchain.formatUSDC(vaultBalance),
          allowance: this.blockchain.formatUSDC(allowance),
          needs_approval: allowance === 0n,
        },
      });

    } catch (error: any) {
      logger.error('Error getting balance', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Build approve transaction
   * POST /api/transactions/approve
   * Body: { address, amount }
   */
  async buildApprove(req: Request, res: Response) {
    try {
      const { address, amount } = req.body;

      logger.info(`Building approve transaction for ${address}: ${amount} USDC`);

      const amountBigInt = this.blockchain.parseUSDC(amount);
      const tx = await this.blockchain.buildApproveTransaction(address, amountBigInt);

      res.json({
        success: true,
        data: {
          transaction: tx,
          description: `Approve ${amount} USDC for vault`,
          usdc_address: this.blockchain.getUSDCAddress(),
          vault_address: this.blockchain.getVaultAddress(),
        },
      });

    } catch (error: any) {
      logger.error('Error building approve transaction', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Build deposit transaction
   * POST /api/transactions/deposit
   * Body: { address, amount }
   */
  async buildDeposit(req: Request, res: Response) {
    try {
      const { address, amount } = req.body;

      logger.info(`Building deposit transaction for ${address}: ${amount} USDC`);

      // Check if user has enough balance
      const usdcBalance = await this.blockchain.getUSDCBalance(address);
      const amountBigInt = this.blockchain.parseUSDC(amount);

      if (usdcBalance < amountBigInt) {
        return res.status(400).json({
          success: false,
          error: `Insufficient balance. Have ${this.blockchain.formatUSDC(usdcBalance)}, need ${amount}`,
        });
      }

      // Check if user has approved vault
      const allowance = await this.blockchain.getUSDCAllowance(address);
      if (allowance < amountBigInt) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient allowance. Please approve USDC first.',
          needs_approval: true,
          current_allowance: this.blockchain.formatUSDC(allowance),
          required_amount: amount,
        });
      }

      const tx = await this.blockchain.buildDepositTransaction(address, amountBigInt);

      res.json({
        success: true,
        data: {
          transaction: tx,
          description: `Deposit ${amount} USDC to vault`,
          amount_usdc: amount,
        },
      });

    } catch (error: any) {
      logger.error('Error building deposit transaction', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Build withdraw transaction
   * POST /api/transactions/withdraw
   * Body: { address, amount }
   */
  async buildWithdraw(req: Request, res: Response) {
    try {
      const { address, amount } = req.body;

      logger.info(`Building withdraw transaction for ${address}: ${amount} USDC`);

      // Check if user has enough in vault
      const vaultBalance = await this.blockchain.getVaultBalance(address);
      const amountBigInt = this.blockchain.parseUSDC(amount);

      if (vaultBalance < amountBigInt) {
        return res.status(400).json({
          success: false,
          error: `Insufficient vault balance. Have ${this.blockchain.formatUSDC(vaultBalance)}, requested ${amount}`,
        });
      }

      const tx = await this.blockchain.buildWithdrawTransaction(address, amountBigInt);

      res.json({
        success: true,
        data: {
          transaction: tx,
          description: `Withdraw ${amount} USDC from vault`,
          amount_usdc: amount,
        },
      });

    } catch (error: any) {
      logger.error('Error building withdraw transaction', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get contract addresses
   * GET /api/transactions/contracts
   */
  async getContracts(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: {
          vault: this.blockchain.getVaultAddress(),
          usdc: this.blockchain.getUSDCAddress(),
        },
      });
    } catch (error: any) {
      logger.error('Error getting contracts', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
