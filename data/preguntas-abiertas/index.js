/**
 * data/preguntas-abiertas/index.js
 *
 * Punto único de integración de las preguntas ABIERTAS (sin opciones,
 * sin respuesta única). Se usan en el modo "Preguntas abiertas" del
 * quiz: se proyecta solo el enunciado y los estudiantes responden con
 * sus propias palabras en el cuaderno o en una hoja. La profesora
 * evalúa con su propio criterio (no hay hoja de respuestas automática,
 * a diferencia del banco de opción múltiple).
 */

const BANCO_PREGUNTAS_ABIERTAS = [
  ...PREGUNTAS_ABIERTAS_BASE,
  ...PREGUNTAS_ABIERTAS_ADICIONALES
];

function obtenerPreguntasAbiertasPorMecanismo(mecanismoId) {
  return BANCO_PREGUNTAS_ABIERTAS.filter((p) => p.mecanismo === mecanismoId);
}
