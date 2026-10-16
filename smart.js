/* ===== Касса бригадира · умные функции ===== */

/* ---------- подсказки ---------- */
function hints(){const H=[];const R=S.settings.rules;const hands=onHands();const ppl=activePeople();
  const owe=sum(ppl,p=>Math.max(0,earn(p.id).due));
  if(owe>hands&&owe>0)H.push({c:'#ff5468',ic:'alert',t:`Не хватает ${money(owe-hands)} на зарплаты`,s:`Людям положено ${money(owe)}, на руках ${money(hands)}. Попросите у начальства.`,act:'payroll()'});
  const t=today(),hr=new Date().getHours();
  const notMarked=activeObjs().filter(o=>o.people.some(id=>pById(id)&&!pById(id).gone)&&!S.att[o.id+'|'+t]);
  if(hr>=9&&notMarked.length)H.push({c:'#22d3ee',ic:'check',t:`Перекличка не сделана: ${notMarked.length} ${plural(notMarked.length,'объект','объекта','объектов')}`,s:notMarked.map(o=>o.name).join(', '),act:`openObj('${notMarked[0].id}','att','${t}')`});
  let spent14=0;for(let i=0;i<14;i++)spent14+=spentOn(addDays(t,-i));
  const perDay=spent14/14;if(perDay>0&&hands>0){const d=Math.floor(hands/perDay);H.push({c:d<10?'#ffb020':'#2ee59d',ic:'trend',t:`Денег хватит примерно на ${d} ${plural(d,'день','дня','дней')}`,s:`В среднем уходит ${money(perDay)} в день за последние 2 недели.`,act:"opsQuick('week')"})}
  activeObjs().forEach(o=>{const s=objStats(o.id);if(s.recv>0&&s.left/s.recv<.15)H.push({c:'#ffb020',ic:'build',t:`${o.name}: осталось ${Math.max(0,Math.round(s.left/s.recv*100))}%`,s:`Остаток ${money(s.left)} из ${money(s.recv)}. Переложите деньги из общей кассы.`,act:`fTransfer({obj:'${o.id}'})`})});
  const gen=kassa(null);if(R.reserve>0&&hands>0&&gen<hands*R.reserve/100)H.push({c:'#a78bfa',ic:'shield',t:`Свободных денег меньше запаса`,s:`Ваш запас ${R.reserve}% — это ${money(hands*R.reserve/100)}, а свободно ${money(gen)}.`,act:'fRules()'});
  ppl.forEach(p=>{const e=earn(p.id);if(e.due<0)H.push({c:'#ff6fb5',ic:'user',t:`${shortName(p)} взял больше, чем заработал`,s:`Перебор ${money(-e.due)}. Учтите при следующих авансах.`,act:`go('person:${p.id}')`})});
  const m=t.slice(0,7);const food=sum(S.ops.filter(o=>o.type==='expense'&&o.cat==='Еда'&&o.date.startsWith(m)),o=>o.amount);
  let pd=0;for(const k in S.att)if(k.slice(k.indexOf('|')+1).startsWith(m))pd+=Object.values(S.att[k]).filter(r=>WORKING(r.st)).length;
  if(food&&pd){const per=food/pd;const over=R.food&&per>R.food;H.push({c:over?'#ff7a1a':'#ffb020',ic:'food',t:`Еда: ${money(per)} на человека в день`,s:over?`Выше вашей нормы ${money(R.food)} на ${Math.round((per/R.food-1)*100)}%.`:`В пределах нормы ${money(R.food)}. За месяц ${money(food)}.`,act:"opsQuick('month','Еда')"})}
  const lb=S.settings.lastBackup;const days=lb?(Date.now()-lb)/864e5:999;
  if(!S.demo&&(S.ops.length||S.people.length)&&days>R.backupDays)H.push({c:'#22d3ee',ic:'shield',t:lb?`Копия не сохранялась ${Math.floor(days)} дн.`:'Копия ещё ни разу не сохранялась',s:'Нажмите, чтобы сохранить копию данных.',act:'backup()'});
  return H}

