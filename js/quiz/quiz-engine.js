/**
 * js/quiz/quiz-engine.js
 * Motor de selección de preguntas para una partida de quiz.
 * Responsable únicamente de ELEGIR las preguntas; no toca el DOM.
 */

const QuizEngine = (() => {
  /** Mezcla un arreglo sin mutar el original (Fisher-Yates). */
  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /** Reparte una cantidad total en partes lo más equilibradas posible. */
  function distribuirEquilibrado(total, partes) {
    const base = Math.floor(total / partes);
    let resto = total % partes;
    return Array.from({ length: partes }, () => {
      const extra = resto > 0 ? 1 : 0;
      if (resto > 0) resto--;
      return base + extra;
    });
  }

  /**
   * Construye el conjunto de preguntas para una partida.
   * @param {object} config - ver quiz-config.js
   * @returns {Array} preguntas seleccionadas, sin duplicados
   */
  function construirPartida(config) {
    if (config.tipoPregunta === "abierta") {
      return construirPartidaAbierta(config);
    }
    return construirPartidaMultiple(config);
  }

  /** Selección para el banco de opción múltiple (con dificultad). */
  function construirPartidaMultiple(config) {
    let universo = config.mecanismoFiltro
      ? obtenerPreguntasPorMecanismo(config.mecanismoFiltro)
      : BANCO_PREGUNTAS;

    let seleccionadas = [];

    if (config.dificultad === "mixto") {
      const niveles = ["facil", "media", "dificil"];
      const disponibles = niveles.filter((n) => universo.some((p) => p.dificultad === n));
      const cantidades = distribuirEquilibrado(config.numPreguntas, disponibles.length || 1);

      disponibles.forEach((nivel, idx) => {
        const pool = shuffle(universo.filter((p) => p.dificultad === nivel));
        seleccionadas.push(...pool.slice(0, cantidades[idx]));
      });
    } else {
      const pool = shuffle(universo.filter((p) => p.dificultad === config.dificultad));
      seleccionadas = pool.slice(0, config.numPreguntas);
    }

    return finalizarSeleccion(seleccionadas, config);
  }

  /** Selección para el banco de preguntas abiertas (sin dificultad ni opciones). */
  function construirPartidaAbierta(config) {
    let universo = config.mecanismoFiltro
      ? obtenerPreguntasAbiertasPorMecanismo(config.mecanismoFiltro)
      : BANCO_PREGUNTAS_ABIERTAS;

    const seleccionadas = shuffle(universo).slice(0, config.numPreguntas);
    return finalizarSeleccion(seleccionadas, config);
  }

  /** Quita duplicados por id y aplica el orden aleatorio final si aplica. */
  function finalizarSeleccion(seleccionadas, config) {
    const vistos = new Set();
    let resultado = seleccionadas.filter((p) => {
      if (vistos.has(p.id)) return false;
      vistos.add(p.id);
      return true;
    });
    if (config.aleatorio) resultado = shuffle(resultado);
    return resultado;
  }

  return { construirPartida, shuffle };
})();
