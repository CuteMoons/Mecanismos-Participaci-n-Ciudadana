/**
 * js/components/navbar.js
 * Componente reutilizable de navegación. Se inyecta en cualquier
 * página que tenga un contenedor <div id="navbar-root" data-base="..."></div>
 * data-base indica la ruta relativa hacia la raíz del proyecto
 * ("" en index.html, "../" en páginas dentro de /pages).
 */

function renderNavbar() {
  const root = document.getElementById("navbar-root");
  if (!root) return;

  const base = root.dataset.base || "";
  const page = window.location.pathname.split("/").pop() || "index.html";

  root.innerHTML = `
    <nav class="navbar">
      <div class="navbar__inner">
        <a class="navbar__brand" href="${base}index.html">
          <img
            class="navbar__logo"
            src="${base}assets/logo/logo-colegio.png"
            alt="Escudo de la Institución Educativa José Antonio Aguilera"
            onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'navbar__logo-placeholder', textContent:'JAA'}))"
          />
          <span class="navbar__school">
            José Antonio Aguilera
            <small>Participación Ciudadana</small>
          </span>
        </a>

        <button class="navbar__burger" aria-label="Abrir menú" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <ul class="navbar__links">
          <li><a class="navbar__link" data-page="index.html" href="${base}index.html">Inicio</a></li>
          <li><a class="navbar__link" data-page="aprender.html" href="${base}pages/aprender.html">Aprender</a></li>
          <li><a class="navbar__link" data-page="quiz.html" href="${base}pages/quiz.html">Quiz</a></li>
          <li><a class="navbar__link" data-page="crucigrama.html" href="${base}pages/crucigrama.html">Crucigrama</a></li>
        </ul>

        <div class="navbar__actions">
          <button class="theme-toggle" aria-label="Cambiar modo claro/oscuro" aria-pressed="false">
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none">${svgIcon("moon")}</svg>
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none">${svgIcon("sun")}</svg>
          </button>
        </div>
      </div>
    </nav>
  `;
}

renderNavbar();
