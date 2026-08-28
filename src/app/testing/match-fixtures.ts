import {
  Formation,
  RivalAnalysisInterface,
  TacticalKey,
  TeamInfo,
} from '../core/match.model';

/**
 * Datos mínimos para instanciar los componentes de análisis de partido, que
 * declaran sus entradas con `input.required` y fallan con NG0950 si se crean
 * sin ellas.
 */

export const EQUIPO_LOCAL: TeamInfo = {
  id: 1,
  name: 'Argentina',
  shortName: 'ARG',
  flag: '🇦🇷',
  primaryColor: '#74ACDF',
};

export const EQUIPO_VISITANTE: TeamInfo = {
  id: 2,
  name: 'Ecuador',
  shortName: 'ECU',
  flag: '🇪🇨',
  primaryColor: '#FFD100',
};

export const ANALISIS_RIVAL: RivalAnalysisInterface = {
  recentForm: ['W', 'D', 'L'],
  stats: {
    goalsPerGame: 2.4,
    possessionAvg: 64,
    goalsAgainstPerGame: 0.6,
    wins: 8,
    draws: 1,
    losses: 1,
    gamesPlayed: 10,
  },
  strengths: [
    { title: 'Desborde por bandas', description: 'Superioridad en los costados.', severity: 'high' },
  ],
  weaknesses: [
    { title: 'Espalda de los laterales', description: 'Espacio en transiciones.', severity: 'high' },
  ],
};

export const FORMACION: Formation = {
  scheme: '5-4-1',
  description: 'Bloque bajo',
  players: [
    { id: 1, shortName: 'DOM', fullName: 'Hernán Domínguez', position: 'GK', role: 'gk', fieldX: 50, fieldY: 91 },
    { id: 2, shortName: 'HIN', fullName: 'Piero Hincapié', position: 'CB', role: 'def', fieldX: 23, fieldY: 80 },
    { id: 3, shortName: 'CAI', fullName: 'Moisés Caicedo', position: 'CM', role: 'mid', fieldX: 40, fieldY: 55 },
    { id: 4, shortName: 'VAL', fullName: 'Enner Valencia', position: 'ST', role: 'fwd', fieldX: 50, fieldY: 36 },
  ],
};

export const CLAVES_TACTICAS: TacticalKey[] = [
  { title: 'Bloque bajo', description: 'Compactar líneas.', type: 'defense' },
  { title: 'Balón parado', description: 'Preparar variantes de corner.', type: 'setpiece' },
];
