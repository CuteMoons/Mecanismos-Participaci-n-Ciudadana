/**
 * tools/generar-crucigramas.js
 * Genera y VERIFICA distribuciones para cada versión de tools/crossword-source.js
 * y escribe data/crossword/crossword-versions.js.
 *   node tools/generar-crucigramas.js
 *
 * Por versión se buscan distribuciones con cruces reales distintos: dos
 * distribuciones solo cuentan como diferentes si el conjunto de cruces
 * (qué palabras se cortan y en qué letras) cambia; girar o reflejar un
 * tablero NO las vuelve distintas.
 */
const fs = require("fs");
const path = require("path");
const Validator = require("../js/crossword/crossword-validator.js");
const fuente = require("./crossword-source.js");

const MIN_DISTRIBUCIONES = 3;
const OBJETIVO = 4;          // se guardan hasta 4 si existen
const INTENTOS = 6000;
const MAX_LADO = 17;

function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function intento(words, rng) {
  const cells = new Map(); // "r,c" -> {letter, dirs:{across?,down?}}
  const placed = [];
  const get = (r, c) => cells.get(r + "," + c);
  function puede(word, r, c, dir) {
    const dr = dir === "down" ? 1 : 0, dc = dir === "across" ? 1 : 0, per = dir === "down" ? [0, 1] : [1, 0];
    if (get(r - dr, c - dc) || get(r + dr * word.length, c + dc * word.length)) return -1;
    let cruces = 0;
    for (let i = 0; i < word.length; i++) {
      const rr = r + dr * i, cc = c + dc * i, cell = get(rr, cc);
      if (cell) {
        if (cell.letter !== word[i] || cell.dirs[dir]) return -1;
        cruces++;
      } else if (get(rr + per[0], cc + per[1]) || get(rr - per[0], cc - per[1])) return -1;
    }
    return cruces;
  }
  function colocar(word, r, c, dir) {
    const dr = dir === "down" ? 1 : 0, dc = dir === "across" ? 1 : 0;
    for (let i = 0; i < word.length; i++) {
      const k = (r + dr * i) + "," + (c + dc * i);
      if (!cells.has(k)) cells.set(k, { letter: word[i], dirs: {} });
      cells.get(k).dirs[dir] = true;
    }
    placed.push({ word, row: r, col: c, dir });
  }
  function caja() {
    let a = 1e9, b = -1e9, c2 = 1e9, d = -1e9;
    cells.forEach((_, k) => { const [r, c] = k.split(",").map(Number); a = Math.min(a, r); b = Math.max(b, r); c2 = Math.min(c2, c); d = Math.max(d, c); });
    return { h: b - a + 1, w: d - c2 + 1 };
  }
  const orden = [...words].sort(() => rng() - 0.5);
  // la primera es de las largas para dar espacio
  orden.sort((a, b) => b.length - a.length + (rng() - 0.5) * 6);
  colocar(orden[0], 0, 0, rng() < 0.5 ? "across" : "down");
  const resto = orden.slice(1);
  while (resto.length) {
    // elegir la palabra con más opciones (con algo de azar)
    let mejor = null;
    for (const [idx, w] of resto.entries()) {
      const cand = [];
      cells.forEach((cell, k) => {
        const [r0, c0] = k.split(",").map(Number);
        for (let i = 0; i < w.length; i++) if (w[i] === cell.letter) {
          for (const dir of ["across", "down"]) {
            if (cell.dirs[dir]) continue;
            const r = dir === "down" ? r0 - i : r0, c = dir === "across" ? c0 - i : c0;
            const cr = puede(w, r, c, dir);
            if (cr > 0) cand.push({ r, c, dir, cr });
          }
        }
      });
      if (!cand.length) return null;
      if (!mejor || cand.length + rng() * 3 < mejor.cand.length) mejor = { idx, w, cand };
    }
    const { idx, w, cand } = mejor;
    // evaluar: preferir tablero compacto con más cruces
    const evaluados = cand.map((p) => {
      const snap = [...cells.keys()];
      colocar(w, p.r, p.c, p.dir);
      const b = caja();
      // deshacer
      placed.pop();
      const dr = p.dir === "down" ? 1 : 0, dc = p.dir === "across" ? 1 : 0;
      for (let i = 0; i < w.length; i++) { const k = (p.r + dr * i) + "," + (p.c + dc * i); const ce = cells.get(k); delete ce.dirs[p.dir]; if (!Object.keys(ce.dirs).length) cells.delete(k); }
      return { p, score: Math.max(b.h, b.w) * 2 + b.h * b.w * 0.05 - p.cr * 1.5 + rng() * 6 };
    }).sort((x, y) => x.score - y.score);
    const elegido = evaluados[0].p;
    colocar(w, elegido.r, elegido.c, elegido.dir);
    resto.splice(idx, 1);
  }
  // normalizar
  let minR = 1e9, minC = 1e9;
  placed.forEach((p) => { minR = Math.min(minR, p.row); minC = Math.min(minC, p.col); });
  placed.forEach((p) => { p.row -= minR; p.col -= minC; });
  let rows = 0, cols = 0;
  placed.forEach((p) => { rows = Math.max(rows, p.row + (p.dir === "down" ? p.word.length : 1)); cols = Math.max(cols, p.col + (p.dir === "across" ? p.word.length : 1)); });
  return { rows, cols, placements: placed };
}

