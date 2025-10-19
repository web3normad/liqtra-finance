/**
 * Real Token & Protocol Logos
 * 
 * Using Trust Wallet assets for reliable, self-hosted alternative
 * CoinGecko API is too slow, using Trust Wallet's GitHub CDN instead
 */

export const TOKEN_LOGOS = {
  // Major Cryptocurrencies
  ETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  BTC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
  USDC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  USDT: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  DAI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  WETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  WBTC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  
  // Staking Tokens
  stETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84/logo.png',
  rETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xae78736Cd615f374D3085123A210448E74Fc6393/logo.png',
  cbETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  
  // Stablecoins
  BUSD: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4Fabb145d64652a948d72533023f6E7A623C7C53/logo.png',
  FRAX: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png',
  
  // DeFi Tokens
  AAVE: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
  COMP: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png',
  UNI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  SUSHI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
  CRV: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png',
  MKR: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
  SNX: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
  
  // Layer 2 Tokens
  MATIC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
  ARB: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  OP: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
}

export const PROTOCOL_LOGOS = {
  // Lending Protocols
  Aave: 'https://cryptologos.cc/logos/aave-aave-logo.png',
  Compound: 'https://cryptologos.cc/logos/compound-comp-logo.png',
  MakerDAO: 'https://cryptologos.cc/logos/maker-mkr-logo.png',
  
  // Staking Protocols
  Lido: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png',
  'Rocket Pool': 'https://cryptologos.cc/logos/rocket-pool-rpl-logo.png',
  'Coinbase Staking': 'https://cryptologos.cc/logos/coinbase-coin-logo.png',
  Frax: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png',
  StakeWise: 'https://cryptologos.cc/logos/stakewise-swise-logo.png',
  
  // DEXes
  Uniswap: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
  'Uniswap V3': 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
  SushiSwap: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
  Curve: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
  Balancer: 'https://cryptologos.cc/logos/balancer-bal-logo.png',
  
  // Yield Aggregators
  Yearn: 'https://cryptologos.cc/logos/yearn-finance-yfi-logo.png',
  Convex: 'https://cryptologos.cc/logos/convex-finance-cvx-logo.png',
  
  // Other DeFi
  Synthetix: 'https://cryptologos.cc/logos/synthetix-snx-logo.png',
  '1inch': 'https://cryptologos.cc/logos/1inch-1inch-logo.png',
}

export const CHAIN_LOGOS = {
  Ethereum: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  Polygon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
  Arbitrum: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  Optimism: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
  Base: 'https://cryptologos.cc/logos/coinbase-coin-logo.png',
  Avalanche: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png',
  BSC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png',
  Fantom: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
}

// Helper function to get logo URL with fallback
export function getTokenLogo(symbol: string): string {
  return TOKEN_LOGOS[symbol as keyof typeof TOKEN_LOGOS] || TOKEN_LOGOS.ETH
}

export function getProtocolLogo(name: string): string {
  return PROTOCOL_LOGOS[name as keyof typeof PROTOCOL_LOGOS] || TOKEN_LOGOS.ETH
}

export function getChainLogo(name: string): string {
  return CHAIN_LOGOS[name as keyof typeof CHAIN_LOGOS] || CHAIN_LOGOS.Ethereum
}
