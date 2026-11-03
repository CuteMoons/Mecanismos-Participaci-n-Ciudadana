const {launch,BASE,ok,newPage,sleep,results,alumno}=require('./common');
(async()=>{
const b=await launch();
const p=await newPage(b);
await p.goto(BASE+'pages/crucigrama.html');
const stage=()=>p.evaluate(()=>document.querySelector('.crossword-stage.is-active').dataset.stage);
ok('Inicia en introducción',await stage()==='intro');
await p.click('#btn-comenzar-crucigrama');
ok('Aparece selector de modo antes de jugar',await stage()==='role');
// ---- ALUMNO ----
await alumno(p);
ok('Alumno: config sin modalidad ni tiempo',await p.evaluate(()=>document.getElementById('cw-group-modalidad').hidden&&document.getElementById('cw-group-tiempo').hidden));
await p.click('#btn-iniciar-crucigrama');
ok('Alumno: juego iniciado',await stage()==='game');
ok('Alumno: sin controles de maestro en el DOM',await p.evaluate(()=>document.getElementById('cw-teacher-panel').children.length===0&&!document.getElementById('btn-cw-pausa')&&!document.getElementById('cw-solucion')));
// pistas sin revelar
const leak=await p.evaluate(()=>{
  const titulo=document.getElementById('cw-version-badge').textContent.replace('📚 ','').trim();
  const v=CROSSWORD_VERSIONS.find(x=>x.titulo===titulo);
  const words=(v?v.words:CROSSWORD_WORDS).map(w=>w.word.toLowerCase());
  const norm=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const txt=norm(document.querySelector('.crossword-clues').innerText+' '+document.getElementById('cw-active-clue').innerText);
  const found=words.filter(w=>new RegExp('\\b'+w+'\\b').test(txt));
  const letters=[...document.querySelectorAll('.cw-cell__input')].filter(i=>i.value).length;
  return {titulo,found,letters,cards:document.querySelectorAll('.mech-select-card').length,names:/Tutela|Referendo|Plebiscito/.test(document.getElementById('crossword-shell').innerText)&&!v};
});
ok('Pistas sin respuestas y casillas vacías',leak.found.length===0&&leak.letters===0&&leak.cards===0,JSON.stringify(leak));
ok('Ningún nombre de mecanismo visible en el juego',!leak.names,JSON.stringify(leak));
// datos del tablero desde el DOM
const info=await p.evaluate(()=>[...document.querySelectorAll('.cw-cell:not(.cw-cell--block)')].map(c=>({r:+c.dataset.row,c:+c.dataset.col,l:c.querySelector('input').getAttribute('aria-label')})));
const shared=info.filter(x=>/ y /.test(x.l)),single=info.filter(x=>!/ y /.test(x.l));
ok('Hay casillas compartidas',shared.length>0);
const clickCell=async(r,c)=>{await p.click(`.cw-cell[data-row="${r}"][data-col="${c}"]`)};
const dir=()=>p.evaluate(()=>document.getElementById('cw-board').dataset.dir);
const activeTxt=()=>p.evaluate(()=>document.querySelector('.active-clue__dir').textContent);
// casilla de una sola palabra
const s1=single[0];await clickCell(s1.r,s1.c);
const expDir=/horizontal/.test(s1.l)?'across':'down';
ok('Casilla de una palabra → selecciona esa palabra ('+expDir+')',await dir()===expDir);
// casilla compartida: alternar
const sh=shared[0];await clickCell(sh.r,sh.c);const d1=await dir();
await clickCell(sh.r,sh.c);const d2=await dir();
await clickCell(sh.r,sh.c);const d3=await dir();
ok('Casilla compartida: clic repetido alterna dirección',d1!==d2&&d1===d3,[d1,d2,d3].join());
ok('Pista activa visible con número y dirección',/\d+ [→↓]/.test(await activeTxt()));
// botón de dirección accesible
const before=await dir();await p.click('#btn-cw-direction');
ok('Control accesible cambia dirección',await dir()!==before);
// Espacio alterna
const b2=await dir();await p.keyboard.press('Space');ok('Espacio alterna dirección',await dir()!==b2);
// Escritura: solo palabra activa
const wordCells=await p.evaluate(()=>[...document.querySelectorAll('.cw-cell.is-active-word')].map(c=>c.dataset.row+','+c.dataset.col));
const sel0=await p.evaluate(()=>{const c=document.querySelector('.cw-cell.is-selected');return c.dataset.row+','+c.dataset.col});
await p.keyboard.press('a');await p.keyboard.press('b');
const filled=await p.evaluate(()=>[...document.querySelectorAll('.cw-cell')].filter(c=>c.querySelector('input')&&c.querySelector('input').value).map(c=>c.dataset.row+','+c.dataset.col));
ok('Escribir solo rellena casillas de la palabra activa',filled.length>=1&&filled.every(f=>wordCells.includes(f)),JSON.stringify({filled,wordCells}));
const dirAfter=await dir();
// Flechas a lo largo de la palabra activa: no cambian la palabra
const along=(await dir())==='across'?['ArrowLeft','ArrowRight']:['ArrowUp','ArrowDown'];
await p.keyboard.press(along[0]);await p.keyboard.press(along[1]);
const wordCells2=await p.evaluate(()=>[...document.querySelectorAll('.cw-cell.is-active-word')].map(c=>c.dataset.row+','+c.dataset.col));
ok('Flechas a lo largo de la palabra no cambian la palabra activa',JSON.stringify(wordCells)===JSON.stringify(wordCells2)&&await dir()===dirAfter);
// Backspace determinista: seleccionar una pista, escribir 2 letras y borrar
const vals=()=>p.evaluate(()=>[...document.querySelectorAll('.cw-cell')].filter(c=>c.querySelector('input')).map(c=>c.querySelector('input').value||'.').join(''));
const cellsOfActive=()=>p.evaluate(()=>[...document.querySelectorAll('.cw-cell.is-active-word')].map(c=>(c.classList.contains('is-selected')?'[':'')+(c.querySelector('input').value||'.')+(c.classList.contains('is-selected')?']':'')+(c.querySelector('input').readOnly?'L':'')).join(' '));
await p.click('.clue-item');
// limpiar la palabra
const base=await vals();
await p.keyboard.press('q');await p.keyboard.press('w');
const w2=await cellsOfActive();
console.log('DBG before-bksp:',w2);ok('Escribir avanza dentro de la palabra',/Q.*W/.test(w2.replace(/[\[\]L ]/g,'')),w2);
await p.keyboard.press('Backspace');
const w3=await cellsOfActive();
console.log('DBG after-bksp1:',w3);ok('Backspace (casilla vacía) borra la letra anterior sin saltos',!w3.replace(/[\[\] ]/g,'').includes('W'),w3);
await p.keyboard.press('Backspace');
const w4=await cellsOfActive();
ok('Backspace de nuevo borra la letra previa',!w4.replace(/[\[\] ]/g,'').includes('W')&&!w4.replace(/[\[\] ]/g,'').includes('Q'),w4);
await p.keyboard.press('Backspace');await p.keyboard.press('Backspace');
ok('Backspace repetido no rompe nada',await p.evaluate(()=>document.querySelectorAll('.cw-cell.is-selected').length===1));
await p.keyboard.press('z');await p.keyboard.press('ArrowLeft').catch(()=>{});
for(let i=0;i<30;i++)await p.keyboard.press('ArrowUp');
for(let i=0;i<30;i++)await p.keyboard.press('ArrowLeft');
const realErrors=()=>p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e));
ok('Flechas contra el borde/huecos no fallan',realErrors().length===0,realErrors().join('|'));
// clic en pista
await p.click('.clue-item');
ok('Clic en pista selecciona su palabra',await p.evaluate(()=>document.querySelectorAll('.cw-cell.is-active-word').length>=2));
// ---- SALIR ----
await p.keyboard.press('x');
const typedBefore=await p.evaluate(()=>[...document.querySelectorAll('.cw-cell__input')].map(i=>i.value).join(''));
const timerBefore=await p.$eval('#cw-timer',e=>e.textContent);
await p.click('#btn-cw-salir');
ok('Salir muestra «¿Salir del juego?»',await p.evaluate(()=>document.getElementById('game-exit-modal').classList.contains('is-open')&&/¿Salir del juego\?/.test(document.getElementById('game-exit-title').textContent)));
ok('Modal con exactamente 2 acciones',await p.evaluate(()=>document.querySelectorAll('#game-exit-modal .modal-confirm__actions button').length===2));
await sleep(450);await p.click('#game-exit-continue');
ok('Continuar cierra y conserva progreso',await p.evaluate(()=>!document.getElementById('game-exit-modal').classList.contains('is-open'))&&await p.evaluate(()=>[...document.querySelectorAll('.cw-cell__input')].map(i=>i.value).join(''))===typedBefore&&await stage()==='game');
await sleep(1300);
ok('Continuar: el reloj sigue corriendo',await p.$eval('#cw-timer',e=>e.textContent)!==timerBefore);
// navegación interna con confirmación
await p.click('.navbar__link[data-page="quiz.html"]');
ok('Enlace del navbar durante partida pide confirmación (no navega)',await p.evaluate(()=>document.getElementById('game-exit-modal').classList.contains('is-open'))&&p.url().includes('crucigrama'));
await p.keyboard.press('Escape');
ok('Escape = Continuar',await p.evaluate(()=>!document.getElementById('game-exit-modal').classList.contains('is-open')));
// Salir confirmado
const ivBefore=await p.evaluate(()=>window.__iv.size);
await p.click('#btn-cw-salir');await sleep(450);await p.click('#game-exit-leave');
await sleep(300);
ok('Salir vuelve a la selección de modo',await stage()==='role');
const after=await p.evaluate(()=>({iv:window.__iv.size,osc:window.__aud.active,board:document.getElementById('cw-board').children.length,clues:document.querySelectorAll('.clue-item').length}));
ok('Sin intervalos activos tras salir',after.iv<ivBefore&&after.iv===0,JSON.stringify(after)+' antes:'+ivBefore);
ok('Sin sonidos activos ni tablero tras salir',after.osc===0&&after.board===0&&after.clues===0,JSON.stringify(after));
const t1=await p.$eval('#cw-timer',e=>e.textContent);await sleep(1300);
ok('Reloj detenido tras salir',await p.$eval('#cw-timer',e=>e.textContent)===t1);
// beforeunload ya no activo y nueva partida limpia
await p.click('.role-card[data-role="maestro"]');
ok('Maestro: config completa',await p.evaluate(()=>!document.getElementById('cw-group-modalidad').hidden&&!document.getElementById('cw-group-tiempo').hidden));
await p.click('#btn-iniciar-crucigrama');
ok('Nueva partida: estado reiniciado (sin letras, puntaje 0)',await p.evaluate(()=>[...document.querySelectorAll('.cw-cell__input')].every(i=>!i.value)&&/0 puntos/.test(document.getElementById('cw-score').textContent)));
ok('Maestro: panel con controles reales',await p.evaluate(()=>!!document.getElementById('btn-cw-pausa')&&!!document.getElementById('btn-cw-solucion')&&!!document.getElementById('btn-cw-terminar')));
ok('Maestro: solución oculta por defecto',await p.evaluate(()=>document.getElementById('cw-solucion').hidden&&document.getElementById('cw-solucion').innerHTML===''));
// pausa
const tp=await p.$eval('#cw-timer',e=>e.textContent);
await p.click('#btn-cw-pausa');await sleep(1400);
ok('Pausa detiene el reloj y cubre el tablero',await p.$eval('#cw-timer',e=>e.textContent)===tp&&await p.evaluate(()=>!document.getElementById('cw-pause-veil').hidden&&document.getElementById('cw-board').inert));
await p.click('#btn-cw-pausa');await sleep(1300);
ok('Reanudar continúa',await p.$eval('#cw-timer',e=>e.textContent)!==tp);
await p.click('#btn-cw-solucion');
ok('Maestro puede consultar la solución',await p.evaluate(()=>!document.getElementById('cw-solucion').hidden&&document.querySelectorAll('#cw-solucion li').length>=5));
await p.click('#btn-cw-terminar');await p.click('#btn-cw-terminar');
ok('Terminar actividad (doble confirmación) → resultado',await stage()==='result');
ok('Tras terminar no hay intervalos',await p.evaluate(()=>window.__iv.size)===0);
// tras resultado se puede navegar sin aviso
const nav=p.waitForNavigation({timeout:5000}).catch(()=>null);
await p.click('.navbar__link[data-page="quiz.html"]');await nav;
ok('Tras el resultado la navegación es libre',p.url().includes('quiz.html'));
ok('Sin errores JS ni rutas rotas (crucigrama)',p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e)).length===0,p.__errors.join('|'));
await b.close();
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,800));process.exit(1)});