/* ---------- запоминание привычек ---------- */
function suggestAmounts(type,cat,obj){const L=S.ops.filter(o=>o.type===type&&(!cat||o.cat===cat)).slice(-40);const f={};L.forEach((o,i)=>{f[o.amount]=(f[o.amount]||0)+1+i/100});
  return Object.entries(f).sort((a,b)=>b[1]-a[1]).map(x=>+x[0]).filter(x=>x>0).slice(0,2)}
function advRule(pid,amount,editId){const p=pById(pid);if(!p)return '';const pct=S.settings.rules.advPct;if(!pct)return '';const e=earn(pid);
  let adv=e.adv;if(editId){const op=S.ops.find(x=>x.id===editId);if(op&&op.pid===pid)adv-=op.amount}
  if(!e.earned)return `<span class="warn">${esc(shortName(p))} ещё ничего не заработал</span>`;
  const lim=Math.max(0,rnd(e.earned*pct/100-adv));
  if(lim<=0)return `<span class="warn">Лимит аванса исчерпан: правило ${pct}% от заработанного (${money(e.earned)})</span>`;
  if(amount>lim)return `<span class="warn">Больше лимита на ${money(amount-lim)}. По правилу можно до ${money(lim)}</span>`;
  return `По правилу ${pct}% можно выдать ещё до ${money(lim)}`}
function allocPayout(pid,amount){const parts=S.objects.map(o=>({obj:o.id,due:earn(pid,o.id).due})).filter(x=>x.due>0);const tot=sum(parts,x=>x.due);const res=[];let left=rnd(amount);
  if(tot>0&&left>0){const take=Math.min(left,tot);let acc=0;parts.forEach((x,i)=>{let v=i===parts.length-1?take-acc:Math.round(take*x.due/tot);v=Math.min(v,take-acc);if(v>0){res.push({obj:x.obj,amount:v});acc+=v}});left-=acc}
  if(left>0)res.push({obj:null,amount:left});return res}

/* ---------- зарплата всем сразу ---------- */
function payroll(){const L=activePeople().map(p=>({p,e:earn(p.id)})).filter(x=>x.e.due>0);
  if(!L.length)return sheet('Зарплата',`<div class="empty">${ic('check',30)}Со всеми рассчитались. Долгов перед людьми нет</div>`);
  sheet('Выдать зарплату',`<p class="hint">Отметьте, кому платите. В режиме «Авто» деньги спишутся из касс тех объектов, где человек заработал.</p>
  ${F('Откуда платить',`<select name="src" id="prSrc"><option value="__auto" selected>Авто: из касс объектов</option>${objOptions(null,true,true)}</select>`)}
  <div class="shares">${L.map(({p,e})=>`<label class="share">${'<input type="checkbox" name="c_'+p.id+'" checked class="prc" data-pid="'+p.id+'">'}${avatar(p,'sm')}<span>${esc(shortName(p))}<small class="mut" style="display:block;font-size:11.5px;font-weight:600">к выдаче ${money(e.due)}</small></span><input type="number" inputmode="numeric" name="a_${p.id}" value="${rnd(e.due)}" class="pra" data-pid="${p.id}" aria-label="Сумма для ${esc(shortName(p))}"></label>`).join('')}</div>
  <div class="tot-line">Итого к выплате<b id="prTot">0 ₽</b></div><div id="prWarn" style="display:grid;gap:6px"></div>`,
  fd=>{const sel=L.filter(({p})=>fd['c_'+p.id]&&+fd['a_'+p.id]>0);if(!sel.length)return toast('Никто не выбран'),false;let tot=0;
    sel.forEach(({p})=>{const a=rnd(fd['a_'+p.id]);tot+=a;if(fd.src==='__auto')allocPayout(p.id,a).forEach(x=>saveOp({type:'payout',pid:p.id,amount:x.amount,obj:x.obj,date:today(),note:'Зарплата'}));else saveOp({type:'payout',pid:p.id,amount:a,obj:fd.src||null,date:today(),note:'Зарплата'})});
    toast(`Выплачено ${sel.length} ${plural(sel.length,'человеку','людям','людям')}: ${money(tot)}`);setTimeout(confetti,300)},'Выплатить');
  const upd=()=>{const f=$('#shf');let tot=0;const need={};L.forEach(({p})=>{if(!f['c_'+p.id].checked)return;const a=rnd(f['a_'+p.id].value);tot+=a;
      if(f.src.value==='__auto')allocPayout(p.id,a).forEach(x=>need[x.obj||'']=(need[x.obj||'']||0)+x.amount);else need[f.src.value]=(need[f.src.value]||0)+a});
    $('#prTot').textContent=money(tot);$('#okBtn').textContent=tot?'Выплатить '+money(tot):'Выплатить';
    $('#prWarn').innerHTML=Object.entries(need).filter(([o,a])=>a>kassa(o||null)).map(([o,a])=>`<div class="warnbox" style="--c:#ffb020">${ic('alert',18)}<span>В кассе «${esc(oName(o||null))}» ${money(kassa(o||null))}, а нужно ${money(a)}</span></div>`).join('')+(tot>onHands()?`<div class="warnbox" style="--c:#ff5468">${ic('alert',18)}<span>На руках всего ${money(onHands())} — не хватит ${money(tot-onHands())}</span></div>`:'')};
  $('#shf').addEventListener('input',upd);$('#shf').addEventListener('change',upd);upd()}

