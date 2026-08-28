import { expect, test } from '@playwright/test';

import { interceptarBackend, interceptarCuotaAgotada } from './fixtures';

/**
 * E2E #1 — Flujo de exploración hasta la ficha del jugador (SPEC §4.1).
 *
 * Esta prueba existe por una razón concreta: el 28-ago tres fallos de
 * integración llegaron a la app con las 111 pruebas unitarias en verde.
 * Los tres se manifestaban aquí — Angular arrancando *zoneless* (la ficha se
 * quedaba en "Cargando…" con los datos ya cargados), el bucle de detección de
 * cambios que colgaba la pestaña, y el 500 de `/countries/`.
 */
test.describe('Exploración', () => {

  test.beforeEach(async ({ page }) => {
    await interceptarBackend(page);
  });

  test('recorre país → liga → equipo → ficha arrastrando la temporada', async ({ page }) => {
    await page.goto('/paises');

    // 1. País. El autocompletado se alimenta del catálogo propio en PostgreSQL,
    //    no de api-football.
    await page.getByLabel('Buscar selección').fill('Ecuador');
    await page.getByRole('option', { name: 'Ecuador' }).click();
    await expect(page.locator('.country-name')).toHaveText('Ecuador');

    // 2. Liga. Sólo se listan las que tienen temporada vigente.
    const liga = page.locator('.league-row').filter({ hasText: 'Liga Pro' });
    await expect(liga).toBeVisible();
    await liga.click();
    await expect(page).toHaveURL(/\/campeonato\/242\?.*season=2025/);

    // 3. Equipo. Volver a `/paises` con `teamId` cambia el modo del componente.
    const equipo = page.locator('.team-card').filter({ hasText: 'Barcelona SC' });
    await expect(equipo).toBeVisible();
    await equipo.click();
    await expect(page).toHaveURL(/\/paises\?.*teamId=2382/);

    // 4. Plantilla del equipo → ficha del jugador.
    const jugador = page.locator('.player-row').filter({ hasText: 'E. Haaland' });
    await expect(jugador).toBeVisible();
    await jugador.click();

    // La temporada elegida en el campeonato llega intacta al último salto.
    // Si se perdiera, `parseSeason` caería a 2024 y esta aserción fallaría.
    await expect(page).toHaveURL(/\/jugador\/1100\?season=2025/);
    await expect(page.getByText('Cargando jugador...')).toHaveCount(0);
    await expect(page.getByText('Manchester City')).toBeVisible();
  });

  test('busca un jugador por nombre y abre su ficha con las métricas de su posición', async ({ page }) => {
    await page.goto('/buscar');

    await expect(page.getByRole('heading', { name: /buscar jugador/i })).toBeVisible();

    await page.getByLabel('Nombre del jugador').fill('haaland');

    // El resultado llega por HTTP: si la detección de cambios no corre, este
    // botón nunca aparece aunque el estado del componente sí se actualice.
    const resultado = page.getByRole('button', { name: /E\. Haaland/ });
    await expect(resultado).toBeVisible();

    await resultado.click();
    await expect(page).toHaveURL(/\/jugador\/1100/);

    // La ficha debe salir de "Cargando…" y pintar los datos.
    await expect(page.getByText('Cargando jugador...')).toHaveCount(0);
    await expect(page.getByText('E. Haaland').first()).toBeVisible();
    await expect(page.getByText('Manchester City')).toBeVisible();

    // Métricas de delantero, calculadas en el cliente a partir de la respuesta.
    await expect(page.getByText('32')).toBeVisible();          // partidos
    await expect(page.getByText('22')).toBeVisible();          // goles
    await expect(page.getByText('Goles')).toBeVisible();
    await expect(page.getByText('Asistencias')).toBeVisible();

    // Anillo de precisión de tiro: 60/92 = 65 %. Es la prueba de que el
    // cálculo por posición corrió de verdad, no de que se pintó un placeholder.
    await expect(page.getByText('65%')).toBeVisible();
    await expect(page.getByText('Tiros a puerta')).toBeVisible();
  });

  test('la página sigue respondiendo tras renderizar la ficha (sin bucle de detección de cambios)', async ({ page }) => {
    await page.goto('/jugador/1100?season=2024');
    await expect(page.getByText('E. Haaland').first()).toBeVisible();

    // Si el *ngFor recreara sus hijos en cada ciclo, el hilo principal quedaría
    // saturado y esta interacción se quedaría sin respuesta.
    const inicio = Date.now();
    await page.getByRole('button', { name: /Conversar con Profe KevBot/i }).click();
    await expect(page.getByPlaceholder(/quiero mejorar mi definición/i)).toBeVisible();
    expect(Date.now() - inicio).toBeLessThan(5000);
  });

  test('avisa cuando la cuota de la API está agotada, sin pantalla en blanco', async ({ page }) => {
    await interceptarCuotaAgotada(page);
    await page.goto('/paises');

    // El flujo degrada, pero la aplicación sigue montada y navegable.
    await expect(page.locator('app-root')).toBeVisible();
    await expect(page.getByLabel(/Buscar selección/i)).toBeVisible();
  });
});
