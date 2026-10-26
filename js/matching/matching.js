/**
 * js/matching/matching.js
 * Controlador de "Relaciona los mecanismos".
 * Flujo: introducción → modo (alumno/maestro) → configuración → juego → resultado.
 * Todo lo creado durante la partida (reloj, oyentes, arrastre) se registra en
 * `sess` y se libera al terminar o al confirmar la salida.
 */

(function initMatching() {
  if (!document.getElementById("matching-shell")) return; // no estamos en relacionar.html

  const TIEMPO_OPCIONES = [
    { label: "Sin límite", value: 0 },
    { label: "10 min", value: 600 },
    { label: "15 min", value: 900 },
    { label: "20 min", value: 1200 }
  ];

  let rol = null;
  let config = { dificultad: "media", tiempoSegundos: 0 };
  let partida = null;
  let seleccion = null;      // { tipo:"chip", id } | { tipo:"slot", row } | null
  let reloj = null;
  let pausado = false;

  const sess = RCGame.session({ name: "relacionar", onDiscard: descartarPartida });
  const $ = (id) => document.getElementById(id);
  const els = {
    filas: $("mg-filas"), pool: $("mg-pool"), poolCount: $("mg-pool-count"),
    timer: $("mg-timer"), progreso: $("mg-progreso"), status: $("mg-status"),
    btnComprobar: $("btn-mg-comprobar"), hint: $("mg-comprobar-hint"),
    layout: $("mg-layout"), veil: $("mg-pause-veil"), teacher: $("mg-teacher-panel"),
    roleBadge: $("mg-role-badge")
  };

  // ---------------- configuración ----------------
  function pillGroup(container, opciones, valorActual, onSelect) {
    container.innerHTML = "";
    opciones.forEach((op) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pill" + (op.value === valorActual ? " is-selected" : "");
      btn.textContent = op.label;
      btn.addEventListener("click", () => {
        container.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        onSelect(op.value);
      });
      container.appendChild(btn);
    });
  }

  function renderConfigStage() {
    const esMaestro = rol === "maestro";
    $("mg-config-badge").textContent = esMaestro ? "🧑‍🏫 Modo maestro" : "🎓 Modo alumno";
    $("mg-config-title").textContent = esMaestro ? "Configura la actividad" : "¿Con qué dificultad quieres jugar?";
    $("mg-group-tiempo").hidden = !esMaestro;
    if (!esMaestro) config.tiempoSegundos = 0;
    pillGroup($("mg-config-dificultad"),
      [{ label: "Medio", value: "media" }, { label: "Difícil", value: "dificil" }],
      config.dificultad, (v) => { config.dificultad = v; });
    pillGroup($("mg-config-tiempo"), TIEMPO_OPCIONES, config.tiempoSegundos, (v) => { config.tiempoSegundos = v; });
  }

  // ---------------- reloj ----------------
  function pintarReloj(info) {
    let tono = null;
    if (!info.unlimited) tono = info.remaining <= 30 ? "critical" : info.remaining <= 120 ? "warning" : null;
    els.timer.textContent = `⏱️ ${RCGame.formatTime(info.shown)}`;
    els.timer.classList.toggle("is-warning", tono === "warning");
    els.timer.classList.toggle("is-critical", tono === "critical");
  }

  // ---------------- interacción ----------------
  const decir = (t) => { els.status.textContent = t; };

  function refrescar() {
    MatchingUI.render(els, partida, { seleccion, bloqueado: pausado }, callbacks);
    MatchingUI.actualizarProgreso(els.progreso, partida.contarColocadas(), partida.total);
    const completo = partida.estaCompleto();
    els.btnComprobar.disabled = !completo || pausado;
    els.hint.textContent = completo ? "" : `Faltan ${partida.total - partida.contarColocadas()} por relacionar.`;
  }

  function colocar(row, chipId, sonido) {
    const r = partida.colocar(row, chipId);
    seleccion = null;
    if (r.ignorado) { refrescar(); return; }
    RCSound.play(sonido);
    refrescar();
    const ficha = partida.obtenerFicha(chipId);
    decir(`${ficha.nombre} relacionado con el significado ${MatchingUI.letra(row)}.`);
  }

  const callbacks = {
    onPick: () => RCSound.play("pick"),
    onDrop: (row, chipId) => colocar(row, chipId, "drop"),
    onReturn: (chipId) => {
      const row = partida.filaDeFicha(chipId);
      if (row !== -1) { partida.quitarDeFila(row); seleccion = null; RCSound.play("unmatch"); refrescar(); decir("Mecanismo devuelto a la lista."); }
    },
    onChipClick: (id) => {
      if (pausado) return;
      if (seleccion && seleccion.tipo === "slot") { colocar(seleccion.row, id, "match"); return; }
      if (seleccion && seleccion.tipo === "chip" && seleccion.id === id) { seleccion = null; decir("Selección cancelada."); }
      else { seleccion = { tipo: "chip", id }; RCSound.play("select"); decir(`Seleccionado: ${partida.obtenerFicha(id).nombre}. Ahora elige su significado.`); }
      refrescar();
    },
    onSlotClick: (row) => {
      if (pausado) return;
      if (seleccion && seleccion.tipo === "chip") { colocar(row, seleccion.id, "match"); return; }
      const fila = partida.filas[row];
      if (seleccion && seleccion.tipo === "slot" && seleccion.row === row) { seleccion = null; decir("Selección cancelada."); }
      else if (fila.filledWith) { seleccion = { tipo: "chip", id: fila.filledWith }; RCSound.play("select"); decir(`Seleccionado: ${partida.obtenerFicha(fila.filledWith).nombre}. Elige otro significado para moverlo.`); }
      else { seleccion = { tipo: "slot", row }; RCSound.play("select"); decir(`Significado ${MatchingUI.letra(row)} seleccionado. Ahora elige un mecanismo.`); }
      refrescar();
    },
    onRemove: (row) => {
      if (pausado) return;
      if (partida.quitarDeFila(row)) { seleccion = null; RCSound.play("unmatch"); refrescar(); decir("Relación quitada."); }
    }
  };

  // ---------------- maestro ----------------
  function construirPanelMaestro() {
    const p = els.teacher;
    p.innerHTML = "";
    p.hidden = rol !== "maestro";
    if (rol !== "maestro") return;
    p.innerHTML = `
      <span class="teacher-panel__label">🧑‍🏫 Controles del maestro</span>
      <div class="teacher-panel__actions">
        <button type="button" class="btn btn-ghost" id="btn-mg-pausa" data-sound="none">⏸️ Pausar</button>
        <button type="button" class="btn btn-ghost" id="btn-mg-solucion" aria-expanded="false" aria-controls="mg-solucion" data-sound="none">👁️ Ver respuestas</button>
        <button type="button" class="btn btn-ghost" id="btn-mg-terminar" data-sound="none">🏁 Terminar y calificar</button>
      </div>
      <div class="teacher-solution" id="mg-solucion" hidden></div>`;
    const btnPausa = p.querySelector("#btn-mg-pausa");
    const btnSol = p.querySelector("#btn-mg-solucion");
    const btnFin = p.querySelector("#btn-mg-terminar");
    const sol = p.querySelector("#mg-solucion");

    sess.listen(btnPausa, "click", () => alternarPausa(btnPausa));
    sess.listen(btnSol, "click", () => {
      const abrir = sol.hidden;
      if (abrir && !sol.dataset.built) {
        const items = partida.filas.map((f, i) => `<li><b>${MatchingUI.letra(i)}</b> ${partida.obtenerFicha(f.mechanismId).nombre}</li>`).join("");
        sol.innerHTML = `<p class="text-muted">Solo para el maestro. Evita proyectar esta lista a la clase.</p><ul>${items}</ul>`;
        sol.dataset.built = "1";
      }
      sol.hidden = !abrir;
      btnSol.setAttribute("aria-expanded", String(abrir));
      btnSol.textContent = abrir ? "🙈 Ocultar respuestas" : "👁️ Ver respuestas";
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

  function alternarPausa(btn) {
    if (!reloj || !partida) return;
    pausado = !pausado;
    if (pausado) { reloj.pause(); MatchingUI.cancelarArrastre(); seleccion = null; } else reloj.resume();
    els.layout.inert = pausado;
    els.veil.hidden = !pausado;
    btn.textContent = pausado ? "▶️ Reanudar" : "⏸️ Pausar";
    refrescar();
    RCSound.play(pausado ? "pause" : "resume");
  }

  // ---------------- flujo ----------------
  function iniciarPartida() {
    sess.start();
    partida = crearPartidaMatching(construirMecanismosParaJuego(config.dificultad));
    seleccion = null;
    pausado = false;
    els.layout.inert = false;
    els.veil.hidden = true;
    els.roleBadge.textContent = rol === "maestro" ? "🧑‍🏫 Maestro" : "🎓 Alumno";
    decir("Arrastra un mecanismo hasta su significado, o toca uno y luego el otro.");
    sess.listen($("btn-mg-salir"), "click", () => sess.requestExit());
    sess.listen(els.btnComprobar, "click", () => { if (partida.estaCompleto()) finalizar("completo"); });
    sess.listen(document, "keydown", (e) => {
      if (e.key === "Escape" && seleccion && !RCGame.isExitModalOpen()) { seleccion = null; refrescar(); decir("Selección cancelada."); }
    });
    sess.onCleanup(() => MatchingUI.cancelarArrastre());   // sin arrastres ni fantasmas tras salir
    construirPanelMaestro();
    refrescar();
    reloj = RCGame.clock({ session: sess, limitSeconds: config.tiempoSegundos, onTick: pintarReloj, onEnd: () => finalizar("tiempo") });
    reloj.start();
    MatchingUI.showStage("game");
  }

  function finalizar(motivo) {
    if (!partida || partida.estaEvaluada()) return;
    if (reloj) reloj.stop();
    const tiempo = RCGame.formatTime(reloj ? reloj.info().elapsed : 0);
    MatchingUI.cancelarArrastre();
    partida.evaluar();
    sess.end();
    RCSound.stopAll();
    RCSound.play("complete");

    const correctas = partida.contarCorrectas();
    const total = partida.total;
    $("mg-result-grade").textContent = calcularCalificacion(correctas, total).toFixed(1);
    $("mg-result-correct").textContent = `${correctas} / ${total}`;
    $("mg-result-incorrect").textContent = String(total - correctas);
    $("mg-result-time").textContent = tiempo;
    $("mg-result-note").textContent =
      motivo === "tiempo" ? "⏰ El tiempo terminó."
      : motivo === "maestro" ? "El maestro dio por terminada la actividad."
      : correctas === total ? "🎉 ¡Todas las relaciones son correctas!" : "Actividad completada.";

    const lista = $("mg-review");
    const acciones = $("mg-review-actions");
    MatchingUI.renderRevision(lista, partida, false);
    acciones.innerHTML = "";
    if (rol === "maestro" && correctas < total) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn-ghost";
      b.textContent = "👁️ Mostrar respuestas correctas";
      b.addEventListener("click", () => { MatchingUI.renderRevision(lista, partida, true); b.remove(); });
      acciones.appendChild(b);
    } else if (correctas < total) {
      const p = document.createElement("p");
      p.className = "text-muted";
      p.innerHTML = 'Las respuestas correctas no se muestran: repasa en <a href="aprender.html">Aprender</a> y vuelve a intentarlo.';
      acciones.appendChild(p);
    }
    MatchingUI.showStage("result");
  }

  function descartarPartida() {
    if (reloj) reloj.stop();
    MatchingUI.cancelarArrastre();
    reloj = null; partida = null; seleccion = null; pausado = false; rol = null;
    config = { dificultad: "media", tiempoSegundos: 0 };
    els.layout.inert = false;
    els.filas.innerHTML = ""; els.pool.innerHTML = "";
    els.teacher.innerHTML = ""; els.teacher.hidden = true;
    els.veil.hidden = true;
    MatchingUI.showStage("role");
  }

  // ---------------- inicialización ----------------
  $("btn-comenzar-match").addEventListener("click", () => MatchingUI.showStage("role"));
  $("mg-role-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".role-card");
    if (!card) return;
    rol = card.dataset.role === "maestro" ? "maestro" : "alumno";
    renderConfigStage();
    MatchingUI.showStage("config");
  });
  $("btn-mg-cambiar-rol").addEventListener("click", () => { rol = null; MatchingUI.showStage("role"); });
  $("btn-iniciar-match").addEventListener("click", iniciarPartida);
  $("btn-mg-nuevo").addEventListener("click", () => { renderConfigStage(); MatchingUI.showStage("config"); });
  MatchingUI.showStage("intro");
})();