/* ---------- умный ввод: разбор фраз ---------- */
const KW={
 'Еда':['еда','еду','еды','обед','ужин','завтрак','продукт','магазин','кафе','столов','вода','воду','хлеб','перекус','шаурм','пицц','чай','кофе','питан','пятерочк','магнит','поесть'],
 'Транспорт':['бензин','топлив','заправ','такси','дорог','газел','доставк','проезд','билет','солярк','дизел','парковк','транспорт','автобус','перевоз','машин'],
 'Инструмент':['инструмент','диск','перфоратор','сверл','болгарк','шуруповерт','бур','бит','лобзик','уровень','рулетк','миксер','пила','пилу','насадк','аккумулятор','зарядк','молоток','кельм','шпател','валик','кисть','кисти','перчатк','удлинител'],
 'Материалы':['материал','цемент','клей','профил','гипс','краск','шпаклев','блок','кирпич','доск','саморез','дюбел','грунт','песок','смес','арматур','плитк','герметик','пена','пену','скотч','пленк','сетк','мешк','гипсокартон','утеплител','брус','провод','кабель','труб'],
 'Жильё':['жиль','квартир','аренд','вагончик','хостел','гостиниц','коммунал','общаг','ночлег','съем'],
};
const INT={income:['получил','получила','получили','пришл','приход','поступ','зашл','выдали','дали','прислал','начальник'],
 transfer:['перевел','перекин','распредел','отлож','закинул','положил','конверт'],
 advance:['аванс'],payout:['зарплат','зп','выплат','расчет','рассчит','получк'],fine:['штраф','оштраф'],
 expense:['купил','купили','потратил','потратили','расход','оплатил','заплатил','покупк','купить'],
 roll:['перекличк','отметить','вышли','табель']};
