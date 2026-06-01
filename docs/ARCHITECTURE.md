# JBET Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│ Browser/Mobile │ Next.js Frontend │ React Components │ Redux│
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                            │
├─────────────────────────────────────────────────────────────┤
│ Rate Limiting │ Authentication │ Routing │ Load Balancing  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│ Express.js Server │ Route Handlers │ Middleware │ Socket.io │
└───────────────────���─────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                          │
├─────────────────────────────────────────────────────────────┤
│ Auth Service │ Betting Engine │ Wallet │ Payment │ Analytics│
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│ PostgreSQL │ Redis Cache │ Message Queue │ File Storage     │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── sports/
│   │   ├── live/
│   │   ├── results/
│   │   ├── statistics/
│   │   ├── promotions/
│   │   └── support/
│   ├── (user)/
│   │   ├── dashboard/
│   │   ├── wallet/
│   │   ├── my-bets/
│   │   ├── transactions/
│   │   ├── notifications/
│   │   ├── referrals/
│   │   ├── settings/
│   │   └── profile/
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── deposits/
│   │   ├── withdrawals/
│   │   ├── kyc/
│   │   ├── fixtures/
│   │   ├── odds/
│   │   ├── promotions/
│   │   ├── analytics/
│   │   ├── reports/
│   │   ├── support/
│   │   └── settings/
│   ├── api/
│   └── layout.tsx
│
├── components/
│   ├── shared/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   ├── Betslip.tsx
│   │   ├── Modal.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   └── NotificationCenter.tsx
│   ├── betting/
│   │   ├── MatchCard.tsx
│   │   ├── OddsDisplay.tsx
│   │   ├── BetslipItem.tsx
│   │   └── BettingMarkets.tsx
│   ├── live/
│   │   ├── LiveMatchCard.tsx
│   │   ├── LiveStats.tsx
│   │   ├── Momentum.tsx
│   │   ├── LiveTimeline.tsx
│   │   └── GoalAnimation.tsx
│   ├── admin/
│   │   ├── UserTable.tsx
│   │   ├── AnalyticsChart.tsx
│   │   ├── ApprovalForm.tsx
│   │   ├── OddsManager.tsx
│   │   └── PromotionManager.tsx
│   └── wallet/
│       ├── BalanceCard.tsx
│       ├── DepositForm.tsx
│       ├── WithdrawalForm.tsx
│       └── TransactionHistory.tsx
│
├── features/
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── hooks/
│   │   └── services/
│   ├── betting/
│   │   ├── bettingSlice.ts
│   │   ├── hooks/
│   │   └── services/
│   ├── wallet/
│   │   ├── walletSlice.ts
│   │   ├── hooks/
│   │   └── services/
│   ├── live/
│   │   ├── liveSlice.ts
│   │   └── services/
│   └── admin/
│       ├── adminSlice.ts
│       └── services/
│
├── hooks/
│   ├── useAuth.ts
│   ├── useBetting.ts
│   ├── useWallet.ts
│   ├── useLive.ts
│   └── useApi.ts
│
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── betting.ts
│   ├── wallet.ts
│   ├── payments.ts
│   └── socket.ts
│
├── store/
│   ├── store.ts
│   └── rootReducer.ts
│
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── animations.css
│
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validators.ts
│   ├── formatters.ts
│   └── storage.ts
│
├── types/
│   ├── index.ts
│   ├── api.ts
│   ├── betting.ts
│   └── user.ts
│
└── config/
    ├── env.ts
    └── axios.ts
