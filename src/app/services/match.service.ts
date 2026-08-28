import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MatchAnalysis, RivalStats, Formation } from '../core/match.model';
import { environment } from '../enviroment/environment';

// ─── Shapes de respuesta de ApiFast ──────────────────────────────────────────
// Tu ApiFast actúa como BFF: recibe estos endpoints y devuelve
// datos ya transformados desde ApiFootball.

interface ApiFastMatchResponse {
  matchId: string;
  competition: string;
  phase: string;
  homeTeam: any;
  awayTeam: any;
  rivalStats: any;
  recentForm: string[];     // ['W','W','D','L','W']
}

@Injectable({ providedIn: 'root' })
export class MatchService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;   // http://localhost:8000 o prod URL

  // ── Obtiene análisis completo de un partido ───────────────────────────────
  getMatchAnalysis(matchId: string): Observable<MatchAnalysis> {
    return this.http
      .get<ApiFastMatchResponse>(`${this.base}/matches/${matchId}/analysis`)
      .pipe(map(res => this.mapToMatchAnalysis(res)));
  }

  // ── Estadísticas de un equipo (últimos N partidos) ────────────────────────
  getTeamStats(teamId: number, last: number = 10): Observable<RivalStats> {
    return this.http.get<RivalStats>(
      `${this.base}/teams/${teamId}/stats?last=${last}`
    );
  }

  // ── Formación propuesta guardada por el analista ──────────────────────────
  getProposedFormation(matchId: string): Observable<Formation> {
    return this.http.get<Formation>(
      `${this.base}/matches/${matchId}/formation`
    );
  }

  // ─── Mapper ApiFast → modelo interno ─────────────────────────────────────
  private mapToMatchAnalysis(res: ApiFastMatchResponse): MatchAnalysis {
    return {
      id: res.matchId,
      competition: res.competition,
      phase: res.phase,
      homeTeam: res.homeTeam,
      awayTeam: res.awayTeam,
      RivalAnalysisInterface: {
        recentForm: res.recentForm as any[],
        stats: res.rivalStats,
        strengths: [],    // puedes poblar desde el backend o hardcodear por video
        weaknesses: [],
      },
      proposedFormation: {
        scheme: '5-4-1',
        description: 'Bloque bajo con salida rápida',
        players: [],
      },
      tacticalKeys: [],
    };
  }
}
