/**
 * js/quiz/quiz-ui.js
 * Renderiza y actualiza el DOM de las etapas del quiz (rol, configuración,
 * pregunta, resultado) y el modal de salida.
 *
 * No decide QUÉ preguntas se muestran (quiz-engine.js), ni cuánto dura cada
 * una (quiz-timer.js), ni cómo se califica (quiz-score.js). Todo texto que
 * viene de los bancos o del alumno se inserta con textContent (nunca como
 * HTML), por lo que no hay inyección de marcado.
 */

const QuizUI = (() => {
  const TIPO_OPCIONES = [
    { label: "🔤 Opción múltiple", value: "multiple" },
    { label: "✍️ Preguntas abiertas", value: "abierta" }
  ];
  const NUM_OPCIONES = [5, 10, 15, 20];
  const NUM_GRUPOS_OPCIONES = [2, 3, 4, 5, 6];
  const TIEMPO_OPCIONES = [
    { label: "30 s", value: 30 },
    { label: "1 min", value: 60 },
    { label: "2 min", value: 120 },
    { label: "3 min", value: 180 },
    { label: "5 min", value: 300 }
  ];
  const DIFICULTAD_OPCIONES = [
    { label: "Fácil", value: "facil" },
    { label: "Medio", value: "media" },
    { label: "Difícil", value: "dificil" },
    { label: "Mixto", value: "mixto" }
  ];
  const ESTADO_TEXTO = {
    correcta: "✔ Correcta",
    incorrecta: "✘ Incorrecta",
    "sin-responder": "— Sin responder",
    pendiente: "⏳ Pendiente de revisión"
  };

  /** Tiempo fijo que recibe el alumno (no es configurable por él). */
  const TIEMPO_ALUMNO = { multiple: 120, abierta: 300 };

  let nombresGrupos = [];
  let numeroPersonalizado = false;
  let tiempoPersonalizado = false;

  const $ = (id) => document.getElementById(id);

  /** Corrige un detalle de formato de tres enunciados del banco ("\\..."). */
  function limpiarTexto(t) {
    return String(t == null ? "" : t).replace(/\\+(\.\.\.)/g, "$1");
  }

  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function formatearTiempo(seg) {
    if (seg < 60) return `${seg} s`;
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return s ? `${m} min ${s} s` : `${m} min`;
  }

  /* ----------------------------- Etapas ----------------------------- */

  function showStage(name, { focus = true } = {}) {
    document.querySelectorAll(".quiz-stage").forEach((s) => {
      s.classList.toggle("is-active", s.dataset.stage === name);
    });
    if (!focus) return;
    const target = { role: "role-title", config: "config-title", question: "question-text", result: "result-title" }[name];
    const node = target && $(target);
    if (node) {
      node.setAttribute("tabindex", "-1");
      node.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0 });
  }

  function pillGroup(container, opciones, valorActual, onSelect) {
    container.innerHTML = "";
    opciones.forEach((op) => {
      const label = typeof op === "object" ? op.label : String(op);
      const value = typeof op === "object" ? op.value : op;
      const btn = el("button", "pill" + (value === valorActual ? " is-selected" : ""), label);
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(value === valorActual));
      btn.addEventListener("click", () => {
        container.querySelectorAll(".pill").forEach((p) => {
          p.classList.remove("is-selected");
          p.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-selected");
        btn.setAttribute("aria-pressed", "true");
        onSelect(value);
      });
      container.appendChild(btn);
    });
  }

  /* ----------------------------- Rol ----------------------------- */

  function renderRoleStage(onSelect) {
    document.querySelectorAll("#role-grid .role-card").forEach((btn) => {
      btn.onclick = () => onSelect(btn.dataset.role);
    });
  }

  /* ----------------------------- Configuración ----------------------------- */

  function renderGroupNames(config) {
    const wrap = $("group-names");
    wrap.innerHTML = "";
    for (let i = 0; i < config.numGrupos; i++) {
      if (!nombresGrupos[i]) nombresGrupos[i] = `Grupo ${i + 1}`;
      const label = el("label", "group-name");
      label.appendChild(el("span", "group-name__label", `Grupo ${i + 1}`));
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 24;
      input.value = nombresGrupos[i];
      input.setAttribute("aria-label", `Nombre del grupo ${i + 1}`);
      input.oninput = () => { nombresGrupos[i] = input.value; };
      label.appendChild(input);
      wrap.appendChild(label);
    }
  }

  function leerNombresGrupos(cantidad) {
    return Array.from({ length: cantidad }, (_, i) => (nombresGrupos[i] || "").trim() || `Grupo ${i + 1}`);
  }

  function actualizarAviso(config) {
    const aviso = $("config-aviso");
    const disponibles = QuizEngine.contarDisponibles(config);
    aviso.className = "notice notice--warn";
    if (disponibles === 0) {
      aviso.textContent = "No hay preguntas disponibles con estos filtros. Cambia la dificultad o el tipo de pregunta.";
      aviso.hidden = false;
    } else if (disponibles < config.numPreguntas) {
      aviso.textContent = `Con estos filtros solo hay ${disponibles} pregunta${disponibles === 1 ? "" : "s"} disponible${disponibles === 1 ? "" : "s"}: el cuestionario tendrá ${disponibles}, no ${config.numPreguntas}.`;
      aviso.hidden = false;
    } else {
      aviso.hidden = true;
      aviso.textContent = "";
    }
  }

  function mostrarAvisoError(texto) {
    const aviso = $("config-aviso");
    aviso.className = "notice notice--error";
    aviso.textContent = texto;
    aviso.hidden = false;
  }

  function renderConfigStage(config, callbacks) {
    const esMaestro = config.rol === "maestro";
    const refrescar = () => actualizarAviso(QuizConfig.get());

    $("config-role-badge").textContent = esMaestro ? "🧑‍🏫 Modo maestro" : "🎓 Modo alumno";
    $("config-title").textContent = esMaestro ? "Configura la actividad" : "Pon a prueba tus conocimientos";
    $("config-subtitle").textContent = esMaestro
      ? "Define los parámetros antes de iniciar frente a la clase."
      : "Elige el tipo de cuestionario y comienza cuando estés listo.";
    $("config-hint").textContent = esMaestro
      ? "Controlarás el temporizador y el avance de cada pregunta."
      : "Responderás aquí mismo y al final verás tu calificación.";

    // 1. Modalidad (grupos bloqueada para alumno)
    const modalidadEl = $("config-modalidad");
    modalidadEl.innerHTML = "";
    const modalidades = [
      { value: "individual", icon: "👤", label: "Individual" },
      { value: "grupos", icon: "👥", label: "Por grupos" }
    ];
    modalidades.forEach((op) => {
      const bloqueada = op.value === "grupos" && !esMaestro;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-card" + (config.modalidad === op.value ? " is-selected" : "") + (bloqueada ? " is-locked" : "");
      btn.innerHTML = `<div class="option-card__icon"></div><div class="option-card__label"></div>`;
      btn.querySelector(".option-card__icon").textContent = bloqueada ? "🔒" : op.icon;
      btn.querySelector(".option-card__label").textContent = bloqueada ? `${op.label} · solo maestro` : op.label;
      if (bloqueada) btn.setAttribute("aria-disabled", "true");
      btn.setAttribute("aria-pressed", String(config.modalidad === op.value));
      btn.addEventListener("click", () => {
        if (op.value === "grupos" && QuizConfig.get().rol !== "maestro") {
          const note = $("config-modalidad-note");
          note.textContent = "La modalidad por grupos la administra el maestro. Como alumno puedes realizar el cuestionario de forma individual.";
          note.hidden = false;
          return;
        }
        QuizConfig.set({ modalidad: op.value });
        modalidadEl.querySelectorAll(".option-card").forEach((c) => {
          c.classList.remove("is-selected");
          c.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-selected");
        btn.setAttribute("aria-pressed", "true");
        $("config-modalidad-note").hidden = true;
        const esGrupos = op.value === "grupos";
        $("group-setup").hidden = !esGrupos;
        if (esGrupos) renderGroupNames(QuizConfig.get());
        refrescar();
      });
      modalidadEl.appendChild(btn);
    });
    $("config-modalidad-note").hidden = true;

    const setupGrupos = $("group-setup");
    setupGrupos.hidden = !(esMaestro && config.modalidad === "grupos");
    if (!setupGrupos.hidden) renderGroupNames(config);
    pillGroup($("config-num-grupos"), NUM_GRUPOS_OPCIONES, config.numGrupos, (value) => {
      QuizConfig.set({ numGrupos: value });
      renderGroupNames(QuizConfig.get());
    });

    // 2. Tipo de pregunta
    const tiempoFijo = $("config-tiempo-fijo");
    function actualizarTiempoAlumno() {
      if (esMaestro) return;
      const seg = TIEMPO_ALUMNO[QuizConfig.get().tipoPregunta] || 120;
      tiempoFijo.textContent = `Cada pregunta tiene ${formatearTiempo(seg)}. El temporizador no se puede pausar.`;
    }
    const dificultadGroup = $("config-dificultad-group");
    dificultadGroup.hidden = config.tipoPregunta === "abierta";
    pillGroup($("config-tipo"), TIPO_OPCIONES, config.tipoPregunta, (value) => {
      QuizConfig.set({ tipoPregunta: value });
      dificultadGroup.hidden = value === "abierta";
      actualizarTiempoAlumno();
      refrescar();
    });

    // 3. Cantidad (personalizada solo para el maestro)
    const customWrap = $("config-numero-custom");
    const customInput = $("numero-personalizado");
    numeroPersonalizado = esMaestro && !NUM_OPCIONES.includes(config.numPreguntas);
    const numeroOpciones = esMaestro ? [...NUM_OPCIONES, "Personalizado"] : NUM_OPCIONES;
    pillGroup($("config-numero"), numeroOpciones, numeroPersonalizado ? "Personalizado" : config.numPreguntas, (value) => {
      if (value === "Personalizado") {
        numeroPersonalizado = true;
        customWrap.classList.add("is-visible");
        QuizConfig.set({ numPreguntas: Number(customInput.value) || 10 });
      } else {
        numeroPersonalizado = false;
        customWrap.classList.remove("is-visible");
        QuizConfig.set({ numPreguntas: value });
      }
      refrescar();
    });
    customWrap.classList.toggle("is-visible", numeroPersonalizado);
    customInput.value = config.numPreguntas;
    customInput.oninput = () => {
      const n = Math.floor(Number(customInput.value));
      if (n >= 1) QuizConfig.set({ numPreguntas: n });
      refrescar();
    };
    customInput.onchange = () => {
      customInput.value = QuizConfig.get().numPreguntas; // refleja el valor ya limitado (1 a 60)
    };

    // 4. Dificultad
    pillGroup($("config-dificultad"), DIFICULTAD_OPCIONES, config.dificultad, (value) => {
      QuizConfig.set({ dificultad: value });
      refrescar();
    });

    // 5. Tiempo por pregunta (editable solo por el maestro)
    const tiempoPills = $("config-tiempo");
    const tiempoCustomWrap = $("config-tiempo-custom");
    const tiempoCustomInput = $("tiempo-personalizado");

    tiempoPills.hidden = !esMaestro;
    tiempoFijo.hidden = esMaestro;
    if (esMaestro) {
      tiempoPersonalizado = !TIEMPO_OPCIONES.some((t) => t.value === config.tiempoSegundos);
      pillGroup(tiempoPills, [...TIEMPO_OPCIONES, { label: "Personalizado", value: "custom" }],
        tiempoPersonalizado ? "custom" : config.tiempoSegundos, (value) => {
          if (value === "custom") {
            tiempoPersonalizado = true;
            tiempoCustomWrap.classList.add("is-visible");
            QuizConfig.set({ tiempoSegundos: Number(tiempoCustomInput.value) || 90 });
          } else {
            tiempoPersonalizado = false;
            tiempoCustomWrap.classList.remove("is-visible");
            QuizConfig.set({ tiempoSegundos: value });
          }
        });
      tiempoCustomWrap.classList.toggle("is-visible", tiempoPersonalizado);
      tiempoCustomInput.value = config.tiempoSegundos;
      tiempoCustomInput.oninput = () => {
        const n = Math.floor(Number(tiempoCustomInput.value));
        if (n >= 10) QuizConfig.set({ tiempoSegundos: n });
      };
      tiempoCustomInput.onchange = () => { tiempoCustomInput.value = QuizConfig.get().tiempoSegundos; };
    } else {
      tiempoCustomWrap.classList.remove("is-visible");
      actualizarTiempoAlumno();
    }

    // 6. Opciones (solo maestro)
    $("config-opciones-group").hidden = !esMaestro;
    $("toggle-aleatorio").checked = config.aleatorio;
    $("toggle-sonido").checked = config.sonido;
    $("toggle-aleatorio").onchange = (e) => QuizConfig.set({ aleatorio: e.target.checked });
    $("toggle-sonido").onchange = (e) => QuizConfig.set({ sonido: e.target.checked });

    // Filtro por mecanismo ("Practicar este mecanismo")
    if (config.mecanismoFiltro) {
      const mecanismo = obtenerMecanismoPorId(config.mecanismoFiltro);
      if (mecanismo) {
        $("config-title").textContent = `Practicar: ${mecanismo.nombre}`;
        $("config-subtitle").textContent = "Este quiz solo incluirá preguntas de este mecanismo.";
      }
    }

    actualizarAviso(config);
    $("btn-iniciar-quiz").onclick = () => callbacks.onLaunch();
    $("btn-cambiar-rol").onclick = () => callbacks.onChangeRole();
  }

  /* ----------------------------- Pregunta ----------------------------- */

  function renderQuestion({ pregunta, index, total, config, rol }) {
    const esAlumno = rol === "alumno";
    const mecanismo = pregunta.mecanismo ? obtenerMecanismoPorId(pregunta.mecanismo) : null;
    const esAbierta = config.tipoPregunta === "abierta";

    $("question-mode-badge").textContent =
      config.modalidad === "grupos" ? "👥 Por grupos" : (esAlumno ? "🎓 Alumno" : "👤 Individual");

    const diffBadge = $("question-diff-badge");
    if (esAbierta) {
      diffBadge.textContent = "Abierta";
      diffBadge.className = "question-diff question-diff--media";
    } else {
      const diffLabelMap = { facil: "Fácil", media: "Media", dificil: "Difícil" };
      diffBadge.textContent = diffLabelMap[pregunta.dificultad] || pregunta.dificultad;
      diffBadge.className = `question-diff question-diff--${pregunta.dificultad}`;
    }

    $("question-current").textContent = String(index + 1).padStart(2, "0");
    $("question-total").textContent = total;

    const mechTag = $("question-mech-tag");
    if (mecanismo) {
      mechTag.style.setProperty("--mech-color", mecanismo.color);
      mechTag.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${svgIcon(mecanismo.icono)}</svg> `;
      mechTag.appendChild(document.createTextNode(mecanismo.nombre));
    } else {
      mechTag.style.removeProperty("--mech-color");
      mechTag.textContent = "General";
    }

    $("question-text").textContent = limpiarTexto(pregunta.pregunta);

    let hint;
    if (esAlumno) {
      hint = esAbierta
        ? "Escribe tu respuesta con tus propias palabras. El maestro la revisará."
        : "Selecciona una opción y pulsa «Confirmar respuesta».";
    } else {
      hint = esAbierta
        ? "Los estudiantes responden con sus propias palabras en el cuaderno o en una hoja."
        : "Los estudiantes responden en su cuaderno o en una hoja (número y letra).";
    }
    $("question-hint").textContent = hint;

    const pct = ((index + 1) / total) * 100;
    $("progress-fill").style.width = `${pct}%`;
    $("progress-bar").setAttribute("aria-valuenow", String(Math.round(pct)));
    $("timer-flash").classList.add("visually-hidden");
    $("pause-flag").hidden = true;

    // Opciones
    const optionsEl = $("question-options");
    optionsEl.innerHTML = "";
    optionsEl.hidden = esAbierta;
    if (!esAbierta && pregunta.opciones) {
      Object.entries(pregunta.opciones).forEach(([letra, texto]) => {
        const item = esAlumno ? document.createElement("button") : document.createElement("div");
        item.className = "option-item" + (esAlumno ? " option-item--btn" : "");
        if (esAlumno) {
          item.type = "button";
          item.setAttribute("aria-pressed", "false");
        }
        item.dataset.letra = letra;
        item.appendChild(el("span", "option-item__letter", letra));
        item.appendChild(el("span", "option-item__text", limpiarTexto(texto)));
        item.appendChild(el("span", "option-item__tag"));
        optionsEl.appendChild(item);
      });
    }

    // Respuesta abierta (solo alumno)
    $("open-answer").hidden = !(esAlumno && esAbierta);
    const ta = $("open-answer-text");
    ta.value = "";
    ta.disabled = false;
    $("open-answer-error").hidden = true;
    $("open-answer-count").textContent = "0 / 2000";

    // Feedback
    const fb = $("question-feedback");
    fb.hidden = true;
    fb.textContent = "";
    fb.className = "feedback";

    // Controles por rol
    $("actions-alumno").hidden = !esAlumno;
    $("actions-maestro").hidden = esAlumno;

    if (esAlumno) {
      $("btn-confirmar").hidden = false;
      $("btn-confirmar").disabled = !esAbierta; // opción múltiple: se habilita al elegir una opción
      $("btn-confirmar").textContent = esAbierta ? "Guardar y continuar" : "Confirmar respuesta";
      $("btn-sin-responder").hidden = !esAbierta;
      $("btn-siguiente-alumno").hidden = true;
      $("btn-siguiente-alumno").textContent = index + 1 === total ? "Ver resultados →" : "Siguiente pregunta →";
    } else {
      $("btn-siguiente").textContent = index + 1 === total ? "Terminar quiz →" : "Siguiente pregunta →";
      $("btn-revelar").hidden = esAbierta;
      $("btn-revelar").disabled = false;
      $("btn-pausar").textContent = "⏸ Pausar";
    }

    // Panel de grupos (solo maestro + modalidad grupos)
    $("group-panel").hidden = !(rol === "maestro" && config.modalidad === "grupos");
  }

  /** Marca visualmente la opción elegida por el alumno (aún sin confirmar). */
  function marcarSeleccion(letra) {
    $("question-options").querySelectorAll(".option-item").forEach((o) => {
      const sel = o.dataset.letra === letra;
      o.classList.toggle("is-selected", sel);
      o.setAttribute("aria-pressed", String(sel));
    });
    $("btn-confirmar").disabled = !letra;
  }

  function bloquearOpciones() {
    $("question-options").querySelectorAll(".option-item").forEach((o) => {
      o.classList.add("is-locked");
      if (o.tagName === "BUTTON") o.disabled = true;
    });
    $("btn-confirmar").disabled = true;
  }

  /** Señala correcta/incorrecta con color Y con texto (no solo color). */
  function resaltarOpciones({ seleccion, correcta }) {
    $("question-options").querySelectorAll(".option-item").forEach((o) => {
      const letra = o.dataset.letra;
      const tag = o.querySelector(".option-item__tag");
      o.classList.remove("is-selected");
      if (letra === correcta) {
        o.classList.add("is-correct");
        tag.textContent = letra === seleccion ? "✔ Tu respuesta · Correcta" : "✔ Respuesta correcta";
      } else if (letra === seleccion) {
        o.classList.add("is-wrong");
        tag.textContent = "✘ Tu respuesta";
      }
    });
  }

  function mostrarFeedback({ tipo, texto, explicacion }) {
    const fb = $("question-feedback");
    fb.className = `feedback feedback--${tipo}`;
    fb.textContent = "";
    fb.appendChild(el("strong", "feedback__title", texto));
    if (explicacion) fb.appendChild(el("span", "feedback__text", explicacion));
    fb.hidden = false;
  }

  function mostrarErrorAbierta(visible) {
    $("open-answer-error").hidden = !visible;
  }

  function bloquearRespuestaAbierta() {
    $("open-answer-text").disabled = true;
    $("btn-confirmar").disabled = true;
    $("btn-sin-responder").disabled = true;
  }

  function mostrarPausa(pausado) {
    $("pause-flag").hidden = !pausado;
    $("btn-pausar").textContent = pausado ? "▶ Reanudar" : "⏸ Pausar";
  }

  function mostrarBotonSiguienteAlumno() {
    $("btn-confirmar").hidden = true;
    $("btn-sin-responder").hidden = true;
    $("btn-siguiente-alumno").hidden = false;
    $("btn-siguiente-alumno").focus();
  }

  /** Marcador de grupos del maestro: un botón por grupo para otorgar el punto. */
  function renderMarcadorGrupos({ grupos, puntos, otorgadosEnPregunta, onToggle }) {
    const list = $("group-panel-list");
    list.innerHTML = "";
    grupos.forEach((nombre, i) => {
      const otorgado = otorgadosEnPregunta.has(i);
      const card = el("div", "group-card" + (otorgado ? " is-awarded" : ""));
      card.appendChild(el("span", "group-card__name", nombre));
      card.appendChild(el("b", "group-card__points", `${puntos[i]} pt`));
      const btn = el("button", "btn btn-sm " + (otorgado ? "btn-primary" : "btn-ghost"), otorgado ? "✔ Punto otorgado" : "＋ Otorgar punto");
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(otorgado));
      btn.setAttribute("aria-label", `${otorgado ? "Quitar punto a" : "Otorgar punto a"} ${nombre}`);
      btn.addEventListener("click", () => onToggle(i));
      card.appendChild(btn);
      list.appendChild(card);
    });
  }

  /* ----------------------------- Resultados ----------------------------- */

  function resetResultado() {
    $("result-alumno").hidden = true;
    $("result-maestro").hidden = true;
    $("result-maestro-individual").hidden = true;
    $("result-maestro-grupos").hidden = true;
    $("btn-copiar").hidden = true;
  }

  function renderResultAlumno({ stats, items }) {
    resetResultado();
    $("result-alumno").hidden = false;
    $("btn-copiar").hidden = false;
    $("result-title").textContent = "¡Cuestionario terminado!";
    $("result-subtitle").textContent = `${stats.total} pregunta${stats.total === 1 ? "" : "s"} · ${stats.calificables} de opción múltiple · ${stats.abiertas} abierta${stats.abiertas === 1 ? "" : "s"}`;

    const card = $("grade-card");
    card.classList.remove("is-pass", "is-fail", "is-none");
    const flag = $("grade-flag");
    const nota = stats.nota;
    $("grade-value").textContent = QuizScore.formatearNota(nota);
    if (nota === null) {
      card.classList.add("is-none");
      $("grade-label").textContent = "Sin calificación automática";
    } else {
      card.classList.add(nota >= 3.0 ? "is-pass" : "is-fail");
      $("grade-label").textContent = stats.notaProvisional ? "Nota provisional" : "Calificación final";
    }
    flag.hidden = !(stats.notaProvisional || nota === null);
    flag.textContent = nota === null ? "Pendiente de revisión del maestro" : "Puede cambiar tras la revisión";

    $("stat-total").textContent = stats.total;
    $("stat-correctas").textContent = stats.correctas;
    $("stat-incorrectas").textContent = stats.incorrectas;
    $("stat-sin").textContent = stats.sinResponder;
    $("stat-porcentaje").textContent = stats.porcentaje === null ? "—" : `${stats.porcentaje}%`;
    $("stat-pendientes").textContent = stats.abiertasPendientes;
    $("stat-pendientes-wrap").hidden = stats.abiertas === 0;

    $("result-message").textContent = QuizScore.mensajePorPorcentaje(stats.porcentaje);

    const exp = $("result-nota-explicacion");
    const pl = stats.abiertasPendientes === 1 ? "" : "s";
    if (stats.abiertasPendientes > 0 && nota !== null) {
      exp.textContent = `Tienes ${stats.abiertasPendientes} pregunta${pl} abierta${pl} pendiente${pl} de revisión. Esta nota solo considera las ${stats.calificables} preguntas de opción múltiple; la nota definitiva depende de la revisión de tu maestro.`;
      exp.hidden = false;
    } else if (nota === null) {
      exp.textContent = stats.abiertasPendientes > 0
        ? "Este cuestionario solo tuvo preguntas abiertas. No se calcula una nota automática: tus respuestas esperan la revisión del maestro."
        : "No hay preguntas calificables, por eso no se calcula una nota.";
      exp.hidden = false;
    } else {
      exp.hidden = true;
    }

    const list = $("summary-list");
    list.innerHTML = "";
    items.forEach((it) => {
      const li = el("li", `summary__item summary__item--${it.estado}`);
      const head = el("div", "summary__head");
      head.appendChild(el("span", "summary__num", `Pregunta ${String(it.n).padStart(2, "0")}`));
      head.appendChild(el("span", `badge badge--${it.estado}`, ESTADO_TEXTO[it.estado] + (it.tiempoAgotado ? " · tiempo agotado" : "")));
      li.appendChild(head);
      li.appendChild(el("p", "summary__q", limpiarTexto(it.pregunta)));

      if (it.tipo === "multiple") {
        li.appendChild(el("p", "summary__a", `Tu respuesta: ${it.seleccionTexto || "—"}`));
        if (it.estado !== "correcta") li.appendChild(el("p", "summary__a summary__a--ok", `Respuesta correcta: ${it.correctaTexto}`));
      } else {
        li.appendChild(el("p", "summary__open", it.texto ? it.texto : "No respondiste esta pregunta."));
        if (it.estado === "pendiente") li.appendChild(el("p", "summary__a", "Estado: pendiente de revisión por el maestro."));
      }
      list.appendChild(li);
    });
  }

  function renderResultMaestro({ modalidad, total, tipo, preguntas, ranking }) {
    resetResultado();
    $("result-maestro").hidden = false;
    $("result-title").textContent = "Actividad completada";
    $("result-subtitle").textContent = `${total} / ${total} preguntas completadas`;

    const esGrupos = modalidad === "grupos";
    $("result-maestro-individual").hidden = esGrupos;
    $("result-maestro-grupos").hidden = !esGrupos;

    if (esGrupos) {
      const ol = $("ranking-list");
      ol.innerHTML = "";
      ranking.forEach((g, pos) => {
        const li = el("li", "ranking__item" + (pos === 0 && g.puntos > 0 ? " is-first" : ""));
        li.appendChild(el("span", "ranking__pos", `${g.posicion}.º`));
        li.appendChild(el("span", "ranking__name", g.nombre));
        li.appendChild(el("span", "ranking__points", `${g.puntos} / ${total} pt`));
        li.appendChild(el("b", "ranking__grade", QuizScore.formatearNota(g.nota)));
        ol.appendChild(li);
      });
    }

    renderAnswerKey(preguntas, tipo);
  }

  function updateManualScore({ correctas, incorrectas, porcentaje, nota }) {
    $("score-value").textContent = correctas;
    $("m-correctas").textContent = correctas;
    $("m-incorrectas").textContent = incorrectas;
    $("m-porcentaje").textContent = `${porcentaje}%`;
    $("m-nota").textContent = QuizScore.formatearNota(nota);
    $("m-message").textContent = QuizScore.mensajePorPorcentaje(porcentaje);
  }

  function renderAnswerKey(preguntas, tipo) {
    const wrap = $("answer-key-wrap");
    const list = $("answer-key-list");
    const toggleBtn = $("btn-toggle-answers");
    list.setAttribute("hidden", "");
    toggleBtn.textContent = "📋 Ver hoja de respuestas";
    toggleBtn.setAttribute("aria-expanded", "false");

    if (tipo === "abierta") {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    list.innerHTML = "";
    preguntas.forEach((p, i) => {
      const item = el("div", "answer-key__item");
      item.appendChild(document.createTextNode(`Pregunta ${String(i + 1).padStart(2, "0")}: `));
      item.appendChild(el("b", "", p.respuestaCorrecta || "—"));
      list.appendChild(item);
    });
    toggleBtn.onclick = () => {
      const oculto = list.hasAttribute("hidden");
      if (oculto) list.removeAttribute("hidden");
      else list.setAttribute("hidden", "");
      toggleBtn.textContent = oculto ? "📋 Ocultar hoja de respuestas" : "📋 Ver hoja de respuestas";
      toggleBtn.setAttribute("aria-expanded", String(oculto));
    };
  }

  /* ----------------------------- Modal de salida ----------------------------- */

  let ultimoFoco = null;
  const REGIONES_INERT = ["#navbar-root", "main.quiz-shell", "footer.footer"];

  function setInerte(valor) {
    REGIONES_INERT.forEach((sel) => {
      const n = document.querySelector(sel);
      if (n) n.inert = valor;
    });
  }

  function abrirModalSalida() {
    const overlay = $("exit-modal");
    if (overlay.classList.contains("is-open")) return;
    ultimoFoco = document.activeElement;
    overlay.classList.add("is-open");
    document.body.classList.add("modal-open");
    setInerte(true);
    $("exit-modal-continue").focus();
  }

  function cerrarModalSalida() {
    const overlay = $("exit-modal");
    overlay.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    setInerte(false);
    if (ultimoFoco && document.contains(ultimoFoco) && !ultimoFoco.disabled) ultimoFoco.focus();
    ultimoFoco = null;
  }

  function modalSalidaAbierto() {
    return $("exit-modal").classList.contains("is-open");
  }

  return {
    showStage, renderRoleStage, renderConfigStage, renderQuestion,
    marcarSeleccion, bloquearOpciones, resaltarOpciones, mostrarFeedback,
    mostrarErrorAbierta, bloquearRespuestaAbierta, mostrarPausa, mostrarBotonSiguienteAlumno,
    renderMarcadorGrupos, renderResultAlumno, renderResultMaestro, updateManualScore,
    mostrarAvisoError, leerNombresGrupos, abrirModalSalida, cerrarModalSalida, modalSalidaAbierto,
    limpiarTexto, TIEMPO_ALUMNO
  };
})();
