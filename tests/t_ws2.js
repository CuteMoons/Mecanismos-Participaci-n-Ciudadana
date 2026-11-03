const {launch,BASE,ok,newPage,sleep,results,alumno}=require('./common');
const real=p=>p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e));
const BUSCAR=`(() => {const cells=[...document.querySelectorAll('.ws-cell')];const n=+document.getElementById('ws-board').dataset.n;
 const g=Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>cells[r*n+c].textContent));
 const words=[...document.querySelectorAll('.ws-word__text')].map(e=>e.textContent);const D=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];const out={};
 for(const w of words){out[w]=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)for(const [dr,dc] of D){const r2=r+dr*(w.length-1),c2=c+dc*(w.length-1);if(r2<0||c2<0||r2>=n||c2>=n)continue;let ok=true;for(let i=0;i<w.length&&ok;i++)ok=g[r+dr*i][c+dc*i]===w[i];if(ok)out[w].push({r,c,r2,c2,dr,dc})}}return {n,out,words}})()`;
(async()=>{
const b=await launch();let p=await newPage(b,{width:1280,height:1500});p.on('dialog',d=>d.accept());
const stage=()=>p.evaluate(()=>document.querySelector('.ws-stage.is-active').dataset.stage);
await p.goto(BASE+'pages/sopa.html');
await p.click('#btn-comenzar-ws');await alumno(p);
const cen=(r,c)=>p.evaluate((r,c)=>{const e=document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`).getBoundingClientRect();return {x:e.x+e.width/2,y:e.y+e.height/2}},r,c);
async function arrastrar(r1,c1,r2,c2){const a=await cen(r1,c1),z=await cen(r2,c2);await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move(z.x,z.y,{steps:6});await p.mouse.up();}
let info=await p.evaluate(BUSCAR);
const dirs=new Set(Object.values(info.out).map(o=>o[0].dr+','+o[0].dc));
ok('Cada tablero usa las 8 direcciones ('+dirs.size+' distintas en esta partida)',dirs.size===8,[...dirs].join(' '));
// encontrar 4 palabras, la mitad al revés (desde el extremo final)
let k=0;for(const w of info.words.slice(0,6)){const o=info.out[w][0];if(k%2)await arrastrar(o.r2,o.c2,o.r,o.c);else await arrastrar(o.r,o.c,o.r2,o.c2);k++}
ok('6 palabras en distintas direcciones, derecha e inversa',/^6 \//.test(await p.$eval('#ws-progreso',e=>e.textContent)));
// Salir y continuar
const prog=await p.$eval('#ws-progreso',e=>e.textContent);
await p.click('#btn-ws-salir');
ok('Salir: aviso «¿Salir del juego?» con Continuar y Salir',await p.evaluate(()=>document.getElementById('game-exit-modal').classList.contains('is-open')&&document.querySelectorAll('#game-exit-modal .modal-confirm__actions button').length===2));
await sleep(450);await p.click('#game-exit-continue');
ok('Continuar conserva el progreso de la sopa',await p.$eval('#ws-progreso',e=>e.textContent)===prog&&await stage()==='game');
// enlace interno pide confirmación
await p.click('.navbar__link[data-page="quiz.html"]');
ok('Enlace del menú durante la partida pide confirmación',await p.evaluate(()=>document.getElementById('game-exit-modal').classList.contains('is-open'))&&p.url().includes('sopa'));
await p.keyboard.press('Escape');
// selección pendiente + salir: nada queda activo
const a=await cen(0,0);await p.mouse.click(a.x,a.y);
ok('Hay una selección pendiente (inicio marcado)',await p.evaluate(()=>document.querySelectorAll('.ws-cell.is-start').length===1));
const aud0=await p.evaluate(()=>window.__aud.started);
await p.click('#btn-ws-salir');await sleep(450);await p.click('#game-exit-leave');await sleep(300);
ok('Salir: vuelve a la selección de modo y descarta el progreso',await stage()==='role'&&await p.evaluate(()=>document.getElementById('ws-board').children.length===0&&document.getElementById('ws-words').children.length===0));
ok('Salida confirmada reproduce su efecto',await p.evaluate(()=>window.__aud.started)>aud0);
ok('Sin intervalos, osciladores ni destellos activos tras salir',await p.evaluate(()=>window.__iv.size===0&&window.__aud.active===0&&document.querySelectorAll('.is-start,.is-selecting,.is-wrong').length===0));
// Nueva partida arranca limpia
await alumno(p);
ok('Nueva partida reiniciada (0 encontradas, sin marcas)',await p.evaluate(()=>/^0 \//.test(document.getElementById('ws-progreso').textContent)&&document.querySelectorAll('.ws-cell.is-found').length===0));
// Audio global: silenciar y jugar
info=await p.evaluate(BUSCAR);
await p.click('.sound-toggle');const s0=await p.evaluate(()=>window.__aud.started);
{const w=info.words[0],o=info.out[w][0];await arrastrar(o.r,o.c,o.r2,o.c2);await arrastrar(0,0,0,2);}
ok('Audio global desactivado: acierto y error no producen sonido',await p.evaluate(()=>window.__aud.started)===s0);
await p.click('.sound-toggle');const s1=await p.evaluate(()=>window.__aud.started);
{const w=info.words[1],o=info.out[w][0];await arrastrar(o.r,o.c,o.r2,o.c2);}
ok('Audio global activado: la sopa respeta el sistema común (suena el acierto)',await p.evaluate(()=>window.__aud.started)>s1);
// MAESTRO
await p.click('#btn-ws-salir');await sleep(450);await p.click('#game-exit-leave');await sleep(200);
await p.click('.role-card[data-role="maestro"]');
ok('Maestro: pantalla de configuración (tiempo)',await stage()==='config'&&await p.evaluate(()=>document.querySelectorAll('#ws-config-tiempo .pill').length===4));
await p.evaluate(()=>[...document.querySelectorAll('#ws-config-tiempo .pill')].find(x=>x.textContent==='5 min').click());
await p.click('#btn-iniciar-ws');
ok('Maestro: panel con pausa, ubicaciones y terminar; ubicaciones ocultas',await p.evaluate(()=>!!document.getElementById('btn-ws-pausa')&&!!document.getElementById('btn-ws-solucion')&&!!document.getElementById('btn-ws-terminar')&&document.getElementById('ws-solucion').hidden&&document.getElementById('ws-solucion').innerHTML===''));
const t0=await p.$eval('#ws-timer',e=>e.textContent);
await p.click('#btn-ws-pausa');await sleep(1400);
ok('Pausa: reloj detenido y tablero bloqueado',await p.$eval('#ws-timer',e=>e.textContent)===t0&&await p.evaluate(()=>document.getElementById('ws-board').inert&&!document.getElementById('ws-pause-veil').hidden));
await p.click('#btn-ws-pausa');await sleep(1300);
ok('Reanudar: el reloj sigue',await p.$eval('#ws-timer',e=>e.textContent)!==t0);
await p.click('#btn-ws-solucion');
ok('Maestro puede ver dónde está cada palabra (a demanda)',await p.evaluate(()=>document.querySelectorAll('#ws-solucion li').length>=10&&/fila \d+, columna \d+/.test(document.querySelector('#ws-solucion li').textContent)));
info=await p.evaluate(BUSCAR);{const w=info.words[0],o=info.out[w][0];await arrastrar(o.r,o.c,o.r2,o.c2);}
await p.click('#btn-ws-terminar');await p.click('#btn-ws-terminar');
ok('Terminar y calificar (doble confirmación)',await stage()==='result'&&/^[1-5]\.\d$/.test(await p.$eval('#ws-result-grade',e=>e.textContent)));
ok('Sin temporizadores tras el resultado',await p.evaluate(()=>window.__iv.size===0));
ok('Sopa (escritorio): sin errores JS ni rutas rotas',real(p).length===0,real(p).join('|'));
await p.close();
// MÓVIL con toque real
p=await newPage(b,{width:390,height:844,mobile:true});p.on('dialog',d=>d.accept());
await p.goto(BASE+'pages/sopa.html');await p.click('#btn-comenzar-ws');await alumno(p);
const m=await p.evaluate(()=>{const bd=document.getElementById('ws-board').getBoundingClientRect();const c=document.querySelector('.ws-cell').getBoundingClientRect();return {ov:document.documentElement.scrollWidth>innerWidth,cell:c.width,fs:parseFloat(getComputedStyle(document.querySelector('.ws-cell')).fontSize),bw:bd.width,iw:innerWidth,n:+document.getElementById('ws-board').dataset.n,touch:getComputedStyle(document.getElementById('ws-board')).touchAction}});
ok('Móvil: tablero cabe sin desborde, celdas ≥24px y letra ≥12px (celda '+m.cell.toFixed(1)+'px, letra '+m.fs.toFixed(1)+'px, '+m.n+'×'+m.n+')',!m.ov&&m.cell>=24&&m.fs>=12&&m.touch==='none',JSON.stringify(m));
await p.screenshot({path:'/tmp/ws_mobile.png'});
const cdp=await p.createCDPSession();
info=await p.evaluate(BUSCAR);
const cen2=(r,c)=>p.evaluate((r,c)=>{const e=document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`).getBoundingClientRect();return {x:e.x+e.width/2,y:e.y+e.height/2}},r,c);
async function dedo(r1,c1,r2,c2){const a=await cen2(r1,c1),z=await cen2(r2,c2);const t=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
 await t('touchStart',a.x,a.y);for(let i=1;i<=8;i++)await t('touchMove',a.x+(z.x-a.x)*i/8,a.y+(z.y-a.y)*i/8);await t('touchEnd',z.x,z.y);await sleep(120);}
// scroll arriba: el tablero debe ser visible
let ok2=0;for(const w of info.words.slice(0,4)){const o=info.out[w][0];await dedo(o.r,o.c,o.r2,o.c2);}
ok('Móvil: arrastre con el dedo encuentra palabras',/^[34] \/|^4 \//.test(await p.$eval('#ws-progreso',e=>e.textContent)),await p.$eval('#ws-progreso',e=>e.textContent));
// dos toques
{const w=info.words[4],o=info.out[w][0];const a=await cen2(o.r,o.c),z=await cen2(o.r2,o.c2);await p.touchscreen.tap(a.x,a.y);await p.touchscreen.tap(z.x,z.y);}
ok('Móvil: alternativa de dos toques',/^5 \//.test(await p.$eval('#ws-progreso',e=>e.textContent)));
ok('Móvil: sin errores',real(p).length===0,real(p).join('|'));
await b.close();
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,900));process.exit(1)});
