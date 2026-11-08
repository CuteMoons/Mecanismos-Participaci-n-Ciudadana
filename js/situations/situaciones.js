/**
 * js/situations/situaciones.js
 * Controlador de «¿Qué harías en esta situación?».
 * Flujo: introducción → modo → [identificación | configuración] → juego → resultados.
 */
(function initSituaciones() {
  if (!document.getElementById("situaciones-shell")) return;
  const { $, pillGroup, showStage } = RCMini;

  const CANTIDAD_ALUMNO = 10;
  const CANTIDADES = [5, 10, 15].map((n) => ({ label: `${n} situaciones`, value: n }));
  const TIEMPOS = [{ label: "Sin límite", value: 0 }, { label: "5 min", value: 300 }, { label: "10 min", value: 600 }, { label: "15 min", value: 900 }];

  let rol = null;
  let config = { cantidad: CANTIDAD_ALUMNO, tiempoSegundos: 0 };
  let partida = null, reloj = null;

  const sess = RCGame.session({ name: "situaciones", onDiscard: descartarPartida });
  const els = { timer: $("mg-timer"), progreso: $("mg-progreso"), puntaje: $("mg-puntaje"), rol: $("mg-role-badge"), panel: $("mg-teacher-panel"), area: $("mg-playarea"), veil: $("mg-pause-veil"), pregunta: $("sit-pregunta") };

  function renderConfig() {
    pillGroup($("mg-config-cantidad"), CANTIDADES, config.cantidad, (v) => { config.cantidad = v; });
    pillGroup($("mg-config-tiempo"), TIEMPOS, config.tiempoSegundos, (v) => { config.tiempoSegundos = v; });
  }

  function pintarReloj(info) {
    els.timer.textContent = `⏱️ ${RCGame.formatTime(info.shown)}`;
    els.timer.classList.toggle("is-warning", !info.unlimited && info.remaining <= 120 && info.remaining > 30);
    els.timer.classList.toggle("is-critical", !info.unlimited && info.remaining <= 30);
  }
  function pintarStats() {
    els.progreso.textContent = `Situación ${Math.min(partida.indice + 1, partida.total)} / ${partida.total}`;
    els.puntaje.textContent = `✅ ${partida.aciertos} ${partida.aciertos === 1 ? "acierto" : "aciertos"}`;
  }

  function mostrarSituacion() {
    pintarStats();
    const q = partida.preguntas[partida.indice];
    const ultima = partida.indice === partida.total - 1;
    RCMini.renderPregunta(els.pregunta, q, {
      etiqueta: `Situación ${partida.indice + 1} de ${partida.total}`,
      textoSiguiente: ultima ? "Ver resultados 🏁" : "Siguiente situación →",
      onAnswer: (ok, info) => {
        partida.respondidas++;
        if (ok) partida.aciertos++;
        else partida.errores.push({ texto: RCMini.recortar(q.situacion), detalle: `Correcta: ${info.correctaTexto}` });
        pintarStats();
      },
      onNext: () => {
        if (partida.indice >= partida.total - 1) { finalizar("completo"); return; }
        partida.indice++;
        mostrarSituacion();
        window.scrollTo(0, 0);
      }
    });
  }

  function iniciarPartida() {
    if (rol === "alumno" && !RCStudent.get()) { rol = null; showStage("role"); return; }
    const total = Math.min(rol === "maestro" ? config.cantidad : CANTIDAD_ALUMNO, SITUACIONES.length);
    sess.start();
    partida = { total, preguntas: RCMini.sample(SITUACIONES, total), indice: 0, aciertos: 0, respondidas: 0, errores: [], terminada: false };
    els.rol.textContent = rol === "maestro" ? "🧑‍🏫 Maestro" : "🎓 Alumno";
    RCMini.setPausa(els.area, els.veil, false);
    sess.listen($("mg-btn-salir"), "click", () => sess.requestExit());
    RCMini.panelMaestro(els.panel, sess, {
      rol,
      onPausa: (p) => { if (p) reloj.pause(); else reloj.resume(); RCMini.setPausa(els.area, els.veil, p); },
      onTerminar: () => finalizar("maestro")
    });
    reloj = RCGame.clock({ session: sess, limitSeconds: rol === "maestro" ? config.tiempoSegundos : 0, onTick: pintarReloj, onEnd: () => finalizar("tiempo") });
    mostrarSituacion();
    reloj.start();
    showStage("game");
  }

  function finalizar(motivo) {
    if (!partida || partida.terminada) return;
    partida.terminada = true;
    if (reloj) reloj.stop();
    const tiempo = RCGame.formatTime(reloj ? reloj.info().elapsed : 0);
    const { aciertos, total, respondidas, errores } = partida;
    sess.end();
    RCSound.stopAll();
    RCSound.play("complete");
    const nota = calcularCalificacion(aciertos, total);
    const v = RCMini.valoracion(nota);
    RCMini.mostrarResultado({
      rol, badge: v.badge, titulo: v.titulo,
      nota: motivo === "tiempo" ? "⏰ El tiempo terminó. Las situaciones sin responder cuentan como no acertadas." :
        motivo === "maestro" ? "El maestro dio por terminada la actividad. Las situaciones sin responder cuentan como no acertadas." :
        "Respondiste todas las situaciones.",
      stats: [
        { valor: nota.toFixed(1), etiqueta: "Calificación / 5.0" },
        { valor: `${aciertos} / ${total}`, etiqueta: "Aciertos" },
        { valor: `${respondidas} / ${total}`, etiqueta: "Respondidas" },
        { valor: tiempo, etiqueta: "Tiempo" }
      ],
      repaso: { titulo: "Para repasar", items: errores }
    });
  }

  function descartarPartida() {
    if (reloj) reloj.stop();
    reloj = null; partida = null; rol = null;
    config = { cantidad: CANTIDAD_ALUMNO, tiempoSegundos: 0 };
    els.pregunta.innerHTML = ""; els.panel.innerHTML = ""; els.panel.hidden = true; els.veil.hidden = true; els.area.inert = false;
    showStage("role");
  }

  RCMini.bindFlow({ getRol: () => rol, setRol: (r) => { rol = r; }, renderConfig, iniciar: iniciarPartida });
})();
