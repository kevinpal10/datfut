import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

/**
 * Cabecera con la que el backend avisa de que la respuesta sale de una copia
 * rancia de la caché porque api-football falló (SPEC §4.3). Espejo de
 * `STALE_HEADER` en `back_fut_analisis/core/http.py`.
 */
export const STALE_HEADER = 'X-Data-Stale';

@Injectable({ providedIn: 'root' })
export class DataFreshnessService {
  /** `true` mientras haya que avisar al usuario de que ve datos en caché. */
  readonly servidoDesdeCache = signal(false);

  marcarRancio(): void {
    this.servidoDesdeCache.set(true);
  }

  descartar(): void {
    this.servidoDesdeCache.set(false);
  }
}

/**
 * Observa las respuestas del backend y levanta el aviso cuando llegan datos
 * rancios. El flujo no se interrumpe: la petición devuelve 200 con los datos y
 * el usuario sólo ve una nota discreta.
 */
export const dataFreshnessInterceptor: HttpInterceptorFn = (req, next) => {
  const freshness = inject(DataFreshnessService);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse && event.headers.get(STALE_HEADER) === 'true') {
        freshness.marcarRancio();
      }
    }),
  );
};
