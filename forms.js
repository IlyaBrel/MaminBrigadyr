/* ===== Касса бригадира · операции и формы ===== */

/* ---------- операции ---------- */
function opInfo(o){const p=pById(o.pid);
  switch(o.type){case 'income':return {ic:'in',c:'#2ee59d',t:o.note||'Получено от начальства',s:'+'};
  case 'transfer':return {ic:'arrow',c:'#ffc83d',t:'На объект · '+oName(o.obj),s:'→'};
  case 'expense':return {ic:CAT[o.cat]?.ic||'dots',c:CAT[o.cat]?.c||'#9aa3b8',t:o.cat+(o.note?' · '+o.note:''),s:'−'};
  case 'advance':return {ic:'cash',c:CAT['Авансы'].c,t:'Аванс · '+shortName(p),s:'−'};
  case 'payout':return {ic:'wallet',c:CAT['Зарплата'].c,t:'Зарплата · '+shortName(p),s:'−'}}
  return {ic:'dots',c:'#888',t:'—',s:''}}
function opsList(ops,n=999,flat){const a=[...ops].sort((x,y)=>(y.date+y.id).localeCompare(x.date+x.id)).slice(0,n);
  if(!a.length)return `<div class="empty">${ic('wallet',28)}Операций пока нет</div>`;
  return `<div class="card ops">`+a.map((o,i)=>{const x=opInfo(o);return `<button class="op ${flat?'':'rise'}" style="--i:${Math.min(i,10)};--c:${x.c}" onclick="opView('${o.id}')"><div class="oi">${ic(x.ic,20)}</div><div class="t"><div>${esc(x.t)}</div><small>${flat?'':fdateL(o.date)+' · '}${esc(o.type==='transfer'?'из общей кассы':oName(o.obj))}${o.photo?' · чек':''}${o.note&&o.type!=='expense'&&o.type!=='income'?' · '+esc(o.note):''}</small></div><div class="a ${x.s==='+'?'pos':''}">${x.s==='→'?'':x.s}${money(o.amount)}</div></button>`}).join('')+`</div>`}
function opView(id){const o=S.ops.find(x=>x.id===id);if(!o)return;const x=opInfo(o);
  sheet(esc(x.t),`<div class="amt-view ${x.s==='+'?'pos':''}">${x.s==='→'?'':x.s}${money(o.amount)}</div><div class="kv"><span>Тип</span><span>${TYPES[o.type].l}</span><span>Дата</span><span>${fdateL(o.date)}</span><span>Касса</span><span>${esc(oName(o.obj))}</span>${o.pid?`<span>Человек</span><span>${esc(fullName(pById(o.pid)))}</span>`:''}${o.note?`<span>Заметка</span><span>${esc(o.note)}</span>`:''}</div>${o.photo?`<img class="receipt" src="${o.photo}" alt="Фото чека">`:''}`,
  null,'','',`<button type="button" class="btn dng" onclick="closeSheet();toTrash('op',S.ops.find(x=>x.id==='${id}'),'Операция');save();render()">${ic('trash',18)}Удалить</button><button type="button" class="btn" onclick="editOp('${id}')">${ic('edit',18)}Изменить</button>`)}
function editOp(id){const o=S.ops.find(x=>x.id===id);if(!o)return;const pre={...o,edit:id};
  ({income:fIncome,transfer:fTransfer,expense:fExpense,advance:fAdvance,payout:fPayout})[o.type](pre)}
function saveOp(rec,editId){if(editId){const op=S.ops.find(x=>x.id===editId);if(op){Object.assign(op,rec,{amount:rnd(rec.amount),obj:rec.obj||null});return op}}
  const op={id:uid(),...rec,amount:rnd(rec.amount),date:rec.date||today(),obj:rec.obj||null};S.ops.push(op);return op}

/* корзина */
function toTrash(kind,item,label){if(!item)return;const tid=uid();S.trash.unshift({id:tid,kind,item,label,at:Date.now()});const key={op:'ops',fine:'fines',out:'out'}[kind];S[key]=S[key].filter(x=>x.id!==item.id);
  toast(label+' — удалено',()=>restoreTrash(tid,true))}
function restoreTrash(id,quiet){const t=S.trash.find(x=>x.id===id);if(!t)return;const key={op:'ops',fine:'fines',out:'out'}[t.kind];S[key].push(t.item);S.trash=S.trash.filter(x=>x.id!==id);if(!quiet)toast('Восстановлено')}

/* живые подсказки под суммой: хватит ли денег в кассе, лимит аванса */
function wireNotes(fn){const f=$('#shf');if(!f)return;const upd=()=>{const n=$('#amtNote');if(n)n.innerHTML=fn(f)||''};f.addEventListener('input',upd);f.addEventListener('change',upd);upd()}
function kassaNote(f,editId){const a=+(f.querySelector('[name=amount]')?.value||0);const sel=f.querySelector('[name=obj]');if(!sel||sel.value==='__auto')return '';const obj=sel.value||null;let have=kassa(obj);
  if(editId){const op=S.ops.find(x=>x.id===editId);if(op&&(op.obj||null)===obj&&SPEND.includes(op.type))have+=op.amount}
  return a>0&&a>have?`<span class="warn">В кассе «${esc(oName(obj))}» ${money(have)} — не хватит ${money(a-have)}</span>`:a>0?`<span>После: в кассе останется ${money(have-a)}</span>`:''}

