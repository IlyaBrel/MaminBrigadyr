/* ===== Касса бригадира · ядро: справочники, утилиты, хранение, расчёты ===== */
const IC={
 wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2"/><circle cx="16" cy="14.5" r="1.3"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 in:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
 build:'<path d="M3 21h18M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.5 3.6 5.2"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.2-6 8-6s7 2 8 6"/>',
 food:'<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 0-3 2.5-3 6s1 4 3 4v8"/>',
 tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
 box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
 truck:'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
 home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
 dots:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
 cash:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5v5M18 9.5v5"/>',
 alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
 check:'<path d="M5 12.5 10 17l9-10"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 sick:'<path d="M12 3v18M3 12h18"/><rect x="5" y="5" width="14" height="14" rx="4"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 down:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',up:'<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',chev:'<path d="M9 5l7 7-7 7"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 ruler:'<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
 file:'<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>',restore:'<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v5h5"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 fine:'<circle cx="12" cy="12" r="9"/><path d="M8 8l8 8"/>',trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>',
 sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 grad:'<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
 copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
 filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>'
};
const ic=(n,s=20,w=2)=>`<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;
const CATS=['Еда','Инструмент','Материалы','Транспорт','Жильё','Прочее'];
const CAT={'Еда':{c:'#ffb020',ic:'food'},'Инструмент':{c:'#22d3ee',ic:'tool'},'Материалы':{c:'#8b5cff',ic:'box'},'Транспорт':{c:'#2ee59d',ic:'truck'},'Жильё':{c:'#ff6fb5',ic:'home'},'Прочее':{c:'#9aa3b8',ic:'dots'},'Авансы':{c:'#ff7a1a',ic:'cash'},'Зарплата':{c:'#ff2e7e',ic:'wallet'}};
const ST={present:{l:'Вышел',s:'В',c:'#2ee59d',ic:'check'},late:{l:'Опоздал',s:'О',c:'#ffb020',ic:'clock'},absent:{l:'Прогул',s:'П',c:'#ff5468',ic:'x'},off:{l:'Выходной',s:'Вх',c:'#22d3ee',ic:'home'},vac:{l:'Отпуск',s:'От',c:'#a78bfa',ic:'sun'},sick:{l:'Болен',s:'Б',c:'#ff6fb5',ic:'sick'}};
const WORKING=s=>s==='present'||s==='late';
const UNITS=['м²','п.м.','м³','шт'];
const GR=[['#ff9a1a','#ff2e63'],['#22c1ee','#5b4bff'],['#19e3a6','#0a8ad8'],['#ff5fa2','#9a3cff'],['#ffd23f','#ff6a00'],['#8b5cff','#ff2e7e'],['#2ee59d','#11a1b5'],['#ff7a59','#c41e6a']];
const GEN_G=['#ffe08a','#d99a1e'];
const TYPES={income:{l:'Приход',c:'#2ee59d',ic:'in'},transfer:{l:'На объект',c:'#ffc83d',ic:'arrow'},expense:{l:'Расход',c:'#ff7a1a',ic:'minus'},advance:{l:'Аванс',c:'#ff9a1a',ic:'cash'},payout:{l:'Зарплата',c:'#ff2e7e',ic:'wallet'}};

/* ---------- утилиты ---------- */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const sum=(a,f)=>a.reduce((s,x)=>s+(+f(x)||0),0);
const rnd=n=>Math.round(+n||0);
const fmtN=n=>rnd(n).toLocaleString('ru-RU').replace(/ /g,' ');
const money=n=>fmtN(n)+' ₽';
const moneyS=n=>{const a=Math.abs(n);return a>=1e6?(n/1e6).toFixed(1).replace('.',',')+' млн':a>=1e4?Math.round(n/1e3)+' тыс':fmtN(n)+' ₽'};
const iso=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const today=()=>iso(new Date());
const addDays=(s,k)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+k);return iso(d)};
const nowTime=()=>new Date().toTimeString().slice(0,5);
const fdate=d=>d?d.slice(8,10)+'.'+d.slice(5,7):'';
const fdateL=d=>d?new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'}):'';
const fdateW=d=>{if(!d)return '';const t=today();if(d===t)return 'Сегодня';if(d===addDays(t,-1))return 'Вчера';return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})};
const monthName=m=>new Date(m+'-15T12:00:00').toLocaleString('ru-RU',{month:'long',year:'numeric'}).replace(' г.','');
const inFrame=(()=>{try{return window.self!==window.top}catch(e){return true}})();
const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const buzz=(n=8)=>{try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};
const plural=(n,a,b,c)=>{n=Math.abs(n)%100;const m=n%10;return n>10&&n<20?c:m>1&&m<5?b:m===1?a:c};

/* ---------- состояние ---------- */
function defSettings(){return {lastBackup:null,rules:{food:600,advPct:50,reserve:10,backupDays:3},last:{expObj:null,cat:'Еда',advObj:null},tour:null,cmds:[]}}
function blank(){return {v:3,people:[],objects:[],ops:[],fines:[],att:{},out:[],trash:[],settings:defSettings()}}
let S=blank(),view='fin',objTab='kassa',attDate=today(),tabMonth=today().slice(0,7),barSel=null,vtKey=null;

/* ---------- хранение ---------- */
const DB={db:null,
 open(){return new Promise(res=>{try{const r=indexedDB.open('brigada',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>{this.db=r.result;res()};r.onerror=()=>res()}catch(e){res()}})},
 req(fn,mode){return new Promise(res=>{if(!this.db)return res(null);try{const q=fn(this.db.transaction('kv',mode||'readonly').objectStore('kv'));q.onsuccess=()=>res(q.result??null);q.onerror=()=>res(null)}catch(e){res(null)}})},
 get(k){return this.req(s=>s.get(k))},put(k,v){return this.req(s=>s.put(v,k),'readwrite')},del(k){return this.req(s=>s.delete(k),'readwrite')},keys(){return this.req(s=>s.getAllKeys())}};
let saveT;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{const v=JSON.parse(JSON.stringify(S));if(DB.db)DB.put('state',v);else{try{localStorage.setItem('brigada',JSON.stringify(v))}catch(e){}}},200)}
async function snapshot(){if(!DB.db||S.demo)return;const k='snap:'+today();if(await DB.get(k))return;await DB.put(k,{at:Date.now(),data:JSON.parse(JSON.stringify(S))});
  const ks=((await DB.keys())||[]).filter(x=>String(x).startsWith('snap:')).sort().reverse();for(const x of ks.slice(7))await DB.del(x)}
function migrate(d){const s=Object.assign(blank(),d);const ds=defSettings();s.settings=Object.assign(ds,d.settings||{});s.settings.rules=Object.assign(defSettings().rules,s.settings.rules||{});s.settings.last=Object.assign(defSettings().last,s.settings.last||{});
  s.settings.cmds=s.settings.cmds||[];s.trash=(s.trash||[]).filter(x=>Date.now()-x.at<30*864e5);
  s.objects.forEach((o,i)=>{if(o.hue==null)o.hue=i%GR.length;o.people=o.people||[];o.works=o.works||[]});s.v=3;return s}

/* ---------- справка по данным ---------- */
const pById=id=>S.people.find(p=>p.id===id);
const oById=id=>S.objects.find(o=>o.id===id);
const fullName=p=>p?(p.last+' '+p.first).trim():'—';
const shortName=p=>p?(p.last+' '+(p.first?p.first[0]+'.':'')).trim():'—';
const oName=id=>id?(oById(id)?.name||'—'):'Общая касса';
const gOf=o=>o?GR[(o.hue??0)%GR.length]:GEN_G;
const gVars=o=>{const g=gOf(o);return `--g1:${g[0]};--g2:${g[1]}`};
const activeObjs=()=>S.objects.filter(o=>!o.arch);
const activePeople=()=>S.people.filter(p=>!p.gone).sort((a,b)=>fullName(a).localeCompare(fullName(b),'ru'));
const pColor=p=>GR[(p?.id||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0)%GR.length][0];
function avatar(p,cls='',ring=false){let a;if(p&&p.photo)a=`<img class="av ${cls}" src="${p.photo}" alt="">`;else{const i=p?((p.last||'')[0]||'')+((p.first||'')[0]||''):'?';a=`<div class="av ${cls}" style="--c:${pColor(p)}">${esc(i.toUpperCase())}</div>`}return ring?`<span class="avr">${a}</span>`:a}

/* ---------- деньги ---------- */
const SPEND=['expense','advance','payout'];
const catOf=o=>o.type==='expense'?o.cat:o.type==='advance'?'Авансы':'Зарплата';
function kassa(objId){let r=0;for(const o of S.ops){const a=+o.amount||0;
  if(o.type==='income'&&(o.obj||null)===objId)r+=a;
  else if(o.type==='transfer'){if(o.obj===objId)r+=a;if(objId===null)r-=a}
  else if(SPEND.includes(o.type)&&(o.obj||null)===objId)r-=a}return r}
function objStats(id){const recv=sum(S.ops.filter(o=>(o.type==='income'||o.type==='transfer')&&o.obj===id),o=>o.amount);
  const spent=sum(S.ops.filter(o=>SPEND.includes(o.type)&&o.obj===id),o=>o.amount);return {recv,spent,left:recv-spent,pct:recv?Math.min(100,Math.max(0,spent/recv*100)):0}}
function onHands(){return sum(S.ops.filter(o=>o.type==='income'),o=>o.amount)-sum(S.ops.filter(o=>SPEND.includes(o.type)),o=>o.amount)}
function spentOn(d,objId){return sum(S.ops.filter(o=>SPEND.includes(o.type)&&o.date===d&&(!objId||o.obj===objId)),o=>o.amount)}
function earn(pid,objId,from,to){
  const inR=d=>(!from||d>=from)&&(!to||d<=to);
  let days=0,dayMoney=0;
  for(const k in S.att){const i=k.indexOf('|');const oid=k.slice(0,i),d=k.slice(i+1);if(objId&&oid!==objId)continue;if(!inR(d))continue;
    const r=S.att[k][pid];if(r&&WORKING(r.st)){days++;if(r.dp)dayMoney+=+r.rate||0}}
  let outMoney=0;for(const e of S.out){if(objId&&e.obj!==objId)continue;if(!inR(e.date))continue;outMoney+=+(e.shares[pid]||0)}
  const f=o=>o.pid===pid&&(!objId||o.obj===objId)&&inR(o.date);
  const adv=sum(S.ops.filter(o=>o.type==='advance'&&f(o)),o=>o.amount);
  const paid=sum(S.ops.filter(o=>o.type==='payout'&&f(o)),o=>o.amount);
  const fines=sum(S.fines.filter(f),x=>x.amount);
  const earned=dayMoney+outMoney;
  return {days,dayMoney,outMoney,earned,adv,paid,fines,due:earned-adv-paid-fines}}
function envelopes(){const E=S.objects.filter(o=>!o.arch||rnd(kassa(o.id))!==0).map(o=>({id:o.id,name:o.name,v:kassa(o.id),g:gOf(o),o}));E.push({name:'Не распределено',v:kassa(null),g:GEN_G,gen:true});return E}
/* статус человека на сегодня по всем объектам */
function todayStatus(pid,d=today()){let best=null;for(const o of S.objects){const r=S.att[o.id+'|'+d]?.[pid];if(r){if(WORKING(r.st))return {...r,obj:o.id};best=best||{...r,obj:o.id}}}return best}

/* ---------- пример ---------- */
function demo(){const d=n=>addDays(today(),-n);
  const P=(last,first,payType,dayRate,phone)=>({id:uid(),last,first,phone:phone||'',payType,dayRate,note:''});
  const a=P('Иванов','Сергей','day',4000,'+7 912 000-11-22'),b=P('Петров','Алексей','sqm',0),c=P('Сидоров','Михаил','day',3500),e=P('Козлов','Дмитрий','sqm',0),f=P('Морозов','Игорь','day',3800);
  const w1={id:uid(),name:'Штукатурка стен',unit:'м²',price:350},w2={id:uid(),name:'Стяжка пола',unit:'м²',price:280},w3={id:uid(),name:'Откосы',unit:'п.м.',price:400};
  const o1={id:uid(),name:'ЖК Северный, корп. 2',addr:'ул. Ленина, 12',hue:0,people:[a.id,b.id,c.id,e.id],works:[w1,w2,w3],arch:false};
  const o2={id:uid(),name:'Частный дом, Сосновка',addr:'Коттеджный посёлок',hue:1,people:[a.id,c.id,f.id],works:[{id:uid(),name:'Кладка блока',unit:'м³',price:3200}],arch:false};
  const o3={id:uid(),name:'Склад «Логистик»',addr:'Промзона',hue:2,people:[f.id],works:[{id:uid(),name:'Монтаж профлиста',unit:'м²',price:220}],arch:false};
  const s={...blank(),demo:true,people:[a,b,c,e,f],objects:[o1,o2,o3]};
  const op=(type,amount,date,obj,x={})=>s.ops.push({id:uid(),type,amount,date,obj,...x});
  op('income',500000,d(12),null,{note:'От начальника участка'});op('transfer',300000,d(12),o1.id);op('transfer',100000,d(12),o2.id);op('transfer',50000,d(8),o3.id);
  op('expense',7800,d(11),o1.id,{cat:'Еда'});op('expense',23400,d(10),o1.id,{cat:'Инструмент',note:'Перфоратор, диски'});op('expense',6200,d(7),o1.id,{cat:'Еда'});op('expense',5400,d(3),o1.id,{cat:'Еда'});
  op('expense',44000,d(9),o3.id,{cat:'Материалы',note:'Профлист'});op('expense',18000,d(6),o2.id,{cat:'Материалы',note:'Клей для блока'});op('expense',3500,d(4),null,{cat:'Транспорт',note:'Бензин'});op('expense',12000,d(5),o1.id,{cat:'Жильё',note:'Вагончик'});
  op('advance',10000,d(6),o1.id,{pid:b.id});op('advance',8000,d(4),o1.id,{pid:a.id});op('advance',5000,d(2),o2.id,{pid:c.id});op('expense',4100,d(1),o2.id,{cat:'Еда'});op('expense',2600,d(0),o1.id,{cat:'Еда',note:'Обед'});
  for(let i=6;i>=1;i--){const day=d(i);if(new Date(day+'T12:00:00').getDay()===0)continue;const r={};
    r[a.id]={st:i===3?'late':'present',time:i===3?'08:40':'08:00',dp:true,rate:4000};r[b.id]={st:'present',time:'08:05',dp:false,rate:0};
    r[c.id]=i===2?{st:'sick',time:'',dp:false,rate:3500}:{st:'present',time:'07:55',dp:true,rate:3500};r[e.id]=i===4?{st:'off',time:'',dp:false,rate:0}:{st:'present',time:'08:10',dp:false,rate:0};
    s.att[o1.id+'|'+day]=r;s.att[o3.id+'|'+day]={[f.id]:{st:'present',time:'08:00',dp:true,rate:3800}}}
  const t=d(0);s.att[o1.id+'|'+t]={[a.id]:{st:'present',time:'07:58',dp:true,rate:4000},[b.id]:{st:'present',time:'08:03',dp:false,rate:0}};
  s.out.push({id:uid(),date:d(5),obj:o1.id,work:w1.id,wname:w1.name,unit:'м²',vol:120,price:350,total:42000,shares:{[b.id]:24000,[e.id]:18000}});
  s.out.push({id:uid(),date:d(1),obj:o1.id,work:w3.id,wname:w3.name,unit:'п.м.',vol:35,price:400,total:14000,shares:{[b.id]:7000,[e.id]:7000}});
  s.fines.push({id:uid(),pid:a.id,amount:1000,reason:'Опоздание',obj:o1.id,date:d(3)});
  s.settings.last.expObj=o1.id;
  return s}
