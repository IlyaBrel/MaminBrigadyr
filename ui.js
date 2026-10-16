/* ===== Касса бригадира · интерфейс: навигация, листы, анимации ===== */

/* ---------- навигация (с системной кнопкой «назад») ---------- */
const depth=v=>v.includes(':')?1:0;
let navStack=[],ignorePop=false,nextTab=null;
function openObj(id,tab,date){nextTab=tab||null;if(date)attDate=date;go('obj:'+id,'obj:'+id)}
const hpush=s=>{try{history.pushState(s,'')}catch(e){}};
function go(v,key,isBack){const from=view;if(v===from&&!key){window.scrollTo({top:0,behavior:reduced()?'auto':'smooth'});return render()}
  const back=isBack||depth(v)<depth(from),fwd=!isBack&&depth(v)===1;
  if(!isBack){if(fwd){navStack.push(from);hpush({p:v})}else if(depth(v)===0){navStack=[];if(v!=='fin'&&from==='fin')hpush({p:v})}}
  vtKey=key||(back&&depth(from)?from:null);
  $$('[data-vt]').forEach(el=>el.style.viewTransitionName=el.dataset.vt===vtKey?'hero':'');
  document.documentElement.dataset.nav=back?'back':fwd?'fwd':'tab';
  const upd=()=>{view=v;if(v.startsWith('obj:')&&(!from.startsWith(v)||nextTab))objTab=nextTab||'kassa';nextTab=null;render();window.scrollTo(0,0)};
  buzz(5);
  if(document.startViewTransition&&!reduced()){try{const tr=document.startViewTransition(upd);tr.finished.finally(()=>{vtKey=null;$$('[data-vt]').forEach(el=>el.style.viewTransitionName='')})}catch(e){upd()}}
  else{upd();const m=$('#main');m.classList.remove('enter');void m.offsetWidth;m.classList.add('enter')}}
function goBack(fallback){if(navStack.length){ignorePop=true;try{history.back()}catch(e){}go(navStack.pop(),null,true)}else go(fallback,null,true)}
window.addEventListener('popstate',()=>{if(ignorePop){ignorePop=false;return}
  if(window.Tour&&Tour.on){Tour.end();return}
  if(!$('#sheet').hidden&&sheetPushed){sheetPushed=false;closeSheet(true);return}
  if(navStack.length)go(navStack.pop(),null,true);else if(view!=='fin')go('fin',null,true)});

/* ---------- тост ---------- */
let toastT;
function toast(t,undo){const e=$('#toast');e.innerHTML=`<span>${esc(t)}</span>${undo?'<button type="button" id="undo">Отменить</button>':''}`;e.hidden=false;e.style.animation='none';void e.offsetWidth;e.style.animation='';
  if(undo)$('#undo').onclick=()=>{undo();e.hidden=true;save();render()};clearTimeout(toastT);toastT=setTimeout(()=>e.hidden=true,undo?5000:2600)}

/* ---------- листы ---------- */
let closeT=null,sheetPushed=false;
function closeSheet(fromPop){const s=$('.sh');
  if(sheetPushed&&!fromPop){sheetPushed=false;ignorePop=true;try{history.back()}catch(e){ignorePop=false}}
  document.body.style.overflow='';if(window.Voice)Voice.stop();
  const done=()=>{closeT=null;$('#sheet').hidden=true;$('#sheet').innerHTML=''};
  if(!s||reduced())return done();
  s.classList.add('closing');const bk=$('.sh-back');if(bk){bk.style.transition='opacity .25s';bk.style.opacity=0}clearTimeout(closeT);closeT=setTimeout(done,230)}
