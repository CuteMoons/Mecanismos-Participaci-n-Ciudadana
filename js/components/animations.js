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

  function init() {
    observe(document.querySelectorAll(".reveal"));
  }

  return { init, observe };
})();

RCAnimations.init();
