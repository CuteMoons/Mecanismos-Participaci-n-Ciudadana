/**
 * js/quiz/quiz-config.js
 * Estado de configuración del quiz. No contiene lógica de selección
 * de preguntas (eso vive en quiz-engine.js) ni de interfaz (quiz-ui.js).
 */

const QuizConfig = (() => {
  const DEFAULTS = {
    modalidad: "individual",  // "individual" | "grupos"
    numPreguntas: 10,          // 5 | 10 | 15 | 20 | personalizado
    dificultad: "mixto",       // "facil" | "media" | "dificil" | "mixto"
    tiempoSegundos: 120,       // por pregunta
    aleatorio: true,
    mostrarPuntuacion: true,
    mecanismoFiltro: null,     // id de mecanismo, si viene de "Practicar este mecanismo"
    sonido: true
  };

  let state = { ...DEFAULTS };

  function get() {
    return { ...state };
  }

  function set(partial) {
    state = { ...state, ...partial };
  }

  function reset() {
    const keepFilter = state.mecanismoFiltro;
    state = { ...DEFAULTS, mecanismoFiltro: keepFilter };
  }

  return { get, set, reset, DEFAULTS };
})();
