// backend/agent/src/safety-test.ts
import { ethers } from 'ethers';
import { CONFIG } from './config/constants';
import Logger from './utils/logger';

const logger = new Logger('SAFETY-TEST');

async function runSafetyTests() {
  console.log('🛡️  Running Safety Tests\n');
  
  // Test 1: RPC Connection
  console.log('Test 1: RPC Connection');
  try {
    const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    const blockNumber = await provider.getBlockNumber();
    console.log('✅ RPC connected, block:', blockNumber);
  } catch (error) {
    console.error('❌ RPC connection failed:', error);
    console.log('⚠️  Cannot use real implementations without RPC');
    return false;
  }
  
  // Test 2: Vault Contract Methods
  console.log('\nTest 2: Vault Contract Methods');
  try {
    const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    const vault = new ethers.Contract(
      CONFIG.VAULT_ADDRESS,
      [
        'function balances(address) view returns (uint256)',
        'function getUserProtocolBalance(address, address) view returns (uint256)',
        'function getUserTotalEarned(address) view returns (uint256)',
      ],
      provider
    );
    
    const testAddr = '0x86E74256beC87d5f542BC9214b708A9dE78e3998';
    
    // Test basic method (should exist)
    await vault.balances(testAddr);
    console.log('✅ balances() exists');
    
    // Test new methods
    try {
      await vault.getUserProtocolBalance(testAddr, CONFIG.CONTRACTS.AAVE_POOL);
      console.log('✅ getUserProtocolBalance() exists');
    } catch {
      console.log('❌ getUserProtocolBalance() missing - need contract update');
    }
    
    try {
      await vault.getUserTotalEarned(testAddr);
      console.log('✅ getUserTotalEarned() exists');
    } catch {
      console.log('❌ getUserTotalEarned() missing - need contract update');
    }
    
  } catch (error) {
    console.error('❌ Vault contract test failed:', error);
  }
  
  // Test 3: Aave Contract
  console.log('\nTest 3: Aave Data Provider');
  try {
    const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    const aaveDP = new ethers.Contract(
      CONFIG.CONTRACTS.AAVE_DATA_PROVIDER,
      ['function getReserveData(address) view returns (uint256[12])'],
      provider
    );
    
    const data = await aaveDP.getReserveData(CONFIG.CONTRACTS.USDC);
    console.log('✅ Can fetch Aave data');
    console.log('   Liquidity Rate:', data[5].toString());
  } catch (error: any) {
    console.error('❌ Aave data fetch failed:', error.message);
    console.log('⚠️  Check AAVE_DATA_PROVIDER address in config');
  }
  
  // Test 4: OpenAI API
  console.log('\nTest 4: OpenAI API');
  if (!CONFIG.OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY not set');
  } else {
    console.log('✅ OPENAI_API_KEY configured');
  }
  
  // Test 5: Database
  console.log('\nTest 5: Database Connection');
  try {
    const { DatabaseService } = await import('./services/database.service');
    const db = new DatabaseService();
    const users = await db.getActiveUsers();
    console.log('✅ Database connected, users:', users.length);
    await db.close();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Safety test complete!');
  console.log('Review results above before updating code.');
}

runSafetyTests();