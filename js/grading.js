/**
 * js/grading.js
 * Calificación común de los juegos (relacionar y sopa de letras).
 * Escala de 1.0 a 5.0, proporcional a los aciertos:
 * 0 % → 1.0 · 100 % → 5.0 (exacto). Un decimal.
 */
function calcularCalificacion(correctas, total) {
  if (total <= 0) return 1.0;
  const proporcion = Math.max(0, Math.min(1, correctas / total));
  const nota = 1 + proporcion * 4;
  const limitada = Math.max(1, Math.min(5, nota));
  return Math.round(limitada * 10) / 10;
}

if (typeof module !== "undefined") module.exports = { calcularCalificacion };
