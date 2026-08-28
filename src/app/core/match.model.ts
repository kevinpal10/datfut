// ─── Match Analysis Models ───────────────────────────────────────────────────

export interface MatchAnalysis {
  id: string;
  competition: string;
  phase: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  RivalAnalysisInterface: RivalAnalysisInterface;
  proposedFormation: Formation;
  tacticalKeys: TacticalKey[];
}

export interface TeamInfo {
  id: number;
  name: string;
  shortName: string;
  flag: string;       // emoji or URL
  primaryColor: string;
}

export interface RivalAnalysisInterface {
  recentForm: MatchResult[];      // últimos partidos ['W','W','D','L',...]
  stats: RivalStats;
  strengths: AnalysisPoint[];
  weaknesses: AnalysisPoint[];
}

export interface RivalStats {
  goalsPerGame: number;
  possessionAvg: number;
  goalsAgainstPerGame: number;
  wins: number;
  draws: number;
  losses: number;
  gamesPlayed: number;
}

export interface AnalysisPoint {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';  // para color del dot
}

export interface Formation {
  scheme: string;             // e.g. '5-4-1'
  description: string;
  players: FieldPlayer[];
}

export interface FieldPlayer {
  id: number;
  shortName: string;
  fullName: string;
  position: PlayerPosition;
  fieldX: number;   // 0-100 (% del ancho del campo)
  fieldY: number;   // 0-100 (% del alto del campo)
  role: 'gk' | 'def' | 'mid' | 'fwd';
}

export type PlayerPosition = 'GK' | 'CB' | 'RB' | 'LB' | 'WB' | 'CDM' | 'CM' | 'CAM' | 'RW' | 'LW' | 'ST' | 'CF';
export type MatchResult = 'W' | 'D' | 'L';

export interface TacticalKey {
  title: string;
  description: string;
  type: 'attack' | 'defense' | 'setpiece' | 'pressing';
}
