const launch=require('./launch');
const BASE='http://localhost:8765/';
let results=[];
function ok(name,cond,extra=''){results.push({name,cond:!!cond});console.log((cond?'PASS ':'FAIL ')+name+(cond?'':' '+extra));}
async function newPage(b,{width=1280,height=900,mobile=false}={}){
  const p=await b.newPage();
  await p.setViewport({width,height,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  p.__errors=[];
  p.on('pageerror',e=>p.__errors.push('pageerror: '+e.message));
  p.on('console',m=>{if(m.type()==='error')p.__errors.push('console: '+m.text())});
  p.on('response',r=>{if(r.status()>=400)p.__errors.push('HTTP '+r.status()+' '+r.url())});
  await p.evaluateOnNewDocument(()=>{
    // Audio simulado: cuenta osciladores iniciados y activos
    window.__aud={started:0,active:0};
    class Osc{constructor(){this.frequency={setValueAtTime(){},exponentialRampToValueAtTime(){}};this.on=false}
      connect(){return this} disconnect(){} start(){window.__aud.started++;window.__aud.active++;this.on=true;}
      stop(){if(this.on){this.on=false;window.__aud.active--;setTimeout(()=>this.onended&&this.onended(),0)}}}
    const g=()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:1},connect(){return this},disconnect(){}});
    window.AudioContext=class{constructor(){this.state='running';this.currentTime=0;this.destination={}}
      createOscillator(){return new Osc()} createGain(){return g()} createDynamicsCompressor(){return g()} resume(){return Promise.resolve()}};
    // Intervalos y temporizadores activos
    window.__iv=new Set();const si=window.setInterval,ci=window.clearInterval;
    window.setInterval=(...a)=>{const id=si(...a);window.__iv.add(id);return id};
    window.clearInterval=(id)=>{window.__iv.delete(id);return ci(id)};
  });
  return p;
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
module.exports={launch,BASE,ok,newPage,sleep,results:()=>results};
