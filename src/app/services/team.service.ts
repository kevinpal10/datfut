import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private http = inject(HttpClient);
  // Antes apuntaba a `/players/country/...`, que no existe en el backend y
  // devolvía 404. Las rutas reales cuelgan de `/teams`.
  private apiUrl = `${environment.apiUrl}/teams`;

  getTeamById(teamId: number) {
    return this.http.get(`${this.apiUrl}/id/${teamId}`);
  }

  getTeamsByCountry(country: string) {
    return this.http.get(`${this.apiUrl}/country/${encodeURIComponent(country)}`);
  }

  getTeamsByCode(code: string) {
    return this.http.get(`${this.apiUrl}/code/${encodeURIComponent(code)}`);
  }

  getTeamsByLeagueAndSeason(league: string, season: number) {
    return this.http.get(`${this.apiUrl}/league/${league}/season/${season}`);
  }
}
