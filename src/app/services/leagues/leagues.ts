import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Leagues {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/leagues`;

  getLiguesByCountry(countryName: string) {
    return this.http.get(`${this.apiUrl}/${encodeURIComponent(countryName)}`);
  }

  getTeamsByLeague(leagueId: number, season: number) {
    return this.http.get(`${this.apiUrl}/teams/${leagueId}/${season}`);
  }

}
