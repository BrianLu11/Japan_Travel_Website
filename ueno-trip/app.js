/* Ueno Seven · all times Asia/Tokyo · 2026-10-25
   This is a static website: no login, no server, no shared database.
   Weather: Open-Meteo public forecast API (weather may change).
*/
'use strict';
const TRIP_DATE = '2026-10-25';
const TRIP_DATE_BASIC = '20261025';
const MEETING_MAP = 'JR Ueno Station Park Exit, Tokyo';
const MUSEUM_URL = 'https://www.tnm.jp/modules/r_free_page/index.php?id=2759';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=35.7157&longitude=139.7750&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&start_date=2026-10-25&end_date=2026-10-25';

const mapUrl = (text) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
const yen = (amount) => '¥' + Math.round(amount).toLocaleString('ja-JP');
const entries = {
  rain: {
    notice: '預設雨天方案：上午看免費室內建築與展覽；午後廣重特展不變；若午後仍在下雨，改去上野／御徒町的室內商場。',
    morning: [
      { id:'library',time:'10:50',end:'11:15',title:'國際兒童圖書館',desc:'走進由舊帝國圖書館改建的建築，看《色の引き算》免費展覽。雨天也值得專程造訪。',labels:['免費','室內','建築'],map:'國際子ども図書館 東京都台東区上野公園12-49',url:'https://www.kodomo.go.jp/event/exhibition/now',urlLabel:'展覽資訊' },
      { id:'geidai',time:'11:25',end:'11:40',title:'藝大アートプラザ',desc:'東京藝術大學的畫廊與藝術選物空間，近期有《藝大NIPPON》企畫展；適合短時間欣賞小件藝術與工藝。',labels:['免費','室內','設計'],map:'藝大アートプラザ 台東区上野公園12-8',url:'https://artplaza.geidai.ac.jp/',urlLabel:'官方網站' }
    ],
    afternoon: { id:'parco',time:'16:10',end:'17:25',title:'PARCO_ya 上野 / 御徒町',desc:'雨勢大就進室內百貨，逛雜貨、咖啡與生活選物；不勉強前往露天的谷中老街。',labels:['室內','雨天穩定'],map:'PARCO_ya 上野 台東区上野3-24-6',url:'https://parcoya-ueno.parco.jp/',urlLabel:'百貨資訊' },
  },
  mixed: {
    notice: '小雨混合方案：上午去大麗花庭園短暫拍照，雨來便改藝大；午後廣重固定，結束後改走有屋頂的 2k540 工藝街。',
    morning: [
      { id:'dahlia',time:'10:50',end:'11:15',title:'上野東照宮 · 大麗花庭園',desc:'日式庭園中約 120 品種的大麗花，適合雨停間隙拍照。若開始持續下雨，直接切回室內方案。',labels:['戶外','¥800','視雨勢'],map:'上野東照宮ぼたん苑 台東区上野公園9-88',url:'https://www.uenotoshogu.com/',urlLabel:'官方網站' },
      { id:'geidai',time:'11:25',end:'11:40',title:'藝大アートプラザ',desc:'免費欣賞藝術作品與工藝；可避開中午前可能出現的短暫陣雨。',labels:['免費','室內'],map:'藝大アートプラザ 台東区上野公園12-8',url:'https://artplaza.geidai.ac.jp/',urlLabel:'官方網站' }
    ],
    afternoon: { id:'craft',time:'16:20',end:'17:25',title:'2k540 AKI-OKA ARTISAN',desc:'鐵道高架下的設計小店與工藝空間，有皮革、飾品、陶器等。通道有遮蔽但不是全室內，大雨改去 PARCO_ya。',labels:['工藝','有遮蔽','非全室內'],map:'2k540 AKI-OKA ARTISAN 台東区上野5-9',url:'https://www.jrtk.jp/2k540/',urlLabel:'商店街資訊' },
  },
  sun: {
    notice: '晴天方案：先看上野東照宮的大麗花，再到公園看街頭藝術；午後廣重固定，天氣好才延伸至谷中老街。',
    morning: [
      { id:'dahlia',time:'10:50',end:'11:15',title:'上野東照宮 · 大麗花庭園',desc:'秋季大麗花展，和傘、傳統庭園與花卉很適合一起拍照。官方成人入苑 ¥800。',labels:['戶外','¥800','拍照'],map:'上野東照宮ぼたん苑 台東区上野公園9-88',url:'https://www.uenotoshogu.com/',urlLabel:'官方網站' },
      { id:'artist',time:'11:25',end:'11:40',title:'Heaven Artist TOKYO 2026',desc:'上野公園街頭表演活動，週日 11:00–16:30。表演會因天氣調整，當場挑喜歡的停留即可。',labels:['免費','戶外','10/25限定'],map:'上野恩賜公園 台東区上野公園',url:'https://www.artscouncil-tokyo.jp/news/29239/',urlLabel:'活動公告' }
    ],
    afternoon: { id:'yanaka',time:'16:20',end:'17:25',title:'谷中銀座 · 夕やけだんだん',desc:'雨停、精神還好再去老街：和菓子、雜貨、貓咪小物及黃昏街景。從博物館步行約 20–30 分鐘，返程可由日暮里搭 JR。',labels:['老街','戶外','可取消'],map:'谷中銀座商店街 台東区谷中3丁目',url:'https://www.gotokyo.org/jp/destinations/northern-tokyo/yanaka-and-nezu/index.html',urlLabel:'區域介紹' },
  }
};
const commonLunch = { id:'lunch',time:'12:00',end:'13:15',title:'七人午餐 · 優先預約音音',desc:'上野バンブーガーデン店，靠近車站。七人先詢問是否能同桌；若額滿，備選「過門香」的八人圓桌套餐。兩家都尚未確認訂位。',labels:['共同固定','7人','必須確認座位'],map:'音音 上野バンブーガーデン店',url:'https://xn--mckuczay8ld4db0508duvvileoaa.com/space/',urlLabel:'座位資訊',fixed:true };
const commonMuseum = { id:'museum',time:'13:45',end:'15:45',title:'東京國立博物館 · 歌川廣重特展',desc:'《歌川広重 江戸のベストアングル》第一期最後一天！本館 A 室；17:00 閉館、16:30 最後入館。東大 Campus Members 符合資格學生憑證免費。',labels:['共同固定','本日必去','一期最終日'],map:'東京国立博物館 台東区上野公園13-9',url:MUSEUM_URL,urlLabel:'特展官方資訊',fixed:true };
const commonDinner = { id:'dinner',time:'18:00',end:'19:30',title:'七人晚餐 · 回上野集合',desc:'預留相聚聊天的時間。餐廳仍待敲定，可考慮上野站附近的 OTTIMO Seafood Garden；訂位前別視為確定地點。',labels:['共同固定','餐廳待訂'],map:'上野駅 台東区',url:mapUrl('OTTIMO Seafood Garden Ueno'),urlLabel:'晚餐候選',fixed:true };
const checklistItems = [
  '確認七人午餐訂位（或相鄰 4＋3 座位）',
  '確認七人晚餐地點與座位',
  '帶學生證／適用的入館證件',
  '摺疊傘、防滑好走的鞋子',
  '手機充電及交通 IC 卡',
  '在群組確認 10:30 上野站公園口集合'
];
const params = new URLSearchParams(window.location.search);
const MODES = ['rain','mixed','sun'];
const safeStorage = {
  get(key){try{return localStorage.getItem(key);}catch{return null;}},
  set(key,value){try{localStorage.setItem(key,value);}catch{}},
  remove(key){try{localStorage.removeItem(key);}catch{}}
};
let currentMode = MODES.includes(params.get('mode')) ? params.get('mode') : (MODES.includes(safeStorage.get('ueno_mode')) ? safeStorage.get('ueno_mode') : 'rain');
let lunchChoice = safeStorage.get('ueno_lunch')==='course' ? 'course' : 'casual';
let studentCount = Math.max(0,Math.min(7,Number.parseInt(safeStorage.get('ueno_students') || '0',10) || 0));
const $ = (sel) => document.querySelector(sel);
const commonMeeting = {id:'meeting',time:'10:30',end:'10:40',title:'集合 · 上野站公園口',desc:'JR 上野站公園口集合；建議 10:20 抵達。七人到齊後一起出發。',labels:['共同固定','七人集合'],map:MEETING_MAP,url:mapUrl(MEETING_MAP),urlLabel:'集合地點',fixed:true};
const route = () => [
  commonMeeting,
  ...entries[currentMode].morning,
  commonLunch,
  commonMuseum,
  entries[currentMode].afternoon,
  commonDinner
];

