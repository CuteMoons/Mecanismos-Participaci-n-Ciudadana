const {launch,BASE,ok,newPage,sleep,results,alumno}=require('./common');
const real=p=>p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e));
async function start(p,rol){
  await p.goto(BASE+'pages/relacionar.html');
  await p.click('#btn-comenzar-match');if(rol==='alumno')await alumno(p);else await p.click('.role-card[data-role="maestro"]');await p.click('#btn-iniciar-match');
}
const stage=p=>p.evaluate(()=>document.querySelector('.matching-stage.is-active').dataset.stage);
const centre=async(p,sel)=>{const h=await p.$(sel);const bb=await h.boundingBox();return {x:bb.x+bb.width/2,y:bb.y+bb.height/2}};
(async()=>{
const b=await launch();
// ================= ESCRITORIO =================
let p=await newPage(b);
await p.goto(BASE+'pages/relacionar.html');
await p.click('#btn-comenzar-match');
ok('Selector de modo antes de jugar',await stage(p)==='role');
await alumno(p);
ok('Alumno: sin selector de tiempo',await p.evaluate(()=>document.getElementById('mg-group-tiempo').hidden));
await p.click('#btn-iniciar-match');
ok('Alumno: sin controles de maestro en el DOM',await p.evaluate(()=>document.getElementById('mg-teacher-panel').children.length===0));
ok('8 significados y 8 mecanismos',await p.evaluate(()=>document.querySelectorAll('.match-row').length===8&&document.querySelectorAll('#mg-pool .match-chip').length===8));
// compacidad (escritorio)
const geo=await p.evaluate(()=>{const l=document.getElementById('mg-layout').getBoundingClientRect();const d=document.querySelector('.match-col--defs').getBoundingClientRect();const pl=document.querySelector('.match-col--pool').getBoundingClientRect();return {w:l.width,h:l.height,gap:pl.left-d.right,vh:innerHeight,top:l.top}});
ok('Tablero compacto: columnas cercanas y cabe en pantalla',geo.gap<40&&geo.h<geo.vh,JSON.stringify(geo));
ok('Texto legible (≥13px)',await p.evaluate(()=>parseFloat(getComputedStyle(document.querySelector('.match-meaning')).fontSize)>=13&&parseFloat(getComputedStyle(document.querySelector('.match-chip__label')).fontSize)>=13));
// ARRASTRAR Y SOLTAR con ratón
const chipSel='#mg-pool .match-chip';
const chipId=await p.$eval(chipSel,e=>e.dataset.chipId);
const from=await centre(p,chipSel);const to=await centre(p,'.match-row[data-row="0"] .match-slot__main');
await p.mouse.move(from.x,from.y);await p.mouse.down();
await p.mouse.move((from.x+to.x)/2,(from.y+to.y)/2,{steps:6});
await p.mouse.move(to.x,to.y,{steps:6});
const mid=await p.evaluate(()=>({avail:document.querySelectorAll('.match-row.is-drop-available').length,over:document.querySelectorAll('.match-row.is-drop-over').length,ghost:!!document.querySelector('.match-chip--ghost')}));
ok('Durante el arrastre se resaltan destinos y aparece la ficha fantasma',mid.avail===8&&mid.over===1&&mid.ghost,JSON.stringify(mid));
await p.mouse.up();
ok('Soltar coloca la ficha en el significado',await p.evaluate(id=>document.querySelector('.match-row[data-row="0"] .match-slot__main').dataset.chipId===id,chipId));
ok('Sin restos del arrastre',await p.evaluate(()=>!document.querySelector('.match-chip--ghost')&&!document.querySelector('.is-drop-available')&&!document.body.classList.contains('is-match-dragging')));
ok('Relación visible y progreso 1/8',/1 \/ 8/.test(await p.$eval('#mg-progreso',e=>e.textContent)));
ok('Sin feedback de acierto/error durante la partida',await p.evaluate(()=>!document.querySelector('.is-correct,.is-incorrect')));
// Unicidad: arrastrar la ficha colocada a otra fila la MUEVE
const f2=await centre(p,'.match-row[data-row="0"] .match-slot__main');const t2=await centre(p,'.match-row[data-row="1"] .match-slot__main');
await p.mouse.move(f2.x,f2.y);await p.mouse.down();await p.mouse.move(t2.x,t2.y,{steps:10});await p.mouse.up();
ok('Una ficha no puede estar en dos destinos (se mueve)',await p.evaluate(id=>{const all=[...document.querySelectorAll('.match-slot__main[data-chip-id]')].filter(e=>e.dataset.chipId===id);return all.length===1&&all[0].closest('.match-row').dataset.row==='1'},chipId));
// alternativa por clic: ficha → destino
await p.click('#mg-pool .match-chip');
ok('Clic en ficha la selecciona',await p.evaluate(()=>!!document.querySelector('#mg-pool .match-chip.is-selected')));
await p.click('.match-row[data-row="2"] .match-slot__main');
ok('Clic en destino la coloca',await p.evaluate(()=>!!document.querySelector('.match-row[data-row="2"] .match-slot__main[data-chip-id]')));
// alternativa: destino → ficha
await p.click('.match-row[data-row="3"] .match-slot__main');
await p.click('#mg-pool .match-chip');
ok('Seleccionar destino y luego ficha también funciona',await p.evaluate(()=>!!document.querySelector('.match-row[data-row="3"] .match-slot__main[data-chip-id]')));
// corregir: quitar
await p.click('.match-row[data-row="3"] .match-slot__remove');
ok('Se puede corregir quitando una relación',await p.evaluate(()=>!document.querySelector('.match-row[data-row="3"] .match-slot__main[data-chip-id]')&&document.querySelectorAll('#mg-pool .match-chip').length===8-2));
// intercambio
await p.click('.match-row[data-row="1"] .match-slot__main');
await p.click('.match-row[data-row="2"] .match-slot__main');
ok('Mover a un destino ocupado intercambia sin duplicar',await p.evaluate(()=>[...document.querySelectorAll('.match-slot__main[data-chip-id]')].map(e=>e.dataset.chipId).length===2&&new Set([...document.querySelectorAll('.match-slot__main[data-chip-id]')].map(e=>e.dataset.chipId)).size===2));
ok('Comprobar deshabilitado hasta completar',await p.$eval('#btn-mg-comprobar',e=>e.disabled));
// completar todo por clic
for(let i=0;i<8;i++){
  const filled=await p.evaluate(i=>!!document.querySelector(`.match-row[data-row="${i}"] .match-slot__main[data-chip-id]`),i);
  if(!filled){await p.click('#mg-pool .match-chip');await p.click(`.match-row[data-row="${i}"] .match-slot__main`);}
}
ok('Al completar se habilita Comprobar',!(await p.$eval('#btn-mg-comprobar',e=>e.disabled)));
// Salir y continuar
await p.click('#btn-mg-salir');
ok('Salir: modal «¿Salir del juego?»',await p.evaluate(()=>document.getElementById('game-exit-modal').classList.contains('is-open')));
await sleep(450);await p.click('#game-exit-continue');
ok('Continuar conserva las relaciones',await p.evaluate(()=>document.querySelectorAll('.match-slot__main[data-chip-id]').length===8)&&await stage(p)==='game');
const ivB=await p.evaluate(()=>window.__iv.size);
await p.click('#btn-mg-salir');await sleep(450);await p.click('#game-exit-leave');
ok('Salir descarta y vuelve a elegir modo',await stage(p)==='role');
ok('Sin intervalos ni sonidos activos tras salir',await p.evaluate(()=>window.__iv.size===0&&window.__aud.active===0),'antes '+ivB);
// nueva partida limpia y resultado
await alumno(p);await p.click('#btn-iniciar-match');
ok('Nueva partida reiniciada (0/8)',/0 \/ 8/.test(await p.$eval('#mg-progreso',e=>e.textContent)));
// llenar en orden y comprobar (casi seguro con errores)
for(let i=0;i<8;i++){await p.click('#mg-pool .match-chip');await p.click(`.match-row[data-row="${i}"] .match-slot__main`);}
await p.click('#btn-mg-comprobar');
ok('Resultado mostrado',await stage(p)==='result');
const res=await p.evaluate(()=>({grade:document.getElementById('mg-result-grade').textContent,rev:document.querySelectorAll('.match-review__item').length,right:document.querySelectorAll('.match-review__right').length,ok:document.querySelectorAll('.match-review__item.is-correct').length}));
ok('Revisión con ✓/✕ por relación y sin revelar la correcta al alumno',res.rev===8&&res.right===0&&/^[1-5]\.\d$/.test(res.grade),JSON.stringify(res));
ok('Sin intervalos tras resultado',await p.evaluate(()=>window.__iv.size===0));
ok('Sin errores JS ni rutas rotas (relacionar, escritorio)',real(p).length===0,real(p).join('|'));
// ================= MAESTRO =================
await start(p,'maestro');
ok('Maestro: panel con pausa, respuestas y terminar',await p.evaluate(()=>!!document.getElementById('btn-mg-pausa')&&!!document.getElementById('btn-mg-solucion')&&!!document.getElementById('btn-mg-terminar')));
await p.click('#btn-mg-pausa');
ok('Pausa bloquea el tablero',await p.evaluate(()=>document.getElementById('mg-layout').inert&&!document.getElementById('mg-pause-veil').hidden));
await p.click('#btn-mg-pausa');
await p.click('#btn-mg-solucion');
ok('Maestro puede ver respuestas (solo bajo demanda)',await p.evaluate(()=>document.querySelectorAll('#mg-solucion li').length===8));
await p.click('#btn-mg-terminar');await p.click('#btn-mg-terminar');
ok('Terminar y calificar sin completar',await stage(p)==='result'&&/^1\.0$/.test(await p.$eval('#mg-result-grade',e=>e.textContent)));
ok('Maestro puede mostrar respuestas correctas al final',await p.evaluate(()=>{const b=[...document.querySelectorAll('#mg-review-actions button')][0];if(!b)return false;b.click();return document.querySelectorAll('.match-review__right').length===8}));
await p.close();
// ================= MÓVIL =================
p=await newPage(b,{width:390,height:844,mobile:true});
await start(p,'alumno');
const mob=await p.evaluate(()=>{const pool=document.querySelector('.match-col--pool');const cs=getComputedStyle(pool);const chip=document.querySelector('#mg-pool .match-chip').getBoundingClientRect();const row=document.querySelector('.match-row').getBoundingClientRect();
 return {overflowX:document.documentElement.scrollWidth>innerWidth,sticky:cs.position,cols:getComputedStyle(document.getElementById('mg-layout')).gridTemplateColumns.split(' ').length,chipH:chip.height,rowW:row.width,vw:innerWidth,font:parseFloat(getComputedStyle(document.querySelector('.match-meaning')).fontSize)}});
ok('Móvil: una columna, sin desborde horizontal',mob.cols===1&&!mob.overflowX,JSON.stringify(mob));
ok('Móvil: bandeja de mecanismos fija abajo, objetivos táctiles ≥44px y texto ≥13px',mob.sticky==='sticky'&&mob.chipH>=44&&mob.font>=13,JSON.stringify(mob));
// toque: ficha → destino
await p.tap('#mg-pool .match-chip');
await p.tap('.match-row[data-row="0"] .match-slot__main');
ok('Móvil: alternativa por toque funciona',await p.evaluate(()=>!!document.querySelector('.match-row[data-row="0"] .match-slot__main[data-chip-id]')));
// arrastre táctil (arriba de la bandeja hacia un destino)
const pc=await centre(p,'#mg-pool .match-chip');const tg=await centre(p,'.match-row[data-row="1"] .match-slot__main');
const tid=await p.$eval('#mg-pool .match-chip',e=>e.dataset.chipId);
const cdp=await p.createCDPSession();
const touch=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
await touch('touchStart',pc.x,pc.y);
for(let i=1;i<=10;i++)await touch('touchMove',pc.x+(tg.x-pc.x)*i/10,pc.y+(tg.y-pc.y)*i/10);
await touch('touchEnd',tg.x,tg.y);
await sleep(200);
const dragged=await p.evaluate(id=>{const e=document.querySelector(`.match-row[data-row="1"] .match-slot__main[data-chip-id="${id}"]`);return !!e},tid);
console.log('INFO arrastre táctil vertical hacia destino:',dragged?'colocó':'no colocó (queda la alternativa por toque)');
ok('Móvil: sin errores JS',real(p).length===0,real(p).join('|'));
await p.screenshot({path:'/tmp/match_mobile.png'});
await b.close();
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,900));process.exit(1)});
