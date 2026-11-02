/**
 * js/wordsearch/wordsearch.js
 * Controlador de la sopa de letras.
 * Flujo: introducción → modo (alumno/maestro) → [configuración del maestro] → juego → resultado.
 * Todo lo creado durante la partida (reloj, oyentes, selecciones, temporizadores
 * de los destellos) se registra en `sess` y se libera al terminar o al salir.
 */
(function initWordSearch() {
  if (!document.getElementById("wordsearch-shell")) return;

  const TIEMPO_OPCIONES = [
    { label: "Sin límite", value: 0 },
    { label: "5 min", value: 300 },
    { label: "10 min", value: 600 },
    { label: "15 min", value: 900 }
  ];
  const DESTELLO_ERROR_MS = 700;

  let rol = null;
  let config = { tiempoSegundos: 0 };
  let version = null, tablero = null, partida = null, ui = null, reloj = null;
  let pausado = false;
  let ultimaVersion = null;

  const sess = RCGame.session({ name: "sopa", onDiscard: descartarPartida });
  const $ = (id) => document.getElementById(id);
  const els = {
    board: $("ws-board"), words: $("ws-words"), timer: $("ws-timer"), progreso: $("ws-progreso"),
    status: $("ws-status"), teacher: $("ws-teacher-panel"), veil: $("ws-pause-veil"), roleBadge: $("ws-role-badge"),
    title: $("ws-game-title")
  };
  const decir = (t) => { els.status.textContent = t; };

  // ---------- configuración (solo maestro) ----------
  function renderConfig() {
    const cont = $("ws-config-tiempo");
    cont.innerHTML = "";
    TIEMPO_OPCIONES.forEach((op) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pill" + (op.value === config.tiempoSegundos ? " is-selected" : "");
      b.textContent = op.label;
      b.addEventListener("click", () => {
        cont.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-selected"));
        b.classList.add("is-selected");
        config.tiempoSegundos = op.value;
      });
      cont.appendChild(b);
    });
  }

  // ---------- versión y tablero ----------
  /** Elige una versión al azar (sin repetir la misma dos veces seguidas) y genera un tablero nuevo. */
  function crearPartida() {
    const opciones = WORDSEARCH_VERSIONS.filter((v) => v.id !== ultimaVersion);
    const v = opciones[Math.floor(Math.random() * opciones.length)];
    ultimaVersion = v.id;
    const t = WordSearch.generar(v.words);
    return { v, t, p: WordSearch.crearPartidaSopa(t, v.words) };
  }

  // ---------- reloj ----------
  function pintarReloj(info) {
    els.timer.textContent = `⏱️ ${RCGame.formatTime(info.shown)}`;
    els.timer.classList.toggle("is-warning", !info.unlimited && info.remaining <= 120 && info.remaining > 30);
    els.timer.classList.toggle("is-critical", !info.unlimited && info.remaining <= 30);
  }

  // ---------- selección ----------
  const callbacks = {
    bloqueado: () => pausado || !partida,
    onInicio: () => RCSound.play("pick"),
    onCancelar: () => decir("Selección cancelada."),
    onSeleccion: (cells) => {
      if (!partida || pausado) return;
      const res = partida.evaluar(cells);
      if (res.tipo === "correcta") {
        WordSearchUI.marcarEncontrada(els.board, cells, res.color);
        WordSearchUI.renderLista(els.words, partida.words, partida);
        actualizarProgreso();
        RCSound.play("correct");
        decir(`¡Encontraste ${res.word}!`);
        if (partida.estaCompleta()) finalizar("completo");
      } else if (res.tipo === "repetida") {
        WordSearchUI.ponerClase(els.board, cells, "is-repeated");
        sess.timeout(() => WordSearchUI.quitarClase(els.board, cells, "is-repeated"), 500);
        RCSound.play("select");
        decir(`${res.word} ya estaba encontrada.`);
      } else {
        // Selección incorrecta: se ve en rojo un momento y se limpia sola.
        WordSearchUI.ponerClase(els.board, cells, "is-wrong");
        sess.timeout(() => WordSearchUI.quitarClase(els.board, cells, "is-wrong"), DESTELLO_ERROR_MS);
        RCSound.play("incorrect");
        decir("Esa selección no coincide con una palabra pendiente. Sigue intentando.");
      }
    }
  };

  function actualizarProgreso() {
    els.progreso.textContent = `${partida.cantidadEncontradas()} / ${partida.total} palabras`;
  }

  // ---------- maestro ----------
  function construirPanelMaestro() {
    const p = els.teacher;
    p.innerHTML = "";
    p.hidden = rol !== "maestro";
    if (rol !== "maestro") return;
    p.innerHTML = `
      <span class="teacher-panel__label">🧑‍🏫 Controles del maestro</span>
      <div class="teacher-panel__actions">
        <button type="button" class="btn btn-ghost" id="btn-ws-pausa" data-sound="none">⏸️ Pausar</button>
        <button type="button" class="btn btn-ghost" id="btn-ws-solucion" aria-expanded="false" aria-controls="ws-solucion" data-sound="none">👁️ Ver ubicaciones</button>
        <button type="button" class="btn btn-ghost" id="btn-ws-terminar" data-sound="none">🏁 Terminar y calificar</button>
      </div>
      <div class="teacher-solution" id="ws-solucion" hidden></div>`;
    const btnPausa = p.querySelector("#btn-ws-pausa");
    const btnSol = p.querySelector("#btn-ws-solucion");
    const btnFin = p.querySelector("#btn-ws-terminar");
    const sol = p.querySelector("#ws-solucion");

    sess.listen(btnPausa, "click", () => {
      pausado = !pausado;
      if (pausado) { reloj.pause(); ui.cancelar(); } else reloj.resume();
      els.board.inert = pausado;
      els.veil.hidden = !pausado;
      btnPausa.textContent = pausado ? "▶️ Reanudar" : "⏸️ Pausar";
      RCSound.play(pausado ? "pause" : "resume");
    });
    sess.listen(btnSol, "click", () => {
      const abrir = sol.hidden;
      if (abrir && !sol.dataset.built) {
        // Las ubicaciones se construyen SOLO cuando el maestro las pide.
        const items = tablero.colocadas.slice().sort((a, b) => a.word.localeCompare(b.word))
          .map((k) => `<li><b>${k.word}</b> — fila ${k.row + 1}, columna ${k.col + 1}, ${k.dirNombre}</li>`).join("");
        sol.innerHTML = `<p class="text-muted">Solo para el maestro. Evita proyectar esta lista a la clase.</p><ul>${items}</ul>`;
        sol.dataset.built = "1";
      }
      sol.hidden = !abrir;
      btnSol.setAttribute("aria-expanded", String(abrir));
      btnSol.textContent = abrir ? "🙈 Ocultar ubicaciones" : "👁️ Ver ubicaciones";
      RCSound.play(abrir ? "open" : "close");
    });
    let armado = null;
    sess.listen(btnFin, "click", () => {
      if (armado) { armado.clear(); armado = null; finalizar("maestro"); return; }
      btnFin.textContent = "¿Seguro? Pulsa de nuevo";
      RCSound.play("open");
      armado = sess.timeout(() => { armado = null; btnFin.textContent = "🏁 Terminar y calificar"; }, 3500);
    });
  }

  // ---------- flujo ----------
  function iniciarPartida() {
    sess.start();
    const creada = crearPartida();
    version = creada.v; tablero = creada.t; partida = creada.p;
    pausado = false;
    els.board.inert = false;
    els.veil.hidden = true;
    els.roleBadge.textContent = rol === "maestro" ? "🧑‍🏫 Maestro" : "🎓 Alumno";
    els.title.textContent = `Tema: ${version.titulo}`;
    decir("Arrastra de la primera a la última letra, o toca la primera y luego la última.");
    WordSearchUI.renderTablero(els.board, tablero);
    WordSearchUI.renderLista(els.words, partida.words, partida);
    actualizarProgreso();
    ui = WordSearchUI.enlazar(els.board, tablero.n, callbacks, sess);
    sess.listen($("btn-ws-salir"), "click", () => sess.requestExit());
    sess.onCleanup(() => { if (ui) ui.cancelar(); });
    construirPanelMaestro();
    reloj = RCGame.clock({ session: sess, limitSeconds: rol === "maestro" ? config.tiempoSegundos : 0, onTick: pintarReloj, onEnd: () => finalizar("tiempo") });
    reloj.start();
    WordSearchUI.showStage("game");
  }

  function finalizar(motivo) {
    if (!partida) return;
    if (reloj) reloj.stop();
    const tiempo = RCGame.formatTime(reloj ? reloj.info().elapsed : 0);
    const encontradas = partida.cantidadEncontradas(), total = partida.total;
    sess.end();                       // detiene temporizadores y selecciones; quita las protecciones
    RCSound.stopAll();
    RCSound.play("complete");
    $("ws-result-grade").textContent = calcularCalificacion(encontradas, total).toFixed(1);
    $("ws-result-found").textContent = `${encontradas} / ${total}`;
    $("ws-result-time").textContent = tiempo;
    const completa = motivo === "completo";
    $("ws-result-badge").textContent = completa ? "🎉" : "🏁";
    $("ws-result-title").textContent = completa ? "¡Ganaste! Encontraste todas las palabras" : "Actividad finalizada";
    $("ws-result-note").textContent = completa ? `Sopa «${version.titulo}» completada.`
      : motivo === "tiempo" ? "⏰ El tiempo terminó." : "El maestro dio por terminada la actividad.";
    WordSearchUI.showStage("result");
  }

  function descartarPartida() {
    if (reloj) reloj.stop();
    if (ui) ui.cancelar();
    reloj = null; partida = null; tablero = null; version = null; ui = null; pausado = false; rol = null;
    config = { tiempoSegundos: 0 };
    els.board.inert = false; els.board.innerHTML = ""; els.words.innerHTML = "";
    els.teacher.innerHTML = ""; els.teacher.hidden = true; els.veil.hidden = true;
    WordSearchUI.showStage("role");
  }

  // ---------- inicialización ----------
  $("btn-comenzar-ws").addEventListener("click", () => WordSearchUI.showStage("role"));
  $("ws-role-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".role-card");
    if (!card) return;
    rol = card.dataset.role === "maestro" ? "maestro" : "alumno";
    if (rol === "alumno") { config.tiempoSegundos = 0; iniciarPartida(); }   // el alumno juega directamente
    else { renderConfig(); WordSearchUI.showStage("config"); }
  });
  $("btn-ws-cambiar-rol").addEventListener("click", () => { rol = null; WordSearchUI.showStage("role"); });
  $("btn-iniciar-ws").addEventListener("click", iniciarPartida);
  $("btn-ws-nuevo").addEventListener("click", () => { if (rol === "maestro") { renderConfig(); WordSearchUI.showStage("config"); } else iniciarPartida(); });
  WordSearchUI.showStage("intro");
})();
