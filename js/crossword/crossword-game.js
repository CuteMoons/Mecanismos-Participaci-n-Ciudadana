/**
 * js/crossword/crossword-game.js
 * Estado y reglas de una partida de crucigrama: respuestas del
 * estudiante, puntuación, ayudas y comprobación. No toca el DOM.
 */

function crearPartidaCrucigrama(resultadoGenerador) {
  const { grid, numbers, placements, rows, cols } = resultadoGenerador;

  // answers[r][c] = letra escrita por el estudiante (o "" si vacía)
  const answers = Array.from({ length: rows }, () => Array(cols).fill(""));
  // Estado de revisión por celda: null | "correct" | "incorrect"
  const cellStatus = Array.from({ length: rows }, () => Array(cols).fill(null));

  const wordState = placements.map(() => ({ solved: false, revealed: false, penalizedIncorrect: false }));

  let score = 0;
  const PUNTOS = { palabraCorrecta: 100, letraRevelada: -20, palabraRevelada: -50, respuestaIncorrecta: -10 };

  function sumarPuntos(delta) {
    score = Math.max(0, score + delta);
  }

  function celdaValida(r, c) {
    return r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c];
  }

  function letraCorrecta(r, c) {
    return grid[r][c] ? grid[r][c].letter : null;
  }

  /** Escribe una letra en (r,c) y revisa si eso completa alguna palabra. */
  function escribirLetra(r, c, letra) {
    if (!celdaValida(r, c)) return [];
    answers[r][c] = letra ? letra.toUpperCase() : "";
    cellStatus[r][c] = null; // al escribir, se limpia cualquier marca previa de "incorrecta"
    return revisarPalabrasQueUsanCelda(r, c);
  }

  function borrarLetra(r, c) {
    if (!celdaValida(r, c)) return;
    answers[r][c] = "";
    cellStatus[r][c] = null;
  }

  function palabraCompleta(placement) {
    for (let i = 0; i < placement.length; i++) {
      const r = placement.dir === "down" ? placement.row + i : placement.row;
      const c = placement.dir === "across" ? placement.col + i : placement.col;
      if (!answers[r][c]) return false;
    }
    return true;
  }

  function palabraCorrectaCompleta(placement) {
    for (let i = 0; i < placement.length; i++) {
      const r = placement.dir === "down" ? placement.row + i : placement.row;
      const c = placement.dir === "across" ? placement.col + i : placement.col;
      if (answers[r][c] !== letraCorrecta(r, c)) return false;
    }
    return true;
  }

  /** Revisa las palabras que pasan por (r,c); otorga puntos si alguna quedó recién resuelta. */
  function revisarPalabrasQueUsanCelda(r, c) {
    if (!grid[r][c]) return [];
    const eventos = [];
    grid[r][c].words.forEach((idx) => {
      const estado = wordState[idx];
      const placement = placements[idx];
      if (estado.solved) return;
      if (palabraCompleta(placement) && palabraCorrectaCompleta(placement)) {
        estado.solved = true;
        if (!estado.revealed) sumarPuntos(PUNTOS.palabraCorrecta);
        eventos.push({ type: "solved", index: idx });
      }
    });
    return eventos;
  }

  function revelarLetra(idx) {
    const placement = placements[idx];
    const estado = wordState[idx];
    if (estado.solved) return null;
    for (let i = 0; i < placement.length; i++) {
      const r = placement.dir === "down" ? placement.row + i : placement.row;
      const c = placement.dir === "across" ? placement.col + i : placement.col;
      if (!answers[r][c]) {
        answers[r][c] = letraCorrecta(r, c);
        cellStatus[r][c] = null;
        sumarPuntos(PUNTOS.letraRevelada);
        estado.revealed = true;
        if (palabraCompleta(placement) && palabraCorrectaCompleta(placement)) {
          estado.solved = true;
          return { row: r, col: c, solved: true };
        }
        return { row: r, col: c, solved: false };
      }
    }
    return null; // ya estaba completa
  }

  function revelarPalabra(idx) {
    const placement = placements[idx];
    const estado = wordState[idx];
    if (estado.solved) return;
    for (let i = 0; i < placement.length; i++) {
      const r = placement.dir === "down" ? placement.row + i : placement.row;
      const c = placement.dir === "across" ? placement.col + i : placement.col;
      answers[r][c] = letraCorrecta(r, c);
      cellStatus[r][c] = null;
    }
    sumarPuntos(PUNTOS.palabraRevelada);
    estado.revealed = true;
    estado.solved = true;
  }

  /** Comprueba todas las palabras y marca estado visual correcto/incorrecto. */
  function comprobarTodo() {
    let correctas = 0;
    placements.forEach((placement, idx) => {
      const estado = wordState[idx];
      if (estado.solved) { correctas++; return; }
      if (!palabraCompleta(placement)) return; // sin completar: no se evalúa aún

      const esCorrecta = palabraCorrectaCompleta(placement);
      for (let i = 0; i < placement.length; i++) {
        const r = placement.dir === "down" ? placement.row + i : placement.row;
        const c = placement.dir === "across" ? placement.col + i : placement.col;
        cellStatus[r][c] = esCorrecta ? "correct" : "incorrect";
      }
      if (esCorrecta) {
        estado.solved = true;
        correctas++;
        sumarPuntos(PUNTOS.palabraCorrecta);
      } else if (!estado.penalizedIncorrect) {
        estado.penalizedIncorrect = true;
        sumarPuntos(PUNTOS.respuestaIncorrecta);
      }
    });
    return { correctas, total: placements.length };
  }

  function estaCompleto() {
    return wordState.every((w) => w.solved);
  }

  function palabrasResueltas() {
    return wordState.filter((w) => w.solved).length;
  }

  return {
    grid, numbers, placements, rows, cols, answers, cellStatus, wordState,
    escribirLetra, borrarLetra, revelarLetra, revelarPalabra,
    comprobarTodo, estaCompleto, palabrasResueltas,
    getScore: () => score
  };
}
