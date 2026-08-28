import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class Player {
  private apiUrl = 'http://127.0.0.1:8000/players/';
  
  constructor(
    private http: HttpClient
  ) {

   }

  getPlayerByCountry(idTeam: number) {
    return this.http.get(`${this.apiUrl}${idTeam}`);
  }



}
