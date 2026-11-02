/**
 * js/wordsearch/wordsearch-ui.js
 * Interfaz de la sopa de letras: pinta el tablero y gestiona la selección.
 *  - Arrastre (ratón, lápiz o dedo) de la primera a la última letra, en las
 *    8 direcciones: la línea se ajusta a la dirección más cercana.
 *  - Alternativa: tocar/clicar la letra inicial y después la final.
 *  - Teclado: flechas para moverse, Enter/Espacio para marcar inicio y fin,
 *    Escape para cancelar.
 * La validación de palabras NO está aquí: se avisa con callbacks.
 */
const WordSearchUI = (() => {
  function showStage(name) {
    document.querySelectorAll(".ws-stage").forEach((el) => el.classList.toggle("is-active", el.dataset.stage === name));
  }

  const cellEl = (board, r, c) => board.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`);

  function renderTablero(board, tablero) {
    const n = tablero.n;
    board.innerHTML = "";
    board.style.setProperty("--ws-n", String(n));
    board.dataset.n = String(n);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ws-cell";
        b.dataset.r = String(r);
        b.dataset.c = String(c);
        b.dataset.sound = "none";
        b.tabIndex = r === 0 && c === 0 ? 0 : -1;
        b.textContent = tablero.grid[r][c];
        b.setAttribute("aria-label", `${tablero.grid[r][c]}, fila ${r + 1}, columna ${c + 1}`);
        board.appendChild(b);
      }
    }
  }

  function limpiarClase(board, clase) {
    board.querySelectorAll("." + clase).forEach((e) => e.classList.remove(clase));
  }
  function ponerClase(board, cells, clase) {
    cells.forEach((k) => { const e = cellEl(board, k.r, k.c); if (e) e.classList.add(clase); });
  }
  function quitarClase(board, cells, clase) {
    cells.forEach((k) => { const e = cellEl(board, k.r, k.c); if (e) e.classList.remove(clase); });
  }

  /** Marca de forma permanente una palabra encontrada (color distinto de rojo, rotativo). */
  function marcarEncontrada(board, cells, colorIdx) {
    cells.forEach((k) => {
      const e = cellEl(board, k.r, k.c);
      if (!e) return;
      e.classList.add("is-found");
      e.style.setProperty("--found", `var(--ws-c${colorIdx % 8})`);
    });
  }

  function renderLista(listEl, words, partida) {
    listEl.innerHTML = "";
    words.forEach((w) => {
      const li = document.createElement("li");
      const hecha = partida.yaEncontrada(w);
      li.className = "ws-word" + (hecha ? " is-found" : "");
      if (hecha) li.style.setProperty("--found", `var(--ws-c${partida.encontradas.get(w).color % 8})`);
      li.innerHTML = `<span class="ws-word__mark" aria-hidden="true">${hecha ? "✓" : ""}</span><span class="ws-word__text"></span>`;
      li.querySelector(".ws-word__text").textContent = w;
      if (hecha) li.setAttribute("aria-label", `${w}, encontrada`);
      listEl.appendChild(li);
    });
  }

  /**
   * Enlaza la selección. `sess` registra y libera los oyentes.
   * cb = { bloqueado(): bool, onSeleccion(cells), onInicio(cell), onCancelar() }
   */
  function enlazar(board, n, cb, sess) {
    let down = null, arrastrando = false, ultimas = [], pendiente = null, pid = null, cursor = { r: 0, c: 0 };

    const celdaEn = (e) => {
      const rect = board.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width - 0.01);
      const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height - 0.01);
      return { r: Math.floor(y / (rect.height / n)), c: Math.floor(x / (rect.width / n)) };
    };
    const limpiarPrevia = () => limpiarClase(board, "is-selecting");
    const limpiarInicio = () => { limpiarClase(board, "is-start"); pendiente = null; };

    function setCursor(r, c, foco) {
      const prev = cellEl(board, cursor.r, cursor.c);
      if (prev) prev.tabIndex = -1;
      cursor = { r, c };
      const e = cellEl(board, r, c);
      if (e) { e.tabIndex = 0; if (foco) e.focus({ preventScroll: true }); }
    }

    function clic(cell) {
      if (pendiente) {
        if (pendiente.r === cell.r && pendiente.c === cell.c) { limpiarInicio(); cb.onCancelar(); return; }
        const linea = WordSearch.lineaEntre(n, pendiente.r, pendiente.c, cell.r, cell.c);
        if (linea) { limpiarInicio(); cb.onSeleccion(linea); return; }
        // no está alineada: se toma como nuevo inicio
        limpiarInicio();
      }
      pendiente = cell;
      ponerClase(board, [cell], "is-start");
      cb.onInicio(cell);
    }

    sess.listen(board, "pointerdown", (e) => {
      if (cb.bloqueado() || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();
      try { board.setPointerCapture(e.pointerId); } catch (_) { /* sin captura: se sigue con eventos normales */ }
      pid = e.pointerId;
      down = celdaEn(e);
      arrastrando = false;
      ultimas = [];
      setCursor(down.r, down.c, false);
    });
    sess.listen(board, "pointermove", (e) => {
      if (!down || e.pointerId !== pid) return;
      const c = celdaEn(e);
      if (!arrastrando && (c.r !== down.r || c.c !== down.c)) {
        arrastrando = true;
        limpiarInicio();
        cb.onInicio(down);
      }
      if (arrastrando) {
        const linea = WordSearch.ajustarALinea(n, down.r, down.c, c.r, c.c);
        limpiarPrevia();
        ponerClase(board, linea, "is-selecting");
        ultimas = linea;
      }
    });
    const terminar = (e, cancelado) => {
      if (!down || e.pointerId !== pid) return;
      const inicio = down, fueArrastre = arrastrando, linea = ultimas;
      down = null; arrastrando = false; ultimas = []; pid = null;
      limpiarPrevia();
      if (cancelado) return;
      if (fueArrastre) { if (linea.length >= 2) cb.onSeleccion(linea); else cb.onCancelar(); }
      else clic(inicio);
    };
    sess.listen(board, "pointerup", (e) => terminar(e, false));
    sess.listen(board, "pointercancel", (e) => terminar(e, true));
    sess.listen(board, "contextmenu", (e) => e.preventDefault());

    sess.listen(board, "keydown", (e) => {
      if (cb.bloqueado()) return;
      const mov = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
      if (mov) {
        e.preventDefault();
        setCursor(Math.min(n - 1, Math.max(0, cursor.r + mov[0])), Math.min(n - 1, Math.max(0, cursor.c + mov[1])), true);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        clic({ ...cursor });
      } else if (e.key === "Escape" && pendiente) {
        limpiarInicio(); cb.onCancelar();
      }
    });
    sess.listen(board, "focusin", (e) => {
      const t = e.target.closest && e.target.closest(".ws-cell");
      if (t) setCursor(Number(t.dataset.r), Number(t.dataset.c), false);
    });

    sess.onCleanup(() => { down = null; arrastrando = false; pendiente = null; });
    return { cancelar: () => { down = null; arrastrando = false; limpiarPrevia(); limpiarInicio(); } };
  }

  return { showStage, renderTablero, marcarEncontrada, renderLista, enlazar, ponerClase, quitarClase, limpiarClase, cellEl };
})();
