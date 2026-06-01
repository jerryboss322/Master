import { 
  PredictionData, 
  TopPrediction, 
  DetailedConfidenceScore, 
  TeamStats, 
  HeadToHeadStats, 
  MarketType, 
  ConfidenceLevel,
  RISK_PENALTIES,
  CONFIDENCE_THRESHOLDS
} from '../types/prediction';

/**
 * Confidence calculation weights for winner predictions
 * Should sum to 1.0
 */
const WEIGHTS = {
  formScore: 0.30,           // Recent form is most important
  homeAwayStrength: 0.25,    // Home/Away advantage matters
  headToHead: 0.20,          // Historical matchups
  goalDifference: 0.15,      // Offensive/Defensive capability
  leaguePosition: 0.10,      // Overall standings
};

// Minimum confidence before applying risk penalty
const BASE_MIN_CONFIDENCE_THRESHOLD = 60;

// After risk penalty applied
const FINAL_MIN_CONFIDENCE_THRESHOLD = 80;

// Helper function to safely access nested values
const safeGet = (value: any, defaultValue: number = 0): number => {
  return Number.isFinite(value) ? value : defaultValue;
};

export class PredictionEngine {
  /**
   * Generate top 3 safest predictions for a match
   * Comprehensive prediction system with risk assessment
   */
  async generatePredictions(
    matchId: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    headToHead: HeadToHeadStats,
    leagueTable: any
  ): Promise<TopPrediction[]> {
    // Generate all possible market predictions
    const allPredictions: TopPrediction[] = [];

    try {
      // Validate input data
      this.validateTeamStats(homeTeam, awayTeam);
      this.validateHeadToHeadStats(headToHead);

      // Winner markets
      allPredictions.push(
        this.predictWinner('home_win', homeTeam, awayTeam, headToHead, leagueTable),
        this.predictWinner('away_win', homeTeam, awayTeam, headToHead, leagueTable),
        this.predictWinner('draw', homeTeam, awayTeam, headToHead, leagueTable)
      );

      // Double chance markets
      allPredictions.push(
        this.predictDoubleChance('double_chance_1x', homeTeam, awayTeam),
        this.predictDoubleChance('double_chance_x2', homeTeam, awayTeam),
        this.predictDoubleChance('double_chance_12', homeTeam, awayTeam)
      );

      // Over/Under goals
      allPredictions.push(
        this.predictGoals('over_15', homeTeam, awayTeam, headToHead),
        this.predictGoals('over_25', homeTeam, awayTeam, headToHead),
        this.predictGoals('over_35', homeTeam, awayTeam, headToHead)
      );

      // BTTS
      allPredictions.push(this.predictBTTS(homeTeam, awayTeam, headToHead));

      // Corners
      allPredictions.push(
        this.predictCorners('corners_over_8', homeTeam, awayTeam),
        this.predictCorners('corners_over_10', homeTeam, awayTeam),
        this.predictCorners('corners_over_12', homeTeam, awayTeam)
      );

      // Cards
      allPredictions.push(
        this.predictCards('cards_over_3', homeTeam, awayTeam),
        this.predictCards('cards_over_4', homeTeam, awayTeam),
        this.predictCards('cards_over_5', homeTeam, awayTeam)
      );

      // Filter by minimum base confidence threshold
      const validPredictions = allPredictions.filter(
        (p) => p.rawConfidence >= BASE_MIN_CONFIDENCE_THRESHOLD
      );

      // Filter by final confidence threshold (after risk penalty)
      const safePredictions = validPredictions.filter(
        (p) => p.finalConfidence >= FINAL_MIN_CONFIDENCE_THRESHOLD
      );

      // Sort by final confidence descending
      safePredictions.sort((a, b) => b.finalConfidence - a.finalConfidence);

      // Return top 3, assign ranks
      const topThree = safePredictions.slice(0, 3).map((pred, index) => ({
        ...pred,
        rank: (index + 1) as 1 | 2 | 3,
      }));

      return topThree;
    } catch (error) {
      console.error('Error generating predictions:', error);
      return [];
    }
  }

  /**
   * Validate team statistics for completeness
   */
  private validateTeamStats(homeTeam: TeamStats, awayTeam: TeamStats): void {
    if (!homeTeam.teamId || !awayTeam.teamId) {
      throw new Error('Invalid team IDs');
    }
    if (homeTeam.lastFiveMatches.wins === undefined || awayTeam.lastFiveMatches.wins === undefined) {
      throw new Error('Missing match history');
    }
  }

  /**
   * Validate head-to-head statistics
   */
  private validateHeadToHeadStats(h2h: HeadToHeadStats): void {
    if (h2h.totalMatches === 0) {
      throw new Error('No head-to-head history available');
    }
  }

