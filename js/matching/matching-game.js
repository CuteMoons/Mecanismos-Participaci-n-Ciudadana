/**
 * js/matching/matching-game.js
 * Estado y reglas del juego "Relaciona los mecanismos". No toca el
 * DOM ni implementa el arrastre en sí (eso es matching-ui.js):
 * solo decide qué pasa cuando se coloca, se quita o se comprueba
 * una relación.
 */

function crearPartidaMatching(mecanismos) {
  // Cada fila muestra el significado de un mecanismo (orden barajado);
  // el usuario debe arrastrar la ficha del mecanismo correcto sobre ella.
  const filas = shuffleArray(mecanismos).map((m) => ({
    mechanismId: m.id,
    significado: m.significado,
    filledWith: null,   // id del mecanismo colocado actualmente (correcto o no)
    correct: false,
    locked: false,
    incorrectFlash: false
  }));

  // Fichas arrastrables: una por mecanismo, en orden barajado.
  const opciones = shuffleArray(
    mecanismos.map((m) => ({ id: m.id, nombre: m.nombre, icono: m.icono, color: m.color, used: false }))
  );

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function obtenerFicha(chipId) {
    return opciones.find((o) => o.id === chipId) || null;
  }

  /**
   * Coloca la ficha `chipId` sobre la fila `rowIndex`.
   * Devuelve { ignorado, correcta } para que la interfaz reaccione
   * (sonido, mensaje, etc.) sin tener que releer todo el estado.
   */
  function colocar(rowIndex, chipId) {
    const fila = filas[rowIndex];
    if (!fila || fila.locked) return { ignorado: true };
    const ficha = obtenerFicha(chipId);
    if (!ficha || (ficha.used && fila.filledWith !== chipId)) return { ignorado: true };

    // Si la fila ya tenía otra ficha (incorrecta) puesta, la liberamos.
    if (fila.filledWith && fila.filledWith !== chipId) {
      const anterior = obtenerFicha(fila.filledWith);
      if (anterior) anterior.used = false;
    }

    ficha.used = true;
    fila.filledWith = chipId;
    const esCorrecta = chipId === fila.mechanismId;
    fila.correct = esCorrecta;
    fila.locked = esCorrecta;
    fila.incorrectFlash = !esCorrecta;

    return { ignorado: false, correcta: esCorrecta };
  }

  /** Quita la ficha de una fila (solo si no está bloqueada/correcta). */
  function quitarDeFila(rowIndex) {
    const fila = filas[rowIndex];
    if (!fila || fila.locked) return;
    if (fila.filledWith) {
      const ficha = obtenerFicha(fila.filledWith);
      if (ficha) ficha.used = false;
    }
    fila.filledWith = null;
    fila.correct = false;
    fila.incorrectFlash = false;
  }

  function contarCorrectas() {
    return filas.filter((f) => f.locked).length;
  }

  function estaCompleto() {
    return filas.every((f) => f.locked);
  }

  return {
    filas, opciones,
    colocar, quitarDeFila,
    contarCorrectas, estaCompleto,
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
