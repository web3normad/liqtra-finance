import { baseSepolia } from 'wagmi/chains';

export const CONTRACTS = {
  // Base Sepolia Testnet
  [baseSepolia.id]: {
    vault: (process.env.NEXT_PUBLIC_VAULT_CONTRACT || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    usdc: (process.env.NEXT_PUBLIC_USDC_CONTRACT || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  },
  // Add more chains as needed
} as const;

export const getVaultAddress = (chainId: number): `0x${string}` => {
  return CONTRACTS[chainId as keyof typeof CONTRACTS]?.vault || '0x0000000000000000000000000000000000000000' as `0x${string}`;
};

export const getUSDCAddress = (chainId: number): `0x${string}` => {
  return CONTRACTS[chainId as keyof typeof CONTRACTS]?.usdc || '0x0000000000000000000000000000000000000000' as `0x${string}`;
};
