-- H1 Labs Database Schema
-- PostgreSQL Migration v1
-- Run with: psql h1labs < migrations/001_init.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  address VARCHAR(42) PRIMARY KEY,
  labs_staked NUMERIC(78, 0) DEFAULT 0,
  total_deposits NUMERIC(78, 0) DEFAULT 0,
  total_redemptions NUMERIC(78, 0) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_labs_staked ON users(labs_staked DESC);

-- Labs Table
CREATE TABLE IF NOT EXISTS labs (
  id INTEGER PRIMARY KEY,
  owner_address VARCHAR(42) NOT NULL,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  domain VARCHAR(100) NOT NULL,
  vault_address VARCHAR(42),
  h1_token_address VARCHAR(42),
  bonding_curve_address VARCHAR(42),
  lab_pass_address VARCHAR(42),
  level INTEGER DEFAULT 0,
  slots INTEGER DEFAULT 0,
  total_assets NUMERIC(78, 0) DEFAULT 0,
  h1_price NUMERIC(78, 0) DEFAULT 0,
  total_revenue NUMERIC(78, 0) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_labs_owner ON labs(owner_address);
CREATE INDEX idx_labs_domain ON labs(domain);
CREATE INDEX idx_labs_total_assets ON labs(total_assets DESC);
CREATE INDEX idx_labs_level ON labs(level DESC);
CREATE UNIQUE INDEX idx_labs_vault ON labs(vault_address) WHERE vault_address IS NOT NULL;

-- Events Table (blockchain event log)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  block_number BIGINT NOT NULL,
  transaction_hash VARCHAR(66) NOT NULL,
  log_index INTEGER NOT NULL,
  event_name VARCHAR(50) NOT NULL,
  contract_address VARCHAR(42) NOT NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_block ON events(block_number DESC);
CREATE INDEX idx_events_tx ON events(transaction_hash);
CREATE INDEX idx_events_name ON events(event_name);
CREATE INDEX idx_events_processed ON events(processed) WHERE NOT processed;
CREATE UNIQUE INDEX idx_events_unique ON events(transaction_hash, log_index);

-- Deposits Table
CREATE TABLE IF NOT EXISTS deposits (
  id SERIAL PRIMARY KEY,
  vault_address VARCHAR(42) NOT NULL,
  user_address VARCHAR(42) NOT NULL,
  labs_amount NUMERIC(78, 0) NOT NULL,
  h1_shares NUMERIC(78, 0) NOT NULL,
  transaction_hash VARCHAR(66) NOT NULL,
  block_number BIGINT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deposits_vault ON deposits(vault_address);
CREATE INDEX idx_deposits_user ON deposits(user_address);
CREATE INDEX idx_deposits_timestamp ON deposits(timestamp DESC);

-- Redemptions Table
CREATE TABLE IF NOT EXISTS redemptions (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL,
  vault_address VARCHAR(42) NOT NULL,
  user_address VARCHAR(42) NOT NULL,
  h1_shares NUMERIC(78, 0) NOT NULL,
  labs_amount NUMERIC(78, 0) NOT NULL,
  unlock_time TIMESTAMP NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  transaction_hash VARCHAR(66) NOT NULL,
  claim_tx_hash VARCHAR(66),
  block_number BIGINT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_redemptions_vault ON redemptions(vault_address);
CREATE INDEX idx_redemptions_user ON redemptions(user_address);
CREATE INDEX idx_redemptions_request_id ON redemptions(request_id);
CREATE INDEX idx_redemptions_claimed ON redemptions(claimed);
CREATE INDEX idx_redemptions_unlock_time ON redemptions(unlock_time);

-- Apps Table (app registry)
CREATE TABLE IF NOT EXISTS apps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  developer_address VARCHAR(42) NOT NULL,
  description TEXT,
  icon_url TEXT,
  demo_url TEXT,
  contract_address VARCHAR(42),
  active BOOLEAN DEFAULT TRUE,
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_apps_category ON apps(category);
CREATE INDEX idx_apps_developer ON apps(developer_address);
CREATE INDEX idx_apps_active ON apps(active) WHERE active = TRUE;

-- Lab Apps (junction table for labs <-> apps)
CREATE TABLE IF NOT EXISTS lab_apps (
  lab_id INTEGER NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  app_id INTEGER NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  installed_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (lab_id, app_id)
);

CREATE INDEX idx_lab_apps_lab ON lab_apps(lab_id);
CREATE INDEX idx_lab_apps_app ON lab_apps(app_id);

-- Faucet Claims (testnet only)
CREATE TABLE IF NOT EXISTS faucet_claims (
  id SERIAL PRIMARY KEY,
  address VARCHAR(42) NOT NULL,
  amount NUMERIC(78, 0) NOT NULL,
  transaction_hash VARCHAR(66),
  claimed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faucet_address ON faucet_claims(address);
CREATE INDEX idx_faucet_claimed_at ON faucet_claims(claimed_at DESC);

-- Analytics Cache (for expensive queries)
CREATE TABLE IF NOT EXISTS analytics_cache (
  key VARCHAR(100) PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_expires ON analytics_cache(expires_at);

-- Indexer State (track last processed block)
CREATE TABLE IF NOT EXISTS indexer_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_processed_block BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO indexer_state (id, last_processed_block) VALUES (1, 0) ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_labs_updated_at BEFORE UPDATE ON labs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_redemptions_updated_at BEFORE UPDATE ON redemptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database schema created successfully!' AS status;


