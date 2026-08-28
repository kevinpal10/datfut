// Configuración de desarrollo.
//
// Punto único desde el que se resuelve la URL del backend (SPEC §6,
// "Configuración por entorno"). Antes cinco servicios la tenían escrita a mano,
// así que cambiar de host obligaba a editar cinco archivos.
//
// En el build de producción, `angular.json` reemplaza este archivo por
// `environment.prod.ts` mediante `fileReplacements`.
export const environment = {
  production: false,
  // El 8000 está ocupado por otra aplicación en esta máquina.
  // Para volver al puerto documentado: cambia 8001 por 8000.
  apiUrl: 'http://127.0.0.1:8001',
};
