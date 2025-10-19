// Protocol and Staking Types

export interface Protocol {
  id: string
  name: string
  logo: string
  category: 'liquid-staking' | 'lending' | 'dex' | 'yield-aggregator'
  chain: Chain
  tvl: number
  apy: number
  risk: 'low' | 'medium' | 'high'
  verified: boolean
}

export interface StakingPool {
  id: string
  protocol: Protocol
  name: string
  token: Token
  apy: number
  tvl: number
  minStake: number
  lockPeriod?: number // in days
  rewardToken: Token
  fees: {
    deposit: number
    withdrawal: number
    performance: number
  }
}

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logo: string
  price: number
  priceChange24h: number
}

export interface Chain {
  id: number
  name: string
  logo: string
  rpcUrl: string
  explorerUrl: string
}

export interface YieldOpportunity {
  id: string
  protocol: Protocol
  pool: StakingPool
  apy: number
  apyBreakdown: {
    base: number
    rewards: number
    trading?: number
  }
  risk: 'low' | 'medium' | 'high'
  tvl: number
  userDeposits?: number
  trending?: boolean
  featured?: boolean
}
