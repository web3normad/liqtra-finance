import { Pool, QueryResult } from 'pg';
import { CONFIG } from '../config/constants';
import { User, Protocol, ActionLog } from '../types';
import Logger from '../utils/logger';

const logger = new Logger('DATABASE');

export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: CONFIG.DATABASE_URL,
    });

    // Test connection
    this.testConnection();
  }

  private async testConnection() {
    try {
      const result = await this.pool.query('SELECT NOW()');
      logger.info('Database connected successfully', { time: result.rows[0].now });
    } catch (error) {
      logger.error('Database connection failed', error);
      throw error;
    }
  }

  // Users
  async getActiveUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE is_active = true';
    const result: QueryResult<User> = await this.pool.query(query);
    return result.rows;
  }

  async getUser(walletAddress: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE wallet_address = $1';
    const result: QueryResult<User> = await this.pool.query(query, [walletAddress]);
    return result.rows[0] || null;
  }

  async createUser(walletAddress: string, riskLevel: string = 'balanced'): Promise<User> {
    const query = `
      INSERT INTO users (wallet_address, risk_level)
      VALUES ($1, $2)
      ON CONFLICT (wallet_address) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result: QueryResult<User> = await this.pool.query(query, [walletAddress, riskLevel]);
    return result.rows[0];
  }

  // Protocols
  async getActiveProtocols(): Promise<Protocol[]> {
    const query = 'SELECT * FROM protocols WHERE is_active = true';
    const result: QueryResult<Protocol> = await this.pool.query(query);
    return result.rows;
  }

  async updateProtocolAPY(name: string, apy: number): Promise<void> {
    const query = `
      UPDATE protocols 
      SET current_apy = $1, last_updated = CURRENT_TIMESTAMP
      WHERE name = $2
    `;
    await this.pool.query(query, [apy, name]);
  }

  // Actions
  async logAction(action: ActionLog): Promise<void> {
    const query = `
      INSERT INTO actions (
        user_id, action_type, from_protocol, to_protocol, 
        amount, tx_hash, status, reason, error_message
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await this.pool.query(query, [
      action.user_id,
      action.action_type,
      action.from_protocol,
      action.to_protocol,
      action.amount,
      action.tx_hash,
      action.status,
      action.reason,
      action.error_message,
    ]);
  }

  async updateActionStatus(txHash: string, status: 'success' | 'failed', errorMessage?: string): Promise<void> {
    const query = `
      UPDATE actions 
      SET status = $1, error_message = $2, completed_at = CURRENT_TIMESTAMP
      WHERE tx_hash = $3
    `;
    await this.pool.query(query, [status, errorMessage, txHash]);
  }

  async getRecentActions(userId: string, limit: number = 10): Promise<any[]> {
    const query = `
      SELECT * FROM actions 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await this.pool.query(query, [userId, limit]);
    return result.rows;
  }

  // Portfolio snapshots
  async createSnapshot(userId: string, balances: any, apy: number): Promise<void> {
    const query = `
      INSERT INTO portfolio_snapshots (
        user_id, total_balance, aave_balance, compound_balance, 
        moonwell_balance, weighted_apy
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await this.pool.query(query, [
      userId,
      balances.total,
      balances.aave,
      balances.compound,
      balances.moonwell,
      apy,
    ]);
  }

  // Agent logs
  async logAgentAction(level: string, message: string, userId?: string, metadata?: any): Promise<void> {
    const query = `
      INSERT INTO agent_logs (level, message, user_id, metadata)
      VALUES ($1, $2, $3, $4)
    `;
    await this.pool.query(query, [level, message, userId, JSON.stringify(metadata)]);
  }

  // Cleanup
  async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database connection closed');
  }
}
