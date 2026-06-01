# JPredict - AI Football Prediction Platform

Advanced machine learning-powered football match analysis and prediction engine.

## Overview

JPredict is a sophisticated football prediction platform that analyzes historical data, team performance, and statistical trends to provide the safest possible match predictions.

**Key Features:**
- Daily fixture ingestion from football APIs
- Advanced statistical analysis engine
- Head-to-head analysis
- Team form tracking
- Goals, corners, and cards analysis
- Confidence scoring algorithm
- Top 3 safest predictions per match

## Technology Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Framer Motion
- Redux Toolkit

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Redis
- Socket.io
- TypeScript

**APIs:**
- Football-Data.org
- RapidAPI Football APIs

## Project Structure

```
jpredict/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js API server
├── shared/            # Shared types and utilities
├── docs/              # Documentation
└── docker-compose.yml # Docker configuration
```

## Features

### Prediction Engine
- Real-time fixture analysis
- 50+ statistical metrics per match
- Weighted prediction formulas
- Confidence scoring (0-100%)
- Top 3 safest predictions ranking

### User Dashboard
- Today's matches with predictions
- Match analysis pages
- Prediction history tracking
- Team statistics explorer
- League standings

### Admin Panel
- API configuration
- Prediction engine settings
- Confidence thresholds
- Daily fixture processing
- Analytics dashboard

## Installation

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run with Docker
docker-compose up
```

## Environment Setup

**Backend .env:**
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/jpredict
REDIS_URL=redis://localhost:6379
FOOTBALL_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
```

**Frontend .env:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

## API Endpoints

### Predictions
```
GET  /api/predictions/today
GET  /api/predictions/match/:matchId
GET  /api/predictions/history
GET  /api/predictions/stats
```

### Matches
```
GET  /api/matches/today
GET  /api/matches/:id
GET  /api/matches/league/:leagueId
```

### Analysis
```
GET  /api/analysis/team/:teamId
GET  /api/analysis/head-to-head/:team1/:team2
GET  /api/analysis/form/:teamId
GET  /api/analysis/goals/:teamId
```

### Admin
```
GET  /api/admin/settings
PUT  /api/admin/settings
POST /api/admin/process-fixtures
GET  /api/admin/analytics
```

## Prediction Algorithm

For every match, the engine:

1. **Collects Data**
   - Last 5/10 match form
   - Home/Away statistics
   - Head-to-head history
   - Goal/Corner/Card averages

2. **Calculates Scores**
   - Form score (30%)
   - Home/Away strength (25%)
   - Head-to-head (20%)
   - Goal difference (15%)
   - League position (10%)

3. **Generates Predictions**
   - Win/Draw/Loss
   - Over/Under goals
   - Both Teams To Score
   - Corners/Cards

4. **Ranks by Confidence**
   - Returns top 3 safest predictions
   - Confidence: 0-100%
   - Classification: Ultra Safe, Very Safe, Safe, Moderate

## Example Output

```
Manchester City vs Everton

1. Over 1.5 Goals (94%)
2. Manchester City Draw No Bet (91%)
3. Manchester City Over 4.5 Corners (88%)

Risk Level: Low Risk
Status: Recommended
```

## Pages

- Dashboard - Overview of today's predictions
- Today's Matches - All matches with predictions
- Predictions - Detailed prediction analysis
- Match Analysis - In-depth match breakdown
- Statistics - Team and league statistics
- Prediction History - Historical predictions
- Top Leagues - League standings and analysis
- Team Explorer - Individual team analysis
- Settings - User preferences
- Admin Panel - System administration

## Performance

- API response time: < 200ms
- Prediction calculation: < 1s per match
- WebSocket updates: Real-time
- Database queries: Optimized with indexes
- Cache layer: Redis (5-minute TTL)

## Security

- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- SQL injection prevention
- CORS protection

## License

Private Project - All rights reserved
