import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de las pruebas E2E (SPEC §6).
 *
 * Playwright levanta el servidor de desarrollo de Angular por su cuenta. El
 * backend NO se levanta: las pruebas interceptan las llamadas y sirven
 * respuestas fijas (ver `e2e/fixtures.ts`). Eso las hace deterministas y
 * ejecutables en CI sin credenciales de api-football ni de AWS.
 *
 * Los tres fallos de integración que se colaron el 28-ago (Angular zoneless,
 * el bucle de detección de cambios y el 500 de `/countries/`) eran todos del
 * lado del cliente, así que este montaje los habría atrapado igual.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI'] ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: 'npx ng serve --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 180 * 1000,
  },
});
