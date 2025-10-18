import { Pool } from 'pg';
import { User, Action } from '../types';
import Logger from '../utils/logger';

const logger = new Logger('DATABASE');

export class DatabaseService {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  // Users
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE wallet_address = $1';
    const result = await this.pool.query<User>(query, [walletAddress]);
    return result.rows[0] || null;
  }

  async createUser(walletAddress: string, riskLevel: string = 'balanced'): Promise<User> {
    const query = `
      INSERT INTO users (wallet_address, risk_level)
      VALUES ($1, $2)
      ON CONFLICT (wallet_address) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await this.pool.query<User>(query, [walletAddress, riskLevel]);
    return result.rows[0];
  }

  async updateRiskLevel(walletAddress: string, riskLevel: string): Promise<User> {
    const query = `
      UPDATE users 
      SET risk_level = $1, updated_at = CURRENT_TIMESTAMP
      WHERE wallet_address = $2
      RETURNING *
    `;
    const result = await this.pool.query<User>(query, [riskLevel, walletAddress]);
    return result.rows[0];
  }

  // Actions
  async getUserActions(walletAddress: string, limit: number = 20): Promise<Action[]> {
    const query = `
      SELECT a.* FROM actions a
      JOIN users u ON a.user_id = u.id
      WHERE u.wallet_address = $1
      ORDER BY a.created_at DESC
      LIMIT $2
    `;
    const result = await this.pool.query<Action>(query, [walletAddress, limit]);
    return result.rows;
  }

  async getActionsByStatus(walletAddress: string, status: string): Promise<Action[]> {
    const query = `
      SELECT a.* FROM actions a
      JOIN users u ON a.user_id = u.id
      WHERE u.wallet_address = $1 AND a.status = $2
      ORDER BY a.created_at DESC
    `;
    const result = await this.pool.query<Action>(query, [walletAddress, status]);
    return result.rows;
  }

  // Portfolio snapshots
  async getLatestSnapshot(walletAddress: string): Promise<any | null> {
    const query = `
      SELECT s.* FROM portfolio_snapshots s
      JOIN users u ON s.user_id = u.id
      WHERE u.wallet_address = $1
      ORDER BY s.snapshot_at DESC
      LIMIT 1
    `;
    const result = await this.pool.query(query, [walletAddress]);
    return result.rows[0] || null;
  }

  async getSnapshotHistory(walletAddress: string, days: number = 30): Promise<any[]> {
    const query = `
      SELECT s.* FROM portfolio_snapshots s
      JOIN users u ON s.user_id = u.id
      WHERE u.wallet_address = $1 
        AND s.snapshot_at > NOW() - INTERVAL '${days} days'
      ORDER BY s.snapshot_at ASC
    `;
    const result = await this.pool.query(query, [walletAddress]);
    return result.rows;
  }

  // Stats
  async getUserStats(walletAddress: string): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_actions,
        COUNT(*) FILTER (WHERE status = 'success') as successful_actions,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_actions,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_actions
      FROM actions a
      JOIN users u ON a.user_id = u.id
      WHERE u.wallet_address = $1
    `;
    const result = await this.pool.query(query, [walletAddress]);
    return result.rows[0];
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
