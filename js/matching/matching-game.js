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

function crearPartidaMatching(mecanismos) {
  const filas = shuffleArray(mecanismos).map((m) => ({
    mechanismId: m.id,
    significado: m.significado,
    filledWith: null     // id de la ficha colocada (acierte o no; no se revela)
  }));

  const opciones = shuffleArray(
    mecanismos.map((m) => ({ id: m.id, nombre: m.nombre, icono: m.icono, color: m.color }))
  );

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
    total: filas.length
  };
}

/**
 * Calificación de 1.0 a 5.0, proporcional a los aciertos.
 * 0% -> 1.0 · 100% -> 5.0 (exacto). Máximo un decimal.
 */
function calcularCalificacion(correctas, total) {
  if (total <= 0) return 1.0;
  const proporcion = Math.max(0, Math.min(1, correctas / total));
  const nota = 1 + proporcion * 4;
  const limitada = Math.max(1, Math.min(5, nota));
  return Math.round(limitada * 10) / 10;
}

if (typeof module !== "undefined") module.exports = { crearPartidaMatching, calcularCalificacion };
