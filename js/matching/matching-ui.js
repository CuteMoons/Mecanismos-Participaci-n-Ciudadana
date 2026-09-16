/**
 * js/matching/matching-ui.js
 * Renderiza el juego "Relaciona los mecanismos": filas (significado +
 * casilla donde soltar), fichas arrastrables y sus estados. Como el
 * estado es pequeño (8 filas, 8 fichas), se reconstruye por completo
 * en cada cambio — es más simple y menos propenso a errores que
 * parchear el DOM incrementalmente.
 */

const MatchingUI = (() => {
  function showStage(name) {
    document.querySelectorAll(".matching-stage").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.stage === name);
    });
  }

  function crearFichaHTML(ficha) {
    return `
      <span class="match-chip__icon" style="--mech-color:${ficha.color || "var(--color-primary)"}">
        <svg viewBox="0 0 24 24" fill="none">${svgIcon(ficha.icono)}</svg>
      </span>
      <span class="match-chip__label">${ficha.nombre}</span>
    `;
  }

  /** Renderiza las filas (significado + casilla de destino). */
  function renderFilas(containerEl, partida, callbacks) {
    containerEl.innerHTML = "";
    partida.filas.forEach((fila, rowIndex) => {
      const row = document.createElement("div");
      row.className = "match-row reveal";

      const drop = document.createElement("div");
      drop.className = "match-drop";
      drop.dataset.rowIndex = String(rowIndex);
      drop.setAttribute("role", "button");
      drop.setAttribute("tabindex", "0");

      if (fila.filledWith) {
        const ficha = partida.opciones.find((o) => o.id === fila.filledWith) ||
          { id: fila.filledWith, nombre: fila.filledWith, icono: "shield", color: null };
        drop.innerHTML = crearFichaHTML(ficha);
      } else {
        drop.innerHTML = `<span class="match-drop__placeholder">Arrastra aquí un mecanismo</span>`;
      }

      drop.classList.toggle("is-correct", fila.locked);
      drop.classList.toggle("is-incorrect", fila.incorrectFlash);

      drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("is-dragover"); });
      drop.addEventListener("dragleave", () => drop.classList.remove("is-dragover"));
      drop.addEventListener("drop", (e) => {
        e.preventDefault();
        drop.classList.remove("is-dragover");
        const chipId = e.dataTransfer ? e.dataTransfer.getData("text/plain") : null;
        if (chipId) callbacks.onDrop(rowIndex, chipId);
      });
      drop.addEventListener("click", () => callbacks.onRowClick(rowIndex));
      drop.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); callbacks.onRowClick(rowIndex); }
      });

      const meaning = document.createElement("div");
      meaning.className = "match-meaning";
      meaning.textContent = fila.significado;

      row.appendChild(drop);
      row.appendChild(meaning);
      containerEl.appendChild(row);
    });

    if (window.RCAnimations) RCAnimations.revealNow(containerEl.querySelectorAll(".reveal"));
  }

  /** Renderiza la bolsa de fichas disponibles (arrastrables). */
  function renderPool(containerEl, partida, callbacks, selectedChipId) {
    containerEl.innerHTML = "";
    partida.opciones.forEach((ficha) => {
      if (ficha.used) return; // ya está colocada correctamente en alguna fila
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "match-chip" + (selectedChipId === ficha.id ? " is-selected" : "");
      chip.draggable = true;
      chip.dataset.chipId = ficha.id;
      chip.setAttribute("aria-pressed", String(selectedChipId === ficha.id));
      chip.innerHTML = crearFichaHTML(ficha);

      chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", ficha.id);
        e.dataTransfer.effectAllowed = "move";
      });
      chip.addEventListener("click", () => callbacks.onChipClick(ficha.id));

      containerEl.appendChild(chip);
    });
  }

  function actualizarProgreso(el, correctas, total) {
    el.textContent = `${correctas} / ${total} relacionadas`;
  }

  return { showStage, renderFilas, renderPool, actualizarProgreso };
})();
