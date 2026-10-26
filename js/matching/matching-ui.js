/**
 * js/matching/matching-ui.js
 * Interfaz de "Relaciona los mecanismos": dos columnas compactas
 * (significados con su casilla de destino · mecanismos disponibles),
 * arrastre con Pointer Events (ratón, lápiz y táctil) y alternativa por
 * clic/toque (seleccionar origen y destino). El estado es pequeño, por
 * eso se reconstruye el DOM en cada cambio.
 */

const MatchingUI = (() => {
  const DRAG_THRESHOLD = 6; // px antes de considerar que es un arrastre y no un clic
  let drag = null;          // estado del arrastre en curso
  let suppressClick = false;

  function showStage(name) {
    document.querySelectorAll(".matching-stage").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.stage === name);
    });
  }

  function chipInner(ficha) {
    const icon = document.createElement("span");
    icon.className = "match-chip__icon";
    icon.style.setProperty("--mech-color", ficha.color || "var(--color-primary)");
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${svgIcon(ficha.icono)}</svg>`;
    const label = document.createElement("span");
    label.className = "match-chip__label";
    label.textContent = ficha.nombre;
    return [icon, label];
  }

  const letra = (i) => String.fromCharCode(65 + i);

  /**
   * Pinta todo el tablero.
   * ctx = { seleccion: {tipo:"chip",id}|{tipo:"slot",row}|null, bloqueado: bool }
   */
  function render(els, partida, ctx, cb) {
    els.filas.innerHTML = "";
    partida.filas.forEach((fila, i) => {
      const li = document.createElement("li");
      li.className = "match-row";
      li.dataset.row = String(i);
      const ficha = fila.filledWith ? partida.obtenerFicha(fila.filledWith) : null;
      if (ficha) li.style.setProperty("--mech-color", ficha.color || "var(--color-primary)");
      li.classList.toggle("is-filled", Boolean(ficha));
      li.classList.toggle("is-slot-selected", ctx.seleccion && ctx.seleccion.tipo === "slot" && ctx.seleccion.row === i);
      li.classList.toggle("is-target-hint", Boolean(ctx.seleccion && ctx.seleccion.tipo === "chip"));

      const badge = document.createElement("span");
      badge.className = "match-row__letter";
      badge.textContent = letra(i);
      badge.setAttribute("aria-hidden", "true");

      const meaning = document.createElement("p");
      meaning.className = "match-meaning";
      meaning.id = `mg-meaning-${i}`;
      meaning.textContent = fila.significado;

      const slot = document.createElement("div");
      slot.className = "match-slot";
      slot.dataset.row = String(i);

      const main = document.createElement("button");
      main.type = "button";
      main.className = "match-slot__main";
      main.dataset.sound = "none";
      main.setAttribute("aria-describedby", meaning.id);
      if (ficha) {
        main.classList.add("match-chip", "match-chip--placed");
        main.dataset.chipId = ficha.id;
        main.setAttribute("aria-label", `Significado ${letra(i)}: relacionado con ${ficha.nombre}. Pulsa para moverlo`);
        chipInner(ficha).forEach((n) => main.appendChild(n));
        attachDrag(main, ficha.id, cb, ctx);
      } else {
        main.setAttribute("aria-label", `Significado ${letra(i)}: sin relacionar. Pulsa para elegir este destino`);
        main.innerHTML = '<span class="match-slot__placeholder">Suelta o toca aquí</span>';
      }
      main.addEventListener("click", () => {
        if (suppressClick) return;
        cb.onSlotClick(i);
      });
      slot.appendChild(main);

      if (ficha) {
        const rm = document.createElement("button");
        rm.type = "button";
        rm.className = "match-slot__remove";
        rm.dataset.sound = "none";
        rm.setAttribute("aria-label", `Quitar ${ficha.nombre} del significado ${letra(i)}`);
        rm.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-width="2" stroke-linecap="round"/></svg>';
        rm.addEventListener("click", () => cb.onRemove(i));
        slot.appendChild(rm);
      }

      li.append(badge, meaning, slot);
      els.filas.appendChild(li);
    });

    els.pool.innerHTML = "";
    const libres = partida.disponibles();
    libres.forEach((ficha) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "match-chip" + (ctx.seleccion && ctx.seleccion.tipo === "chip" && ctx.seleccion.id === ficha.id ? " is-selected" : "");
      chip.dataset.chipId = ficha.id;
      chip.dataset.sound = "none";
      chip.setAttribute("aria-pressed", String(chip.classList.contains("is-selected")));
      chipInner(ficha).forEach((n) => chip.appendChild(n));
      chip.addEventListener("click", () => {
        if (suppressClick) return;
        cb.onChipClick(ficha.id);
      });
      attachDrag(chip, ficha.id, cb, ctx);
      els.pool.appendChild(chip);
    });
    if (!libres.length) {
      const vacio = document.createElement("p");
      vacio.className = "match-pool__empty";
      vacio.textContent = "Todos los mecanismos están relacionados.";
      els.pool.appendChild(vacio);
    }
    els.poolCount.textContent = libres.length ? `(${libres.length} sin colocar)` : "";
    // Un mecanismo ya colocado, si está seleccionado, se resalta en su casilla
    if (ctx.seleccion && ctx.seleccion.tipo === "chip") {
      const placed = els.filas.querySelector(`.match-slot__main[data-chip-id="${CSS.escape(ctx.seleccion.id)}"]`);
      if (placed) { placed.classList.add("is-selected"); placed.setAttribute("aria-pressed", "true"); }
    }
  }

  // ------------------------------------------------------------------
  // Arrastre (Pointer Events)
  // ------------------------------------------------------------------
  function attachDrag(el, chipId, cb, ctx) {
    el.addEventListener("pointerdown", (e) => {
      if (ctx.bloqueado || e.button !== 0 || drag) return;
      drag = { el, chipId, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, active: false, ghost: null, over: null };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
      drag.cb = cb;
    });
  }

  function slotBajoPuntero(x, y) {
    const hit = document.elementFromPoint(x, y);
    if (!hit) return { slot: null, pool: false };
    const li = hit.closest(".match-row");
    return { slot: li ? Number(li.dataset.row) : null, pool: Boolean(hit.closest(".match-col--pool")) };
  }

  function onMove(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;
    if (!drag.active) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      drag.active = true;
      const ghost = drag.el.cloneNode(true);
      ghost.classList.add("match-chip--ghost");
      ghost.removeAttribute("id");
      ghost.style.width = `${drag.el.getBoundingClientRect().width}px`;
      document.body.appendChild(ghost);
      drag.ghost = ghost;
      drag.el.classList.add("is-dragging");
      document.body.classList.add("is-match-dragging");   // resalta los destinos válidos
      document.querySelectorAll(".match-row").forEach((r) => r.classList.add("is-drop-available"));
      if (drag.cb.onPick) drag.cb.onPick(drag.chipId);
    }
    e.preventDefault();
    drag.ghost.style.transform = `translate(${e.clientX + 8}px, ${e.clientY + 8}px)`;
    const { slot } = slotBajoPuntero(e.clientX, e.clientY);
    if (slot !== drag.over) {
      document.querySelectorAll(".match-row.is-drop-over").forEach((r) => r.classList.remove("is-drop-over"));
      if (slot !== null) {
        const row = document.querySelector(`.match-row[data-row="${slot}"]`);
        if (row) row.classList.add("is-drop-over");
      }
      drag.over = slot;
    }
  }

  function limpiarArrastre() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onCancel);
    if (drag && drag.ghost) drag.ghost.remove();
    if (drag && drag.el) drag.el.classList.remove("is-dragging");
    document.body.classList.remove("is-match-dragging");
    document.querySelectorAll(".match-row.is-drop-available, .match-row.is-drop-over")
      .forEach((r) => r.classList.remove("is-drop-available", "is-drop-over"));
    drag = null;
  }

  function onUp(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const { active, chipId, cb } = drag;
    if (active) {
      const { slot, pool } = slotBajoPuntero(e.clientX, e.clientY);
      suppressClick = true;                       // el clic que sigue a un arrastre no cuenta
      setTimeout(() => { suppressClick = false; }, 0);
      limpiarArrastre();
      if (slot !== null) cb.onDrop(slot, chipId);
      else if (pool) cb.onReturn(chipId);
    } else {
      limpiarArrastre();                          // no se movió: lo gestiona el clic normal
    }
  }

  function onCancel(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    limpiarArrastre();
  }

  /** Corta cualquier arrastre en curso y retira sus oyentes (al salir de la partida). */
  function cancelarArrastre() { limpiarArrastre(); suppressClick = false; }

  // ------------------------------------------------------------------
  // Progreso y revisión final
  // ------------------------------------------------------------------
  function actualizarProgreso(el, colocadas, total) {
    el.textContent = `${colocadas} / ${total} relacionadas`;
  }

  /** Lista de revisión. `mostrarCorrectas` solo es true para el maestro cuando lo pide. */
  function renderRevision(listEl, partida, mostrarCorrectas) {
    listEl.innerHTML = "";
    partida.filas.forEach((fila, i) => {
      const ficha = fila.filledWith ? partida.obtenerFicha(fila.filledWith) : null;
      const ok = fila.filledWith === fila.mechanismId;
      const li = document.createElement("li");
      li.className = "match-review__item " + (ok ? "is-correct" : "is-incorrect");
      const mark = document.createElement("span");
      mark.className = "match-review__mark";
      mark.textContent = ok ? "✓" : "✕";
      mark.setAttribute("aria-label", ok ? "Correcta" : "Incorrecta");
      const body = document.createElement("div");
      const q = document.createElement("p");
      q.className = "match-review__meaning";
      q.textContent = `${letra(i)}. ${fila.significado}`;
      const a = document.createElement("p");
      a.className = "match-review__answer";
      a.textContent = ficha ? `Tu respuesta: ${ficha.nombre}` : "Sin responder";
      body.append(q, a);
      if (!ok && mostrarCorrectas) {
        const c = document.createElement("p");
        c.className = "match-review__right";
        c.textContent = `Correcta: ${partida.obtenerFicha(fila.mechanismId).nombre}`;
        body.appendChild(c);
      }
      li.append(mark, body);
      listEl.appendChild(li);
    });
  }

  return { showStage, render, actualizarProgreso, renderRevision, cancelarArrastre, letra };
})();