/* ---------- формы денег ---------- */
function fIncome(o={}){sheet(o.edit?'Изменить приход':'Получил деньги',`${amtField(o.amount||'','Сумма',suggestAmounts('income'))}
  ${F('Куда положить',`<select name="obj">${objOptions(o.obj||null)}</select>`)}
  <div class="two">${F('Дата',`<input name="date" type="date" value="${o.date||today()}" required data-l="дата">`)}${F('От кого',`<input name="note" value="${esc(o.note||'')}" placeholder="Начальник участка" list="dlNotesIn">`)}</div>${notesList('dlNotesIn','income')}`,
  fd=>{saveOp({type:'income',amount:fd.amount,obj:fd.obj,date:fd.date,note:fd.note},o.edit);toast(o.edit?'Изменено':'+'+money(fd.amount)+' в кассе');if(!o.edit)setTimeout(confetti,300)},o.edit?'Сохранить':'Записать')}
function fTransfer(o={}){if(!activeObjs().length)return fObject();sheet(o.edit?'Изменить перевод':'Распределить на объект',`<p class="hint" style="text-align:center">Свободно в общей кассе <b style="color:var(--fg)">${money(kassa(null))}</b></p>${amtField(o.amount||'','Сумма',kassa(null)>0?[kassa(null)]:[])}
  ${F('Объект',`<select name="obj">${objOptions(o.obj,false)}</select>`)}
  ${F('Дата',`<input name="date" type="date" value="${o.date||today()}" required data-l="дата">`)}`,
  fd=>{saveOp({type:'transfer',amount:fd.amount,obj:fd.obj,date:fd.date},o.edit);toast(o.edit?'Изменено':'Передано: '+oName(fd.obj))},o.edit?'Сохранить':'Передать');
  wireNotes(f=>{const a=+f.amount.value||0,have=kassa(null)+(o.edit?rnd(o.amount):0);return a>have?`<span class="warn">Свободно только ${money(have)}</span>`:''})}
function fExpense(o={}){const L=S.settings.last;let obj=o.obj!==undefined?o.obj:L.expObj;if(obj&&(!oById(obj)||oById(obj).arch))obj=null;const cat=o.cat||L.cat||'Еда';
  sheet(o.edit?'Изменить расход':'Расход',`${amtField(o.amount||'','Сумма',suggestAmounts('expense',cat,obj))}${catPicker(cat)}
  ${F('Из какой кассы',`<select name="obj">${objOptions(obj)}</select>`)}
  <div class="two">${F('Дата',`<input name="date" type="date" value="${o.date||today()}" required data-l="дата">`)}${F('Заметка',`<input name="note" value="${esc(o.note||'')}" placeholder="Что купили" list="dlNotesEx">`)}</div>${notesList('dlNotesEx','expense')}
  <div class="photo-pick">${o.photo?`<img id="pv" class="receipt" src="${o.photo}" alt="" style="max-height:90px;width:auto">`:`<span id="pv" class="hint">Чек не прикреплён</span>`}<span class="btn sm filebtn">${ic('cam',18)}Фото чека<input type="file" accept="image/*" onchange="pickPhoto(this,'photo',1100)"></span><input type="hidden" name="photo" value="${o.photo||''}"></div>`,
  fd=>{const rec={type:'expense',amount:fd.amount,cat:fd.cat,obj:fd.obj,date:fd.date,note:fd.note};if(fd.photo)rec.photo=fd.photo;saveOp(rec,o.edit);
    S.settings.last.expObj=fd.obj||null;S.settings.last.cat=fd.cat;toast(o.edit?'Изменено':fd.cat+': −'+money(fd.amount))},o.edit?'Сохранить':'Записать');
  wireNotes(f=>kassaNote(f,o.edit));
  $$('#shf [name=cat]').forEach(r=>r.addEventListener('change',()=>{const s=suggestAmounts('expense',r.value,$('#shf [name=obj]').value||null);const q=$('#shf .qchips');q.querySelectorAll('.sg').forEach(b=>b.remove());q.insertAdjacentHTML('afterbegin',s.map(n=>`<button type="button" class="sg" onclick="qset(this,${n})">${fmtN(n)}</button>`).join(''))}))}
function defaultObjFor(pid){const objs=S.objects.filter(o=>!o.arch&&o.people.includes(pid));return objs.length===1?objs[0].id:(S.settings.last.advObj&&oById(S.settings.last.advObj)?S.settings.last.advObj:(objs[0]?.id||null))}
function fAdvance(o={}){if(!activePeople().length)return toast('Сначала добавьте человека в бригаду');const pid=o.pid||activePeople()[0].id;const obj=o.obj!==undefined?o.obj:defaultObjFor(pid);
  sheet(o.edit?'Изменить аванс':'Аванс',`${amtField(o.amount||'','Сумма',suggestAmounts('advance'))}
  ${F('Кому',`<select name="pid">${personOptions(pid)}</select>`)}
  ${F('Из какой кассы',`<select name="obj">${objOptions(obj)}</select>`)}
  <div class="two">${F('Дата',`<input name="date" type="date" value="${o.date||today()}" required data-l="дата">`)}${F('Заметка',`<input name="note" value="${esc(o.note||'')}">`)}</div>`,
  fd=>{saveOp({type:'advance',amount:fd.amount,pid:fd.pid,obj:fd.obj,date:fd.date,note:fd.note},o.edit);S.settings.last.advObj=fd.obj||null;toast(o.edit?'Изменено':'Аванс выдан: '+shortName(pById(fd.pid)))},o.edit?'Сохранить':'Выдать');
  $('#shf [name=pid]').addEventListener('change',e=>{const d=defaultObjFor(e.target.value);$('#shf [name=obj]').value=d||''});
  wireNotes(f=>{const k=kassaNote(f,o.edit);const r=advRule(f.pid.value,+f.amount.value||0,o.edit);return [k,r].filter(Boolean).join('<br>')})}
