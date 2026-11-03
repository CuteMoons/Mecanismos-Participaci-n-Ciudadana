/**
 * js/student.js
 * Identificación del alumno (nombre completo + curso opcional).
 *
 *  - Se pide UNA vez, al elegir «Alumno», y se conserva durante toda la
 *    sesión del navegador (sessionStorage): sirve para todos los juegos y
 *    cuestionarios sin volver a preguntarla, también al cambiar de página.
 *  - Se guarda solo en esta pestaña; no se envía a ningún sitio y se borra
 *    al cerrarla. (No es autenticación: solo rotula los resultados.)
 *  - Si el navegador no permite sessionStorage, se usa memoria de la página.
 *  - Los datos se escriben siempre con textContent (nunca como HTML).
 *
 * API (window.RCStudent):
 *   get() / set({nombre,curso}) / clear() / onChange(fn)
 *   validar(nombre, curso) → { ok, nombre, curso, error }
 *   requerir({ mount, mostrar, volver, continuar })  pide los datos si faltan
 *   pintarResultado(el, rol)   muestra la tarjeta del alumno en los resultados
 *   pintarNotas()              actualiza los avisos «Sesión de …» (data-student-note)
 */
const RCStudent = (() => {
  const KEY = "rc-student";
  const MAX_NOMBRE = 80;
  const MAX_CURSO = 20;
  let memoria = null;
  const oyentes = new Set();

  /** Quita espacios al inicio y al final y junta los espacios repetidos. */
  const limpiar = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

  function validar(nombre, curso) {
    const n = limpiar(nombre);
    const c = limpiar(curso);
    if (!n) return { ok: false, error: "Escribe tu nombre completo para continuar.", campo: "nombre" };
    if (n.length > MAX_NOMBRE) return { ok: false, error: `El nombre es demasiado largo (máximo ${MAX_NOMBRE} caracteres).`, campo: "nombre" };
    if (c.length > MAX_CURSO) return { ok: false, error: `El curso es demasiado largo (máximo ${MAX_CURSO} caracteres).`, campo: "curso" };
    return { ok: true, nombre: n, curso: c };
  }

  function get() {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) {
        const o = JSON.parse(raw);
        const v = validar(o && o.nombre, o && o.curso);   // se revalida lo leído
        if (v.ok) return { nombre: v.nombre, curso: v.curso };
      }
    } catch (_) { /* sin almacenamiento o dato dañado: se usa memoria */ }
    return memoria;
  }

  function set({ nombre, curso }) {
    const v = validar(nombre, curso);
    if (!v.ok) return false;
    memoria = { nombre: v.nombre, curso: v.curso };
    try { window.sessionStorage.setItem(KEY, JSON.stringify(memoria)); } catch (_) { /* queda en memoria */ }
    avisar();
    return true;
  }

  function clear() {
    memoria = null;
    try { window.sessionStorage.removeItem(KEY); } catch (_) { /* nada */ }
    avisar();
  }

  function avisar() {
    pintarNotas();
    oyentes.forEach((fn) => { try { fn(get()); } catch (_) { /* un oyente roto no afecta a los demás */ } });
  }
  const onChange = (fn) => { oyentes.add(fn); return () => oyentes.delete(fn); };

  /** Texto plano para copiar: «Nombre (Curso 11-2)». */
  function etiqueta(est) {
    return est ? (est.curso ? `${est.nombre} (curso ${est.curso})` : est.nombre) : "";
  }

  // ------------------------------------------------------------------
  // Formulario de identificación
  // ------------------------------------------------------------------
  function el(tag, attrs = {}, hijos = []) {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else n.setAttribute(k, v);
    });
    hijos.forEach((h) => n.appendChild(typeof h === "string" ? document.createTextNode(h) : h));
    return n;
  }

  function montarFormulario(mount, { onSubmit, onBack }) {
    mount.innerHTML = "";
    const cabecera = el("div", { class: "section-head", style: "margin-bottom: var(--space-6);" }, [
      el("span", { class: "eyebrow", text: "🎓 Modo alumno" }),
      el("h1", { id: "student-title", tabindex: "-1", text: "¿Quién va a jugar?" }),
      el("p", { class: "text-muted", text: "Escribe tus datos antes de comenzar: aparecerán junto a tus resultados." })
    ]);

    const inpNombre = el("input", {
      id: "student-nombre", name: "nombre", type: "text", autocomplete: "name", maxlength: String(MAX_NOMBRE + 20),
      placeholder: "Escribe tu nombre completo", required: "", "aria-required": "true", "aria-describedby": "student-error"
    });
    const inpCurso = el("input", {
      id: "student-curso", name: "curso", type: "text", autocomplete: "off", maxlength: String(MAX_CURSO + 10),
      placeholder: "Ej. 11-2", inputmode: "text"
    });
    const error = el("p", { id: "student-error", class: "student-error", role: "alert", hidden: "" });

    const campoNombre = el("div", { class: "student-field" }, [
      el("label", { for: "student-nombre" }, ["Nombre completo ", el("span", { class: "student-req", "aria-hidden": "true", text: "*" })]),
      inpNombre
    ]);
    const campoCurso = el("div", { class: "student-field" }, [
      el("label", { for: "student-curso" }, ["Curso o grado ", el("span", { class: "student-opt", text: "(opcional, recomendado)" })]),
      inpCurso
    ]);

    const btnVolver = el("button", { type: "button", class: "btn btn-ghost", "data-sound": "click", text: "← Cambiar de modo" });
    const btnSeguir = el("button", { type: "submit", class: "btn btn-primary btn-lg", "data-sound": "none", text: "Continuar →" });
    const form = el("form", { class: "config-card student-form", novalidate: "", autocomplete: "on" }, [
      campoNombre, campoCurso, error,
      el("div", { class: "config-launch" }, [btnVolver, btnSeguir]),
      el("p", { class: "student-privacy text-muted", text: "Tus datos se guardan solo en esta pestaña mientras uses la página: no se envían a ningún sitio y se borran al cerrarla." })
    ]);
    mount.append(cabecera, form);

    const previo = get();
    if (previo) { inpNombre.value = previo.nombre; inpCurso.value = previo.curso; }

    function mostrarError(v) {
      error.textContent = v.error;
      error.hidden = false;
      inpNombre.setAttribute("aria-invalid", String(v.campo === "nombre"));
      inpCurso.setAttribute("aria-invalid", String(v.campo === "curso"));
      (v.campo === "curso" ? inpCurso : inpNombre).focus();
      if (window.RCSound) RCSound.play("incorrect");
    }
    // El mensaje desaparece en cuanto la persona vuelve a escribir
    [inpNombre, inpCurso].forEach((i) => i.addEventListener("input", () => {
      error.hidden = true; inpNombre.removeAttribute("aria-invalid"); inpCurso.removeAttribute("aria-invalid");
    }));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = validar(inpNombre.value, inpCurso.value);
      if (!v.ok) { mostrarError(v); return; }
      inpNombre.value = v.nombre;                 // se muestra ya limpio
      inpCurso.value = v.curso;
      set({ nombre: v.nombre, curso: v.curso });
      if (window.RCSound) RCSound.play("confirm");
      onSubmit(get());
    });
    btnVolver.addEventListener("click", () => onBack());
    return { enfocar: () => inpNombre.focus({ preventScroll: true }) };
  }

  /**
   * Si el alumno ya se identificó en esta sesión, continúa directamente;
   * si no, muestra la pantalla de identificación y continúa al enviarla.
   * opts = { mount, mostrar(), volver(), continuar() }
   */
  function requerir({ mount, mostrar, volver, continuar }) {
    if (get()) { continuar(); return; }
    const f = montarFormulario(mount, { onSubmit: () => continuar(), onBack: volver });
    mostrar();
    setTimeout(() => f.enfocar(), 30);
  }

  // ------------------------------------------------------------------
  // Resultados y avisos
  // ------------------------------------------------------------------
  /** Tarjeta con el nombre y el curso en la pantalla de resultados (solo rol alumno). */
  function pintarResultado(contenedor, rol) {
    if (!contenedor) return;
    const est = rol === "alumno" ? get() : null;
    contenedor.innerHTML = "";
    contenedor.hidden = !est;
    if (!est) return;
    contenedor.appendChild(el("span", { class: "student-card__icon", "aria-hidden": "true", text: "🎓" }));
    const cuerpo = el("div", { class: "student-card__body" }, [
      el("span", { class: "student-card__label", text: "Alumno" }),
      el("b", { class: "student-card__name", text: est.nombre })
    ]);
    if (est.curso) cuerpo.appendChild(el("span", { class: "student-card__course", text: `Curso: ${est.curso}` }));
    contenedor.appendChild(cuerpo);
  }

  /** Aviso en la pantalla de modos: «Sesión de X · Cambiar alumno». */
  function pintarNotas() {
    const est = get();
    document.querySelectorAll("[data-student-note]").forEach((nota) => {
      nota.innerHTML = "";
      nota.hidden = !est;
      if (!est) return;
      nota.appendChild(document.createTextNode("👤 Sesión de "));
      nota.appendChild(el("b", { text: etiqueta(est) }));
      nota.appendChild(document.createTextNode(" · "));
      nota.appendChild(el("button", { type: "button", class: "student-change", "data-student-change": "", "data-sound": "click", text: "Cambiar alumno" }));
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest("[data-student-change]")) clear();
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pintarNotas);
  else pintarNotas();

  return { get, set, clear, onChange, validar, etiqueta, requerir, pintarResultado, pintarNotas, limpiar };
})();

window.RCStudent = RCStudent;
