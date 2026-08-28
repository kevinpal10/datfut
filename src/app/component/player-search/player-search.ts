import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Player, PlayerSearchResult } from '../../services/player/player';
import { DEFAULT_SEASON } from '../../core/season';

/** Mínimo que exige `players/profiles` de api-football. */
const MIN_BUSQUEDA = 3;

@Component({
  selector: 'app-player-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-search.html',
  styleUrl: './player-search.css',
})
export class PlayerSearchComponent {

  private playerService = inject(Player);
  private router = inject(Router);

  busqueda = new FormControl('', { nonNullable: true });
  resultados = signal<PlayerSearchResult[]>([]);
  buscando = signal(false);
  error = signal<string | null>(null);
  /** `true` una vez que se ha buscado algo, para distinguir "vacío" de "aún nada". */
  buscado = signal(false);

  readonly minBusqueda = MIN_BUSQUEDA;

  constructor() {
    this.busqueda.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(termino => {
        const q = termino.trim();
        if (q.length < MIN_BUSQUEDA) {
          this.resultados.set([]);
          this.buscado.set(false);
          this.buscando.set(false);
          return of(null);
        }
        this.buscando.set(true);
        this.error.set(null);
        return this.playerService.searchPlayers(q);
      }),
    ).subscribe({
      next: datos => {
        if (datos === null) { return; }
        this.resultados.set(Array.isArray(datos) ? datos : []);
        this.buscado.set(true);
        this.buscando.set(false);
      },
      error: () => {
        this.error.set('No se pudo completar la búsqueda. Inténtalo de nuevo.');
        this.resultados.set([]);
        this.buscando.set(false);
      },
    });
  }

  abrirFicha(jugador: PlayerSearchResult): void {
    this.router.navigate(['/jugador', jugador.player_id], {
      queryParams: { season: DEFAULT_SEASON },
    });
  }

  volver(): void {
    this.router.navigate(['/paises']);
  }

  iniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }
}
