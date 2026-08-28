import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerComponent } from './player';
import { PlayerStatistic } from './player.model';
import { providersDePrueba } from '../../testing/test-providers';

/**
 * Construye una entrada de `statistics[]` con la forma de api-football.
 * Casi todos los campos numéricos pueden ser `null`, así que el valor por
 * defecto refleja eso y cada prueba rellena sólo lo que le interesa.
 */
function estadistica(overrides: any = {}): PlayerStatistic {
  const base: any = {
    team: { id: 50, name: 'Manchester City', logo: '' },
    league: { id: 39, name: 'Premier League', country: 'England', logo: '', flag: '', season: 2024 },
    games: { appearences: null, lineups: null, minutes: null, number: null,
             position: 'Attacker', rating: null, captain: false },
    goals: { total: null, conceded: null, assists: null, saves: null },
    shots: { total: null, on: null },
    passes: { total: null, key: null, accuracy: null },
    tackles: { total: null, blocks: null, interceptions: null },
    duels: { total: null, won: null },
    dribbles: { attempts: null, success: null, past: null },
    fouls: { drawn: null, committed: null },
    cards: { yellow: null, yellowred: null, red: null },
    penalty: { won: null, commited: null, scored: null, missed: null, saved: null },
    substitutes: { in: null, out: null, bench: null },
  };
  return { ...base, ...overrides } as PlayerStatistic;
}

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerComponent],
      providers: providersDePrueba({
        params: { id: '184' },
        queryParams: { season: '2024' },
      }),
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('toma el jugador y la temporada de la navegación', () => {
    expect(component.playerId).toBe(184);
    expect(component.season).toBe(2024);
  });

  // ── Métricas por posición ──────────────────────────────────────────────

  it('un delantero ve goles y asistencias', () => {
    const stat = estadistica({
      games: { ...estadistica().games, appearences: 31, minutes: 2650 },
      goals: { total: 27, conceded: null, assists: 3, saves: null },
    });
    const etiquetas = component.getStatCards(stat).map(c => c.lbl);
    expect(etiquetas).toContain('Goles');
    expect(etiquetas).toContain('Asistencias');
    expect(etiquetas).not.toContain('Atajadas');
  });

  it('un portero ve atajadas y goles recibidos en su lugar', () => {
    const stat = estadistica({
      games: { ...estadistica().games, position: 'Goalkeeper', appearences: 30 },
      goals: { total: null, conceded: 22, assists: null, saves: 88 },
    });
    const etiquetas = component.getStatCards(stat).map(c => c.lbl);
    expect(etiquetas).toContain('Atajadas');
    expect(etiquetas).toContain('Recibidos');
    expect(etiquetas).not.toContain('Goles');
  });

  it('los anillos de un delantero incluyen la precisión de tiro', () => {
    const stat = estadistica({ shots: { total: 95, on: 48 } } as any);
    const anillos = component.getRatioMetrics(stat);
    const tiros = anillos.find((m: any) => m.label === 'Tiros a puerta');
    expect(tiros).toBeDefined();
    expect(tiros!.pct).toBe(51);   // 48 / 95
  });

  it('los anillos de un defensa priorizan duelos, no tiros', () => {
    const stat = estadistica({
      games: { ...estadistica().games, position: 'Defender' },
      duels: { total: 200, won: 120 },
    });
    const etiquetas = component.getRatioMetrics(stat).map((m: any) => m.label);
    expect(etiquetas).toContain('Duelos');
    expect(etiquetas).not.toContain('Tiros a puerta');
  });

  it('no divide por cero cuando faltan datos', () => {
    expect(component.pct(null, 10)).toBeNull();
    expect(component.pct(5, null)).toBeNull();
    expect(component.pct(5, 0)).toBeNull();
    expect(component.pct(5, 10)).toBe(50);
  });

  it('formatea los huecos con guion en lugar de "null"', () => {
    expect(component.fmt(null)).toBe('—');
    expect(component.fmt(0)).toBe('0');
  });

  // ── Resumen agregado ───────────────────────────────────────────────────

  it('el resumen suma las competiciones y pondera el rating por apariciones', () => {
    component.playerData = {
      player: {} as any,
      statistics: [
        estadistica({
          games: { ...estadistica().games, appearences: 30, minutes: 2700, rating: '8.0' },
          goals: { total: 20, conceded: null, assists: 5, saves: null },
        }),
        estadistica({
          league: { ...estadistica().league, id: 2, name: 'Champions League' },
          games: { ...estadistica().games, appearences: 10, minutes: 900, rating: '6.0' },
          goals: { total: 7, conceded: null, assists: 1, saves: null },
        }),
      ],
    } as any;

    const resumen = component.getOverallStats()!;
    const porEtiqueta = (lbl: string) => resumen.statCards.find(c => c.lbl === lbl)!.num;

    expect(porEtiqueta('Partidos')).toBe('40');
    expect(porEtiqueta('Goles')).toBe('27');
    expect(porEtiqueta('Asistencias')).toBe('6');

    // (8.0*30 + 6.0*10) / 40 = 7.5  ->  75 %
    const rating = resumen.ringMetrics.find((m: any) => m.label === 'Rating');
    expect(rating.pct).toBe(75);
  });

  it('el resumen es nulo si el jugador no tiene competiciones', () => {
    component.playerData = { player: {} as any, statistics: [] } as any;
    expect(component.getOverallStats()).toBeNull();
  });

  // ── Radar SVG ──────────────────────────────────────────────────────────

  it('el radar sólo dibuja con al menos tres ejes', () => {
    spyOn(component, 'currentRingMetrics').and.returnValue([
      { pct: 50, label: 'Tiros a puerta' }, { pct: 60, label: 'Regates' },
    ] as any);
    expect(component.getRadarMetrics()).toEqual([]);
  });

  it('el polígono del radar produce un punto por métrica', () => {
    const metricas = [
      { label: 'Tiros', value: 50 },
      { label: 'Regates', value: 60 },
      { label: 'Rating', value: 70 },
    ];
    const puntos = component.radarDataPolygon(metricas).split(' ');
    expect(puntos.length).toBe(3);
    expect(puntos[0]).toMatch(/^\d+(\.\d+)?,\d+(\.\d+)?$/);
  });
});
