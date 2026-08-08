/**
 * js/quiz/quiz.js
 * Orquesta el flujo completo del quiz: configuración → preguntas → resultado.
 * Este es el único archivo que "conoce" a todos los demás módulos del quiz.
 */

(function initQuiz() {
  if (!document.getElementById("stage-config")) return; // no estamos en quiz.html

  let preguntasPartida = [];
  let indiceActual = 0;
  let pausado = false;
  let timer = null;

  function leerFiltroDeURL() {
    const params = new URLSearchParams(window.location.search);
    const mecanismo = params.get("mecanismo");
    if (mecanismo && obtenerMecanismoPorId(mecanismo)) {
      QuizConfig.set({ mecanismoFiltro: mecanismo });
    }
  }

  function initTimer() {
    timer = crearTemporizador({
      elLabel: document.getElementById("timer-label"),
      elTimer: document.getElementById("timer-wrap"),
      elRing: document.getElementById("timer-ring"),
      elFlash: document.getElementById("timer-flash")
    });
  }

  function mostrarConfig() {
    QuizUI.showStage("config");
    QuizUI.renderConfigStage(QuizConfig.get(), { onLaunch: iniciarPartida });
  }

  function iniciarPartida() {
    const config = QuizConfig.get();
    preguntasPartida = QuizEngine.construirPartida(config);

    if (preguntasPartida.length === 0) {
      alert("No hay preguntas de prueba disponibles para esta combinación de filtros. Ajusta la dificultad o agrega más preguntas en data/preguntas/.");
      return;
    }

    indiceActual = 0;
    QuizUI.showStage("question");
    mostrarPregunta();
  }

  function mostrarPregunta() {
    const config = QuizConfig.get();
    const pregunta = preguntasPartida[indiceActual];
    QuizUI.renderQuestion({
      pregunta,
      index: indiceActual,
      total: preguntasPartida.length,
      config
    });

    timer.setSonido(config.sonido);
    timer.start(config.tiempoSegundos, {
      onEnd: () => {
        setTimeout(avanzar, 1200);
      }
    });
  }

  function avanzar() {
    if (indiceActual + 1 < preguntasPartida.length) {
      indiceActual += 1;
      mostrarPregunta();
    } else {
      finalizarPartida();
    }
  }

  function finalizarPartida() {
    timer.stop();
    const config = QuizConfig.get();
    QuizUI.showStage("result");
    QuizUI.renderResult({ total: preguntasPartida.length }, config);
    QuizUI.renderAnswerKey(preguntasPartida);

    const answerList = document.getElementById("answer-key-list");
    const toggleBtn = document.getElementById("btn-toggle-answers");
    if (answerList) answerList.setAttribute("hidden", "");
    if (toggleBtn) toggleBtn.textContent = "📋 Ver hoja de respuestas";

    let correctas = 0;
    const actualizar = () => {
      const stats = QuizScore.calcular(correctas, preguntasPartida.length);
      QuizUI.updateManualScore(stats);
    };
    actualizar();

    document.getElementById("score-minus").onclick = () => {
      correctas = Math.max(0, correctas - 1);
      actualizar();
    };
    document.getElementById("score-plus").onclick = () => {
      correctas = Math.min(preguntasPartida.length, correctas + 1);
      actualizar();
    };
  }

  function initControles() {
    document.getElementById("btn-siguiente").addEventListener("click", () => {
      timer.stop();
      avanzar();
    });

    document.getElementById("btn-pausar").addEventListener("click", (e) => {
      pausado = !pausado;
      if (pausado) {
        timer.stop();
        e.target.textContent = "▶ Reanudar";
      } else {
        const config = QuizConfig.get();
        // Reanuda con el tiempo restante mostrado actualmente.
        const restanteTexto = document.getElementById("timer-label").textContent;
        const [m, s] = restanteTexto.split(":").map(Number);
        timer.start(m * 60 + s, { onEnd: () => setTimeout(avanzar, 1200) });
        e.target.textContent = "⏸ Pausar";
      }
    });

    const muteBtn = document.getElementById("btn-mute");
    function pintarMute() {
      const activo = QuizConfig.get().sonido;
      muteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none">${svgIcon(activo ? "volume-on" : "volume-x")}</svg> ${activo ? "Sonido activo" : "Silenciado"}`;
      muteBtn.setAttribute("aria-pressed", String(!activo));
    }
    pintarMute();
    muteBtn.addEventListener("click", () => {
      QuizConfig.set({ sonido: !QuizConfig.get().sonido });
      pintarMute();
    });

    document.getElementById("btn-nuevo-quiz").addEventListener("click", () => {
      QuizConfig.reset();
      mostrarConfig();
    });
  }

  leerFiltroDeURL();
  initTimer();
  initControles();
  mostrarConfig();
})();
