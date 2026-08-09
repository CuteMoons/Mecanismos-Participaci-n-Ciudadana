/**
 * js/quiz/quiz-ui.js
 * Renderiza y actualiza el DOM de las 3 etapas del quiz.
 * No decide QUÉ preguntas mostrar (eso es quiz-engine.js) ni CUÁNTO
 * tiempo dura cada una (quiz-timer.js); solo pinta el estado actual.
 */

const QuizUI = (() => {
  const TIPO_OPCIONES = [
    { label: "🔤 Opción múltiple", value: "multiple" },
    { label: "✍️ Preguntas abiertas", value: "abierta" }
  ];
  const NUM_OPCIONES = [5, 10, 15, 20];
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

  function showStage(name) {
    document.querySelectorAll(".quiz-stage").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.stage === name);
    });
  }

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

  function renderConfigStage(config, callbacks) {
    // Modalidad
    const modalidadEl = document.getElementById("config-modalidad");
    modalidadEl.innerHTML = "";
    [
      { value: "individual", icon: "👤", label: "Individual" },
      { value: "grupos", icon: "👥", label: "Por grupos" }
    ].forEach((op) => {
      const div = document.createElement("button");
      div.type = "button";
      div.className = "option-card" + (config.modalidad === op.value ? " is-selected" : "");
      div.innerHTML = `<div class="option-card__icon">${op.icon}</div><div class="option-card__label">${op.label}</div>`;
      div.addEventListener("click", () => {
        modalidadEl.querySelectorAll(".option-card").forEach((c) => c.classList.remove("is-selected"));
        div.classList.add("is-selected");
        QuizConfig.set({ modalidad: op.value });
      });
      modalidadEl.appendChild(div);
    });

    // Tipo de pregunta (múltiple vs abierta)
    const dificultadGroup = document.getElementById("config-dificultad-group");
    function actualizarVisibilidadDificultad(tipo) {
      dificultadGroup.style.display = tipo === "abierta" ? "none" : "block";
    }
    actualizarVisibilidadDificultad(config.tipoPregunta);
    pillGroup(document.getElementById("config-tipo"), TIPO_OPCIONES, config.tipoPregunta, (value) => {
      QuizConfig.set({ tipoPregunta: value });
      actualizarVisibilidadDificultad(value);
    });

    // Número de preguntas (+ personalizado)
    const numeroEl = document.getElementById("config-numero");
    const customWrap = document.getElementById("config-numero-custom");
    const customInput = document.getElementById("numero-personalizado");
    const numeroOpciones = [...NUM_OPCIONES, "Personalizado"];
    pillGroup(numeroEl, numeroOpciones, config.numPreguntas, (value) => {
      if (value === "Personalizado") {
        customWrap.classList.add("is-visible");
        QuizConfig.set({ numPreguntas: Number(customInput.value) || 10 });
      } else {
        customWrap.classList.remove("is-visible");
        QuizConfig.set({ numPreguntas: value });
      }
    });
    customInput.addEventListener("input", () => {
      QuizConfig.set({ numPreguntas: Math.max(1, Number(customInput.value) || 1) });
    });

    // Dificultad
    pillGroup(document.getElementById("config-dificultad"), DIFICULTAD_OPCIONES, config.dificultad, (value) => {
      QuizConfig.set({ dificultad: value });
    });

    // Tiempo
    pillGroup(document.getElementById("config-tiempo"), TIEMPO_OPCIONES, config.tiempoSegundos, (value) => {
      QuizConfig.set({ tiempoSegundos: value });
    });

    // Toggles
    document.getElementById("toggle-aleatorio").checked = config.aleatorio;
    document.getElementById("toggle-puntuacion").checked = config.mostrarPuntuacion;
    document.getElementById("toggle-sonido").checked = config.sonido;

    document.getElementById("toggle-aleatorio").onchange = (e) => QuizConfig.set({ aleatorio: e.target.checked });
    document.getElementById("toggle-puntuacion").onchange = (e) => QuizConfig.set({ mostrarPuntuacion: e.target.checked });
    document.getElementById("toggle-sonido").onchange = (e) => QuizConfig.set({ sonido: e.target.checked });

    // Filtro por mecanismo (viene de "Practicar este mecanismo")
    if (config.mecanismoFiltro) {
      const mecanismo = obtenerMecanismoPorId(config.mecanismoFiltro);
      if (mecanismo) {
        document.getElementById("config-title").textContent = `Practicar: ${mecanismo.nombre}`;
        document.getElementById("config-subtitle").textContent =
          "Este quiz solo incluirá preguntas de este mecanismo.";
      }
    }

    document.getElementById("btn-iniciar-quiz").onclick = () => callbacks.onLaunch();
  }

  function renderQuestion({ pregunta, index, total, config }) {
    const mecanismo = pregunta.mecanismo ? obtenerMecanismoPorId(pregunta.mecanismo) : null;

    document.getElementById("question-mode-badge").textContent =
      config.modalidad === "individual" ? "👤 Individual" : "👥 Por grupos";

    const diffBadge = document.getElementById("question-diff-badge");
    if (config.tipoPregunta === "abierta") {
      diffBadge.textContent = "Abierta";
      diffBadge.className = "question-diff question-diff--media";
    } else {
      const diffLabelMap = { facil: "Fácil", media: "Media", dificil: "Difícil" };
      diffBadge.textContent = diffLabelMap[pregunta.dificultad] || pregunta.dificultad;
      diffBadge.className = `question-diff question-diff--${pregunta.dificultad}`;
    }

    document.getElementById("question-current").textContent = String(index + 1).padStart(2, "0");
    document.getElementById("question-total").textContent = total;

    const mechTag = document.getElementById("question-mech-tag");
    if (mecanismo) {
      mechTag.style.setProperty("--mech-color", mecanismo.color);
      mechTag.innerHTML = `<svg viewBox="0 0 24 24" fill="none">${svgIcon(mecanismo.icono)}</svg> ${mecanismo.nombre}`;
    } else {
      mechTag.style.removeProperty("--mech-color");
      mechTag.innerHTML = "General";
    }

    document.getElementById("question-text").textContent = pregunta.pregunta;

    const hint = document.getElementById("question-hint");
    hint.textContent =
      config.tipoPregunta === "abierta"
        ? "Escribe tu respuesta con tus propias palabras en el cuaderno o en una hoja."
        : "Escribe el número de la pregunta y la letra de tu respuesta en tu cuaderno o en una hoja.";

    document.getElementById("progress-fill").style.width = `${((index + 1) / total) * 100}%`;
    document.getElementById("timer-flash").classList.add("visually-hidden");

    const optionsEl = document.getElementById("question-options");
    if (optionsEl) {
      optionsEl.innerHTML = "";
      if (pregunta.opciones) {
        Object.entries(pregunta.opciones).forEach(([letra, texto]) => {
          const item = document.createElement("div");
          item.className = "option-item";
          item.innerHTML = `<span class="option-item__letter">${letra}</span><span class="option-item__text">${texto}</span>`;
          optionsEl.appendChild(item);
        });
      }
    }

    const nextBtn = document.getElementById("btn-siguiente");
    nextBtn.textContent = index + 1 === total ? "Terminar quiz →" : "Siguiente pregunta →";
  }

  function renderResult(stats, config) {
    document.getElementById("result-subtitle").textContent =
      `${stats.total} / ${stats.total} preguntas completadas`;

    const scoreBlock = document.getElementById("result-score-block");
    scoreBlock.style.display = config.mostrarPuntuacion ? "flex" : "none";
  }

  function renderAnswerKey(preguntas, config) {
    const wrap = document.getElementById("answer-key-wrap");
    const list = document.getElementById("answer-key-list");
    if (!wrap || !list) return;

    if (config.tipoPregunta === "abierta") {
      wrap.style.display = "none";
      return;
    }
    wrap.style.display = "flex";

    list.innerHTML = preguntas
      .map(
        (p, i) =>
          `<div class="answer-key__item">Pregunta ${String(i + 1).padStart(2, "0")}: <b>${p.respuestaCorrecta || "—"}</b></div>`
      )
      .join("");

    const toggleBtn = document.getElementById("btn-toggle-answers");
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const hidden = list.hasAttribute("hidden");
        if (hidden) list.removeAttribute("hidden");
        else list.setAttribute("hidden", "");
        toggleBtn.textContent = hidden ? "📋 Ocultar hoja de respuestas" : "📋 Ver hoja de respuestas";
      };
    }
  }

  function updateManualScore(scoreData) {
    document.getElementById("score-value").textContent = scoreData.correctas;
    document.getElementById("stat-correctas").textContent = scoreData.correctas;
    document.getElementById("stat-incorrectas").textContent = scoreData.incorrectas;
    document.getElementById("stat-porcentaje").textContent = `${scoreData.porcentaje}%`;
    document.getElementById("xp-text").textContent = `${scoreData.xp} / ${scoreData.xpMax} XP`;
    document.getElementById("xp-fill").style.width =
      `${scoreData.xpMax > 0 ? (scoreData.xp / scoreData.xpMax) * 100 : 0}%`;
    document.getElementById("result-message").textContent = QuizScore.mensajePorPorcentaje(scoreData.porcentaje);
  }

  return { showStage, renderConfigStage, renderQuestion, renderResult, renderAnswerKey, updateManualScore };
})();
