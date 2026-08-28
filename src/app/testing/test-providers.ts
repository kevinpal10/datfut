import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

/**
 * Providers comunes de las pruebas.
 *
 * Los specs generados por el CLI creaban los componentes sin `HttpClient` ni
 * `ActivatedRoute`, así que fallaban con NG0201 en cuanto el componente
 * inyectaba cualquiera de los dos. Centralizarlo aquí evita repetir el mismo
 * bloque en cada archivo.
 */

export interface RutaFalsa {
  params?: Record<string, string>;
  queryParams?: Record<string, string>;
}

/** `ActivatedRoute` de mentira con los parámetros que pida la prueba. */
export function provideActivatedRouteStub(ruta: RutaFalsa = {}): Provider {
  return {
    provide: ActivatedRoute,
    useValue: {
      snapshot: {
        paramMap: convertToParamMap(ruta.params ?? {}),
        queryParamMap: convertToParamMap(ruta.queryParams ?? {}),
      },
    },
  };
}

/** HTTP simulado: ninguna prueba debe salir a la red. */
export function provideHttpTesting(): (Provider | EnvironmentProviders)[] {
  return [provideHttpClient(), provideHttpClientTesting()];
}

/** Atajo para componentes que necesitan ambas cosas. */
export function providersDePrueba(
  ruta: RutaFalsa = {},
): (Provider | EnvironmentProviders)[] {
  return [...provideHttpTesting(), provideActivatedRouteStub(ruta)];
}
