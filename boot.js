/* ===== Касса бригадира · запуск ===== */
(async()=>{City.init();await DB.open();let d=DB.db?await DB.get('state'):null;if(!d){try{d=JSON.parse(localStorage.getItem('brigada')||'null')}catch(e){}}
  S=d?migrate(d):demo();if(!d)save();render();snapshot();
  if(!S.settings.tour)Tour.welcome();
  try{navigator.storage?.persist?.()}catch(e){}
  if('serviceWorker' in navigator&&!inFrame&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
  setInterval(()=>{const ph=$('#smartPh');if(!ph||document.hidden||reduced())return;exI++;ph.style.transition='opacity .3s';ph.style.opacity=0;setTimeout(()=>{ph.innerHTML=`Напишите или скажите: <b>«${esc(smartExample())}»</b>`;ph.style.opacity=1},300)},3800);
})();
