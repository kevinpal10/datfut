import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = 'http://127.0.0.1:8000/players';

  constructor(
    private http: HttpClient
  ) {

   }

  getPlayersByCountry(nameCountry: string) {
    return this.http.get(`${this.apiUrl}/country/${nameCountry}`);
  }

  getTeamsByCountry(code: string) {
    return this.http.get(`${this.apiUrl}/country/${code}`);
  }
}
