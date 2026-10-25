/**
 * js/quiz/quiz-config.js
 * Estado de configuración del quiz. No contiene lógica de selección
 * de preguntas (quiz-engine.js) ni de interfaz (quiz-ui.js).
 *
 * NOTA SOBRE ROLES: el proyecto es estático (sin servidor). El rol se
 * guarda solo en memoria y organiza la interfaz; NO es un mecanismo de
 * seguridad real (cualquiera con acceso a la consola del navegador
 * podría alterarlo). Ver README para las limitaciones.
 */

const QuizConfig = (() => {
  const MAX_PREGUNTAS = 60;
  const MAX_GRUPOS = 8;

  const DEFAULTS = {
    rol: null,                 // null | "alumno" | "maestro"
    modalidad: "individual",   // "individual" | "grupos" (grupos: solo maestro)
    tipoPregunta: "multiple",  // "multiple" | "abierta"
    numPreguntas: 10,
    dificultad: "mixto",       // "facil" | "media" | "dificil" | "mixto"
    tiempoSegundos: 120,       // por pregunta
    aleatorio: true,
    sonido: true,
    numGrupos: 4,
    mecanismoFiltro: null      // id de mecanismo (viene de "Practicar este mecanismo")
  };

  let state = { ...DEFAULTS };

  function get() {
    return { ...state };
  }

  /** Aplica cambios; el alumno nunca puede dejar la modalidad en "grupos". */
  function set(partial) {
    const next = { ...state, ...partial };
    if (next.rol !== "maestro" && next.modalidad === "grupos") next.modalidad = "individual";
    next.numPreguntas = Math.min(MAX_PREGUNTAS, Math.max(1, Math.floor(Number(next.numPreguntas)) || 1));
    next.tiempoSegundos = Math.min(1800, Math.max(10, Math.floor(Number(next.tiempoSegundos)) || 120));
    next.numGrupos = Math.min(MAX_GRUPOS, Math.max(2, Math.floor(Number(next.numGrupos)) || 2));
    state = next;
  }

  /** Reinicia la configuración conservando el filtro por mecanismo. */
  function reset({ keepRole = false } = {}) {
    const keepFilter = state.mecanismoFiltro;
    const rol = keepRole ? state.rol : null;
    state = { ...DEFAULTS, mecanismoFiltro: keepFilter, rol };
  }

  return { get, set, reset, DEFAULTS, MAX_PREGUNTAS, MAX_GRUPOS };
})();
