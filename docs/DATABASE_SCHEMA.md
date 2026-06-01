# JBET Database Schema

## Database Overview

PostgreSQL relational database with 15+ core tables and support tables for a complete sportsbook platform.

---

## Core Tables

### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(255),
  date_of_birth DATE,
  gender VARCHAR(10),
  country VARCHAR(100),
  state VARCHAR(100),
  city VARCHAR(100),
  address VARCHAR(255),
  postal_code VARCHAR(20),
  
  -- Account Status
  status ENUM('active', 'inactive', 'suspended', 'verified', 'unverified') DEFAULT 'unverified',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  kyc_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  kyc_level INTEGER DEFAULT 0,
  
  -- Security
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret VARCHAR(255),
  last_login TIMESTAMP,
  last_login_ip VARCHAR(45),
  password_changed_at TIMESTAMP,
  
  -- Preferences
  preferred_currency VARCHAR(3) DEFAULT 'NGN',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50),
  receive_notifications BOOLEAN DEFAULT TRUE,
  receive_emails BOOLEAN DEFAULT TRUE,
  receive_sms BOOLEAN DEFAULT TRUE,
  
  -- Fraud Detection
  fraud_score INTEGER DEFAULT 0,
  account_age_days INTEGER,
  
  -- Metadata
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
```

### wallets

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Balances
  balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance >= 0),
  bonus_balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (bonus_balance >= 0),
  total_deposited DECIMAL(15, 2) DEFAULT 0.00,
  total_withdrawn DECIMAL(15, 2) DEFAULT 0.00,
  
  -- Betting Activity
  total_wagered DECIMAL(15, 2) DEFAULT 0.00,
  total_won DECIMAL(15, 2) DEFAULT 0.00,
  total_lost DECIMAL(15, 2) DEFAULT 0.00,
  
  -- Status
  is_locked BOOLEAN DEFAULT FALSE,
  lock_reason VARCHAR(255),
  lock_until TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
```

### transactions

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction Details
  type ENUM('deposit', 'withdrawal', 'bet_placed', 'bet_won', 'refund', 'bonus', 'manual_adjustment') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  
  -- Payment Details
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50),
  reference_number VARCHAR(255) UNIQUE,
  external_reference VARCHAR(255),
  
  -- Status
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  
  -- Financial Details
  fee DECIMAL(15, 2) DEFAULT 0.00,
  net_amount DECIMAL(15, 2),
  
  -- Metadata
  description TEXT,
  related_bet_id UUID REFERENCES bets(id),
  ip_address VARCHAR(45),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

### bets

```sql
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Bet Details
  type ENUM('single', 'multi', 'system') DEFAULT 'single',
  status ENUM('pending', 'won', 'lost', 'cancelled', 'void') DEFAULT 'pending',
  
  -- Amount
  stake DECIMAL(15, 2) NOT NULL,
  odds DECIMAL(10, 4) NOT NULL,
  potential_winning DECIMAL(15, 2),
  actual_winning DECIMAL(15, 2),
  
  -- Booking Code
  booking_code VARCHAR(20) UNIQUE,
  booking_code_image_url VARCHAR(255),
  
  -- Betting Details
  number_of_selections INTEGER DEFAULT 1,
  number_of_legs INTEGER DEFAULT 1,
  
  -- Status
  is_cashed_out BOOLEAN DEFAULT FALSE,
  cashout_amount DECIMAL(15, 2),
  cashout_at TIMESTAMP,
  
  settled_at TIMESTAMP,
  settlement_note TEXT,
  
  -- Metadata
  device_type VARCHAR(20),
  ip_address VARCHAR(45),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_bets_created_at ON bets(created_at);
```

### bet_selections

```sql
CREATE TABLE bet_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bet_id UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
  
  match_id UUID NOT NULL REFERENCES matches(id),
  market_type VARCHAR(50) NOT NULL,
  selection VARCHAR(100) NOT NULL,
  odds DECIMAL(10, 4) NOT NULL,
  
  -- Status
  status ENUM('pending', 'won', 'lost', 'void') DEFAULT 'pending',
  result VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bet_selections_bet_id ON bet_selections(bet_id);
CREATE INDEX idx_bet_selections_match_id ON bet_selections(match_id);
```

### matches

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Match Details
  sport VARCHAR(50) NOT NULL,
  league VARCHAR(100) NOT NULL,
  
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team_id UUID NOT NULL REFERENCES teams(id),
  
  match_date TIMESTAMP NOT NULL,
  venue VARCHAR(255),
  
  -- Match Status
  status ENUM('scheduled', 'live', 'completed', 'postponed', 'cancelled') DEFAULT 'scheduled',
  
  -- Scores
  home_score INTEGER,
  away_score INTEGER,
  
  -- Other Details
  season VARCHAR(10),
  round INTEGER,
  referee VARCHAR(100),
  attendance INTEGER,
  
  -- Metadata
  external_id VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_match_date ON matches(match_date);
CREATE INDEX idx_matches_sport ON matches(sport);
```

### teams

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL UNIQUE,
  short_name VARCHAR(10),
  country VARCHAR(100),
  league VARCHAR(100),
  
  logo_url VARCHAR(255),
  founded_year INTEGER,
  
  -- Statistics
  total_matches INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_draws INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_teams_league ON teams(league);
```

### odds

