import { BlockchainService } from './services/blockchain.service';
import { DatabaseService } from './services/database.service';
import { MarketDataService } from './services/market-data.service';
import { OpenAIService } from './services/openai.service';
import { PerceptionModule } from './modules/perception';
import { DecisionModule } from './modules/decision';
import { ExecutionModule } from './modules/execution';

async function testAgentCycle() {
  console.log('🧪 Testing Full Agent Cycle...\n');

  // Initialize services
  const blockchain = new BlockchainService();
  const database = new DatabaseService();
  const marketData = new MarketDataService();
  const openai = new OpenAIService();

  // Initialize modules
  const perception = new PerceptionModule(blockchain, marketData, database);
  const decision = new DecisionModule(openai, blockchain);
  const execution = new ExecutionModule(blockchain, database, decision);

  try {
    // Get a test user
    console.log('Step 1: Get test user');
    const users = await database.getActiveUsers();
    
    if (users.length === 0) {
      console.log('❌ No users found. Create one first:');
      console.log('docker exec -it floquidity-db psql -U postgres -d floquidity');
      console.log("INSERT INTO users (wallet_address, risk_level) VALUES ('0xYourAddress', 'balanced');");
      return;
    }

    const user = users[0];
    console.log(`✅ Using user: ${user.wallet_address}`);

    // PERCEIVE
    console.log('\nStep 2: PERCEIVE');
    const context = await perception.perceive(user);
    console.log(perception.getSummary(context));

    // DECIDE
    console.log('\nStep 3: DECIDE');
    const agentDecision = await decision.decide(context);
    console.log(`Decision: ${agentDecision.action}`);
    console.log(`Reason: ${agentDecision.reason}`);

    // EXECUTE (only if not do_nothing)
    if (agentDecision.action !== 'do_nothing') {
      console.log('\nStep 4: EXECUTE');
      console.log('⚠️  SKIPPING EXECUTION (test mode)');
      console.log('To actually execute, uncomment the line below:');
      console.log('// const success = await execution.execute(user, agentDecision);');
    }

    console.log('\n✅ Full cycle test passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await database.close();
  }
}

testAgentCycle();