  /**
   * Predict winner markets (home, away, draw)
   */
  private predictWinner(
    market: 'home_win' | 'away_win' | 'draw',
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    headToHead: HeadToHeadStats,
    leagueTable: any
  ): TopPrediction {
    const formScore = this.calculateFormScore(market, homeTeam, awayTeam);
    const homeAwayScore = this.calculateHomeAwayScore(market, homeTeam, awayTeam);
    const h2hScore = this.calculateH2HScore(market, headToHead);
    const leaguePositionScore = this.calculateLeaguePositionScore(
      market,
      homeTeam,
      awayTeam,
      leagueTable
    );
    const goalDifferenceScore = this.calculateGoalDifferenceScore(market, homeTeam, awayTeam);

    const rawConfidence = this.calculateFinalConfidence({
      formScore,
      homeAwayScore,
      headToHeadScore: h2hScore,
      goalDifferenceScore,
      leaguePositionScore,
      goalTrendScore: 0,
      cornerTrendScore: 0,
      cardTrendScore: 0,
      bttsConsistencyScore: 0,
      riskPenalty: 0,
      rawConfidence: 0,
      finalConfidence: 0,
    });

    const riskPenalty = RISK_PENALTIES[market] || 0;
    const finalConfidence = Math.max(0, Math.min(100, rawConfidence + riskPenalty));

    return {
      rank: 1,
      prediction: this.getWinnerPredictionText(market, homeTeam.teamName, awayTeam.teamName),
      market,
      rawConfidence: Math.min(rawConfidence, 100),
      riskPenalty,
      finalConfidence,
      classification: this.classifyConfidence(finalConfidence),
      reasoning: this.getWinnerReasoning(market, homeTeam, awayTeam, finalConfidence),
      riskBadge: this.classifyConfidence(finalConfidence),
    };
  }

  /**
   * Predict over/under goals
   */
  private predictGoals(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    headToHead: HeadToHeadStats
  ): TopPrediction {
    const goalAverage = (homeTeam.goalStats.averageScored + awayTeam.goalStats.averageScored) / 2;
    const overRateHistory = this.getOverRateHistory(market, homeTeam, awayTeam);
    const h2hGoals = safeGet(headToHead.averageGoals, 2.5);
    const recentForm = (homeTeam.lastFiveMatches.wins + awayTeam.lastFiveMatches.wins) / 10;

    const rawConfidence =
      safeGet(goalAverage) * 0.4 + safeGet(overRateHistory) * 0.3 + safeGet(h2hGoals / 5) * 0.2 + safeGet(recentForm) * 0.1;

    const riskPenalty = RISK_PENALTIES[market as MarketType] || -5;
    const finalConfidence = Math.max(0, Math.min(100, rawConfidence * 100 + riskPenalty));

    return {
      rank: 1,
      prediction: `${market.replace(/_/g, ' ').toUpperCase()}`,
      market: market as MarketType,
      rawConfidence: Math.min(rawConfidence * 100, 100),
      riskPenalty,
      finalConfidence,
      classification: this.classifyConfidence(finalConfidence),
      reasoning: `Goal average: ${goalAverage.toFixed(2)}, H2H: ${h2hGoals.toFixed(2)}, Rate: ${(overRateHistory * 100).toFixed(1)}%`,
      riskBadge: this.classifyConfidence(finalConfidence),
    };
  }

  /**
   * Predict both teams to score
   */
  private predictBTTS(
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    headToHead: HeadToHeadStats
  ): TopPrediction {
    const bttsRate = safeGet(headToHead.bttsPercentage) / 100;
    const homeGoalsConceded = safeGet(homeTeam.goalStats.averageConceded) / 3;
    const awayGoalsConceded = safeGet(awayTeam.goalStats.averageConceded) / 3;
    const recentForm = (homeTeam.lastFiveMatches.wins + awayTeam.lastFiveMatches.wins) / 10;

    const rawConfidence = bttsRate * 0.4 + safeGet(homeGoalsConceded) * 0.3 + safeGet(awayGoalsConceded) * 0.2 + safeGet(recentForm) * 0.1;

    const riskPenalty = RISK_PENALTIES['btts_yes'] || -5;
    const finalConfidence = Math.max(0, Math.min(100, rawConfidence * 100 + riskPenalty));

    return {
      rank: 1,
      prediction: 'Both Teams To Score',
      market: 'btts_yes',
      rawConfidence: Math.min(rawConfidence * 100, 100),
      riskPenalty,
      finalConfidence,
      classification: this.classifyConfidence(finalConfidence),
      reasoning: `BTTS Rate: ${(bttsRate * 100).toFixed(1)}%, H2H: ${safeGet(headToHead.bttsPercentage).toFixed(1)}%`,
      riskBadge: this.classifyConfidence(finalConfidence),
    };
  }

