import { PredictionData, TopPrediction, ConfidenceScore, TeamStats, HeadToHeadStats, MarketType, ConfidenceLevel } from '../types/prediction';

const WEIGHTS = {
  formScore: 0.30,
  homeAwayStrength: 0.25,
  headToHead: 0.20,
  goalDifference: 0.15,
  leaguePosition: 0.10,
};

const MIN_CONFIDENCE_THRESHOLD = 80;

export class PredictionEngine {
  /**
   * Generate top 3 safest predictions for a match
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

    // Filter by minimum confidence threshold
    const validPredictions = allPredictions.filter(
      (p) => p.confidence >= MIN_CONFIDENCE_THRESHOLD
    );

    // Sort by confidence descending
    validPredictions.sort((a, b) => b.confidence - a.confidence);

    // Return top 3
    return validPredictions.slice(0, 3);
  }

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

    const confidence = this.calculateFinalConfidence({
      formScore,
      homeAwayScore,
      headToHeadScore: h2hScore,
      goalDifferenceScore: 0,
      leaguePositionScore,
      goalTrendScore: 0,
      cornerTrendScore: 0,
      cardTrendScore: 0,
      final: 0,
    });

    return {
      rank: 0,
      prediction: this.getWinnerPredictionText(market, homeTeam.teamName, awayTeam.teamName),
      market,
      confidence,
      classification: this.classifyConfidence(confidence),
      reasoning: this.getWinnerReasoning(market, homeTeam, awayTeam, confidence),
    };
  }

  private predictGoals(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    headToHead: HeadToHeadStats
  ): TopPrediction {
    const goalAverage = (homeTeam.goalStats.averageScored + awayTeam.goalStats.averageScored) / 2;
    const overRateHistory = this.getOverRateHistory(market, homeTeam, awayTeam);
    const h2hGoals = headToHead.averageGoals;
    const recentForm = (homeTeam.lastFiveMatches.wins + awayTeam.lastFiveMatches.wins) / 10;

    const confidence =
      goalAverage * 0.4 + overRateHistory * 0.3 + h2hGoals * 0.2 + recentForm * 0.1;

    return {
      rank: 0,
      prediction: `${market.replace(/_/g, ' ').toUpperCase()} Goals`,
      market: market as MarketType,
      confidence: Math.min(confidence * 100, 100),
      classification: this.classifyConfidence(Math.min(confidence * 100, 100)),
      reasoning: `Goal average: ${goalAverage.toFixed(2)}, H2H: ${h2hGoals.toFixed(2)}`,
    };
  }

  private predictBTTS(
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    headToHead: HeadToHeadStats
  ): TopPrediction {
    const bttsRate = headToHead.bttsPercentage / 100;
    const homeGoalsConceded = homeTeam.goalStats.averageConceded / 3;
    const awayGoalsConceded = awayTeam.goalStats.averageConceded / 3;
    const recentForm =
      (homeTeam.lastFiveMatches.wins + awayTeam.lastFiveMatches.wins) / 10;

    const confidence = bttsRate * 0.4 + homeGoalsConceded * 0.3 + awayGoalsConceded * 0.2 + recentForm * 0.1;

    return {
      rank: 0,
      prediction: 'Both Teams To Score',
      market: 'btts_yes',
      confidence: Math.min(confidence * 100, 100),
      classification: this.classifyConfidence(Math.min(confidence * 100, 100)),
      reasoning: `BTTS Rate: ${(bttsRate * 100).toFixed(1)}%, H2H BTTS: ${headToHead.bttsPercentage.toFixed(1)}%`,
    };
  }

  private predictCorners(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): TopPrediction {
    const threshold = parseInt(market.split('_').pop() || '8');
    const teamAverage = (homeTeam.cornerStats.averageWon + awayTeam.cornerStats.averageWon) / 2;
    const opponentAverage = (homeTeam.cornerStats.averageConceded + awayTeam.cornerStats.averageConceded) / 2;
    const leagueAverage = (teamAverage + opponentAverage) / 2;

    const confidence =
      (teamAverage / threshold) * 0.5 +
      (opponentAverage / threshold) * 0.3 +
      (leagueAverage / threshold) * 0.2;

    return {
      rank: 0,
      prediction: `Over ${threshold} Corners`,
      market: market as MarketType,
      confidence: Math.min(confidence * 100, 100),
      classification: this.classifyConfidence(Math.min(confidence * 100, 100)),
      reasoning: `Avg corners: ${teamAverage.toFixed(1)}, Threshold: ${threshold}`,
    };
  }

  private predictCards(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): TopPrediction {
    const threshold = parseInt(market.split('_').pop() || '3');
    const teamAverage = (homeTeam.cardStats.averageYellow + awayTeam.cardStats.averageYellow) / 2;
    const opponentAverage = (homeTeam.cardStats.averageRed + awayTeam.cardStats.averageRed) / 2;

    const confidence = (teamAverage / threshold) * 0.6 + (opponentAverage / threshold) * 0.4;

    return {
      rank: 0,
      prediction: `Over ${threshold} Cards`,
      market: market as MarketType,
      confidence: Math.min(confidence * 100, 100),
      classification: this.classifyConfidence(Math.min(confidence * 100, 100)),
      reasoning: `Avg cards: ${(teamAverage + opponentAverage).toFixed(1)}, Threshold: ${threshold}`,
    };
  }

  private predictDoubleChance(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): TopPrediction {
    const homeWinRate = homeTeam.lastTenMatches.wins / 10;
    const drawRate = (homeTeam.lastTenMatches.draws + awayTeam.lastTenMatches.draws) / 20;
    const awayWinRate = awayTeam.lastTenMatches.wins / 10;

    let confidence = 0;
    let text = '';

    if (market === 'double_chance_1x') {
      confidence = (homeWinRate + drawRate) * 100;
      text = 'Home or Draw';
    } else if (market === 'double_chance_x2') {
      confidence = (drawRate + awayWinRate) * 100;
      text = 'Draw or Away';
    } else {
      confidence = (homeWinRate + awayWinRate) * 100;
      text = 'Home or Away';
    }

    return {
      rank: 0,
      prediction: text,
      market: market as MarketType,
      confidence: Math.min(confidence, 100),
      classification: this.classifyConfidence(Math.min(confidence, 100)),
      reasoning: `Based on recent form analysis`,
    };
  }

  // Helper methods

  private calculateFormScore(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): number {
    if (market === 'home_win') {
      return (homeTeam.lastFiveMatches.wins / 5) * 100;
    } else if (market === 'away_win') {
      return (awayTeam.lastFiveMatches.wins / 5) * 100;
    } else {
      return ((homeTeam.lastFiveMatches.draws + awayTeam.lastFiveMatches.draws) / 10) * 100;
    }
  }

  private calculateHomeAwayScore(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): number {
    if (market === 'home_win') {
      return (homeTeam.homeStats.wins / 10) * 100;
    } else if (market === 'away_win') {
      return (awayTeam.awayStats.wins / 10) * 100;
    }
    return 50;
  }

  private calculateH2HScore(
    market: string,
    headToHead: HeadToHeadStats
  ): number {
    if (market === 'home_win') {
      return (headToHead.team1Wins / (headToHead.team1Wins + headToHead.team2Wins + headToHead.draws)) * 100;
    } else if (market === 'away_win') {
      return (headToHead.team2Wins / (headToHead.team1Wins + headToHead.team2Wins + headToHead.draws)) * 100;
    } else {
      return (headToHead.draws / (headToHead.team1Wins + headToHead.team2Wins + headToHead.draws)) * 100;
    }
  }

  private calculateLeaguePositionScore(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats,
    leagueTable: any
  ): number {
    if (market === 'home_win') {
      return 50 + (leagueTable.homePosition || 8) * 5;
    } else if (market === 'away_win') {
      return 50 - (leagueTable.awayPosition || 8) * 5;
    }
    return 50;
  }

  private getOverRateHistory(
    market: string,
    homeTeam: TeamStats,
    awayTeam: TeamStats
  ): number {
    const threshold = parseInt(market.split('_')[1]);
    if (threshold === 1) return (homeTeam.goalStats.over15Rate + awayTeam.goalStats.over15Rate) / 2 / 100;
    if (threshold === 2) return (homeTeam.goalStats.over25Rate + awayTeam.goalStats.over25Rate) / 2 / 100;
    return (homeTeam.goalStats.over35Rate + awayTeam.goalStats.over35Rate) / 2 / 100;
  }

  private calculateFinalConfidence(scores: ConfidenceScore): number {
    return (
      scores.formScore * WEIGHTS.formScore +
      scores.homeAwayScore * WEIGHTS.homeAwayStrength +
      scores.headToHeadScore * WEIGHTS.headToHead +
      scores.goalDifferenceScore * WEIGHTS.goalDifference +
      scores.leaguePositionScore * WEIGHTS.leaguePosition
    );
  }

  private classifyConfidence(confidence: number): ConfidenceLevel {
    if (confidence >= 95) return 'ultra_safe';
    if (confidence >= 90) return 'very_safe';
    if (confidence >= 85) return 'safe';
    if (confidence >= 80) return 'moderate';
    return 'discard';
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
      return `Home team form: ${homeTeam.lastFiveMatches.wins}/5, Home record strong`;
    } else if (market === 'away_win') {
      return `Away team form: ${awayTeam.lastFiveMatches.wins}/5, Strong away record`;
    }
    return `Both teams showing balanced form`;
  }
}
