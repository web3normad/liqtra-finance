/**
 * Smart Contract Addresses - Base Sepolia Testnet
 * 
 * Deployed on: October 19, 2025
 * Network: Base Sepolia (Chain ID: 84532)
 * RPC: https://sepolia.base.org
 * Explorer: https://sepolia.basescan.org
 */

export const DEPLOYED_CONTRACTS = {
  // LiqtraVault - Main vault contract for deposits/withdrawals
  VAULT: {
    address: '0x8962C42bFE1f011194f6DF329500D1b34b9844d1' as const,
    deployed: '2025-10-19',
    txHash: '0xd772241866a8d1b37e2b6cc1a2fe1935d058cd80c3853928dbecc5047ef5c36b',
    blockNumber: 32546239,
    verified: true,
    explorerUrl: 'https://sepolia.basescan.org/address/0x8962C42bFE1f011194f6DF329500D1b34b9844d1',
  },

  // Circle USDC - Official stablecoin on Base
  USDC: {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    official: true,
    faucet: 'https://faucet.circle.com/',
    explorerUrl: 'https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  },
} as const;

/**
 * Vault Contract Functions
 * 
 * Read Functions:
 * - balances(address) → uint256 - Get user balance in vault
 * - getUserBalance(address) → uint256 - Alternative balance getter
 * - userRiskLevel(address) → uint8 - Get user's risk preference (0=Conservative, 1=Moderate, 2=Aggressive)
 * - USDC() → address - Get USDC token address
 * - getVaultBalance() → uint256 - Get total vault balance
 * - getTotalDeposited() → uint256 - Get total deposits across all users
 * - MIN_DEPOSIT() → uint256 - Minimum deposit amount (1 USDC = 1e6)
 * 
 * Write Functions:
 * - deposit(uint256 amount) - Deposit USDC to vault (requires approval)
 * - withdraw(uint256 amount) - Withdraw USDC from vault
 * - withdrawAll() - Withdraw all funds from vault
 * - setRiskLevel(uint8 level) - Set risk preference (0-2)
 * - emergencyWithdraw() - Emergency withdrawal of all funds
 * 
 * Admin Functions (Owner only):
 * - updateUserBalance(address user, uint256 newBalance) - Update balance after yield
 * - transferForYield(address to, uint256 amount) - Transfer to DeFi protocols
 * 
 * Events:
 * - Deposit(address indexed user, uint256 amount)
 * - Withdrawal(address indexed user, uint256 amount)
 * - RiskLevelUpdated(address indexed user, uint8 oldLevel, uint8 newLevel)
 * - EmergencyWithdraw(address indexed user, uint256 amount)
 */

export const NETWORK_CONFIG = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  explorerUrl: 'https://sepolia.basescan.org',
  faucets: [
    {
      name: 'Alchemy Faucet',
      url: 'https://www.alchemy.com/faucets/base-sepolia',
      provides: 'Base Sepolia ETH',
    },
    {
      name: 'Circle Faucet',
      url: 'https://faucet.circle.com/',
      provides: 'USDC',
    },
  ],
} as const;

export const RISK_LEVELS = {
  CONSERVATIVE: {
    level: 0,
    name: 'Conservative',
    description: 'Lower risk, stable returns',
    expectedApy: '3-5%',
    icon: '🛡️',
  },
  MODERATE: {
    level: 1,
    name: 'Moderate',
    description: 'Balanced risk and reward',
    expectedApy: '5-10%',
    icon: '⚖️',
  },
  AGGRESSIVE: {
    level: 2,
    name: 'Aggressive',
    description: 'Higher risk, maximum returns',
    expectedApy: '10-20%',
    icon: '🚀',
  },
} as const;

export const MIN_DEPOSIT_USDC = 1; // Minimum 1 USDC
export const USDC_DECIMALS = 6;
