/**
 * js/quiz/quiz-timer.js
 * Temporizador de cuenta regresiva reutilizado en cada pregunta.
 * No conoce nada del quiz en sí: solo cuenta segundos y dispara callbacks.
 */

function crearTemporizador({ elLabel, elTimer, elRing, elFlash, radio = 82 }) {
  const circunferencia = 2 * Math.PI * radio;
  let total = 0;
  let restante = 0;
  let intervalId = null;
  let sonidoActivo = true;
  let onTick = () => {};
  let onEnd = () => {};

  function formatear(seg) {
    const m = Math.floor(seg / 60).toString().padStart(2, "0");
    const s = (seg % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function pintar() {
    if (elLabel) elLabel.textContent = formatear(restante);
    if (elRing) {
      const progreso = total > 0 ? restante / total : 0;
      elRing.style.strokeDasharray = `${circunferencia}`;
      elRing.style.strokeDashoffset = `${circunferencia * (1 - progreso)}`;
    }
    if (elTimer) {
      elTimer.classList.toggle("is-warning", restante <= Math.max(30, total * 0.3) && restante > 10);
      elTimer.classList.toggle("is-critical", restante <= 10 && restante > 0);
    }
  }

  function start(segundos, callbacks = {}) {
    stop();
    total = segundos;
    restante = segundos;
    onTick = callbacks.onTick || (() => {});
    onEnd = callbacks.onEnd || (() => {});
    pintar();
    intervalId = setInterval(() => {
      restante -= 1;
      pintar();
      onTick(restante);
      if (restante <= 0) {
        stop();
        if (elFlash) elFlash.classList.remove("visually-hidden");
        onEnd();
      }
    }, 1000);
  }

  function stop() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }

  function setSonido(activo) {
    sonidoActivo = activo;
  }

  function isSonidoActivo() {
    return sonidoActivo;
  }

  return { start, stop, setSonido, isSonidoActivo, circunferencia };
}
