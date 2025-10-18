import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';
import { BlockchainService } from '../services/blockchain.service';
import { Portfolio } from '../types';
import Logger from '../utils/logger';

const logger = new Logger('PORTFOLIO');

export class PortfolioController {
  constructor(
    private database: DatabaseService,
    private blockchain: BlockchainService
  ) {}

  async getPortfolio(req: Request, res: Response) {
    try {
      const { address } = req.params;
      logger.info(`Getting portfolio for ${address}`);

      // Get user from database
      const user = await this.database.getUserByWallet(address);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Get vault balance from blockchain
      const vaultBalance = await this.blockchain.getVaultBalance(address);

      // Get latest snapshot
      const snapshot = await this.database.getLatestSnapshot(address);

      const portfolio: Portfolio = {
        user_address: address,
        total_balance: this.blockchain.formatUSDC(vaultBalance),
        vault_balance: this.blockchain.formatUSDC(vaultBalance),
        protocol_balances: {
          aave: snapshot?.aave_balance || '0',
          compound: snapshot?.compound_balance || '0',
          moonwell: snapshot?.moonwell_balance || '0',
        },
        current_apy: snapshot?.weighted_apy || 0,
        total_earned: snapshot?.total_earned || '0',
      };

      res.json({
        success: true,
        data: portfolio,
      });

    } catch (error: any) {
      logger.error('Error getting portfolio', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getPortfolioHistory(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const days = parseInt(req.query.days as string) || 30;

      logger.info(`Getting portfolio history for ${address} (${days} days)`);

      const history = await this.database.getSnapshotHistory(address, days);

      res.json({
        success: true,
        data: history,
      });

    } catch (error: any) {
      logger.error('Error getting portfolio history', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateRiskLevel(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { risk_level } = req.body;

      logger.info(`Updating risk level for ${address} to ${risk_level}`);

      const user = await this.database.updateRiskLevel(address, risk_level);

      res.json({
        success: true,
        data: user,
        message: 'Risk level updated successfully',
      });

    } catch (error: any) {
      logger.error('Error updating risk level', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
