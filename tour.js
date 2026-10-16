/* ===== Касса бригадира · обучение от А до Я ===== */
const CHAPTERS=[{k:'kassa',l:'Касса',ic:'wallet'},{k:'objs',l:'Объекты',ic:'build'},{k:'people',l:'Бригада',ic:'users'},{k:'money',l:'Зарплата',ic:'cash'},{k:'ops',l:'Операции',ic:'search'},{k:'safe',l:'Сохранность',ic:'shield'},{k:'end',l:'Готово',ic:'check'}];
const STEPS=[
 {ch:'kassa',v:'fin',t:'#hero',title:'Ваши деньги в 3D',text:'Сверху — сколько денег у вас <b>на руках</b>. Ниже — город: каждый объект это башня. <b>Высота</b> — сколько денег выдано на объект, <b>светящаяся часть</b> — сколько осталось. Золотые монеты — свободные деньги. Крутите город пальцем, нажмите на башню — откроется объект.'},
 {ch:'kassa',v:'fin',t:'#envBtn',title:'Конверты',text:'Полоска показывает, как деньги на руках разложены по объектам. Нажмите на неё — увидите точные суммы. Сумма всех конвертов всегда равна деньгам на руках.'},
 {ch:'kassa',v:'fin',t:'.kpis',title:'Три главные цифры',text:'Сколько лежит <b>на объектах</b>, сколько <b>свободно</b> и сколько вы <b>должны людям</b> по расчёту. Если долг больше денег на руках, цифра станет красной.'},
 {ch:'kassa',v:'fin',t:'#smart',title:'Умная строка',text:'Самый быстрый способ записать что угодно. Напишите или скажите как обычно: <code>еда 3500</code>, <code>аванс Иванову 5к</code>, <code>получил 200 тыс</code>. Приложение само поймёт, что это, из какой кассы и на кого, покажет и запишет. Ошиблись — нажмите «Отменить».'},
 {ch:'kassa',v:'fin',t:'#quick',title:'Быстрые кнопки',text:'Пять частых действий в одно касание: получил деньги, переложил на объект, расход, аванс и зарплата.'},
 {ch:'kassa',v:'fin',t:'#today',title:'Сегодня',text:'Список дел на день: перекличка по каждому объекту и сколько уже потрачено. Нажмите на объект — сразу откроется перекличка.'},
 {ch:'kassa',v:'fin',t:'#hints',title:'Подсказки',text:'Приложение само считает: на сколько дней хватит денег, где они заканчиваются, кто взял больше, чем заработал, сколько уходит на еду. Нажмите на подсказку — откроется нужное место.'},
 {ch:'kassa',v:'fin',t:'#charts',title:'Графики',text:'Куда ушли деньги за месяц и сколько тратили каждый день. Нажмите на статью в списке — увидите все такие операции.'},
 {ch:'objs',v:'objs',t:'#objList .oc',title:'Объекты',text:'Каждый объект — отдельный конверт со своей кассой. Кольцо показывает, какая часть выданных денег уже потрачена.'},
 {ch:'objs',v:'obj:first',t:'#ohero',title:'Страница объекта',text:'Остаток, сколько получено и потрачено. Кнопки сверху — отчёт текстом для WhatsApp и настройки объекта.'},
 {ch:'objs',v:'obj:first',t:'#otabs',title:'Шесть вкладок',text:'Касса, перекличка, табель, выработка, люди и прайс — всё по этому объекту в одном месте.'},
 {ch:'objs',v:'obj:first',tab:'att',t:'#tabb',title:'Перекличка',text:'Каждое утро отметьте, кто вышел. Кнопки <b>«Все вышли»</b> и <b>«Как вчера»</b> — в одно касание, время прихода ставится само. Отпуск или больничный можно отметить сразу до нужной даты.'},
 {ch:'objs',v:'obj:first',tab:'tabel',t:'#tabb',title:'Табель',text:'Собирается сам из переклички. Цвет клетки — статус, справа — сколько дней отработано за месяц.'},
 {ch:'objs',v:'obj:first',tab:'out',t:'#tabb',title:'Выработка',text:'Работа за объём: выберите работу из прайса, введите объём — сумма посчитается сама. Разделите её поровну, по отработанным дням или вручную.'},
 {ch:'objs',v:'obj:first',tab:'price',t:'#tabb',title:'Прайс',text:'Свои расценки для каждого объекта: штукатурка, стяжка, откосы — за м², погонный метр, куб или штуку.'},
 {ch:'people',v:'people',t:'#pfilters',title:'Бригада',text:'Поиск и фильтры: кто сегодня на работе, кто не отмечен, кому нужно выдать деньги и кто взял лишнее.'},
 {ch:'people',v:'people',t:'#pgrid .pcard',title:'Карточка человека',text:'Фото, статус на сегодня и сколько ему к выдаче. Нажмите на карточку — откроется полный расчёт.'},
 {ch:'people',v:'person:first',t:'#phead',title:'Расчёт человека',text:'Заработано за дни и за объём минус авансы, штрафы и выплаты — получается сумма к выдаче. Всё считается само.'},
 {ch:'people',v:'person:first',t:'#personActs',title:'Аванс, штраф, выплата',text:'При выдаче аванса приложение проверит ваше правило и подскажет, сколько ещё можно дать.'},
 {ch:'money',v:'people',t:'#payrollBtn',title:'Зарплата всем сразу',text:'Одна кнопка — и все получают деньги. В режиме <b>«Авто»</b> приложение само спишет их из касс тех объектов, где человек заработал, и предупредит, если где-то не хватает.'},
 {ch:'money',v:'people',t:'.nav .fab',title:'Кнопка «+»',text:'Все действия в одном месте: умный ввод, приход, расход, аванс, зарплата, штраф, перекличка, выработка, новый человек или объект.'},
 {ch:'ops',v:'ops',t:'#opsSearch',title:'Поиск',text:'Найдите любую операцию по слову, фамилии, объекту или сумме — например, <code>перфоратор</code> или <code>Иванов</code>.'},
 {ch:'ops',v:'ops',t:'#opsFilters',title:'Фильтры',text:'Период, приходы или траты, статьи расходов, объекты и люди. Фильтры сочетаются между собой.'},
 {ch:'ops',v:'ops',t:'#opsSum',title:'Итоги',text:'Сколько пришло и ушло по выбранным фильтрам и график по дням. Кнопка со стрелкой сверху сохранит всё это в Excel.'},
 {ch:'safe',v:'more',t:'#excelCard',title:'Отчёт начальству',text:'Excel за месяц: касса, зарплата, выработка и табель. Или короткий отчёт текстом прямо в WhatsApp. Сюда же ведёт шестерёнка на главном экране.'},
 {ch:'safe',v:'more',t:'#rulesRow',title:'Мои правила',text:'Норма на еду, лимит аванса и неприкосновенный запас. По этим правилам приложение предупреждает и даёт подсказки.'},
 {ch:'safe',v:'more',t:'#backupRow',title:'Копия данных',text:'Данные хранятся только в телефоне. Сохраняйте копию и отправляйте себе в Telegram. Ещё приложение само делает снимок каждый день, а удалённое 30 дней лежит в корзине.'},
 {ch:'end',v:'fin',t:null,title:'Готово! Вы знаете всё',text:'Начните с примера или с чистого листа. Обучение всегда можно пройти снова: шестерёнка → «Обучение заново».',final:true}
];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function waitFor(fn,ms=2500){const t0=performance.now();while(performance.now()-t0<ms){try{const v=fn();if(v)return v}catch(e){}await wait(80)}return null}
const Tour={on:false,i:0,dir:1,busy:false,
  resolve(v){if(v==='obj:first'){const o=activeObjs().find(o=>o.people.length)||activeObjs()[0];return o?'obj:'+o.id:'objs'}if(v==='person:first'){const p=activePeople()[0];return p?'person:'+p.id:'people'}return v},
  start(i=0){closeSheet();$('#welcome')?.remove();this.on=true;this.mount();buzz(10);this.show(i)},
  mount(){if($('#tour'))return;const d=document.createElement('div');d.id='tour';d.style.viewTransitionName='tour';d.setAttribute('role','dialog');d.setAttribute('aria-label','Обучение');
    d.innerHTML='<div class="catch"></div><div class="spot none"></div><div class="tip" aria-live="polite"></div>';document.body.appendChild(d);
    this.onKey=e=>{if(e.key==='Escape')this.end();if(e.key==='ArrowRight')this.next();if(e.key==='ArrowLeft')this.prev()};document.addEventListener('keydown',this.onKey);
    this.onRs=()=>this.place(this.el);window.addEventListener('resize',this.onRs)},
  async show(i){if(this.busy)return;this.busy=true;try{
    i=Math.max(0,Math.min(STEPS.length-1,i));this.i=i;const st=STEPS[i];
    const v=this.resolve(st.v);
    if(v!==view){if(v.startsWith('obj:')&&st.tab)nextTab=st.tab;go(v);await waitFor(()=>view===v);await wait(reduced()?60:420)}
    if(st.tab&&objTab!==st.tab){objTab=st.tab;render();await wait(80)}
    let el=st.t?await waitFor(()=>$(st.t),1500):null;
    if(st.t&&!el){this.busy=false;return this.show(i+this.dir)}
    if(el){const r=el.getBoundingClientRect();if(r.top<70||r.bottom>innerHeight-110){el.scrollIntoView({block:r.height>innerHeight*.55?'start':'center',behavior:reduced()?'auto':'smooth'});await wait(reduced()?40:450)}}
    this.el=el;this.place(el);this.tipHTML(st)}finally{this.busy=false}},
  place(el){const sp=$('#tour .spot'),tip=$('#tour .tip');if(!sp)return;
    if(!el){sp.classList.add('none');tip.style.top='';tip.style.bottom='';tip.style.top='50%';tip.style.transform='translateY(-50%)';return}
    tip.style.transform='';sp.classList.remove('none');const r=el.getBoundingClientRect();const pad=8;
    const top=Math.max(8,r.top-pad),bot=Math.min(innerHeight-8,r.bottom+pad);
    Object.assign(sp.style,{left:(r.left-pad)+'px',top:top+'px',width:(r.width+pad*2)+'px',height:Math.max(20,bot-top)+'px',borderRadius:getComputedStyle(el).borderRadius==='0px'?'18px':`calc(${getComputedStyle(el).borderRadius} + 6px)`});
    const above=(top+bot)/2>innerHeight/2;
    if(above){tip.style.bottom='';tip.style.top='calc(12px + env(safe-area-inset-top,0px))'}else{tip.style.top='';tip.style.bottom='calc(12px + env(safe-area-inset-bottom,0px))'}},
  tipHTML(st){const tip=$('#tour .tip');const chI=CHAPTERS.findIndex(c=>c.k===st.ch);const inCh=STEPS.filter(s=>s.ch===st.ch);const k=inCh.indexOf(st)+1;
    tip.classList.remove('anim');void tip.offsetWidth;tip.classList.add('anim');
    tip.innerHTML=`<button type="button" class="x" onclick="Tour.end()" aria-label="Закончить обучение">${ic('x',16)}</button>
     <div class="chs">${CHAPTERS.map((c,j)=>`<button type="button" class="${j===chI?'on':j<chI?'done':''}" onclick="Tour.goCh('${c.k}')">${j<chI?ic('check',12,3):ic(c.ic,12,2.4)}${c.l}</button>`).join('')}</div>
     <div class="tt">${st.title}</div><div class="tx">${st.text}</div>
     <div class="tprog"><i style="width:${(this.i+1)/STEPS.length*100}%"></i></div>
     <div class="tmeta"><span>${st.final?'Обучение пройдено':`Глава ${chI+1} из ${CHAPTERS.length-1} · шаг ${k} из ${inCh.length}`}</span><span>${this.i+1} / ${STEPS.length}</span></div>
     <div class="tbtns">${st.final?`<button type="button" class="btn sm" onclick="Tour.finish(false)">Оставить пример</button><button type="button" class="btn pri sm" onclick="Tour.finish(true)">Начать с чистого листа</button>`
      :`${this.i?`<button type="button" class="btn sm" onclick="Tour.prev()" aria-label="Назад">${ic('back',16)}</button>`:''}<button type="button" class="btn sm" onclick="Tour.skipCh()">Пропустить главу</button><button type="button" class="btn pri sm" onclick="Tour.next()">Далее ${ic('chev',16)}</button>`}</div>`;
    if(st.final)setTimeout(confetti,200)},
  next(){this.dir=1;buzz(4);this.show(this.i+1)},
  prev(){this.dir=-1;buzz(4);this.show(this.i-1)},
  skipCh(){const ch=STEPS[this.i].ch;let j=this.i;while(j<STEPS.length&&STEPS[j].ch===ch)j++;this.dir=1;buzz(6);this.show(j)},
  goCh(k){const j=STEPS.findIndex(s=>s.ch===k);if(j>=0){this.dir=j>=this.i?1:-1;this.show(j)}},
  finish(clean){this.end(true);if(clean){const st=S.settings;S=blank();S.settings.tour='done';S.settings.rules=st.rules;save();go('fin');render();toast('Чистый лист. Начните с «Получил» или с «+»')}},
  end(done){this.on=false;$('#tour')?.remove();document.removeEventListener('keydown',this.onKey);window.removeEventListener('resize',this.onRs);
    S.settings.tour=done||this.i>=STEPS.length-1?'done':'skipped';save();if(view==='fin')render()},
  welcome(){if($('#welcome'))return;const w=document.createElement('div');w.id='welcome';w.setAttribute('role','dialog');w.setAttribute('aria-label','Добро пожаловать');
    const F=[['bolt','Пишите как говорите: «еда 3500» — и готово','#ffc83d','#ff7a1a'],['build','Объекты — башни в 3D-городе денег','#22c1ee','#5b4bff'],['users','Перекличка, табель и зарплата считаются сами','#2ee59d','#0a8ad8'],['shield','Работает без интернета, копия в один клик','#ff5fa2','#9a3cff']];
    w.innerHTML=`<div class="wbox"><div class="orb"><span>${ic('wallet',58,1.6)}</span></div><h1>Касса бригадира</h1><p>Деньги, объекты и бригада в одном месте. Приложение само считает остатки и зарплату и подсказывает, где перерасход.</p>
     <div class="feats">${F.map(([i,t,a,b],k)=>`<div style="--i:${k};--g:linear-gradient(140deg,${a},${b})"><span>${ic(i,20)}</span>${t}</div>`).join('')}</div>
     <button type="button" class="btn pri w" onclick="Tour.start()">${ic('grad',20)}Пройти обучение · 3 минуты</button>
     <button type="button" class="btn w" onclick="Tour.skipAll()">Пропустить, разберусь сам</button>
     <p class="hint">Сейчас загружен пример с вымышленными данными. Его можно очистить в любой момент.</p></div>`;document.body.appendChild(w)},
  skipAll(){$('#welcome')?.remove();S.settings.tour='skipped';save();render()}
};