function similitud(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  return inter / (a.size + b.size - inter || 1);
}

const salida = [];
let ok = true;
for (const v of fuente) {
  const rng = mulberry32(0xC0FFEE + v.id.length * 977 + v.words.length);
  const words = v.words.map((w) => w.word);
  const candidatos = [];
  for (let i = 0; i < INTENTOS; i++) {
    const l = intento(words, rng);
    if (!l || Math.max(l.rows, l.cols) > MAX_LADO) continue;
    const res = Validator.validarLayout(l, v.words);
    if (!res.ok) continue;                      // solo entran distribuciones verificadas
    candidatos.push({ l, firma: Validator.firmaDeCruces(l), area: l.rows * l.cols });
  }
  candidatos.sort((a, b) => a.area - b.area);
  const elegidos = [];
  for (const c of candidatos) {
    if (elegidos.every((e) => similitud(e.firma, c.firma) < 0.5 && e.firma.size !== 0)) elegidos.push(c);
    if (elegidos.length >= OBJETIVO) break;
  }
  console.log(`${v.id}: ${candidatos.length} válidas, ${elegidos.length} distintas elegidas ` + elegidos.map((e) => `${e.l.rows}x${e.l.cols}`).join(" "));
  if (elegidos.length < MIN_DISTRIBUCIONES) { console.error("  ✖ no se lograron 3 distribuciones distintas"); ok = false; }
  salida.push({
    id: v.id, titulo: v.titulo, nivel: v.nivel, words: v.words,
    layouts: elegidos.map((e) => ({
      rows: e.l.rows, cols: e.l.cols,
      placements: e.l.placements.map((p) => ({ word: p.word, row: p.row, col: p.col, dir: p.dir }))
    }))
  });
}
if (!ok) process.exit(1);
const cab = `/**
 * data/crossword/crossword-versions.js
 * ARCHIVO GENERADO por tools/generar-crucigramas.js — no editar a mano.
 * Versiones de crucigrama con distribuciones PREVIAMENTE VERIFICADAS
 * (js/crossword/crossword-validator.js). Cada versión tiene sus propias
 * palabras y pistas y varias distribuciones con cruces distintos.
 * Para cambiar contenido, edita tools/crossword-source.js y vuelve a generar.
 */
`;
fs.writeFileSync(path.join(__dirname, "../data/crossword/crossword-versions.js"), cab + "const CROSSWORD_VERSIONS = " + JSON.stringify(salida, null, 1) + ";\n\nif (typeof module !== \"undefined\") module.exports = CROSSWORD_VERSIONS;\n");
console.log("OK → data/crossword/crossword-versions.js");
