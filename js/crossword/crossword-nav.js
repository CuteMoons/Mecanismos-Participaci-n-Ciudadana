/**
 * js/crossword/crossword-nav.js
 * Lógica PURA de selección y navegación del tablero (no toca el DOM):
 * qué palabra está activa, hacia dónde se escribe y cómo se mueve el
 * cursor. Recibe la "partida" (grid, placements, answers, celdaBloqueada)
 * y devuelve el nuevo estado de selección, por lo que se puede probar
 * sin navegador.
 *
 * Modelo: la selección es { row, col, dir } donde `dir` es la dirección
 * ACTIVA ("across" | "down"). La palabra activa es la que pasa por esa
 * casilla en esa dirección. Una casilla pertenece a una o a dos palabras
 * (una por dirección); solo en las intersecciones se puede alternar.
 */

const CrosswordNav = (() => {
  const DIRS = ["across", "down"];

  /** Palabra (índice en placements) que pasa por (r,c) en la dirección dada, o -1. */
  function palabraEn(partida, r, c, dir) {
    const cell = partida.grid[r] && partida.grid[r][c];
    if (!cell) return -1;
    const idx = cell.words.find((i) => partida.placements[i].dir === dir);
    return idx === undefined ? -1 : idx;
  }

  function direccionesDisponibles(partida, r, c) {
    return DIRS.filter((d) => palabraEn(partida, r, c, d) !== -1);
  }

  function esCasillaValida(partida, r, c) {
    return r >= 0 && r < partida.rows && c >= 0 && c < partida.cols && Boolean(partida.grid[r][c]);
  }

  /** Casillas de una palabra, en orden. */
  function casillasDePalabra(partida, idx) {
    const p = partida.placements[idx];
    const out = [];
    for (let i = 0; i < p.length; i++) {
      out.push({ row: p.dir === "down" ? p.row + i : p.row, col: p.dir === "across" ? p.col + i : p.col });
    }
    return out;
  }

  /**
   * Clic (o toque) en una casilla.
   *  - casilla de una sola palabra → se selecciona esa palabra;
   *  - casilla compartida → si ya estaba seleccionada se alterna la
   *    dirección; si no, se conserva la dirección actual cuando es posible.
   */
  function seleccionar(partida, sel, r, c) {
    if (!esCasillaValida(partida, r, c)) return sel;
    const dirs = direccionesDisponibles(partida, r, c);
    if (dirs.length === 0) return sel;
    if (dirs.length === 1) return { row: r, col: c, dir: dirs[0] };

    const mismaCasilla = sel && sel.row === r && sel.col === c;
    if (mismaCasilla) return { row: r, col: c, dir: sel.dir === "across" ? "down" : "across" };
    const dirActual = sel ? sel.dir : "across";
    return { row: r, col: c, dir: dirs.includes(dirActual) ? dirActual : dirs[0] };
  }

  /** Alterna la dirección sin mover el cursor (solo si la casilla es compartida). */
  function alternarDireccion(partida, sel) {
    if (!sel) return sel;
    const dirs = direccionesDisponibles(partida, sel.row, sel.col);
    if (dirs.length < 2) return sel;
    return { row: sel.row, col: sel.col, dir: sel.dir === "across" ? "down" : "across" };
  }

  /** Selecciona una palabra completa (clic en una pista): cursor en su primera casilla libre. */
  function seleccionarPalabra(partida, idx) {
    const casillas = casillasDePalabra(partida, idx);
    const p = partida.placements[idx];
    const libre = casillas.find((k) => !partida.answers[k.row][k.col] && !partida.celdaBloqueada(k.row, k.col));
    const destino = libre || casillas[0];
    return { row: destino.row, col: destino.col, dir: p.dir };
  }

  /**
   * Flechas: mueven el cursor a la siguiente casilla en esa dirección,
   * saltando huecos vacíos. NO cambian la palabra activa mientras la
   * casilla de destino admita la dirección actual; si no la admite,
   * se usa la única dirección disponible. Si no hay casilla, no se mueve.
   */
  function mover(partida, sel, tecla) {
    if (!sel) return sel;
    const delta = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[tecla];
    if (!delta) return sel;
    let r = sel.row + delta[0];
    let c = sel.col + delta[1];
    while (r >= 0 && r < partida.rows && c >= 0 && c < partida.cols && !partida.grid[r][c]) {
      r += delta[0];
      c += delta[1];
    }
    if (!esCasillaValida(partida, r, c)) return sel; // borde del tablero: no pasa nada
    const dirs = direccionesDisponibles(partida, r, c);
    const dir = dirs.includes(sel.dir) ? sel.dir : dirs[0];
    return { row: r, col: c, dir };
  }

  /** Siguiente casilla EDITABLE (no bloqueada) de la palabra activa, o null. */
  function siguienteEnPalabra(partida, sel) {
    const idx = palabraEn(partida, sel.row, sel.col, sel.dir);
    if (idx === -1) return null;
    const casillas = casillasDePalabra(partida, idx);
    const pos = casillas.findIndex((k) => k.row === sel.row && k.col === sel.col);
    for (let i = pos + 1; i < casillas.length; i++) {
      if (!partida.celdaBloqueada(casillas[i].row, casillas[i].col)) return casillas[i];
    }
    return null;
  }

  /** Casilla EDITABLE anterior de la palabra activa, o null. */
  function anteriorEnPalabra(partida, sel) {
    const idx = palabraEn(partida, sel.row, sel.col, sel.dir);
    if (idx === -1) return null;
    const casillas = casillasDePalabra(partida, idx);
    const pos = casillas.findIndex((k) => k.row === sel.row && k.col === sel.col);
    for (let i = pos - 1; i >= 0; i--) {
      if (!partida.celdaBloqueada(casillas[i].row, casillas[i].col)) return casillas[i];
    }
    return null;
  }

  /**
   * Escribir una letra en la casilla seleccionada.
   * Devuelve { escribe, siguiente } — `escribe` indica si la casilla es
   * editable (si está bloqueada por una palabra resuelta, no se toca) y
   * `siguiente` la casilla a la que debe pasar el cursor dentro de LA MISMA
   * palabra activa (o null si es la última).
   */
  function alEscribir(partida, sel) {
    const idx = palabraEn(partida, sel.row, sel.col, sel.dir);
    if (idx === -1) return { escribe: false, siguiente: null };
    const escribe = !partida.celdaBloqueada(sel.row, sel.col);
    return { escribe, siguiente: escribe ? siguienteEnPalabra(partida, sel) : null };
  }

  /**
   * Retroceso:
   *  - si la casilla tiene letra → se borra y el cursor se queda ahí;
   *  - si está vacía → el cursor pasa a la casilla anterior de la palabra
   *    y se borra su letra (si no hay anterior, no pasa nada).
   * Devuelve { borrar: {row,col}|null, cursor: {row,col} }.
   */
  function alRetroceso(partida, sel) {
    const aqui = { row: sel.row, col: sel.col };
    const editable = !partida.celdaBloqueada(sel.row, sel.col);
    if (partida.answers[sel.row][sel.col] && editable) return { borrar: aqui, cursor: aqui };
    const prev = anteriorEnPalabra(partida, sel);
    if (!prev) return { borrar: null, cursor: aqui };
    return { borrar: prev, cursor: prev };
  }

  return {
    palabraEn, direccionesDisponibles, casillasDePalabra,
    seleccionar, alternarDireccion, seleccionarPalabra, mover,
    siguienteEnPalabra, anteriorEnPalabra, alEscribir, alRetroceso
  };
})();

if (typeof module !== "undefined") module.exports = CrosswordNav;
