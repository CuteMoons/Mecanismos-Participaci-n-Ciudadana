/**
 * data/mecanismos/index.js
 *
 * Punto único de integración de todos los mecanismos de participación.
 * Para agregar un nuevo mecanismo:
 *   1. Crea data/mecanismos/nuevo-mecanismo.js siguiendo la misma estructura.
 *   2. Enlázalo con <script> en index.html, pages/aprender.html y pages/quiz.html
 *      (antes que este archivo).
 *   3. Agrégalo al arreglo MECANISMOS de abajo.
 * El resto del sistema (tarjetas, modal, filtros de quiz) se actualiza solo.
 */

const MECANISMOS = [
  MECANISMO_TUTELA,
  MECANISMO_DERECHO_PETICION,
  MECANISMO_REFERENDO,
  MECANISMO_PLEBISCITO,
  MECANISMO_CONSULTA_POPULAR,
  MECANISMO_CABILDO_ABIERTO,
  MECANISMO_INICIATIVA_POPULAR,
  MECANISMO_REVOCATORIA_MANDATO
];

function obtenerMecanismoPorId(id) {
  return MECANISMOS.find((m) => m.id === id) || null;
}
