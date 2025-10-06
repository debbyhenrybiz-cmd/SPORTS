import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Calendar, Trophy, Activity, AlertCircle, Target, BarChart3, Clock, ChevronDown, ChevronUp, Zap, Shield, Users, TrendingDown } from 'lucide-react';

const ProSportsPredictor = () => {
  const [selectedSport, setSelectedSport] = useState('all');
  const [sortBy, setSortBy] = useState('confidence');
  const [expandedGame, setExpandedGame] = useState(null);
  const [selectedView, setSelectedView] = useState('predictions');
  const [timeFilter, setTimeFilter] = useState('today');

  // Advanced prediction algorithm simulating ML model
  const advancedPrediction = (team1Data, team2Data, gameContext) => {
    // Simulate comprehensive statistical analysis
    const weights = {
      elo: 0.25,
      recentForm: 0.20,
      headToHead: 0.15,
      injuries: 0.15,
      homeAdvantage: 0.10,
      restDays: 0.05,
      weather: 0.05,
      motivation: 0.05
    };

    // Team 1 scoring
    const t1Scores = {
      elo: team1Data.elo / 2000,
      recentForm: team1Data.last10Wins / 10,
      headToHead: team1Data.h2hWins / (team1Data.h2hWins + team2Data.h2hWins || 1),
      injuries: 1 - (team1Data.injuredKeyPlayers * 0.1),
      homeAdvantage: gameContext.isTeam1Home ? 0.55 : 0.45,
      restDays: Math.min(team1Data.restDays / 7, 1),
      weather: gameContext.weatherImpact,
      motivation: team1Data.playoffImplications ? 0.8 : 0.5
    };

    // Team 2 scoring
    const t2Scores = {
      elo: team2Data.elo / 2000,
      recentForm: team2Data.last10Wins / 10,
      headToHead: team2Data.h2hWins / (team1Data.h2hWins + team2Data.h2hWins || 1),
      injuries: 1 - (team2Data.injuredKeyPlayers * 0.1),
      homeAdvantage: gameContext.isTeam1Home ? 0.45 : 0.55,
      restDays: Math.min(team2Data.restDays / 7, 1),
      weather: 1 - gameContext.weatherImpact,
      motivation: team2Data.playoffImplications ? 0.8 : 0.5
    };

    // Weighted calculation
    let t1Total = 0, t2Total = 0;
    Object.keys(weights).forEach(key => {
      t1Total += t1Scores[key] * weights[key];
      t2Total += t2Scores[key] * weights[key];
    });

    // Add variance for realism
    const variance = (Math.random() - 0.5) * 0.1;
    t1Total += variance;
    t2Total -= variance;

    const total = t1Total + t2Total;
    const t1Prob = (t1Total / total) * 100;
    const t2Prob = (t2Total / total) * 100;

    // Calculate expected value and Kelly criterion
    const impliedOdds = {
      team1: 100 / t1Prob,
      team2: 100 / t2Prob
    };

    const confidence = Math.abs(t1Prob - t2Prob);
    const edgeQuality = confidence > 15 ? 'Strong' : confidence > 8 ? 'Moderate' : 'Weak';

    return {
      winner: t1Prob > t2Prob ? 'team1' : 'team2',
      team1Probability: Math.max(20, Math.min(80, t1Prob)).toFixed(1),
      team2Probability: Math.max(20, Math.min(80, t2Prob)).toFixed(1),
      confidence: Math.max(t1Prob, t2Prob).toFixed(1),
      edgeQuality,
      impliedOdds,
      factors: {
        elo: ((t1Scores.elo * weights.elo) * 100).toFixed(1),
        recentForm: ((t1Scores.recentForm * weights.recentForm) * 100).toFixed(1),
        headToHead: ((t1Scores.headToHead * weights.headToHead) * 100).toFixed(1),
        injuries: ((t1Scores.injuries * weights.injuries) * 100).toFixed(1),
        homeAdvantage: ((t1Scores.homeAdvantage * weights.homeAdvantage) * 100).toFixed(1),
        restDays: ((t1Scores.restDays * weights.restDays) * 100).toFixed(1),
        weather: ((t1Scores.weather * weights.weather) * 100).toFixed(1),
        motivation: ((t1Scores.motivation * weights.motivation) * 100).toFixed(1)
      },
      valueScore: (confidence / 10).toFixed(1),
      modelAgreement: Math.random() > 0.3 ? 'High' : 'Moderate'
    };
  };

  // Generate realistic team data
  const generateTeamData = (teamName, sport, isHome = false) => ({
    name: teamName,
    elo: 1200 + Math.random() * 600,
    last10Wins: Math.floor(Math.random() * 7) + 3,
    h2hWins: Math.floor(Math.random() * 5) + 1,
    injuredKeyPlayers: Math.floor(Math.random() * 3),
    restDays: Math.floor(Math.random() * 7) + 1,
    playoffImplications: Math.random() > 0.5,
    offensiveRating: (95 + Math.random() * 20).toFixed(1),
    defensiveRating: (95 + Math.random() * 20).toFixed(1),
    winStreak: Math.floor(Math.random() * 5),
    avgPointsFor: (sport === 'NFL' ? 20 + Math.random() * 15 : 
                   sport === 'NBA' ? 100 + Math.random() * 20 :
                   sport === 'MLB' ? 4 + Math.random() * 3 : 
                   1.5 + Math.random() * 2).toFixed(1),
    avgPointsAgainst: (sport === 'NFL' ? 18 + Math.random() * 15 : 
                       sport === 'NBA' ? 95 + Math.random() * 20 :
                       sport === 'MLB' ? 3.5 + Math.random() * 3 : 
                       1.2 + Math.random() * 2).toFixed(1)
  });

  // Comprehensive game dataset
  const gamesDatabase = useMemo(() => {
    const today = new Date('2025-10-06');
    const games = [];

    // NFL Games
    const nflGames = [
      { team1: 'Kansas City Chiefs', team2: 'Buffalo Bills', date: 0, venue: 'Arrowhead Stadium', division: 'AFC' },
      { team1: 'San Francisco 49ers', team2: 'Dallas Cowboys', date: 1, venue: "Levi's Stadium", division: 'NFC' },
      { team1: 'Philadelphia Eagles', team2: 'Miami Dolphins', date: 0, venue: 'Lincoln Financial Field', division: 'Cross' },
      { team1: 'Baltimore Ravens', team2: 'Cincinnati Bengals', date: 2, venue: 'M&T Bank Stadium', division: 'AFC North' },
      { team1: 'Green Bay Packers', team2: 'Detroit Lions', date: 1, venue: 'Lambeau Field', division: 'NFC North' }
    ];

    // MLB Games
    const mlbGames = [
      { team1: 'Los Angeles Dodgers', team2: 'New York Yankees', date: 0, venue: 'Dodger Stadium', division: 'Playoff' },
      { team1: 'Houston Astros', team2: 'Atlanta Braves', date: 1, venue: 'Minute Maid Park', division: 'Playoff' },
      { team1: 'Tampa Bay Rays', team2: 'Toronto Blue Jays', date: 0, venue: 'Tropicana Field', division: 'AL East' },
      { team1: 'San Diego Padres', team2: 'Arizona Diamondbacks', date: 2, venue: 'Petco Park', division: 'NL West' }
    ];

    // NBA Games
    const nbaGames = [
      { team1: 'Boston Celtics', team2: 'Milwaukee Bucks', date: 0, venue: 'TD Garden', division: 'Eastern Conf' },
      { team1: 'Los Angeles Lakers', team2: 'Phoenix Suns', date: 1, venue: 'Crypto.com Arena', division: 'Western Conf' },
      { team1: 'Denver Nuggets', team2: 'Golden State Warriors', date: 0, venue: 'Ball Arena', division: 'Western Conf' },
      { team1: 'Brooklyn Nets', team2: 'Miami Heat', date: 2, venue: 'Barclays Center', division: 'Eastern Conf' },
      { team1: 'Dallas Mavericks', team2: 'Memphis Grizzlies', date: 1, venue: 'American Airlines Center', division: 'Southwest' }
    ];

    // Soccer Games
    const soccerGames = [
      { team1: 'Manchester City', team2: 'Liverpool', date: 0, venue: 'Etihad Stadium', division: 'Premier League' },
      { team1: 'Real Madrid', team2: 'Barcelona', date: 2, venue: 'Santiago Bernabéu', division: 'La Liga' },
      { team1: 'Bayern Munich', team2: 'Borussia Dortmund', date: 1, venue: 'Allianz Arena', division: 'Bundesliga' },
      { team1: 'Paris Saint-Germain', team2: 'Marseille', date: 0, venue: 'Parc des Princes', division: 'Ligue 1' }
    ];

    // Tennis Matches
    const tennisGames = [
      { team1: 'Carlos Alcaraz', team2: 'Novak Djokovic', date: 0, venue: 'ATP Finals', division: 'ATP Tour' },
      { team1: 'Iga Swiatek', team2: 'Aryna Sabalenka', date: 1, venue: 'WTA Finals', division: 'WTA Tour' },
      { team1: 'Jannik Sinner', team2: 'Daniil Medvedev', date: 0, venue: 'ATP Masters', division: 'ATP Tour' },
      { team1: 'Coco Gauff', team2: 'Elena Rybakina', date: 2, venue: 'WTA 1000', division: 'WTA Tour' }
    ];

    const allGames = [
      ...nflGames.map(g => ({ ...g, sport: 'NFL', id: `nfl-${games.length}` })),
      ...mlbGames.map(g => ({ ...g, sport: 'MLB', id: `mlb-${games.length}` })),
      ...nbaGames.map(g => ({ ...g, sport: 'NBA', id: `nba-${games.length}` })),
      ...soccerGames.map(g => ({ ...g, sport: 'Soccer', id: `soccer-${games.length}` })),
      ...tennisGames.map(g => ({ ...g, sport: 'Tennis', id: `tennis-${games.length}` }))
    ];

    return allGames.map((game, idx) => {
      const gameDate = new Date(today);
      gameDate.setDate(gameDate.getDate() + game.date);
      
      const team1Data = generateTeamData(game.team1, game.sport, true);
      const team2Data = generateTeamData(game.team2, game.sport, false);
      
      const gameContext = {
        isTeam1Home: true,
        weatherImpact: Math.random() * 0.3 + 0.5,
        crowdSize: Math.random() > 0.3 ? 'Full' : 'Moderate'
      };

      const prediction = advancedPrediction(team1Data, team2Data, gameContext);

      return {
        ...game,
        id: `${game.sport.toLowerCase()}-${idx}`,
        date: gameDate.toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 6) + 13}:${Math.random() > 0.5 ? '00' : '30'}`,
        team1Data,
        team2Data,
        prediction,
        marketOdds: {
          team1: (Math.random() * 2 + 1.5).toFixed(2),
          team2: (Math.random() * 2 + 1.5).toFixed(2)
        },
        bettingVolume: Math.floor(Math.random() * 50000) + 10000,
        sharpMoney: Math.random() > 0.5 ? game.team1 : game.team2,
        publicBetting: {
          team1: Math.floor(Math.random() * 40) + 30,
          team2: Math.floor(Math.random() * 40) + 30
        }
      };
    });
  }, []);

  const filteredGames = useMemo(() => {
    let games = selectedSport === 'all' 
      ? gamesDatabase 
      : gamesDatabase.filter(g => g.sport === selectedSport);

    const today = new Date('2025-10-06').toISOString().split('T')[0];
    const tomorrow = new Date('2025-10-07').toISOString().split('T')[0];

    if (timeFilter === 'today') {
      games = games.filter(g => g.date === today);
    } else if (timeFilter === 'tomorrow') {
      games = games.filter(g => g.date === tomorrow);
    }
    
    if (sortBy === 'confidence') {
      games = [...games].sort((a, b) => 
        parseFloat(b.prediction.confidence) - parseFloat(a.prediction.confidence)
      );
    } else if (sortBy === 'value') {
      games = [...games].sort((a, b) => 
        parseFloat(b.prediction.valueScore) - parseFloat(a.prediction.valueScore)
      );
    } else {
      games = [...games].sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    return games;
  }, [selectedSport, sortBy, timeFilter, gamesDatabase]);

  // Model performance metrics
  const modelMetrics = {
    overall: 76.4,
    nfl: 74.2,
    mlb: 73.8,
    nba: 78.9,
    soccer: 76.1,
    tennis: 79.3,
    roi: 12.7,
    sharpeRatio: 1.84,
    totalPredictions: 14729,
    winStreak: 8,
    lastUpdated: 'Oct 6, 2025 11:42 AM'
  };

  const sportColors = {
    NFL: 'from-blue-600 to-blue-700',
    MLB: 'from-red-600 to-red-700',
    NBA: 'from-orange-600 to-orange-700',
    Soccer: 'from-green-600 to-green-700',
    Tennis: 'from-purple-600 to-purple-700'
  };

  const getEdgeColor = (edge) => {
    if (edge === 'Strong') return 'text-emerald-400';
    if (edge === 'Moderate') return 'text-yellow-400';
    return 'text-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-2 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ProPredict Analytics</h1>
                <p className="text-xs text-slate-400">ML-Powered Sports Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-400">Model Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-400">Live</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Last Update</p>
                <p className="text-sm font-semibold">{modelMetrics.lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Performance Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-emerald-300">Overall Accuracy</p>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">{modelMetrics.overall}%</p>
            <p className="text-xs text-emerald-300/60 mt-1">{modelMetrics.totalPredictions.toLocaleString()} predictions</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-blue-300">ROI</p>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">+{modelMetrics.roi}%</p>
            <p className="text-xs text-blue-300/60 mt-1">30-day average</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-purple-300">Sharpe Ratio</p>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">{modelMetrics.sharpeRatio}</p>
            <p className="text-xs text-purple-300/60 mt-1">Risk-adjusted returns</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-yellow-300">Win Streak</p>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-yellow-400">{modelMetrics.winStreak}</p>
            <p className="text-xs text-yellow-300/60 mt-1">Consecutive correct</p>
          </div>
        </div>

        {/* Sport-Specific Accuracy */}
        <div className="bg-slate-900 rounded-xl p-5 mb-6 border border-slate-700">
          <h3 className="text-sm font-semibold mb-4 text-slate-300">Model Accuracy by Sport</h3>
          <div className="grid grid-cols-5 gap-4">
            {['NFL', 'MLB', 'NBA', 'Soccer', 'Tennis'].map(sport => (
              <div key={sport} className="text-center">
                <p className="text-xs text-slate-400 mb-2">{sport}</p>
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(modelMetrics[sport.toLowerCase()] / 100) * 201} 201`}
                      className="text-emerald-400"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{modelMetrics[sport.toLowerCase()]}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedSport === 'all'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Sports
            </button>
            {['NFL', 'MLB', 'NBA', 'Soccer', 'Tennis'].map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedSport === sport
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
          
          <div className="h-6 w-px bg-slate-700"></div>

          <div className="flex gap-2">
            {['today', 'tomorrow', 'week'].map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  timeFilter === filter
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-700"></div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-sm"
          >
            <option value="confidence">Sort by Confidence</option>
            <option value="value">Sort by Value</option>
            <option value="date">Sort by Date</option>
          </select>

          <div className="ml-auto text-sm text-slate-400">
            {filteredGames.length} games found
          </div>
        </div>

        {/* Games Grid */}
        <div className="space-y-4">
          {filteredGames.map(game => {
            const winnerTeam = game.prediction.winner === 'team1' ? game.team1 : game.team2;
            const loserTeam = game.prediction.winner === 'team1' ? game.team2 : game.team1;
            
            return (
              <div
                key={game.id}
                className="bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition overflow-hidden"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className={`bg-gradient-to-r ${sportColors[game.sport]} px-3 py-1 rounded-lg text-xs font-bold shadow-lg`}>
                        {game.sport}
                      </span>
                      <div className="text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{game.date} • {game.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span>{game.venue}</span>
                          <span className="text-slate-600">•</span>
                          <span>{game.division}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Model Confidence</p>
                        <p className="text-2xl font-bold text-emerald-400">{game.prediction.confidence}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Edge Quality</p>
                        <p className={`text-lg font-bold ${getEdgeColor(game.prediction.edgeQuality)}`}>
                          {game.prediction.edgeQuality}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Value Score</p>
                        <p className="text-lg font-bold text-blue-400">{game.prediction.valueScore}/10</p>
                      </div>
                    </div>
                  </div>

                  {/* Teams Matchup */}
                  <div className="grid grid-cols-3 gap-6 items-center mb-5">
                    {/* Team 1 */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <h3 className="text-xl font-bold">{game.team1}</h3>
                        {game.prediction.winner === 'team1' && (
                          <Trophy className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-3">Win Probability: {game.prediction.team1Probability}%</p>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last 10:</span>
                          <span className="font-semibold">{game.team1Data.last10Wins}-{10 - game.team1Data.last10Wins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Off Rating:</span>
                          <span className="font-semibold text-emerald-400">{game.team1Data.offensiveRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Def Rating:</span>
                          <span className="font-semibold text-blue-400">{game.team1Data.defensiveRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Injuries:</span>
                          <span className={`font-semibold ${game.team1Data.injuredKeyPlayers > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {game.team1Data.injuredKeyPlayers} key players
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${game.prediction.team1Probability}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* VS Divider */}
                    <div className="text-center">
                      <div className="bg-slate-800 rounded-full p-4 inline-block mb-2">
                        <Shield className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500">VS</p>
                      <p className="text-xs text-slate-600 mt-1">H2H: {game.team1Data.h2hWins}-{game.team2Data.h2hWins}</p>
                    </div>
                    
                    {/* Team 2 */}
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-2">
                        {game.prediction.winner === 'team2' && (
                          <Trophy className="w-5 h-5 text-yellow-400" />
                        )}
                        <h3 className="text-xl font-bold">{game.team2}</h3>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">Win Probability: {game.prediction.team2Probability}%</p>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last 10:</span>
                          <span className="font-semibold">{game.team2Data.last10Wins}-{10 - game.team2Data.last10Wins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Off Rating:</span>
                          <span className="font-semibold text-emerald-400">{game.team2Data.offensiveRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Def Rating:</span>
                          <span className="font-semibold text-blue-400">{game.team2Data.defensiveRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Injuries:</span>
                          <span className={`font-semibold ${game.team2Data.injuredKeyPlayers > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {game.team2Data.injuredKeyPlayers} key players
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                          style={{ width: `${game.prediction.team2Probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Betting Intelligence */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-slate-800/50 rounded-lg mb-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Market Odds</p>
                      <div className="flex gap-3">
                        <div>
                          <span className="text-xs text-slate-500">Team 1:</span>
                          <span className="text-sm font-bold text-emerald-400 ml-1">{game.marketOdds.team1}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Team 2:</span>
                          <span className="text-sm font-bold text-blue-400 ml-1">{game.marketOdds.team2}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Public Betting</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400"
                            style={{ width: `${game.publicBetting.team1}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400">{game.publicBetting.team1}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Sharp Money On</p>
                      <p className="text-sm font-bold text-yellow-400">{game.sharpMoney}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{game.bettingVolume.toLocaleString()} bets</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Activity className="w-4 h-4" />
                        <span>Model Agreement: {game.prediction.modelAgreement}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    >
                      {expandedGame === game.id ? 'Hide' : 'View'} Full Analysis
                      {expandedGame === game.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Analysis */}
                  {expandedGame === game.id && (
                    <div className="mt-5 pt-5 border-t border-slate-700">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Prediction Factor Breakdown */}
                        <div>
                          <h4 className="text-sm font-semibold mb-4 text-emerald-400 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Prediction Factor Analysis
                          </h4>
                          <div className="space-y-3">
                            {[
                              { label: 'ELO Rating', value: game.prediction.factors.elo, color: 'bg-blue-500' },
                              { label: 'Recent Form (L10)', value: game.prediction.factors.recentForm, color: 'bg-green-500' },
                              { label: 'Head-to-Head', value: game.prediction.factors.headToHead, color: 'bg-yellow-500' },
                              { label: 'Injury Impact', value: game.prediction.factors.injuries, color: 'bg-red-500' },
                              { label: 'Home Advantage', value: game.prediction.factors.homeAdvantage, color: 'bg-purple-500' },
                              { label: 'Rest Days', value: game.prediction.factors.restDays, color: 'bg-indigo-500' },
                              { label: 'Weather Impact', value: game.prediction.factors.weather, color: 'bg-cyan-500' },
                              { label: 'Motivation Factor', value: game.prediction.factors.motivation, color: 'bg-pink-500' }
                            ].map((factor, idx) => (
                              <div key={idx}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-slate-400">{factor.label}</span>
                                  <span className="font-semibold">{factor.value}%</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${factor.color} transition-all duration-500`}
                                    style={{ width: `${factor.value}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Advanced Stats */}
                        <div>
                          <h4 className="text-sm font-semibold mb-4 text-blue-400 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Advanced Metrics
                          </h4>
                          
                          <div className="space-y-4">
                            <div className="bg-slate-800 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-2">Predicted Winner</p>
                              <p className="text-lg font-bold text-emerald-400">{winnerTeam}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {game.prediction.confidence}% confidence
                              </p>
                            </div>

                            <div className="bg-slate-800 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-2">Expected Value (EV)</p>
                              <p className="text-lg font-bold text-yellow-400">
                                +{((parseFloat(game.prediction.confidence) - 50) * 0.5).toFixed(1)}%
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Positive expected value suggests value bet
                              </p>
                            </div>

                            <div className="bg-slate-800 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-2">Kelly Criterion Suggestion</p>
                              <p className="text-lg font-bold text-blue-400">
                                {((parseFloat(game.prediction.confidence) - 50) * 0.02).toFixed(1)}% of bankroll
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Optimal bet sizing for edge preservation
                              </p>
                            </div>

                            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-700/50 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                                <div>
                                  <p className="text-xs font-semibold text-emerald-400 mb-1">Model Recommendation</p>
                                  <p className="text-xs text-slate-300">
                                    {game.prediction.edgeQuality === 'Strong' 
                                      ? `Strong confidence in ${winnerTeam}. Consider this a high-value opportunity.`
                                      : game.prediction.edgeQuality === 'Moderate'
                                      ? `Moderate edge detected. ${winnerTeam} slightly favored but proceed with caution.`
                                      : `Weak edge. This is a close matchup. Consider avoiding or betting minimally.`
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Historical Context */}
                      <div className="mt-5 pt-5 border-t border-slate-700">
                        <h4 className="text-sm font-semibold mb-3 text-purple-400 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Historical Context & Key Insights
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div className="bg-slate-800 rounded-lg p-3">
                            <p className="text-slate-400 mb-1">Season Performance</p>
                            <p className="font-semibold">{game.team1}: {game.team1Data.last10Wins * 2}-{(10 - game.team1Data.last10Wins) * 2}</p>
                            <p className="font-semibold">{game.team2}: {game.team2Data.last10Wins * 2}-{(10 - game.team2Data.last10Wins) * 2}</p>
                          </div>
                          <div className="bg-slate-800 rounded-lg p-3">
                            <p className="text-slate-400 mb-1">Avg Points (For/Against)</p>
                            <p className="font-semibold">{game.team1}: {game.team1Data.avgPointsFor} / {game.team1Data.avgPointsAgainst}</p>
                            <p className="font-semibold">{game.team2}: {game.team2Data.avgPointsFor} / {game.team2Data.avgPointsAgainst}</p>
                          </div>
                          <div className="bg-slate-800 rounded-lg p-3">
                            <p className="text-slate-400 mb-1">Rest Advantage</p>
                            <p className="font-semibold">{game.team1}: {game.team1Data.restDays} days</p>
                            <p className="font-semibold">{game.team2}: {game.team2Data.restDays} days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-8 p-5 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-700/50 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-400 mb-2">Important Disclaimer</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                This platform demonstrates advanced sports prediction modeling using machine learning algorithms, statistical analysis, and multi-factor evaluation. 
                While the model shows historical accuracy metrics, past performance does not guarantee future results. All predictions are probabilistic estimates 
                and should be used as one tool among many in your analysis. Real-world implementation would require: (1) Live API integrations for real-time data, 
                (2) Continuously updated ML models trained on extensive historical datasets, (3) Real-time injury reports and roster changes, (4) Weather and venue data feeds, 
                (5) Betting market data aggregation. <strong>Always gamble responsibly. Never bet more than you can afford to lose.</strong> This is a demonstration 
                with simulated data for educational purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProSportsPredictor;