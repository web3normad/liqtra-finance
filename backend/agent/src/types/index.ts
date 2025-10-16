export interface User {
  id: string;
  wallet_address: string;
  risk_level: 'conservative' | 'balanced' | 'aggressive';
  is_active: boolean;
}

export interface PortfolioContext {
  user: User;
  balances: {
    vault: bigint;
    aave: bigint;
    compound: bigint;
    moonwell: bigint;
  };
  market: {
    aave_apy: number;
    compound_apy: number;
    moonwell_apy: number;
  };
  gas_price: bigint;
}

export interface Protocol {
  id: string;
  name: string;
  address: string;
  chain: string;
  is_active: boolean;
  current_apy: number;
  min_safety_score: number;
}

export interface AgentDecision {
  action: 'rebalance' | 'do_nothing' | 'emergency_exit';
  from_protocol?: string;
  to_protocol?: string;
  amount?: bigint;
  reason: string;
}

export interface ActionLog {
  user_id: string;
  action_type: string;
  from_protocol?: string;
  to_protocol?: string;
  amount?: string;
  tx_hash?: string;
  status: 'pending' | 'success' | 'failed';
  reason?: string;
  error_message?: string;
}
