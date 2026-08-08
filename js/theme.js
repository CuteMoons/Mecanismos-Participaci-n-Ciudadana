/**
 * js/theme.js
 * Maneja el modo claro/oscuro y su persistencia en localStorage.
 */

const RCTheme = (() => {
  const STORAGE_KEY = "rc-theme";

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document
      .querySelectorAll(".theme-toggle")
      .forEach((btn) => btn.setAttribute("aria-pressed", theme === "dark"));
  }

  function toggle() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    apply(current === "dark" ? "light" : "dark");
  }

  function init() {
    apply(getPreferred());
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", toggle);
    });
  }

  return { init, toggle, apply };
})();

RCTheme.init();
