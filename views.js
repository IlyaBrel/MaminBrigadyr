/* ===== Касса бригадира · экраны ===== */

/* ---------- конверты ---------- */
function envBar(){const E=envelopes().filter(x=>x.v>0);const tot=sum(E,x=>x.v);if(!tot)return '<span class="envbar"></span><span class="envlg"><span><em>Денег пока нет — нажмите «Получил»</em></span></span>';
  return `<span class="envbar">${E.map((x,i)=>`<i style="flex:${Math.round(x.v)} 1 0;background:linear-gradient(90deg,${x.g[0]},${x.g[1]});--i:${i}"></i>`).join('')}</span>
  <span class="envlg">${E.slice(0,4).map(x=>`<span><i style="background:${x.g[0]}"></i><em>${esc(x.name)}</em></span>`).join('')}${E.length>4?`<span><em>ещё ${E.length-4}</em></span>`:''}</span>`}

/* ---------- КАССА ---------- */
function vFin(){const hands=onHands(),gen=kassa(null),onObj=sum(S.objects,o=>kassa(o.id));const owe=sum(activePeople(),p=>Math.max(0,earn(p.id).due));
  const h=new Date().getHours();const hi=h<5?'Доброй ночи':h<12?'Доброе утро':h<18?'Добрый день':'Добрый вечер';
  const lb=S.settings.lastBackup;const bkLate=!S.demo&&(S.ops.length||S.people.length)&&(!lb||(Date.now()-lb)/864e5>S.settings.rules.backupDays);
  const hero=window.City&&City.ok?`<section class="hero rise" id="hero" style="--i:1">
     <div class="city" id="cityHost"></div>
     <div class="hero-ov"><div class="lbl"><span class="live"></span>На руках всего</div><div class="big ${hands<0?'neg':''}">${odo(hands,'hands')}</div>
       <button class="env" id="envBtn" onclick="whereMoney()" aria-label="Где лежат деньги">${envBar()}</button></div>
     <div class="hint3d">${ic('build',14)}Крутите город пальцем</div></section>`
   :`<div class="c3d rise" id="hero" style="--i:1"><div class="bal idle" id="bal"><div class="lbl">На руках всего</div><div class="big">${odo(hands,'hands')}</div><button class="env" id="envBtn" onclick="whereMoney()" aria-label="Где лежат деньги">${envBar()}</button></div></div>`;
  return `${S.demo&&!(window.Tour&&Tour.on)?`<div class="hint-c banner rise" style="--c:#ffc83d"><div class="hi">${ic('spark',20)}</div><div style="flex:1"><b>Это пример с вымышленными данными</b><small>Посмотрите, как всё устроено, потом очистите и начните своё.</small><div class="acts" style="margin-top:10px"><button class="btn sm pri" onclick="clearDemo()">Очистить пример</button><button class="btn sm" onclick="Tour.start()">${ic('grad',16)}Обучение</button></div></div></div>`:''}
  <div class="top rise"><div class="grow"><div class="hello">${hi} · ${new Date().toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}</div><h1>Касса бригадира</h1></div>
   <button class="ib" onclick="go('ops')" aria-label="Поиск операций">${ic('search',20)}</button><button class="ib" id="gearBtn" onclick="go('more')" aria-label="Отчёты и настройки">${ic('gear',20)}${bkLate?'<span class="badge">!</span>':''}</button></div>
  ${hero}
  <div class="kpis rise" style="--i:2">
   <button class="kpi" style="--c:${GR[0][0]}" onclick="whereMoney()"><small><i></i>На объектах</small><b>${cnt(onObj,'onobj')}</b></button>
   <button class="kpi" style="--c:${GEN_G[0]}" onclick="whereMoney()"><small><i></i>Свободно</small><b>${cnt(gen,'gen')}</b></button>
   <button class="kpi" style="--c:#ff2e7e" onclick="payroll()"><small><i></i>Долг людям</small><b class="${owe>hands?'neg':''}">${cnt(owe,'owe')}</b></button></div>
  <div class="smart rise" id="smart" style="--i:3"><button type="button" onclick="smartSheet()"><span class="sp-ic">${ic('bolt',20,2.2)}</span><span class="ph" id="smartPh">Напишите или скажите: <b>«${esc(smartExample())}»</b></span>${Voice.ok?ic('mic',20):''}</button></div>
  <div class="quick rise" id="quick" style="--i:4">${[['in','Получил','#2ee59d','#0ea5a0','fIncome()'],['arrow','На объект','#ffc83d','#ff7a1a','fTransfer()'],['minus','Расход','#ff7a1a','#ff2e63','fExpense()'],['cash','Аванс','#ff6fb5','#9a3cff','fAdvance()'],['wallet','Зарплата','#8b5cff','#3b5bff','payroll()']].map(([i,l,a,b,f],k)=>`<button class="qa" style="--i:${k}" onclick="${f}"><span style="--g:linear-gradient(140deg,${a},${b});--sh:${b}">${ic(i,24,2.2)}</span>${l}</button>`).join('')}</div>
  ${todayBlock()}
  ${hintsBlock()}
  <h2 class="sec reveal">Деньги по объектам<button class="lnk" onclick="go('objs')">Все</button></h2>
  <div class="cf" id="cf">${activeObjs().map(o=>{const s=objStats(o.id);return `<button class="oc" data-vt="obj:${o.id}" style="${gVars(o)}" onclick="openObj('${o.id}')">${ringSVG(s.pct)}<div class="on">${esc(o.name)}</div><div class="ol">Остаток</div><div class="ov">${money(s.left)}</div><div class="om">из ${money(s.recv)} · ${o.people.length} чел.</div></button>`}).join('')}<button class="oc add" onclick="fObject()">${ic('plus',28)}Новый объект</button></div>
  <div class="dots" id="cfd">${activeObjs().map(()=>'<i></i>').join('')}<i></i></div>
  ${chartsBlock()}
  <h2 class="sec reveal">Последние операции<button class="lnk" onclick="go('ops')">Все операции</button></h2>${opsList(S.ops,6)}`}

