/**
 * PHASE 1: PREDICTION ENGINE AUDIT & REBUILD
 * 
 * Enhanced type definitions with new markets and analysis data
 */

export interface PredictionData {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  matchDate: Date;
  kickoffTime: string;
  league: string;
  predictions: TopPrediction[];
  riskLevel: 'low' | 'moderate' | 'high';
  status: 'recommended' | 'caution' | 'risky';
  generatedAt: Date;
  confidence: number;
}

export interface TopPrediction {
  rank: 1 | 2 | 3;
  prediction: string;
  market: MarketType;
  rawConfidence: number;
  riskPenalty: number;
  finalConfidence: number;
  classification: ConfidenceLevel;
  reasoning: string;
  riskBadge: 'ultra_safe' | 'very_safe' | 'safe' | 'moderate';
}

export interface DetailedConfidenceScore {
  formScore: number; // 0-100
  homeAwayScore: number; // 0-100
  headToHeadScore: number; // 0-100
  goalDifferenceScore: number; // 0-100
  leaguePositionScore: number; // 0-100
  goalTrendScore: number; // 0-100
  cornerTrendScore: number; // 0-100
  cardTrendScore: number; // 0-100
  bttsConsistencyScore: number; // 0-100
  riskPenalty: number; // Applied based on market type
  rawConfidence: number; // Before penalty
  finalConfidence: number; // After penalty (0-100)
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  lastFiveMatches: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  lastTenMatches: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  homeStats: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    bttsPercentage: number;
  };
  awayStats: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    bttsPercentage: number;
  };
  goalStats: {
    scored: number;
    conceded: number;
    averageScored: number;
    averageConceded: number;
    goalDifference: number;
    over05Rate: number;
    over15Rate: number;
    over25Rate: number;
    over35Rate: number;
    over45Rate: number;
  };
  cornerStats: {
    averageWon: number;
    averageConceded: number;
    total: number;
    lastFiveTrend: number; // average
    lastTenTrend: number; // average
  };
  cardStats: {
    averageYellow: number;
    averageRed: number;
    total: number;
    refereeAverageCards: number;
  };
  leaguePosition: number;
  leaguePoints: number;
}

export interface HeadToHeadStats {
  team1Wins: number;
  team2Wins: number;
  draws: number;
  totalMatches: number;
  totalGoalsScored: number;
  totalGoalsConceded: number;
  averageGoals: number;
  bttsPercentage: number;
  homeTeamWinPercentage: number;
  awayTeamWinPercentage: number;
  drawPercentage: number;
  averageCorners: number;
}

export type MarketType =
  // Winner Markets
  | 'home_win'
  | 'away_win'
  | 'draw'
  | 'draw_no_bet_home'
  | 'draw_no_bet_away'
  // Double Chance
  | 'double_chance_1x'
  | 'double_chance_x2'
  | 'double_chance_12'
  // Over/Under Goals
  | 'over_05'
  | 'over_15'
  | 'over_25'
  | 'over_35'
  | 'over_45'
  | 'under_05'
  | 'under_15'
  | 'under_25'
  | 'under_35'
  | 'under_45'
  // Team Goals
  | 'home_team_over_05'
  | 'home_team_over_15'
  | 'home_team_over_25'
  | 'away_team_over_05'
  | 'away_team_over_15'
  | 'away_team_over_25'
  // Team To Score
  | 'home_team_to_score'
  | 'away_team_to_score'
  // Both Teams To Score
  | 'btts_yes'
  | 'btts_no'
  // Corners
  | 'corners_over_8'
  | 'corners_over_10'
  | 'corners_over_12'
  // Cards
  | 'cards_over_3'
  | 'cards_over_4'
  | 'cards_over_5';

export type ConfidenceLevel =
  | 'ultra_safe' // 95-100%
  | 'very_safe' // 90-94%
  | 'safe' // 85-89%
  | 'moderate' // 80-84%
  | 'hidden'; // Below 80%

export interface MatchAnalysis {
  matchId: string;
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  headToHead: HeadToHeadStats;
  predictions: PredictionData;
  analysisDetails: {
    formAnalysis: string;
    goalTrendAnalysis: string;
    cornerAnalysis: string;
    cardAnalysis: string;
    homeAwayAnalysis: string;
    headToHeadAnalysis: string;
    summaryAnalysis: string;
  };
}

export interface RiskPenaltyConfig {
  market: MarketType;
  penalty: number;
}

export const RISK_PENALTIES: Record<MarketType, number> = {
  // Winner Markets
  home_win: -10,
  away_win: -15,
  draw: -25,
  draw_no_bet_home: -8,
  draw_no_bet_away: -10,
  
  // Double Chance
  double_chance_1x: -5,
  double_chance_x2: -8,
  double_chance_12: 0,
  
  // Over/Under Goals
  over_05: 0,
  over_15: 0,
  over_25: -5,
  over_35: -15,
  over_45: -25,
  under_05: -20,
  under_15: -10,
  under_25: -5,
  under_35: 0,
  under_45: 0,
  
  // Team Goals
  home_team_over_05: -2,
  home_team_over_15: -5,
  home_team_over_25: -10,
  away_team_over_05: -3,
  away_team_over_15: -6,
  away_team_over_25: -12,
  
  // Team To Score
  home_team_to_score: -3,
  away_team_to_score: -4,
  
  // Both Teams To Score
  btts_yes: -5,
  btts_no: -8,
  
  // Corners
  corners_over_8: -5,
  corners_over_10: -10,
  corners_over_12: -15,
  
  // Cards
  cards_over_3: -3,
  cards_over_4: -8,
  cards_over_5: -15,
};

// Confidence visualization thresholds
export const CONFIDENCE_THRESHOLDS = {
  ULTRA_SAFE: 95,
  VERY_SAFE: 90,
  SAFE: 85,
  MODERATE: 80,
  HIDDEN: 0,
};

// Color codes for confidence levels
export const CONFIDENCE_COLORS = {
  ultra_safe: '#065F46', // Dark Green
  very_safe: '#10B981', // Green
  safe: '#F59E0B', // Amber
  moderate: '#F97316', // Orange
  hidden: '#D1D5DB', // Gray
};
