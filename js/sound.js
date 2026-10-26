/**
 * js/sound.js
 * Sistema centralizado de efectos sonoros de TODA la página.
 *
 * - Los sonidos se sintetizan con la Web Audio API (sin archivos ni
 *   dependencias): son cortos, suaves y de volumen bajo.
 * - Hay UNA sola preferencia global (activado/desactivado) guardada en
 *   localStorage, compartida por todas las páginas y juegos.
 * - Activado por defecto. Los navegadores no dejan reproducir audio
 *   hasta la primera interacción del usuario; el contexto de audio se
 *   crea/reanuda en el primer gesto (clic, toque o tecla).
 * - Nada de música de fondo: solo efectos de interacción.
 *
 * API pública (window.RCSound):
 *   play(nombre)       reproduce un efecto (ignora duplicados rápidos)
 *   stopAll()          corta de inmediato todo lo que esté sonando
 *   isEnabled()        ¿efectos activados?
 *   setEnabled(bool)   activa/desactiva y guarda la preferencia
 *   toggle()           alterna la preferencia
 *   onChange(fn)       escucha cambios de la preferencia
 *   bindToggles()      sincroniza los botones .sound-toggle del DOM
 */

const RCSound = (() => {
  const STORAGE_KEY = "rc-sound";
  const MASTER_VOLUME = 0.5;      // volumen general (los efectos ya son suaves)
  const SAME_SOUND_GAP_MS = 70;   // mismo efecto: no repetir antes de esto
  const ANY_SOUND_GAP_MS = 25;    // cualquier efecto: evita ráfagas apiladas
  const SEMANTIC_WINDOW_MS = 140; // tras un efecto "con significado", se omite el clic genérico

  let enabled = readPreference();
  let ctx = null;
  let master = null;
  let activeNodes = [];           // osciladores en curso (para stopAll)
  let lastByName = {};
  let lastAnyAt = 0;
  let lastSemanticAt = 0;
  const listeners = new Set();

  // ------------------------------------------------------------------
  // Preferencia persistente
  // ------------------------------------------------------------------
  function readPreference() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "off") return false;
      if (saved === "on") return true;
    } catch (_) { /* almacenamiento no disponible: se usa el valor por defecto */ }
    return true; // activado por defecto
  }

  function savePreference(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value ? "on" : "off"); }
    catch (_) { /* si no se puede guardar, la preferencia vale solo para esta página */ }
  }

  // ------------------------------------------------------------------
  // Contexto de audio (perezoso, solo tras un gesto del usuario)
  // ------------------------------------------------------------------
  function getContext() {
    if (ctx) return ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      ctx = new Ctx();
      master = ctx.createGain();
      master.gain.value = MASTER_VOLUME;
      // Compresor suave: evita saturar si suenan dos efectos a la vez.
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp);
      comp.connect(ctx.destination);
    } catch (_) { ctx = null; }
    return ctx;
  }

  function unlock() {
    if (!enabled) return;
    const c = getContext();
    if (c && c.state === "suspended") { try { c.resume(); } catch (_) { /* nada */ } }
  }

  // ------------------------------------------------------------------
  // Síntesis: una "nota" = oscilador + envolvente corta
  // ------------------------------------------------------------------
  function tone({ freq, freqEnd, start = 0, dur = 0.12, type = "sine", vol = 0.5, attack = 0.008 }) {
    const c = ctx;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
    const ref = { osc, gain };
    activeNodes.push(ref);
    osc.onended = () => {
      activeNodes = activeNodes.filter((n) => n !== ref);
      try { osc.disconnect(); gain.disconnect(); } catch (_) { /* ya desconectado */ }
    };
  }

  // Frecuencias de una escala pentatónica suave (agradable, nada estridente)
  const N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G4: 392, A4: 440, E4: 329.63, C4: 261.63 };

  /**
   * Catálogo de efectos. "semantic: true" marca los que representan un
   * resultado o una acción concreta; el clic genérico se omite justo
   * después de ellos para no sonar doble.
   */
  const SOUNDS = {
    click:   { play: () => tone({ freq: 660, freqEnd: 520, dur: 0.06, vol: 0.22, type: "triangle" }) },
    select:  { play: () => tone({ freq: 740, dur: 0.07, vol: 0.2, type: "sine" }) },
    toggle:  { semantic: true, play: () => { tone({ freq: N.E5, dur: 0.07, vol: 0.22 }); tone({ freq: N.A5, start: 0.06, dur: 0.09, vol: 0.2 }); } },
    confirm: { semantic: true, play: () => { tone({ freq: N.E5, dur: 0.08, vol: 0.24 }); tone({ freq: N.A5, start: 0.07, dur: 0.12, vol: 0.24 }); } },
    start:   { semantic: true, play: () => { tone({ freq: N.C5, dur: 0.1, vol: 0.24 }); tone({ freq: N.E5, start: 0.09, dur: 0.1, vol: 0.24 }); tone({ freq: N.G5, start: 0.18, dur: 0.18, vol: 0.26 }); } },
    correct: { semantic: true, play: () => { tone({ freq: N.G5, dur: 0.1, vol: 0.26 }); tone({ freq: N.C6, start: 0.09, dur: 0.18, vol: 0.26 }); } },
    incorrect: { semantic: true, play: () => { tone({ freq: 294, dur: 0.14, vol: 0.26, type: "triangle" }); tone({ freq: 233, start: 0.12, dur: 0.2, vol: 0.24, type: "triangle" }); } },
    complete: { semantic: true, play: () => { [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => tone({ freq: f, start: i * 0.1, dur: i === 3 ? 0.36 : 0.14, vol: 0.26 })); tone({ freq: N.E6, start: 0.4, dur: 0.3, vol: 0.14 }); } },
    open:    { semantic: true, play: () => tone({ freq: 420, freqEnd: 700, dur: 0.13, vol: 0.2, type: "sine" }) },
    close:   { semantic: true, play: () => tone({ freq: 640, freqEnd: 400, dur: 0.12, vol: 0.18, type: "sine" }) },
    pick:    { semantic: true, play: () => tone({ freq: 520, freqEnd: 600, dur: 0.07, vol: 0.2, type: "triangle" }) },
    drop:    { semantic: true, play: () => { tone({ freq: 300, freqEnd: 200, dur: 0.09, vol: 0.28, type: "triangle" }); } },
    match:   { semantic: true, play: () => { tone({ freq: N.E5, dur: 0.07, vol: 0.22 }); tone({ freq: N.G5, start: 0.06, dur: 0.1, vol: 0.22 }); } },
    unmatch: { semantic: true, play: () => tone({ freq: 480, freqEnd: 360, dur: 0.1, vol: 0.18, type: "triangle" }) },
    exit:    { semantic: true, play: () => { tone({ freq: N.G5, dur: 0.09, vol: 0.2 }); tone({ freq: N.E5, start: 0.08, dur: 0.1, vol: 0.2 }); tone({ freq: N.C5, start: 0.16, dur: 0.16, vol: 0.2 }); } },
    alarm:   { semantic: true, play: () => { tone({ freq: N.A5, dur: 0.12, vol: 0.2 }); tone({ freq: N.A5, start: 0.2, dur: 0.12, vol: 0.2 }); } },
    pause:   { semantic: true, play: () => tone({ freq: 500, freqEnd: 380, dur: 0.1, vol: 0.18 }) },
    resume:  { semantic: true, play: () => tone({ freq: 380, freqEnd: 520, dur: 0.1, vol: 0.18 }) }
  };

  // ------------------------------------------------------------------
  // Reproducción
  // ------------------------------------------------------------------
  function play(name) {
    if (!enabled) return false;
    const def = SOUNDS[name];
    if (!def) return false;
    const now = performance.now();
    if (lastByName[name] && now - lastByName[name] < SAME_SOUND_GAP_MS) return false; // duplicado por pulsación rápida
    if (now - lastAnyAt < ANY_SOUND_GAP_MS && !def.semantic) return false;
    const c = getContext();
    if (!c) return false;
    if (c.state === "suspended") {
      // El navegador aún no permitió audio: se intenta reanudar y se omite este efecto.
      try { c.resume(); } catch (_) { /* nada */ }
      return false;
    }
    lastByName[name] = now;
    lastAnyAt = now;
    if (def.semantic) lastSemanticAt = now;
    try { def.play(); } catch (_) { return false; }
    return true;
  }

  function stopAll() {
    const nodes = activeNodes;
    activeNodes = [];
    nodes.forEach(({ osc, gain }) => {
      try { osc.onended = null; osc.stop(); } catch (_) { /* ya detenido */ }
      try { osc.disconnect(); gain.disconnect(); } catch (_) { /* ya desconectado */ }
    });
  }

  // ------------------------------------------------------------------
  // Preferencia global
  // ------------------------------------------------------------------
  function isEnabled() { return enabled; }

  function applyEnabled(value, { persist }) {
    value = Boolean(value);
    const changed = value !== enabled;
    enabled = value;
    if (persist) savePreference(value);
    if (!enabled) stopAll(); // al desactivar, nada debe seguir sonando
    paintToggles();
    if (changed) listeners.forEach((fn) => { try { fn(enabled); } catch (_) { /* un oyente roto no afecta a los demás */ } });
  }

  function setEnabled(value) { applyEnabled(value, { persist: true }); }

  function toggle() {
    const next = !enabled;
    applyEnabled(next, { persist: true });
    if (next) {
      unlock();
      play("toggle");           // confirma que el audio quedó activo
    }                           // al desactivar no suena nada más
    return next;
  }

  function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  // ------------------------------------------------------------------
  // Botones .sound-toggle (navbar y cualquier otro)
  // ------------------------------------------------------------------
  function paintToggles() {
    document.querySelectorAll(".sound-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(enabled));
      btn.setAttribute("aria-label", enabled ? "Efectos de sonido activados. Pulsa para desactivarlos" : "Efectos de sonido desactivados. Pulsa para activarlos");
      btn.title = enabled ? "Sonido activado" : "Sonido desactivado";
      btn.classList.toggle("is-off", !enabled);
      const on = btn.querySelector(".icon-sound-on");
      const off = btn.querySelector(".icon-sound-off");
      if (on) on.style.display = enabled ? "block" : "none";
      if (off) off.style.display = enabled ? "none" : "block";
      const label = btn.querySelector(".sound-toggle__label");
      if (label) label.textContent = enabled ? "Sonido activado" : "Sonido desactivado";
    });
  }

  function bindToggles() {
    document.querySelectorAll(".sound-toggle").forEach((btn) => {
      if (btn.dataset.soundBound === "1") return;
      btn.dataset.soundBound = "1";
      btn.dataset.sound = "none"; // el botón maneja su propio sonido
      btn.addEventListener("click", () => toggle());
    });
    paintToggles();
  }

  // ------------------------------------------------------------------
  // Sonido genérico de clic (delegado: un solo oyente para toda la página)
  // ------------------------------------------------------------------
  const CLICKABLE = "button, a[href], .pill, .option-card, .role-card, .game-card, [role=\"button\"], summary, input[type=\"checkbox\"], input[type=\"radio\"]";

  function onDocumentClick(e) {
    if (!enabled) return;
    const el = e.target.closest ? e.target.closest(CLICKABLE) : null;
    if (!el || el.disabled || el.getAttribute("aria-disabled") === "true") return;
    const custom = el.closest("[data-sound]");
    if (custom) {
      const val = custom.getAttribute("data-sound");
      if (val === "none") return;
      if (SOUNDS[val]) { play(val); return; }
    }
    // Si el código de la página ya reprodujo un efecto con significado en este clic, no se duplica.
    if (performance.now() - lastSemanticAt < SEMANTIC_WINDOW_MS) return;
    play("click");
  }

  function init() {
    document.addEventListener("click", onDocumentClick);
    // Primer gesto del usuario: crea/reanuda el contexto (política de autoplay).
    ["pointerdown", "keydown", "touchstart"].forEach((evt) =>
      document.addEventListener(evt, unlock, { capture: true, passive: true })
    );
    // Si se cambia la preferencia en otra pestaña, esta se actualiza.
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) applyEnabled(readPreference(), { persist: false });
    });
    // Al ocultar la pestaña se corta cualquier sonido en curso.
    document.addEventListener("visibilitychange", () => { if (document.hidden) stopAll(); });
    // Al salir de la página no queda nada sonando.
    window.addEventListener("pagehide", stopAll);
    bindToggles();
  }

  init();

  return { play, stopAll, isEnabled, setEnabled, toggle, onChange, bindToggles, SOUND_NAMES: Object.keys(SOUNDS) };
})();

window.RCSound = RCSound;
