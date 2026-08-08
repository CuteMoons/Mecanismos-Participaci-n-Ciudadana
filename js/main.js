/**
 * js/main.js
 * Punto de entrada general. Detecta qué elementos existen en la página
 * actual e inicializa el componente correspondiente. No contiene lógica
 * de negocio: solo conecta datos + componentes ya definidos.
 */

(function initInfoGeneral() {
  if (typeof renderInfoGeneral === "function") renderInfoGeneral();
})();

(function initHomePreview() {
  const grid = document.getElementById("mechanisms-preview");
  if (!grid) return;
  renderTarjetasMecanismos("#mechanisms-preview", MECANISMOS.slice(0, 4));
})();

(function initAprenderPage() {
  const grid = document.getElementById("mechanisms-grid");
  const filterBar = document.getElementById("filter-bar");
  if (!grid) return;

  function renderConFiltro(filtro) {
    const lista = filtro === "todos" ? MECANISMOS : MECANISMOS.filter((m) => m.id === filtro);
    renderTarjetasMecanismos("#mechanisms-grid", lista);
  }

  if (filterBar) {
    filterBar.innerHTML = "";
    const opciones = [{ id: "todos", nombre: "Todos" }, ...MECANISMOS];
    opciones.forEach((op) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip" + (op.id === "todos" ? " is-active" : "");
      chip.textContent = op.nombre;
      chip.addEventListener("click", () => {
        filterBar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        renderConFiltro(op.id);
      });
      filterBar.appendChild(chip);
    });
  }

  renderConFiltro("todos");

  // Si se llega desde un enlace con ?mecanismo=id, abre directamente el modal.
  const params = new URLSearchParams(window.location.search);
  const directo = params.get("mecanismo");
  if (directo) {
    const mecanismo = obtenerMecanismoPorId(directo);
    if (mecanismo) RCModal.open(mecanismo);
  }
})();