function fPayout(o={}){const pid=o.pid;const p=pById(pid);if(!p)return payroll();const e=earn(pid);const al=allocPayout(pid,Math.max(0,e.due));const canAuto=!o.edit&&al.length>1;
  sheet(o.edit?'Изменить выплату':'Выплата зарплаты',`
  <div style="display:flex;gap:12px;align-items:center">${avatar(p,'md',true)}<div><b style="font-size:16px">${esc(fullName(p))}</b><div class="hint">К выдаче сейчас: <b class="${e.due<0?'neg':'pos'}">${money(e.due)}</b></div></div></div>
  ${amtField(o.amount||Math.max(0,rnd(e.due))||'','Выплатить',e.due>0&&!o.edit?[rnd(e.due)]:[])}
  ${F('Из какой кассы',`<select name="obj">${canAuto?`<option value="__auto" selected>Авто: из объектов, где работал</option>`:''}${objOptions(o.obj!==undefined?o.obj:(al[0]?.obj??null),true,canAuto)}</select>`)}
  <div class="two">${F('Дата',`<input name="date" type="date" value="${o.date||today()}" required data-l="дата">`)}${F('Заметка',`<input name="note" value="${esc(o.note||'')}" placeholder="За какой период">`)}</div>`,
  fd=>{if(fd.obj==='__auto'){allocPayout(pid,+fd.amount).forEach(x=>saveOp({type:'payout',pid,amount:x.amount,obj:x.obj,date:fd.date,note:fd.note}))}else saveOp({type:'payout',pid,amount:fd.amount,obj:fd.obj,date:fd.date,note:fd.note},o.edit);
    const left=earn(pid).due;toast(o.edit?'Изменено':left===0?'Расчёт закрыт полностью':'Выплачено '+money(fd.amount));if(!o.edit&&left===0)setTimeout(confetti,300)},o.edit?'Сохранить':'Выплатить');
  wireNotes(f=>{if(f.obj.value!=='__auto')return kassaNote(f,o.edit);const a=+f.amount.value||0;return a?'Спишется: '+allocPayout(pid,a).map(x=>`${esc(oName(x.obj))} ${money(x.amount)}`).join(', '):''})}
function fFine(o={}){if(!activePeople().length)return toast('Сначала добавьте человека');const pid=o.pid||activePeople()[0].id;
  sheet('Штраф',`${amtField('','Сумма',[500,1000,2000])}
  ${F('Кому',`<select name="pid">${personOptions(pid)}</select>`)}
  ${F('За что',`<input name="reason" value="${esc(o.reason||'')}" placeholder="Опоздание, нарушение ТБ…" required data-l="причина" list="dlFine">`)}<datalist id="dlFine">${['Опоздание','Прогул','Нарушение ТБ','Порча инструмента','Брак'].map(x=>`<option value="${x}">`).join('')}</datalist>
  <div class="two">${F('Объект',`<select name="obj"><option value="">Без объекта</option>${activeObjs().map(x=>`<option value="${x.id}" ${x.id===(o.obj||defaultObjFor(pid))?'selected':''}>${esc(x.name)}</option>`).join('')}</select>`)}${F('Дата',`<input name="date" type="date" value="${o.date||today()}" required data-l="дата">`)}</div>`,
  fd=>{S.fines.push({id:uid(),pid:fd.pid,amount:rnd(fd.amount),reason:fd.reason,obj:fd.obj||null,date:fd.date});toast('Штраф записан: '+shortName(pById(fd.pid)))},'Оштрафовать','dng')}
function fineView(id){const f=S.fines.find(x=>x.id===id);if(!f)return;sheet('Штраф',`<div class="amt-view neg">−${money(f.amount)}</div><div class="kv"><span>Кому</span><span>${esc(fullName(pById(f.pid)))}</span><span>За что</span><span>${esc(f.reason)}</span><span>Дата</span><span>${fdateL(f.date)}</span></div>`,null,'','',
  `<button type="button" class="btn dng" onclick="closeSheet();toTrash('fine',S.fines.find(x=>x.id==='${id}'),'Штраф');save();render()">${ic('trash',18)}Удалить</button><button type="button" class="btn" onclick="closeSheet()">Закрыть</button>`)}
function notesList(id,type){const s=[...new Set(S.ops.filter(o=>o.type===type&&o.note).map(o=>o.note))].slice(-30);return `<datalist id="${id}">${s.map(x=>`<option value="${esc(x)}">`).join('')}</datalist>`}

