/**
 * data/preguntas/preguntas.js
 *
 * Punto único de integración del banco de preguntas.
 * Contiene el banco OFICIAL de 120 preguntas de opción múltiple
 * (15 por mecanismo: 5 fáciles, 5 medias, 5 difíciles), entregado
 * por la profesora. Amplía cada archivo de dificultad para crecer
 * el banco sin tocar el motor del quiz.
 */

const BANCO_PREGUNTAS = [
  ...PREGUNTAS_FACILES,
  ...PREGUNTAS_MEDIAS,
  ...PREGUNTAS_DIFICILES
];

function obtenerPreguntasPorDificultad(dificultad) {
  if (dificultad === "mixto") return BANCO_PREGUNTAS;
  return BANCO_PREGUNTAS.filter((p) => p.dificultad === dificultad);
}

function obtenerPreguntasPorMecanismo(mecanismoId) {
  return BANCO_PREGUNTAS.filter((p) => p.mecanismo === mecanismoId);
}