```sql
CREATE TABLE odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  
  market_type VARCHAR(50) NOT NULL,
  selection VARCHAR(100) NOT NULL,
  odds_value DECIMAL(10, 4) NOT NULL,
  
  -- Odds Status
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  
  -- Risk Management
  volume_wagered DECIMAL(15, 2) DEFAULT 0.00,
  liability DECIMAL(15, 2) DEFAULT 0.00,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_odds_match_id ON odds(match_id);
CREATE INDEX idx_odds_market_type ON odds(market_type);
```

### match_statistics

```sql
CREATE TABLE match_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  
  -- Home Team Stats
  home_possession INTEGER,
  home_shots INTEGER,
  home_shots_on_target INTEGER,
  home_corners INTEGER,
  home_fouls INTEGER,
  home_yellow_cards INTEGER,
  home_red_cards INTEGER,
  
  -- Away Team Stats
  away_possession INTEGER,
  away_shots INTEGER,
  away_shots_on_target INTEGER,
  away_corners INTEGER,
  away_fouls INTEGER,
  away_yellow_cards INTEGER,
  away_red_cards INTEGER,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_match_statistics_match_id ON match_statistics(match_id);
```

### promotions

```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Promotion Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  promo_code VARCHAR(50) UNIQUE,
  
  type ENUM('welcome', 'deposit', 'free_bet', 'cashback', 'reload', 'vip', 'referral') NOT NULL,
  
  -- Amounts
  bonus_amount DECIMAL(15, 2),
  bonus_percentage DECIMAL(5, 2),
  min_deposit DECIMAL(15, 2),
  max_bonus DECIMAL(15, 2),
  
  -- Conditions
  wagering_requirement INTEGER,
  eligible_markets TEXT,
  min_odds DECIMAL(5, 2),
  
  -- Timeline
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  
  -- Limits
  max_uses_per_user INTEGER,
  total_uses_limit INTEGER,
  current_uses INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promotions_promo_code ON promotions(promo_code);
CREATE INDEX idx_promotions_is_active ON promotions(is_active);
```

### user_promotions

```sql
CREATE TABLE user_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  
  times_used INTEGER DEFAULT 0,
  bonus_received DECIMAL(15, 2),
  is_claimed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, promotion_id)
);

CREATE INDEX idx_user_promotions_user_id ON user_promotions(user_id);
```

### referrals

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  referral_code VARCHAR(20),
  
  -- Earnings
  commission_earned DECIMAL(15, 2) DEFAULT 0.00,
  bonus_amount DECIMAL(15, 2) DEFAULT 0.00,
  
  -- Status
  status ENUM('pending', 'qualified', 'completed') DEFAULT 'pending',
  qualified_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(referrer_id, referred_user_id)
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_user_id ON referrals(referred_user_id);
```

### kyc_verification

```sql
CREATE TABLE kyc_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- KYC Level
  kyc_level INTEGER DEFAULT 1,
  
  -- Documents
  id_document_type VARCHAR(50),
  id_document_url VARCHAR(255),
  id_document_verified BOOLEAN DEFAULT FALSE,
  
  address_document_url VARCHAR(255),
  address_document_verified BOOLEAN DEFAULT FALSE,
  
  selfie_url VARCHAR(255),
  selfie_verified BOOLEAN DEFAULT FALSE,
  
  -- Status
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  
  -- Verification
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kyc_verification_user_id ON kyc_verification(user_id);
CREATE INDEX idx_kyc_verification_status ON kyc_verification(status);
```

### support_tickets

```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Ticket Details
  category VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Status
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  
  -- Assignment
  assigned_to UUID REFERENCES users(id),
  
  -- Metadata
  attachment_url VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
```

### support_ticket_messages

```sql
CREATE TABLE support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  
  message TEXT NOT NULL,
  attachment_url VARCHAR(255),
  
  is_admin_response BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_support_ticket_messages_ticket_id ON support_ticket_messages(ticket_id);
```

### notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  type VARCHAR(50),
  related_id VARCHAR(100),
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### admin_logs

```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id),
  
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);
```

---

## Views

### user_betting_stats

```sql
CREATE VIEW user_betting_stats AS
SELECT
  u.id,
  u.username,
  COUNT(b.id) as total_bets,
  SUM(CASE WHEN b.status = 'won' THEN 1 ELSE 0 END) as won_bets,
  SUM(CASE WHEN b.status = 'lost' THEN 1 ELSE 0 END) as lost_bets,
  SUM(b.stake) as total_wagered,
  SUM(CASE WHEN b.status = 'won' THEN b.actual_winning ELSE 0 END) as total_won,
  AVG(b.odds) as avg_odds
FROM users u
LEFT JOIN bets b ON u.id = b.user_id
GROUP BY u.id, u.username;
```

### daily_revenue

```sql
CREATE VIEW daily_revenue AS
SELECT
  DATE(t.created_at) as date,
  SUM(CASE WHEN t.type = 'deposit' THEN t.amount ELSE 0 END) as total_deposits,
  SUM(CASE WHEN t.type IN ('bet_won', 'refund') THEN t.amount ELSE 0 END) as total_payouts,
  SUM(CASE WHEN t.type = 'bet_placed' THEN t.amount ELSE 0 END) as total_wagered
FROM transactions t
WHERE t.status = 'completed'
GROUP BY DATE(t.created_at);
```

---

## Indexes Summary

- User lookups: email, username, status
- Wallet lookups: user_id
- Transaction queries: user_id, type, status, created_at
- Bet queries: user_id, status, created_at
- Match queries: status, match_date, sport
- KYC queries: user_id, status
- Admin logs: admin_id, created_at
- Notifications: user_id, is_read