function sheet(title,body,onOk,okLabel='Сохранить',okCls='pri',extra=''){
  const wasOpen=!$('#sheet').hidden&&!closeT;clearTimeout(closeT);closeT=null;
  $('#sheet').innerHTML=`<div class="sh-back ${wasOpen?'noanim':''}" onclick="closeSheet()"></div><form class="sh ${wasOpen?'noanim':''}" id="shf" novalidate role="dialog" aria-label="${esc(title.replace(/<[^>]+>/g,''))}"><div class="sh-grab"><i></i></div><div class="sh-h"><h3>${title}</h3><button type="button" class="ib" onclick="closeSheet()" aria-label="Закрыть">${ic('x',18)}</button></div><div class="sh-b">${body}</div>${onOk||extra?`<div class="sh-f">${extra}${onOk?`<button class="btn ${okCls}" type="submit" id="okBtn">${okLabel}</button>`:''}</div>`:''}</form>`;
  $('#sheet').hidden=false;document.body.style.overflow='hidden';if(!sheetPushed){sheetPushed=true;hpush({s:1})}
  const f=$('#shf');
  f.onsubmit=e=>{e.preventDefault();if(!onOk)return;
    for(const el of f.querySelectorAll('[required]')){if(!String(el.value).trim()||(el.type==='number'&&+el.value<=0)){el.focus();toast('Заполните: '+(el.dataset.l||'поле'));return}}
    const fd=Object.fromEntries(new FormData(f));const before=$('#sheet').innerHTML;const r=onOk(fd,f);if(r===false)return;buzz(12);
    if($('#sheet').innerHTML===before)closeSheet();save();render()};
  let y0=null,dy=0;const sh=f;[f.querySelector('.sh-grab'),f.querySelector('.sh-h')].forEach(hd=>{hd.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;y0=e.clientY;dy=0;sh.style.transition='none';try{hd.setPointerCapture(e.pointerId)}catch(_){}});
    hd.addEventListener('pointermove',e=>{if(y0==null)return;dy=Math.max(0,e.clientY-y0);sh.style.transform=`translateY(${dy}px)`});
    const up=()=>{if(y0==null)return;sh.style.transition='transform .3s var(--spring)';if(dy>110)closeSheet();else sh.style.transform='';y0=null;dy=0};hd.addEventListener('pointerup',up);hd.addEventListener('pointercancel',up)});
  return f}
function confirmBox(text,fn,label='Удалить'){sheet('Подтвердите',`<p style="margin:0;font-size:16px;font-weight:600">${text}</p>`,()=>{fn()},label,'dng')}
const later=fn=>{closeSheet();setTimeout(fn,240)};

/* ---------- поля форм ---------- */
const F=(l,inner)=>`<label class="f">${l}${inner}</label>`;
function amtField(v='',l='Сумма',sugg=[]){return `<div class="amt-in"><span class="al">${l}</span><div class="amt-row"><input name="amount" id="amt" type="number" inputmode="numeric" min="1" value="${v}" placeholder="0" required data-l="сумма"><span>₽</span></div>
  <div class="qchips">${sugg.map(n=>`<button type="button" class="sg" onclick="qset(this,${n})">${fmtN(n)}</button>`).join('')}${[1000,5000,10000].map(n=>`<button type="button" onclick="qadd(this,${n})">+${fmtN(n)}</button>`).join('')}</div><div class="amt-note" id="amtNote"></div></div>`}
function qadd(b,n){const i=b.closest('.amt-in').querySelector('input');i.value=(+i.value||0)+n;i.dispatchEvent(new Event('input'));buzz(4)}
function qset(b,n){const i=b.closest('.amt-in').querySelector('input');i.value=n;i.dispatchEvent(new Event('input'));buzz(4)}
const catPicker=(sel='Еда')=>`<div class="cats">${CATS.map(c=>`<label class="catp" style="--c:${CAT[c].c}"><input type="radio" name="cat" value="${c}" ${c===sel?'checked':''}><span>${ic(CAT[c].ic,21)}</span>${c}</label>`).join('')}</div>`;
function objOptions(sel,withGeneral=true,noSel=false){return (withGeneral?`<option value="" ${!sel&&!noSel?'selected':''}>Общая касса · ${money(kassa(null))}</option>`:'')+S.objects.filter(o=>!o.arch||o.id===sel).map(o=>`<option value="${o.id}" ${o.id===sel&&!noSel?'selected':''}>${esc(o.name)} · ${money(kassa(o.id))}</option>`).join('')}
function personOptions(sel){return activePeople().map(p=>`<option value="${p.id}" ${p.id===sel?'selected':''}>${esc(fullName(p))}</option>`).join('')}
function pickPhoto(inp,name,max){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);const u=c.toDataURL('image/jpeg',.76);inp.form.querySelector(`[name=${name}]`).value=u;const pv=inp.form.querySelector('#pv');if(pv)pv.outerHTML=`<img id="pv" class="${name==='photo'?'av lg':'receipt'}" src="${u}" alt="" style="${name==='photo'?'':'max-height:90px;width:auto'}">`};img.src=r.result};r.readAsDataURL(f)}

