// Temporada por defecto del sistema.
//
// Antes convivían dos valores distintos en el mismo flujo (2026 al navegar
// desde el país, 2024 al abrir la ficha), así que la ficha podía pedir una
// temporada que no era la elegida. SPEC §4.1: la temporada viaja en la
// navegación y debe ser la misma en todos los saltos; esta constante es sólo el
// respaldo para cuando no llega ninguna.
//
// Espejo de `back_fut_analisis/core/season.py`. Si se cambia una, se cambia la otra.
export const DEFAULT_SEASON = 2024;

/** Lee una temporada de un query param, cayendo al respaldo si no es válida. */
export function parseSeason(raw: string | null): number {
  const season = Number(raw);
  return Number.isInteger(season) && season > 1900 ? season : DEFAULT_SEASON;
}
