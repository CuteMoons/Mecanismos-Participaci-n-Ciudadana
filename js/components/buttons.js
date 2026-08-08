/**
 * js/components/buttons.js
 * Utilidades pequeñas para crear botones consistentes desde JS
 * cuando se generan dinámicamente (por ejemplo, dentro del modal).
 */

function crearBoton({ texto, variante = "primary", tamano = "", icono = null, attrs = {} }) {
  const btn = document.createElement("button");
  btn.className = `btn btn-${variante}${tamano ? " btn-" + tamano : ""}`;
  btn.innerHTML = icono
    ? `<svg viewBox="0 0 24 24" fill="none">${svgIcon(icono)}</svg><span>${texto}</span>`
    : texto;
  Object.entries(attrs).forEach(([key, value]) => btn.setAttribute(key, value));
  return btn;
}
