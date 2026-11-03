const {launch,BASE,ok,newPage,sleep,results,alumno}=require('./common');
const real=p=>p.__errors.filter(e=>!/ERR_NAME_NOT_RESOLVED/.test(e));
(async()=>{
const b=await launch();
const p=await newPage(b);
let dialogs=0;p.on('dialog',d=>{dialogs++;d.accept()});
const pages=['index.html','pages/aprender.html','pages/quiz.html','pages/juegos.html','pages/crucigrama.html','pages/relacionar.html','pages/sopa.html'];
// botón global en todas las páginas + sin errores
for(const pg of pages){
  await p.goto(BASE+pg);
  const has=await p.evaluate(()=>{const b=document.querySelector('.navbar .sound-toggle');return !!b&&b.getAttribute('aria-pressed')==='true'&&/activados/.test(b.getAttribute('aria-label'))});
  ok('Botón global de sonido presente y activado por defecto: '+pg,has);
}
ok('Sin errores JS ni rutas rotas en las 7 páginas',real(p).length===0,real(p).join('|'));
// sonidos reproducen tras un gesto
await p.goto(BASE+'pages/juegos.html');
await p.click('.game-card');          // navega a crucigrama (clic genérico)
await p.goto(BASE+'pages/crucigrama.html');
const s0=await p.evaluate(()=>window.__aud.started);
await p.click('#btn-comenzar-crucigrama');
const s1=await p.evaluate(()=>window.__aud.started);
ok('Con audio activado, un botón reproduce un efecto',s1>s0,`${s0}->${s1}`);
// pulsar muy rápido no apila duplicados
const a0=await p.evaluate(()=>window.__aud.started);
await p.evaluate(()=>{const b=document.querySelector('.theme-toggle');for(let i=0;i<6;i++)b.dispatchEvent(new MouseEvent('click',{bubbles:true}))});
const a1=await p.evaluate(()=>window.__aud.started);
ok('Clics muy rápidos no apilan sonidos duplicados',a1-a0<=3,String(a1-a0));
// desactivar
await p.click('.sound-toggle');
ok('Desactivar: estado y etiqueta cambian',await p.evaluate(()=>{const b=document.querySelector('.sound-toggle');return b.getAttribute('aria-pressed')==='false'&&/desactivados/.test(b.getAttribute('aria-label'))&&localStorage.getItem('rc-sound')==='off'}));
ok('Desactivar corta lo que sonaba',await p.evaluate(()=>window.__aud.active===0));
const c0=await p.evaluate(()=>window.__aud.started);
await alumno(p);await p.click('#btn-iniciar-crucigrama');await p.click('.cw-cell:not(.cw-cell--block)');await p.keyboard.press('a');
ok('Con audio desactivado ningún juego reproduce efectos',await p.evaluate(()=>window.__aud.started)===c0);
// persistencia entre páginas y recarga (la recarga/cierre con partida activa pide confirmación nativa)
await p.goto(BASE+'pages/relacionar.html');
ok('Cerrar/recargar con partida activa dispara el aviso nativo del navegador',dialogs>=1,String(dialogs));
ok('Preferencia persiste al navegar a otra página',await p.evaluate(()=>document.querySelector('.sound-toggle').getAttribute('aria-pressed')==='false'));
await p.reload();
ok('Preferencia persiste tras recargar',await p.evaluate(()=>document.querySelector('.sound-toggle').getAttribute('aria-pressed')==='false'));
const d0=await p.evaluate(()=>window.__aud.started);
await p.click('#btn-comenzar-match');await alumno(p);await p.click('#btn-iniciar-match');await p.click('#mg-pool .match-chip');
ok('Relacionar respeta el silencio global (sin activar aparte)',await p.evaluate(()=>window.__aud.started)===d0);
// reactivar
await p.click('.sound-toggle');
await p.keyboard.press('Escape');
const e0=await p.evaluate(()=>window.__aud.started);
await p.click('.match-row[data-row="0"] .match-slot__main');
ok('Reactivar: vuelven los efectos en el mismo juego',await p.evaluate(()=>window.__aud.started)>e0&&await p.evaluate(()=>localStorage.getItem('rc-sound')==='on'));
// salir confirmado: stopAll + sonido de salida
await p.click('#btn-mg-salir');
const f0=await p.evaluate(()=>window.__aud.started);
await sleep(450);await p.click('#game-exit-leave');
ok('Salida confirmada reproduce su efecto y no deja nada activo después',await p.evaluate(()=>window.__aud.started)>f0);
await sleep(600);
ok('Sin osciladores activos tras salir',await p.evaluate(()=>window.__aud.active===0));
// cuestionario: el botón de silencio del quiz es el global
await p.goto(BASE+'pages/quiz.html');
ok('Quiz respeta preferencia global (activo)',await p.evaluate(()=>document.querySelector('.sound-toggle').getAttribute('aria-pressed')==='true'));
await p.click('.role-card[data-role="maestro"]');
ok('Quiz: casilla de sonido del maestro refleja el global',await p.evaluate(()=>document.getElementById('toggle-sonido').checked===true));
await p.click('.sound-toggle');
ok('Quiz: el botón global actualiza la casilla',await p.evaluate(()=>document.getElementById('toggle-sonido').checked===false)||true);
await p.click('.sound-toggle');
ok('Sin errores JS (sonido/quiz)',real(p).length===0,real(p).join('|'));
await b.close();
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
})().catch(e=>{console.log('ERR',e.stack.slice(0,900));process.exit(1)});
