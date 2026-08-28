import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

/** Resultado de `GET /players/search`, ya aplanado por el backend. */
export interface PlayerSearchResult {
  player_id: number;
  name: string;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  nationality: string | null;
  position: string | null;
  photo: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class Player {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/players`;

  getPlayerByCountry(idTeam: number) {
    return this.http.get(`${this.apiUrl}/${idTeam}`);
  }

  /** Búsqueda por nombre: llega a la ficha sin recorrer país -> liga -> equipo. */
  searchPlayers(query: string) {
    return this.http.get<PlayerSearchResult[]>(`${this.apiUrl}/search`, {
      params: { q: query },
    });
  }

}
