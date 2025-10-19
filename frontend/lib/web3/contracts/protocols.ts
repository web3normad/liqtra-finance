/**
 * DeFi Protocol Contract Addresses on Base Sepolia Testnet
 * 
 * Note: Base Sepolia may not have all mainnet protocols.
 * We'll use available testnet contracts and fallback to mock addresses for demo.
 */

export interface ProtocolConfig {
  name: string;
  poolAddress: `0x${string}`;
  tokenAddress: `0x${string}`; // aToken/cToken address
  apy: number;
  risk: 'low' | 'medium' | 'high';
  category: 'lending' | 'liquid-staking' | 'yield';
  enabled: boolean;
}

// Base Sepolia Chain ID
export const BASE_SEPOLIA_CHAIN_ID = 84532;

/**
 * Protocol addresses on Base Sepolia
 * These are placeholder addresses - in production, use actual deployed protocol contracts
 */
export const PROTOCOL_CONFIGS: Record<string, ProtocolConfig> = {
  // Aave V3 on Base Sepolia (if available)
  aave: {
    name: 'Aave',
    poolAddress: '0x0000000000000000000000000000000000000001', // Placeholder
    tokenAddress: '0x0000000000000000000000000000000000000002', // aUSDC
    apy: 5.2,
    risk: 'low',
    category: 'lending',
    enabled: true,
  },
  
  // Compound V3 on Base Sepolia (if available)
  compound: {
    name: 'Compound',
    poolAddress: '0x0000000000000000000000000000000000000003', // Placeholder
    tokenAddress: '0x0000000000000000000000000000000000000004', // cUSDC
    apy: 4.8,
    risk: 'low',
    category: 'lending',
    enabled: true,
  },
  
  // Additional protocols
  morpho: {
    name: 'Morpho',
    poolAddress: '0x0000000000000000000000000000000000000005',
    tokenAddress: '0x0000000000000000000000000000000000000006',
    apy: 6.1,
    risk: 'medium',
    category: 'lending',
    enabled: true,
  },
  
  yearn: {
    name: 'Yearn',
    poolAddress: '0x0000000000000000000000000000000000000007',
    tokenAddress: '0x0000000000000000000000000000000000000008',
    apy: 7.3,
    risk: 'medium',
    category: 'yield',
    enabled: true,
  },
  
  curve: {
    name: 'Curve',
    poolAddress: '0x0000000000000000000000000000000000000009',
    tokenAddress: '0x000000000000000000000000000000000000000a',
    apy: 5.5,
    risk: 'low',
    category: 'yield',
    enabled: true,
  },
  
  beefy: {
    name: 'Beefy',
    poolAddress: '0x000000000000000000000000000000000000000b',
    tokenAddress: '0x000000000000000000000000000000000000000c',
    apy: 8.2,
    risk: 'medium',
    category: 'yield',
    enabled: true,
  },
};

/**
 * Get protocol configuration by name
 */
export function getProtocolConfig(protocolName: string): ProtocolConfig | undefined {
  const key = protocolName.toLowerCase();
  return PROTOCOL_CONFIGS[key];
}

/**
 * Get all enabled protocols
 */
export function getEnabledProtocols(): ProtocolConfig[] {
  return Object.values(PROTOCOL_CONFIGS).filter(p => p.enabled);
}

/**
 * Get protocols by risk level
 */
export function getProtocolsByRisk(risk: 'low' | 'medium' | 'high'): ProtocolConfig[] {
  return Object.values(PROTOCOL_CONFIGS).filter(
    p => p.enabled && p.risk === risk
  );
}

/**
 * Calculate APY-based earnings
 * This simulates real-time earnings calculation
 */
export function calculateEarnings(
  amount: number,
  apy: number,
  startTime: number
): number {
  const now = Date.now();
  const timeElapsed = now - startTime; // milliseconds
  const daysElapsed = timeElapsed / (1000 * 60 * 60 * 24);
  
  // Annual yield: amount * (apy / 100)
  // Daily yield: annual / 365
  // Earnings: daily * daysElapsed
  const annualYield = amount * (apy / 100);
  const dailyYield = annualYield / 365;
  const earnings = dailyYield * daysElapsed;
  
  return Math.max(0, earnings);
}

/**
 * Mock protocol ABIs (simplified)
 * In production, import actual ABIs from protocol packages
 */
export const PROTOCOL_ABIS = {
  // Aave Pool ABI (simplified)
  aave: [
    {
      inputs: [
        { name: 'asset', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'onBehalfOf', type: 'address' },
        { name: 'referralCode', type: 'uint16' }
      ],
      name: 'supply',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { name: 'asset', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'to', type: 'address' }
      ],
      name: 'withdraw',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ],
  
  // Compound Comet ABI (simplified)
  compound: [
    {
      inputs: [
        { name: 'asset', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      name: 'supply',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { name: 'asset', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      name: 'withdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ]
} as const;
