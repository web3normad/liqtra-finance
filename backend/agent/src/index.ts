import { BlockchainService } from './services/blockchain.service';
import { DatabaseService } from './services/database.service';
import { MarketDataService } from './services/market-data.service';
import { OpenAIService } from './services/openai.service';
import { PerceptionModule } from './modules/perception';
import { DecisionModule } from './modules/decision';
import { ExecutionModule } from './modules/execution';
import { CONFIG } from './config/constants';
import Logger from './utils/logger';

const logger = new Logger('MAIN');

class FloquidityAgent {
  private blockchain: BlockchainService;
  private database: DatabaseService;
  private marketData: MarketDataService;
  private openai: OpenAIService;
  
  private perception: PerceptionModule;
  private decision: DecisionModule;
  private execution: ExecutionModule;

  private isRunning: boolean = false;

  constructor() {
    // Initialize services
    this.blockchain = new BlockchainService();
    this.database = new DatabaseService();
    this.marketData = new MarketDataService();
    this.openai = new OpenAIService();

    // Initialize modules
    this.perception = new PerceptionModule(
      this.blockchain,
      this.marketData,
      this.database
    );
    
    this.decision = new DecisionModule(
      this.openai,
      this.blockchain
    );
    
    this.execution = new ExecutionModule(
      this.blockchain,
      this.database,
      this.decision
    );

    logger.info('🤖 Floquidity Agent initialized');
  }

  /**
   * Run one complete cycle for a single user
   */
  async runCycle(userId: string): Promise<void> {
    try {
      logger.info(`\n${'='.repeat(60)}`);
      logger.info(`Starting cycle for user: ${userId}`);
      logger.info('='.repeat(60));

      // Get user from database
      const users = await this.database.getActiveUsers();
      const user = users.find(u => u.id === userId);

      if (!user) {
        logger.warn(`User not found: ${userId}`);
        return;
      }

      // 1. PERCEIVE - Gather information
      logger.info('📊 PERCEIVE: Gathering data...');
      const context = await this.perception.perceive(user);
      logger.info(this.perception.getSummary(context));

      // Check if actionable
      if (!this.perception.isActionable(context)) {
        logger.info('⏭️  Skipping: Balance too low for action');
        return;
      }

      // 2. DECIDE - AI makes decision
      logger.info('🤔 DECIDE: AI analyzing...');
      const decision = await this.decision.decide(context);
      logger.info(`Decision: ${decision.action}`);
      logger.info(`Reason: ${decision.reason}`);

      if (decision.action !== 'do_nothing') {
        logger.info(`From: ${decision.from_protocol || 'vault'}`);
        logger.info(`To: ${decision.to_protocol || 'N/A'}`);
        if (decision.amount) {
          logger.info(`Amount: $${this.blockchain.formatUSDC(decision.amount)}`);
        }
      }

      // 3. EXECUTE - Carry out decision
      logger.info('⚡ EXECUTE: Performing action...');
      const success = await this.execution.execute(user, decision);

      if (success) {
        logger.info('✅ Cycle completed successfully');
      } else {
        logger.error('❌ Cycle failed');
      }

      logger.info('='.repeat(60) + '\n');

    } catch (error) {
      logger.error('Cycle error', { userId, error });
    }
  }

  /**
   * Run agent for all active users
   */
  async runForAllUsers(): Promise<void> {
    try {
      const users = await this.database.getActiveUsers();
      
      if (users.length === 0) {
        logger.warn('No active users found');
        return;
      }

      logger.info(`Running cycle for ${users.length} user(s)`);

      for (const user of users) {
        await this.runCycle(user.id);
        
        // Small delay between users
        await this.sleep(2000);
      }

    } catch (error) {
      logger.error('Error running for all users', error);
    }
  }

  /**
   * Start the agent loop (runs forever)
   */
  async start(): Promise<void> {
    this.isRunning = true;

    logger.info(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           🤖 FLOQUIDITY AGENT STARTED 🤖                   ║
║                                                            ║
║  Network: ${CONFIG.CHAIN_NAME.padEnd(44)} ║
║  Cycle Interval: ${(CONFIG.CYCLE_INTERVAL_MS / 1000 / 60).toFixed(0)} minutes${' '.repeat(37)}║
║  Vault: ${CONFIG.VAULT_ADDRESS.slice(0, 20)}...${' '.repeat(20)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);

    while (this.isRunning) {
      try {
        await this.runForAllUsers();
        
        const nextRun = new Date(Date.now() + CONFIG.CYCLE_INTERVAL_MS);
        logger.info(`⏰ Next cycle at: ${nextRun.toLocaleString()}`);
        logger.info(`💤 Sleeping for ${CONFIG.CYCLE_INTERVAL_MS / 1000 / 60} minutes...\n`);
        
        await this.sleep(CONFIG.CYCLE_INTERVAL_MS);

      } catch (error) {
        logger.error('Agent loop error', error);
        logger.info('⏳ Retrying in 1 minute...');
        await this.sleep(60000);
      }
    }
  }

  /**
   * Stop the agent
   */
  stop(): void {
    logger.info('🛑 Stopping agent...');
    this.isRunning = false;
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    logger.info('🔄 Shutting down gracefully...');
    this.stop();
    await this.database.close();
    logger.info('👋 Agent stopped');
    process.exit(0);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================
// START THE AGENT
// ============================================

const agent = new FloquidityAgent();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('\n📡 Received SIGINT signal');
  await agent.shutdown();
});

process.on('SIGTERM', async () => {
  logger.info('\n📡 Received SIGTERM signal');
  await agent.shutdown();
});

// Start the agent
agent.start().catch(error => {
  logger.error('Fatal error', error);
  process.exit(1);
});
