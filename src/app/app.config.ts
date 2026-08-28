import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { dataFreshnessInterceptor } from './core/data-freshness';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular 21 arranca *zoneless* por defecto: tener `zone.js` en los
    // polyfills de angular.json NO basta. Sin esta linea, un componente que
    // guarda la respuesta HTTP en campos planos (no señales) actualiza su
    // estado pero jamas repinta: la ficha del jugador se quedaba en
    // "Cargando jugador..." con los datos ya cargados.
    //
    // Todo el codigo de este proyecto usa campos planos, asi que se restaura
    // la deteccion basada en zonas. Migrar a señales seria la alternativa.
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([dataFreshnessInterceptor])),
  ]
};
