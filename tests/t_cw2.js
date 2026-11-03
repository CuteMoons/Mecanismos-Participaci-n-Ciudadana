const {launch,BASE,ok,newPage,sleep,results,alumno}=require('./common');
const fs=require('fs');
const root=require('path').resolve(__dirname,'..')+'/';
const CV=require(root+'data/crossword/crossword-versions.js');
(async()=>{
const b=await launch();const p=await newPage(b);p.on('dialog',d=>d.accept());
await p.evaluateOnNewDocument(()=>{window.__q=[];const r=Math.random.bind(Math);Math.random=()=>window.__q.length?window.__q.shift():r();});
await p.goto(BASE+'pages/crucigrama.html');
await p.click('#btn-comenzar-crucigrama');await alumno(p);
const stage=()=>p.evaluate(()=>document.querySelector('.crossword-stage.is-active').dataset.stage);
const clueMap={};CV.forEach(v=>v.words.forEach(w=>clueMap[w.clue]=w.word));
// clásico: leer pool desde la página
const classic=await p.evaluate(()=>CROSSWORD_WORDS.map(w=>[w.clue,w.word]));classic.forEach(([c,w])=>clueMap[c]=w);
async function resolver(){
  const n=await p.$$eval('.clue-item',e=>e.length);
  for(let i=0;i<n;i++){
    const clue=await p.evaluate(i=>{const b=document.querySelectorAll('.clue-item')[i];b.click();return b.querySelector('.clue-item__text').textContent},i);
    const word=clueMap[clue];if(!word)return 'sin palabra para pista: '+clue;
    const cells=await p.evaluate(()=>[...document.querySelectorAll('.cw-cell.is-active-word')].map(c=>[+c.dataset.row,+c.dataset.col,c.querySelector('input').value]));
    if(cells.length!==word.length)return `longitud ${cells.length}≠${word.length} (${word})`;
    for(let k=0;k<cells.length;k++){
      const [r,c,val]=cells[k];if(val)continue;
      const sel=await p.evaluate((r,c)=>{const e=document.querySelector(`.cw-cell[data-row="${r}"][data-col="${c}"]`);return e.classList.contains('is-selected')},r,c);
      if(!sel)await p.evaluate((r,c)=>document.querySelector(`.cw-cell[data-row="${r}"][data-col="${c}"]`).click(),r,c);
      await p.keyboard.press(word[k].toLowerCase());
    }
    if(await stage()==='result')break;
  }
  return await stage()==='result'?'OK':'no terminó: '+await stage();
}
const N=CV.length+1;
let resumen=[];let todoOk=true;
for(let vi=0;vi<CV.length;vi++){
  for(let li=0;li<CV[vi].layouts.length;li++){
    // elegir versión vi (índice vi+1 en ["clasico",...versiones]) y distribución li
    await p.evaluate((a,b)=>{window.__q=[a,b]},(vi+1+0.5)/N,(li+0.5)/CV[vi].layouts.length);
    if(await stage()==='result'){await p.click('#btn-cw-nuevo');}
    else if(await stage()==='config'){}
    await p.click('#btn-iniciar-crucigrama');
    const info=await p.evaluate(()=>({t:document.getElementById('cw-version-badge').textContent,dims:document.querySelectorAll('.cw-cell').length}));
    const esperado='📚 '+CV[vi].titulo;
    const res=await resolver();
    const cond=info.t===esperado&&res==='OK';
    if(!cond){todoOk=false;console.log('FALLA',CV[vi].id,li,info.t,res)}
    resumen.push(CV[vi].id+'#'+li);
    if(await stage()==='result'){ } 
  }
}
ok(`Se resolvieron con el teclado las ${resumen.length} distribuciones verificadas de las ${CV.length} versiones nuevas (cada una con su tema)`,todoOk);
// clásico
await p.evaluate(()=>{window.__q=[0.01,0.5]});
await p.click('#btn-cw-nuevo');await p.click('#btn-iniciar-crucigrama');
const rc=await resolver();
ok('El crucigrama clásico (generado y validado) también se resuelve completo',rc==='OK',rc);
// variedad real: 30 inicios, ver versiones y distribuciones distintas
const vistos=new Set(),dist=new Set();
for(let i=0;i<30;i++){
  await p.evaluate(()=>{window.__q=[]});
  if(await stage()==='result')await p.click('#btn-cw-nuevo');
  await p.click('#btn-iniciar-crucigrama');
  const x=await p.evaluate(()=>({t:document.getElementById('cw-version-badge').textContent,l:[...document.querySelectorAll('.clue-item__text')].map(e=>e.textContent).sort().join('|').length,g:document.querySelectorAll('.cw-cell').length}));
  vistos.add(x.t);dist.add(x.t+x.g);
  await p.click('#btn-cw-salir');await sleep(450);await p.click('#game-exit-leave');await sleep(150);
  await alumno(p);
}
ok('Aleatoriedad: en 30 inicios aparecen varias versiones distintas ('+vistos.size+')',vistos.size>=4,[...vistos].join(' | '));
// no repetir idéntica seguidas: 40 inicios forzando misma elección
await p.evaluate(()=>{window.__q=[]});
// salir comprobado sin errores
ok('Sin errores JS ni rutas rotas',p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e)).length===0,p.__errors.join('|'));
await b.close();
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,900));process.exit(1)});
