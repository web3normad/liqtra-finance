export interface User {
  id: string;
  wallet_address: string;
  risk_level: 'conservative' | 'balanced' | 'aggressive';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Action {
  id: string;
  user_id: string;
  action_type: string;
  from_protocol?: string;
  to_protocol?: string;
  amount?: string;
  tx_hash?: string;
  status: 'pending' | 'success' | 'failed';
  reason?: string;
  error_message?: string;
  created_at: Date;
  completed_at?: Date;
}

export interface Portfolio {
  user_address: string;
  total_balance: string;
  vault_balance: string;
  protocol_balances: {
    aave: string;
    compound: string;
    moonwell: string;
  };
  current_apy: number;
  total_earned: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
