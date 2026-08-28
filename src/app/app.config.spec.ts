import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { appConfig } from './app.config';

/**
 * Guarda contra una regresión que costó cara.
 *
 * Angular 21 arranca *zoneless* por defecto. Tener `zone.js` en los polyfills
 * de `angular.json` NO lo desactiva. Todo el código de este proyecto guarda las
 * respuestas HTTP en campos planos (no señales), así que sin zonas el estado se
 * actualizaba pero la vista nunca se repintaba: la ficha del jugador se quedaba
 * en "Cargando jugador..." con los datos ya en memoria.
 *
 * Si alguien quita `provideZoneChangeDetection()`, hay que migrar esos
 * componentes a señales primero. Esta prueba obliga a tomar esa decisión a
 * conciencia en vez de descubrirlo en una pantalla en blanco.
 */
describe('appConfig', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...appConfig.providers] });
  });

  it('activa la detección de cambios basada en zonas', () => {
    const zone = TestBed.inject(NgZone);
    // Con zoneless, Angular inyecta un `NoopNgZone` que no dispara nada.
    expect(zone.constructor.name).not.toContain('Noop');
    expect(typeof zone.run).toBe('function');
  });
});