/* ---------- одометр и счётчики ---------- */
const prevNum={};
function odo(v,k){const s=fmtN(v);return `<span class="odo" data-odo="${rnd(v)}" data-k="${k}" aria-label="${s} рублей">${[...s].map(c=>/\d/.test(c)?`<span class="dg"><span class="dgs">${[0,1,2,3,4,5,6,7,8,9].map(d=>`<i>${d}</i>`).join('')}</span></span>`:`<span class="sp">${c===' '?'':esc(c)}</span>`).join('')}<span class="cur">₽</span></span>`}
function odos(){$$('[data-odo]').forEach(el=>{const v=+el.dataset.odo,k=el.dataset.k;const prev=prevNum[k];prevNum[k]=v;
  const to=[...fmtN(v)].filter(c=>/\d/.test(c)).map(Number);const fr=prev!=null?[...fmtN(prev)].filter(c=>/\d/.test(c)).map(Number):null;
  const cols=[...el.querySelectorAll('.dgs')];
  cols.forEach((c,i)=>{const st=prev==null?0:(fr.length===to.length?fr[i]:to[i]);c.style.transition='none';c.style.transform=`translateY(${-st*10}%)`});
  if(reduced()||prev===v){cols.forEach((c,i)=>c.style.transform=`translateY(${-to[i]*10}%)`);return}
  requestAnimationFrame(()=>requestAnimationFrame(()=>cols.forEach((c,i)=>{c.style.transition=`transform ${1.1+i*.07}s cubic-bezier(.16,.9,.2,1)`;c.style.transform=`translateY(${-to[i]*10}%)`})))})}
function counters(){$$('[data-cnt]').forEach(el=>{const to=+el.dataset.cnt,k=el.dataset.k,from=k in prevNum?prevNum[k]:to*.6;prevNum[k]=to;
  if(reduced()||from===to){el.textContent=money(to);return}const t0=performance.now(),D=900;
  const step=t=>{const p=Math.min(1,(t-t0)/D),e=1-Math.pow(1-p,3);el.textContent=money(from+(to-from)*e);if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)})}
const cnt=(v,k,cls='')=>`<span class="num ${cls}" data-cnt="${rnd(v)}" data-k="${k}">${money(v)}</span>`;

/* ---------- эффекты ---------- */
function tilt(){const el=$('#bal');if(!el)return;let t;
  const mv=e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.classList.remove('idle');el.style.transition='transform .12s';
    el.style.setProperty('--ry',(x*18)+'deg');el.style.setProperty('--rx',(-y*14)+'deg');el.style.setProperty('--mx',((x+.5)*100)+'%');el.style.setProperty('--my',((y+.5)*100)+'%');clearTimeout(t)};
  const lv=()=>{el.style.transition='';el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');t=setTimeout(()=>el.classList.add('idle'),1200)};
  el.addEventListener('pointermove',mv);el.addEventListener('pointerleave',lv);el.addEventListener('pointerup',lv);el.addEventListener('pointercancel',lv)}
function coverflow(){const sc=$('#cf');if(!sc)return;const cards=[...sc.querySelectorAll('.oc')];const dots=$$('#cfd i');
  const f=()=>{const c=sc.scrollLeft+sc.clientWidth/2;let best=0,bd=1e9;cards.forEach((el,i)=>{const m=el.offsetLeft+el.offsetWidth/2;const o=Math.max(-1.6,Math.min(1.6,(m-c)/el.offsetWidth));
    if(Math.abs(o)<bd){bd=Math.abs(o);best=i}if(!reduced())el.style.transform=`perspective(900px) rotateY(${-o*24}deg) translateZ(${-Math.abs(o)*60}px) scale(${1-Math.abs(o)*.06})`;el.style.opacity=1-Math.min(.5,Math.abs(o)*.4)});
    dots.forEach((d,i)=>d.classList.toggle('on',i===best))};
  let raf;sc.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(f)},{passive:true});f()}
