import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Leagues {

  private apiUrl = 'http://127.0.0.1:8000/leagues/';

  constructor(
    private http: HttpClient
  ) {

   }

  getLiguesByCountry(countryName: string) {
    const apiUrl = `${this.apiUrl}${countryName}`;
    return this.http.get(apiUrl);
  } 

  getTeamsByLeague(leagueId: number, season: number) {
    const apiUrl = `${this.apiUrl}teams/${leagueId}/${season}`;
    return this.http.get(apiUrl);
  }

}
