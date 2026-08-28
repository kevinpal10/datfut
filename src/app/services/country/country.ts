import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Country {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/countries`;

  getCountries() {
    return this.http.get(`${this.apiUrl}/`);
  }

  getInfoCountry(name: string) {
    return this.http.get(`${this.apiUrl}/${encodeURIComponent(name)}`);
  }

}