function todayBlock(){const t=today();const objs=activeObjs().filter(o=>o.people.some(id=>pById(id)&&!pById(id).gone));
  const rows=objs.map(o=>{const ppl=o.people.filter(id=>pById(id)&&!pById(id).gone);const day=S.att[o.id+'|'+t]||{};const m=ppl.filter(id=>day[id]).length;
    const [l,c]=m===ppl.length?['Готово','#2ee59d']:m?[`${m} из ${ppl.length}`,'#ffb020']:['Отметить','#ff2e7e'];
    return `<button class="tdrow" onclick="openObj('${o.id}','att','${t}')">${miniRing(m,ppl.length,gOf(o)[0],gOf(o)[1])}<span class="t"><b>Перекличка · ${esc(o.name)}</b><small>${ppl.filter(id=>day[id]&&WORKING(day[id].st)).length} на работе</small></span><span class="st" style="--c:${c}">${l}</span></button>`}).join('');
  const sp=spentOn(t);const outs=S.out.filter(e=>e.date===t);
  return `<h2 class="sec reveal" id="todayH">Сегодня<span class="mut" style="letter-spacing:0;text-transform:none">${fdateL(t)}</span></h2><div class="today reveal" id="today">
   ${rows||`<div class="empty">${ic('users',26)}Добавьте объект и людей, и здесь появится ежедневная перекличка</div>`}
   <button class="tdrow" onclick="opsQuick('today')"><span class="mring" style="display:grid;place-items:center;border-radius:12px;background:color-mix(in srgb,#ff7a1a 18%,transparent);color:#ff7a1a">${ic('minus',20)}</span><span class="t"><b>Потрачено сегодня</b><small>${S.ops.filter(o=>o.date===t&&SPEND.includes(o.type)).length} операций</small></span><span class="st" style="--c:#ff7a1a">${money(sp)}</span></button>
   ${outs.length?`<div class="tdrow" style="cursor:default"><span class="mring" style="display:grid;place-items:center;border-radius:12px;background:rgba(139,92,255,.18);color:#8b5cff">${ic('ruler',20)}</span><span class="t"><b>Выработка сегодня</b><small>${outs.map(e=>e.wname).join(', ')}</small></span><span class="st" style="--c:#8b5cff">${money(sum(outs,e=>e.total))}</span></div>`:''}
  </div>`}

function hintsBlock(){const H=hints();if(!H.length)return '';
  return `<h2 class="sec reveal">Подсказки<span class="mut" style="letter-spacing:0">${H.length}</span></h2><div class="hscroll" id="hints">${H.map((x,i)=>`<${x.act?'button':'div'} class="hint-c rise" style="--c:${x.c};--i:${i}" ${x.act?`type="button" onclick="${x.act}"`:''}><div class="hi">${ic(x.ic,20)}</div><div><b>${esc(x.t)}</b><small>${esc(x.s)}</small></div></${x.act?'button':'div'}>`).join('')}</div>`}

function chartsBlock(){const m=today().slice(0,7);const by={};S.ops.filter(o=>o.date.startsWith(m)&&SPEND.includes(o.type)).forEach(o=>{const c=catOf(o);by[c]=(by[c]||0)+ +o.amount});
  const tot=Object.values(by).reduce((a,b)=>a+b,0);const days=[...Array(14)].map((_,i)=>addDays(today(),i-13));const vals=days.map(d=>spentOn(d));const mx=Math.max(...vals,1);if(!barSel||!days.includes(barSel))barSel=today();
  const C=2*Math.PI*54;let acc=0;const segs=Object.entries(by).sort((a,b)=>b[1]-a[1]);
  return `<h2 class="sec reveal">Расходы · ${monthName(m)}</h2><div class="charts" id="charts">
   <div class="card glow reveal">${tot?`<div class="donut-w"><div class="donut"><svg viewBox="0 0 140 140">${segs.map(([c,v],i)=>{const len=v/tot*C;const gap=segs.length>1?Math.min(6,len*.4):0;const el=`<circle cx="70" cy="70" r="54" stroke="${CAT[c]?.c||'#888'}" stroke-dasharray="${Math.max(.1,len-gap).toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-acc).toFixed(2)}" style="--i:${i}"/>`;acc+=len;return el}).join('')}</svg><div class="ctr"><small>Потрачено</small><b>${cnt(tot,'mtot')}</b></div></div>
     <div class="legend">${segs.map(([c,v])=>`<button class="lg" style="--c:${CAT[c]?.c}" onclick="opsQuick('month','${c}')"><i></i><span>${c}</span><em>${Math.round(v/tot*100)}%</em></button>`).join('')}</div></div>`:`<div class="empty" style="border:0">${ic('grid',28)}В этом месяце расходов нет</div>`}</div>
   <div class="card glow reveal"><div class="bars-h"><div><small>Траты по дням</small><b id="bsel">${money(spentOn(barSel))}</b></div><small id="bseld">${fdateL(barSel)}</small></div>
    <div class="bars">${days.map((d,i)=>`<button class="${d===barSel?'on':''}" onclick="selBar(this,'${d}')" aria-label="${fdateL(d)}"><i class="${vals[i]?'':'z'}" style="height:${Math.max(3,vals[i]/mx*100)}%;--i:${i}"></i><small>${+d.slice(8)}</small></button>`).join('')}</div></div></div>`}
function selBar(b,d){barSel=d;$$('.bars button').forEach(x=>x.classList.toggle('on',x===b));$('#bsel').textContent=money(spentOn(d));$('#bseld').textContent=fdateL(d);buzz(4)}

/* ---------- ОБЪЕКТЫ ---------- */
function vObjs(){const act=activeObjs(),arch=S.objects.filter(o=>o.arch);
  const card=(o,i)=>{const s=objStats(o.id);return `<button class="oc rise" data-vt="obj:${o.id}" style="${gVars(o)};--i:${i};flex:none;width:100%;min-height:150px" onclick="openObj('${o.id}')">${ringSVG(s.pct)}<div class="on">${esc(o.name)}</div><div class="ol" style="margin-top:18px">Остаток</div><div class="ov">${money(s.left)}</div><div class="om">Получено ${money(s.recv)} · потрачено ${money(s.spent)} · ${o.people.length} чел.</div></button>`};
  return `<div class="top"><div class="grow"><div class="hello">${act.length} в работе · в конвертах ${money(sum(S.objects,o=>kassa(o.id)))} из ${money(onHands())}</div><h1>Объекты</h1></div><button class="ib" onclick="fObject()" aria-label="Новый объект">${ic('plus',22)}</button></div>
  <div class="list" id="objList" style="margin-top:10px">${act.length?act.map(card).join(''):`<div class="empty">${ic('build',30)}Объектов пока нет<button class="btn pri sm" onclick="fObject()">Добавить объект</button></div>`}</div>
  ${arch.length?`<h2 class="sec">Архив</h2><div class="list" style="opacity:.7">${arch.map(card).join('')}</div>`:''}`}
