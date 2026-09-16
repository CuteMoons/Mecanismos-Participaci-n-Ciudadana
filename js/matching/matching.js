/**
 * js/matching/matching.js
 * Controlador principal de "Relaciona los mecanismos". Conecta la
 * configuración, el estado del juego (matching-game.js) y la
 * interfaz (matching-ui.js) con la interacción del usuario.
 */

(function initMatching() {
  if (!document.getElementById("matching-shell")) return; // no estamos en relacionar.html

  const TIEMPO_OPCIONES = [
    { label: "Sin límite", value: 0 },
    { label: "10 min", value: 600 },
    { label: "15 min", value: 900 },
    { label: "20 min", value: 1200 }
  ];

  let config = { dificultad: "media", tiempoSegundos: 0 };
  let partida = null;
  let selectedChipId = null;
  let timerInterval = null;
  let tiempoRestanteOInicial = 0;
  let modoSinLimite = false;

  const els = {
    filas: document.getElementById("mg-filas"),
    pool: document.getElementById("mg-pool"),
    timer: document.getElementById("mg-timer"),
    progreso: document.getElementById("mg-progreso"),
    resultGrade: document.getElementById("mg-result-grade"),
    resultCorrect: document.getElementById("mg-result-correct"),
    resultIncorrect: document.getElementById("mg-result-incorrect"),
    resultTime: document.getElementById("mg-result-time")
  };

  // =================================================================
  // CONFIGURACIÓN
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
    const dificultades = [
      { label: "Medio", value: "media" },
      { label: "Difícil", value: "dificil" }
    ];
    pillGroup(document.getElementById("mg-config-dificultad"), dificultades, config.dificultad, (v) => { config.dificultad = v; });
    pillGroup(document.getElementById("mg-config-tiempo"), TIEMPO_OPCIONES, config.tiempoSegundos, (v) => { config.tiempoSegundos = v; });
  }

  // =================================================================
  // TEMPORIZADOR (mismo patrón visual que el crucigrama)
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
    els.timer.textContent = `⏱️ ${formatearTiempo(tiempoRestanteOInicial)}`;
    els.timer.classList.toggle("is-warning", tono === "warning");
    els.timer.classList.toggle("is-critical", tono === "critical");
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
          finalizarPartida(true);
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
  // INTERACCIÓN (arrastrar/soltar + selección por clic, accesible)
  // =================================================================
  const callbacks = {
    onDrop: (rowIndex, chipId) => colocarFicha(rowIndex, chipId),
    onRowClick: (rowIndex) => {
      if (selectedChipId) {
        colocarFicha(rowIndex, selectedChipId);
        selectedChipId = null;
      } else {
        // Si la fila ya tiene una ficha incorrecta puesta, un clic la libera.
        const fila = partida.filas[rowIndex];
        if (fila.filledWith && !fila.locked) {
          partida.quitarDeFila(rowIndex);
          refrescar();
        }
      }
    },
    onChipClick: (chipId) => {
      selectedChipId = selectedChipId === chipId ? null : chipId;
      refrescar();
    }
  };

  function colocarFicha(rowIndex, chipId) {
    const resultado = partida.colocar(rowIndex, chipId);
    if (!resultado.ignorado) {
      selectedChipId = null;
      refrescar();
      revisarFinalAutomatico();
    }
  }

  function refrescar() {
    MatchingUI.renderFilas(els.filas, partida, callbacks);
    MatchingUI.renderPool(els.pool, partida, callbacks, selectedChipId);
    MatchingUI.actualizarProgreso(els.progreso, partida.contarCorrectas(), partida.total);
  }

  // =================================================================
  // FLUJO DE PANTALLAS
  // =================================================================
  function revisarFinalAutomatico() {
    if (partida.estaCompleto()) finalizarPartida(false);
  }

  function iniciarPartida() {
    const mecanismos = construirMecanismosParaJuego(config.dificultad);
    partida = crearPartidaMatching(mecanismos);
    selectedChipId = null;
    refrescar();
    iniciarTimer();
    MatchingUI.showStage("game");
  }

  function finalizarPartida(porTiempo) {
    detenerTimer();
    const correctas = partida.contarCorrectas();
    const total = partida.total;
    const calificacion = calcularCalificacion(correctas, total);

    els.resultGrade.textContent = calificacion.toFixed(1);
    els.resultCorrect.textContent = `${correctas} / ${total}`;
    els.resultIncorrect.textContent = String(total - correctas);
    els.resultTime.textContent = tiempoTranscurridoTexto();

    const nota = document.getElementById("mg-result-note");
    if (nota) nota.textContent = porTiempo ? "⏰ El tiempo terminó." : "🎉 ¡Completaste todas las relaciones!";

    MatchingUI.showStage("result");
  }

  // =================================================================
  // INICIALIZACIÓN
  // =================================================================
  document.getElementById("btn-comenzar-match").addEventListener("click", () => {
    renderConfigStage();
    MatchingUI.showStage("config");
  });
  document.getElementById("btn-iniciar-match").addEventListener("click", iniciarPartida);
  document.getElementById("btn-mg-nuevo").addEventListener("click", () => {
    renderConfigStage();
    MatchingUI.showStage("config");
  });

  MatchingUI.showStage("intro");
})();
