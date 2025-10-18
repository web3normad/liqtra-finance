
import { OpenAIService } from './services/openai.service';
import { PortfolioContext } from './types';

// Helper function to safely stringify BigInts
function stringifyBigInt(obj: any) {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value, 2
  );
}

async function testOpenAI() {
  console.log('🧪 Testing OpenAI Service...\n');

  const openai = new OpenAIService();

  // Create mock context
  const mockContext: PortfolioContext = {
    user: {
      id: 'test-id',
      wallet_address: '0xTestAddress',
      risk_level: 'balanced',
      is_active: true,
    },
    balances: {
      vault: 5000n * 1_000_000n, // $5000
      aave: 0n,
      compound: 0n,
      moonwell: 0n,
    },
    market: {
      aave_apy: 4.2,
      compound_apy: 3.8,
      moonwell_apy: 6.5,
    },
    gas_price: 5n * 1_000_000_000n, // 5 gwei
  };

  try {
    console.log('Test 1: Make decision with mock context');
    console.log('Context:', stringifyBigInt(mockContext)); // ✅ fixed BigInt serialization

    const decision = await openai.makeDecision(mockContext);

    console.log('\n✅ Decision received:');
    console.log(`Action: ${decision.action}`);
    console.log(`Reason: ${decision.reason}`);

    if (decision.action === 'rebalance') {
      console.log(`From: ${decision.from_protocol}`);
      console.log(`To: ${decision.to_protocol}`);
      console.log(`Amount: $${Number(decision.amount) / 1e6}`);
    }

    console.log('\n✅ OpenAI test passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testOpenAI();
