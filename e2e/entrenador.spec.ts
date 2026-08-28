import { expect, test } from '@playwright/test';

import { RESPUESTA_AGENTE, interceptarBackend } from './fixtures';

/**
 * E2E #2 — Conversación con el Entrenador y generación de rutina (SPEC §4.2).
 *
 * Comprueba las tres garantías del Módulo 3 desde fuera: que el contexto del
 * jugador viaja con la petición, que la rutina respeta el tiempo declarado, y
 * que la respuesta cita sus fuentes.
 */
test.describe('Entrenador Táctico', () => {

  test.beforeEach(async ({ page }) => {
    await interceptarBackend(page);
  });

  test('genera una rutina acotada al tiempo pedido y cita sus fuentes', async ({ page }) => {
    // Capturamos el cuerpo que el frontend envía al agente.
    let peticion: any = null;
    page.on('request', req => {
      if (req.url().endsWith('/agent/chat') && req.method() === 'POST') {
        peticion = req.postDataJSON();
      }
    });

    await page.goto('/jugador/1100?season=2024');
    await expect(page.getByText('E. Haaland').first()).toBeVisible();

    await page.getByRole('button', { name: /Conversar con el Entrenador/i }).click();

    const campo = page.getByPlaceholder(/quiero mejorar mi definición/i);
    await campo.fill('Quiero mejorar mi definición, tengo 30 minutos');
    await page.getByRole('button', { name: 'Enviar' }).click();

    // ── El contexto de la ficha viaja con la petición (SPEC §4.2.2) ────────
    await expect.poll(() => peticion).not.toBeNull();
    expect(peticion.player_id).toBe(1100);
    expect(peticion.season).toBe(2024);
    expect(peticion.message).toContain('30 minutos');

    // ── La respuesta del entrenador aparece en el hilo ─────────────────────
    await expect(page.getByText(/disputó 32 partidos en Premier League/)).toBeVisible();

    // ── La rutina respeta el límite: 25 asignados sobre 30 pedidos ─────────
    await expect(page.getByRole('heading', { name: /Rutina de 25 min/i })).toBeVisible();

    const duraciones = await page.locator('.rutina__duracion').allTextContents();
    const total = duraciones.reduce((suma, texto) => suma + parseInt(texto, 10), 0);
    expect(total).toBe(25);
    expect(total).toBeLessThanOrEqual(RESPUESTA_AGENTE.routine.tiempo_minutos);

    // ── Las fuentes son visibles: es lo que hace auditable "sin alucinaciones"
    await expect(page.getByText(/Fuentes de los datos \(2\)/)).toBeVisible();
  });

  test('el temporizador arranca en los minutos asignados y descuenta', async ({ page }) => {
    await page.goto('/jugador/1100?season=2024');
    await page.getByRole('button', { name: /Conversar con el Entrenador/i }).click();
    await page.getByPlaceholder(/quiero mejorar mi definición/i).fill('rutina de 30 minutos');
    await page.getByRole('button', { name: 'Enviar' }).click();

    const reloj = page.locator('.rutina__reloj');
    await expect(reloj).toHaveText('25:00');

    await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible();

    // Descuenta de verdad (valida que la detección de cambios corre con setInterval).
    await expect(reloj).not.toHaveText('25:00', { timeout: 4000 });

    await page.getByRole('button', { name: 'Pausar' }).click();
    await page.getByRole('button', { name: 'Reiniciar', exact: true }).click();
    await expect(reloj).toHaveText('25:00');
  });

  test('no envía nada si el mensaje está vacío', async ({ page }) => {
    let llamadas = 0;
    page.on('request', req => {
      if (req.url().endsWith('/agent/chat')) { llamadas++; }
    });

    await page.goto('/jugador/1100?season=2024');
    await page.getByRole('button', { name: /Conversar con el Entrenador/i }).click();

    await expect(page.getByRole('button', { name: 'Enviar' })).toBeDisabled();
    expect(llamadas).toBe(0);
  });
});
