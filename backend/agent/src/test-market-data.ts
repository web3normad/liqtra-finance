import { MarketDataService } from './services/market-data.service';

async function testMarketData() {
  console.log('🧪 Testing Market Data Service...\n');

  const marketData = new MarketDataService();

  try {
    // Test 1: Get individual APYs
    console.log('Test 1: Get individual APYs');
    const aaveAPY = await marketData.getAaveAPY();
    console.log(`✅ Aave APY: ${aaveAPY}%`);

    const compoundAPY = await marketData.getCompoundAPY();
    console.log(`✅ Compound APY: ${compoundAPY}%`);

    const moonwellAPY = await marketData.getMoonwellAPY();
    console.log(`✅ Moonwell APY: ${moonwellAPY}%`);

    // Test 2: Get all APYs at once
    console.log('\nTest 2: Get all APYs');
    const allAPYs = await marketData.getAllAPYs();
    console.log('✅ All APYs:', allAPYs);

    // Test 3: Get safety scores
    console.log('\nTest 3: Get safety scores');
    const aaveSafety = await marketData.getProtocolSafetyScore('aave');
    console.log(`✅ Aave safety: ${aaveSafety}`);

    console.log('\n✅ All market data tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMarketData();
