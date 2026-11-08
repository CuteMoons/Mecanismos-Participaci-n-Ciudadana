/**
 * js/minigames/mini-core.js
 * Piezas comunes de los juegos «¿Qué harías en esta situación?», «Memoria de
 * conceptos» y «Ruleta de preguntas». Reutiliza lo que ya existe:
 *   RCGame (sesión y salida segura), RCStudent (identificación),
 *   RCSound (audio global) y calcularCalificacion (js/grading.js).
 * Aquí solo vive lo que los tres juegos comparten: etapas, flujo de modo,
 * panel del maestro, pregunta de opción múltiple y pantalla de resultados.
 * Todo texto se escribe con textContent (nunca como HTML).
 */
const RCMini = (() => {
  const LETRAS = ["A", "B", "C", "D"];
  const $ = (id) => document.getElementById(id);

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
  const sonar = (nombre) => { if (typeof window !== "undefined" && window.RCSound) window.RCSound.play(nombre); };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const sample = (arr, n) => shuffle(arr).slice(0, n);

  /** Recorta un texto largo para listas de repaso. */
  const recortar = (t, n = 110) => (t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t);

  function showStage(name) {
    document.querySelectorAll(".mg-stage").forEach((s) => s.classList.toggle("is-active", s.dataset.stage === name));
    try { window.scrollTo(0, 0); } catch (_) { /* nada */ }
  }

  function pillGroup(cont, opciones, valor, onChange) {
    cont.innerHTML = "";
    opciones.forEach((op) => {
      const b = el("button", { type: "button", class: "pill" + (op.value === valor ? " is-selected" : ""), "aria-pressed": String(op.value === valor), text: op.label });
      b.addEventListener("click", () => {
        cont.querySelectorAll(".pill").forEach((p) => { p.classList.remove("is-selected"); p.setAttribute("aria-pressed", "false"); });
        b.classList.add("is-selected");
        b.setAttribute("aria-pressed", "true");
        onChange(op.value);
      });
      cont.appendChild(b);
    });
  }

  /**
   * Flujo común: introducción → modo → (identificación | configuración del maestro) → juego.
   * c = { getRol, setRol, renderConfig(), iniciar() }
   */
  function bindFlow(c) {
    $("mg-btn-comenzar").addEventListener("click", () => showStage("role"));
    $("mg-role-grid").addEventListener("click", (e) => {
      const card = e.target.closest(".role-card");
      if (!card) return;
      const rol = card.dataset.role === "maestro" ? "maestro" : "alumno";
      c.setRol(rol);
      if (rol === "alumno") {
        RCStudent.requerir({
          mount: $("student-mount"),
          mostrar: () => showStage("ident"),
          volver: () => { c.setRol(null); showStage("role"); },
          continuar: () => c.iniciar()
        });
      } else { c.renderConfig(); showStage("config"); }
    });
    $("mg-btn-cambiar-rol").addEventListener("click", () => { c.setRol(null); showStage("role"); });
    $("mg-btn-iniciar").addEventListener("click", () => c.iniciar());
    $("mg-btn-nuevo").addEventListener("click", () => {
      if (c.getRol() === "maestro") { c.renderConfig(); showStage("config"); } else c.iniciar();
    });
    showStage("intro");
  }

  /** Panel del maestro: pausar/reanudar y terminar (con doble pulsación). */
  function panelMaestro(panel, sess, { rol, onPausa, onTerminar }) {
    panel.innerHTML = "";
    panel.hidden = rol !== "maestro";
    if (rol !== "maestro") return;
    const btnPausa = el("button", { type: "button", class: "btn btn-ghost", id: "mg-btn-pausa", "data-sound": "none", text: "⏸️ Pausar" });
    const btnFin = el("button", { type: "button", class: "btn btn-ghost", id: "mg-btn-terminar", "data-sound": "none", text: "🏁 Terminar y calificar" });
    panel.append(
      el("span", { class: "teacher-panel__label", text: "🧑‍🏫 Controles del maestro" }),
      el("div", { class: "teacher-panel__actions" }, [btnPausa, btnFin])
    );
    let pausado = false;
    sess.listen(btnPausa, "click", () => {
      pausado = !pausado;
      btnPausa.textContent = pausado ? "▶️ Reanudar" : "⏸️ Pausar";
      sonar(pausado ? "pause" : "resume");
      onPausa(pausado);
    });
    let armado = null;
    sess.listen(btnFin, "click", () => {
      if (armado) { armado.clear(); armado = null; onTerminar(); return; }
      btnFin.textContent = "¿Seguro? Pulsa de nuevo";
      sonar("open");
      armado = sess.timeout(() => { armado = null; btnFin.textContent = "🏁 Terminar y calificar"; }, 3500);
    });
  }

  /** Congela la zona de juego y muestra el velo de pausa. */
  function setPausa(area, veil, pausado) {
    area.inert = pausado;
    veil.hidden = !pausado;
  }

  function valoracion(nota) {
    if (nota >= 4.5) return { badge: "🏆", titulo: "¡Excelente trabajo!" };
    if (nota >= 3.0) return { badge: "🎉", titulo: "¡Buen trabajo!" };
    return { badge: "💪", titulo: "¡Sigue practicando!" };
  }

  /**
   * Pregunta de opción múltiple con retroalimentación.
   * q = { situacion?, pregunta?, texto?, opciones[], correcta (índice), explicacion }
   */
  function renderPregunta(cont, q, { etiqueta, textoSiguiente, onAnswer, onNext }) {
    cont.innerHTML = "";
    const orden = shuffle(q.opciones.map((t, i) => ({ t, ok: i === q.correcta })));
    const root = el("div", { class: "mg-q" });
    if (etiqueta) root.appendChild(el("span", { class: "mg-q__tag", text: etiqueta }));
    if (q.situacion) root.appendChild(el("p", { class: "mg-q__situation", text: q.situacion }));
    const titulo = q.pregunta || q.texto;
    if (titulo) root.appendChild(el("h3", { class: "mg-q__text", text: titulo }));

    const lista = el("div", { class: "mg-options", role: "group", "aria-label": "Opciones de respuesta" });
    const feedback = el("div", { class: "mg-feedback", "aria-live": "polite", hidden: "" });
    const btnNext = el("button", { type: "button", class: "btn btn-primary", "data-sound": "none", hidden: "", text: textoSiguiente || "Siguiente →" });
    let respondida = false;
    const botones = orden.map((o, i) => {
      const letra = el("span", { class: "option-item__letter", "aria-hidden": "true", text: LETRAS[i] });
      const tag = el("span", { class: "option-item__tag" });
      const b = el("button", { type: "button", class: "option-item option-item--btn", "data-sound": "none" }, [letra, el("span", { class: "option-item__text", text: o.t }), tag]);
      lista.appendChild(b);
      return { b, tag, ok: o.ok, letra: LETRAS[i], texto: o.t };
    });
    botones.forEach((x) => x.b.addEventListener("click", () => {
      if (respondida) return;
      respondida = true;
      botones.forEach((y) => { y.b.disabled = true; y.b.classList.add("is-locked"); });
      const correctaBtn = botones.find((y) => y.ok);
      correctaBtn.b.classList.add("is-correct");
      correctaBtn.tag.textContent = "✓ Respuesta correcta";
      if (!x.ok) { x.b.classList.add("is-wrong"); x.tag.textContent = "✗ Tu respuesta"; }
      feedback.hidden = false;
      feedback.className = "mg-feedback " + (x.ok ? "is-correct" : "is-wrong");
      feedback.innerHTML = "";
      feedback.appendChild(el("b", { text: x.ok ? "✅ ¡Correcto!" : `❌ Incorrecto. La respuesta correcta es la ${correctaBtn.letra}.` }));
      feedback.appendChild(document.createTextNode(q.explicacion));
      sonar(x.ok ? "correct" : "incorrect");
      btnNext.hidden = false;
      btnNext.focus();
      onAnswer(x.ok, { correctaTexto: correctaBtn.texto });
    }));
    btnNext.addEventListener("click", () => { sonar("click"); onNext(); });
    root.append(lista, feedback, el("div", { class: "mg-q__actions" }, [btnNext]));
    cont.appendChild(root);
  }

  /** Pantalla de resultados común. stats = [{ valor, etiqueta }], repaso = { titulo, items:[{texto, detalle}] } */
  function mostrarResultado({ rol, badge, titulo, nota, stats, repaso }) {
    $("mg-result-badge").textContent = badge;
    $("mg-result-title").textContent = titulo;
    $("mg-result-note").textContent = nota || "";
    const cont = $("mg-result-stats");
    cont.innerHTML = "";
    stats.forEach((s) => cont.appendChild(el("div", { class: "result-stat" }, [el("b", { text: s.valor }), el("span", { text: s.etiqueta })])));
    const rev = $("mg-review");
    rev.innerHTML = "";
    rev.hidden = !(repaso && repaso.items && repaso.items.length);
    if (!rev.hidden) {
      rev.appendChild(el("h3", { text: repaso.titulo }));
      const ul = el("ul");
      repaso.items.forEach((it) => ul.appendChild(el("li", {}, [el("b", { text: it.texto }), it.detalle ? ` — ${it.detalle}` : ""])));
      rev.appendChild(ul);
    }
    RCStudent.pintarResultado($("mg-student-result"), rol);
    showStage("result");
  }

  /** Revisión de integridad de una pregunta (la usan las pruebas). */
  function validarPregunta(q) {
    const e = [];
    if (!q.id) e.push("sin id");
    if (!(q.situacion || q.texto)) e.push("sin enunciado");
    if (!Array.isArray(q.opciones) || q.opciones.length < 3 || q.opciones.length > 4) e.push("debe tener 3 o 4 opciones");
    else {
      if (new Set(q.opciones).size !== q.opciones.length) e.push("opciones repetidas");
      if (!Number.isInteger(q.correcta) || q.correcta < 0 || q.correcta >= q.opciones.length) e.push("índice de respuesta correcta inválido");
    }
    if (!q.explicacion || q.explicacion.length < 20) e.push("sin explicación");
    return e;
  }

  return { $, el, sonar, shuffle, sample, recortar, showStage, pillGroup, bindFlow, panelMaestro, setPausa, valoracion, renderPregunta, mostrarResultado, validarPregunta, LETRAS };
})();

if (typeof window !== "undefined") window.RCMini = RCMini;
if (typeof module !== "undefined") module.exports = RCMini;