/* ---------- где лежат деньги ---------- */
function whereMoney(){const E=envelopes();const hands=onHands();buzz(6);const tot=Math.max(1,sum(E,y=>Math.max(0,y.v)));
  sheet('Где лежат деньги',`<p class="hint">Все эти деньги у вас на руках. Объекты — это конверты, по которым вы их разложили. Сумма конвертов всегда равна сумме на руках.</p>
  <div class="card" style="padding:14px"><div class="envbar" style="height:16px">${E.filter(x=>x.v>0).map((x,i)=>`<i style="flex:${Math.round(x.v)} 1 0;background:linear-gradient(90deg,${x.g[0]},${x.g[1]});--i:${i}"></i>`).join('')}</div></div>
  <div class="list">${E.map(x=>{const inner=`<span class="av" style="background:linear-gradient(140deg,${x.g[0]},${x.g[1]});color:${x.gen?'#2a1800':'#fff'}">${ic(x.gen?'wallet':'build',20)}</span><span class="t"><b>${esc(x.name)}</b><small>${x.v<0?'перерасход: потрачено больше, чем выдано':hands>0?Math.round(Math.max(0,x.v)/tot*100)+'% от суммы на руках':''}</small></span><span class="a ${x.v<0?'neg':''}">${money(x.v)}</span>`;
    return x.id?`<button type="button" class="row-c" onclick="later(()=>openObj('${x.id}'))">${inner}</button>`:`<div class="row-c">${inner}</div>`}).join('')}
  <div class="row-c" style="background:none;border-style:dashed"><span class="t"><b>Итого на руках</b><small>сумма всех конвертов</small></span><span class="a">${money(hands)}</span></div></div>
  ${kassa(null)>0&&activeObjs().length?`<button type="button" class="btn pri w" onclick="later(()=>fTransfer())">${ic('arrow',20)}Разложить по объектам</button>`:''}`)}

/* ---------- меню «+» ---------- */
function fAct(){buzz(8);const A=[['bolt','Умный ввод','#ffc83d','smartSheet()'],['in','Получил','#2ee59d','fIncome()'],['arrow','На объект','#ffb020','fTransfer()'],['minus','Расход','#ff7a1a','fExpense()'],['cash','Аванс','#ff9a1a','fAdvance()'],['wallet','Зарплата','#ff2e7e','payroll()'],['fine','Штраф','#ff5468','fFine()'],['check','Перекличка','#22d3ee','quickRoll()'],['ruler','Выработка','#8b5cff','quickOut()']];
  sheet('Что записать?',`<div class="actgrid">${A.map(([i,l,c,f],k)=>`<button type="button" class="qa rise" style="--i:${k}" onclick="later(()=>${f})"><span style="--g:linear-gradient(140deg,${c},color-mix(in srgb,${c} 55%,#7a1aff));--sh:${c}">${ic(i,24,2.2)}</span>${l}</button>`).join('')}</div>
  <div class="actgrid" style="grid-template-columns:1fr 1fr"><button type="button" class="btn" onclick="later(()=>fPerson())">${ic('user',18)}Человек</button><button type="button" class="btn" onclick="later(()=>fObject())">${ic('build',18)}Объект</button></div>`)}
function pickObj(cb,title){const objs=activeObjs();if(!objs.length)return fObject();if(objs.length===1)return cb(objs[0].id);
  window.__pick=cb;sheet(title,`<div class="list">${objs.map(o=>`<button type="button" class="row-c" onclick="later(()=>__pick('${o.id}'))"><span class="av" style="background:linear-gradient(140deg,${gOf(o)[0]},${gOf(o)[1]})">${ic('build',20)}</span><span class="t"><b>${esc(o.name)}</b><small>${o.people.length} чел. · ${money(kassa(o.id))}</small></span>${ic('chev',18)}</button>`).join('')}</div>`)}
function quickRoll(){pickObj(id=>openObj(id,'att',today()),'Перекличка: какой объект?')}
function quickOut(){pickObj(id=>fOutput(id),'Выработка: какой объект?')}

/* ---------- объекты ---------- */
function fObject(id){const o=id?oById(id):{name:'',addr:'',hue:S.objects.length%GR.length};
  sheet(id?'Объект':'Новый объект',`${F('Название',`<input name="name" value="${esc(o.name)}" placeholder="ЖК Северный, корп. 2" required data-l="название">`)}
  ${F('Адрес / заметка',`<input name="addr" value="${esc(o.addr)}">`)}
  <label class="f">Цвет карточки и башни</label><div class="colors">${GR.map((g,i)=>`<label style="--g1:${g[0]};--g2:${g[1]}"><input type="radio" name="hue" value="${i}" ${i===o.hue?'checked':''} aria-label="Цвет ${i+1}"></label>`).join('')}</div>`,
  fd=>{fd.hue=+fd.hue;if(id)Object.assign(o,fd);else{const n={id:uid(),...fd,people:[],works:[],arch:false};S.objects.push(n);nextTab=null;navStack.push(view);hpush({p:'obj:'+n.id});view='obj:'+n.id;objTab='price'}toast(id?'Сохранено':'Объект создан. Добавьте прайс и людей')},'Сохранить','pri',
  id?`<button type="button" class="btn" onclick="oById('${id}').arch=${!o.arch};save();closeSheet();go('objs');toast('${o.arch?'Объект возвращён':'Объект в архиве'}')">${o.arch?'Из архива':'В архив'}</button>`:'')}
