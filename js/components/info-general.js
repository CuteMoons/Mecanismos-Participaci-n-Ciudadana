/**
 * js/components/info-general.js
 * Renderiza los bloques de INFO_GENERAL (data/general/info-general.js)
 * dentro de los contenedores que existan en la página actual.
 * Cada bloque es independiente: si el contenedor no existe, se omite.
 */

function renderInfoGeneral() {
  // ---- ¿Qué son? + ¿Por qué son importantes? ----
  const queEsEl = document.getElementById("info-que-es");
  if (queEsEl) queEsEl.textContent = INFO_GENERAL.queEs;

  const importanciaEl = document.getElementById("info-importancia");
  if (importanciaEl) {
    importanciaEl.innerHTML = "";
    INFO_GENERAL.importancia.forEach((item) => {
      const li = document.createElement("li");
      li.className = "importance-item reveal";
      li.innerHTML = `
        <span class="importance-item__icon">
          <svg viewBox="0 0 24 24" fill="none">${svgIcon(item.icono)}</svg>
        </span>
        <span>${item.texto}</span>
      `;
      importanciaEl.appendChild(li);
    });
    if (window.RCAnimations) RCAnimations.observe(importanciaEl.querySelectorAll(".reveal"));
  }

  // ---- Tabla comparativa "¿Para qué sirve cada mecanismo?" ----
  const tablaBody = document.getElementById("info-diferencias-body");
  if (tablaBody) {
    tablaBody.innerHTML = "";
    INFO_GENERAL.diferencias.forEach((fila) => {
      const mecanismo = obtenerMecanismoPorId(fila.mecanismo);
      if (!mecanismo) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <span class="compare-table__mech" style="--mech-color:${mecanismo.color}">
            <svg viewBox="0 0 24 24" fill="none">${svgIcon(mecanismo.icono)}</svg>
            ${mecanismo.nombre}
          </span>
        </td>
        <td>${fila.paraQueSirve}</td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // ---- Derechos que protegen ----
  const derechosEl = document.getElementById("info-derechos");
  if (derechosEl) {
    derechosEl.innerHTML = "";
    INFO_GENERAL.derechosQueProtegen.forEach((derecho) => {
      const chip = document.createElement("span");
      chip.className = "right-chip";
      chip.textContent = derecho;
      derechosEl.appendChild(chip);
    });
  }

  // ---- ¿Quiénes pueden utilizarlos? ----
  const quienesEl = document.getElementById("info-quienes");
  if (quienesEl) quienesEl.textContent = INFO_GENERAL.quienesPuedenUsarlos;

  // ---- Datos curiosos ----
  const curiososEl = document.getElementById("info-datos-curiosos");
  if (curiososEl) {
    curiososEl.innerHTML = "";
    INFO_GENERAL.datosCuriosos.forEach((dato) => {
      const card = document.createElement("div");
      card.className = "fact-card reveal";
      card.innerHTML = `<span class="fact-card__mark">💡</span><p>${dato}</p>`;
      curiososEl.appendChild(card);
    });
    if (window.RCAnimations) RCAnimations.observe(curiososEl.querySelectorAll(".reveal"));
  }

  // ---- Resumen ----
  const resumenEl = document.getElementById("info-resumen");
  if (resumenEl) resumenEl.textContent = INFO_GENERAL.resumen;
}
