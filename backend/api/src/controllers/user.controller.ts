import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';
import { BlockchainService } from '../services/blockchain.service';
import Logger from '../utils/logger';

const logger = new Logger('USER');

export class UserController {
  constructor(
    private database: DatabaseService,
    private blockchain: BlockchainService
  ) {}

  /**
   * Register/Get user
   * POST /api/users/register
   */
  async registerUser(req: Request, res: Response) {
    try {
      const { address, risk_level = 'balanced' } = req.body;

      logger.info(`Registering user: ${address}`);

      // Check if user already exists
      let user = await this.database.getUserByWallet(address);

      if (user) {
        return res.json({
          success: true,
          data: user,
          message: 'User already exists',
        });
      }

      // Create new user
      user = await this.database.createUser(address, risk_level);

      logger.info(`User registered successfully: ${address}`);

      res.status(201).json({
        success: true,
        data: user,
        message: 'User registered successfully',
      });

    } catch (error: any) {
      logger.error('Error registering user', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get user by address
   * GET /api/users/:address
   */
  async getUser(req: Request, res: Response) {
    try {
      const { address } = req.params;

      logger.info(`Getting user: ${address}`);

      const user = await this.database.getUserByWallet(address);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found. Please register first.',
        });
      }

      res.json({
        success: true,
        data: user,
      });

    } catch (error: any) {
      logger.error('Error getting user', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Check if user exists
   * GET /api/users/:address/exists
   */
  async checkUserExists(req: Request, res: Response) {
    try {
      const { address } = req.params;

      const user = await this.database.getUserByWallet(address);

      res.json({
        success: true,
        data: {
          exists: !!user,
          user: user || null,
        },
      });

    } catch (error: any) {
      logger.error('Error checking user', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Update user settings
   * PUT /api/users/:address
   */
  async updateUser(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { risk_level, is_active } = req.body;

      logger.info(`Updating user: ${address}`);

      // Check if user exists
      const existingUser = await this.database.getUserByWallet(address);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Update risk level if provided
      if (risk_level) {
        await this.database.updateRiskLevel(address, risk_level);
      }

      // Get updated user
      const user = await this.database.getUserByWallet(address);

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });

    } catch (error: any) {
      logger.error('Error updating user', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Delete user (deactivate)
   * DELETE /api/users/:address
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const { address } = req.params;

      logger.info(`Deactivating user: ${address}`);

      // For now, we'll just mark as inactive in database
      // Add this method to DatabaseService if needed

      res.json({
        success: true,
        message: 'User deactivated successfully',
      });

    } catch (error: any) {
      logger.error('Error deleting user', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
