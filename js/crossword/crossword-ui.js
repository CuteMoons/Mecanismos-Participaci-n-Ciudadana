/**
 * js/crossword/crossword-ui.js
 * Renderiza y actualiza el DOM del crucigrama. No decide reglas del
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
  // Tarjetas de mecanismos
  // ---------------------------------------------------------------
  function renderMechCards(containerEl, onSelect) {
    containerEl.innerHTML = "";
    MECANISMOS.forEach((mecanismo) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "mech-select-card";
      card.dataset.mechId = mecanismo.id;
      card.style.setProperty("--mech-color", mecanismo.color);
      card.setAttribute("aria-pressed", "false");
      card.innerHTML = `
        <span class="mech-select-card__icon">
          <svg viewBox="0 0 24 24" fill="none">${svgIcon(mecanismo.icono)}</svg>
        </span>
        <span class="mech-select-card__name">${mecanismo.nombre}</span>
      `;
      card.addEventListener("click", () => onSelect(mecanismo.id));
      containerEl.appendChild(card);
    });
  }

  function setActiveMechCard(containerEl, mechId) {
    containerEl.classList.toggle("has-active", Boolean(mechId));
    containerEl.querySelectorAll(".mech-select-card").forEach((card) => {
      const isActive = card.dataset.mechId === mechId;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderMechContext(containerEl, mecanismo) {
    if (!mecanismo) {
      containerEl.hidden = true;
      containerEl.innerHTML = "";
      return;
    }
    containerEl.hidden = false;
    containerEl.style.setProperty("--mech-color", mecanismo.color);
    containerEl.innerHTML = `
      <span class="mech-context__icon">
        <svg viewBox="0 0 24 24" fill="none">${svgIcon(mecanismo.icono)}</svg>
      </span>
      <span>
        <span class="mech-context__title">${mecanismo.nombre}</span>
        <p class="mech-context__text">${mecanismo.descripcionCorta}</p>
      </span>
    `;
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
        input.maxLength = 1;
        input.autocomplete = "off";
        input.spellcheck = false;
        input.setAttribute("aria-label", `Casilla fila ${r + 1}, columna ${c + 1}`);
        input.value = partida.answers[r][c] || "";
        cellEl.appendChild(input);

        cellEl.addEventListener("click", () => callbacks.onCellClick(r, c));
        input.addEventListener("keydown", (e) => callbacks.onKeyDown(e, r, c));
        input.addEventListener("input", (e) => {
          const val = (e.target.value || "").replace(/[^a-zA-ZÁÉÍÓÚÑáéíóúñ]/g, "").slice(-1);
          e.target.value = val.toUpperCase();
          callbacks.onLetterInput(r, c, val);
        });

        containerEl.appendChild(cellEl);
      }
    }
  }

  /** Refresca solo los estados visuales (no reconstruye el tablero). */
  function updateBoardStates(containerEl, partida, seleccion) {
    const activeWordCells = new Set();
    if (seleccion && seleccion.placementIndex != null) {
      const p = partida.placements[seleccion.placementIndex];
      for (let i = 0; i < p.length; i++) {
        const r = p.dir === "down" ? p.row + i : p.row;
        const c = p.dir === "across" ? p.col + i : p.col;
        activeWordCells.add(`${r},${c}`);
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

      const input = cellEl.querySelector(".cw-cell__input");
      if (input && document.activeElement !== input) input.value = partida.answers[r][c] || "";
    });
  }

  // ---------------------------------------------------------------
  // Pistas
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
      btn.innerHTML = `<span class="clue-item__num">${p.number}.</span><span>${p.entry.clue}</span>`;
      btn.addEventListener("click", () => callbacks.onClueClick(idx));
      li.appendChild(btn);
      (p.dir === "across" ? acrossEl : downEl).appendChild(li);
    });
  }

  function updateClueStates(acrossEl, downEl, partida, seleccion) {
    [acrossEl, downEl].forEach((listEl) => {
      listEl.querySelectorAll(".clue-item").forEach((btn) => {
        const idx = Number(btn.dataset.placementIndex);
        btn.classList.toggle("is-active", Boolean(seleccion && seleccion.placementIndex === idx));
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
    renderMechCards, setActiveMechCard, renderMechContext,
    renderBoard, updateBoardStates,
    renderClues, updateClueStates,
    updateScore, updateTimer
  };
})();
