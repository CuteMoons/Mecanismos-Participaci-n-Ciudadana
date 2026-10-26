/**
 * js/crossword/crossword.js
 * Controlador principal del Crucigrama. Conecta la configuración, el
 * estado de la partida (crossword-game.js), la navegación del tablero
 * (crossword-nav.js) y la interfaz (crossword-ui.js).
 *
 * Flujo: introducción → modo (alumno/maestro) → configuración → juego → resultado.
 *
 * Todo lo que se crea durante una partida (reloj, oyentes, temporizadores)
 * se registra en `sess` (RCGame.session) para poder liberarlo por completo
 * al terminar o al confirmar la salida.
 */

(function initCrossword() {
  if (!document.getElementById("crossword-shell")) return; // no estamos en crucigrama.html

  // ---- Configuración de dificultad: cuántas palabras y de qué pools ----
  const DIFFICULTY_SETTINGS = {
    facil: { pools: ["facil"], count: 7 },
    media: { pools: ["facil", "media"], count: 9 },
    dificil: { pools: ["media", "dificil"], count: 11 }
  };

  const TIEMPO_OPCIONES = [
    { label: "Sin límite", value: 0 },
    { label: "5 min", value: 300 },
    { label: "10 min", value: 600 },
    { label: "15 min", value: 900 }
  ];
  const TIEMPO_ALUMNO = 600; // el alumno recibe un tiempo fijo (como en el quiz)
  const LETRA = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ]$/;

  let rol = null;                 // null | "alumno" | "maestro"
  let config = { modalidad: "individual", tiempoSegundos: TIEMPO_ALUMNO, dificultad: "media" };
  let partida = null;
  let sel = null;                 // { row, col, dir }
  let reloj = null;
  let pausado = false;
  let ignorarFocoHasta = 0;       // el clic ya selecciona; el foco "de ratón" no debe seleccionar dos veces

  const sess = RCGame.session({ name: "crucigrama", onDiscard: descartarPartida });

  // ---- Elementos ----
  const $ = (id) => document.getElementById(id);
  const els = {
    board: $("cw-board"),
    cluesAcross: $("cw-clues-across"),
    cluesDown: $("cw-clues-down"),
    cluesPanel: document.querySelector(".crossword-clues"),
    activeClue: $("cw-active-clue"),
    btnDireccion: $("btn-cw-direction"),
    timer: $("cw-timer"),
    score: $("cw-score"),
    modeBadge: $("cw-mode-badge"),
    roleBadge: $("cw-role-badge"),
    feedback: $("cw-feedback"),
    helpMenu: $("cw-help-menu"),
    btnAyuda: $("btn-ayuda"),
    btnComprobar: $("btn-comprobar"),
    teacherPanel: $("cw-teacher-panel"),
    pauseVeil: $("cw-pause-veil")
  };

  // =================================================================
  // CONFIGURACIÓN (pantalla previa a jugar)
  // =================================================================
  function pillGroup(container, opciones, valorActual, onSelect) {
    container.innerHTML = "";
    opciones.forEach((op) => {
      const label = typeof op === "object" ? op.label : op;
      const value = typeof op === "object" ? op.value : op;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pill" + (value === valorActual ? " is-selected" : "");
      btn.textContent = label;
      btn.addEventListener("click", () => {
        container.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        onSelect(value);
      });
      container.appendChild(btn);
    });
  }

  function renderConfigStage() {
    const esMaestro = rol === "maestro";
    $("cw-config-badge").textContent = esMaestro ? "🧑‍🏫 Modo maestro" : "🎓 Modo alumno";
    $("cw-config-title").textContent = esMaestro ? "Configura la actividad" : "Pon a prueba tus conocimientos";
    // El alumno no accede a modalidad ni tiempo (los fija la actividad).
    $("cw-group-modalidad").hidden = !esMaestro;
    $("cw-group-tiempo").hidden = !esMaestro;
    $("cw-step-dificultad").textContent = esMaestro ? "3" : "1";
    $("cw-config-note").textContent = esMaestro
      ? "El tablero se genera al azar con palabras del banco según la dificultad."
      : "Tendrás 10 minutos. Las pistas son descripciones: tendrás que razonar para deducir cada respuesta.";

    if (!esMaestro) {
      config.modalidad = "individual";
      config.tiempoSegundos = TIEMPO_ALUMNO;
    }

    const modalidadEl = $("cw-config-modalidad");
    modalidadEl.innerHTML = "";
    [
      { value: "individual", icon: "👤", label: "Individual" },
      { value: "grupos", icon: "👥", label: "Grupos" }
    ].forEach((op) => {
      const div = document.createElement("button");
      div.type = "button";
      div.className = "option-card" + (config.modalidad === op.value ? " is-selected" : "");
      div.innerHTML = `<div class="option-card__icon">${op.icon}</div><div class="option-card__label">${op.label}</div>`;
      div.addEventListener("click", () => {
        modalidadEl.querySelectorAll(".option-card").forEach((c) => c.classList.remove("is-selected"));
        div.classList.add("is-selected");
        config.modalidad = op.value;
      });
      modalidadEl.appendChild(div);
    });

    pillGroup($("cw-config-tiempo"), TIEMPO_OPCIONES, config.tiempoSegundos, (v) => { config.tiempoSegundos = v; });

    const dificultades = [
      { label: "Fácil", value: "facil" },
      { label: "Medio", value: "media" },
      { label: "Difícil", value: "dificil" }
    ];
    pillGroup($("cw-config-dificultad"), dificultades, config.dificultad, (v) => { config.dificultad = v; });
  }

  // =================================================================
  // GENERACIÓN DE PARTIDA
  // =================================================================
  function elegirPalabras(dificultad) {
    const cfg = DIFFICULTY_SETTINGS[dificultad] || DIFFICULTY_SETTINGS.media;
    const pool = CROSSWORD_WORDS.filter((w) => cfg.pools.includes(w.difficulty));
    const barajadas = QuizEngine.shuffle(pool);
    return barajadas.slice(0, Math.min(cfg.count + 4, barajadas.length));
  }

  function generarResultado(dificultad) {
    const cfg = DIFFICULTY_SETTINGS[dificultad] || DIFFICULTY_SETTINGS.media;
    let resultado;
    let intentos = 0;
    do {
      resultado = CrosswordGenerator.generar(elegirPalabras(dificultad));
      intentos++;
    } while (resultado.placements.length < Math.min(5, cfg.count) && intentos < 6);
    return resultado;
  }

  // =================================================================
  // SELECCIÓN Y NAVEGACIÓN (la lógica vive en crossword-nav.js)
  // =================================================================
  const mismaSeleccion = (a, b) => Boolean(a && b && a.row === b.row && a.col === b.col && a.dir === b.dir);

  function focusCell(r, c) {
    const input = els.board.querySelector(`.cw-cell[data-row="${r}"][data-col="${c}"] .cw-cell__input`);
    if (input) input.focus({ preventScroll: true });
  }

  function aplicarSeleccion(nueva, { enfocar = true } = {}) {
    if (!nueva) return;
    sel = nueva;
    refrescarUI();
    if (enfocar) focusCell(sel.row, sel.col);
  }

  function palabraActiva() {
    return sel ? CrosswordNav.palabraEn(partida, sel.row, sel.col, sel.dir) : -1;
  }

  const boardCallbacks = {
    onCellClick: (r, c) => {
      if (pausado) return;
      const antes = sel;
      const nueva = CrosswordNav.seleccionar(partida, sel, r, c);
      if (!nueva) return;
      aplicarSeleccion(nueva);
      if (!mismaSeleccion(antes, nueva)) RCSound.play("select");
    },

    // Foco que llega por teclado (Tab): se sincroniza la selección sin alternar dirección.
    onCellFocus: (r, c) => {
      if (pausado || performance.now() < ignorarFocoHasta) return;
      if (sel && sel.row === r && sel.col === c) return;
      const nueva = CrosswordNav.seleccionar(partida, sel, r, c);
      if (nueva) aplicarSeleccion(nueva, { enfocar: false });
    },

    onKeyDown: (e) => {
      if (pausado) { e.preventDefault(); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return; // atajos del navegador
      if (!sel) return;
      const key = e.key;

      if (key.startsWith("Arrow")) {
        e.preventDefault();
        aplicarSeleccion(CrosswordNav.mover(partida, sel, key));      // solo mueve el cursor
      } else if (key === "Backspace") {
        e.preventDefault();
        const acc = CrosswordNav.alRetroceso(partida, sel);
        if (acc.borrar) partida.borrarLetra(acc.borrar.row, acc.borrar.col);
        aplicarSeleccion({ row: acc.cursor.row, col: acc.cursor.col, dir: sel.dir });
      } else if (key === "Delete") {
        e.preventDefault();
        partida.borrarLetra(sel.row, sel.col);
        refrescarUI();
      } else if (key === " " || key === "Spacebar" || key === "Enter") {
        e.preventDefault();
        alternarDireccion();
      } else if (LETRA.test(key)) {
        e.preventDefault();
        escribir(key);
      } else if (key.length === 1) {
        e.preventDefault();               // cifras y símbolos no entran en el tablero
      }
      // Tab, Escape, etc.: comportamiento normal del navegador
    },

    // Respaldo para teclados virtuales (móvil), que no siempre envían keydown con la letra.
    onLetterInput: (r, c, val, inputEl) => {
      if (pausado || !partida) return;
      if (!sel || sel.row !== r || sel.col !== c) {
        const nueva = CrosswordNav.seleccionar(partida, sel, r, c);
        if (nueva) { sel = nueva; }
      }
      if (val) {
        escribir(val);
      } else {
        partida.borrarLetra(r, c);          // el teclado vació la casilla
        refrescarUI();
      }
      inputEl.value = partida.answers[r][c] || "";
    }
  };

  function alternarDireccion() {
    const nueva = CrosswordNav.alternarDireccion(partida, sel);
    if (!mismaSeleccion(nueva, sel)) {
      aplicarSeleccion(nueva);
      RCSound.play("select");
    }
  }

  /** Escribe en la casilla seleccionada y avanza SOLO dentro de la palabra activa. */
  function escribir(letra) {
    const limpia = letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const info = CrosswordNav.alEscribir(partida, sel);
    if (!info.escribe) {
      // Casilla bloqueada (ya pertenece a una palabra resuelta): se pasa a la siguiente editable.
      const sig = CrosswordNav.siguienteEnPalabra(partida, sel);
      if (sig) aplicarSeleccion({ row: sig.row, col: sig.col, dir: sel.dir });
      return;
    }
    const eventos = partida.escribirLetra(sel.row, sel.col, limpia);
    const resuelta = eventos.some((ev) => ev.type === "solved");
    if (info.siguiente) {
      aplicarSeleccion({ row: info.siguiente.row, col: info.siguiente.col, dir: sel.dir });
    } else {
      refrescarUI();
    }
    if (resuelta) RCSound.play("correct");
    revisarFinalAutomatico();
  }

  function onClueClick(placementIndex) {
    if (pausado) return;
    aplicarSeleccion(CrosswordNav.seleccionarPalabra(partida, placementIndex));
  }

  // =================================================================
  // REFRESCO GENERAL DE INTERFAZ
  // =================================================================
  function refrescarUI() {
    els.board.dataset.dir = sel ? sel.dir : "";
    CrosswordUI.updateBoardStates(els.board, partida, sel);
    CrosswordUI.updateClueStates(els.cluesAcross, els.cluesDown, partida, sel);
    const compartida = sel ? CrosswordNav.direccionesDisponibles(partida, sel.row, sel.col).length > 1 : false;
    CrosswordUI.renderActiveClue(els.activeClue, partida, sel, compartida);
    CrosswordUI.mostrarPistaActiva(els.cluesPanel);
    CrosswordUI.updateScore(els.score, partida.getScore());
  }

  // =================================================================
  // AYUDA / COMPROBAR
  // =================================================================
  function toggleHelpMenu(forceState) {
    const abrir = forceState !== undefined ? forceState : !els.helpMenu.classList.contains("is-open");
    els.helpMenu.classList.toggle("is-open", abrir);
    els.btnAyuda.setAttribute("aria-expanded", String(abrir));
  }

  function onRevelarLetra() {
    const idx = palabraActiva();
    if (idx === -1) { mostrarFeedback("Selecciona primero una palabra.", null); return; }
    const r = partida.revelarLetra(idx);
    toggleHelpMenu(false);
    refrescarUI();
    if (r && r.solved) RCSound.play("correct");
    revisarFinalAutomatico();
  }

  function onRevelarPalabra() {
    const idx = palabraActiva();
    if (idx === -1) { mostrarFeedback("Selecciona primero una palabra.", null); return; }
    partida.revelarPalabra(idx);
    toggleHelpMenu(false);
    refrescarUI();
    RCSound.play("correct");
    revisarFinalAutomatico();
  }

  function onComprobar() {
    const resultado = partida.comprobarTodo();
    const todas = resultado.correctas === resultado.total;
    mostrarFeedback(`${resultado.correctas} / ${resultado.total} palabras correctas.`, todas ? "good" : null);
    RCSound.play(todas ? "correct" : "incorrect");
    refrescarUI();
    revisarFinalAutomatico();
  }

  function mostrarFeedback(texto, tono) {
    els.feedback.textContent = texto;
    if (tono) els.feedback.setAttribute("data-tone", tono);
    else els.feedback.removeAttribute("data-tone");
  }

  // =================================================================
  // RELOJ
  // =================================================================
  function pintarReloj(info) {
    let tono = null;
    if (!info.unlimited) {
      if (info.remaining <= 30) tono = "critical";
      else if (info.remaining <= 120) tono = "warning";
    }
    CrosswordUI.updateTimer(els.timer, RCGame.formatTime(info.shown), tono);
  }

  function tiempoTranscurridoTexto() {
    return RCGame.formatTime(reloj ? reloj.info().elapsed : 0);
  }

  // =================================================================
  // CONTROLES DEL MAESTRO (solo existen en el DOM si el modo es maestro)
  // =================================================================
  function construirPanelMaestro() {
    const panel = els.teacherPanel;
    panel.innerHTML = "";
    panel.hidden = rol !== "maestro";
    if (rol !== "maestro") return;

    panel.innerHTML = `
      <span class="teacher-panel__label">🧑‍🏫 Controles del maestro</span>
      <div class="teacher-panel__actions">
        <button type="button" class="btn btn-ghost" id="btn-cw-pausa" data-sound="none">⏸️ Pausar</button>
        <button type="button" class="btn btn-ghost" id="btn-cw-solucion" aria-expanded="false" aria-controls="cw-solucion" data-sound="none">👁️ Ver solución</button>
        <button type="button" class="btn btn-ghost" id="btn-cw-terminar" data-sound="none">🏁 Terminar actividad</button>
      </div>
      <div class="teacher-solution" id="cw-solucion" hidden></div>`;

    const btnPausa = panel.querySelector("#btn-cw-pausa");
    const btnSol = panel.querySelector("#btn-cw-solucion");
    const btnTerminar = panel.querySelector("#btn-cw-terminar");
    const solEl = panel.querySelector("#cw-solucion");

    sess.listen(btnPausa, "click", () => alternarPausa(btnPausa));

    sess.listen(btnSol, "click", () => {
      const abrir = solEl.hidden;
      if (abrir && !solEl.dataset.built) {
        // La solución se construye SOLO cuando el maestro la pide.
        const items = [...partida.placements].sort((a, b) => a.number - b.number)
          .map((p) => `<li><b>${p.number} ${p.dir === "across" ? "→" : "↓"}</b> ${p.entry.word}</li>`).join("");
        solEl.innerHTML = `<p class="text-muted">Solo para el maestro. Evita proyectar esta lista a la clase.</p><ul>${items}</ul>`;
        solEl.dataset.built = "1";
      }
      solEl.hidden = !abrir;
      btnSol.setAttribute("aria-expanded", String(abrir));
      btnSol.textContent = abrir ? "🙈 Ocultar solución" : "👁️ Ver solución";
      RCSound.play(abrir ? "open" : "close");
    });

    // Doble confirmación ligera para no terminar la actividad por accidente.
    let armado = null;
    sess.listen(btnTerminar, "click", () => {
      if (armado) {
        armado.clear();
        armado = null;
        finalizarPartida("maestro");
        return;
      }
      btnTerminar.textContent = "¿Seguro? Pulsa de nuevo";
      RCSound.play("open");
      armado = sess.timeout(() => {
        armado = null;
        btnTerminar.textContent = "🏁 Terminar actividad";
      }, 3500);
    });
  }

  function alternarPausa(btn) {
    if (!reloj || !partida) return;
    pausado = !pausado;
    if (pausado) {
      reloj.pause();
      toggleHelpMenu(false);
      if (document.activeElement && els.board.contains(document.activeElement)) document.activeElement.blur();
    } else {
      reloj.resume();
    }
    els.board.inert = pausado;
    els.pauseVeil.hidden = !pausado;
    els.btnAyuda.disabled = pausado;
    els.btnComprobar.disabled = pausado;
    btn.textContent = pausado ? "▶️ Reanudar" : "⏸️ Pausar";
    RCSound.play(pausado ? "pause" : "resume");
  }

  // =================================================================
  // FLUJO DE PANTALLAS
  // =================================================================
  function revisarFinalAutomatico() {
    if (partida && partida.estaCompleto()) finalizarPartida("completo");
  }

  /** Controles fijos de la pantalla de juego; se registran en la sesión y se liberan al salir. */
  function enlazarControlesDeJuego() {
    sess.listen($("btn-cw-salir"), "click", () => sess.requestExit());
    sess.listen(els.btnAyuda, "click", (e) => { e.stopPropagation(); toggleHelpMenu(); });
    sess.listen($("btn-revelar-letra"), "click", onRevelarLetra);
    sess.listen($("btn-revelar-palabra"), "click", onRevelarPalabra);
    sess.listen(els.btnComprobar, "click", onComprobar);
    sess.listen(els.btnDireccion, "click", alternarDireccion);
    sess.listen(document, "click", (e) => {
      if (!els.helpMenu.contains(e.target) && e.target !== els.btnAyuda) toggleHelpMenu(false);
    });
    // El clic del ratón ya selecciona la casilla; el foco que provoca no debe repetirlo.
    sess.listen(els.board, "pointerdown", () => { ignorarFocoHasta = performance.now() + 400; }, true);
  }

  function iniciarPartida() {
    sess.start();                            // limpia lo anterior y activa las protecciones
    partida = crearPartidaCrucigrama(generarResultado(config.dificultad));
    sel = null;
    pausado = false;
    els.board.inert = false;
    els.pauseVeil.hidden = true;
    els.btnAyuda.disabled = false;
    els.btnComprobar.disabled = false;
    toggleHelpMenu(false);

    els.modeBadge.textContent = config.modalidad === "individual" ? "👤 Individual" : "👥 Grupos";
    els.roleBadge.textContent = rol === "maestro" ? "🧑‍🏫 Maestro" : "🎓 Alumno";
    mostrarFeedback(
      config.modalidad === "individual" ? "Resuelve el crucigrama individualmente." : "Formen grupos de 2 a 3 estudiantes.",
      null
    );

    CrosswordUI.renderBoard(els.board, partida, boardCallbacks);
    CrosswordUI.renderClues(els.cluesAcross, els.cluesDown, partida, { onClueClick });
    enlazarControlesDeJuego();
    construirPanelMaestro();
    refrescarUI();

    reloj = RCGame.clock({
      session: sess,
      limitSeconds: config.tiempoSegundos,
      onTick: pintarReloj,
      onEnd: () => finalizarPartida("tiempo")
    });
    reloj.start();

    CrosswordUI.showStage("game");
  }

  function finalizarPartida(motivo) {
    if (!partida) return;
    if (reloj) reloj.stop();
    const tiempo = tiempoTranscurridoTexto();
    sess.end();                              // libera oyentes e intervalos y quita las protecciones
    RCSound.stopAll();
    RCSound.play("complete");

    $("cw-result-score").textContent = partida.getScore();
    $("cw-result-words").textContent = `${partida.palabrasResueltas()} / ${partida.placements.length}`;
    $("cw-result-time").textContent = tiempo;
    $("cw-result-title").textContent = motivo === "completo" ? "¡Crucigrama completado!" : "Actividad finalizada";
    $("cw-result-note").textContent =
      motivo === "tiempo" ? "⏰ El tiempo terminó."
      : motivo === "maestro" ? "El maestro dio por terminada la actividad."
      : "¡Resolviste todas las palabras!";
    CrosswordUI.showStage("result");
  }

  /** Salida confirmada: se descarta TODO el estado y se vuelve a elegir el modo. */
  function descartarPartida() {
    if (reloj) reloj.stop();
    reloj = null;
    partida = null;
    sel = null;
    pausado = false;
    rol = null;
    config = { modalidad: "individual", tiempoSegundos: TIEMPO_ALUMNO, dificultad: "media" };
    els.board.inert = false;
    els.board.innerHTML = "";
    els.cluesAcross.innerHTML = "";
    els.cluesDown.innerHTML = "";
    els.teacherPanel.innerHTML = "";
    els.teacherPanel.hidden = true;
    els.pauseVeil.hidden = true;
    toggleHelpMenu(false);
    mostrarFeedback("", null);
    CrosswordUI.showStage("role");
  }

  // =================================================================
  // INICIALIZACIÓN (solo botones de las pantallas previas; los del juego
  // se enlazan en cada partida y se liberan al terminar)
  // =================================================================
  function elegirRol(nuevoRol) {
    if (nuevoRol !== "alumno" && nuevoRol !== "maestro") return;
    rol = nuevoRol;
    renderConfigStage();
    CrosswordUI.showStage("config");
  }

  $("btn-comenzar-crucigrama").addEventListener("click", () => CrosswordUI.showStage("role"));
  $("cw-role-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".role-card");
    if (card) elegirRol(card.dataset.role);
  });
  $("btn-cw-cambiar-rol").addEventListener("click", () => { rol = null; CrosswordUI.showStage("role"); });
  $("btn-iniciar-crucigrama").addEventListener("click", iniciarPartida);
  $("btn-cw-nuevo").addEventListener("click", () => { renderConfigStage(); CrosswordUI.showStage("config"); });

  CrosswordUI.showStage("intro");
})();