function fWork(oid,wid){const o=oById(oid);const w=wid?o.works.find(x=>x.id===wid):{name:'',unit:'м²',price:''};
  sheet(wid?'Изменить работу':'Новая работа',`${F('Название',`<input name="name" value="${esc(w.name)}" placeholder="Штукатурка стен" required data-l="название">`)}
  <div class="two">${F('Цена, ₽',`<input name="price" type="number" inputmode="decimal" value="${esc(w.price)}" required data-l="цена">`)}${F('Единица',`<select name="unit">${UNITS.map(u=>`<option ${u===w.unit?'selected':''}>${u}</option>`).join('')}</select>`)}</div>
  ${wid?'<p class="hint">Новая цена действует для новых записей. Старые записи сохраняют свою цену.</p>':''}`,
  fd=>{fd.price=+fd.price;if(wid)Object.assign(w,fd);else o.works.push({id:uid(),...fd});toast('Прайс сохранён')},'Сохранить','pri',
  wid?`<button type="button" class="btn dng" onclick="confirmBox('Удалить работу из прайса?',()=>{const o=oById('${oid}');o.works=o.works.filter(x=>x.id!=='${wid}')})">Удалить</button>`:'')}
function fObjPeople(oid){const o=oById(oid);const ppl=activePeople();if(!ppl.length){go('people');return toast('Сначала добавьте людей в бригаду')}
  sheet('Кто работает на объекте',`<div class="checks">${ppl.map(p=>`<label><input type="checkbox" name="p_${p.id}" ${o.people.includes(p.id)?'checked':''}>${avatar(p,'sm')}${esc(fullName(p))}</label>`).join('')}</div>`,
  fd=>{o.people=ppl.filter(p=>fd['p_'+p.id]).map(p=>p.id);toast('Состав обновлён')})}
function outView(id){const e=S.out.find(x=>x.id===id);if(!e)return;
  sheet(esc(e.wname),`<div class="amt-view">${money(e.total)}</div><div class="kv"><span>Дата</span><span>${fdateL(e.date)}</span><span>Объём</span><span>${e.vol} ${e.unit} × ${money(e.price)}</span><span>Объект</span><span>${esc(oName(e.obj))}</span></div>
  <div class="list">${Object.entries(e.shares).map(([pid,v])=>`<div class="row-c">${avatar(pById(pid),'sm')}<span class="t"><b>${esc(fullName(pById(pid)))}</b></span><span class="a">${money(v)}</span></div>`).join('')}</div>`,null,'','',
  `<button type="button" class="btn dng" onclick="closeSheet();toTrash('out',S.out.find(x=>x.id==='${id}'),'Выработка');save();render()">${ic('trash',18)}Удалить</button><button type="button" class="btn" onclick="closeSheet()">Закрыть</button>`)}
function fOutput(oid,pre={}){const o=oById(oid);if(!o)return;if(!o.works.length){openObj(oid,'price');return toast('Сначала добавьте работы в прайс объекта')}
  const ppl=o.people.map(pById).filter(p=>p&&!p.gone);if(!ppl.length){openObj(oid,'people');return toast('Сначала добавьте людей на объект')}
  sheet('Выработка',`
  ${F('Работа',`<select name="work" id="ow">${o.works.map(w=>`<option value="${w.id}" ${w.id===pre.work?'selected':''}>${esc(w.name)} · ${money(w.price)}/${w.unit}</option>`).join('')}</select>`)}
  <div class="two">${F('Объём',`<input type="number" step="0.01" min="0" name="vol" id="ov" inputmode="decimal" value="${pre.vol||''}" required data-l="объём">`)}${F('Дата',`<input type="date" name="date" id="odate" value="${pre.date||today()}" required data-l="дата">`)}</div>
  <div class="tot-line">Сумма к распределению<b id="otot">0 ₽</b></div>
  <div class="split"><button type="button" class="btn sm" id="oeq">Поровну</button><button type="button" class="btn sm" id="odays">По дням за месяц</button><button type="button" class="btn sm" id="oclr">Очистить</button></div>
  <div class="shares">${ppl.map(p=>`<label class="share">${avatar(p,'sm')}<span>${esc(shortName(p))}</span><input type="number" step="1" min="0" inputmode="numeric" data-pid="${p.id}" class="sh-in" placeholder="0" aria-label="Сумма для ${esc(shortName(p))}"></label>`).join('')}</div>
  <div class="rest" id="orest"></div>`,
  fd=>{const w=o.works.find(x=>x.id===fd.work);const total=rnd(fd.vol*w.price);const shares={};let s=0;
    $$('.sh-in').forEach(i=>{const v=rnd(i.value);if(v){shares[i.dataset.pid]=v;s+=v}});
    if(s!==total)return toast('Распределите всю сумму. Осталось: '+money(total-s)),false;
    S.out.push({id:uid(),date:fd.date,obj:oid,work:w.id,wname:w.name,unit:w.unit,vol:+fd.vol,price:+w.price,total,shares});toast('Выработка записана: '+money(total))},'Записать');
  const ins=$$('.sh-in');
  const total=()=>{const w=o.works.find(x=>x.id===$('#ow').value);return rnd((+$('#ov').value||0)*w.price)};
  const upd=()=>{const t=total();$('#otot').textContent=money(t);const s=ins.reduce((a,i)=>a+rnd(i.value),0);const r=t-s;
    $('#orest').innerHTML=t>0&&r===0?`<b class="pos">Распределено полностью</b>`:`Осталось распределить: <b class="${r<0?'neg':''}">${money(r)}</b>`};
  const fill=w=>{const t=total();const W=w.reduce((a,b)=>a+b,0);if(!t)return toast('Сначала укажите объём');if(!W)return toast('Нет отработанных дней за этот месяц');
    let acc=0;ins.forEach((i,k)=>{const v=Math.floor(t*w[k]/W);i.value=v||'';acc+=v});let rest=t-acc;
    for(let k=0;rest>0;k=(k+1)%ins.length){if(w[k]){ins[k].value=(+ins[k].value||0)+1;rest--}}upd();buzz(6)};
  $('#ov').oninput=upd;$('#ow').onchange=upd;ins.forEach(i=>i.oninput=upd);
  $('#oeq').onclick=()=>fill(ins.map(()=>1));$('#oclr').onclick=()=>{ins.forEach(i=>i.value='');upd()};
  $('#odays').onclick=()=>{const m=$('#odate').value.slice(0,7);fill(ins.map(i=>{let c=0;for(const k in S.att)if(k.startsWith(oid+'|'+m)){const r=S.att[k][i.dataset.pid];if(r&&WORKING(r.st))c++}return c}))};
  if(pre.pids&&pre.pids.length&&pre.vol){const w=pre.pids.length;ins.forEach(i=>{if(!pre.pids.includes(i.dataset.pid))i.value=''});const sel=ins.map(i=>pre.pids.includes(i.dataset.pid)?1:0);setTimeout(()=>fill(sel),0)}
  upd()}

