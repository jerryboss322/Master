# JBET - Modern Sportsbook Platform

Modern Sportsbook Platform Built for Scale

---

## Overview

JBET is a modern sportsbook platform designed to provide a premium betting experience across desktop and mobile devices.

The platform combines:

* Sports betting
* Live betting
* Virtual sports
* Wallet management
* User accounts
* Promotions
* Referral systems
* Analytics
* Administrative controls

The goal is to create a scalable sportsbook architecture capable of supporting thousands of users while maintaining high performance, security, and excellent user experience.

---

## Project Vision

JBET aims to become a premium sportsbook platform that rivals industry leaders through:

* Fast performance
* Modern UI/UX
* Real-time betting
* Mobile-first design
* Advanced analytics
* Professional administration tools

---

## Key Features

### Sports Betting

* Match Winner
* Double Chance
* Over/Under
* Handicap
* Both Teams To Score
* Correct Score
* Corners
* Cards
* First Goal Scorer
* Half-Time / Full-Time

### Live Betting

* Real-time odds
* Live statistics
* Match timeline
* Live commentary
* Momentum graphs
* Goal notifications
* Dynamic market updates

### Wallet System

* Deposits
* Withdrawals
* Bonus Wallet
* Transaction History
* Betting History
* Referral Earnings

### User Features

* Authentication
* Profile Management
* Betting History
* Notifications
* Favorites
* Referral Program
* Settings

### Admin Features

* User Management
* Deposit Management
* Withdrawal Management
* KYC Verification
* Odds Management
* Fixture Management
* Promotions
* Analytics
* Revenue Monitoring
* Support Tickets

---

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* Framer Motion

### Backend

* Node.js
* Express.js
* Socket.io

### Database

* PostgreSQL

### Cache Layer

* Redis

### Authentication

* JWT
* Refresh Tokens
* OTP Verification

### Payments

* Paystack
* Flutterwave
* Monnify

### Deployment

* Docker
* Nginx
* Coolify
* Vercel

---

## Design System

### Colors

```css
Primary: #16a34a;
Accent: #f97316;
Background: #0f172a;
Surface: #111827;
Card: #1e293b;
Text: #f8fafc;
Muted: #94a3b8;
```

---

## Project Structure

```
jbet/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── services/
│   ├── hooks/
│   ├── store/
│   └── styles/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── sockets/
│   └── config/
│
├── admin/
│
├── shared/
│
└── docker/
```

---

## Pages

### Public

* Home
* Sports
* Live Betting
* Results
* Statistics
* Promotions
* Support

### User

* Dashboard
* Wallet
* My Bets
* Transactions
* Notifications
* Referrals
* Settings
* Profile

### Admin

* Dashboard
* Users
* Deposits
* Withdrawals
* KYC
* Fixtures
* Odds Management
* Promotions
* Analytics
* Reports
* Support Tickets

---

## Security Features

* JWT Authentication
* Refresh Tokens
* Password Hashing
* Rate Limiting
* Session Management
* Audit Logs
* Role Permissions
* Fraud Detection Architecture
* OTP Verification

---

## Performance Features

* Lazy Loading
* Image Optimization
* Code Splitting
* Redis Caching
* WebSocket Updates
* Skeleton Loading States
* Optimized Queries

---

## Development Roadmap

### Phase 1: Foundation

* Authentication
* Homepage
* Match Cards
* Betslip
* Wallet UI
* Responsive Layout

### Phase 2: Features

* API Integrations
* Live Betting
* Admin Dashboard
* Payments
* Statistics

### Phase 3: Advanced Features

* Analytics
* AI Prediction Engine
* Referral System
* Push Notifications
* Advanced Promotions

### Phase 4: Expansion

* Mobile App
* Virtual Sports Expansion
* Casino Expansion
* Advanced Risk Management
* Automated Odds Engine

---

## Future Goals

* Native Mobile Apps
* AI Betting Assistant
* AI Risk Analysis
* AI Fraud Detection
* Real-Time Trading Engine
* Multi-Country Support
* Multi-Language Support

---

## Development Principles

All code should be:

* Scalable
* Maintainable
* Modular
* Secure
* Responsive
* Production Ready

Every feature must prioritize:

* User Experience
* Performance
* Security
* Reliability
* Clean Architecture

---

## Documentation

For detailed documentation, see:

