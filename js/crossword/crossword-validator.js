/**
 * js/crossword/crossword-validator.js
 * Verifica que una distribución de crucigrama sea CORRECTA:
 *  - cada palabra cabe en el tablero y sus letras coinciden con la respuesta;
 *  - las intersecciones comparten la misma letra (una horizontal + una vertical);
 *  - no hay dos palabras de la misma dirección solapadas;
 *  - no se forman palabras "accidentales" (cada tramo contiguo de 2+ casillas
 *    corresponde exactamente a una palabra del crucigrama);
 *  - todas las palabras están conectadas entre sí y cruzan al menos una vez
 *    (no hay palabras ni casillas inaccesibles);
 *  - cada palabra tiene su pista.
 * Se usa al generar las distribuciones (tools/) y de nuevo al iniciar cada
 * partida: una distribución que no pase NO se juega.
 *
 * layout = { rows, cols, placements: [{ word, row, col, dir: "across"|"down" }] }
 * words  = [{ word, clue }]
 */
const CrosswordValidator = (() => {
  function validarLayout(layout, words) {
    const errores = [];
    const { rows, cols, placements } = layout;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    const porPalabra = new Map(words.map((w) => [w.word, w]));
    const usadas = new Set();

    placements.forEach((p, idx) => {
      const entry = porPalabra.get(p.word);
      if (!entry) { errores.push(`Palabra sin pista/entrada: ${p.word}`); return; }
      if (!entry.clue || !String(entry.clue).trim()) errores.push(`Sin pista: ${p.word}`);
      if (usadas.has(p.word)) errores.push(`Palabra repetida: ${p.word}`);
      usadas.add(p.word);
      if (p.word.length < 2) errores.push(`Palabra demasiado corta: ${p.word}`);
      const dr = p.dir === "down" ? 1 : 0, dc = p.dir === "across" ? 1 : 0;
      if (p.dir !== "down" && p.dir !== "across") errores.push(`Dirección inválida: ${p.word}`);
      for (let i = 0; i < p.word.length; i++) {
        const r = p.row + dr * i, c = p.col + dc * i;
        if (r < 0 || c < 0 || r >= rows || c >= cols) { errores.push(`${p.word} se sale del tablero`); return; }
        const cell = grid[r][c];
        if (cell) {
          if (cell.letter !== p.word[i]) errores.push(`Choque de letras en (${r},${c}): ${cell.letter} / ${p.word[i]} (${p.word})`);
          if (cell.dirs[p.dir]) errores.push(`Solape en la misma dirección en (${r},${c}) (${p.word})`);
          cell.dirs[p.dir] = idx;
          cell.words.push(idx);
        } else {
          grid[r][c] = { letter: p.word[i], dirs: { [p.dir]: idx }, words: [idx] };
        }
      }
    });
    words.forEach((w) => { if (!usadas.has(w.word)) errores.push(`Falta colocar: ${w.word}`); });
    if (errores.length) return { ok: false, errores };

    // Tramos contiguos: deben coincidir exactamente con una palabra
    const tramo = (esFila) => {
      const n1 = esFila ? rows : cols, n2 = esFila ? cols : rows;
      for (let a = 0; a < n1; a++) {
        let inicio = -1;
        for (let b = 0; b <= n2; b++) {
          const lleno = b < n2 && (esFila ? grid[a][b] : grid[b][a]);
          if (lleno && inicio === -1) inicio = b;
          if (!lleno && inicio !== -1) {
            const largo = b - inicio;
            if (largo >= 2) {
              const dir = esFila ? "across" : "down";
              const r = esFila ? a : inicio, c = esFila ? inicio : a;
              const ok = placements.some((p) => p.dir === dir && p.row === r && p.col === c && p.word.length === largo);
              if (!ok) errores.push(`Palabra accidental (${dir}) en (${r},${c}) longitud ${largo}`);
            }
            inicio = -1;
          }
        }
      }
    };
    tramo(true); tramo(false);

    // Cruces y conectividad
    const vecinos = placements.map(() => new Set());
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell && cell.words.length === 2) { vecinos[cell.words[0]].add(cell.words[1]); vecinos[cell.words[1]].add(cell.words[0]); }
      if (cell && cell.words.length > 2) errores.push(`Más de dos palabras en (${r},${c})`);
    }
    placements.forEach((p, i) => { if (vecinos[i].size === 0 && placements.length > 1) errores.push(`${p.word} no cruza con ninguna palabra`); });
    const visto = new Set([0]); const pila = [0];
    while (pila.length) { const x = pila.pop(); vecinos[x].forEach((y) => { if (!visto.has(y)) { visto.add(y); pila.push(y); } }); }
    if (visto.size !== placements.length) errores.push("El tablero no está conectado");

    // Tablero recortado (sin filas/columnas vacías en los bordes)
    const filaUsada = (r) => grid[r].some(Boolean);
    const colUsada = (c) => grid.some((f) => f[c]);
    if (!filaUsada(0) || !filaUsada(rows - 1) || !colUsada(0) || !colUsada(cols - 1)) errores.push("El tablero no está recortado");

    return { ok: errores.length === 0, errores };
  }

  /** Firma estructural (independiente de giros/espejos): pares de palabras que se cruzan y en qué letras. */
  function firmaDeCruces(layout) {
    const celdas = new Map();
    layout.placements.forEach((p) => {
      const dr = p.dir === "down" ? 1 : 0, dc = p.dir === "across" ? 1 : 0;
      for (let i = 0; i < p.word.length; i++) {
        const k = `${p.row + dr * i},${p.col + dc * i}`;
        if (!celdas.has(k)) celdas.set(k, []);
        celdas.get(k).push({ w: p.word, i });
      }
    });
    const firma = new Set();
    celdas.forEach((v) => {
      if (v.length === 2) {
        const [a, b] = v.sort((x, y) => (x.w < y.w ? -1 : 1));
        firma.add(`${a.w}:${a.i}|${b.w}:${b.i}`);
      }
    });
    return firma;
  }

  return { validarLayout, firmaDeCruces };
})();

if (typeof module !== "undefined") module.exports = CrosswordValidator;