/* ---------- люди ---------- */
function fPerson(id){const p=id?pById(id):{first:'',last:'',phone:'',payType:'day',dayRate:'',note:''};
  sheet(id?'Изменить':'Новый человек',`
  <div class="photo-pick" style="justify-content:center">${p.photo?`<img id="pv" class="av lg" src="${p.photo}" alt="">`:`<div id="pv" class="av lg" style="--c:#ff7a1a">${ic('cam',34)}</div>`}<span class="btn sm filebtn">${ic('cam',18)}Фото<input type="file" accept="image/*" onchange="pickPhoto(this,'photo',420)"></span><input type="hidden" name="photo" value="${p.photo||''}"></div>
  <div class="two">${F('Фамилия',`<input name="last" value="${esc(p.last)}" required data-l="фамилия" autocapitalize="words">`)}${F('Имя',`<input name="first" value="${esc(p.first)}" autocapitalize="words">`)}</div>
  ${F('Телефон',`<input name="phone" type="tel" value="${esc(p.phone)}">`)}
  <div class="two">${F('Оплата обычно',`<select name="payType"><option value="day" ${p.payType==='day'?'selected':''}>За день</option><option value="sqm" ${p.payType==='sqm'?'selected':''}>За объём</option></select>`)}${F('Ставка в день, ₽',`<input name="dayRate" type="number" inputmode="numeric" value="${esc(p.dayRate)}">`)}</div>
  ${F('Заметка',`<input name="note" value="${esc(p.note)}" placeholder="Специальность, документы…">`)}
  ${!id&&activeObjs().length?`<label class="f">Сразу добавить на объекты</label><div class="checks">${activeObjs().map(o=>`<label><input type="checkbox" name="o_${o.id}" ${activeObjs().length===1?'checked':''}><span class="av sm" style="background:linear-gradient(140deg,${gOf(o)[0]},${gOf(o)[1]})">${ic('build',16)}</span>${esc(o.name)}</label>`).join('')}</div>`:''}`,
  fd=>{const rec={first:fd.first,last:fd.last,phone:fd.phone,payType:fd.payType,dayRate:rnd(fd.dayRate),note:fd.note,photo:fd.photo};if(id)Object.assign(p,rec);else{const n={id:uid(),...rec};S.people.push(n);activeObjs().forEach(o=>{if(fd['o_'+o.id])o.people.push(n.id)})}toast(id?'Сохранено':'Добавлен в бригаду')},'Сохранить','pri',
  id?`<button type="button" class="btn dng" onclick="confirmBox('Убрать человека из бригады? Его история и расчёты сохранятся.',()=>{pById('${id}').gone=true;S.objects.forEach(o=>o.people=o.people.filter(x=>x!=='${id}'));view='people';navStack=[]})">Убрать</button>`:'')}

/* ---------- отчёты и копия ---------- */
function textReport(oid){const d=today();const lines=[];const objs=oid?[oById(oid)]:activeObjs();
  lines.push(`Отчёт · ${fdateL(d)}`);if(!oid)lines.push(`На руках всего: ${money(onHands())}`);
  objs.forEach(o=>{const s=objStats(o.id);lines.push('',`🏗 ${o.name}`,`Остаток: ${money(s.left)} (получено ${money(s.recv)}, потрачено ${money(s.spent)})`);
    const by={};S.ops.filter(x=>x.obj===o.id&&SPEND.includes(x.type)).forEach(x=>{const c=catOf(x);by[c]=(by[c]||0)+ +x.amount});
    const cs=Object.entries(by).sort((a,b)=>b[1]-a[1]);if(cs.length)lines.push('Расходы: '+cs.map(([c,v])=>`${c} ${money(v)}`).join(', '));
    const day=S.att[o.id+'|'+d]||{};const w=Object.keys(day).filter(k=>WORKING(day[k].st)).map(k=>shortName(pById(k)));const nw=Object.keys(day).filter(k=>!WORKING(day[k].st)).map(k=>`${shortName(pById(k))} (${ST[day[k].st].l.toLowerCase()})`);
    if(w.length)lines.push(`👷 Сегодня на работе ${w.length}: ${w.join(', ')}`);if(nw.length)lines.push('Не вышли: '+nw.join(', '));
    const out=S.out.filter(x=>x.obj===o.id&&x.date===d);if(out.length)lines.push('Выработка: '+out.map(x=>`${x.wname} ${x.vol} ${x.unit}`).join(', '))});
  return lines.join('\n')}
