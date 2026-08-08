/**
 * js/components/cards.js
 * Genera tarjetas de mecanismo a partir de MECANISMOS (data/mecanismos).
 * Nunca se escribe HTML de tarjetas a mano: siempre se derivan de los datos.
 */

function crearTarjetaMecanismo(mecanismo) {
  const card = document.createElement("article");
  card.className = "mech-card reveal";
  card.style.setProperty("--mech-color", mecanismo.color);
  card.innerHTML = `
    <div class="mech-card__icon">
      <svg viewBox="0 0 24 24" fill="none">${svgIcon(mecanismo.icono)}</svg>
    </div>
    <h3 class="mech-card__title">${mecanismo.nombre}</h3>
    <p class="mech-card__desc">${mecanismo.descripcionCorta}</p>
    <div class="mech-card__footer">
      <span class="mech-card__tag">Mecanismo</span>
      <button class="mech-card__explore" data-mecanismo-id="${mecanismo.id}">
        Explorar
        <svg viewBox="0 0 24 24" fill="none">${svgIcon("arrow")}</svg>
      </button>
    </div>
  `;
  return card;
}

function renderTarjetasMecanismos(containerSelector, lista = MECANISMOS) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = "";
  lista.forEach((mecanismo) => container.appendChild(crearTarjetaMecanismo(mecanismo)));

  container.querySelectorAll("[data-mecanismo-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mecanismo = obtenerMecanismoPorId(btn.dataset.mecanismoId);
      if (mecanismo) RCModal.open(mecanismo);
    });
  });

  if (window.RCAnimations) RCAnimations.observe(container.querySelectorAll(".reveal"));
}
