import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Statistics {
  
  private apiUrl = 'http://127.0.0.1:8000/statics/';
  
  constructor(
    private http: HttpClient
  ) {

   }

  getPlayerStats(playerId: number, season: number) {
    return this.http.get(`${this.apiUrl}${playerId}/`, { params: { season } });
  }


}
