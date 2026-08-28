import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Statistics } from '../../services/statistics/statistics';
import { PlayerDetail, PlayerStatistic } from './player.model';
import { RingGaugeComponent } from '../ring-gauge/ring-gauge';

interface RadarMetric { label: string; value: number; }
interface StatCard { num: string; lbl: string; color: string; }

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, RingGaugeComponent],
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class PlayerComponent implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private statisticsService = inject(Statistics);

  playerData: PlayerDetail | null = null;
  activeStatistic: PlayerStatistic | null = null;
  activeIndex = 0;
  showOverall = false;
  loading = true;

  // ── Colores semáforo (tema oscuro) ──────────────────────────────────────
  readonly C_GREEN  = '#25C893';
  readonly C_AMBER  = '#F0B860';
  readonly C_RED    = '#F56C6C';
  readonly BG_GREEN = 'rgba(37,200,147,0.15)';
  readonly BG_AMBER = 'rgba(239,159,39,0.15)';
  readonly BG_RED   = 'rgba(245,108,108,0.15)';

  ngOnInit(): void {
    const playerId = Number(this.route.snapshot.paramMap.get('id'));
    const season   = Number(this.route.snapshot.queryParamMap.get('season')) || 2024;

    this.statisticsService.getPlayerStats(playerId, season).subscribe({
      next: (data: any) => {
        this.playerData = data[0];
        this.activeStatistic = data[0].statistics?.[0] ?? null;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  // ── Selección de liga / resumen ──────────────────────────────────────────
  selectLeague(index: number | 'overall'): void {
    if (index === 'overall') {
      this.showOverall = true;
      this.activeIndex = -1;
    } else {
      this.showOverall = false;
      this.activeIndex = index;
      this.activeStatistic = this.playerData!.statistics[index];
    }
  }

  goBack(): void { this.router.navigate(['/paises']); }

  // ── Wrappers: elige entre liga activa o resumen ──────────────────────────
  currentStatCards(): StatCard[] {
    if (this.showOverall) return this.getOverallStats()?.statCards ?? [];
    return this.activeStatistic ? this.getStatCards(this.activeStatistic) : [];
  }

  currentRingMetrics() {
    if (this.showOverall) return this.getOverallStats()?.ringMetrics ?? [];
    return this.activeStatistic ? this.getRatioMetrics(this.activeStatistic) : [];
  }

  // ════════════════════════════════════════════════════════════════════════
  // RADAR
  // ════════════════════════════════════════════════════════════════════════
  getRadarMetrics(): RadarMetric[] {
    const rings = this.currentRingMetrics();
    // Toma hasta 6 métricas con su pct (null → 0)
    const base = rings.map((r: any) => ({ label: r.label.split(' ')[0], value: r.pct ?? 0 }));
    // Asegura mínimo 3 ejes para que el polígono tenga forma
    return base.length >= 3 ? base : [];
  }

  private radarPoint(index: number, total: number, scale: number) {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = 105 * scale;
    return { x: 150 + radius * Math.cos(angle), y: 140 + radius * Math.sin(angle) };
  }

  radarPolygon(metrics: RadarMetric[], scale: number): string {
    return metrics.map((_, i) => {
      const p = this.radarPoint(i, metrics.length, scale);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
  }

  radarAxes(metrics: RadarMetric[]) {
    return metrics.map((_, i) => this.radarPoint(i, metrics.length, 1));
  }

  radarDataPolygon(metrics: RadarMetric[]): string {
    return metrics.map((m, i) => {
      const p = this.radarPoint(i, metrics.length, Math.max(m.value, 5) / 100);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
  }

  radarDataPoints(metrics: RadarMetric[]) {
    return metrics.map((m, i) => this.radarPoint(i, metrics.length, Math.max(m.value, 5) / 100));
  }

  radarLabels(metrics: RadarMetric[]) {
    return metrics.map((m, i) => {
      const p = this.radarPoint(i, metrics.length, 1.18);
      let anchor = 'middle';
      if (p.x < 140) anchor = 'end';
      else if (p.x > 160) anchor = 'start';
      return { label: m.label, x: p.x.toFixed(1), y: (p.y + 3).toFixed(1), anchor };
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // STAT CARDS
  // ════════════════════════════════════════════════════════════════════════
  getStatCards(s: PlayerStatistic): StatCard[] {
    const isGK = this.isGoalkeeper(s);
    return [
      { num: this.fmt(s.games.appearences), lbl: 'Partidos', color: this.C_AMBER },
      { num: this.fmt(s.games.minutes),     lbl: 'Minutos',  color: this.C_AMBER },
      isGK ? { num: this.fmt(s.goals.saves), lbl: 'Atajadas', color: this.C_GREEN }
           : { num: this.fmt(s.goals.total), lbl: 'Goles',    color: this.C_GREEN },
      isGK ? { num: this.fmt(s.goals.conceded), lbl: 'Recibidos', color: this.C_RED }
           : { num: this.fmt(s.goals.assists),  lbl: 'Asistencias', color: this.C_GREEN },
      { num: this.fmt(s.cards.yellow), lbl: 'Amarillas', color: this.C_RED },
      { num: this.fmt(s.cards.red),    lbl: 'Rojas',     color: this.C_RED },
    ];
  }

  // ════════════════════════════════════════════════════════════════════════
  // EFECTIVIDADES (anillos)
  // ════════════════════════════════════════════════════════════════════════
  getRatioMetrics(s: PlayerStatistic) {
    const position = s.games.position;
    const dribP  = this.pct(s.dribbles.success, s.dribbles.attempts);
    const duelsP = this.pct(s.duels.won, s.duels.total);
    const shotsP = this.pct(s.shots.on, s.shots.total);
    const penShots = (s.penalty.scored ?? 0) + (s.penalty.missed ?? 0);
    const penP     = penShots ? Math.round(((s.penalty.scored ?? 0) / penShots) * 100) : null;
    const penSaveP = this.pct(s.penalty.saved, s.penalty.commited);
    const ratingP  = s.games.rating ? Math.round(parseFloat(s.games.rating) / 10 * 100) : null;
    const ratingDetail = s.games.rating ? `${parseFloat(s.games.rating).toFixed(2)} / 10` : '';

    switch (position) {
      case 'Attacker':
        return [
          { pct: shotsP, color: this.C_GREEN, label: 'Tiros a puerta', detail: this.ratioDetail(s.shots.on, s.shots.total) },
          { pct: dribP,  color: this.C_GREEN, label: 'Regates',        detail: this.ratioDetail(s.dribbles.success, s.dribbles.attempts) },
          { pct: penP,   color: this.C_GREEN, label: 'Penales',        detail: this.ratioDetail(s.penalty.scored, penShots || null) },
          { pct: ratingP,color: this.C_AMBER, label: 'Rating',         detail: ratingDetail },
        ];
      case 'Midfielder':
        return [
          { pct: s.passes.accuracy, color: this.C_GREEN, label: 'Pases', detail: '' },
          { pct: dribP,  color: this.C_GREEN, label: 'Regates', detail: this.ratioDetail(s.dribbles.success, s.dribbles.attempts) },
          { pct: penP,   color: this.C_GREEN, label: 'Penales', detail: this.ratioDetail(s.penalty.scored, penShots || null) },
          { pct: ratingP,color: this.C_AMBER, label: 'Rating',  detail: ratingDetail },
        ];
      case 'Defender':
        return [
          { pct: duelsP, color: this.C_GREEN, label: 'Duelos', detail: this.ratioDetail(s.duels.won, s.duels.total) },
          { pct: s.passes.accuracy, color: this.C_GREEN, label: 'Pases', detail: '' },
          { pct: ratingP,color: this.C_AMBER, label: 'Rating', detail: ratingDetail },
        ];
      default: // Goalkeeper
        return [
          { pct: penSaveP, color: this.C_GREEN, label: 'Penales', detail: this.ratioDetail(s.penalty.saved, s.penalty.commited) },
          { pct: s.passes.accuracy, color: this.C_AMBER, label: 'Pases', detail: '' },
          { pct: duelsP,   color: this.C_AMBER, label: 'Duelos', detail: this.ratioDetail(s.duels.won, s.duels.total) },
          { pct: ratingP,  color: this.C_AMBER, label: 'Rating', detail: ratingDetail },
        ];
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // VOLUMEN DE JUEGO (tarjetas numéricas)
  // ════════════════════════════════════════════════════════════════════════
  getCountMetrics(s: PlayerStatistic) {
    switch (s.games.position) {
      case 'Attacker':
        return [
          { icon: '🔑', bg: this.BG_GREEN, num: this.fmt(s.passes.key),            lbl: 'Pases clave' },
          { icon: '🤸', bg: this.BG_AMBER, num: this.fmt(s.fouls.drawn),           lbl: 'Faltas recibidas' },
          { icon: '🛡️', bg: this.BG_AMBER, num: this.fmt(s.tackles.total),         lbl: 'Tackles' },
          { icon: '✋', bg: this.BG_AMBER, num: this.fmt(s.tackles.interceptions), lbl: 'Intercepciones' },
        ];
      case 'Midfielder':
        return [
          { icon: '🔑', bg: this.BG_GREEN, num: this.fmt(s.passes.key),            lbl: 'Pases clave' },
          { icon: '🛡️', bg: this.BG_AMBER, num: this.fmt(s.tackles.total),         lbl: 'Tackles' },
          { icon: '✋', bg: this.BG_AMBER, num: this.fmt(s.tackles.interceptions), lbl: 'Intercepciones' },
          { icon: '🤸', bg: this.BG_AMBER, num: this.fmt(s.fouls.drawn),           lbl: 'Faltas recibidas' },
        ];
      case 'Defender':
        return [
          { icon: '🛡️', bg: this.BG_GREEN, num: this.fmt(s.tackles.total),         lbl: 'Tackles' },
          { icon: '✋', bg: this.BG_GREEN, num: this.fmt(s.tackles.interceptions), lbl: 'Intercepciones' },
          { icon: '🧱', bg: this.BG_GREEN, num: this.fmt(s.tackles.blocks),        lbl: 'Bloqueos' },
          { icon: '🚫', bg: this.BG_RED,   num: this.fmt(s.fouls.committed),       lbl: 'Faltas cometidas' },
        ];
      default: // Goalkeeper
        return [
          { icon: '🧤', bg: this.BG_GREEN, num: this.fmt(s.goals.saves),    lbl: 'Atajadas' },
          { icon: '🚫', bg: this.BG_RED,   num: this.fmt(s.goals.conceded), lbl: 'Goles recibidos' },
          { icon: '🟨', bg: this.BG_RED,   num: this.fmt(s.cards.yellow),   lbl: 'Amarillas' },
        ];
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // RESUMEN GENERAL (suma todas las ligas)
  // ════════════════════════════════════════════════════════════════════════
  getOverallStats() {
    if (!this.playerData?.statistics?.length) return null;
    const stats = this.playerData.statistics;
    const position = stats[0]?.games?.position;
    const isGK = position === 'Goalkeeper';
    const sum = (fn: (s: any) => number | null) => stats.reduce((a: number, s: any) => a + (fn(s) ?? 0), 0);

    const tGames = sum(s => s.games.appearences);
    const tMin   = sum(s => s.games.minutes);
    const tGoals = sum(s => s.goals.total);
    const tAst   = sum(s => s.goals.assists);
    const tSaves = sum(s => s.goals.saves);
    const tConc  = sum(s => s.goals.conceded);
    const tYel   = sum(s => s.cards.yellow);
    const tRed   = sum(s => s.cards.red);
    const tShots = sum(s => s.shots.total);
    const tShotsOn = sum(s => s.shots.on);
    const tDribA = sum(s => s.dribbles.attempts);
    const tDribS = sum(s => s.dribbles.success);
    const tDuels = sum(s => s.duels.total);
    const tDuelsW = sum(s => s.duels.won);
    const tPenS  = sum(s => s.penalty.scored);
    const tPenM  = sum(s => s.penalty.missed);
    const tPenSv = sum(s => s.penalty.saved);
    const tPenC  = sum(s => s.penalty.commited);

    const ratingStats = stats.filter((s: any) => s.games.rating && s.games.appearences);
    const avgRating = ratingStats.length
      ? ratingStats.reduce((a: number, s: any) => a + parseFloat(s.games.rating) * s.games.appearences, 0) /
        ratingStats.reduce((a: number, s: any) => a + s.games.appearences, 0)
      : null;
    const passStats = stats.filter((s: any) => s.passes.accuracy !== null && s.passes.accuracy !== undefined);
    const avgPass = passStats.length
      ? Math.round(passStats.reduce((a: number, s: any) => a + s.passes.accuracy, 0) / passStats.length) : null;

    const statCards: StatCard[] = [
      { num: this.fmt(tGames), lbl: 'Partidos', color: this.C_AMBER },
      { num: this.fmt(tMin),   lbl: 'Minutos',  color: this.C_AMBER },
      isGK ? { num: this.fmt(tSaves), lbl: 'Atajadas', color: this.C_GREEN } : { num: this.fmt(tGoals), lbl: 'Goles', color: this.C_GREEN },
      isGK ? { num: this.fmt(tConc), lbl: 'Recibidos', color: this.C_RED } : { num: this.fmt(tAst), lbl: 'Asistencias', color: this.C_GREEN },
      { num: this.fmt(tYel), lbl: 'Amarillas', color: this.C_RED },
      { num: this.fmt(tRed), lbl: 'Rojas',     color: this.C_RED },
    ];

    const shotsP = tShots ? Math.round(tShotsOn / tShots * 100) : null;
    const dribP  = tDribA ? Math.round(tDribS / tDribA * 100) : null;
    const duelsP = tDuels ? Math.round(tDuelsW / tDuels * 100) : null;
    const penShots = tPenS + tPenM;
    const penP   = penShots ? Math.round(tPenS / penShots * 100) : null;
    const penSvP = tPenC ? Math.round(tPenSv / tPenC * 100) : null;
    const ratingP = avgRating ? Math.round(avgRating / 10 * 100) : null;
    const rDet = avgRating ? `${avgRating.toFixed(2)} / 10` : '';

    let ringMetrics: any[] = [];
    switch (position) {
      case 'Attacker':
        ringMetrics = [
          { pct: shotsP, color: this.C_GREEN, label: 'Tiros a puerta', detail: this.ratioDetail(tShotsOn, tShots) },
          { pct: dribP,  color: this.C_GREEN, label: 'Regates',        detail: this.ratioDetail(tDribS, tDribA) },
          { pct: penP,   color: this.C_GREEN, label: 'Penales',        detail: this.ratioDetail(tPenS, penShots || null) },
          { pct: ratingP,color: this.C_AMBER, label: 'Rating',         detail: rDet },
        ]; break;
      case 'Midfielder':
        ringMetrics = [
          { pct: avgPass, color: this.C_GREEN, label: 'Pases',   detail: '' },
          { pct: dribP,   color: this.C_GREEN, label: 'Regates', detail: this.ratioDetail(tDribS, tDribA) },
          { pct: penP,    color: this.C_GREEN, label: 'Penales', detail: this.ratioDetail(tPenS, penShots || null) },
          { pct: ratingP, color: this.C_AMBER, label: 'Rating',  detail: rDet },
        ]; break;
      case 'Defender':
        ringMetrics = [
          { pct: duelsP,  color: this.C_GREEN, label: 'Duelos', detail: this.ratioDetail(tDuelsW, tDuels) },
          { pct: avgPass, color: this.C_GREEN, label: 'Pases',  detail: '' },
          { pct: ratingP, color: this.C_AMBER, label: 'Rating', detail: rDet },
        ]; break;
      default:
        ringMetrics = [
          { pct: penSvP,  color: this.C_GREEN, label: 'Penales', detail: this.ratioDetail(tPenSv, tPenC || null) },
          { pct: avgPass, color: this.C_AMBER, label: 'Pases',   detail: '' },
          { pct: duelsP,  color: this.C_AMBER, label: 'Duelos',  detail: this.ratioDetail(tDuelsW, tDuels) },
          { pct: ratingP, color: this.C_AMBER, label: 'Rating',  detail: rDet },
        ];
    }

    return { isGK, leagues: stats.map((s: { league: { name: any; }; }) => s.league.name), statCards, ringMetrics };
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  isGoalkeeper(s: PlayerStatistic): boolean { return s.games.position === 'Goalkeeper'; }

  pct(won: number | null, total: number | null): number | null {
    if (!won || !total) return null;
    return Math.round((won / total) * 100);
  }

  ratioDetail(success: number | null, total: number | null): string {
    if (success === null || success === undefined || !total) return '';
    return `${success} / ${total}`;
  }

  fmt(val: number | string | null): string {
    if (val === null || val === undefined) return '—';
    return `${val}`;
  }

  positionLabel(position: string): string {
    const map: Record<string, string> = {
      'Goalkeeper': 'Portero', 'Defender': 'Defensa',
      'Midfielder': 'Mediocampista', 'Attacker': 'Delantero',
    };
    return map[position] ?? position;
  }
}