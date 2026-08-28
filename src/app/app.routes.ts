import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'paises',
    pathMatch: 'full',
  },
  {
    path: 'paises',
    loadComponent: () =>
      import('./component/country/country').then(m => m.CountryComponent),
  },
  {
    // Atajo a la ficha sin recorrer país → liga → equipo (SPEC §2.1.1).
    path: 'buscar',
    loadComponent: () =>
      import('./component/player-search/player-search').then(m => m.PlayerSearchComponent),
  },
  {
    path: 'campeonato/:id',
    loadComponent: () =>
      import('./component/leagues/leagues.component').then(m => m.LeagueComponent),
  },
  {
    path: 'jugador/:id',
    loadComponent: () =>
      import('./component/player/player').then(m => m.PlayerComponent),
  },
  {
    // Prototipo del Módulo 2: la pantalla está completa pero se alimenta de la
    // constante MOCK_MATCH, no del backend. Antes no tenía ruta y era
    // inalcanzable; ahora al menos se puede abrir y evaluar. Conectarla a datos
    // reales sigue siendo deuda registrada en ESTADO.md.
    path: 'partido',
    loadComponent: () =>
      import('./match-analysis.page').then(m => m.MatchAnalysisPage),
  },
  {
    // Auditoria del agente (SPEC 2.2.3): herramientas invocadas y latencias.
    path: 'auditoria',
    loadComponent: () =>
      import('./component/agent-audit/agent-audit').then(m => m.AgentAuditComponent),
  },
  {
    path: '**',
    redirectTo: 'paises',
  },
];
