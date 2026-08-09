/**
 * js/components/animations.js
 * Anima la entrada de elementos con la clase .reveal cuando entran
 * al viewport, usando IntersectionObserver. Respeta prefers-reduced-motion.
 */

const RCAnimations = (() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let observer = null;

  function getObserver() {
    if (observer) return observer;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    return observer;
  }

  function observe(elements) {
    if (prefersReduced) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = getObserver();
    elements.forEach((el) => obs.observe(el));
  }

  /**
   * Hace aparecer elementos inyectados dinámicamente (tarjetas, listas
   * generadas desde datos, etc.) con una animación de entrada breve,
   * SIN depender de que el usuario haga scroll ni de IntersectionObserver.
   * Se usa para contenido que se crea después de la carga inicial de la
   * página, donde "aparecer al hacer scroll" no es fiable: el elemento
   * puede insertarse ya visible en pantalla y el observer nunca disparar.
   */
  function revealNow(elements, staggerMs = 35) {
    const list = Array.from(elements);
    if (prefersReduced) {
      list.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    list.forEach((el, i) => {
      requestAnimationFrame(() => {
        setTimeout(() => el.classList.add("is-visible"), i * staggerMs);
      });
    });
  }

  function init() {
    observe(document.querySelectorAll(".reveal"));
  }

  return { init, observe, revealNow };
})();

RCAnimations.init();
