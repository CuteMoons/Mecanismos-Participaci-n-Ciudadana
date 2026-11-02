const {launch,BASE,ok,newPage,sleep,results}=require('./common');
const real=p=>p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e));
const root=require('path').resolve(__dirname,'..')+'/';
const WV=require(root+'data/wordsearch/wordsearch-data.js');
// Localiza cada palabra en el tablero del DOM escaneando las 8 direcciones (verificación independiente del generador)
const BUSCAR=`(() => {
  const cells=[...document.querySelectorAll('.ws-cell')];const n=+document.getElementById('ws-board').dataset.n;
  const g=Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>cells[r*n+c].textContent));
  const words=[...document.querySelectorAll('.ws-word__text')].map(e=>e.textContent);
  const D=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];const out={};
  for(const w of words){out[w]=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)for(const [dr,dc] of D){const r2=r+dr*(w.length-1),c2=c+dc*(w.length-1);if(r2<0||c2<0||r2>=n||c2>=n)continue;let ok=true;for(let i=0;i<w.length&&ok;i++)ok=g[r+dr*i][c+dc*i]===w[i];if(ok)out[w].push({r,c,r2,c2,dr,dc})}}
  return {n,out,words};})()`;
(async()=>{
const b=await launch();let p=await newPage(b,{width:1280,height:1500});p.on('dialog',d=>d.accept());
const stage=()=>p.evaluate(()=>document.querySelector('.ws-stage.is-active').dataset.stage);
await p.goto(BASE+'pages/juegos.html');
ok('Juegos: hay tarjeta de Sopa de Letras con enlace correcto',await p.evaluate(()=>!!document.querySelector('a.game-card[href="sopa.html"]'))&&await p.evaluate(()=>document.querySelectorAll('a.game-card').length===3));
await p.click('a.game-card[href="sopa.html"]');await p.waitForSelector('#btn-comenzar-ws');
await p.click('#btn-comenzar-ws');
ok('Sopa: selector de modo antes de jugar',await stage()==='role');
await p.click('.role-card[data-role="alumno"]');
ok('Alumno juega directamente; sin controles de maestro en el DOM',await stage()==='game'&&await p.evaluate(()=>document.getElementById('ws-teacher-panel').children.length===0));
let info=await p.evaluate(BUSCAR);
ok('Cada palabra de la lista existe una sola vez en el tablero ('+info.words.length+' palabras, '+info.n+'×'+info.n+')',info.words.length>=10&&info.words.every(w=>info.out[w].length===1),JSON.stringify(Object.fromEntries(Object.entries(info.out).map(([k,v])=>[k,v.length]))));
ok('La lista de palabras no revela ubicaciones',await p.evaluate(()=>!document.querySelector('.ws-word [data-r],.ws-word [data-c]')&&!document.getElementById('ws-solucion')));
const cen=async(r,c)=>p.evaluate((r,c)=>{const e=document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`).getBoundingClientRect();return {x:e.x+e.width/2,y:e.y+e.height/2}},r,c);
async function arrastrar(r1,c1,r2,c2){const a=await cen(r1,c1),z=await cen(r2,c2);await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move((a.x+z.x)/2,(a.y+z.y)/2,{steps:5});await p.mouse.move(z.x,z.y,{steps:5});
  const sel=await p.evaluate(()=>document.querySelectorAll('.ws-cell.is-selecting').length);await p.mouse.up();return sel}
const prog=()=>p.$eval('#ws-progreso',e=>e.textContent);
// --- palabra correcta por arrastre (hacia adelante)
const ws=info.words;const w0=ws[0],o0=info.out[w0][0];
const sel0=await arrastrar(o0.r,o0.c,o0.r2,o0.c2);
ok('Arrastre: la selección se resalta mientras se arrastra',sel0===w0.length,String(sel0));
let r=await p.evaluate(w=>({prog:document.getElementById('ws-progreso').textContent,hecha:[...document.querySelectorAll('.ws-word.is-found .ws-word__text')].map(e=>e.textContent),found:document.querySelectorAll('.ws-cell.is-found').length}),w0);
ok('Palabra correcta: queda marcada y completada en la lista',r.hecha.includes(w0)&&r.found===w0.length&&/^1 \//.test(r.prog),JSON.stringify(r));
const color=await p.evaluate(()=>{const e=document.querySelector('.ws-cell.is-found');const t=document.createElement('i');t.style.color=getComputedStyle(e).getPropertyValue('--found');document.body.appendChild(t);const c=getComputedStyle(t).color;t.remove();return c});
const [rr,gg,bb]=color.match(/\d+(\.\d+)?/g).map(Number);
ok('El color de la palabra encontrada no es rojo ('+color+')',!(rr>gg*1.6&&rr>bb*1.6));
// --- palabra repetida: no suma
await arrastrar(o0.r,o0.c,o0.r2,o0.c2);
ok('Seleccionar de nuevo una palabra encontrada no la cuenta otra vez',/^1 \//.test(await prog()));
// --- invertida: empezar por el extremo final
const w1=ws[1],o1=info.out[w1][0];
await arrastrar(o1.r2,o1.c2,o1.r,o1.c);
ok('Palabra seleccionada desde el último extremo (invertida) también se reconoce',/^2 \//.test(await prog()));
// --- incorrecta: rojo temporal y se limpia solo
const a=await cen(0,0),z=await cen(0,2);
await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move(z.x,z.y,{steps:4});await p.mouse.up();
const rojo=await p.evaluate(()=>document.querySelectorAll('.ws-cell.is-wrong').length);
const bg=await p.evaluate(()=>{const e=document.querySelector('.ws-cell.is-wrong');return e?getComputedStyle(e).backgroundColor:null});
await sleep(1100);
const rojo2=await p.evaluate(()=>document.querySelectorAll('.ws-cell.is-wrong').length);
ok('Selección incorrecta: se marca en rojo ('+bg+') y se limpia automáticamente',rojo===3&&rojo2===0);
ok('La selección incorrecta no cuenta y se puede seguir jugando',/^2 \//.test(await prog()));
// --- dos clics (inicio y fin)
const w2=ws[2],o2=info.out[w2][0];
let pa=await cen(o2.r2,o2.c2),pz=await cen(o2.r,o2.c);   // al revés, por clics
await p.mouse.click(pa.x,pa.y);
ok('Dos clics: la letra inicial queda marcada',await p.evaluate(()=>document.querySelectorAll('.ws-cell.is-start').length===1));
await p.mouse.click(pz.x,pz.y);
console.log('DEBUG dos clics',w2,JSON.stringify(o2),await prog(),await p.$eval('#ws-status',e=>e.textContent));
ok('Dos clics: inicio y fin forman la palabra',/^3 \//.test(await prog()));
// --- teclado
const w3=ws[3],o3=info.out[w3][0];
await p.evaluate((r,c)=>document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`).focus(),o3.r,o3.c);
await p.keyboard.press('Enter');
const keyDir={'0,1':'ArrowRight','0,-1':'ArrowLeft','1,0':'ArrowDown','-1,0':'ArrowUp'};
for(let i=0;i<w3.length-1;i++){ if(o3.dr!==0)await p.keyboard.press(o3.dr>0?'ArrowDown':'ArrowUp'); if(o3.dc!==0)await p.keyboard.press(o3.dc>0?'ArrowRight':'ArrowLeft'); }
await p.keyboard.press('Enter');
ok('Teclado: flechas + Enter inician y terminan la selección',/^4 \//.test(await prog()));
// --- ocho direcciones con arrastre: resolver todas las demás
for(const w of ws.slice(4)){const o=info.out[w][0];await arrastrar(o.r,o.c,o.r2,o.c2);if(await stage()==='result')break}
ok('Se encuentran todas las palabras → victoria',await stage()==='result');
const res=await p.evaluate(()=>({t:document.getElementById('ws-result-title').textContent,f:document.getElementById('ws-result-found').textContent,g:document.getElementById('ws-result-grade').textContent,iv:window.__iv.size}));
ok('Mensaje de victoria, total de palabras y calificación 5.0 ('+res.f+')',/Ganaste/.test(res.t)&&res.g==='5.0'&&res.f===`${ws.length} / ${ws.length}`);
ok('Al terminar no queda ningún temporizador activo',res.iv===0);
// --- nueva partida: otra versión/posiciones
const antes=info.words.join(',');
await p.click('#btn-ws-nuevo');
const info2=await p.evaluate(BUSCAR);
ok('Nueva sopa: otra versión (palabras distintas) y tablero nuevo',info2.words.join(',')!==antes&&info2.words.every(w=>info2.out[w].length===1));
await b.close().catch(()=>{});
const r2=results();console.log(`\n${r2.filter(x=>x.cond).length}/${r2.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,900));process.exit(1)});
