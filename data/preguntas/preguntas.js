/**
 * data/preguntas/preguntas.js
 *
 * Punto único de integración del banco de preguntas.
 * Actualmente contiene POCAS PREGUNTAS DE PRUEBA para validar
 * el motor del quiz (aleatoriedad, filtros por dificultad y por
 * mecanismo, sin repetidos). Amplía cada archivo de dificultad
 * para crecer el banco sin tocar el motor del quiz.
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
