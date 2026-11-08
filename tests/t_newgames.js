// Pruebas de los tres juegos nuevos: situaciones, memoria y ruleta.
const { launch, BASE, ok, newPage, sleep, alumno, results } = require('./common');
const active = (p) => p.evaluate(() => (document.querySelector('.mg-stage.is-active') || {}).dataset?.stage);
const noOverflow = (p) => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

async function responder(p) { // pulsa la primera opción y luego «siguiente»
  await p.click('.mg-options .option-item');
  await sleep(30);
  const ok1 = await p.evaluate(() => !!document.querySelector('.mg-feedback:not([hidden])') && !!document.querySelector('.option-item.is-correct'));
  await p.click('.mg-q__actions .btn');
  return ok1;
}

(async () => {
  const b = await launch();
  try {
    for (const mobile of [false, true]) {
      const tag = mobile ? '[móvil] ' : '[escritorio] ';
      const vp = mobile ? { width: 375, height: 740, mobile: true } : {};

      // ---------- SITUACIONES ----------
      let p = await newPage(b, vp);
      await p.goto(BASE + 'pages/situaciones.html'); await sleep(200);
      ok(tag + 'situaciones: arranca en introducción con instrucciones', (await active(p)) === 'intro' && await p.$('.mg-rules'));
      await p.click('#mg-btn-comenzar'); await sleep(50);
      ok(tag + 'situaciones: pantalla de modo', (await active(p)) === 'role');
      await alumno(p);
      ok(tag + 'situaciones: alumno entra al juego tras identificarse', (await active(p)) === 'game');
      let total = 0, hechas = 0;
      for (let i = 0; i < 10; i++) {
        const opts = await p.$$eval('.mg-options .option-item', (n) => n.length);
        if (i === 0) ok(tag + 'situaciones: 3 a 4 opciones', opts >= 3 && opts <= 4, String(opts));
        if (await responder(p)) hechas++;
        await sleep(40);
      }
      ok(tag + 'situaciones: 10 preguntas con retroalimentación y respuesta correcta marcada', hechas === 10);
      ok(tag + 'situaciones: termina en resultados', (await active(p)) === 'result');
      const res = await p.evaluate(() => ({
        stats: [...document.querySelectorAll('#mg-result-stats .result-stat')].map((e) => e.innerText.replace(/\n/g, ' ')),
        alumno: document.getElementById('mg-student-result').innerText,
        volver: !!document.querySelector('#mg-result-stats ~ .question-actions a[href="juegos.html"]')
      }));
      const nota = parseFloat(res.stats[0]);
      ok(tag + 'situaciones: nota entre 1.0 y 5.0 con un decimal', nota >= 1 && nota <= 5 && /^\d\.\d\b/.test(res.stats[0]), res.stats[0]);
      ok(tag + 'situaciones: tarjeta del alumno con nombre y curso', /Ana María Pérez/.test(res.alumno) && /11-2/.test(res.alumno));
      ok(tag + 'situaciones: botón volver a Juegos', res.volver);
      if (mobile) ok(tag + 'situaciones: sin desbordamiento horizontal', await noOverflow(p));
      ok(tag + 'situaciones: sin intervalos activos al terminar', await p.evaluate(() => window.__iv.size === 0));

      // salida con confirmación
      await p.click('#mg-btn-nuevo'); await sleep(80);
      ok(tag + 'situaciones: nueva partida sin volver a pedir datos', (await active(p)) === 'game');
      await p.click('#mg-btn-salir'); await sleep(60);
      ok(tag + 'situaciones: salir pide confirmación', await p.evaluate(() => document.getElementById('game-exit-modal').classList.contains('is-open')));
      await p.click('#game-exit-continue'); await sleep(40);
      ok(tag + 'situaciones: «Continuar» conserva la partida', (await active(p)) === 'game');
      await p.click('#mg-btn-salir'); await sleep(40); await p.click('#game-exit-leave'); await sleep(60);
      ok(tag + 'situaciones: «Salir» vuelve a la selección y libera temporizadores', (await active(p)) === 'role' && await p.evaluate(() => window.__iv.size === 0));
      ok(tag + 'situaciones: sin errores de consola', p.__errors.filter((e) => !/ERR_NAME_NOT_RESOLVED|fonts/.test(e)).length === 0, p.__errors.join(' | '));
      await p.close();

      // ---------- MEMORIA ----------
      p = await newPage(b, vp);
      await p.goto(BASE + 'pages/memoria.html'); await sleep(200);
      await p.click('#mg-btn-comenzar'); await sleep(50);
      await alumno(p);
      ok(tag + 'memoria: 12 cartas boca abajo (6 parejas)', (await p.$$eval('.mem-card', (n) => n.length)) === 12 && (await p.$$eval('.mem-card.is-up', (n) => n.length)) === 0);
      // mapa carta -> clave (el DOM no guarda la clave: se deduce por texto con el banco)
      const info = await p.evaluate(() => [...document.querySelectorAll('.mem-card')].map((e, i) => {
        const t = e.querySelector('.mem-face--front').textContent;
        const par = MEMORIA_PARES.find((x) => x.concepto === t || x.definicion === t);
        return { i, id: par.id };
      }));
      // un intento fallido
      const a = info[0], c = info.find((x) => x.id !== a.id);
      await p.evaluate((i, j) => { const cs = document.querySelectorAll('.mem-card'); cs[i].click(); cs[j].click(); }, a.i, c.i);
      await sleep(80);
      ok(tag + 'memoria: dos cartas distintas quedan visibles y se cuenta el intento', (await p.$$eval('.mem-card.is-up', (n) => n.length)) === 2 && /Intentos: 1/.test(await p.$eval('#mg-intentos', (e) => e.textContent)));
      await p.evaluate((k) => document.querySelectorAll('.mem-card')[k].click(), info.find((x) => x !== a && x !== c).i);
      await sleep(80);
      ok(tag + 'memoria: no se puede voltear una tercera carta mientras hay no-coincidencia', (await p.$$eval('.mem-card.is-up', (n) => n.length)) === 2);
      await sleep(1300);
      ok(tag + 'memoria: las no coincidentes vuelven a ocultarse', (await p.$$eval('.mem-card.is-up', (n) => n.length)) === 0);
      // resolver todo
      const grupos = {};
      info.forEach((x) => (grupos[x.id] = grupos[x.id] || []).push(x.i));
      let primera = true;
      for (const id of Object.keys(grupos)) {
        await p.evaluate((i, j) => { const cs = document.querySelectorAll('.mem-card'); cs[i].click(); cs[j].click(); }, grupos[id][0], grupos[id][1]);
        await sleep(60);
        if (primera) { ok(tag + 'memoria: pareja correcta queda visible', (await p.$$eval('.mem-card.is-matched', (n) => n.length)) === 2); primera = false; }
      }
      await sleep(800);
      ok(tag + 'memoria: finaliza al descubrir todas', (await active(p)) === 'result');
      const r2 = await p.evaluate(() => [...document.querySelectorAll('#mg-result-stats .result-stat')].map((e) => e.innerText.replace(/\n/g, ' ')));
      ok(tag + 'memoria: resultados con nota, parejas, intentos y tiempo', r2.length === 4 && /6 \/ 6/.test(r2[1]) && /^\d\.\d/.test(r2[0]) && parseFloat(r2[0]) >= 4, r2.join(' | '));
      if (mobile) ok(tag + 'memoria: sin desbordamiento horizontal en resultados', await noOverflow(p));
      ok(tag + 'memoria: sin intervalos activos', await p.evaluate(() => window.__iv.size === 0));
      ok(tag + 'memoria: sin errores de consola', p.__errors.filter((e) => !/ERR_NAME_NOT_RESOLVED|fonts/.test(e)).length === 0, p.__errors.join(' | '));
      // conjuntos aleatorios distintos
      const firmas = new Set();
      await p.click('#mg-btn-nuevo'); await sleep(60);
      for (let k = 0; k < 6; k++) {
        firmas.add(await p.evaluate(() => [...document.querySelectorAll('.mem-card--concept .mem-face--front')].map((e) => e.textContent).sort().join('|')));
        await p.click('#mg-btn-salir'); await sleep(30); await p.click('#game-exit-leave'); await sleep(40);
        await p.click('.role-card[data-role="alumno"]'); await sleep(80);
      }
      ok(tag + 'memoria: conjuntos de cartas distintos entre partidas', firmas.size >= 3, String(firmas.size));
      await p.close();

      // ---------- RULETA ----------
      p = await newPage(b, vp);
      if (mobile) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);   // giro corto en móvil; en escritorio se prueba el giro completo
      await p.goto(BASE + 'pages/ruleta.html'); await sleep(200);
      await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });   // el desplazamiento suave desplaza los botones mientras se hace clic
      await p.click('#mg-btn-comenzar'); await sleep(50);
      await alumno(p);
      ok(tag + 'ruleta: 6 sectores', (await p.$$eval('#rl-wheel .rl-slice', (n) => n.length)) === 6);
      const vistas = new Set(); const cats = new Set(); let coherente = true;
      for (let i = 0; i < 10; i++) {
        await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await sleep(50);
        await p.click('#rl-btn-girar');
        const desact = await p.$eval('#rl-btn-girar', (e) => e.disabled);
        if (i === 0) ok(tag + 'ruleta: el botón se desactiva mientras gira', desact);
        try { await p.waitForSelector('.mg-q', { timeout: 12000 }); } catch (e) {
          console.log('DIAG giro', i, await p.evaluate(() => ({ st: document.getElementById('rl-status').textContent, dis: document.getElementById('rl-btn-girar').disabled, stage: (document.querySelector('.mg-stage.is-active') || {}).dataset.stage, html: document.getElementById('rl-pregunta').innerHTML.slice(0, 150) })), p.__errors);
          throw e;
        }
        const d = await p.evaluate(() => {
          const rot = parseFloat(document.getElementById('rl-wheel').dataset.rot);
          const idx = Math.floor((((360 - (rot % 360)) % 360)) / 60);
          return { idx, tag: document.querySelector('.mg-q__tag').textContent, q: document.querySelector('.mg-q__text').textContent, cat: RULETA_CATEGORIAS[idx].nombre, icono: RULETA_CATEGORIAS[idx].icono };
        });
        if (!d.tag.includes(d.cat)) coherente = false;
        cats.add(d.cat);
        if (vistas.has(d.q)) coherente = false;
        vistas.add(d.q);
        await p.click('.mg-options .option-item'); await sleep(30);
        await p.click('.mg-q__actions .btn'); await sleep(60);
      }
      ok(tag + 'ruleta: la pregunta corresponde a la categoría donde se detuvo', coherente);
      ok(tag + 'ruleta: 10 preguntas distintas en la partida', vistas.size === 10);
      ok(tag + 'ruleta: termina en resultados', (await active(p)) === 'result');
      const r3 = await p.evaluate(() => [...document.querySelectorAll('#mg-result-stats .result-stat')].map((e) => e.innerText.replace(/\n/g, ' ')));
      ok(tag + 'ruleta: nota 1.0–5.0', parseFloat(r3[0]) >= 1 && parseFloat(r3[0]) <= 5, r3.join(' | '));
      if (mobile) ok(tag + 'ruleta: sin desbordamiento horizontal', await noOverflow(p));
      ok(tag + 'ruleta: sin errores de consola', p.__errors.filter((e) => !/ERR_NAME_NOT_RESOLVED|fonts/.test(e)).length === 0, p.__errors.join(' | '));
      await p.close();
    }

    // ---------- MAESTRO (ruleta) y regresión ----------
    let p = await newPage(b);
    await p.goto(BASE + 'pages/situaciones.html'); await sleep(150);
    await p.click('#mg-btn-comenzar'); await p.click('.role-card[data-role="maestro"]'); await sleep(60);
    ok('maestro: muestra configuración sin pedir identificación', (await active(p)) === 'config');
    await p.click('#mg-config-cantidad .pill:first-child'); await p.click('#mg-btn-iniciar'); await sleep(80);
    ok('maestro: panel con pausa y terminar', !!(await p.$('#mg-btn-pausa')) && !!(await p.$('#mg-btn-terminar')));
    await p.click('#mg-btn-pausa'); await sleep(40);
    ok('maestro: pausa muestra el velo', await p.$eval('#mg-pause-veil', (e) => !e.hidden));
    await p.click('#mg-btn-pausa'); await sleep(40);
    await p.click('#mg-btn-terminar'); await p.click('#mg-btn-terminar'); await sleep(60);
    ok('maestro: terminar lleva a resultados con 5 situaciones', (await active(p)) === 'result' && /0 \/ 5/.test(await p.$eval('#mg-result-stats', (e) => e.innerText)));
    ok('maestro: sin tarjeta de alumno', await p.$eval('#mg-student-result', (e) => e.hidden));
    await p.close();

    p = await newPage(b);
    await p.goto(BASE + 'pages/juegos.html'); await sleep(150);
    const enlaces = await p.$$eval('.game-card', (n) => n.map((a) => a.getAttribute('href')));
    ok('menú: 6 juegos (3 anteriores + 3 nuevos)', enlaces.length === 6 && ['crucigrama.html', 'relacionar.html', 'sopa.html', 'situaciones.html', 'memoria.html', 'ruleta.html'].every((h) => enlaces.includes(h)), enlaces.join());
    for (const h of ['crucigrama', 'relacionar', 'sopa']) {
      const q = await newPage(b);
      await q.goto(BASE + 'pages/' + h + '.html'); await sleep(250);
      ok('regresión: ' + h + ' carga sin errores', q.__errors.filter((e) => !/ERR_NAME_NOT_RESOLVED|fonts/.test(e)).length === 0, q.__errors.join(' | '));
      await q.close();
    }
    await p.close();
  } finally { await b.close(); }
  const f = results().filter((r) => !r.cond).length;
  console.log(f ? `\n${f} FALLOS` : '\nTODO OK (' + results().length + ' comprobaciones)');
  process.exit(f ? 1 : 0);
})();