function vObj(id){const o=oById(id);if(!o){view='objs';return vObjs()}const s=objStats(id);
  const tabs=[['kassa','Касса'],['att','Перекличка'],['tabel','Табель'],['out','Выработка'],['people','Люди'],['price','Прайс']];
  let body='';
  if(objTab==='kassa')body=`<div class="acts"><button class="btn" onclick="fTransfer({obj:'${id}'})">${ic('plus',18)}Деньги</button><button class="btn" onclick="fExpense({obj:'${id}'})">${ic('minus',18)}Расход</button><button class="btn" onclick="fAdvance({obj:'${id}'})">${ic('cash',18)}Аванс</button></div>
    ${objCats(id)}<h2 class="sec">Операции<button class="lnk" onclick="opsQuick('all',null,'${id}')">Фильтры</button></h2>${opsList(S.ops.filter(x=>x.obj===id),30)}`;
  else if(objTab==='att')body=vAtt(o);else if(objTab==='tabel')body=vTabel(o);else if(objTab==='out')body=vOut(o);else if(objTab==='people')body=vObjPeople(o);else body=vPrice(o);
  return `<div class="top"><button class="ib" onclick="goBack('objs')" aria-label="Назад">${ic('back',22)}</button><div class="grow"></div><button class="ib" onclick="shareReport('${id}')" aria-label="Отчёт текстом">${ic('share',20)}</button><button class="ib" onclick="fObject('${id}')" aria-label="Настройки объекта">${ic('edit',20)}</button></div>
  <div class="ohero" id="ohero" data-vt="obj:${id}" style="${gVars(o)}"><div class="oring">${ringSVG(s.pct)}<b>${Math.round(s.pct)}%</b></div>
   <div class="ol">${o.arch?'В архиве · ':''}${esc(o.addr||'Объект')}</div><h1 style="font-size:20px;margin-top:4px;padding-right:76px;position:relative;z-index:1">${esc(o.name)}</h1>
   <div class="ov">${odo(s.left,'o'+id)}</div><div class="pbar"><i style="width:${s.pct}%"></i></div>
   <div class="stats"><div><small>Получено</small><b>${money(s.recv)}</b></div><div><small>Потрачено</small><b>${money(s.spent)}</b></div><div><small>Людей</small><b>${o.people.length}</b></div></div></div>
  <div class="tabs" id="otabs" role="tablist">${tabs.map(([k,l])=>`<button class="tab ${objTab===k?'on':''}" role="tab" aria-selected="${objTab===k}" onclick="setTab('${k}')">${l}</button>`).join('')}</div><div id="tabb" class="enter">${body}</div>`}
function setTab(k){objTab=k;buzz(4);render();const t=$('.tab.on');t&&t.scrollIntoView({inline:'center',block:'nearest',behavior:reduced()?'auto':'smooth'})}
function objCats(id){const by={};S.ops.filter(o=>o.obj===id&&SPEND.includes(o.type)).forEach(o=>{const c=catOf(o);by[c]=(by[c]||0)+ +o.amount});
  const tot=Object.values(by).reduce((a,b)=>a+b,0);if(!tot)return '';const segs=Object.entries(by).sort((a,b)=>b[1]-a[1]);
  return `<h2 class="sec">Куда ушли деньги</h2><div class="card glow"><div class="stack">${segs.map(([c,v])=>`<i style="width:${v/tot*100}%;background:${CAT[c]?.c}"></i>`).join('')}</div><div class="sum">${segs.map(([c,v])=>`<i style="--c:${CAT[c]?.c}"></i><span>${c}</span><b>${money(v)}</b>`).join('')}</div></div>`}

/* перекличка */
function vAtt(o){const ppl=o.people.map(pById).filter(p=>p&&!p.gone);
  if(!ppl.length)return `<div class="empty">${ic('users',30)}На объекте нет людей<button class="btn pri sm" onclick="setTab('people')">Добавить людей</button></div>`;
  const day=S.att[o.id+'|'+attDate]||{};const marked=ppl.filter(p=>day[p.id]).length;const work=ppl.filter(p=>day[p.id]&&WORKING(day[p.id].st)).length;const C=2*Math.PI*26;
  const prev=prevAttDay(o.id,attDate);
  return `<div class="rc-top"><div class="rc-ring"><svg viewBox="0 0 62 62"><defs><linearGradient id="rg"><stop offset="0" stop-color="#2ee59d"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><circle cx="31" cy="31" r="26" fill="none" stroke="var(--card2)" stroke-width="7"/><circle cx="31" cy="31" r="26" fill="none" stroke="url(#rg)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(C*marked/ppl.length).toFixed(1)} ${C.toFixed(1)}" style="transition:stroke-dasharray .6s var(--ease)"/></svg><b>${marked}/${ppl.length}</b></div>
   <div style="flex:1;display:grid;gap:8px;min-width:0"><input class="dt" type="date" value="${attDate}" onchange="attDate=this.value||today();render()" aria-label="Дата"><div class="hint">На работе ${work} · отмечено ${marked} из ${ppl.length}</div></div></div>
  ${marked<ppl.length?`<div class="acts" style="margin-bottom:12px">${prev&&!marked?`<button class="btn" onclick="likePrev('${o.id}')">${ic('copy',18)}Как ${prev===addDays(attDate,-1)?'вчера':fdate(prev)}</button>`:''}<button class="btn pri" onclick="allPresent('${o.id}')">${ic('check',20)}${marked?'Остальные вышли':'Все вышли'}</button></div>`:''}
  <div class="list">${ppl.map((p,i)=>{const r=day[p.id];const st=r&&ST[r.st];
   return `<div class="att rise ${r?'done':''}" style="--i:${i};--c:${st?st.c:'transparent'}"><div class="hd">${avatar(p,'',!!r&&WORKING(r.st))}<div class="t"><b>${esc(fullName(p))}</b><small>${r?st.l+(r.time?' в '+r.time:''):'Не отмечен'}${r&&r.dp&&WORKING(r.st)?' · '+money(r.rate):''}</small></div></div>
   <div class="chips">${Object.entries(ST).map(([k,v])=>`<button class="chip ${r&&r.st===k?'on':''}" style="--c:${v.c}" onclick="setSt('${o.id}','${p.id}','${k}')">${ic(v.ic,17,2.4)}${v.l}</button>`).join('')}</div>
   ${r&&WORKING(r.st)?`<div class="att-x"><label style="display:inline-flex;gap:8px;align-items:center">Пришёл <input type="time" value="${r.time||''}" onchange="setAtt('${o.id}','${p.id}','time',this.value)"></label>
     <label class="sw"><input type="checkbox" ${r.dp?'checked':''} onchange="setAtt('${o.id}','${p.id}','dp',this.checked)"><span></span>Дневная ставка</label>
     ${r.dp?`<input type="number" inputmode="numeric" value="${r.rate}" onchange="setAtt('${o.id}','${p.id}','rate',+this.value)" aria-label="Ставка за день"> ₽`:''}</div>`:''}
   ${r&&['vac','sick','off'].includes(r.st)?`<div class="att-x">До <input type="date" id="u_${p.id}" min="${addDays(attDate,1)}" value="${addDays(attDate,r.st==='off'?1:6)}"><button class="btn sm" onclick="applyUntil('${o.id}','${p.id}')">Отметить все дни</button></div>`:''}</div>`}).join('')}</div>
  <p class="hint" style="margin-top:12px">«Дневная ставка» включена — за этот день начисляется оплата. Выключите, если человек работал только за объём.</p>`}
