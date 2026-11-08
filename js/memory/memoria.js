/**
 * js/memory/memoria.js
 * Controlador de «Memoria de conceptos».
 * Calificación: se reutiliza calcularCalificacion con una base de 3 puntos
 * por pareja; cada intento fallido y cada pareja sin encontrar restan puntos
 * (una pareja sin encontrar resta 3). Sin fallos = 5.0.
 */
(function initMemoria() {
  if (!document.getElementById("memoria-shell")) return;
  const { $, el, pillGroup, showStage, sonar } = RCMini;

  const PAREJAS_ALUMNO = 6;
  const PAREJAS = [6, 8, 10].map((n) => ({ label: `${n} parejas`, value: n }));
  const TIEMPOS = [{ label: "Sin límite", value: 0 }, { label: "5 min", value: 300 }, { label: "10 min", value: 600 }, { label: "15 min", value: 900 }];
  const OCULTAR_MS = 1100;

  let rol = null;
  let config = { parejas: PAREJAS_ALUMNO, tiempoSegundos: 0 };
  let partida = null, reloj = null, ultimoConjunto = "";

  const sess = RCGame.session({ name: "memoria", onDiscard: descartarPartida });
  const els = { board: $("mem-board"), timer: $("mg-timer"), progreso: $("mg-progreso"), intentos: $("mg-intentos"), rol: $("mg-role-badge"), panel: $("mg-teacher-panel"), area: $("mg-playarea"), veil: $("mg-pause-veil"), estado: $("mem-status") };
  const decir = (t) => { els.estado.textContent = t; };

  function renderConfig() {
    pillGroup($("mg-config-cantidad"), PAREJAS, config.parejas, (v) => { config.parejas = v; });
    pillGroup($("mg-config-tiempo"), TIEMPOS, config.tiempoSegundos, (v) => { config.tiempoSegundos = v; });
  }

  function pintarReloj(info) {
    els.timer.textContent = `⏱️ ${RCGame.formatTime(info.shown)}`;
    els.timer.classList.toggle("is-warning", !info.unlimited && info.remaining <= 120 && info.remaining > 30);
    els.timer.classList.toggle("is-critical", !info.unlimited && info.remaining <= 30);
  }
  function pintarStats() {
    els.progreso.textContent = `✅ Parejas: ${partida.encontradas} / ${partida.total}`;
    els.intentos.textContent = `🔁 Intentos: ${partida.intentos}`;
  }

  /** Elige un conjunto distinto del anterior (si el banco lo permite). */
  function elegirParejas(n) {
    let pares;
    for (let i = 0; i < 8; i++) {
      pares = RCMini.sample(MEMORIA_PARES, n);
      const firma = pares.map((p) => p.id).sort().join("|");
      if (firma !== ultimoConjunto || n >= MEMORIA_PARES.length) { ultimoConjunto = firma; break; }
    }
    return pares;
  }

  function etiquetaCarta(c, arriba) {
    if (!arriba) return `Carta ${c.n}, boca abajo`;
    return c.tipo === "concepto" ? `Concepto: ${c.texto}` : `Definición: ${c.texto}`;
  }

  function construirTablero(cartas) {
    els.board.innerHTML = "";
    cartas.forEach((c) => {
      const back = el("span", { class: "mem-face mem-face--back", "aria-hidden": "true", text: "?" });
      const front = el("span", { class: "mem-face mem-face--front", text: c.texto });
      const btn = el("button", {
        type: "button", class: `mem-card mem-card--${c.tipo === "concepto" ? "concept" : "def"}`,
        "data-i": String(c.n - 1), "data-sound": "none", "aria-label": etiquetaCarta(c, false)
      }, [el("span", { class: "mem-card__inner" }, [back, front])]);
      c.el = btn;
      els.board.appendChild(btn);
    });
  }

  function voltear(c, arriba) {
    c.arriba = arriba;
    c.el.classList.toggle("is-up", arriba);
    c.el.setAttribute("aria-label", etiquetaCarta(c, arriba));
  }

  function alPulsar(e) {
    const btn = e.target.closest(".mem-card");
    if (!btn || !partida || partida.terminada) return;
    const c = partida.cartas[Number(btn.dataset.i)];
    if (partida.bloqueo || c.arriba || c.hecha) return;
    voltear(c, true);
    sonar("pick");
    if (!partida.primera) { partida.primera = c; decir("Ahora busca su pareja."); return; }
    const a = partida.primera, b = c;
    partida.primera = null;
    partida.intentos++;
    if (a.key === b.key) {
      a.hecha = b.hecha = true;
      a.el.classList.add("is-matched"); b.el.classList.add("is-matched");
      partida.encontradas++;
      sonar("match");
      decir(`¡Pareja encontrada: ${a.tipo === "concepto" ? a.texto : b.texto}!`);
      pintarStats();
      if (partida.encontradas === partida.total) sess.timeout(() => finalizar("completo"), 450);
    } else {
      partida.bloqueo = true;
      sonar("unmatch");
      a.el.classList.add("is-wrong"); b.el.classList.add("is-wrong");
      decir("No coinciden. Memoriza dónde están e inténtalo de nuevo.");
      pintarStats();
      sess.timeout(() => {
        a.el.classList.remove("is-wrong"); b.el.classList.remove("is-wrong");
        voltear(a, false); voltear(b, false);
        partida.bloqueo = false;
      }, OCULTAR_MS);
    }
  }

  function iniciarPartida() {
    if (rol === "alumno" && !RCStudent.get()) { rol = null; showStage("role"); return; }
    const n = Math.min(rol === "maestro" ? config.parejas : PAREJAS_ALUMNO, MEMORIA_PARES.length);
    sess.start();
    const pares = elegirParejas(n);
    const cartas = RCMini.shuffle(pares.flatMap((p) => [
      { key: p.id, tipo: "concepto", texto: p.concepto },
      { key: p.id, tipo: "definicion", texto: p.definicion }
    ])).map((c, i) => ({ ...c, n: i + 1, arriba: false, hecha: false }));
    partida = { total: n, pares, cartas, primera: null, bloqueo: false, intentos: 0, encontradas: 0, terminada: false };
    construirTablero(cartas);
    pintarStats();
    decir("Toca una carta para voltearla y busca su pareja.");
    els.rol.textContent = rol === "maestro" ? "🧑‍🏫 Maestro" : "🎓 Alumno";
    RCMini.setPausa(els.area, els.veil, false);
    sess.listen(els.board, "click", alPulsar);
    sess.listen($("mg-btn-salir"), "click", () => sess.requestExit());
    RCMini.panelMaestro(els.panel, sess, {
      rol,
      onPausa: (p) => { if (p) reloj.pause(); else reloj.resume(); RCMini.setPausa(els.area, els.veil, p); },
      onTerminar: () => finalizar("maestro")
    });
    reloj = RCGame.clock({ session: sess, limitSeconds: rol === "maestro" ? config.tiempoSegundos : 0, onTick: pintarReloj, onEnd: () => finalizar("tiempo") });
    reloj.start();
    showStage("game");
  }

  function finalizar(motivo) {
    if (!partida || partida.terminada) return;
    partida.terminada = true;
    if (reloj) reloj.stop();
    const tiempo = RCGame.formatTime(reloj ? reloj.info().elapsed : 0);
    const { total, encontradas, intentos, pares } = partida;
    sess.end();
    RCSound.stopAll();
    RCSound.play("complete");
    const fallos = intentos - encontradas;
    const base = 3 * total;
    const puntos = Math.max(0, base - fallos - 3 * (total - encontradas));
    const nota = calcularCalificacion(puntos, base);
    const v = RCMini.valoracion(nota);
    RCMini.mostrarResultado({
      rol, badge: v.badge,
      titulo: motivo === "completo" ? (nota >= 3 ? "¡Encontraste todas las parejas!" : "¡Completaste el tablero!") : "Actividad finalizada",
      nota: motivo === "completo" ? "Cada intento fallido baja un poco la nota: con memoria y atención se llega a 5.0." :
        motivo === "tiempo" ? "⏰ El tiempo terminó. Cada pareja sin encontrar baja la nota." : "El maestro dio por terminada la actividad. Cada pareja sin encontrar baja la nota.",
      stats: [
        { valor: nota.toFixed(1), etiqueta: "Calificación / 5.0" },
        { valor: `${encontradas} / ${total}`, etiqueta: "Parejas encontradas" },
        { valor: String(intentos), etiqueta: "Intentos" },
        { valor: tiempo, etiqueta: "Tiempo" }
      ],
      repaso: { titulo: "Conceptos de esta partida", items: pares.map((p) => ({ texto: p.concepto, detalle: p.definicion })) }
    });
  }

  function descartarPartida() {
    if (reloj) reloj.stop();
    reloj = null; partida = null; rol = null;
    config = { parejas: PAREJAS_ALUMNO, tiempoSegundos: 0 };
    els.board.innerHTML = ""; els.panel.innerHTML = ""; els.panel.hidden = true; els.veil.hidden = true; els.area.inert = false;
    showStage("role");
  }

  RCMini.bindFlow({ getRol: () => rol, setRol: (r) => { rol = r; }, renderConfig, iniciar: iniciarPartida });
})();
