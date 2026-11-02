const root=require('path').resolve(__dirname,'..')+'/';
const fs=require('fs'),vm=require('vm');
const {ok,results}=require('./common');
const CV=require(root+'data/crossword/crossword-versions.js');
const Val=require(root+'js/crossword/crossword-validator.js');
const MV=require(root+'data/matching/matching-versions.js');
const WV=require(root+'data/wordsearch/wordsearch-data.js');
const WS=require(root+'js/wordsearch/wordsearch-game.js');
const norm=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

// ===== CRUCIGRAMAS =====
ok('Crucigramas: ≥6 en total (clásico + nuevas)',CV.length+1>=6,String(CV.length+1));
ok('Crucigramas: ≥5 versiones nuevas',CV.length>=5);
let allOk=true,det=[];
for(const v of CV){
  const okL=v.layouts.every(l=>Val.validarLayout(l,v.words).ok);
  const firmas=v.layouts.map(Val.firmaDeCruces);
  let distinct=true;
  for(let i=0;i<firmas.length;i++)for(let j=i+1;j<firmas.length;j++){const inter=[...firmas[i]].filter(x=>firmas[j].has(x)).length;if(inter/(firmas[i].size+firmas[j].size-inter)>=0.5)distinct=false}
  // posiciones realmente distintas
  const posDistintas=new Set(v.layouts.map(l=>JSON.stringify(l.placements.map(p=>[p.word,p.row,p.col,p.dir]).sort()))).size===v.layouts.length;
  det.push(`${v.id}:${v.layouts.length}`);
  if(!(v.layouts.length>=3&&okL&&distinct&&posDistintas&&v.words.length>=10))allOk=false;
}
ok('Cada versión nueva: ≥3 distribuciones válidas, con cruces y posiciones distintas, ≥10 palabras — '+det.join(' '),allOk);
// distribuciones: cada palabra horizontal/vertical coherente (letras en cruces) ya lo valida el validador; probar que el validador detecta errores
const v0=CV[0],l0=JSON.parse(JSON.stringify(v0.layouts[0]));
const roto1=JSON.parse(JSON.stringify(l0));roto1.placements[1].row+=1;
const roto2=JSON.parse(JSON.stringify(l0));roto2.placements[0].word=roto2.placements[0].word.slice(0,-1)+'Z';
ok('El validador rechaza distribuciones mal construidas (desplazada / letra distinta)',!Val.validarLayout(roto1,v0.words).ok&&!Val.validarLayout(roto2,v0.words).ok);
// respuestas distintas entre versiones nuevas
const todas=CV.flatMap(v=>v.words.map(w=>w.word));
ok('Palabras casi sin repetirse entre versiones nuevas (≤10% repetidas)',(todas.length-new Set(todas).size)/todas.length<=0.1,`${todas.length-new Set(todas).size} repetidas de ${todas.length}`);
let leaks=[];
for(const v of CV)for(const e of v.words){const toks=norm(e.clue).match(/[a-zñ]+/g);for(const o of v.words){const ow=norm(o.word);for(const t of toks)if(t===ow||(ow.length>=6&&t.length>=6&&t.slice(0,6)===ow.slice(0,6)))leaks.push(v.id+':'+e.word+'~'+t)}}
ok('Ninguna pista nombra su respuesta ni otra de su versión',leaks.length===0,leaks.join(','));

// ===== RELACIONAR =====
const sandbox={console,Math};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(root+'js/matching/matching-game.js','utf8').replace('if (typeof module','if(false&&typeof module')+';this.crear=crearPartidaMatching',sandbox);
ok('Relacionar: ≥6 versiones (clásica + nuevas)',MV.length+1>=6,String(MV.length+1));
let mOk=true;
for(const v of MV){
  const t=new Set(v.pares.map(p=>p.texto)),c=new Set(v.pares.map(p=>p.concepto)),i=new Set(v.pares.map(p=>p.id));
  if(!(v.pares.length>=7&&t.size===v.pares.length&&c.size===v.pares.length&&i.size===v.pares.length))mOk=false;
}
ok('Relacionar: pares únicos y completos en cada versión nueva',mOk);
// Mezcla: la correspondencia se conserva y las posiciones varían
let corr=true,distintos=new Set(),alineadas=0;
for(const v of MV){
  const items=v.pares.map(p=>({id:p.id,nombre:p.concepto,significado:p.texto,emoji:'x',color:'#000'}));
  for(let k=0;k<200;k++){
    const g=sandbox.crear(items,{});
    // colocar correctamente según id
    g.filas.forEach((f,ri)=>{g.colocar(ri,f.mechanismId)});
    if(g.contarCorrectas()!==g.total)corr=false;
    // y la ficha correcta de cada fila es la que lleva su texto
    g.filas.forEach(f=>{const p=v.pares.find(x=>x.id===f.mechanismId);if(p.texto!==f.significado)corr=false;const ch=g.obtenerFicha(f.mechanismId);if(ch.nombre!==p.concepto)corr=false;});
    distintos.add(g.filas.map(f=>f.mechanismId).join(','));
    if(g.filas.every((f,i)=>f.mechanismId===g.opciones[i].id))alineadas++;
  }
}
ok('Relacionar: tras mezclar, la solución correcta sigue puntuando 100% (1600 partidas)',corr);
ok('Relacionar: el orden de filas varía entre partidas',distintos.size>200,String(distintos.size));
ok('Relacionar: fichas y filas casi nunca quedan alineadas en el mismo orden',alineadas<5,String(alineadas));
// respuesta incorrecta no puntúa (independiente del orden visual)
{const v=MV[0];const items=v.pares.map(p=>({id:p.id,nombre:p.concepto,significado:p.texto}));const g=sandbox.crear(items,{});
 g.filas.forEach((f,ri)=>{const otro=g.opciones.find(o=>o.id!==f.mechanismId&&g.filaDeFicha(o.id)===-1);g.colocar(ri,otro.id)});
 ok('Relacionar: asignaciones erróneas se califican incorrectas',g.contarCorrectas()<g.total);}

