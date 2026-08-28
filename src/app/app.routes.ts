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
    path: 'campeonato/:id',
    loadComponent: () =>
      import('./component/leagues/leagues.component').then(m => m.LeagueComponent),
  },
  {
    path: 'jugador/:id',
    loadComponent: () =>
      import('./component/player/player').then(m => m.PlayerComponent),
  },
];