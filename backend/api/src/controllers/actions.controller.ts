import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';
import Logger from '../utils/logger';

const logger = new Logger('ACTIONS');

export class ActionsController {
  constructor(private database: DatabaseService) {}

  async getActions(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      logger.info(`Getting actions for ${address} (limit: ${limit})`);

      const actions = await this.database.getUserActions(address, limit);

      res.json({
        success: true,
        data: actions,
      });

    } catch (error: any) {
      logger.error('Error getting actions', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getActionsByStatus(req: Request, res: Response) {
    try {
      const { address, status } = req.params;

      logger.info(`Getting ${status} actions for ${address}`);

      const actions = await this.database.getActionsByStatus(address, status);

      res.json({
        success: true,
        data: actions,
      });

    } catch (error: any) {
      logger.error('Error getting actions by status', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const { address } = req.params;

      logger.info(`Getting stats for ${address}`);

      const stats = await this.database.getUserStats(address);

      res.json({
        success: true,
        data: stats,
      });

    } catch (error: any) {
      logger.error('Error getting stats', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