function prevAttDay(oid,d){for(let i=1;i<=10;i++){const x=addDays(d,-i);const r=S.att[oid+'|'+x];if(r&&Object.keys(r).length)return x}return null}
function setSt(oid,pid,st){const k=oid+'|'+attDate;const day=S.att[k]||(S.att[k]={});const p=pById(pid);const prev=day[pid];buzz(6);
  if(prev&&prev.st===st)delete day[pid];
  else day[pid]={st,time:WORKING(st)?(prev&&prev.time||(attDate===today()?nowTime():'')):'',dp:WORKING(st)?(prev?prev.dp:p.payType==='day'):false,rate:prev&&prev.rate?prev.rate:rnd(p.dayRate)};
  if(!Object.keys(day).length)delete S.att[k];save();render()}
function setAtt(oid,pid,f,v){const r=S.att[oid+'|'+attDate]?.[pid];if(!r)return;r[f]=f==='rate'?rnd(v):v;save();render()}
function allPresent(oid){const o=oById(oid);let n=0;o.people.forEach(pid=>{const p=pById(pid);if(!p||p.gone)return;const k=oid+'|'+attDate;const day=S.att[k]||(S.att[k]={});if(!day[pid]){n++;day[pid]={st:'present',time:attDate===today()?nowTime():'',dp:p.payType==='day',rate:rnd(p.dayRate)}}});buzz(15);save();render();toast(`Отмечено ещё ${n} чел.`)}
function likePrev(oid){const prev=prevAttDay(oid,attDate);if(!prev)return;const src=S.att[oid+'|'+prev];const k=oid+'|'+attDate;const day=S.att[k]||(S.att[k]={});let n=0;
  oById(oid).people.forEach(pid=>{const p=pById(pid);if(!p||p.gone||day[pid])return;const r=src[pid];if(!r)return;day[pid]={...r,time:WORKING(r.st)?(attDate===today()?nowTime():r.time):''};n++});
  buzz(15);save();render();toast(`Скопировано с ${fdate(prev)}: ${n} чел.`)}
function applyUntil(oid,pid){const r=S.att[oid+'|'+attDate]?.[pid];const until=$('#u_'+pid).value;if(!r||!until||until<=attDate)return toast('Выберите дату позже текущей');
  let d=addDays(attDate,1),n=0;while(d<=until&&n<120){const k=oid+'|'+d;(S.att[k]||(S.att[k]={}))[pid]={st:r.st,time:'',dp:false,rate:r.rate};d=addDays(d,1);n++}
  pById(pid).until={st:r.st,to:until};save();render();toast(`${ST[r.st].l}: отмечено ${n} дн. до ${fdate(until)}`)}

/* табель */
function vTabel(o){const [y,m]=tabMonth.split('-').map(Number);const n=new Date(y,m,0).getDate();
  const ids=new Set(o.people);for(const k in S.att)if(k.startsWith(o.id+'|'+tabMonth))Object.keys(S.att[k]).forEach(i=>ids.add(i));
  const ppl=[...ids].map(pById).filter(Boolean).sort((a,b)=>fullName(a).localeCompare(fullName(b),'ru'));
  const days=[...Array(n)].map((_,i)=>i+1);const we=d=>[0,6].includes(new Date(y,m-1,d).getDay());const td=today();
  const rows=ppl.map(p=>{let c=0;const tds=days.map(d=>{const ds=tabMonth+'-'+String(d).padStart(2,'0');const r=S.att[o.id+'|'+ds]?.[p.id];if(r&&WORKING(r.st))c++;return r?`<td class="s" style="--c:${ST[r.st].c}" title="${ST[r.st].l}">${ST[r.st].s}</td>`:'<td class="e"></td>'}).join('');
    return `<tr><td class="nm">${esc(shortName(p))}</td>${tds}<td><b>${c}</b></td></tr>`}).join('');
  return `<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><input class="dt" style="width:auto" type="month" value="${tabMonth}" onchange="tabMonth=this.value||today().slice(0,7);render()" aria-label="Месяц"><b style="text-transform:capitalize">${monthName(tabMonth)}</b></div>
  ${ppl.length?`<div class="tscroll" id="tsc"><table class="tabel"><thead><tr><th class="nm">Фамилия</th>${days.map(d=>{const ds=tabMonth+'-'+String(d).padStart(2,'0');return `<th class="${ds===td?'td':we(d)?'we':''}">${d}</th>`}).join('')}<th>Дн.</th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="lgnd">${Object.values(ST).map(v=>`<span><i style="--c:${v.c}">${v.s}</i>${v.l}</span>`).join('')}</div>`:`<div class="empty">${ic('grid',30)}Нет людей и отметок за этот месяц</div>`}`}

