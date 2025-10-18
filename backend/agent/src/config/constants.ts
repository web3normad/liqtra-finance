import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const IS_TESTNET = process.env.NODE_ENV !== 'production';

export const CONFIG = {
  // Blockchain
  RPC_URL: IS_TESTNET 
    ? (process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org')
    : (process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
  
  AGENT_PRIVATE_KEY: process.env.AGENT_PRIVATE_KEY || '',
  VAULT_ADDRESS: process.env.VAULT_CONTRACT_ADDRESS || '',
  
  // Network info
  IS_TESTNET,
  CHAIN_ID: IS_TESTNET ? 84532 : 8453,
  CHAIN_NAME: IS_TESTNET ? 'Base Sepolia' : 'Base Mainnet',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/floquidity',
  
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // Agent settings
  CYCLE_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
  MIN_APY_DIFFERENCE: 1.5,
  MAX_GAS_PERCENTAGE: 0.5,
  
  // Contracts - ALL CHECKSUMMED
  CONTRACTS: IS_TESTNET ? {
    // BASE SEPOLIA TESTNET
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    AAVE_POOL: '0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b',
    AAVE_DATA_PROVIDER: '0x2d8A3C5677189723C4cB8873CfC9C8976FDF38Ac',
    COMPOUND_COMET: '0xF25212E676D1F7F89Cd72fFEe66158f541246445',
    MOONWELL: '0x0000000000000000000000000000000000000000',
  } : {
    // BASE MAINNET
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    AAVE_POOL: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
    AAVE_DATA_PROVIDER: '0x2d8A3C5677189723C4cB8873CfC9C8976FDF38Ac',
    COMPOUND_COMET: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
    MOONWELL: '0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22',
  },
  
  // Protocol configurations
  PROTOCOLS: IS_TESTNET ? [
    {
      name: 'Aave',
      address: '0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b',
      enabled: true,
      safetyScore: 95,
    },
    {
      name: 'Compound',
      address: '0xF25212E676D1F7F89Cd72fFEe66158f541246445',
      enabled: true,
      safetyScore: 92,
    },
  ] : [
    {
      name: 'Aave',
      address: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
      enabled: true,
      safetyScore: 95,
    },
    {
      name: 'Compound',
      address: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
      enabled: true,
      safetyScore: 92,
    },
    {
      name: 'Moonwell',
      address: '0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22',
      enabled: true,
      safetyScore: 85,
    },
  ],
  
  // Risk level configurations
  RISK_LEVELS: {
    conservative: {
      min_safety_score: 90,
      max_protocols: 2,
      max_allocation_per_protocol: 60,
    },
    balanced: {
      min_safety_score: 80,
      max_protocols: 3,
      max_allocation_per_protocol: 50,
    },
    aggressive: {
      min_safety_score: 70,
      max_protocols: 5,
      max_allocation_per_protocol: 40,
    },
  },
};

// Validate required config
if (!CONFIG.AGENT_PRIVATE_KEY) {
  throw new Error('AGENT_PRIVATE_KEY is required');
}

if (!CONFIG.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}

if (!CONFIG.VAULT_ADDRESS) {
  console.warn('⚠️  VAULT_CONTRACT_ADDRESS not set. Please deploy contract first.');
}

// Log startup config
console.log(`
🚀 Floquidity Agent Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Network: ${CONFIG.CHAIN_NAME}
Chain ID: ${CONFIG.CHAIN_ID}
RPC: ${CONFIG.RPC_URL}
Vault: ${CONFIG.VAULT_ADDRESS || 'NOT SET'}
Agent: ${CONFIG.AGENT_PRIVATE_KEY.slice(0, 6)}...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
