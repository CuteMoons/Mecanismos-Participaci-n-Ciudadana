/**
 * js/quiz/quiz-timer.js
 * Temporizador de cuenta regresiva basado en el reloj real (Date.now), no
 * en contar ticks: si el navegador retrasa un intervalo, el tiempo restante
 * sigue siendo correcto. Soporta pausa/reanudación conservando lo restante.
 */

function crearTemporizador({ elLabel, elTimer, elRing, elFlash, radio = 82 }) {
  const circunferencia = 2 * Math.PI * radio;
  let totalMs = 0;
  let restanteMs = 0;
  let finEsperado = 0;      // marca de tiempo (ms) en que llegará a 0 mientras corre
  let intervalId = null;
  let corriendo = false;
  let sonidoActivo = true;
  let onTick = () => {};
  let onEnd = () => {};

  function formatear(seg) {
    const m = Math.floor(seg / 60).toString().padStart(2, "0");
    const s = (seg % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function segundosRestantes() {
    return Math.max(0, Math.ceil(restanteMs / 1000));
  }

  function pintar() {
    const seg = segundosRestantes();
    const totalSeg = totalMs / 1000;
    if (elLabel) elLabel.textContent = formatear(seg);
    if (elRing) {
      const progreso = totalMs > 0 ? restanteMs / totalMs : 0;
      elRing.style.strokeDasharray = `${circunferencia}`;
      elRing.style.strokeDashoffset = `${circunferencia * (1 - progreso)}`;
    }
    if (elTimer) {
      elTimer.classList.toggle("is-warning", seg <= Math.max(30, totalSeg * 0.3) && seg > 10);
      elTimer.classList.toggle("is-critical", seg <= 10 && seg > 0);
    }
  }

  function tick() {
    restanteMs = Math.max(0, finEsperado - Date.now());
    pintar();
    onTick(segundosRestantes());
    if (restanteMs <= 0) {
      detener();
      if (elFlash) elFlash.classList.remove("visually-hidden");
      onEnd();
    }
  }

  function detener() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    corriendo = false;
  }

  /** Inicia desde cero con `segundos`. */
  function start(segundos, callbacks = {}) {
    detener();
    totalMs = segundos * 1000;
    restanteMs = totalMs;
    onTick = callbacks.onTick || (() => {});
    onEnd = callbacks.onEnd || (() => {});
    if (elFlash) elFlash.classList.add("visually-hidden");
    pintar();
    reanudar();
  }

  /** Pausa conservando el tiempo restante exacto. */
  function pausar() {
    if (!corriendo) return;
    restanteMs = Math.max(0, finEsperado - Date.now());
    detener();
    pintar();
  }

  /** Continúa desde el tiempo restante (no reinicia). */
  function reanudar() {
    if (corriendo || restanteMs <= 0) return;
    finEsperado = Date.now() + restanteMs;
    corriendo = true;
    intervalId = setInterval(tick, 250);
  }

  /** Detiene y deja el reloj en cero visual, sin disparar onEnd. */
  function stop() {
    detener();
    onTick = () => {};
    onEnd = () => {};
  }

  function reiniciarVisual(segundos) {
    stop();
    totalMs = segundos * 1000;
    restanteMs = totalMs;
    if (elFlash) elFlash.classList.add("visually-hidden");
    pintar();
  }

  return {
    start, pausar, reanudar, stop, reiniciarVisual,
    setSonido: (v) => { sonidoActivo = v; },
    isSonidoActivo: () => sonidoActivo,
    estaCorriendo: () => corriendo,
    restanteSegundos: segundosRestantes,
    circunferencia
  };
}
