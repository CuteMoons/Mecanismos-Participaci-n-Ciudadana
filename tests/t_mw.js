const {launch,BASE,ok,newPage,sleep,results}=require('./common');
const root=require('path').resolve(__dirname,'..')+'/';
const MV=require(root+'data/matching/matching-versions.js');
const real=p=>p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e));
(async()=>{
const b=await launch();let p=await newPage(b);p.on('dialog',d=>d.accept());
await p.evaluateOnNewDocument(()=>{window.__q=[];const r=Math.random.bind(Math);Math.random=()=>window.__q.length?window.__q.shift():r();});
// ================= RELACIONAR: cada versión =================
await p.goto(BASE+'pages/relacionar.html');
await p.click('#btn-comenzar-match');await p.click('.role-card[data-role="alumno"]');
const stage=()=>p.evaluate(()=>document.querySelector('.matching-stage.is-active').dataset.stage);
const clasico=await p.evaluate(()=>{const it=construirMecanismosParaJuego('media');return it.map(i=>[i.significado,i.nombre])});
const tabla={};clasico.forEach(([a,b])=>tabla[a]=b);
MV.forEach(v=>v.pares.forEach(x=>{ if(v.modo==='inverso')tabla[x.concepto]=x.texto; else tabla[x.texto]=x.concepto; }));
const N=MV.length+1;let okTodo=true;const titulos=[];
for(let vi=-1;vi<MV.length;vi++){
  await p.evaluate(a=>{window.__q=[a]},(vi+1+0.5)/N);
  if(await stage()==='result')await p.click('#btn-mg-nuevo');
  await p.click('#btn-iniciar-match');
  const info=await p.evaluate(()=>({badge:document.getElementById('mg-version-badge').textContent,filas:[...document.querySelectorAll('.match-meaning')].map(e=>e.textContent),chips:[...document.querySelectorAll('#mg-pool .match-chip .match-chip__label')].map(e=>e.textContent),inv:document.getElementById('mg-layout').classList.contains('match-layout--inverso'),h1:document.getElementById('mg-defs-title').textContent,h2:document.getElementById('mg-pool-name').textContent}));
  titulos.push(info.badge);
  const esperadoInv=vi>=0&&MV[vi].modo==='inverso';
  if(vi>=0&&info.badge!=='📚 '+MV[vi].titulo)okTodo=false;
  if(info.inv!==esperadoInv)okTodo=false;
  if(info.filas.length!==info.chips.length||info.filas.length<7)okTodo=false;
  // resolver por clics según la tabla fila→ficha, sin conocer el orden
  for(let i=0;i<info.filas.length;i++){
    const objetivo=tabla[info.filas[i]];
    if(!objetivo){okTodo=false;console.log('sin pareja',info.filas[i]);break}
    await p.evaluate((obj,i)=>{const chip=[...document.querySelectorAll('#mg-pool .match-chip')].find(c=>c.querySelector('.match-chip__label').textContent===obj);chip.click();document.querySelector(`.match-row[data-row="${i}"] .match-slot__main`).click();},objetivo,i);
  }
  await p.click('#btn-mg-comprobar');
  const nota=await p.$eval('#mg-result-grade',e=>e.textContent);
  if(nota!=='5.0'){okTodo=false;console.log('nota',vi,nota)}
}
ok('Relacionar: las 6 versiones (clásica + 5) se resuelven con 5.0 aunque el orden visual esté mezclado ('+titulos.length+')',okTodo,titulos.join(' / '));
// orden distinto entre partidas de la misma versión
const ordenes=new Set();
for(let i=0;i<8;i++){
  await p.evaluate(()=>{window.__q=[0.99]});
  if(await stage()==='result')await p.click('#btn-mg-nuevo');
  await p.click('#btn-iniciar-match');
  ordenes.add(await p.evaluate(()=>[...document.querySelectorAll('.match-meaning')].map(e=>e.textContent.slice(0,10)).join('|')));
  await p.click('#btn-mg-salir');await sleep(450);await p.click('#game-exit-leave');await sleep(120);await p.click('.role-card[data-role="alumno"]');
}
ok('Relacionar: la misma versión cambia el orden entre partidas',ordenes.size>=6,String(ordenes.size));
// variedad aleatoria
const vers=new Set();
for(let i=0;i<24;i++){
  await p.evaluate(()=>{window.__q=[]});
  await p.click('#btn-iniciar-match');vers.add(await p.$eval('#mg-version-badge',e=>e.textContent));
  await p.click('#btn-mg-salir');await sleep(450);await p.click('#game-exit-leave');await sleep(120);await p.click('.role-card[data-role="alumno"]');
}
ok('Relacionar: aleatoriedad real (24 inicios → '+vers.size+' versiones)',vers.size>=5);
ok('Relacionar: sin errores JS ni rutas rotas',real(p).length===0,real(p).join('|'));
// versión inversa: arrastrar y soltar
await p.evaluate(()=>{window.__q=[(3+0.5)/6]});  // datos-clave: índice 3 en [clasico,instituciones,terminos,herramientas,datos,conceptos] → 4º versión
await p.click('#btn-iniciar-match');
const ttl=await p.$eval('#mg-version-badge',e=>e.textContent);
const c=async(sel)=>{const bb=await (await p.$(sel)).boundingBox();return {x:bb.x+bb.width/2,y:bb.y+bb.height/2}};
const from=await c('#mg-pool .match-chip'),to=await c('.match-row[data-row="0"] .match-slot__main');
await p.mouse.move(from.x,from.y);await p.mouse.down();await p.mouse.move(to.x,to.y,{steps:12});
const hl=await p.evaluate(()=>document.querySelectorAll('.match-row.is-drop-over').length);
await p.mouse.up();
ok('Relacionar ('+ttl+'): arrastrar y soltar funciona también en la distribución alternativa',hl===1&&await p.evaluate(()=>!!document.querySelector('.match-row[data-row="0"] .match-slot__main[data-chip-id]')));
await p.screenshot({path:'/tmp/mg_inverso.png'});
await p.close();
// móvil
p=await newPage(b,{width:390,height:844,mobile:true});p.on('dialog',d=>d.accept());
await p.evaluateOnNewDocument(()=>{window.__q=[];const r=Math.random.bind(Math);Math.random=()=>window.__q.length?window.__q.shift():r();});
await p.goto(BASE+'pages/relacionar.html');
await p.click('#btn-comenzar-match');await p.click('.role-card[data-role="alumno"]');
let movilOk=true;const det=[];
for(let vi=0;vi<=MV.length;vi++){
  await p.evaluate(a=>{window.__q=[a]},(vi+0.5)/N);
  if(await stage()==='result')await p.click('#btn-mg-nuevo');
  await p.click('#btn-iniciar-match');
  const m=await p.evaluate(()=>({ov:document.documentElement.scrollWidth>innerWidth,fs:parseFloat(getComputedStyle(document.querySelector('.match-meaning')).fontSize),chipH:document.querySelector('#mg-pool .match-chip').getBoundingClientRect().height,cols:getComputedStyle(document.getElementById('mg-layout')).gridTemplateColumns.split(' ').length}));
  if(m.ov||m.fs<13||m.chipH<40||m.cols!==1){movilOk=false;det.push(JSON.stringify(m))}
  await p.click('#btn-mg-salir');await sleep(450);await p.click('#game-exit-leave');await sleep(120);await p.click('.role-card[data-role="alumno"]');
}
ok('Relacionar en móvil: las 6 versiones sin desborde horizontal, texto ≥13px y objetivos táctiles ≥40px',movilOk,det.join(' '));
await p.screenshot({path:'/tmp/mg_mobile_inv.png'});
ok('Relacionar móvil: sin errores',real(p).length===0,real(p).join('|'));
await b.close();
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,900));process.exit(1)});