/* выработка */
function vOut(o){const list=S.out.filter(e=>e.obj===o.id).sort((a,b)=>(b.date+b.id).localeCompare(a.date+a.id));const tot=sum(list,e=>e.total);
  return `<button class="btn pri w" onclick="fOutput('${o.id}')">${ic('ruler',20)}Записать выработку</button>
  <h2 class="sec">Записи<span class="mut" style="letter-spacing:0">${money(tot)}</span></h2>${list.length?`<div class="list">`+list.map((e,i)=>`<button class="row-c rise" style="--i:${Math.min(i,10)}" onclick="outView('${e.id}')"><span class="av" style="background:linear-gradient(140deg,#8b5cff,#ff2e7e)">${ic('ruler',20)}</span><span class="t"><b>${esc(e.wname)}</b><small>${fdateL(e.date)} · ${e.vol} ${e.unit} × ${money(e.price)} · ${Object.keys(e.shares).length} чел.</small></span><span class="a">${money(e.total)}</span></button>`).join('')+`</div>`:`<div class="empty">${ic('ruler',30)}Выработки пока нет</div>`}`}
function vObjPeople(o){const ppl=o.people.map(pById).filter(p=>p&&!p.gone);
  return `<button class="btn w" onclick="fObjPeople('${o.id}')">${ic('users',20)}Изменить состав</button>
  <h2 class="sec">К выдаче за этот объект</h2>
  ${ppl.length?`<div class="list">`+ppl.map((p,i)=>{const e=earn(p.id,o.id);return `<button class="row-c rise" style="--i:${i}" data-vt="person:${p.id}" onclick="go('person:${p.id}','person:${p.id}')">${avatar(p,'',true)}<span class="t"><b>${esc(fullName(p))}</b><small>${e.days} дн. · заработал ${money(e.earned)}${e.adv?' · аванс '+money(e.adv):''}${e.fines?' · штраф '+money(e.fines):''}</small></span><span class="a ${e.due<0?'neg':''}">${money(e.due)}</span></button>`}).join('')+`</div>`:`<div class="empty">${ic('users',30)}На объекте пока никого</div>`}`}
function vPrice(o){return `<button class="btn pri w" onclick="fWork('${o.id}')">${ic('plus',20)}Добавить работу</button>
  <h2 class="sec">Расценки этого объекта</h2>${o.works.length?`<div class="list">`+o.works.map((w,i)=>`<button class="row-c rise" style="--i:${i}" onclick="fWork('${o.id}','${w.id}')"><span class="av" style="background:linear-gradient(140deg,${gOf(o)[0]},${gOf(o)[1]})">${ic('ruler',20)}</span><span class="t"><b>${esc(w.name)}</b><small>за ${w.unit}</small></span><span class="a">${money(w.price)}</span></button>`).join('')+`</div>`:`<div class="empty">${ic('ruler',30)}Расценок пока нет<span class="hint">Например: «Штукатурка стен — 350 ₽ за м²»</span></div>`}`}

/* ---------- БРИГАДА ---------- */
const PF={q:'',f:'all'};
function pStatus(p){const r=todayStatus(p.id);if(r&&WORKING(r.st))return {l:'На работе'+(r.time?' · '+r.time:''),c:'#2ee59d',k:'work'};
  if(r)return {l:ST[r.st].l,c:ST[r.st].c,k:'away'};if(p.until&&p.until.to>=today())return {l:ST[p.until.st].l+' до '+fdate(p.until.to),c:ST[p.until.st].c,k:'away'};return {l:'Не отмечен',c:'#5a6276',k:'none'}}
function peopleFiltered(){const q=PF.q.trim().toLowerCase();return activePeople().filter(p=>{const e=earn(p.id),s=pStatus(p);
  if(q&&!(fullName(p)+' '+(p.phone||'')+' '+(p.note||'')).toLowerCase().includes(q))return false;
  return PF.f==='all'||(PF.f==='work'&&s.k==='work')||(PF.f==='none'&&s.k==='none')||(PF.f==='due'&&e.due>0)||(PF.f==='over'&&e.due<0)})}
function peopleGrid(){const L=peopleFiltered();if(!L.length)return `<div class="empty" style="grid-column:1/-1">${ic('users',30)}${activePeople().length?'Никого не найдено':'В бригаде пока никого'}${activePeople().length?'':'<button class="btn pri sm" onclick="fPerson()">Добавить человека</button>'}</div>`;
  return L.map((p,i)=>{const e=earn(p.id),s=pStatus(p);const ini=((p.last||'')[0]||'')+((p.first||'')[0]||'');
    return `<button class="pcard rise" style="--c:${pColor(p)};--i:${i}" data-vt="person:${p.id}" onclick="go('person:${p.id}','person:${p.id}')">${p.photo?`<div class="pimg" style="background-image:url(${p.photo})"></div>`:`<div class="pimg ini">${esc(ini.toUpperCase())}</div>`}
      <span class="pst" style="--s:${s.c}"><i></i>${esc(s.l)}</span><div class="pin"><b>${esc(fullName(p))}</b><small>${p.payType==='day'?money(p.dayRate)+' в день':'За объём'} · ${e.days} дн.</small><span class="pdue ${e.due<0?'neg':''}">${money(e.due)}</span></div></button>`}).join('')}
function vPeople(){const ppl=activePeople();const owe=sum(ppl,p=>Math.max(0,earn(p.id).due));const cnt={all:ppl.length,work:0,none:0,due:0,over:0};
  ppl.forEach(p=>{const s=pStatus(p),e=earn(p.id);if(s.k==='work')cnt.work++;if(s.k==='none')cnt.none++;if(e.due>0)cnt.due++;if(e.due<0)cnt.over++});
  const ch=[['all','Все','#f4f6fb'],['work','На работе','#2ee59d'],['none','Не отмечены','#8a93a8'],['due','К выдаче','#ffc83d'],['over','Перебор','#ff5468']];
  return `<div class="top"><div class="grow"><div class="hello">${ppl.length} чел. · к выдаче ${money(owe)}</div><h1>Бригада</h1></div><button class="ib" onclick="fPerson()" aria-label="Добавить человека">${ic('plus',22)}</button></div>
  ${owe>0?`<button class="btn pri w rise" id="payrollBtn" onclick="payroll()" style="margin:6px 0 4px">${ic('wallet',20)}Выдать зарплату · ${money(owe)}</button>`:`<button class="btn w" id="payrollBtn" onclick="payroll()" style="margin:6px 0 4px">${ic('wallet',20)}Зарплата: все рассчитаны</button>`}
  <div id="pfilters" style="display:grid;gap:10px;margin-top:10px"><label class="search">${ic('search',20)}<input id="pSearch" placeholder="Поиск по имени, телефону" value="${esc(PF.q)}" oninput="PF.q=this.value;$('#pgrid').innerHTML=peopleGrid()"></label>
   <div class="fchips">${ch.map(([k,l,c])=>`<button class="fc ${PF.f===k?'on':''}" style="--c:${c}" onclick="PF.f='${k}';render()"><i></i>${l}<em>${cnt[k]}</em></button>`).join('')}</div></div>
  <div class="pgrid" id="pgrid" style="margin-top:14px">${peopleGrid()}</div>`}