function shareReport(oid){const txt=textReport(oid);
  if(!inFrame&&navigator.share){navigator.share({text:txt}).catch(()=>{});return}
  sheet('Отчёт текстом',`<textarea id="bk" readonly style="font-family:var(--sans);font-size:14px;min-height:220px">${esc(txt)}</textarea><p class="hint">Скопируйте и отправьте в WhatsApp или Telegram.</p>`,null,'','',`<button type="button" class="btn pri" onclick="copyBk()">${ic('copy',18)}Скопировать</button>`)}
function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
function backup(){const json=JSON.stringify(S);S.settings.lastBackup=Date.now();save();
  if(inFrame){sheet('Копия данных',`<p class="hint">В этом окне скачивание файлов не работает. Скопируйте текст и сохраните, например отправьте себе в Telegram. В установленном приложении копия сохраняется файлом.</p><textarea id="bk" readonly>${esc(json)}</textarea>`,null,'','',`<button type="button" class="btn pri" onclick="copyBk()">${ic('copy',18)}Скопировать</button>`);return}
  download('kassa-brigadira-'+today()+'.json',new Blob([json],{type:'application/json'}));toast('Копия сохранена в «Загрузки»');render()}
function copyBk(){const t=$('#bk');const sel=()=>{t.select();toast('Текст выделен — скопируйте его')};try{navigator.clipboard.writeText(t.value).then(()=>toast('Скопировано'),sel)}catch(e){sel()}}
function restoreFile(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>restoreText(r.result);r.readAsText(f)}
function restoreText(txt,isSnap){let d;try{d=typeof txt==='string'?JSON.parse(txt):txt}catch(e){return toast('Не удалось прочитать файл копии')}
  if(!d||!Array.isArray(d.people)||!Array.isArray(d.ops))return toast('В файле нет данных кассы');
  confirmBox(`Заменить текущие данные ${isSnap?'снимком':'копией'}? Там ${d.people.length} чел., ${(d.objects||[]).length} объектов, ${d.ops.length} операций.`,()=>{S=migrate(d);S.settings.tour=S.settings.tour||'done';toast('Данные восстановлены');setTimeout(confetti,300)},'Восстановить')}
function fRestorePaste(){sheet('Вставить копию',`<textarea id="rp" placeholder="Вставьте сюда текст копии"></textarea>`,()=>{const t=$('#rp').value.trim();setTimeout(()=>restoreText(t),260)},'Восстановить')}
async function snapsSheet(){const ks=((await DB.keys())||[]).filter(x=>String(x).startsWith('snap:')).sort().reverse();
  sheet('Снимки по дням',ks.length?`<p class="hint">Приложение само сохраняет снимок данных раз в день и хранит последние 7.</p><div class="list">${ks.map(k=>`<button type="button" class="row-c" onclick="loadSnap('${k}')"><span class="av" style="background:linear-gradient(140deg,#22d3ee,#5b4bff)">${ic('restore',20)}</span><span class="t"><b>${fdateL(k.slice(5))}</b><small>Вернуться к этому дню</small></span>${ic('chev',18)}</button>`).join('')}</div>`:`<div class="empty">${ic('restore',28)}Снимков пока нет. Первый появится сегодня после работы с настоящими данными</div>`)}
async function loadSnap(k){const s=await DB.get(k);closeSheet();if(s)setTimeout(()=>restoreText(s.data,true),260)}
function trashSheet(){const T=S.trash;sheet('Корзина',T.length?`<p class="hint">Удалённое хранится 30 дней.</p><div class="list">${T.map(t=>{const it=t.item;let title=t.label,a=it.amount||it.total;if(t.kind==='op')title=opInfo(it).t;if(t.kind==='out')title='Выработка · '+it.wname;if(t.kind==='fine')title='Штраф · '+shortName(pById(it.pid));
    return `<div class="row-c"><span class="t"><b>${esc(title)}</b><small>${fdateL(it.date)} · осталось ${Math.max(0,30-Math.floor((Date.now()-t.at)/864e5))} дн.</small></span><span class="a">${money(a)}</span><button type="button" class="ib" onclick="restoreTrash('${t.id}');save();trashSheet();render()" aria-label="Восстановить">${ic('restore',18)}</button></div>`}).join('')}</div>`:`<div class="empty">${ic('trash',28)}Корзина пуста</div>`)}
function fRules(){const R=S.settings.rules;
  sheet('Мои правила',`<p class="hint">По этим правилам приложение даёт подсказки и предупреждает при выдаче денег.</p>
  ${F('Норма на еду: ₽ на человека в день',`<input name="food" type="number" inputmode="numeric" value="${R.food}">`)}
  ${F('Аванс — не больше, % от заработанного',`<input name="advPct" type="number" inputmode="numeric" min="0" max="100" value="${R.advPct}">`)}
  ${F('Неприкосновенный запас, % от денег на руках',`<input name="reserve" type="number" inputmode="numeric" min="0" max="100" value="${R.reserve}">`)}
  ${F('Напоминать о копии через, дней',`<input name="backupDays" type="number" inputmode="numeric" min="1" value="${R.backupDays}">`)}`,
  fd=>{Object.keys(fd).forEach(k=>R[k]=Math.max(0,+fd[k]||0));toast('Правила сохранены')})}

