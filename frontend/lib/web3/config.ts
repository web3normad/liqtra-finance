import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { mainnet, arbitrum, base, baseSepolia, polygon, optimism } from 'wagmi/chains'
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Get your projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined')
}

// Define chains - including Base Sepolia for testing
export const chains = [baseSepolia, base, mainnet, polygon, optimism, arbitrum] as const

// RainbowKit configuration
export const config = getDefaultConfig({
  appName: 'Liqtra Finance',
  projectId,
  chains: chains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})

// Alternative: Custom config if you need more control
/*
export const config = createConfig({
  chains,
  connectors: [
    injected({ 
      shimDisconnect: true,
    }),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: 'Liqtra Finance',
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
  },
})
*/