function vPerson(id){const p=pById(id);if(!p){view='people';return vPeople()}const e=earn(id);
  const att=[];for(const k in S.att){const r=S.att[k][id];if(r){const i=k.indexOf('|');att.push({d:k.slice(i+1),oid:k.slice(0,i),...r})}}att.sort((a,b)=>b.d.localeCompare(a.d));
  const hist=[...S.ops.filter(o=>o.pid===id).map(o=>({...o,k:'op'})),...S.fines.filter(f=>f.pid===id).map(f=>({...f,k:'fine'})),
    ...S.out.filter(o=>o.shares[id]).map(o=>({id:o.id,date:o.date,k:'out',amount:o.shares[id],t:o.wname+' · '+oName(o.obj),obj:o.obj}))].sort((a,b)=>(b.date+b.id).localeCompare(a.date+a.id));
  const objs=S.objects.filter(o=>o.people.includes(id)).map(o=>esc(o.name)).join(', ');const s=pStatus(p);
  const parts=[['За дни',e.dayMoney,'#2ee59d'],['За объём',e.outMoney,'#22d3ee']];const minus=[['Авансы',e.adv,'#ff7a1a'],['Штрафы',e.fines,'#ff5468'],['Выплачено',e.paid,'#8b5cff']];
  const base=Math.max(e.earned,e.adv+e.fines+e.paid,1);
  return `<div class="top"><button class="ib" onclick="goBack('people')" aria-label="Назад">${ic('back',22)}</button><div class="grow"></div>${p.phone?`<button class="ib" onclick="copyText('${esc(p.phone)}')" aria-label="Скопировать телефон">${ic('phone',20)}</button>`:''}<button class="ib" onclick="fPerson('${id}')" aria-label="Изменить">${ic('edit',20)}</button></div>
  <div class="phead" id="phead" data-vt="person:${id}"><div class="blur ${p.photo?'':'g'}" ${p.photo?`style="background-image:url(${p.photo})"`:''}></div>${avatar(p,'lg',true)}<h1>${esc(fullName(p))}</h1>
   <small>${p.payType==='day'?'Ставка '+money(p.dayRate)+' в день':'Оплата за объём'}${p.phone?' · '+esc(p.phone):''}</small>${objs?`<small>${objs}</small>`:''}<small style="color:${s.c};font-weight:800">● ${esc(s.l)}</small>
   <div class="due-big ${e.due<0?'neg':''}">${odo(e.due,'p'+id)}</div><small>${e.due<0?'взял больше, чем заработал':'к выдаче'}</small></div>
  <div class="acts" id="personActs" style="margin-top:14px"><button class="btn" onclick="fAdvance({pid:'${id}'})">${ic('cash',18)}Аванс</button><button class="btn" onclick="fFine({pid:'${id}'})">${ic('fine',18)}Штраф</button><button class="btn pri" onclick="fPayout({pid:'${id}'})">${ic('wallet',18)}Выплатить</button></div>
  <h2 class="sec">Расчёт за всё время</h2>
  <div class="card glow"><div class="stack">${parts.map(([,v,c])=>`<i style="width:${v/base*100}%;background:${c}"></i>`).join('')}</div><div class="stack" style="margin-top:-6px">${minus.map(([,v,c])=>`<i style="width:${v/base*100}%;background:${c}"></i>`).join('')}</div>
   <div class="sum"><i style="--c:var(--muted)"></i><span>Отработано дней</span><b>${e.days}</b>${parts.map(([l,v,c])=>`<i style="--c:${c}"></i><span>${l}</span><b>${money(v)}</b>`).join('')}${minus.map(([l,v,c])=>`<i style="--c:${c}"></i><span>${l}</span><b>−${money(v)}</b>`).join('')}
   <div class="tot"><span>К выдаче</span><span class="${e.due<0?'neg':''}">${money(e.due)}</span></div></div></div>
  <h2 class="sec">Выходы на работу</h2>
  ${att.length?`<div class="card ops">`+att.slice(0,30).map(a=>`<div class="op" style="--c:${ST[a.st].c}"><div class="oi">${ic(ST[a.st].ic,18)}</div><div class="t"><div>${ST[a.st].l}${a.time?' в '+a.time:''}</div><small>${fdateL(a.d)} · ${esc(oName(a.oid))}</small></div><div class="a">${a.dp&&WORKING(a.st)?money(a.rate):''}</div></div>`).join('')+`</div>`:`<div class="empty">${ic('check',28)}Отметок пока нет. Они появятся после переклички</div>`}
  <h2 class="sec">Деньги</h2>
  ${hist.length?`<div class="card ops">`+hist.map(h=>{let t,sg,icn,c,act;
    if(h.k==='fine'){t='Штраф · '+h.reason;sg='−';icn='fine';c='#ff5468';act=`fineView('${h.id}')`}
    else if(h.k==='out'){t='Выработка · '+h.t;sg='+';icn='ruler';c='#22d3ee';act=`openObj('${h.obj}','out')`}
    else{const x=opInfo(h);t=(h.type==='advance'?'Аванс':'Зарплата')+(h.note?' · '+h.note:'');sg='−';icn=x.ic;c=x.c;act=`opView('${h.id}')`}
    return `<button class="op" style="--c:${c}" onclick="${act}"><div class="oi">${ic(icn,18)}</div><div class="t"><div>${esc(t)}</div><small>${fdateL(h.date)}</small></div><div class="a ${sg==='+'?'pos':''}">${sg}${money(h.amount)}</div></button>`}).join('')+`</div>`:`<div class="empty">${ic('wallet',28)}Денежных операций пока нет</div>`}`}

