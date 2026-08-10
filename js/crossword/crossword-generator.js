/**
 * js/crossword/crossword-generator.js
 *
 * Genera la cuadrícula del crucigrama a partir de una lista de
 * entradas { word, clue, mechanism, difficulty }. No toca el DOM:
 * solo produce una estructura de datos que crossword-ui.js pinta.
 *
 * Estrategia:
 *   1. Ordenar palabras de mayor a menor longitud (las largas cruzan mejor).
 *   2. Colocar la primera palabra en el centro, en horizontal.
 *   3. Para cada palabra siguiente, buscar una letra en común con una
 *      palabra ya colocada y probar cruzarla en la orientación
 *      contraria, validando que no se generen colisiones inválidas.
 *   4. Si una palabra no logra cruzar con nada, se descarta (mejor
 *      tener un crucigrama conectado y prolijo que uno con piezas
 *      sueltas).
 *   5. Recortar la cuadrícula al área realmente usada y numerar las
 *      casillas que inician palabra (horizontal y/o vertical).
 */

const CrosswordGenerator = (() => {
  const GRID_SIZE = 25; // lienzo de trabajo amplio; se recorta al final
  const CENTER = Math.floor(GRID_SIZE / 2);

  function crearGridVacio() {
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
  }

  /** ¿Puede colocarse `word` en (row,col) con esa orientación sin conflictos? */
  function puedeColocar(grid, word, row, col, dir) {
    const dr = dir === "down" ? 1 : 0;
    const dc = dir === "across" ? 1 : 0;

    // Casilla inmediatamente anterior y posterior deben estar libres
    // (para no pegar la palabra a otra sin separación).
    const antesR = row - dr, antesC = col - dc;
    const despuesR = row + dr * word.length, despuesC = col + dc * word.length;
    if (dentro(antesR, antesC) && grid[antesR][antesC]) return false;
    if (dentro(despuesR, despuesC) && grid[despuesR][despuesC]) return false;

    let tieneAlgunCruce = false;

    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (!dentro(r, c)) return false;

      const celda = grid[r][c];
      if (celda) {
        if (celda.letter !== word[i]) return false; // choque de letras distintas
        tieneAlgunCruce = true;
      } else {
        // Si la celda está vacía, las celdas perpendiculares adyacentes
        // deben estarlo también (evita palabras "pegadas" sin cruce real).
        if (dir === "across") {
          if ((dentro(r - 1, c) && grid[r - 1][c]) || (dentro(r + 1, c) && grid[r + 1][c])) return false;
        } else {
          if ((dentro(r, c - 1) && grid[r][c - 1]) || (dentro(r, c + 1) && grid[r][c + 1])) return false;
        }
      }
    }
    return { ok: true, cruces: tieneAlgunCruce };
  }

  function dentro(r, c) {
    return r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE;
  }

  function colocar(grid, entry, row, col, dir, index) {
    const dr = dir === "down" ? 1 : 0;
    const dc = dir === "across" ? 1 : 0;
    for (let i = 0; i < entry.word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (!grid[r][c]) grid[r][c] = { letter: entry.word[i], words: [] };
      grid[r][c].words.push(index);
    }
    return { index, row, col, dir, length: entry.word.length };
  }

  /** Busca la mejor posición para cruzar `entry` con lo ya colocado. */
  function buscarPosicion(grid, entry) {
    const candidatos = [];
    for (let li = 0; li < entry.word.length; li++) {
      const letra = entry.word[li];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const celda = grid[r][c];
          if (!celda || celda.letter !== letra) continue;

          // Si la celda existente pertenece a una palabra horizontal,
          // intentamos colocar esta nueva en vertical (y viceversa).
          const dir = celdaEsHorizontal(grid, r, c) ? "down" : "across";
          const row = dir === "down" ? r - li : r;
          const col = dir === "across" ? c - li : c;
          const resultado = puedeColocar(grid, entry.word, row, col, dir);
          if (resultado && resultado.ok && resultado.cruces) {
            candidatos.push({ row, col, dir, cruces: contarCruces(grid, entry.word, row, col, dir) });
          }
        }
      }
    }
    if (candidatos.length === 0) return null;
    // Preferir la posición con más cruces (mejor conectividad).
    candidatos.sort((a, b) => b.cruces - a.cruces);
    return candidatos[0];
  }

  function celdaEsHorizontal(grid, r, c) {
    const izq = dentro(r, c - 1) && grid[r][c - 1];
    const der = dentro(r, c + 1) && grid[r][c + 1];
    return Boolean(izq || der);
  }

  function contarCruces(grid, word, row, col, dir) {
    const dr = dir === "down" ? 1 : 0;
    const dc = dir === "across" ? 1 : 0;
    let n = 0;
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (dentro(r, c) && grid[r][c]) n++;
    }
    return n;
  }

  /**
   * Genera el crucigrama. Devuelve { grid, placements } ya recortado
   * al área usada, con coordenadas relativas a esa área.
   */
  function generar(entries) {
    const ordenadas = [...entries].sort((a, b) => b.word.length - a.word.length);
    const grid = crearGridVacio();
    const placements = [];

    // Primera palabra: centrada, horizontal.
    const primera = ordenadas[0];
    const colInicio = CENTER - Math.floor(primera.word.length / 2);
    placements.push(colocar(grid, primera, CENTER, colInicio, "across", 0));

    for (let i = 1; i < ordenadas.length; i++) {
      const entry = ordenadas[i];
      const pos = buscarPosicion(grid, entry);
      if (!pos) continue; // no se logró cruzar: se descarta esta palabra
      placements.push(colocar(grid, entry, pos.row, pos.col, pos.dir, i));
    }

    return recortar(grid, placements, ordenadas);
  }

  /** Recorta el grid al área realmente usada y numera las palabras. */
  function recortar(grid, placements, entries) {
    let minR = GRID_SIZE, maxR = -1, minC = GRID_SIZE, maxC = -1;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c]) {
          minR = Math.min(minR, r); maxR = Math.max(maxR, r);
          minC = Math.min(minC, c); maxC = Math.max(maxC, c);
        }
      }
    }

    const rows = maxR - minR + 1;
    const cols = maxC - minC + 1;
    const finalGrid = Array.from({ length: rows }, () => Array(cols).fill(null));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        finalGrid[r][c] = grid[minR + r][minC + c];
      }
    }

    const finalPlacements = placements.map((p) => ({
      ...p,
      row: p.row - minR,
      col: p.col - minC,
      entry: entries[p.index]
    }));

    // Numeración: recorrido por filas/columnas; una celda recibe número
    // si inicia una palabra horizontal y/o vertical.
    let numero = 1;
    const numeros = Array.from({ length: rows }, () => Array(cols).fill(null));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!finalGrid[r][c]) continue;
        const iniciaAcross = (!finalGrid[r][c - 1] || c === 0) && finalGrid[r][c + 1];
        const iniciaDown = (!finalGrid[r - 1] || !finalGrid[r - 1][c] || r === 0) && finalGrid[r + 1] && finalGrid[r + 1][c];
        if (iniciaAcross || iniciaDown) {
          numeros[r][c] = numero++;
        }
      }
    }

    finalPlacements.forEach((p) => {
      p.number = numeros[p.row][p.col];
    });

    return { grid: finalGrid, numbers: numeros, placements: finalPlacements, rows, cols };
  }

  return { generar };
})();
