-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    risk_level VARCHAR(20) DEFAULT 'balanced' CHECK (risk_level IN ('conservative', 'balanced', 'aggressive')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent actions table
CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    from_protocol VARCHAR(100),
    to_protocol VARCHAR(100),
    amount DECIMAL(30, 18),
    tx_hash VARCHAR(66),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    reason TEXT,
    gas_used BIGINT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Portfolio snapshots (for tracking performance)
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_balance DECIMAL(30, 18),
    aave_balance DECIMAL(30, 18) DEFAULT 0,
    compound_balance DECIMAL(30, 18) DEFAULT 0,
    moonwell_balance DECIMAL(30, 18) DEFAULT 0,
    other_balance DECIMAL(30, 18) DEFAULT 0,
    weighted_apy DECIMAL(10, 4),
    total_earned DECIMAL(30, 18) DEFAULT 0,
    snapshot_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent logs
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
    message TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Protocol configurations (for agent to know which protocols to use)
CREATE TABLE IF NOT EXISTS protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(42) NOT NULL,
    chain VARCHAR(50) DEFAULT 'base',
    is_active BOOLEAN DEFAULT true,
    min_safety_score INTEGER DEFAULT 80,
    current_apy DECIMAL(10, 4),
    tvl DECIMAL(30, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX idx_actions_user ON actions(user_id);
CREATE INDEX idx_actions_status ON actions(status);
CREATE INDEX idx_actions_created ON actions(created_at DESC);
CREATE INDEX idx_actions_tx_hash ON actions(tx_hash);
CREATE INDEX idx_snapshots_user ON portfolio_snapshots(user_id);
CREATE INDEX idx_snapshots_time ON portfolio_snapshots(snapshot_at DESC);
CREATE INDEX idx_logs_created ON agent_logs(created_at DESC);
CREATE INDEX idx_logs_level ON agent_logs(level);
CREATE INDEX idx_protocols_active ON protocols(is_active) WHERE is_active = true;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default protocols (Base mainnet)
INSERT INTO protocols (name, address, chain, current_apy) VALUES
('Aave', '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5', 'base', 4.5),
('Compound', '0xb125E6687d4313864e53df431d5425969c15Eb2F', 'base', 3.8),
('Moonwell', '0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22', 'base', 5.2)
ON CONFLICT (name) DO NOTHING;