/* ---------- ОПЕРАЦИИ: поиск и фильтры ---------- */
const OF={q:'',period:'month',from:'',to:'',kind:'all',cats:[],objs:[],pid:''};
function periodRange(){const t=today();switch(OF.period){case 'today':return [t,t];case 'week':return [addDays(t,-6),t];case 'month':return [t.slice(0,7)+'-01',t];case 'custom':return [OF.from||null,OF.to||null];default:return [null,null]}}
function opText(o){return [opInfo(o).t,o.note,o.cat,oName(o.obj),o.pid?fullName(pById(o.pid)):'',String(o.amount),TYPES[o.type].l].join(' ').toLowerCase().replace(/ё/g,'е')}
function opsFiltered(skipCats){const [from,to]=periodRange();const q=OF.q.trim().toLowerCase().replace(/ё/g,'е');
  return S.ops.filter(o=>(!from||o.date>=from)&&(!to||o.date<=to)
   &&(OF.kind==='all'||(OF.kind==='in'&&o.type==='income')||(OF.kind==='tr'&&o.type==='transfer')||(OF.kind==='out'&&SPEND.includes(o.type)))
   &&(skipCats||!OF.cats.length||(SPEND.includes(o.type)&&OF.cats.includes(catOf(o))))
   &&(!OF.objs.length||OF.objs.includes(o.obj||'gen'))
   &&(!OF.pid||o.pid===OF.pid)
   &&(!q||opText(o).includes(q)))}
function opsQuick(period,cat,obj){Object.assign(OF,{q:'',period:period||'month',kind:cat?'out':'all',cats:cat?[cat]:[],objs:obj?[obj]:[],pid:''});go('ops')}
function vOps(){const base=opsFiltered(true);const byCat={};base.filter(o=>SPEND.includes(o.type)).forEach(o=>{const c=catOf(o);byCat[c]=(byCat[c]||0)+ +o.amount});
  const per=[['today','Сегодня'],['week','Неделя'],['month','Месяц'],['all','Всё'],['custom','Период']];
  const kinds=[['all','Все'],['in','Приходы'],['tr','Переводы'],['out','Траты']];
  const nf=(OF.cats.length?1:0)+(OF.objs.length?1:0)+(OF.pid?1:0)+(OF.kind!=='all'?1:0);
  return `<div class="top"><div class="grow"><div class="hello">Поиск, фильтры и итоги</div><h1>Операции</h1></div>${nf?`<button class="ib" onclick="Object.assign(OF,{kind:'all',cats:[],objs:[],pid:''});render()" aria-label="Сбросить фильтры">${ic('x',20)}<span class="badge">${nf}</span></button>`:''}<button class="ib" onclick="excelOps()" aria-label="Скачать в Excel">${ic('down',20)}</button></div>
  <div id="opsFilters" style="display:grid;gap:10px">
   <label class="search" id="opsSearch">${ic('search',20)}<input id="opsQ" placeholder="Еда, Иванов, перфоратор, 5000…" value="${esc(OF.q)}" oninput="OF.q=this.value;opsResults()" enterkeyhint="search"></label>
   <div class="seg"><span class="pill"></span>${per.map(([k,l])=>`<button class="${OF.period===k?'on':''}" onclick="OF.period='${k}';render()">${l}</button>`).join('')}</div>
   ${OF.period==='custom'?`<div class="two"><input class="dt" type="date" value="${OF.from}" onchange="OF.from=this.value;render()" aria-label="С"><input class="dt" type="date" value="${OF.to}" onchange="OF.to=this.value;render()" aria-label="По"></div>`:''}
   <div class="seg"><span class="pill"></span>${kinds.map(([k,l])=>`<button class="${OF.kind===k?'on':''}" onclick="OF.kind='${k}';render()">${l}</button>`).join('')}</div>
   <div class="fchips">${Object.keys(CAT).map(c=>`<button class="fc ${OF.cats.includes(c)?'on':''}" style="--c:${CAT[c].c}" onclick="togF('cats','${c}',this)"><i></i>${c}${byCat[c]?`<em>${moneyS(byCat[c])}</em>`:''}</button>`).join('')}</div>
   <div class="fchips"><button class="fc ${OF.objs.includes('gen')?'on':''}" style="--c:${GEN_G[0]}" onclick="togF('objs','gen',this)"><i></i>Общая касса</button>${S.objects.map(o=>`<button class="fc ${OF.objs.includes(o.id)?'on':''}" style="--c:${gOf(o)[0]}" onclick="togF('objs','${o.id}',this)"><i></i>${esc(o.name)}</button>`).join('')}</div>
   <div class="fchips">${activePeople().map(p=>`<button class="fc ${OF.pid===p.id?'on':''}" style="--c:${pColor(p)}" onclick="OF.pid=OF.pid==='${p.id}'?'':'${p.id}';render()">${esc(shortName(p))}</button>`).join('')}</div>
  </div>
  <div id="opsSum" style="margin-top:14px"></div><div id="opsRes"></div>`}
