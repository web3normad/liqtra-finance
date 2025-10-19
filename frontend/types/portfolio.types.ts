// Portfolio and Position Types

export interface Portfolio {
  totalValue: number
  totalValueChange24h: number
  totalValueChangePercent24h: number
  totalEarnings: number
  activePositions: number
  chains: Chain[]
  allocation: AllocationData[]
}

export interface AllocationData {
  protocol: string
  value: number
  percentage: number
  color: string
}

export interface Position {
  id: string
  protocol: string
  protocolLogo: string
  pool: string
  token: string
  tokenLogo: string
  chain: string
  chainLogo: string
  amount: number
  value: number
  apy: number
  earned: number
  earnedUSD: number
  startDate: Date
  status: 'active' | 'pending' | 'unstaking'
  risk: 'low' | 'medium' | 'high'
  autoCompound: boolean
  nextReward?: Date
}

export interface PortfolioMetrics {
  totalValue: number
  dailyChange: number
  dailyChangePercent: number
  weeklyChange: number
  weeklyChangePercent: number
  monthlyChange: number
  monthlyChangePercent: number
  allTimeEarnings: number
  avgApy: number
  riskScore: number
}

export interface HistoricalData {
  timestamp: number
  value: number
  earnings?: number
}

export interface Chain {
  id: number
  name: string
  logo: string
}