* [Roadmap](./docs/ROADMAP.md)
* [Architecture](./docs/ARCHITECTURE.md)
* [Admin Panel](./docs/ADMIN_PANEL.md)
* [API Integrations](./docs/API_INTEGRATIONS.md)
* [Database Schema](./docs/DATABASE_SCHEMA.md)

---

## License

Private Project - All rights reserved.

---

# MASTER AI REBUILD PROMPT

Use this prompt when giving the project to an AI coding agent such as ChatGPT, Claude Code, Cursor, Windsurf, Bolt, Lovable, Cline, Roo Code, or Devin.

---

## AI Instructions

You are a Senior Full-Stack Engineer, Senior UI/UX Designer, Senior Product Manager, and Sportsbook Architect.

Your task is to completely rebuild this betting platform from scratch using the specifications in this document.

Do NOT create a simple frontend demo.

Build a production-ready sportsbook architecture with scalable code, modern UI/UX, proper folder structure, reusable components, responsive design, and clean code.

---

## Core Requirements

Build:

* A complete sportsbook platform
* A complete admin panel
* User authentication system
* Wallet system
* Betting engine UI
* Live betting interface
* Match statistics pages
* Promotions system
* Referral system
* Notification system
* Settings system
* Support system

---

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* Framer Motion

### Backend

* Node.js
* Express
* PostgreSQL
* Redis
* Socket.io

### Authentication

* JWT
* Refresh Tokens
* OTP Verification

### Payments

* Paystack integration structure
* Flutterwave integration structure
* Monnify integration structure

### Deployment Ready

* Docker
* Nginx
* Coolify
* Vercel

---

## UI Requirements

Create a premium dark sportsbook UI.

Design quality should exceed:

* BetKing
* SportyBet
* Bet9ja

Use:

```css
Primary: #16a34a;
Accent: #f97316;
Background: #0f172a;
Surface: #111827;
Cards: #1e293b;
Text: #f8fafc;
```

Requirements:

* Fully responsive
* Mobile first
* Premium animations
* Smooth transitions
* Skeleton loading states
* Realistic sportsbook layout
* Real team logos support
* Modern dashboard design

---

## Build Every Page

### Public

* Home
* Sports
* Live Betting
* Results
* Statistics
* Promotions
* Support

### User

* Dashboard
* Wallet
* My Bets
* Transactions
* Notifications
* Referrals
* Settings
* Profile

### Admin

* Dashboard
* Users
* Deposits
* Withdrawals
* KYC
* Fixtures
* Odds Management
* Promotions
* Analytics
* Reports
* Support Tickets
* Settings

---

## Betting Features

Implement UI and architecture for:

* Match Winner
* Double Chance
* Over/Under
* Both Teams To Score
* Correct Score
* Handicap
* Corners
* Cards
* First Goal Scorer
* Half Time / Full Time

Include:

* Single Bets
* Multi Bets
* System Bets
* Cash Out
* Booking Codes
* Bet Sharing

---

## Live Betting

Create:

* Live Match Center
* Live Timeline
* Live Stats
* Possession Bars
* Momentum Charts
* Goal Animations
* Real-Time Odds Updates

Use Socket.io architecture.

---

## Admin Panel Requirements

Create a professional admin system.

Features:

* User management
* Balance management
* KYC approval
* Deposit approval
* Withdrawal approval
* Odds management
* Fixture management
* Promotion management
* Analytics dashboard
* Revenue tracking
* Activity logs

---

## Code Quality

Requirements:

* Clean architecture
* Modular code
* Reusable components
* Proper TypeScript types
* API abstraction layer
* Error handling
* Loading states
* Empty states
* Accessibility support

---

## Deliverables

Generate:

1. Complete folder structure
2. Database schema
3. Frontend architecture
4. Backend architecture
5. API routes
6. Component structure
7. State management setup
8. Authentication flow
9. Admin panel architecture
10. Responsive layouts
11. Production-ready code

---

## Important

Do not ask questions.

Do not stop halfway.

Do not generate placeholders unless absolutely necessary.

Make reasonable engineering decisions yourself.

Continue building until the entire application architecture, pages, components, backend structure, and database design are completed.

Act as a senior engineering team building a real sportsbook startup.

The final result should feel like a commercial betting platform ready for real-world development.

This prompt is designed to push an AI coding agent to take ownership of the entire rebuild rather than only generating a homepage or a few components.