function togF(k,v,b){const a=OF[k];const i=a.indexOf(v);if(i>=0)a.splice(i,1);else a.push(v);if(k==='cats'&&a.length&&OF.kind==='all')OF.kind='out';b.classList.toggle('on',i<0);buzz(4);if(k==='cats')render();else opsResults()}
function opsResults(){const L=opsFiltered().sort((a,b)=>(b.date+b.id).localeCompare(a.date+a.id));
  const plus=sum(L.filter(o=>o.type==='income'||(o.type==='transfer'&&OF.objs.length&&OF.objs.includes(o.obj))),o=>o.amount);const minus=sum(L.filter(o=>SPEND.includes(o.type)),o=>o.amount);
  const [from,to]=periodRange();const f0=from||(L.length?L[L.length-1].date:today()),t0=to||today();
  const span=Math.round((new Date(t0)-new Date(f0))/864e5)+1;let buckets=[];
  if(span<=31){for(let i=0;i<span;i++){const d=addDays(f0,i);buckets.push({k:d,l:+d.slice(8),v:sum(L.filter(o=>o.date===d&&SPEND.includes(o.type)),o=>o.amount)})}}
  else{const ms=[...new Set(L.map(o=>o.date.slice(0,7)))].sort().slice(-12);buckets=ms.map(m=>({k:m,l:new Date(m+'-15T12:00:00').toLocaleString('ru-RU',{month:'short'}).replace('.',''),v:sum(L.filter(o=>o.date.startsWith(m)&&SPEND.includes(o.type)),o=>o.amount)}))}
  const mx=Math.max(1,...buckets.map(b=>b.v));
  const el=$('#opsSum');if(!el)return;
  el.innerHTML=`<div class="stat3"><div><small>Пришло</small><b class="pos">+${money(plus)}</b></div><div><small>Ушло</small><b>−${money(minus)}</b></div><div><small>${L.length} ${plural(L.length,'операция','операции','операций')}</small><b class="${plus-minus<0?'neg':''}">${money(plus-minus)}</b></div></div>
   ${buckets.length>1?`<div class="card glow" style="margin-top:10px"><div class="bars" style="height:90px">${buckets.map((b,i)=>`<button aria-label="${b.k}: ${money(b.v)}" title="${money(b.v)}"><i class="${b.v?'':'z'}" style="height:${Math.max(3,b.v/mx*100)}%;--i:${i};opacity:.9"></i>${buckets.length<=16||i%3===0?`<small>${b.l}</small>`:'<small>&nbsp;</small>'}</button>`).join('')}</div></div>`:''}`;
  const groups={};L.forEach(o=>(groups[o.date]=groups[o.date]||[]).push(o));
  $('#opsRes').innerHTML=L.length?Object.entries(groups).map(([d,arr])=>{const dm=sum(arr.filter(o=>SPEND.includes(o.type)),o=>o.amount),dp=sum(arr.filter(o=>o.type==='income'),o=>o.amount);
    return `<div class="dayhead"><b>${fdateW(d)}</b><span>${dp?'<span class="pos">+'+money(dp)+'</span> ':''}${dm?'−'+money(dm):''}</span></div>${opsList(arr,999,true)}`}).join(''):`<div class="empty" style="margin-top:12px">${ic('search',28)}Ничего не найдено. Измените фильтры</div>`}

/* ---------- ОТЧЁТЫ И НАСТРОЙКИ ---------- */
let installEvt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(view==='more')render()});
function vMore(){const lb=S.settings.lastBackup;
  const tile=(i,a,b,t,s,f,id='')=>`<button class="row-c" ${id?`id="${id}"`:''} onclick="${f}"><span class="av" style="background:linear-gradient(140deg,${a},${b})">${ic(i,20)}</span><span class="t"><b>${t}</b><small>${s}</small></span>${ic('chev',18)}</button>`;
  const standalone=(()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone}catch(e){return false}})();
  return `<div class="top"><button class="ib" onclick="goBack('fin')" aria-label="Назад">${ic('back',22)}</button><div class="grow"><div class="hello">Отчёты, копия, правила</div><h1>Настройки</h1></div></div>
  <h2 class="sec">Отчёт начальству</h2>
  <div class="card glow" id="excelCard" style="display:grid;gap:12px">
   <div class="two"><label class="f hint" style="display:grid;gap:6px;font-weight:800">Объект<select id="xo" class="dt"><option value="">Все объекты</option>${S.objects.map(o=>`<option value="${o.id}">${esc(o.name)}</option>`).join('')}</select></label>
   <label class="f hint" style="display:grid;gap:6px;font-weight:800">Месяц<input id="xm" type="month" value="${today().slice(0,7)}" class="dt"></label></div>
   <button class="btn pri" onclick="excel()">${ic('down',20)}Скачать Excel</button>
   <button class="btn" onclick="shareReport($('#xo').value||null)">${ic('share',20)}Отчёт текстом в WhatsApp</button>
   <p class="hint">В Excel: касса, зарплата, выработка и табель по каждому объекту.</p></div>
  <h2 class="sec">Умные настройки</h2>
  <div class="list">${tile('sliders','#ffc83d','#ff7a1a','Мои правила',`Еда ${money(S.settings.rules.food)}/чел. · аванс до ${S.settings.rules.advPct}% · резерв ${S.settings.rules.reserve}%`,'fRules()','rulesRow')}
   ${tile('grad','#8b5cff','#ff2e7e','Обучение заново','Пошаговый тур по всем разделам','Tour.start()','tourRow')}
   ${!standalone?(installEvt?tile('phone','#2ee59d','#0ea5a0','Установить на телефон','Иконка на экране, работает без интернета','installApp()','installRow'):tile('phone','#2ee59d','#0ea5a0','Как установить на телефон','Chrome → ⋮ → «Добавить на главный экран»',"toast('Откройте меню браузера ⋮ и выберите «Добавить на главный экран»')",'installRow')):''}</div>
  <h2 class="sec">Сохранность данных</h2>
  <div class="list">
   ${tile('down','#2ee59d','#0ea5a0','Сохранить копию (JSON)',lb?'Последняя: '+new Date(lb).toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}):'Ещё не сохранялась','backup()','backupRow')}
   <label class="row-c filebtn" style="cursor:pointer"><span class="av" style="background:linear-gradient(140deg,#22d3ee,#5b4bff)">${ic('up',20)}</span><span class="t"><b>Восстановить из файла</b><small>Выберите сохранённый .json</small></span>${ic('chev',18)}<input type="file" accept=".json,application/json" onchange="restoreFile(this)"></label>
   ${tile('file','#8b5cff','#ff2e7e','Восстановить из текста','Если копия пришла сообщением','fRestorePaste()')}
   ${tile('restore','#ffc83d','#ff7a1a','Снимки по дням','Автоматически, последние 7 дней','snapsSheet()')}
   ${tile('trash','#ff6fb5','#ff5468','Корзина',S.trash.length?S.trash.length+' шт. · хранится 30 дней':'Пусто','trashSheet()')}
  </div>
  <h2 class="sec">Опасная зона</h2>
  <button class="btn dng w" onclick="confirmBox('Удалить ВСЕ данные с этого телефона? Без копии их не вернуть.',()=>{S=blank();S.settings.tour='done';toast('Все данные удалены')},'Удалить всё')">${ic('trash',18)}Удалить все данные</button>`}
function installApp(){if(!installEvt)return;installEvt.prompt();installEvt.userChoice.finally(()=>{installEvt=null;render()})}
function copyText(t){try{navigator.clipboard.writeText(t).then(()=>toast('Скопировано: '+t),()=>toast(t))}catch(e){toast(t)}}
function clearDemo(){confirmBox('Удалить пример и начать с чистого листа?',()=>{const st=S.settings;S=blank();S.settings.tour=st.tour||'done';toast('Готово! Начните с кнопки «Получил» или «+»')},'Очистить')}