  /**
   * Predict corners markets
   */
  private predictCorners(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): TopPrediction {
    const threshold = parseInt(market.split('_').pop() || '8');
    const teamAverage = (safeGet(homeTeam.cornerStats.averageWon) + safeGet(awayTeam.cornerStats.averageWon)) / 2;
    const opponentAverage = (safeGet(homeTeam.cornerStats.averageConceded) + safeGet(awayTeam.cornerStats.averageConceded)) / 2;
    const leagueAverage = (teamAverage + opponentAverage) / 2;

    const rawConfidence =
      (safeGet(teamAverage) / threshold) * 0.5 +
      (safeGet(opponentAverage) / threshold) * 0.3 +
      (safeGet(leagueAverage) / threshold) * 0.2;

    const riskPenalty = RISK_PENALTIES[market as MarketType] || -10;
    const finalConfidence = Math.max(0, Math.min(100, rawConfidence * 100 + riskPenalty));

    return {
      rank: 1,
      prediction: `Over ${threshold} Corners`,
      market: market as MarketType,
      rawConfidence: Math.min(rawConfidence * 100, 100),
      riskPenalty,
      finalConfidence,
      classification: this.classifyConfidence(finalConfidence),
      reasoning: `Avg corners: ${teamAverage.toFixed(1)}, Threshold: ${threshold}, League avg: ${leagueAverage.toFixed(1)}`,
      riskBadge: this.classifyConfidence(finalConfidence),
    };
  }

  /**
   * Predict cards markets
   */
  private predictCards(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): TopPrediction {
    const threshold = parseInt(market.split('_').pop() || '3');
    const teamAverage = (safeGet(homeTeam.cardStats.averageYellow) + safeGet(awayTeam.cardStats.averageYellow)) / 2;
    const opponentAverage = (safeGet(homeTeam.cardStats.averageRed) + safeGet(awayTeam.cardStats.averageRed)) / 2;

    const rawConfidence = (safeGet(teamAverage) / threshold) * 0.6 + (safeGet(opponentAverage) / threshold) * 0.4;

    const riskPenalty = RISK_PENALTIES[market as MarketType] || -8;
    const finalConfidence = Math.max(0, Math.min(100, rawConfidence * 100 + riskPenalty));

    return {
      rank: 1,
      prediction: `Over ${threshold} Cards`,
      market: market as MarketType,
      rawConfidence: Math.min(rawConfidence * 100, 100),
      riskPenalty,
      finalConfidence,
      classification: this.classifyConfidence(finalConfidence),
      reasoning: `Avg yellow: ${teamAverage.toFixed(1)}, Red: ${opponentAverage.toFixed(1)}, Threshold: ${threshold}`,
      riskBadge: this.classifyConfidence(finalConfidence),
    };
  }

  /**
   * Predict double chance markets
   */
  private predictDoubleChance(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): TopPrediction {
    const homeWinRate = safeGet(homeTeam.lastTenMatches.wins) / 10;
    const drawRate = (safeGet(homeTeam.lastTenMatches.draws) + safeGet(awayTeam.lastTenMatches.draws)) / 20;
    const awayWinRate = safeGet(awayTeam.lastTenMatches.wins) / 10;

    let rawConfidence = 0;
    let text = '';

    if (market === 'double_chance_1x') {
      rawConfidence = homeWinRate + drawRate;
      text = 'Home or Draw';
    } else if (market === 'double_chance_x2') {
      rawConfidence = drawRate + awayWinRate;
      text = 'Draw or Away';
    } else {
      rawConfidence = homeWinRate + awayWinRate;
      text = 'Home or Away';
    }

    const riskPenalty = RISK_PENALTIES[market as MarketType] || -5;
    const finalConfidence = Math.max(0, Math.min(100, rawConfidence * 100 + riskPenalty));

    return {
      rank: 1,
      prediction: text,
      market: market as MarketType,
      rawConfidence: Math.min(rawConfidence * 100, 100),
      riskPenalty,
      finalConfidence,
      classification: this.classifyConfidence(finalConfidence),
      reasoning: `Based on recent form: Home ${(homeWinRate * 100).toFixed(0)}%, Draw ${(drawRate * 100).toFixed(0)}%, Away ${(awayWinRate * 100).toFixed(0)}%`,
      riskBadge: this.classifyConfidence(finalConfidence),
    };
  }

  // ==================== HELPER METHODS ====================

