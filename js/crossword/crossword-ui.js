/**
 * js/crossword/crossword-ui.js
 * Renderiza y actualiza el DOM del crucigrama. Las casillas solo muestran
 * lo que escribió el jugador y los números de referencia; las pistas
 * nunca incluyen el nombre de la respuesta. No decide reglas del
 * juego (eso es crossword-game.js) ni arma el tablero (eso es
 * crossword-generator.js); solo pinta el estado actual.
 */

const CrosswordUI = (() => {
  function showStage(name) {
    document.querySelectorAll(".crossword-stage").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.stage === name);
    });
  }

  // ---------------------------------------------------------------
  // Tablero
  // ---------------------------------------------------------------
  function renderBoard(containerEl, partida, callbacks) {
    containerEl.innerHTML = "";
    containerEl.style.setProperty("--cw-cols", partida.cols);
    containerEl.style.setProperty("--cw-rows", partida.rows);
    containerEl.style.gridTemplateColumns = `repeat(${partida.cols}, 1fr)`;
    containerEl.style.gridTemplateRows = `repeat(${partida.rows}, 1fr)`;

    for (let r = 0; r < partida.rows; r++) {
      for (let c = 0; c < partida.cols; c++) {
        const cellData = partida.grid[r][c];
        const cellEl = document.createElement("div");

        if (!cellData) {
          cellEl.className = "cw-cell cw-cell--block";
          cellEl.setAttribute("aria-hidden", "true");
          containerEl.appendChild(cellEl);
          continue;
        }

        cellEl.className = "cw-cell";
        cellEl.dataset.row = String(r);
        cellEl.dataset.col = String(c);

        const number = partida.numbers[r][c];
        if (number) {
          const num = document.createElement("span");
          num.className = "cw-cell__number";
          num.textContent = String(number);
          num.setAttribute("aria-hidden", "true");
          cellEl.appendChild(num);
        }

        const input = document.createElement("input");
        input.className = "cw-cell__input";
        input.type = "text";
        input.inputMode = "text";
        input.autocomplete = "off";
        input.autocapitalize = "characters";
        input.spellcheck = false;
        input.tabIndex = -1; // el tabulador entra al tablero por UNA sola casilla (tabindex móvil)
        input.setAttribute("aria-label", etiquetaCasilla(partida, r, c));
        input.value = partida.answers[r][c] || "";
        cellEl.appendChild(input);

        cellEl.addEventListener("click", () => callbacks.onCellClick(r, c));
        input.addEventListener("focus", () => { callbacks.onCellFocus(r, c); input.select(); });
        input.addEventListener("keydown", (e) => callbacks.onKeyDown(e, r, c));
        input.addEventListener("input", (e) => {
          const val = (e.target.value || "").replace(/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ]/g, "").slice(-1);
          callbacks.onLetterInput(r, c, val, e.target);
        });

        containerEl.appendChild(cellEl);
      }
    }
  }

  /** Etiqueta para lectores de pantalla: ubicación y palabras que pasan por la casilla. */
  function etiquetaCasilla(partida, r, c) {
    const partes = partida.grid[r][c].words
      .map((i) => partida.placements[i])
      .sort((a, b) => (a.dir === "across" ? -1 : 1) - (b.dir === "across" ? -1 : 1))
      .map((p) => `${p.number} ${p.dir === "across" ? "horizontal" : "vertical"}`);
    return `Fila ${r + 1}, columna ${c + 1}. Palabra ${partes.join(" y ")}`;
  }

  /** Refresca solo los estados visuales (no reconstruye el tablero). */
  function updateBoardStates(containerEl, partida, seleccion) {
    const activeWordCells = new Set();
    const activa = seleccion ? CrosswordNav.palabraEn(partida, seleccion.row, seleccion.col, seleccion.dir) : -1;
    if (activa !== -1) {
      CrosswordNav.casillasDePalabra(partida, activa).forEach((k) => activeWordCells.add(`${k.row},${k.col}`));
    }

    // Sin selección, el tabulador entra por la primera casilla del tablero.
    let primeraFila = -1, primeraCol = -1;
    outer: for (let r = 0; r < partida.rows; r++) {
      for (let c = 0; c < partida.cols; c++) {
        if (partida.grid[r][c]) { primeraFila = r; primeraCol = c; break outer; }
      }
    }

    containerEl.querySelectorAll(".cw-cell:not(.cw-cell--block)").forEach((cellEl) => {
      const r = Number(cellEl.dataset.row);
      const c = Number(cellEl.dataset.col);
      const key = `${r},${c}`;
      const status = partida.cellStatus[r][c];
      const cellInfo = partida.grid[r][c];
      const resuelta = cellInfo.words.some((idx) => partida.wordState[idx].solved);

      cellEl.classList.toggle("is-active-word", activeWordCells.has(key));
      cellEl.classList.toggle("is-selected", Boolean(seleccion && seleccion.row === r && seleccion.col === c));
      cellEl.classList.toggle("is-correct", status === "correct");
      cellEl.classList.toggle("is-incorrect", status === "incorrect");
      cellEl.classList.toggle("is-solved-word", resuelta);
      cellEl.classList.toggle("cw-cell--locked", resuelta);

      const input = cellEl.querySelector(".cw-cell__input");
      if (input) {
        const esCursor = Boolean(seleccion && seleccion.row === r && seleccion.col === c);
        input.tabIndex = (seleccion ? esCursor : (r === primeraFila && c === primeraCol)) ? 0 : -1;
        // La celda bloqueada es de solo lectura de verdad (no solo
        // visualmente): el navegador impide escribir, borrar o pegar
        // texto sobre ella. La lógica del juego (crossword-game.js)
        // ya rechaza cualquier cambio aquí; esto es una protección
        // adicional a nivel de interfaz.
        input.readOnly = resuelta;
        input.setAttribute("aria-readonly", String(resuelta));
        // El estado del juego manda: la casilla siempre muestra lo que hay en `answers`.
        input.value = partida.answers[r][c] || "";
      }
    });
  }

  // ---------------------------------------------------------------
  // Pistas — presentadas como pequeños "carteles" (tarjetas), no como
  // texto plano: cada una lleva el ícono del mecanismo relacionado
  // (o un número genérico si es un término sin mecanismo) y un
  // acento de color, igual que el resto de tarjetas del proyecto.
  // ---------------------------------------------------------------
  function renderClues(acrossEl, downEl, partida, callbacks) {
    acrossEl.innerHTML = "";
    downEl.innerHTML = "";

    const ordenadas = [...partida.placements].sort((a, b) => a.number - b.number);
    ordenadas.forEach((p) => {
      const idx = partida.placements.indexOf(p);
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clue-item";
      btn.dataset.placementIndex = String(idx);
      btn.dataset.sound = "select";

      const badge = document.createElement("span");
      badge.className = "clue-item__badge";
      const num = document.createElement("span");
      num.className = "clue-item__num";
      num.textContent = String(p.number);
      badge.appendChild(num);

      const body = document.createElement("span");
      body.className = "clue-item__body";
      const meta = document.createElement("span");
      meta.className = "clue-item__meta";
      meta.textContent = `${p.dir === "across" ? "Horizontal" : "Vertical"} · ${p.length} letras`;
      const text = document.createElement("span");
      text.className = "clue-item__text";
      text.textContent = p.entry.clue;
      body.append(meta, text);

      btn.append(badge, body);
      btn.addEventListener("click", () => callbacks.onClueClick(idx));
      li.appendChild(btn);
      (p.dir === "across" ? acrossEl : downEl).appendChild(li);
    });
  }

  /**
   * Panel de la pista activa: número, dirección, longitud y texto de la
   * pista. NUNCA muestra la respuesta. El botón permite alternar la
   * dirección cuando la casilla seleccionada es compartida.
   */
  function renderActiveClue(containerEl, partida, seleccion, puedeAlternar) {
    const dirEl = containerEl.querySelector(".active-clue__dir");
    const textEl = containerEl.querySelector(".active-clue__text");
    const btn = containerEl.querySelector(".active-clue__switch");
    if (!seleccion) {
      containerEl.classList.remove("has-clue");
      dirEl.textContent = "Elige una casilla";
      textEl.textContent = "Selecciona una casilla o una pista para ver aquí su descripción.";
      btn.hidden = true;
      return;
    }
    const idx = CrosswordNav.palabraEn(partida, seleccion.row, seleccion.col, seleccion.dir);
    const p = partida.placements[idx];
    containerEl.classList.add("has-clue");
    containerEl.dataset.dir = p.dir;
    dirEl.textContent = `${p.number} ${p.dir === "across" ? "→ Horizontal" : "↓ Vertical"} · ${p.length} letras`;
    textEl.textContent = p.entry.clue;
    btn.hidden = !puedeAlternar;
    if (puedeAlternar) {
      const otra = p.dir === "across" ? "vertical" : "horizontal";
      btn.textContent = p.dir === "across" ? "↓ Cambiar a vertical" : "→ Cambiar a horizontal";
      btn.setAttribute("aria-label", `Cambiar a la palabra ${otra} de esta casilla`);
    }
  }

  /** Lleva la pista activa a la vista DENTRO de su panel (sin mover la página). */
  function mostrarPistaActiva(panelEl) {
    const activa = panelEl.querySelector(".clue-item.is-active");
    if (!activa || panelEl.scrollHeight <= panelEl.clientHeight) return;
    const top = activa.offsetTop - panelEl.offsetTop;
    if (top < panelEl.scrollTop) panelEl.scrollTop = top - 8;
    else if (top + activa.offsetHeight > panelEl.scrollTop + panelEl.clientHeight) {
      panelEl.scrollTop = top + activa.offsetHeight - panelEl.clientHeight + 8;
    }
  }

  function updateClueStates(acrossEl, downEl, partida, seleccion) {
    const activa = seleccion ? CrosswordNav.palabraEn(partida, seleccion.row, seleccion.col, seleccion.dir) : -1;
    [acrossEl, downEl].forEach((listEl) => {
      listEl.querySelectorAll(".clue-item").forEach((btn) => {
        const idx = Number(btn.dataset.placementIndex);
        btn.classList.toggle("is-active", idx === activa);
        btn.setAttribute("aria-current", idx === activa ? "true" : "false");
        btn.classList.toggle("is-solved", partida.wordState[idx].solved);
      });
    });
  }

  // ---------------------------------------------------------------
  // Estadísticas
  // ---------------------------------------------------------------
  function updateScore(el, score) {
    el.textContent = `⭐ ${score} puntos`;
    el.classList.remove("crossword-stat--bump");
    // Forzar reflow para poder re-disparar la animación en cada cambio.
    void el.offsetWidth;
    el.classList.add("crossword-stat--bump");
  }

  function updateTimer(el, texto, tone) {
    el.textContent = `⏱️ ${texto}`;
    el.classList.toggle("is-warning", tone === "warning");
    el.classList.toggle("is-critical", tone === "critical");
  }

  return {
    showStage,
    renderBoard, updateBoardStates,
    renderClues, updateClueStates, renderActiveClue, mostrarPistaActiva,
    updateScore, updateTimer
  };
})();