```

---

## Backend Architecture

### Directory Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── bettingController.ts
│   │   ├── walletController.ts
│   │   ├── userController.ts
│   │   ├── adminController.ts
│   │   ├── paymentsController.ts
│   │   └── analyticsController.ts
│   │
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── betting.ts
│   │   ├── wallet.ts
│   │   ├── users.ts
│   │   ├── admin.ts
│   │   ├── payments.ts
│   │   ├── support.ts
│   │   └── index.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── logger.ts
│   │   ├── cors.ts
│   │   └── requestParser.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Bet.ts
│   │   ├── Match.ts
│   │   ├── Wallet.ts
│   │   ├── Transaction.ts
│   │   ├── Promotion.ts
│   │   ├── Referral.ts
│   │   ├── AdminLog.ts
│   │   ├── SupportTicket.ts
│   │   └── KYC.ts
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   ├── bettingService.ts
│   │   ├── walletService.ts
│   │   ├── userService.ts
│   │   ├── paymentService.ts
│   │   ├── notificationService.ts
│   │   ├── analyticsService.ts
│   │   ├── referralService.ts
│   │   ├── kycService.ts
│   │   └── emailService.ts
│   │
│   ├── sockets/
│   │   ├── handlers/
│   │   │   ├── liveOddsHandler.ts
│   │   │   ├── matchUpdateHandler.ts
│   │   │   ├── notificationHandler.ts
│   │   │   └── betslipHandler.ts
│   │   ├── events.ts
│   │   └── index.ts
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── env.ts
│   │   ├── payment.ts
│   │   └── email.ts
│   │
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   ├── jwt.ts
│   │   ├── hashing.ts
│   │   ├── formatters.ts
│   │   ├── errors.ts
│   │   └── logger.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── express.d.ts
│   │   ├── api.ts
│   │   └── models.ts
│   │
│   ├── migrations/
│   │   ├── 001_create_users.ts
│   │   ├── 002_create_bets.ts
│   │   ├── 003_create_wallets.ts
│   │   ├── 004_create_transactions.ts
│   │   └── 005_create_matches.ts
│   │
│   ├── seeds/
│   │   ├── users.ts
│   │   ├── matches.ts
│   │   └── sports.ts
│   │
│   └── app.ts
│
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

---

## State Management

### Redux Store Structure

```typescript
store: {
  auth: {
    user: User | null,
    token: string | null,
    refreshToken: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  
  betting: {
    betslip: Bet[],
    matches: Match[],
    selectedMarket: string | null,
    odds: { [key: string]: number },
    loading: boolean,
    error: string | null
  },
  
  wallet: {
    balance: number,
    bonusBalance: number,
    transactions: Transaction[],
    loading: boolean,
    error: string | null
  },
  
  live: {
    liveMatches: LiveMatch[],
    selectedMatch: LiveMatch | null,
    liveStats: LiveStats[],
    timeline: TimelineEvent[],
    loading: boolean
  },
  
  admin: {
    users: User[],
    deposits: Deposit[],
    withdrawals: Withdrawal[],
    kycs: KYC[],
    analytics: Analytics,
    loading: boolean
  },
  
  notifications: {
    items: Notification[],
    unread: number
  }
}
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/verify-otp
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Betting

```
GET    /api/betting/matches
GET    /api/betting/matches/:id
GET    /api/betting/live
POST   /api/betting/place-bet
GET    /api/betting/my-bets
GET    /api/betting/bet/:id
POST   /api/betting/cash-out/:betId
POST   /api/betting/share-bet/:betId
```

### Wallet

```
GET    /api/wallet/balance
POST   /api/wallet/deposit
POST   /api/wallet/withdraw
GET    /api/wallet/transactions
GET    /api/wallet/bonuses
POST   /api/wallet/bonus/claim
```

### User

```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/change-password
POST   /api/users/verify-email
GET    /api/users/notifications
POST   /api/users/notifications/mark-read
GET    /api/users/referrals
```

### Admin

```
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
POST   /api/admin/deposits/approve
POST   /api/admin/withdrawals/approve
POST   /api/admin/kyc/verify
POST   /api/admin/fixtures
PUT    /api/admin/odds/:fixtureId
GET    /api/admin/analytics
```

---

## WebSocket Events

### Client to Server

```
socket.emit('live:subscribe', { matchId })
socket.emit('live:unsubscribe', { matchId })
socket.emit('betslip:update', { bets })
socket.emit('notification:subscribe', {})
```

### Server to Client

```
socket.on('live:odds-update', { matchId, odds })
socket.on('live:match-update', { matchId, data })
socket.on('live:goal', { matchId, team, player })
socket.on('notification:new', { notification })
socket.on('betslip:odds-changed', { bets })
```

---

## Authentication Flow

```
User Input (Email/Password)
         ↓
Validation
         ↓
Check User Exists
         ↓
Hash Password Comparison
         ↓
Generate JWT + Refresh Token
         ↓
Store Refresh Token in Redis
         ↓
Return Tokens to Client
         ↓
Client Stores in Memory/Storage
         ↓
Include JWT in All API Requests
         ↓
Verify Token Middleware
         ↓
On Expiry: Use Refresh Token
         ↓
Generate New JWT
```

---

## Caching Strategy

### Redis Keys Pattern

```
user:{userId}
user:{userId}:settings
user:{userId}:wallet
user:{userId}:bets
match:{matchId}
match:{matchId}:odds
match:{matchId}:stats
live:{matchId}:timeline
promotion:{promotionId}
analytics:{period}
```

### Cache Invalidation

- User profile: Invalidate on update
- Match odds: Real-time updates via WebSocket
- User bets: Cache for 30 seconds
- Promotions: Cache for 1 hour
- Analytics: Cache for 5 minutes

---

## Security Layers

1. **Authentication**: JWT + Refresh Tokens
2. **Authorization**: Role-based access control
3. **Input Validation**: All API inputs validated
4. **Rate Limiting**: Per-user and per-IP limits
5. **HTTPS Only**: All communications encrypted
6. **CORS**: Configured for specific domains
7. **Audit Logging**: All admin actions logged
8. **SQL Injection Prevention**: Parameterized queries
9. **XSS Protection**: Content Security Policy
10. **CSRF Protection**: CSRF tokens on state-changing operations

---

## Performance Optimization

- Database indexing on frequently queried columns
- Redis caching for read-heavy operations
- API response compression
- Image optimization and lazy loading
- Code splitting and tree shaking
- Database query optimization
- Connection pooling
- CDN for static assets
