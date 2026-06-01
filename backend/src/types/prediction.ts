export interface PredictionData {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  matchDate: Date;
  league: string;
  predictions: TopPrediction[];
  riskLevel: 'low' | 'moderate' | 'high';
  status: 'recommended' | 'caution' | 'risky';
  generatedAt: Date;
  confidence: number;
}

export interface TopPrediction {
  rank: number;
  prediction: string;
  market: MarketType;
  confidence: number;
  classification: ConfidenceLevel;
  reasoning: string;
}

export interface ConfidenceScore {
  formScore: number;
  homeAwayScore: number;
  headToHeadScore: number;
  goalDifferenceScore: number;
  leaguePositionScore: number;
  goalTrendScore: number;
  cornerTrendScore: number;
  cardTrendScore: number;
  final: number;
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  lastFiveMatches: {
    wins: number;
    draws: number;
    losses: number;
  };
  lastTenMatches: {
    wins: number;
    draws: number;
    losses: number;
  };
  homeStats: {
    wins: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  awayStats: {
    wins: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  goalStats: {
    scored: number;
    conceded: number;
    averageScored: number;
    averageConceded: number;
    over15Rate: number;
    over25Rate: number;
    over35Rate: number;
  };
  cornerStats: {
    averageWon: number;
    averageConceded: number;
    total: number;
  };
  cardStats: {
    averageYellow: number;
    averageRed: number;
    total: number;
  };
}

export interface HeadToHeadStats {
  team1Wins: number;
  team2Wins: number;
  draws: number;
  totalGoalsScored: number;
  totalGoalsConceded: number;
  bttsPercentage: number;
  averageGoals: number;
}

export type MarketType =
  | 'home_win'
  | 'away_win'
  | 'draw'
  | 'double_chance_1x'
  | 'double_chance_x2'
  | 'double_chance_12'
  | 'btts_yes'
  | 'btts_no'
  | 'over_05'
  | 'over_15'
  | 'over_25'
  | 'over_35'
  | 'over_45'
  | 'under_15'
  | 'under_25'
  | 'under_35'
  | 'corners_over_8'
  | 'corners_over_10'
  | 'corners_over_12'
  | 'cards_over_3'
  | 'cards_over_4'
  | 'cards_over_5';

export type ConfidenceLevel =
  | 'ultra_safe'
  | 'very_safe'
  | 'safe'
  | 'moderate'
  | 'discard';

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
  };
}
