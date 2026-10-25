/**
 * js/quiz/quiz-score.js
 * Calificación académica de 1,0 a 5,0 (reemplaza el antiguo sistema XP /
 * registro manual de aciertos).
 *
 *   Nota = 1,0 + (aciertos / preguntas calificables) × 4,0   (1 decimal)
 *
 * - Solo las preguntas de opción múltiple son "calificables".
 * - Las preguntas abiertas NO se califican automáticamente: quedan
 *   "pendientes de revisión" y no cuentan como incorrectas.
 * - Sin preguntas calificables no se calcula nota.
 */

const QuizScore = (() => {
  const NOTA_MIN = 1.0;
  const NOTA_MAX = 5.0;

  function calcularNota(aciertos, calificables) {
    if (!calificables || calificables <= 0) return null;
    const bruta = NOTA_MIN + (aciertos / calificables) * (NOTA_MAX - NOTA_MIN);
    const redondeada = Math.round(bruta * 10) / 10;
    return Math.min(NOTA_MAX, Math.max(NOTA_MIN, redondeada));
  }

  function formatearNota(nota) {
    return nota === null || nota === undefined ? "—" : nota.toFixed(1).replace(".", ",");
  }

  /**
   * @param {Array} respuestas - [{tipo:"multiple"|"abierta", estado:"correcta"|"incorrecta"|"sin-responder"|"pendiente"|...}]
   */
  function calcular(respuestas) {
    const total = respuestas.length;
    const multiples = respuestas.filter((r) => r.tipo === "multiple");
    const abiertas = respuestas.filter((r) => r.tipo === "abierta");

    const correctas = multiples.filter((r) => r.estado === "correcta").length;
    const incorrectas = multiples.filter((r) => r.estado === "incorrecta").length;
    const sinResponderMultiples = multiples.filter((r) => r.estado === "sin-responder").length;

    // Las no contestadas de opción múltiple SÍ cuentan como no acertadas.
    const calificables = multiples.length;
    const porcentaje = calificables > 0 ? Math.round((correctas / calificables) * 100) : null;
    const nota = calcularNota(correctas, calificables);

    const abiertasContestadas = abiertas.filter((r) => r.estado !== "sin-responder").length;
    const abiertasSinResponder = abiertas.length - abiertasContestadas;

    return {
      total,
      calificables,
      correctas,
      incorrectas,
      sinResponder: sinResponderMultiples + abiertasSinResponder,
      sinResponderMultiples,
      abiertas: abiertas.length,
      abiertasPendientes: abiertasContestadas,
      porcentaje,
      nota,
      notaProvisional: abiertasContestadas > 0 && nota !== null
    };
  }

  function mensajePorPorcentaje(porcentaje) {
    if (porcentaje === null) return "Tus respuestas quedaron registradas y esperan la revisión del maestro.";
    if (porcentaje >= 90) return "¡Excelente trabajo!";
    if (porcentaje >= 70) return "¡Muy buen desempeño!";
    if (porcentaje >= 50) return "¡Buen intento, sigue practicando!";
    return "Sigue repasando: con práctica vas a mejorar.";
  }

  return { calcular, calcularNota, formatearNota, mensajePorPorcentaje, NOTA_MIN, NOTA_MAX };
})();