/* ---------- Excel ---------- */
function xlsxOk(){if(typeof XLSX==='undefined'){toast('Модуль Excel не загрузился. Откройте приложение с интернетом');return false}if(inFrame){toast('Здесь скачивание не работает. Excel сохраняется в установленном приложении');return false}return true}
const T_L={income:'Получено',transfer:'На объект',expense:'Расход',advance:'Аванс',payout:'Зарплата'};
function opsSheet(ops,objMode){const kas=[['Дата','Тип','Касса','Статья','Человек','Приход','Расход','Заметка']];
  ops.forEach(o=>{const plus=o.type==='income'||(o.type==='transfer'&&objMode);kas.push([fdate(o.date)+'.'+o.date.slice(0,4),T_L[o.type],oName(o.obj),o.cat||'',o.pid?fullName(pById(o.pid)):'',plus?o.amount:'',plus||o.type==='transfer'?'':o.amount,o.note||''])});
  kas.push([]);kas.push(['','','','','Итого',sum(ops.filter(o=>o.type==='income'||(o.type==='transfer'&&objMode)),o=>o.amount),sum(ops.filter(o=>SPEND.includes(o.type)),o=>o.amount)]);
  const ws=XLSX.utils.aoa_to_sheet(kas);ws['!cols']=[{wch:11},{wch:11},{wch:22},{wch:12},{wch:22},{wch:11},{wch:11},{wch:28}];return ws}
function excelOps(){if(!xlsxOk())return;const L=opsFiltered().sort((a,b)=>a.date.localeCompare(b.date));const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,opsSheet(L,OF.objs.length>0),'Операции');XLSX.writeFile(wb,'operacii-'+today()+'.xlsx');toast('Сохранено: '+L.length+' операций')}
function excel(){if(!xlsxOk())return;
  const oid=$('#xo').value||null,m=$('#xm').value;const from=m?m+'-01':null,to=m?m+'-31':null;const inR=d=>!m||d.startsWith(m);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,opsSheet(S.ops.filter(o=>inR(o.date)&&(!oid||o.obj===oid)).sort((a,b)=>a.date.localeCompare(b.date)),!!oid),'Касса');
  const zp=[['Фамилия Имя','Дней','За дни','За объём','Заработано','Авансы','Штрафы','Выплачено','К выдаче']];
  activePeople().forEach(p=>{const e=earn(p.id,oid,from,to);if(e.earned||e.adv||e.paid||e.fines)zp.push([fullName(p),e.days,e.dayMoney,e.outMoney,e.earned,e.adv,e.fines,e.paid,e.due])});
  const ws2=XLSX.utils.aoa_to_sheet(zp);ws2['!cols']=[{wch:24},{wch:6},...Array(7).fill({wch:12})];XLSX.utils.book_append_sheet(wb,ws2,'Зарплата');
  const vy=[['Дата','Объект','Работа','Объём','Ед.','Цена','Сумма','Распределение']];
  S.out.filter(e=>inR(e.date)&&(!oid||e.obj===oid)).forEach(e=>vy.push([fdate(e.date),oName(e.obj),e.wname,e.vol,e.unit,e.price,e.total,Object.entries(e.shares).map(([k,v])=>shortName(pById(k))+' '+v).join('; ')]));
  const ws3=XLSX.utils.aoa_to_sheet(vy);ws3['!cols']=[{wch:10},{wch:20},{wch:22},{wch:8},{wch:5},{wch:8},{wch:10},{wch:40}];XLSX.utils.book_append_sheet(wb,ws3,'Выработка');
  if(m){const [y,mm]=m.split('-').map(Number);const n=new Date(y,mm,0).getDate();
    (oid?[oById(oid)]:S.objects).forEach(o=>{const ids=new Set(o.people);for(const k in S.att)if(k.startsWith(o.id+'|'+m))Object.keys(S.att[k]).forEach(i=>ids.add(i));if(!ids.size)return;
      const rows=[['Фамилия Имя',...Array.from({length:n},(_,i)=>i+1),'Дней']];
      [...ids].map(pById).filter(Boolean).forEach(p=>{let c=0;const r=[fullName(p)];for(let d=1;d<=n;d++){const a=S.att[o.id+'|'+m+'-'+String(d).padStart(2,'0')]?.[p.id];if(a&&WORKING(a.st))c++;r.push(a?ST[a.st].s:'')}r.push(c);rows.push(r)});
      const ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:24},...Array(n).fill({wch:3.5}),{wch:5}];XLSX.utils.book_append_sheet(wb,ws,('Табель '+o.name).slice(0,31).replace(/[\\\/\?\*\[\]:]/g,' '))})}
  XLSX.writeFile(wb,'otchet-'+(oid?oName(oid).replace(/[^\wа-яё]+/gi,'-'):'vse')+'-'+(m||'vse-vremya')+'.xlsx');toast('Отчёт сохранён в «Загрузки»')}
