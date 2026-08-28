import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Country {
  
  private apiUrl = 'http://127.0.0.1:8000/countries/';

  constructor(
    private http: HttpClient
  ) {

   }

  getCountries() {
    return this.http.get(this.apiUrl);
  }

  getInfoCountry(name: string) {
    console.log('Obteniendo service información del país:', name);
    return this.http.get(`${this.apiUrl}${name}`);
  }
  

}