function segPills(){$$('.seg').forEach(s=>{const on=s.querySelector('button.on'),p=s.querySelector('.pill');if(!on||!p)return;p.style.width=on.offsetWidth+'px';p.style.transform=`translateX(${on.offsetLeft-4}px)`})}
document.addEventListener('pointermove',e=>{const g=e.target.closest&&e.target.closest('.glow');if(!g)return;const r=g.getBoundingClientRect();g.style.setProperty('--gx',(e.clientX-r.left)+'px');g.style.setProperty('--gy',(e.clientY-r.top)+'px')},{passive:true});
function confetti(){if(reduced())return;const c=$('#fx');c.hidden=false;const ctx=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1),W=innerWidth,H=innerHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const cols=['#ffc83d','#ff7a1a','#ff2e7e','#8b5cff','#2ee59d','#ffffff'];
  const P=Array.from({length:150},()=>({x:W/2+(Math.random()-.5)*80,y:H*.45,vx:(Math.random()-.5)*16,vy:-Math.random()*16-6,s:Math.random()*8+5,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[Math.random()*6|0],coin:Math.random()<.25}));
  const t0=performance.now();const fr=t=>{ctx.clearRect(0,0,W,H);P.forEach(p=>{p.vy+=.45;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;
    if(p.coin){ctx.beginPath();ctx.ellipse(0,0,p.s*.8,Math.max(.5,p.s*.8*Math.abs(Math.cos(p.r*2))),0,0,7);ctx.fillStyle='#ffc83d';ctx.fill()}else ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);ctx.restore()});
    if(t-t0<2600)requestAnimationFrame(fr);else{ctx.clearRect(0,0,W,H);c.hidden=true}};requestAnimationFrame(fr)}
function ringSVG(pct){const r=20,C=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="${r}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="5"/><circle cx="24" cy="24" r="${r}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C*pct/100).toFixed(2)} ${C.toFixed(2)}" transform="rotate(-90 24 24)" style="animation:dash 1.1s var(--ease) both"/></svg>`}
function miniRing(n,of,c1='#2ee59d',c2='#22d3ee'){const r=16,C=2*Math.PI*r,id='mr'+Math.random().toString(36).slice(2,7);return `<span class="mring"><svg viewBox="0 0 40 40"><defs><linearGradient id="${id}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><circle cx="20" cy="20" r="${r}" fill="none" stroke="var(--card2)" stroke-width="5"/><circle cx="20" cy="20" r="${r}" fill="none" stroke="url(#${id})" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(of?C*n/of:0).toFixed(1)} ${C.toFixed(1)}"/></svg><b>${n}/${of}</b></span>`}

/* ---------- рендер ---------- */
function render(){const [v,id]=view.split(':');let h;
  if(v==='fin')h=vFin();else if(v==='objs')h=vObjs();else if(v==='obj')h=vObj(id);else if(v==='people')h=vPeople();else if(v==='person')h=vPerson(id);else if(v==='ops')h=vOps();else h=vMore();
  if(window.City)City.detach();
  $('#main').innerHTML=h;const cur=view.split(':')[0];
  $$('.nav button[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===cur||(b.dataset.v==='objs'&&cur==='obj')||(b.dataset.v==='people'&&cur==='person')));
  $$('[data-vt]').forEach(el=>el.style.viewTransitionName=vtKey&&el.dataset.vt===vtKey?'hero':'');
  odos();counters();tilt();coverflow();segPills();
  const host=$('#cityHost');if(host&&window.City)City.mount(host);
  if(cur==='ops')opsResults();
  const ts=$('#tsc');if(ts&&tabMonth===today().slice(0,7)){const th=ts.querySelector('th.td');if(th)ts.scrollLeft=th.offsetLeft-ts.clientWidth/2}}