function renderItinerary(){
  const items = route();
  $('#timeline').innerHTML = items.map((item,index)=>{
    const tags = (item.labels||[]).map(s=>`<span class="timeline-tag ${item.fixed?'fixed-tag':''}">${s}</span>`).join('');
    return `<article class="timeline-item ${item.fixed?'fixed':''}">
      <span class="timeline-dot" aria-hidden="true"></span>
      <div class="timeline-time">${item.time} — ${item.end}</div>
      <div class="timeline-content"><div class="timeline-split"><div><div class="timeline-badges">${tags}</div><h3>${item.title}</h3></div><span class="timeline-number" aria-hidden="true">0${index+1}</span></div>
      <p>${item.desc}</p><div class="timeline-links"><a href="${mapUrl(item.map)}" target="_blank" rel="noopener noreferrer">地圖導航 ↗</a><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.urlLabel} ↗</a></div></div>
    </article>`;
  }).join('');
  $('#modeNotice').textContent = entries[currentMode].notice;
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===currentMode)));
  const mapStops = [MEETING_MAP,entries[currentMode].morning[0].map,commonLunch.map,commonMuseum.map,entries[currentMode].afternoon.map];
  const routeUrl = 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(mapStops[0])+'&destination='+encodeURIComponent(mapStops.at(-1))+'&waypoints='+encodeURIComponent(mapStops.slice(1,-1).join('|'))+'&travelmode=walking';
  $('#routeLink').href = routeUrl;
  $('#sharePlan').setAttribute('aria-label',`分享${currentMode==='rain'?'雨天':currentMode==='mixed'?'小雨':'晴天'}行程`);
  updateBudget();
}
function selectMode(mode){
  if(!MODES.includes(mode)) return;
  currentMode=mode;safeStorage.set('ueno_mode',mode);
  if(window.location.protocol.startsWith('http')){
    const u=new URL(window.location.href);u.searchParams.set('mode',mode);window.history.replaceState({},'',u);
  }
  renderItinerary();
}
function updateBudget(){
  const lunch = lunchChoice==='course' ? 4500 : 1900;
  const gallery = currentMode==='rain' ? 0 : 800;
  const individualBase = lunch+650+3300+250+gallery;
  const groupTotal=individualBase*7+(7-studentCount)*1500;
  $('#totalBudget').textContent=yen(groupTotal);
  $('#perBudget').textContent=yen(groupTotal/7);
  $('#studentOut').textContent=studentCount;
  $('#studentCount').value=String(studentCount);
  document.querySelectorAll('[data-lunch]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lunch===lunchChoice)));
}
function buildChecklist(){
  let stored=[];try{const data=JSON.parse(safeStorage.get('ueno_checks')||'[]');if(Array.isArray(data))stored=data;}catch{}
  $('#checklist').innerHTML=checklistItems.map((item,i)=>`<label class="check-item"><input type="checkbox" data-check="${i}" ${stored.includes(i)?'checked':''}><span>${item}</span></label>`).join('');
  $('#checklist').addEventListener('change',e=>{
    if(!e.target.matches('input[type="checkbox"]'))return;
    const checked=Array.from(document.querySelectorAll('[data-check]:checked')).map(el=>Number(el.dataset.check));
    safeStorage.set('ueno_checks',JSON.stringify(checked));
  });
}
function say(message){
  const toast=$('#toast');toast.textContent=message;toast.classList.add('show');
  if(say.timer)clearTimeout(say.timer);
  say.timer=setTimeout(()=>toast.classList.remove('show'),3200);
}
async function sharePlan(){
  const u = new URL(window.location.href);
  u.searchParams.set('mode',currentMode);
  u.hash='';
  if(u.protocol==='file:'){
    $('#copyMessage').textContent='本機檔案無法讓朋友直接存取。請先部署至 GitHub Pages，再使用分享功能。';
    say('請先部署 GitHub Pages');return;
  }
  const message=`上野七人旅｜10/25 10:30 上野站公園口集合｜${currentMode==='rain'?'雨天':currentMode==='mixed'?'小雨':'晴天'}方案`;
  if(navigator.share){try{await navigator.share({title:'上野七人旅 2026/10/25',text:message,url:u.href});return;}catch(e){if(e && e.name==='AbortError')return;}}
  try{await navigator.clipboard.writeText(u.href);say('已複製行程網址');$('#copyMessage').textContent='網址已複製，可以貼到 LINE／Discord／群組。';}
  catch{
    $('#copyMessage').textContent='複製此連結：'+u.href;
    try{const temp=document.createElement('textarea');temp.value=u.href;document.body.append(temp);temp.select();document.execCommand('copy');temp.remove();say('已嘗試複製網址');}catch{say('請手動複製連結');}
  }
}
function escapeICS(s){return String(s).replaceAll('\\','\\\\').replaceAll(';','\\;').replaceAll(',','\\,').replaceAll('\n','\\n');}
function createICS(){
  const now=new Date();const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const items=route();
  const events=items.map(item=>{
    const dt=(v)=>`${TRIP_DATE_BASIC}T${v.replace(':','')}00`;
    return ['BEGIN:VEVENT',`UID:ueno-${item.id}-${TRIP_DATE_BASIC}@trip.local`,`DTSTAMP:${stamp}`,`DTSTART;TZID=Asia/Tokyo:${dt(item.time)}`,`DTEND;TZID=Asia/Tokyo:${dt(item.end)}`,`SUMMARY:${escapeICS(item.title)}`,`DESCRIPTION:${escapeICS(item.desc+'\n此行程尚未代表訂位確認')}`,`LOCATION:${escapeICS(item.map)}`,'END:VEVENT'].join('\r\n');
  }).join('\r\n');
  const contents=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ueno Seven//Trip Planner 2026//ZH','CALSCALE:GREGORIAN','X-WR-CALNAME:上野七人旅',events,'END:VCALENDAR'].join('\r\n');
  const blob=new Blob([contents],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`ueno-seven-2026-10-25-${currentMode}.ics`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);say('行事曆檔已下載');
}
function tokyoToday(){
  return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
}
async function loadWeather(){
  const dateNow=tokyoToday();
  $('#weatherChecked').textContent='上野周邊 · Open-Meteo';
  if(dateNow>TRIP_DATE){
    $('#weatherTemp').textContent='—';$('#weatherLabel').textContent='活動日期已過';
    $('#weatherForecast').textContent='這份旅遊頁面仍可回顧，預報不再更新。';return;
  }
  $('#weatherLabel').textContent='正在取得預報…';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000);
  try{
    const r=await fetch(WEATHER_URL,{signal:controller.signal,cache:'no-store'});
    if(!r.ok)throw new Error('Weather HTTP '+r.status);
    const json=await r.json();
    const dateIndex=(json.daily?.time||[]).indexOf(TRIP_DATE);
    if(dateIndex<0)throw new Error('日期尚未在預報範圍');
    const max=json.daily.temperature_2m_max[dateIndex],min=json.daily.temperature_2m_min[dateIndex],chance=json.daily.precipitation_probability_max[dateIndex];
    const byHour={};(json.hourly.time||[]).forEach((time,i)=>{if(time.startsWith(TRIP_DATE))byHour[Number(time.substring(11,13))]=json.hourly.precipitation_probability[i]});
    const at10=byHour[10],at12=byHour[12],at16=byHour[16];
    $('#weatherTemp').textContent=(Math.round(min))+'–'+(Math.round(max))+'°';
    $('#weatherLabel').textContent=`全天降雨機率最高 ${chance}%`;
    $('#weatherForecast').textContent=`10時 ${at10 ?? '--'}%　·　12時 ${at12 ?? '--'}%　·　16時 ${at16 ?? '--'}%｜預報可能改變`;
    $('#weatherChecked').textContent='Open-Meteo · 更新於 '+new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())+' JST';
    if(Number(chance)>=65){$('#weatherBox .weather-symbol').textContent='☂';}
    else if(Number(chance)>=30){$('#weatherBox .weather-symbol').textContent='☁';}
    else{$('#weatherBox .weather-symbol').textContent='☀';}
    say(chance>=65?'天氣預報降雨偏高，可考慮雨天方案':'天氣已更新，可依現場雨勢選擇路線');
  }catch(err){
    $('#weatherTemp').textContent='—';$('#weatherLabel').textContent='無法連線取得預報';
    $('#weatherForecast').textContent='可照下方雨天備案走；出門前再開啟手機天氣 App 確認。';
    $('#weatherChecked').textContent='Open-Meteo · 連線未成功';
  }finally{clearTimeout(timeout);}
}
function init(){
  document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>selectMode(btn.dataset.mode)));
  document.querySelectorAll('[data-lunch]').forEach(btn=>btn.addEventListener('click',()=>{lunchChoice=btn.dataset.lunch;safeStorage.set('ueno_lunch',lunchChoice);updateBudget();}));
  $('#studentCount').addEventListener('input',e=>{studentCount=Number(e.target.value);safeStorage.set('ueno_students',String(studentCount));updateBudget();});
  $('#shareTop').addEventListener('click',sharePlan);
  $('#sharePlan').addEventListener('click',sharePlan);
  $('#downloadCalendar').addEventListener('click',createICS);
  $('#resetChecklist').addEventListener('click',()=>{safeStorage.remove('ueno_checks');document.querySelectorAll('[data-check]').forEach(x=>x.checked=false);say('已清除本機勾選');});
  $('#reloadWeather').addEventListener('click',loadWeather);
  buildChecklist();renderItinerary();loadWeather();
}
init();
