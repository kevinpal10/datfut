import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Statistics {

  private http = inject(HttpClient);
  // Ruta canónica. El backend mantiene `/statics/` como alias obsoleto, pero
  // construir la URL con barra final dependía del redirect 307 de FastAPI.
  private apiUrl = `${environment.apiUrl}/statistics`;

  getPlayerStats(playerId: number, season: number) {
    return this.http.get(`${this.apiUrl}/${playerId}`, { params: { season } });
  }

}
