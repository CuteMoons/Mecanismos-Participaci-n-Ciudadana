const {launch,BASE,ok,newPage,sleep,results}=require('./common');
const real=p=>p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e));
(async()=>{
const b=await launch();
let p=await newPage(b);p.on('dialog',d=>d.accept());
// ---- Quiz alumno: flujo completo básico ----
await p.goto(BASE+'pages/quiz.html');
await p.click('.role-card[data-role="alumno"]');
await p.click('#btn-iniciar-quiz');
const q=await p.evaluate(()=>document.querySelector('.quiz-stage.is-active').dataset.stage);
ok('Quiz alumno: llega a las preguntas',q==='question',q);
await p.click('.option-item--btn');await p.click('#btn-confirmar');
ok('Quiz: respuesta registrada con feedback',await p.evaluate(()=>!document.getElementById('question-feedback').hidden));
const s=await p.evaluate(()=>window.__aud.started);
ok('Quiz: reproduce efecto de respuesta',s>0);
await p.click('#btn-salir');await sleep(450);await sleep(700);
ok('Quiz: aviso de salida con Continuar/Salir',await p.evaluate(()=>document.getElementById('exit-modal').classList.contains('is-open')));
await p.click('#exit-modal-leave');await sleep(400);
ok('Quiz: salir vuelve a rol',await p.evaluate(()=>document.querySelector('.quiz-stage.is-active').dataset.stage==='role'));
// quiz maestro configuración
await p.click('.role-card[data-role="maestro"]');
ok('Quiz maestro: configuración intacta (grupos, tiempo)',await p.evaluate(()=>!!document.querySelector('#toggle-aleatorio')&&document.querySelectorAll('.option-card').length>=2));
ok('Quiz sin errores',real(p).length===0,real(p).join('|'));
await p.close();
// ---- Temas claro/oscuro en juegos ----
p=await newPage(b);p.on('dialog',d=>d.accept());
for(const theme of ['light','dark']){
  await p.goto(BASE+'pages/crucigrama.html');
  await p.evaluate(t=>{localStorage.setItem('rc-theme',t)},theme);await p.reload();
  await p.click('#btn-comenzar-crucigrama');await p.click('.role-card[data-role="maestro"]');await p.click('#btn-iniciar-crucigrama');
  await p.click('.cw-cell:not(.cw-cell--block)');await p.keyboard.type('abc');
  const c=await p.evaluate(()=>({t:document.documentElement.dataset.theme,bg:getComputedStyle(document.body).backgroundColor,clue:getComputedStyle(document.querySelector('.active-clue')).backgroundColor,txt:getComputedStyle(document.querySelector('.active-clue__text')).color,cell:getComputedStyle(document.querySelector('.cw-cell.is-selected')).backgroundColor}));
  ok(`Crucigrama en modo ${theme}: tema aplicado y panel con contraste`,c.t===theme&&c.clue!==c.txt,JSON.stringify(c));
  await p.screenshot({path:`/tmp/cw_${theme}.png`});
  await p.goto(BASE+'pages/relacionar.html');
  await p.click('#btn-comenzar-match');await p.click('.role-card[data-role="alumno"]');await p.click('#btn-iniciar-match');
  for(let i=0;i<3;i++){await p.click('#mg-pool .match-chip');await p.click(`.match-row[data-row="${i}"] .match-slot__main`);}
  await p.screenshot({path:`/tmp/mg_${theme}.png`});
}
// pantalla tableta
await p.setViewport({width:820,height:1100});
await p.screenshot({path:'/tmp/mg_tablet.png'});
ok('Sin errores en temas',real(p).length===0,real(p).join('|'));
// ---- Enlaces internos rotos ----
const fs=require('fs'),path=require('path');
const root=require('path').resolve(__dirname,'..');
let broken=[];
const files=[];(function walk(d){for(const f of fs.readdirSync(d)){const fp=path.join(d,f);if(fs.statSync(fp).isDirectory())walk(fp);else if(/\.(html)$/.test(f))files.push(fp)}})(root);
for(const f of files){const h=fs.readFileSync(f,'utf8');for(const m of h.matchAll(/(?:src|href)="([^"#?]+)"/g)){const u=m[1];if(/^(https?:|mailto:|data:|javascript:)/.test(u))continue;const t=path.resolve(path.dirname(f),u);if(!fs.existsSync(t))broken.push(path.relative(root,f)+' → '+u)}}
ok('Sin rutas rotas en HTML (src/href locales)',broken.length===0,broken.join(', '));
const jsRefs=[];
for(const f of files){const h=fs.readFileSync(f,'utf8');if(/crucigrama-nombres|crossword-full|crossword-cards/.test(h))jsRefs.push(f)}
ok('Sin referencias al crucigrama eliminado',jsRefs.length===0,jsRefs.join(','));
const leftover=require('child_process').execSync(`grep -rln "crucigrama-nombres\\|crossword-full\\|crossword-cards" ${root} --include=*.js --include=*.css --include=*.html --exclude-dir=tests || true`).toString().trim();
ok('Sin referencias a archivos eliminados en JS/CSS/HTML',leftover==='',leftover);
await b.close();
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,900));process.exit(1)});
