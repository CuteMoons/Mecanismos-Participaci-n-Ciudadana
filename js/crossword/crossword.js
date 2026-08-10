/**
 * js/crossword/crossword.js
 * Controlador principal de la sección Crucigrama. Inicializa el resto
 * de módulos (generator, game, ui) y conecta la interacción del
 * usuario (clics, teclado, configuración) con el estado del juego.
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

  let config = { modalidad: "grupos", tiempoSegundos: 600, dificultad: "media", sonido: false };
  let partida = null;
  let seleccion = null; // { row, col, placementIndex, dir }
  let activeMechId = null;
  let timerInterval = null;
  let tiempoRestanteOInicial = 0;
  let modoSinLimite = false;

  // ---- Elementos ----
  const els = {
    mechCards: document.getElementById("cw-mech-cards"),
    mechContext: document.getElementById("cw-mech-context"),
    board: document.getElementById("cw-board"),
    cluesAcross: document.getElementById("cw-clues-across"),
    cluesDown: document.getElementById("cw-clues-down"),
    timer: document.getElementById("cw-timer"),
    score: document.getElementById("cw-score"),
    modeBadge: document.getElementById("cw-mode-badge"),
    feedback: document.getElementById("cw-feedback"),
    helpMenu: document.getElementById("cw-help-menu"),
    btnAyuda: document.getElementById("btn-ayuda"),
    btnComprobar: document.getElementById("btn-comprobar"),
    btnMute: document.getElementById("btn-cw-mute")
  };

  // =================================================================
  // SONIDO (opcional, apagado por defecto; el juego funciona sin él)
  // =================================================================
  let audioCtx = null;
  function beep(freq, dur) {
    if (!config.sonido) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur / 1000);
    } catch (e) { /* audio no disponible: el juego sigue funcionando igual */ }
  }
  const soundCorrect = () => beep(880, 140);
  const soundIncorrect = () => beep(220, 200);
  const soundFinish = () => { beep(660, 120); setTimeout(() => beep(880, 180), 140); };

  function pintarMute() {
    els.btnMute.innerHTML = `<svg viewBox="0 0 24 24" fill="none">${svgIcon(config.sonido ? "volume-on" : "volume-x")}</svg> ${config.sonido ? "Sonido activo" : "Silenciado"}`;
    els.btnMute.setAttribute("aria-pressed", String(config.sonido));
  }

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
    const modalidadEl = document.getElementById("cw-config-modalidad");
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

    pillGroup(document.getElementById("cw-config-tiempo"), TIEMPO_OPCIONES, config.tiempoSegundos, (v) => { config.tiempoSegundos = v; });

    const dificultades = [
      { label: "Fácil", value: "facil" },
      { label: "Medio", value: "media" },
      { label: "Difícil", value: "dificil" }
    ];
    pillGroup(document.getElementById("cw-config-dificultad"), dificultades, config.dificultad, (v) => { config.dificultad = v; });
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
      const candidatas = elegirPalabras(dificultad);
      resultado = CrosswordGenerator.generar(candidatas);
      intentos++;
    } while (resultado.placements.length < Math.min(5, cfg.count) && intentos < 6);
    return resultado;
  }

  // =================================================================
  // SELECCIÓN / NAVEGACIÓN EN EL TABLERO
  // =================================================================
  function palabrasEnCelda(r, c) {
    return partida.grid[r][c] ? partida.grid[r][c].words : [];
  }

  function focusCell(r, c) {
    const input = els.board.querySelector(`.cw-cell[data-row="${r}"][data-col="${c}"] .cw-cell__input`);
    if (input) input.focus();
  }

  function seleccionarCelda(r, c) {
    const wordsHere = palabrasEnCelda(r, c);
    if (wordsHere.length === 0) return;

    let placementIndex;
    if (seleccion && seleccion.row === r && seleccion.col === c && wordsHere.length > 1) {
      const actualPos = wordsHere.indexOf(seleccion.placementIndex);
      placementIndex = wordsHere[(actualPos + 1) % wordsHere.length];
    } else if (seleccion) {
      const mismaDir = wordsHere.find((idx) => partida.placements[idx].dir === seleccion.dir);
      placementIndex = mismaDir !== undefined ? mismaDir : wordsHere[0];
    } else {
      const across = wordsHere.find((idx) => partida.placements[idx].dir === "across");
      placementIndex = across !== undefined ? across : wordsHere[0];
    }

    seleccion = { row: r, col: c, placementIndex, dir: partida.placements[placementIndex].dir };
    activarMecanismoDePalabra(placementIndex);
    refrescarUI();
    focusCell(r, c);
  }

  function seleccionarCeldaForzando(r, c, dirPreferida) {
    const wordsHere = palabrasEnCelda(r, c);
    if (wordsHere.length === 0) return;
    const match = wordsHere.find((idx) => partida.placements[idx].dir === dirPreferida);
    const placementIndex = match !== undefined ? match : wordsHere[0];
    seleccion = { row: r, col: c, placementIndex, dir: partida.placements[placementIndex].dir };
    activarMecanismoDePalabra(placementIndex);
    refrescarUI();
    focusCell(r, c);
  }

  function moverFlecha(key) {
    if (!seleccion) return;
    let dr = 0, dc = 0;
    if (key === "ArrowLeft") dc = -1;
    else if (key === "ArrowRight") dc = 1;
    else if (key === "ArrowUp") dr = -1;
    else if (key === "ArrowDown") dr = 1;
    else return;

    let r = seleccion.row + dr, c = seleccion.col + dc;
    while (r >= 0 && r < partida.rows && c >= 0 && c < partida.cols && !partida.grid[r][c]) {
      r += dr; c += dc;
    }
    if (r < 0 || r >= partida.rows || c < 0 || c >= partida.cols || !partida.grid[r][c]) return;
    seleccionarCeldaForzando(r, c, dc !== 0 ? "across" : "down");
  }

  function avanzarEnPalabra() {
    if (!seleccion) return;
    const p = partida.placements[seleccion.placementIndex];
    const idxEnPalabra = p.dir === "down" ? seleccion.row - p.row : seleccion.col - p.col;
    if (idxEnPalabra + 1 < p.length) {
      const nr = p.dir === "down" ? p.row + idxEnPalabra + 1 : p.row;
      const nc = p.dir === "across" ? p.col + idxEnPalabra + 1 : p.col;
      seleccionarCeldaForzando(nr, nc, p.dir);
    }
  }

  function retrocederEnPalabra() {
    if (!seleccion) return;
    const p = partida.placements[seleccion.placementIndex];
    const idxEnPalabra = p.dir === "down" ? seleccion.row - p.row : seleccion.col - p.col;
    if (idxEnPalabra > 0) {
      const nr = p.dir === "down" ? p.row + idxEnPalabra - 1 : p.row;
      const nc = p.dir === "across" ? p.col + idxEnPalabra - 1 : p.col;
      partida.borrarLetra(nr, nc);
      seleccionarCeldaForzando(nr, nc, p.dir);
    }
  }

  // =================================================================
  // MECANISMOS (tarjetas)
  // =================================================================
  function activarMecanismoDePalabra(placementIndex) {
    const entry = partida.placements[placementIndex].entry;
    setMecanismoActivo(entry.mechanism || null);
  }

  function setMecanismoActivo(mechId) {
    activeMechId = mechId;
    CrosswordUI.setActiveMechCard(els.mechCards, mechId);
    CrosswordUI.renderMechContext(els.mechContext, mechId ? obtenerMecanismoPorId(mechId) : null);
  }

  function onMechCardSelect(mechId) {
    if (activeMechId === mechId) {
      setMecanismoActivo(null);
    } else {
      setMecanismoActivo(mechId);
      const match = partida.placements.findIndex((p) => p.entry.mechanism === mechId);
      if (match !== -1) {
        const p = partida.placements[match];
        seleccion = { row: p.row, col: p.col, placementIndex: match, dir: p.dir };
        focusCell(p.row, p.col);
      }
    }
    refrescarUI();
  }

  function indicesPorMecanismo(mechId) {
    if (!mechId) return new Set();
    const set = new Set();
    partida.placements.forEach((p, idx) => { if (p.entry.mechanism === mechId) set.add(idx); });
    return set;
  }

  // =================================================================
  // REFRESCO GENERAL DE INTERFAZ
  // =================================================================
  function refrescarUI() {
    const mechHighlight = indicesPorMecanismo(activeMechId);
    aplicarEstadosTablero(mechHighlight);
    aplicarEstadosPistas(mechHighlight);
    CrosswordUI.updateScore(els.score, partida.getScore());
  }

  function aplicarEstadosTablero(mechHighlight) {
    CrosswordUI.updateBoardStates(els.board, partida, seleccion);
    els.board.querySelectorAll(".cw-cell:not(.cw-cell--block)").forEach((cellEl) => {
      const r = Number(cellEl.dataset.row), c = Number(cellEl.dataset.col);
      const words = palabrasEnCelda(r, c);
      const pertenece = words.some((idx) => mechHighlight.has(idx));
      cellEl.classList.toggle("is-mech-highlight", pertenece);
    });
  }

  function aplicarEstadosPistas(mechHighlight) {
    CrosswordUI.updateClueStates(els.cluesAcross, els.cluesDown, partida, seleccion);
    [els.cluesAcross, els.cluesDown].forEach((listEl) => {
      listEl.querySelectorAll(".clue-item").forEach((btn) => {
        const idx = Number(btn.dataset.placementIndex);
        btn.classList.toggle("is-mech-highlight", mechHighlight.has(idx));
      });
    });
  }

  // =================================================================
  // EVENTOS DEL TABLERO (delegados desde crossword-ui.js)
  // =================================================================
  const boardCallbacks = {
    onCellClick: (r, c) => seleccionarCelda(r, c),
    onKeyDown: (e, r, c) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (partida.answers[r][c]) {
          partida.borrarLetra(r, c);
          refrescarUI();
        } else {
          retrocederEnPalabra();
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        partida.borrarLetra(r, c);
        refrescarUI();
      } else if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        moverFlecha(e.key);
      } else if (e.key === "Enter") {
        e.preventDefault();
        seleccionarCelda(r, c);
      }
    },
    onLetterInput: (r, c, letra) => {
      seleccionarCeldaForzando(r, c, seleccion ? seleccion.dir : "across");
      const eventos = partida.escribirLetra(r, c, letra);
      if (letra) {
        if (eventos.some((ev) => ev.type === "solved")) soundCorrect();
        avanzarEnPalabra();
      }
      refrescarUI();
      revisarFinalAutomatico();
    }
  };

  // =================================================================
  // AYUDA / COMPROBAR
  // =================================================================
  function toggleHelpMenu(forceState) {
    const abrir = forceState !== undefined ? forceState : !els.helpMenu.classList.contains("is-open");
    els.helpMenu.classList.toggle("is-open", abrir);
    els.btnAyuda.setAttribute("aria-expanded", String(abrir));
  }

  document.addEventListener("click", (e) => {
    if (!els.helpMenu.contains(e.target) && e.target !== els.btnAyuda) toggleHelpMenu(false);
  });

  function onRevelarLetra() {
    if (!seleccion) { mostrarFeedback("Selecciona primero una palabra.", null); return; }
    partida.revelarLetra(seleccion.placementIndex);
    toggleHelpMenu(false);
    refrescarUI();
    revisarFinalAutomatico();
  }

  function onRevelarPalabra() {
    if (!seleccion) { mostrarFeedback("Selecciona primero una palabra.", null); return; }
    partida.revelarPalabra(seleccion.placementIndex);
    toggleHelpMenu(false);
    refrescarUI();
    revisarFinalAutomatico();
  }

  function onComprobar() {
    const resultado = partida.comprobarTodo();
    mostrarFeedback(`${resultado.correctas} / ${resultado.total} palabras correctas.`, resultado.correctas === resultado.total ? "good" : null);
    if (resultado.correctas < resultado.total) soundIncorrect(); else soundCorrect();
    refrescarUI();
    revisarFinalAutomatico();
  }

  function mostrarFeedback(texto, tono) {
    els.feedback.textContent = texto;
    if (tono) els.feedback.setAttribute("data-tone", tono);
    else els.feedback.removeAttribute("data-tone");
  }

  // =================================================================
  // TEMPORIZADOR
  // =================================================================
  function formatearTiempo(seg) {
    const m = Math.floor(seg / 60).toString().padStart(2, "0");
    const s = (seg % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function pintarTimer() {
    let tono = null;
    if (!modoSinLimite) {
      if (tiempoRestanteOInicial <= 30) tono = "critical";
      else if (tiempoRestanteOInicial <= 120) tono = "warning";
    }
    CrosswordUI.updateTimer(els.timer, formatearTiempo(tiempoRestanteOInicial), tono);
  }

  function iniciarTimer() {
    detenerTimer();
    modoSinLimite = config.tiempoSegundos === 0;
    tiempoRestanteOInicial = modoSinLimite ? 0 : config.tiempoSegundos;
    pintarTimer();
    timerInterval = setInterval(() => {
      if (modoSinLimite) {
        tiempoRestanteOInicial += 1;
      } else {
        tiempoRestanteOInicial -= 1;
        if (tiempoRestanteOInicial <= 0) {
          tiempoRestanteOInicial = 0;
          pintarTimer();
          detenerTimer();
          finalizarPartida();
          return;
        }
      }
      pintarTimer();
    }, 1000);
  }

  function detenerTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function tiempoTranscurridoTexto() {
    if (modoSinLimite) return formatearTiempo(tiempoRestanteOInicial);
    return formatearTiempo(config.tiempoSegundos - tiempoRestanteOInicial);
  }

  // =================================================================
  // FLUJO DE PANTALLAS
  // =================================================================
  function revisarFinalAutomatico() {
    if (partida.estaCompleto()) finalizarPartida();
  }

  function iniciarPartida() {
    const resultado = generarResultado(config.dificultad);
    partida = crearPartidaCrucigrama(resultado);
    seleccion = null;
    activeMechId = null;

    els.modeBadge.textContent = config.modalidad === "individual" ? "👤 Individual" : "👥 Grupos";
    mostrarFeedback(
      config.modalidad === "individual"
        ? "Resuelve el crucigrama individualmente."
        : "Formen grupos de 2 a 3 estudiantes.",
      null
    );

    CrosswordUI.renderMechCards(els.mechCards, onMechCardSelect);
    CrosswordUI.renderMechContext(els.mechContext, null);
    CrosswordUI.renderBoard(els.board, partida, boardCallbacks);
    CrosswordUI.renderClues(els.cluesAcross, els.cluesDown, partida, { onClueClick: (idx) => onClueClick(idx) });
    refrescarUI();
    iniciarTimer();

    CrosswordUI.showStage("game");
  }

  function onClueClick(placementIndex) {
    const p = partida.placements[placementIndex];
    seleccion = { row: p.row, col: p.col, placementIndex, dir: p.dir };
    activarMecanismoDePalabra(placementIndex);
    refrescarUI();
    focusCell(p.row, p.col);
  }

  function finalizarPartida() {
    detenerTimer();
    soundFinish();
    document.getElementById("cw-result-score").textContent = partida.getScore();
    document.getElementById("cw-result-words").textContent = `${partida.palabrasResueltas()} / ${partida.placements.length}`;
    document.getElementById("cw-result-time").textContent = tiempoTranscurridoTexto();
    CrosswordUI.showStage("result");
  }

  // =================================================================
  // INICIALIZACIÓN
  // =================================================================
  document.getElementById("btn-comenzar-crucigrama").addEventListener("click", () => {
    renderConfigStage();
    CrosswordUI.showStage("config");
  });

  document.getElementById("btn-iniciar-crucigrama").addEventListener("click", iniciarPartida);

  document.getElementById("btn-cw-nuevo").addEventListener("click", () => {
    renderConfigStage();
    CrosswordUI.showStage("config");
  });

  els.btnAyuda.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleHelpMenu();
  });
  document.getElementById("btn-revelar-letra").addEventListener("click", onRevelarLetra);
  document.getElementById("btn-revelar-palabra").addEventListener("click", onRevelarPalabra);
  els.btnComprobar.addEventListener("click", onComprobar);

  els.btnMute.addEventListener("click", () => {
    config.sonido = !config.sonido;
    pintarMute();
  });
  pintarMute();

  CrosswordUI.showStage("intro");
})();
