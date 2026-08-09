/**
 * js/components/cards.js
 * Genera las tarjetas interactivas (flip 3D) de cada mecanismo a partir
 * de MECANISMOS (data/mecanismos). El HTML nunca se escribe a mano:
 * siempre se deriva de los datos, para poder agregar un mecanismo nuevo
 * sin tocar este archivo.
 *
 * Estructura de cada tarjeta:
 *   .flip-card                  → contenedor con perspectiva 3D
 *     .flip-card__inner         → capa que rota. Es un div[role="button"]
 *                                  (no un <button>) porque contiene, en
 *                                  el reverso, otro botón real
 *                                  ("Ver información completa"); un
 *                                  <button> no puede anidar otro <button>.
 *       .flip-card__face--front → portada (icono, nombre, "clic para descubrir")
 *       .flip-card__face--back  → reverso (qué es, idea clave, ver más)
 */

function crearTarjetaMecanismo(mecanismo, numero) {
  const wrapper = document.createElement("div");
  wrapper.className = "flip-card reveal";
  wrapper.style.setProperty("--mech-color", mecanismo.color);

  const numeroTexto = String(numero).padStart(2, "0");

  wrapper.innerHTML = `
    <div
      class="flip-card__inner"
      role="button"
      tabindex="0"
      aria-pressed="false"
      aria-label="${mecanismo.nombre}. Presiona para ver el resumen."
    >
      <span class="flip-card__face flip-card__face--front">
        <span class="flip-card__number">${numeroTexto}</span>
        <span class="flip-card__icon">
          <svg viewBox="0 0 24 24" fill="none">${svgIcon(mecanismo.icono)}</svg>
        </span>
        <span class="flip-card__title">${mecanismo.nombre}</span>
        <span class="flip-card__tagline">${mecanismo.ideaClave || ""}</span>
        <span class="flip-card__hint">
          Clic para descubrir
          <svg viewBox="0 0 24 24" fill="none">${svgIcon("arrow")}</svg>
        </span>
      </span>

      <span class="flip-card__face flip-card__face--back">
        <span class="flip-card__back-title">${mecanismo.nombre}</span>
        <span class="flip-card__back-label">¿Qué es?</span>
        <span class="flip-card__back-summary">${mecanismo.resumenCarta || mecanismo.descripcionCorta}</span>
        <span class="flip-card__key-idea">${mecanismo.ideaClave || ""}</span>
        <span class="flip-card__back-footer">
          <span class="flip-card__back-return" aria-hidden="true">↩ Volver</span>
          <button type="button" class="flip-card__back-more" data-mecanismo-id="${mecanismo.id}" tabindex="-1">
            Ver información completa
          </button>
        </span>
      </span>
    </div>
  `;

  return wrapper;
}

/**
 * Gira (o regresa) una tarjeta. Recibe el elemento .flip-card.
 * También administra el foco: el botón "Ver información completa"
 * solo debe ser alcanzable por teclado cuando la carta está abierta,
 * para no atrapar el tabulador en contenido oculto tras la portada.
 */
function flipCard(cardEl) {
  const isFlipped = cardEl.classList.toggle("is-flipped");
  const inner = cardEl.querySelector(".flip-card__inner");
  const moreBtn = cardEl.querySelector(".flip-card__back-more");
  if (inner) inner.setAttribute("aria-pressed", String(isFlipped));
  if (moreBtn) moreBtn.tabIndex = isFlipped ? 0 : -1;
}

function renderTarjetasMecanismos(containerSelector, lista = MECANISMOS) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = "";

  // El número de identificación siempre corresponde al orden oficial
  // en MECANISMOS (no al orden filtrado), así se mantiene estable.
  lista.forEach((mecanismo) => {
    const numero = MECANISMOS.findIndex((m) => m.id === mecanismo.id) + 1;
    container.appendChild(crearTarjetaMecanismo(mecanismo, numero));
  });

  container.querySelectorAll(".flip-card").forEach((cardEl) => {
    const innerBtn = cardEl.querySelector(".flip-card__inner");
    const moreBtn = cardEl.querySelector(".flip-card__back-more");

    innerBtn.addEventListener("click", (e) => {
      // El botón "Ver información completa" maneja su propio clic;
      // evita que también dispare el flip.
      if (e.target.closest(".flip-card__back-more")) return;
      flipCard(cardEl);
    });

    innerBtn.addEventListener("keydown", (e) => {
      if (e.target !== innerBtn) return; // deja que el botón interno maneje su propio Enter/Espacio
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipCard(cardEl);
      }
    });

    if (moreBtn) {
      moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const mecanismo = obtenerMecanismoPorId(moreBtn.dataset.mecanismoId);
        if (mecanismo) RCModal.open(mecanismo);
      });
    }
  });

  if (window.RCAnimations) RCAnimations.revealNow(container.querySelectorAll(".reveal"));
}
