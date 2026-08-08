/**
 * js/modal.js
 * Controla el modal que muestra la información detallada de un mecanismo.
 * El HTML del modal se genera dinámicamente a partir de los datos —
 * nunca se escribe información de mecanismos directamente aquí.
 */

const RCModal = (() => {
  let overlay = null;
  let lastFocused = null;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `<div class="modal" role="document"></div>`;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
    return overlay;
  }

  function listItems(items) {
    return items.map((item) => `<li>${item}</li>`).join("");
  }

  function buildContent(mecanismo) {
    return `
      <header class="modal__header">
        <div class="modal__icon" style="--mech-color:${mecanismo.color}">
          <svg viewBox="0 0 24 24" fill="none">${svgIcon(mecanismo.icono)}</svg>
        </div>
        <div class="modal__title-wrap">
          <span class="modal__tag" style="color:${mecanismo.color}">Mecanismo de participación</span>
          <h2 class="modal__title">${mecanismo.nombre}</h2>
        </div>
        <button class="modal__close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none">${svgIcon("close")}</svg>
        </button>
      </header>
      <div class="modal__body" style="--mech-color:${mecanismo.color}">
        <div class="modal__block">
          <h4>¿Qué es?</h4>
          <p>${mecanismo.queEs}</p>
        </div>
        <div class="modal__block">
          <h4>¿Para qué sirve?</h4>
          <p>${mecanismo.paraQueSirve}</p>
        </div>
        <div class="modal__block">
          <h4>¿Quién puede utilizarlo?</h4>
          <p>${mecanismo.quienPuedeUsarlo}</p>
        </div>
        <div class="modal__block">
          <h4>Características</h4>
          <ul>${listItems(mecanismo.caracteristicas)}</ul>
        </div>
        <div class="modal__block">
          <h4>Ejemplo</h4>
          <p>${mecanismo.ejemplo}</p>
        </div>
        <div class="modal__block">
          <h4>Dato histórico</h4>
          <p>${mecanismo.datoHistorico}</p>
        </div>
        <div class="modal__callout">
          <strong>Constitución de 1991:</strong> ${mecanismo.constitucion91}
        </div>
        <div class="modal__block">
          <h4>Datos importantes</h4>
          <ul>${listItems(mecanismo.datosImportantes)}</ul>
        </div>
      </div>
      <footer class="modal__footer">
        <button class="btn btn-primary" data-action="practicar" data-mecanismo-id="${mecanismo.id}">
          Practicar este mecanismo
        </button>
        <button class="btn btn-secondary" data-action="cerrar">Cerrar</button>
      </footer>
    `;
  }

  function open(mecanismo) {
    ensureOverlay();
    lastFocused = document.activeElement;
    overlay.querySelector(".modal").innerHTML = buildContent(mecanismo);
    overlay.classList.add("is-open");
    document.body.classList.add("modal-open");

    overlay.querySelector(".modal__close").addEventListener("click", close);
    overlay.querySelector('[data-action="cerrar"]').addEventListener("click", close);
    overlay.querySelector('[data-action="practicar"]').addEventListener("click", () => {
      const id = mecanismo.id;
      close();
      // Redirige al quiz filtrado por este mecanismo.
      const base = window.location.pathname.includes("/pages/") ? "" : "pages/";
      window.location.href = `${base}quiz.html?mecanismo=${encodeURIComponent(id)}`;
    });

    const closeBtn = overlay.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
  }

  return { open, close };
})();
