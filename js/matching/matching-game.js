/**
 * js/matching/matching-game.js
 * Estado y reglas del juego "Relaciona los mecanismos". No toca el DOM.
 *
 * Reglas:
 *  - Cada mecanismo (ficha) puede estar en UN solo significado a la vez.
 *  - Colocar una ficha en un significado ocupado intercambia/devuelve la anterior.
 *  - Las relaciones se pueden corregir libremente hasta comprobar:
 *    no hay aciertos ni errores a la vista durante la partida.
 *  - Solo al comprobar (evaluar) se calcula el resultado.
 */

function crearPartidaMatching(mecanismos, meta = {}) {
  // La correspondencia se guarda por `id` (fila.mechanismId ↔ ficha.id): mezclar el
  // orden visual de filas y fichas nunca cambia cuál es la respuesta correcta.
  let ordenFilas, ordenFichas;
  let intentos = 0;
  do {
    ordenFilas = shuffleArray(mecanismos);
    ordenFichas = shuffleArray(mecanismos);
    intentos++;
    // Evita que fichas y filas queden en el mismo orden (respuestas "alineadas").
  } while (mecanismos.length > 2 && intentos < 8 && ordenFilas.every((m, i) => m.id === ordenFichas[i].id));

  const filas = ordenFilas.map((m) => ({
    mechanismId: m.id,
    significado: m.significado,
    filledWith: null     // id de la ficha colocada (acierte o no; no se revela)
  }));

  const opciones = ordenFichas.map((m) => ({ id: m.id, nombre: m.nombre, icono: m.icono, emoji: m.emoji, color: m.color }));

  let evaluada = false;

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const obtenerFicha = (chipId) => opciones.find((o) => o.id === chipId) || null;
  const filaDeFicha = (chipId) => filas.findIndex((f) => f.filledWith === chipId);

  /**
   * Coloca la ficha en la fila. Si la ficha venía de otra fila y la de
   * destino estaba ocupada, ambas se intercambian; si venía del grupo
   * de disponibles, la ocupante regresa al grupo.
   * Devuelve { ignorado, movida, desde } para que la interfaz reaccione.
   */
  function colocar(rowIndex, chipId) {
    if (evaluada) return { ignorado: true };
    const fila = filas[rowIndex];
    if (!fila || !obtenerFicha(chipId)) return { ignorado: true };
    const origen = filaDeFicha(chipId);
    if (origen === rowIndex) return { ignorado: true };

    const ocupante = fila.filledWith;
    if (origen !== -1) filas[origen].filledWith = ocupante || null; // intercambio (o queda vacía)
    fila.filledWith = chipId;
    return { ignorado: false, desde: origen, intercambio: Boolean(ocupante && origen !== -1) };
  }

  /** Devuelve la ficha al grupo de disponibles. */
  function quitarDeFila(rowIndex) {
    if (evaluada) return false;
    const fila = filas[rowIndex];
    if (!fila || !fila.filledWith) return false;
    fila.filledWith = null;
    return true;
  }

  const disponibles = () => opciones.filter((o) => filaDeFicha(o.id) === -1);
  const contarColocadas = () => filas.filter((f) => f.filledWith).length;
  const estaCompleto = () => filas.every((f) => f.filledWith);

  /** Comprueba todas las relaciones. A partir de aquí la partida queda cerrada. */
  function evaluar() {
    evaluada = true;
    return filas.map((f) => ({ correcta: f.filledWith === f.mechanismId }));
  }

  const contarCorrectas = () => filas.filter((f) => f.filledWith === f.mechanismId).length;

  return {
    filas, opciones,
    colocar, quitarDeFila, filaDeFicha, obtenerFicha, disponibles,
    contarColocadas, estaCompleto, evaluar, contarCorrectas,
    estaEvaluada: () => evaluada,
    meta,
    total: filas.length
  };
}

// calcularCalificacion() vive en js/grading.js (compartida con la sopa de letras).

if (typeof module !== "undefined") module.exports = { crearPartidaMatching };