// ===== SOPA =====
ok('Sopa: ≥5 versiones',WV.length>=5,String(WV.length));
ok('Sopa: cada versión con ≥10 palabras y sin palabras repetidas/contenidas',WV.every(v=>v.words.length>=10&&new Set(v.words).size===v.words.length&&v.words.every(a=>a!==WS.invertir(a)&&v.words.every(b=>a===b||(!b.includes(a)&&!WS.invertir(b).includes(a))))));
const dirsVistas=new Set();let bien=true,unaVez=true,posDif=new Set(),tamanos=new Set(),porVersion={};
for(const v of WV){
  for(let k=0;k<150;k++){
    const t=WS.generar(v.words);tamanos.add(t.n);
    if(t.n<10||t.n>13)bien=false;
    const part=WS.crearPartidaSopa(t,v.words);
    for(const w of v.words){if(WS.contarOcurrencias(t.grid,w)!==1)unaVez=false}
    for(const c of t.colocadas){
      dirsVistas.add(c.dr+','+c.dc);
      // leer la palabra colocada
      const cells=[];for(let i=0;i<c.word.length;i++)cells.push({r:c.row+c.dr*i,c:c.col+c.dc*i});
      if(cells.some(k=>k.r<0||k.c<0||k.r>=t.n||k.c>=t.n))bien=false;
      const fwd=part.evaluar(cells);
      // reconocimiento inverso (empezando por el otro extremo) en una segunda partida
      const p2=WS.crearPartidaSopa(t,v.words);const rev=p2.evaluar([...cells].reverse());
      if(fwd.tipo!=='correcta'||rev.tipo!=='correcta'||rev.word!==c.word)bien=false;
      // repetida no suma
      const rep=part.evaluar(cells);if(rep.tipo!=='repetida')bien=false;
    }
    if(part.cantidadEncontradas()!==v.words.length||!part.estaCompleta())bien=false;
    porVersion[v.id]=(porVersion[v.id]||new Set()).add(JSON.stringify(t.colocadas.map(c=>[c.word,c.row,c.col,c.dr,c.dc])));
  }
}
ok('Sopa: tableros válidos (10–13), todas las palabras se reconocen en ambos sentidos y las repetidas no cuentan (900 tableros)',bien);
ok('Sopa: cada palabra aparece exactamente una vez en el tablero',unaVez);
ok('Sopa: se usan las 8 direcciones ('+[...dirsVistas].sort().join(' ')+')',dirsVistas.size===8);
ok('Sopa: las posiciones cambian en cada partida (150 tableros distintos por versión)',Object.values(porVersion).every(s=>s.size>=148),JSON.stringify(Object.fromEntries(Object.entries(porVersion).map(([k,s])=>[k,s.size]))));
// cada palabra de cada tablero aparece en las 8 direcciones a lo largo de muchas partidas, y por palabra
const porPalabraDirs={};
for(let k=0;k<400;k++){const v=WV[0];const t=WS.generar(v.words);t.colocadas.forEach(c=>{(porPalabraDirs[c.word]=porPalabraDirs[c.word]||new Set()).add(c.dr+','+c.dc)})}
ok('Sopa: una misma palabra puede caer en direcciones distintas en distintas partidas',Object.values(porPalabraDirs).every(s=>s.size>=6),JSON.stringify(Object.values(porPalabraDirs).map(s=>s.size)));
// selecciones inválidas
{const v=WV[0];const t=WS.generar(v.words);const p=WS.crearPartidaSopa(t,v.words);
 const c=t.colocadas[0];const cells=[];for(let i=0;i<c.word.length-1;i++)cells.push({r:c.row+c.dr*i,c:c.col+c.dc*i});
 ok('Sopa: una selección parcial no cuenta como palabra',p.evaluar(cells).tipo==='incorrecta'&&p.cantidadEncontradas()===0);
 ok('Sopa: lineaEntre rechaza selecciones no alineadas y acepta las 8 direcciones',WS.lineaEntre(10,0,0,1,2)===null&&[[0,3],[3,0],[3,3],[3,-3],[0,-3],[-3,0],[-3,-3],[-3,3]].every(([a,b])=>WS.lineaEntre(10,5,5,5+a,5+b)&&WS.lineaEntre(10,5,5,5+a,5+b).length===4));
 ok('Sopa: ajustarALinea fuerza una línea recta (arrastre torcido)',WS.ajustarALinea(10,5,5,7,6).length>=2&&WS.ajustarALinea(10,5,5,7,6).every((k,i,a)=>i===0||(k.r-a[i-1].r===a[1].r-a[0].r&&k.c-a[i-1].c===a[1].c-a[0].c)));}
const r=results();console.log(`\n${r.filter(x=>x.cond).length}/${r.length} OK`);
