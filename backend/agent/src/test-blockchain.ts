import { BlockchainService } from './services/blockchain.service';

async function testBlockchain() {
  console.log('🧪 Testing Blockchain Service...\n');

  const blockchain = new BlockchainService();

  try {
    // Test 1: Get agent balance
    console.log('Test 1: Get agent balance');
    const balance = await blockchain.getAgentBalance();
    console.log(`✅ Agent balance: ${Number(balance) / 1e18} ETH`);

    // Test 2: Get gas price
    console.log('\nTest 2: Get gas price');
    const gasPrice = await blockchain.getGasPrice();
    console.log(`✅ Gas price: ${Number(gasPrice) / 1e9} gwei`);

    // Test 3: Read from vault (use actual deployed address)
    const testUser = '0x86E74256beC87d5f542BC9214b708A9dE78e3998'; 
    
    console.log('\nTest 3: Get user vault balance');
    const vaultBalance = await blockchain.getUserVaultBalance(testUser);
    console.log(`✅ Vault balance: $${blockchain.formatUSDC(vaultBalance)}`);

    // Test 4: Get risk level
    console.log('\nTest 4: Get user risk level');
    const riskLevel = await blockchain.getUserRiskLevel(testUser);
    console.log(`✅ Risk level: ${riskLevel}`);

    // Test 5: Format/parse utilities
    console.log('\nTest 5: Format/parse utilities');
    const amount = blockchain.parseUSDC('1000.50');
    console.log(`✅ Parsed: ${amount}`);
    console.log(`✅ Formatted back: $${blockchain.formatUSDC(amount)}`);

    console.log('\n✅ All blockchain tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBlockchain();
