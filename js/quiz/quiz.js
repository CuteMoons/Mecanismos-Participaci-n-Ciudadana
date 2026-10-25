/**
 * js/quiz/quiz.js
 * Orquesta el flujo completo del quiz:
 *   rol → configuración → preguntas → resultado
 * Es el único archivo que "conoce" a todos los demás módulos del quiz.
 *
 * El estado de la partida vive SOLO en memoria (variable `sesion`). Al salir
 * o terminar, se descarta. No se guarda nada en disco, servidor ni
 * localStorage: no es un registro académico centralizado.
 */

(function initQuiz() {
  if (!document.getElementById("stage-config")) return; // no estamos en quiz.html

  const AUTO_AVANCE_MS = 3500;
  const $ = (id) => document.getElementById(id);

  let sesion = null;       // partida en curso (null si no hay)
  let timer = null;
  let avanceId = null;     // setTimeout del avance automático (solo alumno)
  let sonidoActivo = true;
  let audioCtx = null;
  let ultimoResumen = "";

  /* ----------------------------- utilidades ----------------------------- */

  function leerFiltroDeURL() {
    const params = new URLSearchParams(window.location.search);
    const mecanismo = params.get("mecanismo");
    if (mecanismo && obtenerMecanismoPorId(mecanismo)) {
      QuizConfig.set({ mecanismoFiltro: mecanismo });
    }
  }

  function initTimer() {
    timer = crearTemporizador({
      elLabel: $("timer-label"),
      elTimer: $("timer-wrap"),
      elRing: $("timer-ring"),
      elFlash: $("timer-flash")
    });
  }

  function limpiarAvance() {
    if (avanceId) clearTimeout(avanceId);
    avanceId = null;
  }

  function pitar() {
    if (!sonidoActivo) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = 880;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (_) { /* el sonido es opcional */ }
  }

  const preguntaActual = () => sesion.preguntas[sesion.indice];
  const esAbierta = () => sesion.config.tipoPregunta === "abierta";

  function textoOpcion(p, letra) {
    return letra && p.opciones && p.opciones[letra] ? `${letra}. ${QuizUI.limpiarTexto(p.opciones[letra])}` : "";
  }

  /* ----------------------------- rol y configuración ----------------------------- */

  function mostrarRol() {
    QuizUI.showStage("role");
    QuizUI.renderRoleStage(seleccionarRol);
  }

  function seleccionarRol(rol) {
    if (rol !== "alumno" && rol !== "maestro") return;
    QuizConfig.reset();
    QuizConfig.set({ rol, modalidad: "individual", aleatorio: true });
    mostrarConfig();
  }

  function cambiarRol() {
    QuizConfig.reset();
    mostrarRol();
  }

  function mostrarConfig() {
    QuizUI.showStage("config");
    QuizUI.renderConfigStage(QuizConfig.get(), { onLaunch: iniciarPartida, onChangeRole: cambiarRol });
  }

  /* ----------------------------- partida ----------------------------- */

  function iniciarPartida() {
    if (sesion && !sesion.terminada) return; // evita doble inicio
    const base = QuizConfig.get();
    if (base.rol !== "alumno" && base.rol !== "maestro") return mostrarRol();

    // Reglas por rol, aplicadas también aquí (no solo en la interfaz)
    const config = { ...base };
    if (config.rol === "alumno") {
      config.modalidad = "individual";
      config.aleatorio = true;
      config.tiempoSegundos = QuizUI.TIEMPO_ALUMNO[config.tipoPregunta] || 120;
      config.numPreguntas = Math.min(config.numPreguntas, 20);
    }

    const partida = QuizEngine.construirPartida(config);
    if (partida.preguntas.length === 0) {
      QuizUI.mostrarAvisoError("No hay preguntas disponibles con estos filtros. Cambia la dificultad o el tipo de pregunta.");
      return;
    }

    sonidoActivo = config.sonido;
    sesion = {
      rol: config.rol,
      config: Object.freeze(config),
      preguntas: partida.preguntas,
      indice: 0,
      respuestas: new Array(partida.preguntas.length).fill(null),
      seleccion: null,
      bloqueada: false,
      pausado: false,
      terminada: false,
      grupos: config.modalidad === "grupos" ? QuizUI.leerNombresGrupos(config.numGrupos) : [],
      otorgados: partida.preguntas.map(() => new Set()),
      aciertosManual: 0
    };

    history.pushState({ quizGuard: true }, "");
    QuizUI.showStage("question");
    mostrarPregunta();
  }

  function mostrarPregunta() {
    limpiarAvance();
    sesion.bloqueada = false;
    sesion.pausado = false;
    sesion.seleccion = null;

    QuizUI.renderQuestion({
      pregunta: preguntaActual(),
      index: sesion.indice,
      total: sesion.preguntas.length,
      config: sesion.config,
      rol: sesion.rol
    });
    pintarMute();
    if (sesion.config.modalidad === "grupos") pintarGrupos();

    timer.setSonido(sonidoActivo);
    timer.start(sesion.config.tiempoSegundos, { onEnd: alAgotarseTiempo });
  }

  function avanzar() {
    if (!sesion || sesion.terminada) return;
    limpiarAvance();
    timer.stop();
    if (sesion.indice + 1 < sesion.preguntas.length) {
      sesion.indice += 1;
      mostrarPregunta();
    } else {
      finalizarPartida();
    }
  }

  /* ----------------------------- respuestas del alumno ----------------------------- */

  function registrarMultiple(letra, tiempoAgotado) {
    const i = sesion.indice;
    if (sesion.respuestas[i] || sesion.bloqueada) return; // una pregunta se cuenta una sola vez
    sesion.bloqueada = true;

    const p = preguntaActual();
    const correcta = p.respuestaCorrecta;
    const estado = !letra ? "sin-responder" : letra === correcta ? "correcta" : "incorrecta";
    sesion.respuestas[i] = { id: p.id, tipo: "multiple", estado, seleccion: letra || null, correcta, tiempoAgotado };

    timer.stop();
    QuizUI.bloquearOpciones();
    QuizUI.resaltarOpciones({ seleccion: letra, correcta });

    const detalle = `La respuesta correcta es ${textoOpcion(p, correcta)}`;
    if (estado === "correcta") {
      QuizUI.mostrarFeedback({ tipo: "ok", texto: "✔ ¡Correcto!", explicacion: p.explicacion });
    } else if (estado === "incorrecta") {
      QuizUI.mostrarFeedback({ tipo: "bad", texto: "✘ Incorrecto.", explicacion: [detalle, p.explicacion].filter(Boolean).join(" · ") });
    } else {
      QuizUI.mostrarFeedback({ tipo: "time", texto: "⏰ Se acabó el tiempo sin responder.", explicacion: [detalle, p.explicacion].filter(Boolean).join(" · ") });
    }
    cerrarPreguntaAlumno(tiempoAgotado);
  }

  function registrarAbierta(texto, tiempoAgotado) {
    const i = sesion.indice;
    if (sesion.respuestas[i] || sesion.bloqueada) return;
    sesion.bloqueada = true;

    const p = preguntaActual();
    const limpio = (texto || "").trim();
    const estado = limpio ? "pendiente" : "sin-responder";
    sesion.respuestas[i] = { id: p.id, tipo: "abierta", estado, texto: limpio, tiempoAgotado };

    timer.stop();
    QuizUI.bloquearRespuestaAbierta();
    if (estado === "pendiente") {
      QuizUI.mostrarFeedback({
        tipo: "info",
        texto: tiempoAgotado ? "⏰ Se acabó el tiempo: se guardó lo que alcanzaste a escribir." : "✔ Respuesta guardada.",
        explicacion: "Tu maestro la revisará; no se califica automáticamente."
      });
    } else {
      QuizUI.mostrarFeedback({ tipo: tiempoAgotado ? "time" : "info", texto: tiempoAgotado ? "⏰ Se acabó el tiempo sin responder." : "Dejaste esta pregunta sin responder." });
    }
    cerrarPreguntaAlumno(tiempoAgotado);
  }

  function cerrarPreguntaAlumno(tiempoAgotado) {
    QuizUI.mostrarBotonSiguienteAlumno();
    if (tiempoAgotado) {
      limpiarAvance();
      avanceId = setTimeout(() => {
        avanceId = null;
        if (sesion && !sesion.terminada) avanzar();
      }, AUTO_AVANCE_MS);
    }
  }

  function confirmarAlumno() {
    if (!sesion || sesion.rol !== "alumno" || sesion.bloqueada) return;
    if (esAbierta()) {
      const texto = $("open-answer-text").value.trim();
      if (!texto) {
        QuizUI.mostrarErrorAbierta(true);
        $("open-answer-text").focus();
        return;
      }
      registrarAbierta(texto, false);
    } else {
      if (!sesion.seleccion) return;
      registrarMultiple(sesion.seleccion, false);
    }
  }

  function alAgotarseTiempo() {
    if (!sesion || sesion.terminada) return;
    pitar();
    if (sesion.rol === "alumno") {
      if (sesion.respuestas[sesion.indice]) return;
      if (esAbierta()) registrarAbierta($("open-answer-text").value, true);
      else registrarMultiple(sesion.seleccion, true);
    }
    // Maestro: el aviso "¡TIEMPO!" queda visible y él decide cuándo continuar.
  }

  /* ----------------------------- controles del maestro ----------------------------- */

  function alternarPausa() {
    if (!sesion || sesion.rol !== "maestro" || sesion.terminada) return;
    if (!sesion.pausado) {
      if (timer.restanteSegundos() <= 0) return; // el tiempo ya terminó
      timer.pausar();
      sesion.pausado = true;
    } else {
      timer.reanudar();
      sesion.pausado = false;
    }
    QuizUI.mostrarPausa(sesion.pausado);
  }

  function revelarRespuesta() {
    if (!sesion || sesion.rol !== "maestro" || esAbierta()) return;
    const p = preguntaActual();
    QuizUI.resaltarOpciones({ seleccion: null, correcta: p.respuestaCorrecta });
    QuizUI.mostrarFeedback({
      tipo: "info",
      texto: `Respuesta correcta: ${textoOpcion(p, p.respuestaCorrecta)}`,
      explicacion: p.explicacion
    });
    $("btn-revelar").disabled = true;
  }

  function puntosPorGrupo() {
    return sesion.grupos.map((_, g) => sesion.otorgados.filter((set) => set.has(g)).length);
  }

  function pintarGrupos() {
    QuizUI.renderMarcadorGrupos({
      grupos: sesion.grupos,
      puntos: puntosPorGrupo(),
      otorgadosEnPregunta: sesion.otorgados[sesion.indice],
      onToggle: (g) => {
        if (!sesion || sesion.rol !== "maestro") return;
        const set = sesion.otorgados[sesion.indice];
        if (set.has(g)) set.delete(g); else set.add(g);
        pintarGrupos();
      }
    });
  }

  /* ----------------------------- resultado ----------------------------- */

  function finalizarPartida() {
    timer.stop();
    limpiarAvance();
    sesion.terminada = true;
    QuizUI.cerrarModalSalida();

    if (sesion.rol === "alumno") finalizarAlumno();
    else finalizarMaestro();
    QuizUI.showStage("result");
  }

  function finalizarAlumno() {
    const tipo = sesion.config.tipoPregunta;
    const respuestas = sesion.respuestas.map((r) => r || { tipo: tipo === "abierta" ? "abierta" : "multiple", estado: "sin-responder" });
    const stats = QuizScore.calcular(respuestas);

    const items = sesion.preguntas.map((p, i) => {
      const r = respuestas[i];
      return {
        n: i + 1,
        pregunta: p.pregunta,
        tipo: r.tipo,
        estado: r.estado,
        tiempoAgotado: !!r.tiempoAgotado,
        seleccionTexto: r.tipo === "multiple" ? textoOpcion(p, r.seleccion) : "",
        correctaTexto: r.tipo === "multiple" ? textoOpcion(p, p.respuestaCorrecta) : "",
        texto: r.texto || ""
      };
    });

    QuizUI.renderResultAlumno({ stats, items });
    ultimoResumen = construirResumenTexto(stats, items);
  }

  function construirResumenTexto(stats, items) {
    const lineas = [
      "Resultado del cuestionario · Mecanismos de Participación Ciudadana",
      `Preguntas: ${stats.total} | Correctas: ${stats.correctas} | Incorrectas: ${stats.incorrectas} | Sin responder: ${stats.sinResponder}`,
      stats.porcentaje === null ? "Aciertos: sin preguntas calificables" : `Aciertos (opción múltiple): ${stats.porcentaje}%`,
      `Nota${stats.notaProvisional ? " provisional" : ""}: ${QuizScore.formatearNota(stats.nota)} / 5,0`,
      stats.abiertasPendientes > 0 ? `Preguntas abiertas pendientes de revisión: ${stats.abiertasPendientes}` : "",
      ""
    ].filter((l, i, a) => l !== "" || i === a.length - 1);
    items.forEach((it) => {
      lineas.push(`${it.n}. ${QuizUI.limpiarTexto(it.pregunta)}`);
      if (it.tipo === "multiple") {
        lineas.push(`   Respuesta del alumno: ${it.seleccionTexto || "sin responder"} → ${it.estado}`);
        if (it.estado !== "correcta") lineas.push(`   Respuesta correcta: ${it.correctaTexto}`);
      } else {
        lineas.push(`   Respuesta del alumno: ${it.texto || "sin responder"} → ${it.estado === "pendiente" ? "pendiente de revisión" : "sin responder"}`);
      }
    });
    return lineas.join("\n");
  }

  function finalizarMaestro() {
    const total = sesion.preguntas.length;
    const modalidad = sesion.config.modalidad;
    let ranking = [];

    if (modalidad === "grupos") {
      const puntos = puntosPorGrupo();
      ranking = sesion.grupos
        .map((nombre, i) => ({ nombre, puntos: puntos[i], nota: QuizScore.calcularNota(puntos[i], total) }))
        .sort((a, b) => b.puntos - a.puntos);
      let pos = 0;
      ranking.forEach((g, i) => {
        if (i === 0 || g.puntos !== ranking[i - 1].puntos) pos = i + 1;
        g.posicion = pos;
      });
    }

    QuizUI.renderResultMaestro({ modalidad, total, tipo: sesion.config.tipoPregunta, preguntas: sesion.preguntas, ranking });

    if (modalidad !== "grupos") {
      const actualizar = () => {
        const correctas = sesion.aciertosManual;
        QuizUI.updateManualScore({
          correctas,
          incorrectas: total - correctas,
          porcentaje: Math.round((correctas / total) * 100),
          nota: QuizScore.calcularNota(correctas, total)
        });
      };
      actualizar();
      $("score-minus").onclick = () => { sesion.aciertosManual = Math.max(0, sesion.aciertosManual - 1); actualizar(); };
      $("score-plus").onclick = () => { sesion.aciertosManual = Math.min(total, sesion.aciertosManual + 1); actualizar(); };
    }
  }

  async function copiarResumen() {
    const btn = $("btn-copiar");
    let ok = false;
    try {
      await navigator.clipboard.writeText(ultimoResumen);
      ok = true;
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = ultimoResumen;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
      ta.remove();
    }
    btn.textContent = ok ? "✔ Copiado" : "No se pudo copiar";
    setTimeout(() => { btn.textContent = "📋 Copiar resumen"; }, 2200);
  }

  /* ----------------------------- salir / nueva partida ----------------------------- */

  function pedirSalida() {
    if (!sesion || sesion.terminada) return;
    QuizUI.abrirModalSalida();
  }

  function descartarPartida() {
    timer.stop();
    timer.reiniciarVisual(0);
    limpiarAvance();
    sesion = null;
    ultimoResumen = "";
  }

  function confirmarSalida() {
    QuizUI.cerrarModalSalida();
    descartarPartida();
    QuizConfig.reset();            // configuración desde cero (conserva solo el filtro por mecanismo)
    mostrarRol();                  // el rol se vuelve a elegir: así no queda un rol "pegado"
  }

  function nuevoCuestionario() {
    descartarPartida();
    const rol = QuizConfig.get().rol;
    QuizConfig.reset({ keepRole: true });
    if (rol) mostrarConfig(); else mostrarRol();
  }

  /* ----------------------------- sonido ----------------------------- */

  function pintarMute() {
    ["btn-mute", "btn-mute-alumno"].forEach((id) => {
      const btn = $(id);
      if (!btn) return;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${svgIcon(sonidoActivo ? "volume-on" : "volume-x")}</svg> ${sonidoActivo ? "Sonido activo" : "Silenciado"}`;
      btn.setAttribute("aria-pressed", String(!sonidoActivo));
    });
  }

  /* ----------------------------- eventos (se registran UNA sola vez) ----------------------------- */

  function initControles() {
    // Alumno
    $("question-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-item--btn");
      if (!btn || !sesion || sesion.rol !== "alumno" || sesion.bloqueada) return;
      sesion.seleccion = btn.dataset.letra;
      QuizUI.marcarSeleccion(sesion.seleccion);
    });
    $("btn-confirmar").addEventListener("click", confirmarAlumno);
    $("btn-sin-responder").addEventListener("click", () => {
      if (sesion && sesion.rol === "alumno" && esAbierta()) registrarAbierta("", false);
    });
    $("btn-siguiente-alumno").addEventListener("click", () => {
      if (sesion && sesion.rol === "alumno" && sesion.respuestas[sesion.indice]) avanzar();
    });
    $("open-answer-text").addEventListener("input", (e) => {
      $("open-answer-count").textContent = `${e.target.value.length} / 2000`;
      if (e.target.value.trim()) QuizUI.mostrarErrorAbierta(false);
    });

    // Maestro
    $("btn-pausar").addEventListener("click", alternarPausa);
    $("btn-revelar").addEventListener("click", revelarRespuesta);
    $("btn-siguiente").addEventListener("click", () => {
      if (sesion && sesion.rol === "maestro") avanzar();
    });

    // Sonido (preferencia propia de cada persona, no es un control administrativo)
    const alternarSonido = () => {
      sonidoActivo = !sonidoActivo;
      timer.setSonido(sonidoActivo);
      pintarMute();
    };
    $("btn-mute").addEventListener("click", alternarSonido);
    $("btn-mute-alumno").addEventListener("click", alternarSonido);

    // Salida con confirmación
    $("btn-salir").addEventListener("click", pedirSalida);
    $("exit-modal-continue").addEventListener("click", () => QuizUI.cerrarModalSalida());
    $("exit-modal-leave").addEventListener("click", confirmarSalida);
    $("exit-modal").addEventListener("click", (e) => {
      if (e.target === $("exit-modal")) QuizUI.cerrarModalSalida(); // clic fuera = Continuar
    });
    document.addEventListener("keydown", (e) => {
      if (!QuizUI.modalSalidaAbierto()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        QuizUI.cerrarModalSalida();
      } else if (e.key === "Tab") {
        const focusables = [$("exit-modal-continue"), $("exit-modal-leave")];
        const idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey ? (idx <= 0 ? focusables.length - 1 : idx - 1) : (idx + 1) % focusables.length;
        focusables[next].focus();
      }
    });

    // Guardas contra salir por accidente (recargar, cerrar pestaña, botón atrás)
    window.addEventListener("beforeunload", (e) => {
      if (sesion && !sesion.terminada) {
        e.preventDefault();
        e.returnValue = "";
      }
    });
    window.addEventListener("popstate", () => {
      if (sesion && !sesion.terminada) {
        history.pushState({ quizGuard: true }, "");
        QuizUI.abrirModalSalida();
      }
    });

    // Resultado
    $("btn-copiar").addEventListener("click", copiarResumen);
    $("btn-nuevo-quiz").addEventListener("click", nuevoCuestionario);
  }

  leerFiltroDeURL();
  initTimer();
  initControles();
  pintarMute();
  mostrarRol();
})();
