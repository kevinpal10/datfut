// match-analysis.page.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatchHeader }    from './component/match-header/match-header';
import { RivalAnalysis }  from './component/rival-analysis/rival-analysis';
import { FormationField } from './component/formation-field/formation-field';
import { TacticalKeys }   from './component/tactical-keys/tactical-keys';

import { MatchAnalysis } from './core/match.model';
import { MatchService }  from './services/match.service';

// ─── Mock data: Argentina vs Ecuador ────────────────────────────────────────
// Reemplaza esto conectando MatchService.getMatchAnalysis(matchId)
const MOCK_MATCH: MatchAnalysis = {
  id: 'arg-vs-ecu-wc2026',
  competition: 'Mundial 2026',
  phase: 'Fase de grupos',

  homeTeam: {
    id: 1,
    name: 'Argentina',
    shortName: 'ARG',
    flag: '🇦🇷',
    primaryColor: '#74ACDF',
  },
  awayTeam: {
    id: 2,
    name: 'Ecuador',
    shortName: 'ECU',
    flag: '🇪🇨',
    primaryColor: '#FFD100',
  },

  RivalAnalysisInterface: {
    recentForm: ['W', 'W', 'W', 'D', 'W', 'W', 'L', 'W', 'W', 'D'],
    stats: {
      wins: 8, draws: 1, losses: 1, gamesPlayed: 10,
      goalsPerGame: 2.4,
      possessionAvg: 64,
      goalsAgainstPerGame: 0.6,
    },
    strengths: [
      {
        title: 'Desborde por bandas',
        description: 'Di María y Mac Allister generan superioridad constante en los costados con subidas al espacio.',
        severity: 'high',
      },
      {
        title: 'Messi en espacios reducidos',
        description: 'Letal en zona 14. Asociación rápida y disparo o asistencia con mínimo contacto.',
        severity: 'high',
      },
      {
        title: 'Presión alta organizada',
        description: 'Recuperan en campo rival en menos de 6 segundos (PPDA 7.2 en clasificatorias).',
        severity: 'medium',
      },
    ],
    weaknesses: [
      {
        title: 'Espalda de los laterales',
        description: 'Molina y Tagliafico suben mucho. Gran espacio para explotar en transiciones rápidas.',
        severity: 'high',
      },
      {
        title: 'Balón parado defensivo',
        description: 'Concedieron 3 de sus últimos 8 goles en corners y tiros libres laterales.',
        severity: 'high',
      },
      {
        title: 'Dependencia de Messi',
        description: 'Cuando Messi no completa el partido, la creación ofensiva cae cerca del 40%.',
        severity: 'medium',
      },
    ],
  },

  proposedFormation: {
    scheme: '5-4-1',
    description: 'Bloque bajo',
    players: [
      // GK
      { id: 1, shortName: 'DOM', fullName: 'Hernán Domínguez', position: 'GK', role: 'gk', fieldX: 50, fieldY: 91 },
      // Defensa 5
      { id: 2, shortName: 'PAR', fullName: 'Piero Hincapié',   position: 'CB', role: 'def', fieldX: 23, fieldY: 80 },
      { id: 3, shortName: 'HIN', fullName: 'Jackson Porozo',    position: 'CB', role: 'def', fieldX: 50, fieldY: 80 },
      { id: 4, shortName: 'TOR', fullName: 'Diego Palacios',    position: 'CB', role: 'def', fieldX: 77, fieldY: 80 },
      { id: 5, shortName: 'ESC', fullName: 'Pervis Estupiñán',  position: 'WB', role: 'def', fieldX: 11, fieldY: 64 },
      { id: 6, shortName: 'ANG', fullName: 'Angelo Preciado',   position: 'WB', role: 'def', fieldX: 89, fieldY: 64 },
      // Mediocampo 4
      { id: 7,  shortName: 'CAI', fullName: 'Jhegson Méndez',   position: 'CDM', role: 'mid', fieldX: 23, fieldY: 51 },
      { id: 8,  shortName: 'GRU', fullName: 'Moisés Caicedo',   position: 'CM',  role: 'mid', fieldX: 40, fieldY: 55 },
      { id: 9,  shortName: 'MEN', fullName: 'Kendry Páez',      position: 'CM',  role: 'mid', fieldX: 60, fieldY: 55 },
      { id: 10, shortName: 'PLT', fullName: 'Jeremy Sarmiento', position: 'LW',  role: 'mid', fieldX: 77, fieldY: 51 },
      // Delantero
      { id: 11, shortName: 'VAL', fullName: 'Enner Valencia',   position: 'ST',  role: 'fwd', fieldX: 50, fieldY: 36 },
    ],
  },

  tacticalKeys: [
    {
      title: 'Bloque bajo + salida rápida',
      description: 'Ceder posesión, compactar líneas y atacar verticalmente por la espalda de Molina y Tagliafico.',
      type: 'defense',
    },
    {
      title: 'Balón parado como arma',
      description: 'Preparar 3–4 variantes de corner. Argentina es vulnerable en segundas jugadas defensivas.',
      type: 'setpiece',
    },
    {
      title: 'Aislar a Messi',
      description: 'Doble marca en zona 14 siempre que reciba. Si Messi no toca en campo propio, Argentina pierde fluidez.',
      type: 'pressing',
    },
    {
      title: 'Transición veloz por izquierda',
      description: 'Estupiñán puede explotar el espacio que deja Molina con Valencia como referencia de profundidad.',
      type: 'attack',
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-match-analysis-page',
  standalone: true,
  imports: [
    CommonModule,
    MatchHeader,
    RivalAnalysis,
    FormationField,
    TacticalKeys,
  ],
  template: `
    @if (match()) {
      <div class="dashboard">

        <!-- Header -->
        <app-match-header
          [homeTeam]="match()!.homeTeam"
          [awayTeam]="match()!.awayTeam"
          [competition]="match()!.competition"
          [phase]="match()!.phase"
          [scheme]="match()!.proposedFormation.scheme"
        />

        <!-- Body: 2 columnas -->
        <div class="body-grid">

          <!-- Col izquierda: análisis del rival -->
          
          <app-rival-analysis
            [analysis]="match()!.RivalAnalysisInterface"
            [teamName]="match()!.homeTeam.name"
          />

          <!-- Col derecha: alineación + claves -->
          <div class="right-col">
            <app-formation-field
              [formation]="match()!.proposedFormation"
              [teamName]="match()!.awayTeam.name"
            />
          </div>
        </div>

        <!-- Claves tácticas: ancho completo -->
        <app-tactical-keys [keys]="match()!.tacticalKeys" />

      </div>
    } @else {
      <div class="loading">Cargando análisis...</div>
    }
  `,
  styles: [`
    .dashboard {
      font-family: 'DM Sans', sans-serif;
      border-radius: 12px;
      border: 0.5px solid var(--color-border-tertiary);
      overflow: hidden;
      background: var(--color-background-tertiary);
    }
    .body-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-top: none;
    }
    .right-col {
      border-left: 0.5px solid var(--color-border-tertiary);
    }
    .loading {
      padding: 40px;
      text-align: center;
      color: var(--color-text-secondary);
    }
  `]
})
export class MatchAnalysisPage implements OnInit {
  private route = inject(ActivatedRoute);
  private matchService = inject(MatchService);

  match = signal<MatchAnalysis | null>(MOCK_MATCH);

  ngOnInit(): void {
    // Cuando conectes ApiFast, descomenta esto:
    // const matchId = this.route.snapshot.paramMap.get('matchId')!;
    // this.matchService.getMatchAnalysis(matchId).subscribe(data => {
    //   this.match.set(data);
    // });
  }
}