const STOPW=['на','от','для','в','во','за','по','у','с','и','мне','это','руб','р','из','к','а','же','еще','сегодня','вчера','позавчера','было','всего','всем','рублей'];
const stem=w=>w.length>5?w.slice(0,w.length-2):w.length>3?w.slice(0,w.length-1):w;
function parseCmd(raw){
  const R={raw,type:null,amount:null,obj:undefined,cat:null,pid:null,pids:[],note:'',date:today(),work:null,vol:null,unit:null,all:false,missing:[]};
  let s=(' '+String(raw||'')+' ').toLowerCase().replace(/ё/g,'е').replace(/₽/g,' р ')
    .replace(/(?<=[\s\d])(кв\.?\s?м|м\s?2|м²)(?=[\s.,]|$)/g,' м2 ').replace(/(?<=[\s\d])(м\s?3|м³|куб[а-я]*)(?=[\s.,]|$)/g,' м3 ').replace(/(?<=[\s\d])(п\.\s?м\.?|пм|погон[а-я]*)(?=[\s.,]|$)/g,' пм ').replace(/(?<=[\s\d])(шт\.?|штук[аи]?)(?=[\s.,]|$)/g,' шт ').replace(/квадрат[а-я]*/g,' м2 ')
    .replace(/(\d)\s(?=\d{3}(?!\d))/g,'$1').replace(/(\d),(\d)/g,'$1.$2').replace(/(\d)([a-zа-я])/gi,'$1 $2').replace(/[,;!?«»"()]/g,' ');
  const T=s.split(/\s+/).map(t=>t.replace(/^[.:-]+|[.:-]+$/g,'')).filter(Boolean);const used=T.map(()=>false);const nums=[];
  const K=['к','k','тыс','тысяч','тысячи','тысяча','т','косых','косарей','косаря'],M=['млн','миллион','миллиона','лям','ляма'],RU=['р','руб','рублей','рубля','рубль'],U={'м2':'м²','м3':'м³','пм':'п.м.','шт':'шт'};
  T.forEach((t,i)=>{if(t==='позавчера'){R.date=addDays(today(),-2);used[i]=true}else if(t==='вчера'){R.date=addDays(today(),-1);used[i]=true}else if(t==='сегодня')used[i]=true});
  for(let i=0;i<T.length;i++){const t=T[i];if(used[i]||!/^\d+(\.\d+)?$/.test(t))continue;const v=parseFloat(t),nx=T[i+1]||'';
    if(/^\d{1,2}\.\d{2}$/.test(t)&&![...K,...M,...RU,...Object.keys(U)].includes(nx)){const [dd,mm]=t.split('.').map(Number);if(dd>=1&&dd<=31&&mm>=1&&mm<=12){let y=+today().slice(0,4);let d=`${y}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}`;if(d>today())d=`${y-1}${d.slice(4)}`;R.date=d;used[i]=true;continue}}
    if(K.includes(nx)){R.amount=v*1000;used[i]=used[i+1]=true;i++;continue}
    if(M.includes(nx)){R.amount=v*1e6;used[i]=used[i+1]=true;i++;continue}
    if(U[nx]){R.vol=v;R.unit=U[nx];used[i]=used[i+1]=true;i++;continue}
    if(RU.includes(nx)){R.amount=v;used[i]=used[i+1]=true;i++;continue}
    nums.push({v,i})}
  const has=(list,i)=>list.some(k=>T[i].startsWith(k));const flags={};
  T.forEach((t,i)=>{if(used[i]||/^\d/.test(t))return;for(const k in INT)if(has(INT[k],i)){flags[k]=true;used[i]=true;break}if(t==='всем'||t==='всех'||t==='все'){R.all=true}});
  /* люди */
  const pTok=[];activePeople().forEach(p=>{const ls=stem((p.last||'').toLowerCase().replace(/ё/g,'е')),fs=stem((p.first||'').toLowerCase().replace(/ё/g,'е'));
    T.forEach((t,i)=>{if(used[i]||t.length<3)return;if((ls.length>=3&&t.startsWith(ls))||(fs.length>=4&&t.startsWith(fs))){used[i]=true;pTok.push(i);if(!R.pids.includes(p.id))R.pids.push(p.id)}})});
  R.pid=R.pids[0]||null;
  /* объекты */
  let best=null,bs=0;const OST=['корп','корпус','частный','объект','улица','квартал','жилой'];
  S.objects.forEach(o=>{const ws=(o.name||'').toLowerCase().replace(/ё/g,'е').split(/[^a-zа-я0-9]+/).filter(w=>w.length>=4&&!OST.includes(w)).map(stem);let sc=0;const hit=[];
    T.forEach((t,i)=>{if(used[i]||t.length<4)return;if(ws.some(w=>t.startsWith(w)||w.startsWith(t))){sc++;hit.push(i)}});if(sc>bs||(sc===bs&&sc&&!o.arch&&best&&best.o.arch)){bs=sc;best={o,hit}}});
  if(best){R.obj=best.o.id;best.hit.forEach(i=>used[i]=true)}
  if(T.some((t,i)=>!used[i]&&(t==='общ'||t.startsWith('общую')||t.startsWith('общей')))){R.obj=null;T.forEach((t,i)=>{if(t.startsWith('общ')||t.startsWith('касс'))used[i]=true})}
  /* работы */
  const objsForWork=R.obj?[oById(R.obj)]:S.objects.filter(o=>!o.arch);
  for(const o of objsForWork){for(const w of o.works){const st=stem(w.name.toLowerCase().replace(/ё/g,'е').split(/\s+/)[0]);const i=T.findIndex((t,k)=>!used[k]&&t.length>=4&&t.startsWith(st));if(i>=0){R.work=w.id;R.workObj=o.id;used[i]=true;T.forEach((t,k)=>{if(!used[k]&&w.name.toLowerCase().includes(t)&&t.length>=4)used[k]=true});break}}if(R.work)break}
  /* категория */
  const catTok=[];for(const c in KW){T.forEach((t,i)=>{if(!used[i]&&KW[c].some(k=>t.startsWith(k))){if(!R.cat)R.cat=c;catTok.push(i)}})}
  /* что это */
  let type=null;
  if(flags.roll)type='roll';else if(flags.fine)type='fine';else if(flags.advance)type='advance';else if(flags.payout)type='payout';
  else if(R.vol!=null||(R.work&&!R.amount&&!flags.expense))type='output';
  else if(flags.income)type='income';
  else if(flags.transfer||(R.obj&&T.some((t,i)=>t==='на'&&T[i+1]&&best&&best.hit.includes(i+1))&&!R.cat&&!R.pid&&!flags.expense))type='transfer';
  else if(R.cat||flags.expense)type='expense';
  else if(R.pid&&(R.amount||nums.length))type='advance';
  else if(R.amount||nums.length)type='expense';
  R.type=type;
  if(type==='income'||type==='transfer'){pTok.forEach(i=>used[i]=false);R.pids=[];R.pid=null}
  if(type==='output'&&R.vol==null&&nums.length){R.vol=nums[0].v;used[nums[0].i]=true;nums.shift()}
  if(R.amount==null&&nums.length){const n=nums.reduce((a,b)=>b.v>a.v?b:a);R.amount=n.v;used[n.i]=true}
  if(R.amount!=null)R.amount=rnd(R.amount);
  const rest=T.filter((t,i)=>!used[i]&&!/^\d/.test(t)&&!STOPW.includes(t));const keep=T.filter((t,i)=>(!used[i]||catTok.includes(i))&&!/^\d/.test(t)&&!STOPW.includes(t));
  if(type==='expense'){if(!R.cat)R.cat='Прочее';let n=keep.filter(t=>!['еда','еду','еды','расход','расходы'].includes(t)).join(' ');if(n===R.cat.toLowerCase())n='';R.note=n?n[0].toUpperCase()+n.slice(1):''}
  else if(type==='income'){const n=T.filter((t,i)=>!used[i]&&!/^\d/.test(t)&&!['р','руб','рублей'].includes(t)).join(' ');R.note=n?n[0].toUpperCase()+n.slice(1):''}
  else if(type==='fine'){const n=rest.join(' ');R.note=n?n[0].toUpperCase()+n.slice(1):'Нарушение'}
  else R.note=rest.join(' ');
  /* значения по умолчанию */
  if(type==='expense'&&R.obj===undefined)R.obj=S.settings.last.expObj&&oById(S.settings.last.expObj)&&!oById(S.settings.last.expObj).arch?S.settings.last.expObj:null;
  if(type==='income'&&R.obj===undefined)R.obj=null;
  if((type==='advance'||type==='fine')&&R.obj===undefined&&R.pid)R.obj=defaultObjFor(R.pid);
  if(type==='output'&&!R.obj&&R.workObj)R.obj=R.workObj;
  if(type==='output'&&!R.obj&&R.pid){const os=activeObjs().filter(o=>o.people.includes(R.pid));if(os.length===1)R.obj=os[0].id}
  if(type==='payout'&&R.pid&&R.amount==null)R.amount=Math.max(0,rnd(earn(R.pid).due));
  /* чего не хватает */
  const need=(c,l)=>{if(c)R.missing.push(l)};
  if(['income','transfer','expense','advance','fine'].includes(type))need(!R.amount,'сумма');
  if(type==='transfer')need(!R.obj,'объект');
  if(['advance','fine'].includes(type))need(!R.pid,'человек');
  if(type==='payout'&&!R.all){need(!R.pid,'человек');need(R.pid&&!R.amount,'сумма')}
  if(type==='output'){need(!R.obj,'объект');need(!R.work,'работа');need(R.vol==null,'объём')}
  return R}
function cmdTitle(R){const p=pById(R.pid);switch(R.type){
  case 'income':return ['Приход','in','#2ee59d',R.note||'Получено от начальства'];case 'transfer':return ['Перевод на объект','arrow','#ffc83d',R.obj?oName(R.obj):'Выберите объект'];
  case 'expense':return ['Расход · '+R.cat,CAT[R.cat]?.ic||'minus',CAT[R.cat]?.c||'#ff7a1a',R.note||R.cat];case 'advance':return ['Аванс','cash','#ff9a1a',p?fullName(p):'Кому?'];
  case 'payout':return [R.all?'Зарплата всем':'Зарплата','wallet','#ff2e7e',R.all?'Откроется расчёт по всей бригаде':p?fullName(p):'Кому?'];case 'fine':return ['Штраф','fine','#ff5468',(p?shortName(p)+' · ':'')+R.note];
  case 'output':{const o=oById(R.obj||R.workObj);const w=o?.works.find(x=>x.id===R.work);return ['Выработка','ruler','#8b5cff',w?`${w.name} · ${R.vol??'?'} ${w.unit}`:'Работа?']}
  case 'roll':return ['Перекличка','check','#22d3ee','Откроется отметка людей'];default:return null}}
function cmdPreview(R){const tt=cmdTitle(R);if(!tt)return `<div class="hint" style="text-align:center;padding:6px">${R.raw.trim()?'Не понял. Попробуйте так: «еда 3500», «аванс Иванову 5000», «получил 200к»':'Пишите как удобно — приложение поймёт само'}</div>`;
  const [l,i,c,sub]=tt;const tags=[];
  if(['income','expense','advance','payout','fine','transfer'].includes(R.type)&&!(R.type==='payout'&&R.all))tags.push(R.type==='fine'?(R.obj?oName(R.obj):'Без объекта'):'Касса: '+(R.type==='payout'&&!R.obj?'авто по объектам':oName(R.obj)));
  if(R.type==='output'&&R.obj)tags.push(oName(R.obj));if(R.pids.length>1||(R.type==='output'&&R.pids.length))tags.push(R.pids.map(x=>shortName(pById(x))).join(', '));
  tags.push(fdateW(R.date));
  let warn='';if(['expense','advance','payout'].includes(R.type)&&R.amount&&!(R.type==='payout'&&!R.obj)){const have=kassa(R.obj||null);if(R.amount>have)warn=`<div class="warnbox" style="--c:#ffb020">${ic('alert',18)}<span>В кассе «${esc(oName(R.obj||null))}» ${money(have)} — не хватит ${money(R.amount-have)}</span></div>`}
  if(R.type==='advance'&&R.pid&&R.amount){const r=advRule(R.pid,R.amount);if(r.includes('warn'))warn+=`<div class="warnbox" style="--c:#ff7a1a">${ic('alert',18)}<span>${r.replace(/<[^>]+>/g,'')}</span></div>`}
  return `<div class="pv" style="--c:${c}"><div class="ph"><span class="oi">${ic(i,20,2.2)}</span><div style="min-width:0"><b>${esc(l)}</b><small>${esc(sub)}</small></div>${R.amount&&R.type!=='output'?`<div class="pamt">${money(R.amount)}</div>`:''}</div>
   <div class="tags">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}${R.missing.map(m=>`<span class="miss">нужно: ${m}</span>`).join('')}</div>${warn}</div>`}
function commitCmd(R){const rem=()=>{const c=S.settings.cmds;const i=c.indexOf(R.raw.trim());if(i>=0)c.splice(i,1);c.unshift(R.raw.trim());c.length=Math.min(c.length,8)};
  const undoOp=op=>()=>{S.ops=S.ops.filter(x=>x.id!==op.id)};
  if(R.type==='roll'){rem();later(quickRoll);return}
  if(R.type==='payout'&&(R.all||!R.pid)){rem();later(payroll);return}
  if(R.type==='output'){rem();if(R.obj)later(()=>fOutput(R.obj,{work:R.work,vol:R.vol,pids:R.pids,date:R.date}));else later(quickOut);return}
  if(R.missing.length){rem();const pre={amount:R.amount||'',obj:R.obj,date:R.date,note:R.note,pid:R.pid||undefined,cat:R.cat,reason:R.note};
    later(()=>({income:fIncome,transfer:fTransfer,expense:fExpense,advance:fAdvance,fine:fFine,payout:fPayout})[R.type](pre));return}
  rem();let op,msg;
  if(R.type==='fine'){const f={id:uid(),pid:R.pid,amount:R.amount,reason:R.note||'Нарушение',obj:R.obj||null,date:R.date};S.fines.push(f);closeSheet();save();render();toast('Штраф: '+shortName(pById(R.pid))+' −'+money(R.amount),()=>{S.fines=S.fines.filter(x=>x.id!==f.id)});return}
  if(R.type==='payout'&&!R.obj){const ids=allocPayout(R.pid,R.amount).map(x=>saveOp({type:'payout',pid:R.pid,amount:x.amount,obj:x.obj,date:R.date,note:R.note}).id);closeSheet();save();render();toast('Выплачено '+shortName(pById(R.pid))+': '+money(R.amount),()=>{S.ops=S.ops.filter(x=>!ids.includes(x.id))});if(earn(R.pid).due===0)setTimeout(confetti,300);return}
  const rec={type:R.type,amount:R.amount,obj:R.obj||null,date:R.date,note:R.note};if(R.type==='expense'){rec.cat=R.cat;S.settings.last.expObj=R.obj||null;S.settings.last.cat=R.cat}if(R.pid)rec.pid=R.pid;
  op=saveOp(rec);msg={income:'+'+money(R.amount)+' в кассе',transfer:'Передано: '+oName(R.obj),expense:R.cat+': −'+money(R.amount),advance:'Аванс: '+shortName(pById(R.pid))+' '+money(R.amount),payout:'Выплачено '+money(R.amount)}[R.type];
  closeSheet();save();render();toast(msg,undoOp(op));if(R.type==='income')setTimeout(confetti,300)}
function dat(p){const l=p.last||'';return /[вн]$/i.test(l)?l+'у':l}
function smartExamples(){const ex=['еда 3500','получил 200к','бензин 1500 вчера'];const p=activePeople();const o=activeObjs();
  if(p[0])ex.splice(1,0,`аванс ${dat(p[0])} 5000`);if(p[1])ex.push(`штраф ${dat(p[1])} 1000 опоздание`);
  if(o[0]){const w=(o[0].name.split(/[^А-Яа-яЁё]+/).find(x=>x.length>=5)||'').toLowerCase();if(w)ex.push(`${w} материалы 12000`)}
  const ow=o.find(x=>x.works.length&&x.people.length);if(ow){const pp=pById(ow.people.find(id=>pById(id)?.payType==='sqm')||ow.people[0]);if(pp)ex.push(`${pp.last} 20 м2 ${ow.works[0].name.split(' ')[0].toLowerCase()}`)}
  ex.push('зарплата всем');return ex}
let exI=0;function smartExample(){const e=smartExamples();return e[exI%e.length]}
function smartSheet(pre=''){const ex=smartExamples();const rec=S.settings.cmds||[];
  const f=sheet(`${ic('bolt',20,2.2).replace('class="i"','class="i" style="display:inline;vertical-align:-3px;color:var(--gold)"')} Умный ввод`,`
  <div class="cmd"><input id="cmdIn" value="${esc(pre)}" placeholder="Например: еда 3500" autocomplete="off" autocapitalize="off" enterkeyhint="done" aria-label="Что записать">${Voice.ok?`<button type="button" class="mic" id="micBtn" aria-label="Сказать голосом">${ic('mic',22)}</button>`:''}</div>
  <div id="cmdPv"></div>
  <div style="display:grid;gap:8px"><span class="hint">Примеры — нажмите, чтобы попробовать</span><div class="sugg">${ex.map(x=>`<button type="button" onclick="cmdSet(this.textContent)">${esc(x)}</button>`).join('')}</div></div>
  ${rec.length?`<div style="display:grid;gap:8px"><span class="hint">Недавние</span><div class="sugg">${rec.map(x=>`<button type="button" onclick="cmdSet(this.textContent)"><em>↺</em> ${esc(x)}</button>`).join('')}</div></div>`:''}
  <p class="hint">Понимает суммы «5к», «200 тыс», даты «вчера», «15.10», фамилии в любом падеже, объекты по слову из названия, статьи расходов по смыслу: «бензин» — транспорт, «диски» — инструмент.</p>`,
  ()=>{const R=parseCmd($('#cmdIn').value);if(!R.type)return toast('Не понял. Посмотрите примеры ниже'),false;commitCmd(R);return false},'Записать');
  const inp=$('#cmdIn');const upd=()=>{const R=parseCmd(inp.value);$('#cmdPv').innerHTML=inp.value.trim()?cmdPreview(R):'';const b=$('#okBtn');
    b.disabled=!R.type;b.innerHTML=!R.type?'Записать':R.type==='roll'?'Открыть перекличку':R.type==='output'?'Распределить выработку':(R.type==='payout'&&(R.all||!R.pid))?'Открыть расчёт':R.missing.length?'Дополнить в форме':'Записать'};
  inp.addEventListener('input',upd);upd();setTimeout(()=>{try{inp.focus()}catch(e){}},350);
  const mb=$('#micBtn');if(mb)mb.onclick=()=>{if(Voice.r){Voice.stop();mb.classList.remove('on');return}mb.classList.add('on');buzz(10);Voice.start((t,fin)=>{inp.value=t;upd()},()=>mb.classList.remove('on'))}}
function cmdSet(t){const i=$('#cmdIn');i.value=t;i.dispatchEvent(new Event('input'));buzz(4)}

/* ---------- голос ---------- */
const Voice={ok:!inFrame&&!!(window.SpeechRecognition||window.webkitSpeechRecognition),r:null,
  start(onText,onEnd){try{const C=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new C();r.lang='ru-RU';r.interimResults=true;r.maxAlternatives=1;
    r.onresult=e=>{let t='';for(const x of e.results)t+=x[0].transcript;onText(t,e.results[e.results.length-1].isFinal)};
    r.onend=()=>{this.r=null;onEnd&&onEnd()};r.onerror=e=>toast(e.error==='not-allowed'?'Нет доступа к микрофону':e.error==='network'?'Для голоса нужен интернет':'Не расслышал, попробуйте ещё раз');this.r=r;r.start()}catch(e){toast('Голосовой ввод недоступен');onEnd&&onEnd()}},
  stop(){try{this.r&&this.r.stop()}catch(e){}this.r=null}};