  private calculateFormScore(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): number {
    if (market === 'home_win') {
      return (safeGet(homeTeam.lastFiveMatches.wins) / 5) * 100;
    } else if (market === 'away_win') {
      return (safeGet(awayTeam.lastFiveMatches.wins) / 5) * 100;
    } else {
      return ((safeGet(homeTeam.lastFiveMatches.draws) + safeGet(awayTeam.lastFiveMatches.draws)) / 10) * 100;
    }
  }

  private calculateHomeAwayScore(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): number {
    if (market === 'home_win') {
      const homeWins = safeGet(homeTeam.homeStats.wins);
      return (homeWins / 10) * 100;
    } else if (market === 'away_win') {
      const awayWins = safeGet(awayTeam.awayStats.wins);
      return (awayWins / 10) * 100;
    }
    return 50;
  }

  private calculateH2HScore(
    market: string,
    headToHead: HeadToHeadStats
  ): number {
    const totalMatches = safeGet(headToHead.team1Wins) + safeGet(headToHead.team2Wins) + safeGet(headToHead.draws);

    if (totalMatches === 0) return 50;

    if (market === 'home_win') {
      return (safeGet(headToHead.team1Wins) / totalMatches) * 100;
    } else if (market === 'away_win') {
      return (safeGet(headToHead.team2Wins) / totalMatches) * 100;
    } else {
      return (safeGet(headToHead.draws) / totalMatches) * 100;
    }
  }

  private calculateLeaguePositionScore(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    leagueTable: any
  ): number {
    if (market === 'home_win') {
      return 50 + (safeGet(leagueTable.homePosition, 8)) * 5;
    } else if (market === 'away_win') {
      return 50 - (safeGet(leagueTable.awayPosition, 8)) * 5;
    }
    return 50;
  }

  private calculateGoalDifferenceScore(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): number {
    const homeGD = safeGet(homeTeam.goalStats.goalDifference);
    const awayGD = safeGet(awayTeam.goalStats.goalDifference);

    if (market === 'home_win') {
      return 50 + (homeGD - awayGD) * 5;
    } else if (market === 'away_win') {
      return 50 + (awayGD - homeGD) * 5;
    }
    return 50;
  }

  private getOverRateHistory(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): number {
    const parts = market.split('_');
    const threshold = parseInt(parts[1]);

    let rate = 0;
    if (threshold === 1) {
      rate = (safeGet(homeTeam.goalStats.over15Rate) + safeGet(awayTeam.goalStats.over15Rate)) / 2 / 100;
    } else if (threshold === 2) {
      rate = (safeGet(homeTeam.goalStats.over25Rate) + safeGet(awayTeam.goalStats.over25Rate)) / 2 / 100;
    } else if (threshold === 3) {
      rate = (safeGet(homeTeam.goalStats.over35Rate) + safeGet(awayTeam.goalStats.over35Rate)) / 2 / 100;
    }

    return Math.min(rate, 1);
  }

  private calculateFinalConfidence(scores: DetailedConfidenceScore): number {
    return (
      scores.formScore * WEIGHTS.formScore +
      scores.homeAwayScore * WEIGHTS.homeAwayStrength +
      scores.headToHeadScore * WEIGHTS.headToHead +
      scores.goalDifferenceScore * WEIGHTS.goalDifference +
      scores.leaguePositionScore * WEIGHTS.leaguePosition
    );
  }

  private classifyConfidence(confidence: number): ConfidenceLevel {
    if (confidence >= CONFIDENCE_THRESHOLDS.ULTRA_SAFE) return 'ultra_safe';
    if (confidence >= CONFIDENCE_THRESHOLDS.VERY_SAFE) return 'very_safe';
    if (confidence >= CONFIDENCE_THRESHOLDS.SAFE) return 'safe';
    if (confidence >= CONFIDENCE_THRESHOLDS.MODERATE) return 'moderate';
    return 'hidden';
  }

  private getWinnerPredictionText(
    market: string,
    homeTeamName: string,
    awayTeamName: string
  ): string {
    if (market === 'home_win') return `${homeTeamName} Win`;
    if (market === 'away_win') return `${awayTeamName} Win`;
    return 'Draw';
  }

  private getWinnerReasoning(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    confidence: number
  ): string {
    if (market === 'home_win') {
      return `Home team form: ${homeTeam.lastFiveMatches.wins}/5, Home record: ${homeTeam.homeStats.wins}/10 (${((homeTeam.homeStats.wins / 10) * 100).toFixed(0)}%)`;
    } else if (market === 'away_win') {
      return `Away team form: ${awayTeam.lastFiveMatches.wins}/5, Away record: ${awayTeam.awayStats.wins}/10 (${((awayTeam.awayStats.wins / 10) * 100).toFixed(0)}%)`;
    }
    return `Both teams showing balanced form, Draw probability strong`;
  }
}
