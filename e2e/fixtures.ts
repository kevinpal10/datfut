import { Page } from '@playwright/test';

import { environment } from '../src/app/environments/environment';

/**
 * Respuestas fijas del backend para las pruebas E2E.
 *
 * Se copian de respuestas reales de api-football recortadas: mantienen la forma
 * exacta que consume el frontend (envoltura por índice, campos `null`, posición
 * en inglés). Si el contrato del backend cambia, estas fixtures se quedan
 * obsoletas y hay que actualizarlas — que es justo la señal que se quiere.
 */

const API = environment.apiUrl;

export const PAISES = [
  { name: 'Ecuador', code: 'EC', flag: 'https://media.api-sports.io/flags/ec.svg' },
  { name: 'Spain', code: 'ES', flag: 'https://media.api-sports.io/flags/es.svg' },
];

export const SELECCION_ECUADOR = [
  {
    team: { id: 2382, name: 'Ecuador', code: 'ECU', country: 'Ecuador', founded: 1925, national: true, logo: '' },
    venue: { id: null, name: null, address: null, city: null, capacity: null, surface: null, image: null },
  },
];

export const LIGAS_ECUADOR = [
  {
    league: { id: 242, name: 'Liga Pro', type: 'League', logo: '' },
    country: { name: 'Ecuador', code: 'EC', flag: '' },
    // 2025 a proposito: DEFAULT_SEASON es 2024, asi que si la temporada se
    // pierde en algun salto la navegacion cae a 2024 y el E2E lo detecta.
    seasons: [{ year: 2025, start: '', end: '', current: true, coverage: {} }],
  },
];

export const EQUIPOS_LIGA_PRO = [
  {
    team: { id: 2382, name: 'Barcelona SC', code: 'BSC', country: 'Ecuador', founded: 1925, national: false, logo: '' },
    venue: { id: 1, name: 'Monumental', address: '', city: 'Guayaquil', capacity: 59283, surface: 'grass', image: '' },
  },
];

export const PLANTILLA = [
  {
    team: { id: 2382, name: 'Ecuador', logo: '' },
    players: [
      { id: 1100, name: 'E. Haaland', age: 25, number: 9, position: 'Attacker', photo: '' },
      { id: 2001, name: 'M. Caicedo', age: 23, number: 5, position: 'Midfielder', photo: '' },
    ],
  },
];

export const BUSQUEDA_HAALAND = [
  {
    player_id: 1100,
    name: 'E. Haaland',
    firstname: 'Erling',
    lastname: 'Braut Haaland',
    age: 25,
    nationality: 'Norway',
    position: 'Attacker',
    photo: '',
  },
];

export const ESTADISTICAS_HAALAND = [
  {
    player: {
      id: 1100, name: 'E. Haaland', firstname: 'Erling', lastname: 'Braut Haaland',
      age: 25, birth: { date: '2000-07-21', place: 'Leeds', country: 'England' },
      nationality: 'Norway', height: '195', weight: '88', injured: false, photo: '',
    },
    statistics: [
      {
        team: { id: 50, name: 'Manchester City', logo: '' },
        league: { id: 39, name: 'Premier League', country: 'England', logo: '', flag: '', season: 2024 },
        games: { appearences: 32, lineups: 30, minutes: 2741, number: null, position: 'Attacker', rating: '7.254838', captain: false },
        goals: { total: 22, conceded: null, assists: 3, saves: null },
        shots: { total: 92, on: 60 },
        passes: { total: 480, key: 29, accuracy: 74 },
        tackles: { total: 12, blocks: null, interceptions: 5 },
        duels: { total: 300, won: 120 },
        dribbles: { attempts: 33, success: 13, past: null },
        fouls: { drawn: 13, committed: 20 },
        cards: { yellow: 2, yellowred: 0, red: 0 },
        penalty: { won: null, commited: null, scored: 3, missed: 1, saved: null },
        substitutes: { in: 2, out: 8, bench: 3 },
      },
    ],
  },
];

export const RESPUESTA_AGENTE = {
  conversation_id: 'c-e2e0001',
  agent_response:
    'E. Haaland disputó 32 partidos en Premier League (2024), con 22 goles y 3 asistencias. ' +
    'Te propongo una rutina de 25 minutos para delantero, dentro de los 30 que indicaste.',
  sources: [
    { tool: 'obtener_metricas_jugador', player_id: 1100, season: 2024 },
    { tool: 'sugerir_entrenamiento', posicion: 'delantero', minutos_disponibles: 30 },
  ],
  routine: {
    posicion: 'delantero',
    tiempo_minutos: 30,
    minutos_asignados: 25,
    ejercicios: [
      { nombre: 'Activación y desmarque corto', duracion_min: 5, descripcion: 'Movimientos de apoyo y ruptura frente a un cono.' },
      { nombre: 'Definición cruzada tras arranque', duracion_min: 10, descripcion: 'Arranca en velocidad y define cruzado al segundo palo.' },
      { nombre: 'Remate al primer toque tras centro', duracion_min: 10, descripcion: 'Balones rasos desde el costado, define de primera.' },
    ],
  },
  routine_id: 42,
  degraded: false,
};

/**
 * Intercepta todas las llamadas al backend y responde con las fixtures.
 * Cualquier ruta no contemplada devuelve 404 a propósito: si una prueba la
 * provoca, es que el frontend está pidiendo algo que nadie previó.
 */
export async function interceptarBackend(page: Page): Promise<void> {
  await page.route(`${API}/**`, async route => {
    const url = new URL(route.request().url());
    const ruta = url.pathname;

    const json = (body: unknown) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });

    if (ruta === '/countries/') { return json(PAISES); }
    if (ruta.startsWith('/countries/')) { return json(SELECCION_ECUADOR); }
    if (ruta === '/players/search') { return json(BUSQUEDA_HAALAND); }
    if (ruta.startsWith('/leagues/teams/')) { return json(EQUIPOS_LIGA_PRO); }
    if (ruta.startsWith('/leagues/')) { return json(LIGAS_ECUADOR); }
    if (ruta.startsWith('/players/')) { return json(PLANTILLA); }
    if (ruta.startsWith('/statistics/') || ruta.startsWith('/statics/')) { return json(ESTADISTICAS_HAALAND); }
    if (ruta === '/agent/chat') { return json(RESPUESTA_AGENTE); }
    if (ruta === '/agent/runs' || ruta === '/agent/routines') { return json([]); }

    return route.fulfill({ status: 404, contentType: 'application/json', body: '{"detail":"sin fixture"}' });
  });
}

/** Variante que simula la cuota agotada sin copia en caché (SPEC §4.3). */
export async function interceptarCuotaAgotada(page: Page): Promise<void> {
  await page.route(`${API}/**`, route =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'quota_exceeded', cached: false }),
    }),
  );
}
