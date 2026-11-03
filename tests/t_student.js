const {launch,BASE,ok,newPage,sleep,results}=require('./common');
const real=p=>p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e));
const BUSCAR=`(() => {const cells=[...document.querySelectorAll('.ws-cell')];const n=+document.getElementById('ws-board').dataset.n;const g=Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>cells[r*n+c].textContent));const words=[...document.querySelectorAll('.ws-word__text')].map(e=>e.textContent);const D=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];const out={};for(const w of words){out[w]=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)for(const [dr,dc] of D){const r2=r+dr*(w.length-1),c2=c+dc*(w.length-1);if(r2<0||c2<0||r2>=n||c2>=n)continue;let ok=true;for(let i=0;i<w.length&&ok;i++)ok=g[r+dr*i][c+dc*i]===w[i];if(ok)out[w].push({r,c,r2,c2})}}return {out,words}})()`;
(async()=>{
const b=await launch();let p=await newPage(b,{width:1280,height:1500});p.on('dialog',d=>d.accept());
const act=sel=>p.evaluate(s=>document.querySelector(s+'.is-active')&&document.querySelector(s+'.is-active').dataset.stage,sel);
const stage=()=>p.evaluate(()=>document.querySelector('[data-stage].is-active').dataset.stage);
// ===== Pantalla de identificación (crucigrama) =====
await p.goto(BASE+'pages/crucigrama.html');
await p.evaluate(()=>sessionStorage.clear());
await p.click('#btn-comenzar-crucigrama');
await p.click('.role-card[data-role="alumno"]');
ok('Alumno → aparece la pantalla de identificación antes de las actividades',await stage()==='ident');
ok('Campos: nombre obligatorio y curso (placeholders y botón Continuar)',await p.evaluate(()=>document.getElementById('student-nombre').required&&document.getElementById('student-nombre').placeholder==='Escribe tu nombre completo'&&document.getElementById('student-curso').placeholder==='Ej. 11-2'&&/Continuar/.test(document.querySelector('.student-form button[type=submit]').textContent)));
// nombre vacío
await p.click('.student-form button[type="submit"]');
ok('Nombre vacío: no deja continuar y muestra el aviso',await stage()==='ident'&&await p.evaluate(()=>!document.getElementById('student-error').hidden&&document.getElementById('student-nombre').getAttribute('aria-invalid')==='true'));
// solo espacios
await p.type('#student-nombre','     ');await p.click('.student-form button[type="submit"]');
ok('Nombre con solo espacios: tampoco deja continuar',await stage()==='ident');
ok('El mensaje desaparece al escribir',await (async()=>{await p.type('#student-nombre','x');return p.evaluate(()=>document.getElementById('student-error').hidden)})());
// no se puede saltar la pantalla: el juego tampoco arranca por otro camino
ok('Sin completar el nombre no se accede a la configuración ni al juego',await p.evaluate(()=>![...document.querySelectorAll('[data-stage="config"].is-active,[data-stage="game"].is-active')].length)&&await p.evaluate(()=>!sessionStorage.getItem('rc-student')));
// nombre con espacios y curso vacío
await p.click('#student-nombre',{clickCount:3});await p.keyboard.press('Backspace');
await p.type('#student-nombre','   María   José  Gómez   ');
await p.keyboard.press('Enter');                     // Enter también envía
await sleep(80);
ok('Se continúa con Enter; curso vacío no impide el acceso',await stage()==='config');
const guard=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('rc-student')));
ok('Espacios sobrantes eliminados al inicio, al final y entre palabras: «'+guard.nombre+'»',guard.nombre==='María José Gómez'&&guard.curso==='');
// Jugar y terminar: resultado con identificación (sin curso)
await p.click('#btn-iniciar-crucigrama');
await p.evaluate(()=>{window.__x=1});
// Terminar rápido como alumno no es posible (sin panel); resolvemos con ayudas
await p.click('.cw-cell:not(.cw-cell--block)');
for(let i=0;i<400;i++){ // revelar palabras hasta completar
  const done=await stage()==='result';if(done)break;
  const n=await p.evaluate(()=>{const b=[...document.querySelectorAll('.clue-item')].find(x=>!x.closest('li').querySelector('.is-solved')&&true);return document.querySelectorAll('.clue-item').length});
  await p.evaluate(i=>{const items=document.querySelectorAll('.clue-item');items[i%items.length].click()},i);
  await p.click('#btn-ayuda');await p.click('#btn-revelar-palabra');
}
ok('Crucigrama terminado → pantalla de resultados',await stage()==='result');
const r1=await p.evaluate(()=>({vis:!document.getElementById('cw-student-result').hidden,t:document.getElementById('cw-student-result').innerText,score:document.getElementById('cw-result-score').textContent,palabras:document.getElementById('cw-result-words').textContent,tiempo:document.getElementById('cw-result-time').textContent}));
ok('Resultados del crucigrama muestran nombre (sin curso) junto a puntuación y estadísticas',r1.vis&&/María José Gómez/.test(r1.t)&&!/Curso/.test(r1.t)&&r1.score!==''&&r1.palabras!=='',JSON.stringify(r1));
// ===== Persistencia: otros juegos sin volver a pedir =====
await p.goto(BASE+'pages/relacionar.html');
await p.click('#btn-comenzar-match');
ok('Aviso «Sesión de …» con opción de cambiar alumno',await p.evaluate(()=>{const n=document.querySelector('[data-student-note]');return !n.hidden&&/María José Gómez/.test(n.textContent)&&!!n.querySelector('[data-student-change]')}));
await p.click('.role-card[data-role="alumno"]');
ok('Relacionar: NO vuelve a pedir identificación (se conserva en la sesión)',await stage()==='config');
await p.click('#btn-iniciar-match');
for(let i=0;i<8;i++){await p.evaluate(i=>{const t=document.querySelector('#mg-pool .match-chip');t.click();document.querySelector(`.match-row[data-row="${i}"] .match-slot__main`).click()},i)}
await p.click('#btn-mg-comprobar');
const r2=await p.evaluate(()=>({t:document.getElementById('mg-student-result').innerText,vis:!document.getElementById('mg-student-result').hidden,g:document.getElementById('mg-result-grade').textContent,c:document.getElementById('mg-result-correct').textContent}));
ok('Relacionar: resultados con nombre, calificación y estadísticas',await stage()==='result'&&r2.vis&&/María José Gómez/.test(r2.t)&&/^[1-5]\.\d$/.test(r2.g)&&/\d+ \/ \d+/.test(r2.c),JSON.stringify(r2));
// ===== Cambiar alumno + curso con espacios =====
await p.click('#btn-mg-nuevo');
await p.goto(BASE+'pages/sopa.html');
await p.click('#btn-comenzar-ws');
await p.click('[data-student-change]');
ok('«Cambiar alumno» borra la identificación de la sesión',await p.evaluate(()=>!sessionStorage.getItem('rc-student')&&document.querySelector('[data-student-note]').hidden));
await p.click('.role-card[data-role="alumno"]');
ok('Sopa: tras cambiar alumno vuelve a pedir los datos',await stage()==='ident');
await p.type('#student-nombre','  Luis   Pérez ');await p.type('#student-curso','   11-2  ');
await p.click('.student-form button[type="submit"]');await sleep(120);
ok('Sopa: con nombre y curso, el alumno juega directamente',await stage()==='game');
ok('Curso recortado y guardado: «'+JSON.stringify(await p.evaluate(()=>JSON.parse(sessionStorage.getItem('rc-student'))))+'»',await p.evaluate(()=>{const o=JSON.parse(sessionStorage.getItem('rc-student'));return o.nombre==='Luis Pérez'&&o.curso==='11-2'}));
// resolver sopa
const info=await p.evaluate(BUSCAR);
const cen=(r,c)=>p.evaluate((r,c)=>{const e=document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`).getBoundingClientRect();return {x:e.x+e.width/2,y:e.y+e.height/2}},r,c);
for(const w of info.words){const o=info.out[w][0];const a=await cen(o.r,o.c),z=await cen(o.r2,o.c2);await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move(z.x,z.y,{steps:5});await p.mouse.up();}
const r3=await p.evaluate(()=>({t:document.getElementById('ws-student-result').innerText,g:document.getElementById('ws-result-grade').textContent,f:document.getElementById('ws-result-found').textContent}));
ok('Sopa: resultados con nombre y curso, calificación y palabras encontradas',await stage()==='result'&&/Luis Pérez/.test(r3.t)&&/Curso: 11-2/.test(r3.t)&&r3.g==='5.0',JSON.stringify(r3));
// ===== Cuestionario =====
await p.goto(BASE+'pages/quiz.html');
await p.click('.role-card[data-role="alumno"]');
ok('Quiz: usa la identificación de la sesión (no la vuelve a pedir)',await p.evaluate(()=>document.querySelector('.quiz-stage.is-active').dataset.stage==='config'));
await p.click('#btn-iniciar-quiz');
for(let i=0;i<40;i++){
  const st=await p.evaluate(()=>document.querySelector('.quiz-stage.is-active').dataset.stage);if(st==='result')break;
  await p.evaluate(()=>{const o=document.querySelector('.option-item--btn');if(o)o.click();const t=document.querySelector('.open-answer textarea');if(t)t.value='respuesta'});
  await p.click('#btn-confirmar').catch(()=>{});await sleep(60);
  await p.evaluate(()=>{const n=document.getElementById('btn-siguiente-alumno');if(n&&!n.hidden)n.click()});await sleep(40);
}
const r4=await p.evaluate(()=>({st:document.querySelector('.quiz-stage.is-active').dataset.stage,t:document.getElementById('result-student').innerText,vis:!document.getElementById('result-student').hidden,nota:document.getElementById('grade-value').textContent,total:document.getElementById('stat-total').textContent}));
ok('Quiz: resultado con nombre y curso junto a calificación y estadísticas',r4.st==='result'&&r4.vis&&/Luis Pérez/.test(r4.t)&&/11-2/.test(r4.t)&&r4.nota!=='—'&&+r4.total>0,JSON.stringify(r4));
// copiar resumen incluye el nombre
await p.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:t=>{window.__clip=t;return Promise.resolve()}},configurable:true})});
const hayCopiar=await p.evaluate(()=>{const b=document.getElementById('btn-copiar');if(!b||b.hidden)return false;b.click();return true});await sleep(150);
const clip=await p.evaluate(()=>window.__clip||'');
ok('Quiz: «Copiar resumen» incluye alumno y curso',hayCopiar&&/Alumno: Luis Pérez/.test(clip)&&/Curso: 11-2/.test(clip),clip.slice(0,200));
// ===== Maestro no se identifica =====
await p.goto(BASE+'pages/crucigrama.html');await p.click('#btn-comenzar-crucigrama');
await p.click('.role-card[data-role="maestro"]');
ok('Maestro: sigue entrando sin identificación (compatibilidad de roles)',await stage()==='config');
await p.click('#btn-iniciar-crucigrama');await p.click('#btn-cw-terminar');await p.click('#btn-cw-terminar');
ok('Maestro: sus resultados no muestran tarjeta de alumno',await p.evaluate(()=>document.getElementById('cw-student-result').hidden));
// ===== Seguridad: el nombre se muestra como texto, no como HTML =====
await p.evaluate(()=>sessionStorage.clear());
await p.goto(BASE+'pages/sopa.html');await p.click('#btn-comenzar-ws');await p.click('.role-card[data-role="alumno"]');
await p.type('#student-nombre','<img src=x onerror=window.__xss=1> Ana');await p.click('.student-form button[type="submit"]');await sleep(150);
ok('El nombre se trata como texto (sin ejecutar HTML)',await p.evaluate(()=>!window.__xss&&!document.querySelector('.ws-stats img,.student-card img,[data-student-note] img')));
// nombre largo
await p.evaluate(()=>sessionStorage.clear());await p.reload();await p.click('#btn-comenzar-ws');await p.click('.role-card[data-role="alumno"]');
await p.type('#student-nombre','A'.repeat(95));await p.click('.student-form button[type="submit"]');
ok('Nombre demasiado largo: se rechaza con aviso',await stage()==='ident'&&await p.evaluate(()=>!document.getElementById('student-error').hidden));
ok('Sin errores JS ni rutas rotas (escritorio)',real(p).length===0,real(p).join('|'));
await p.close();
// ===== Móvil =====
p=await newPage(b,{width:390,height:844,mobile:true});p.on('dialog',d=>d.accept());
await p.goto(BASE+'pages/quiz.html');await p.evaluate(()=>sessionStorage.clear());await p.reload();
await p.click('.role-card[data-role="alumno"]');
const m=await p.evaluate(()=>{const i=document.getElementById('student-nombre').getBoundingClientRect();const bt=document.querySelector('.student-form button[type=submit]').getBoundingClientRect();return {ov:document.documentElement.scrollWidth>innerWidth,h:i.height,w:i.width,fs:parseFloat(getComputedStyle(document.getElementById('student-nombre')).fontSize),bw:bt.width,iw:innerWidth}});
ok('Móvil: formulario sin desborde, campos ≥44px alto y texto 16px, botón a todo el ancho',!m.ov&&m.h>=44&&m.fs>=16&&m.bw>m.iw*0.6,JSON.stringify(m));
await p.screenshot({path:'/tmp/ident_mobile.png'});
await p.type('#student-nombre','Sofía Ramírez');await p.type('#student-curso','9-1');await p.tap('.student-form button[type="submit"]');await sleep(100);
ok('Móvil: continúa y conserva la identificación',await p.evaluate(()=>document.querySelector('.quiz-stage.is-active').dataset.stage==='config'&&JSON.parse(sessionStorage.getItem('rc-student')).nombre==='Sofía Ramírez'));
ok('Móvil: sin errores',real(p).length===0,real(p).join('|'));
await p.close();
// ===== Claro / oscuro (captura) =====
p=await newPage(b,{width:1100,height:900});
await p.evaluateOnNewDocument(()=>localStorage.setItem('rc-theme','dark'));
await p.goto(BASE+'pages/relacionar.html');await p.evaluate(()=>sessionStorage.clear());await p.reload();
await p.click('#btn-comenzar-match');await p.click('.role-card[data-role="alumno"]');
await p.click('.student-form button[type="submit"]');
await p.screenshot({path:'/tmp/ident_dark_error.png'});
const col=await p.evaluate(()=>({th:document.documentElement.dataset.theme,bg:getComputedStyle(document.getElementById('student-nombre')).backgroundColor,fg:getComputedStyle(document.getElementById('student-nombre')).color}));
ok('Modo oscuro: el formulario toma los colores del tema ('+col.th+')',col.th==='dark'&&col.bg!==col.fg,JSON.stringify(col));
await b.close();
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,900));process.exit(1)});
