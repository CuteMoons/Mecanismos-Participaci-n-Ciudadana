/**
 * js/wordsearch/wordsearch-game.js
 * Lógica PURA de la sopa de letras (sin DOM, probada en Node):
 *  - generar(words): coloca las palabras al azar en las 8 direcciones y
 *    rellena el resto con letras aleatorias;
 *  - lineaEntre / ajustarALinea: convierten una selección (inicio → fin)
 *    en una línea recta horizontal, vertical o diagonal;
 *  - crearPartidaSopa(tablero): estado de la partida (encontradas, validación).
 *
 * Las palabras pueden leerse en los dos sentidos: al validar se compara la
 * selección con la palabra y con su inversa, así que no importa desde qué
 * extremo empiece el jugador.
 */
const WordSearch = (() => {
  // Las 8 direcciones: derecha, izquierda, abajo, arriba y las 4 diagonales.
  const DIRS = [
    { dr: 0, dc: 1, nombre: "→ de izquierda a derecha" },
    { dr: 0, dc: -1, nombre: "← de derecha a izquierda" },
    { dr: 1, dc: 0, nombre: "↓ de arriba hacia abajo" },
    { dr: -1, dc: 0, nombre: "↑ de abajo hacia arriba" },
    { dr: 1, dc: 1, nombre: "↘ diagonal hacia abajo-derecha" },
    { dr: 1, dc: -1, nombre: "↙ diagonal hacia abajo-izquierda" },
    { dr: -1, dc: 1, nombre: "↗ diagonal hacia arriba-derecha" },
    { dr: -1, dc: -1, nombre: "↖ diagonal hacia arriba-izquierda" }
  ];
  const LETRAS_RELLENO = "AAAAEEEEIIIOOOUUBCDFGHJLMNPQRSTVXYZ";

  const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const invertir = (t) => [...t].reverse().join("");

  /** Tamaño adaptable: mínimo 10×10; crece según la palabra más larga y la cantidad de letras. */
  function tamanoPara(words) {
    const largo = Math.max(...words.map((w) => w.length));
    const total = words.reduce((s, w) => s + w.length, 0);
    return Math.max(10, largo, Math.ceil(Math.sqrt(total * 1.55)));
  }

  function cabe(n, r, c, d, len) {
    const r2 = r + d.dr * (len - 1), c2 = c + d.dc * (len - 1);
    return r >= 0 && c >= 0 && r2 >= 0 && c2 >= 0 && r < n && c < n && r2 < n && c2 < n;
  }

  /** Cuántas veces aparece `word` en el tablero (en cualquiera de las 8 direcciones). */
  function contarOcurrencias(grid, word) {
    const n = grid.length;
    let total = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) for (const d of DIRS) {
      if (!cabe(n, r, c, d, word.length)) continue;
      let ok = true;
      for (let i = 0; i < word.length && ok; i++) ok = grid[r + d.dr * i][c + d.dc * i] === word[i];
      if (ok) total++;
    }
    return total;
  }

  function intentar(words, n, rnd) {
    const grid = Array.from({ length: n }, () => Array(n).fill(null));
    const colocadas = [];
    const orden = barajar(words, rnd).sort((a, b) => b.length - a.length);
    const plan = barajar(DIRS, rnd);                    // reparte las 8 direcciones entre las palabras
    for (let i = 0; i < orden.length; i++) {
      const w = orden[i];
      const dirs = [plan[i % 8], ...barajar(DIRS.filter((d) => d !== plan[i % 8]), rnd)];
      let puesta = false;
      for (const d of dirs) {
        const starts = [];
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (cabe(n, r, c, d, w.length)) starts.push([r, c]);
        for (const [r, c] of barajar(starts, rnd)) {
          let ok = true;
          for (let k = 0; k < w.length && ok; k++) { const v = grid[r + d.dr * k][c + d.dc * k]; ok = v === null || v === w[k]; }
          if (!ok) continue;
          for (let k = 0; k < w.length; k++) grid[r + d.dr * k][c + d.dc * k] = w[k];
          colocadas.push({ word: w, row: r, col: c, dr: d.dr, dc: d.dc, dirNombre: d.nombre });
          puesta = true;
          break;
        }
        if (puesta) break;
      }
      if (!puesta) return null;
    }
    // Relleno aleatorio; cada palabra debe aparecer UNA sola vez
    for (let t = 0; t < 25; t++) {
      const g = grid.map((f) => f.map((v) => v || LETRAS_RELLENO[Math.floor(rnd() * LETRAS_RELLENO.length)]));
      if (words.every((w) => contarOcurrencias(g, w) === 1)) return { n, grid: g, colocadas };
    }
    return null;
  }

  const direccionesUsadas = (r) => new Set(r.colocadas.map((c) => c.dr + "," + c.dc)).size;

  /**
   * Genera el tablero. Con 8 o más palabras se busca que aparezcan las 8
   * direcciones (horizontal, vertical y diagonales, en ambos sentidos); si el
   * tamaño base no lo permite tras muchos intentos, se queda con el mejor.
   */
  function generar(words, rnd = Math.random) {
    const base = tamanoPara(words);
    const objetivo = Math.min(8, words.length);
    let mejor = null;
    for (let n = base; n <= base + 4; n++) {
      for (let i = 0; i < 400; i++) {
        const r = intentar(words, n, rnd);
        if (!r) continue;
        if (!mejor || direccionesUsadas(r) > direccionesUsadas(mejor)) mejor = r;
        if (direccionesUsadas(r) >= objetivo) return r;
      }
      if (mejor && n === base && direccionesUsadas(mejor) >= objetivo - 1) return mejor;   // sin agrandar el tablero por una sola dirección
    }
    if (mejor) return mejor;
    throw new Error("No se pudo generar la sopa de letras");
  }

  // ----- Selección -----
  /** Casillas en línea recta entre dos casillas (8 direcciones) o null si no están alineadas. */
  function lineaEntre(n, r1, c1, r2, c2) {
    const dr = r2 - r1, dc = c2 - c1;
    if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;
    const pasos = Math.max(Math.abs(dr), Math.abs(dc));
    const sr = Math.sign(dr), sc = Math.sign(dc);
    const cells = [];
    for (let i = 0; i <= pasos; i++) {
      const r = r1 + sr * i, c = c1 + sc * i;
      if (r < 0 || c < 0 || r >= n || c >= n) return null;
      cells.push({ r, c });
    }
    return cells;
  }

  /** Durante el arrastre: ajusta (r,c) a la dirección más cercana de las 8 y devuelve la línea. */
  function ajustarALinea(n, r1, c1, r, c) {
    const dr = r - r1, dc = c - c1;
    if (dr === 0 && dc === 0) return [{ r: r1, c: c1 }];
    const idx = ((Math.round(Math.atan2(dr, dc) / (Math.PI / 4)) % 8) + 8) % 8;
    const orden = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]][idx];
    const [sr, sc] = orden;
    let largo = Math.round((dr * sr + dc * sc) / (sr * sr + sc * sc));
    const maxR = sr > 0 ? n - 1 - r1 : sr < 0 ? r1 : Infinity;
    const maxC = sc > 0 ? n - 1 - c1 : sc < 0 ? c1 : Infinity;
    largo = Math.max(0, Math.min(largo, maxR, maxC));
    const cells = [];
    for (let i = 0; i <= largo; i++) cells.push({ r: r1 + sr * i, c: c1 + sc * i });
    return cells;
  }

  // ----- Partida -----
  function crearPartidaSopa(tablero, words) {
    const encontradas = new Map();                 // palabra -> { cells, color }
    const total = words.length;

    const textoDe = (cells) => cells.map((k) => tablero.grid[k.r][k.c]).join("");

    /**
     * Valida una selección. Devuelve { tipo: "correcta"|"repetida"|"incorrecta", word?, color? }.
     * "correcta" marca la palabra como encontrada; "repetida" no suma nada.
     */
    function evaluar(cells) {
      if (!cells || cells.length < 2) return { tipo: "incorrecta" };
      const t = textoDe(cells);
      const w = words.find((x) => x === t || x === invertir(t));
      if (!w) return { tipo: "incorrecta" };
      if (encontradas.has(w)) return { tipo: "repetida", word: w };
      const color = encontradas.size;              // índice de color (rotativo en la interfaz)
      encontradas.set(w, { cells: cells.map((k) => ({ ...k })), color });
      return { tipo: "correcta", word: w, color, cells };
    }

    return {
      tablero, words, total, evaluar, textoDe,
      encontradas,
      cantidadEncontradas: () => encontradas.size,
      estaCompleta: () => encontradas.size === total,
      yaEncontrada: (w) => encontradas.has(w)
    };
  }

  return { DIRS, generar, tamanoPara, contarOcurrencias, lineaEntre, ajustarALinea, crearPartidaSopa, invertir };
})();

if (typeof module !== "undefined") module.exports = WordSearch;
