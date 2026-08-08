/**
 * js/quiz/quiz-score.js
 * Como los estudiantes responden en papel, la puntuación se registra
 * manualmente por la profesora al final de la actividad (ver sección 17
 * del brief). Este módulo solo calcula XP a partir de aciertos manuales.
 */

const QuizScore = (() => {
  const XP_POR_ACIERTO = 100;

  function calcular(correctas, total) {
    const xpMax = total * XP_POR_ACIERTO;
    const xp = correctas * XP_POR_ACIERTO;
    const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;
    return {
      correctas,
      incorrectas: Math.max(total - correctas, 0),
      total,
      porcentaje,
      xp,
      xpMax
    };
  }

  function mensajePorPorcentaje(porcentaje) {
    if (porcentaje >= 90) return "¡Excelente trabajo!";
    if (porcentaje >= 70) return "¡Muy buen desempeño!";
    if (porcentaje >= 50) return "¡Buen intento, sigan practicando!";
    return "¡Sigan repasando, ya van a mejorar!";
  }

  return { calcular, mensajePorPorcentaje, XP_POR_ACIERTO };
})();
