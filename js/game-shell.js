/**
 * js/game-shell.js
 * Piezas compartidas por los juegos (crucigrama, relacionar):
 *
 *   RCGame.session({ name, onDiscard })
 *     Controla UNA partida: guarda todo lo que hay que limpiar al salir
 *     (intervalos, temporizadores, oyentes), protege contra salidas
 *     accidentales (enlaces internos, botón Atrás, recargar/cerrar) y
 *     muestra el aviso «¿Salir del juego?» con Continuar / Salir.
 *
 *   RCGame.clock({ session, limitSeconds, onTick, onEnd })
 *     Cronómetro/cuenta regresiva con pausa real (basado en el reloj,
 *     no en contar ticks).
 *
 * NOTA SOBRE ROLES: la página es estática (sin servidor). El rol
 * alumno/maestro organiza la interfaz; no es autenticación ni una
 * medida de seguridad (cualquiera puede cambiarlo desde la consola).
 */

const RCGame = (() => {
  const EXIT_TITLE = "¿Salir del juego?";
  const EXIT_TEXT = "Si sales, perderás el progreso actual y tendrás que comenzar una nueva partida.";
  const INERT_REGIONS = ["#navbar-root", "main", "footer.footer"];

  // ------------------------------------------------------------------
  // Aviso de salida (un único modal reutilizado por todos los juegos)
  // ------------------------------------------------------------------
  let modalEl = null;
  let modalState = null; // { onContinue, onLeave, lastFocus }

  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.className = "modal-overlay";
    modalEl.id = "game-exit-modal";
    modalEl.setAttribute("role", "alertdialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-labelledby", "game-exit-title");
    modalEl.setAttribute("aria-describedby", "game-exit-text");
    modalEl.innerHTML = `
      <div class="modal modal--confirm" role="document">
        <div class="modal-confirm__body">
          <h2 class="modal-confirm__title" id="game-exit-title">${EXIT_TITLE}</h2>
          <p id="game-exit-text">${EXIT_TEXT}</p>
        </div>
        <div class="modal-confirm__actions">
          <button type="button" class="btn btn-primary" id="game-exit-continue" data-sound="none">Continuar</button>
          <button type="button" class="btn btn-secondary btn-danger-outline" id="game-exit-leave" data-sound="none">Salir</button>
        </div>
      </div>`;
    document.body.appendChild(modalEl);

    modalEl.querySelector("#game-exit-continue").addEventListener("click", () => closeModal(true));
    modalEl.querySelector("#game-exit-leave").addEventListener("click", () => {
      if (!modalState) return;
      const { onLeave } = modalState;
      closeModal(false);
      onLeave();
    });
    // Clic fuera del cuadro = Continuar (no se pierde nada)
    modalEl.addEventListener("click", (e) => { if (e.target === modalEl) closeModal(true); });
    document.addEventListener("keydown", (e) => {
      if (!modalIsOpen()) return;
      if (e.key === "Escape") { e.preventDefault(); closeModal(true); return; }
      if (e.key === "Tab") {
        const f = [modalEl.querySelector("#game-exit-continue"), modalEl.querySelector("#game-exit-leave")];
        const idx = f.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey ? (idx <= 0 ? f.length - 1 : idx - 1) : (idx + 1) % f.length;
        f[next].focus();
      }
    });
    return modalEl;
  }

  function modalIsOpen() { return Boolean(modalEl && modalEl.classList.contains("is-open")); }

  function setInert(value) {
    INERT_REGIONS.forEach((sel) => document.querySelectorAll(sel).forEach((n) => { n.inert = value; }));
  }

  function openModal({ onContinue, onLeave }) {
    ensureModal();
    if (modalIsOpen()) return;
    modalState = { onContinue, onLeave, lastFocus: document.activeElement };
    modalEl.classList.add("is-open");
    document.body.classList.add("modal-open");
    setInert(true);
    if (window.RCSound) RCSound.play("open");
    modalEl.querySelector("#game-exit-continue").focus();
  }

  /** `continued` = true → «Continuar»: se conserva todo el estado del juego. */
  function closeModal(continued) {
    if (!modalIsOpen()) return;
    const st = modalState;
    modalState = null;
    modalEl.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    setInert(false);
    if (continued) {
      if (window.RCSound) RCSound.play("close");
      if (st && st.lastFocus && document.contains(st.lastFocus) && !st.lastFocus.disabled) st.lastFocus.focus();
      if (st && st.onContinue) st.onContinue();
    }
  }

  // ------------------------------------------------------------------
  // Sesión de juego
  // ------------------------------------------------------------------
  function session({ name = "juego", onDiscard = () => {} } = {}) {
    let active = false;
    let pushedState = false;
    let tracked = [];        // { clear() } de todo lo creado durante la partida
    let pendingHref = null;

    function track(clear) {
      const entry = { clear: () => { tracked = tracked.filter((t) => t !== entry); clear(); } };
      tracked.push(entry);
      return entry;
    }

    const api = {
      /** setInterval que se limpia solo al terminar/salir. Devuelve un objeto con clear(). */
      interval(fn, ms) {
        const id = setInterval(fn, ms);
        return track(() => clearInterval(id));
      },
      timeout(fn, ms) {
        let entry = null;
        const id = setTimeout(() => { if (entry) tracked = tracked.filter((t) => t !== entry); fn(); }, ms);
        entry = track(() => clearTimeout(id));
        return entry;
      },
      /** addEventListener que se retira solo al terminar/salir. */
      listen(target, type, fn, opts) {
        target.addEventListener(type, fn, opts);
        return track(() => target.removeEventListener(type, fn, opts));
      },
      /** Cualquier limpieza propia (p. ej. quitar un elemento temporal). */
      onCleanup(fn) { return track(fn); },
      isActive: () => active,

      /** La partida comienza: se activan las protecciones. */
      start() {
        api.dispose();      // por si quedaba algo de una partida anterior
        active = true;
        api.listen(window, "beforeunload", (e) => {
          if (!active) return;
          e.preventDefault();
          e.returnValue = "";
        });
        api.listen(window, "popstate", () => {
          if (!active) return;
          history.pushState({ rcGuard: name }, "");
          pushedState = true;
          api.requestExit();
        });
        // Enlaces internos (navbar, logo, pie de página…): piden confirmación.
        api.listen(document, "click", (e) => {
          if (!active || e.defaultPrevented) return;
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          const a = e.target.closest && e.target.closest("a[href]");
          if (!a || a.closest("#game-exit-modal")) return;
          const href = a.getAttribute("href");
          if (!href || href.startsWith("#") || href.startsWith("javascript:") || a.target === "_blank" || a.hasAttribute("data-allow-leave")) return;
          e.preventDefault();
          api.requestExit(a.href);
        }, true);
        if (!(history.state && history.state.rcGuard === name)) {
          history.pushState({ rcGuard: name }, "");
          pushedState = true;
        }
      },

      /** La partida terminó con normalidad (pantalla de resultado): se quitan las protecciones. */
      end() {
        active = false;
        api.dispose();
      },

      /** Libera TODO lo de la partida: intervalos, temporizadores y oyentes. */
      dispose() {
        const copy = tracked.slice();
        copy.forEach((t) => { try { t.clear(); } catch (_) { /* nada */ } });
        tracked = [];
        active = false;
        if (pushedState) {
          pushedState = false;
          // Quita la entrada de historial que se añadió para capturar «Atrás».
          if (history.state && history.state.rcGuard === name) {
            try { history.back(); } catch (_) { /* nada */ }
          }
        }
      },

      /** Muestra «¿Salir del juego?». `href` = destino si venía de un enlace. */
      requestExit(href) {
        if (!active) {
          if (href) window.location.href = href;
          return;
        }
        pendingHref = href || null;
        openModal({
          onContinue: () => { pendingHref = null; },
          onLeave: () => {
            const destino = pendingHref;
            pendingHref = null;
            // 1) se corta todo sonido que estuviera sonando
            if (window.RCSound) { RCSound.stopAll(); RCSound.play("exit"); }
            // 2) se liberan temporizadores, intervalos y oyentes
            const quitarGuarda = pushedState && history.state && history.state.rcGuard === name;
            pushedState = false;               // dispose() no vuelve a tocar el historial
            active = false;
            api.dispose();
            if (quitarGuarda && !destino) {
              // se retira la entrada de guarda para que «Atrás» funcione normal
              try { history.back(); } catch (_) { /* nada */ }
            }
            // 3) se descarta el estado y se vuelve a la pantalla de inicio/selección
            onDiscard();
            if (destino) window.location.href = destino;
          }
        });
      }
    };
    return api;
  }

  // ------------------------------------------------------------------
  // Cronómetro / cuenta regresiva con pausa
  // ------------------------------------------------------------------
  function formatTime(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  function clock({ session: sess, limitSeconds = 0, onTick = () => {}, onEnd = () => {} }) {
    let elapsedMs = 0;
    let running = false;
    let last = 0;
    let handle = null;
    const unlimited = limitSeconds <= 0;

    function advance() {
      if (!running) return;
      const now = performance.now();
      elapsedMs += now - last;
      last = now;
    }
    function info() {
      const elapsed = Math.floor(elapsedMs / 1000);
      const remaining = unlimited ? 0 : Math.max(0, Math.ceil((limitSeconds * 1000 - elapsedMs) / 1000));
      return { elapsed, remaining, unlimited, shown: unlimited ? elapsed : remaining };
    }
    function tick() {
      advance();
      if (!unlimited && elapsedMs >= limitSeconds * 1000) {
        elapsedMs = limitSeconds * 1000;
        stop();
        onTick(info());
        onEnd();
        return;
      }
      onTick(info());
    }
    function resume() {
      if (running) return;
      running = true;
      last = performance.now();
      handle = sess ? sess.interval(tick, 250) : { clear: (() => { const id = setInterval(tick, 250); return () => clearInterval(id); })() };
      onTick(info());
    }
    function pause() {
      if (!running) return;
      advance();
      running = false;
      if (handle) handle.clear();
      handle = null;
      onTick(info());
    }
    function stop() {
      advance();
      running = false;
      if (handle) handle.clear();
      handle = null;
    }
    function start() {
      stop();
      elapsedMs = 0;
      resume();
    }
    return { start, pause, resume, stop, info, isRunning: () => running, isUnlimited: () => unlimited };
  }

  return { session, clock, formatTime, isExitModalOpen: modalIsOpen };
})();

window.RCGame = RCGame;
