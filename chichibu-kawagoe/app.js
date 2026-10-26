/* Chichibu · Nagatoro · Yokoze / 2026-10-30 to 2026-11-01. No build dependencies. */
'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const yen = n => '¥' + Math.round(n).toLocaleString('ja-JP');
const mapUrl = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const directionsUrl = points => 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(points[0]) + '&destination=' + encodeURIComponent(points.at(-1)) + (points.length > 2 ? '&waypoints=' + encodeURIComponent(points.slice(1, -1).join('|')) : '') + '&travelmode=walking';
const store = {
  get(k) { try { return localStorage.getItem('chichibu_20261030_' + k); } catch { return null; } },
  set(k,v) { try { localStorage.setItem('chichibu_20261030_' + k,v); } catch {} },
  remove(k) { try { localStorage.removeItem('chichibu_20261030_' + k); } catch {} }
};
// 陣列欄位：開始、結束、標題、敘述、標籤、Google Maps 搜尋、外部官方連結、外部連結標題
const days = {
  1: {
    date:'2026-10-30', dateJP:'10/30（五）', name:'前往秩父', subtitle:'東京出發、橫瀨入住', start:'17:00', meet:'東京駅',
    notice:'Day 1｜17:00 左右從東京出發；如果 17:00 才到東京站，須先前往池袋轉西武特急。建議提前告知武甲ステイ晚間抵達時間，確認最晚入住與鑰匙領取方式。',
    highlight:['10 / 30','先把入住安排好','民宿在橫瀨町，而不是西武秩父車站正旁邊。Laview 的「ちちぶ號」會停靠横瀬；請依房東指示決定從横瀬步行或搭計程車。','民泊 武甲ステイ 横瀬'],
    timeline:[
      ['17:00','17:30','東京 → 池袋（集合／轉乘）','17:00 是從東京都心出發的目標，非已購票班次。東京站到池袋可搭 JR 山手線或丸之內線，請預留轉乘。','集合','池袋駅','https://www.seiburailway.jp/','西武鐵道'],
      ['17:30','19:20','池袋 → 横瀬（Laview 建議）','乘西武池袋線特急「ちちぶ號」往西武秩父方向，在横瀬站下車；全程約 80–100 分鐘，班次和空位請向西武查證。','交通','横瀬駅','https://www.seiburailway.jp/railway/reservedtrain/timetable/','特急時刻表'],
      ['19:20','20:00','前往民宿、完成 Check-in','武甲ステイ：埼玉県秩父郡横瀬町横瀬2022-5。橫瀨站附近道路可能較暗；依行李與天氣選步行／計程車。','已訂住宿','民泊 武甲ステイ 2022-5 横瀬','https://www.booking.com/hotel/jp/wu-jia-sutei.zh-tw.html','Booking 住宿資訊'],
      ['20:00','21:00','晚餐／採買隔天早餐','以橫瀨周邊仍有營業的餐廳或便利商店為主。未確認具體店家是否營業，不建議預設深夜可買到熱食。','彈性','横瀬駅 周辺 コンビニ','https://www.yokoze.org/','橫瀨觀光'],
      ['21:00','22:00','民宿休息、核對隔日列車','隔天早上去長瀞，需要先到御花畑／秩父站搭秩父鐵道，確認各段轉乘與長瀞遊船公告。','住宿','民泊 武甲ステイ 横瀬','','']
    ],
    transit:[
      ['17:00 左右','東京都心 → 池袋','先到西武池袋站集合，再搭往横瀬／西武秩父的特急ちちぶ號。','17:00 是目標出發時間；特急車次尚未預訂。','https://www.seiburailway.jp/railway/reservedtrain/timetable/'],
      ['傍晚～晚上','池袋 → 横瀬','Laview 需要基本乘車券＋特急指定席券。確認列車為「ちちぶ號」，不是飯能終點「むさし號」。','池袋到横瀬的特急券官方票價 ¥900（另加普通車資；可能改定）。','https://www.seiburailway.jp/railway/reservedtrain/laview/'],
      ['約 19:00–20:00','横瀬駅 → 武甲ステイ','到達横瀬駅後往橫瀨 2022-5；住宿步行距離請依 Google Maps 現場導航查核。','與房東確認晚間入住房門密碼／鑰匙，避免無法入內。','https://www.booking.com/hotel/jp/wu-jia-sutei.zh-tw.html']
    ], route:['池袋駅','横瀬駅','民泊 武甲ステイ 横瀬']
  },
  2: {
    date:'2026-10-31', dateJP:'10/31（六）', name:'長瀞', subtitle:'遊船、岩疊、寶登山', start:'08:00', meet:'民泊 武甲ステイ 横瀬',
    notice:'Day 2｜先搭車到秩父鐵道的御花畑站，再往長瀞。把遊船排在上午，遇停航就改走岩疊與自然博物館；10/31 尚未開始長瀞紅葉祭夜間燈飾。',
    highlight:['10 / 31','長瀞溪谷與岩疊','傳統和舟沿荒川航行約 20 分鐘，旺季約 ¥2,200／人；受增水或渇水影響可能停航。先確認營運，再安排上午順序。','長瀞岩畳'],
    timeline:[
      ['08:00','09:30','民宿 → 長瀞站','從横瀬／西武秩父移動到御花畑站，換秩父鐵道往長瀞。含步行、等車約抓 1–1.5 小時；非查證過的直達列車。','交通','長瀞駅','https://www.chichibu-railway.co.jp/','秩父鐵道'],
      ['09:30','10:45','長瀞ラインくだり','到長瀞站旁的售票處確認是否開航。A／B 路線每段約 3 km、約 20 分，連接與等候時間另計。','天候依存','長瀞ラインくだり','https://www.chichibu-railway.co.jp/nagatoro/boat.html','遊船官方'],
      ['10:45','11:45','長瀞岩疊與荒川溪谷','欣賞片理狀岩層、河流和對岸赤壁，石面濕滑時避免靠近岸緣。紅葉開始染色，但不保證已全紅。','戶外','長瀞岩畳','https://www.nagatoro.gr.jp/kouyo2026/','紅葉祭公告'],
      ['11:45','12:50','長瀞午餐','站前蕎麥麵、味噌豬肉丼或定食；秋季週末餐廳可能排隊。','餐飲','長瀞駅 ランチ','https://www.nagatoro.gr.jp/','長瀞觀光'],
      ['13:00','13:45','寶登山神社','長瀞站出發步行約 10–15 分鐘參拜，欣賞木雕建築；再往寶登山纜車山麓站。','神社','宝登山神社','https://www.hodosan-jinja.or.jp/','神社官方'],
      ['14:00','15:40','寶登山纜車與山頂散步','纜車往返大人 ¥1,200；山頂觀景、奧宮、SUSABINO 露台。山麓站距長瀞站約 20 分鐘步行，建議預留移動時間。','纜車','宝登山ロープウェイ 山麓駅','https://www.hodosan-ropeway.co.jp/information','纜車官方'],
      ['15:40','17:20','長瀞 → 橫瀨民宿','搭秩父鐵道回御花畑，轉乘西武線或計程車返回橫瀨。實際返程請提前查時刻。','交通','横瀬駅','https://www.chichibu-railway.co.jp/','秩父鐵道'],
      ['17:30','20:30','秩父晚餐或民宿聚餐','可以在西武秩父站周邊吃豚みそ丼、わらじカツ丼，或買食物回民宿。週六營業時間先核對。','彈性','西武秩父駅 レストラン','https://www.seibu-leisure.co.jp/matsuri/','祭之湯商場']
    ],
    transit:[
      ['08:00–09:30','横瀬／西武秩父 → 御花畑 → 長瀞','御花畑屬秩父鐵道，與西武秩父站不同站，兩站可步行轉乘；往長瀞為秩父鐵道列車。','轉乘票價、實際時刻請查秩父鐵道官網。','https://www.chichibu-railway.co.jp/'],
      ['9:00–16:00','長瀞ラインくだり','長瀞站旁買票，售罄或水位異常會調整；正常價 ¥2,000、繁忙期 ¥2,200／成人。','10/26 曾因天候停航；務必看出發當天公告。','https://www.chichibu-railway.co.jp/nagatoro/boat.html'],
      ['14:00–16:00','寶登山纜車','土日通常有每 15 分鐘左右的發車安排，搭車前先核實當天時刻；成人往返 ¥1,200。','若排隊過久，可只參拜寶登山神社並延長岩疊散步。','https://www.hodosan-ropeway.co.jp/information/']
    ], route:['長瀞駅','長瀞ラインくだり','長瀞岩畳','宝登山神社','宝登山ロープウェイ 山麓駅']
  },
  3: {
    date:'2026-11-01', dateJP:'11/01（日）', name:'秩父・返東京', subtitle:'銀杏、秩父神社、午后回程', start:'08:00', meet:'民泊 武甲ステイ 横瀬',
    notice:'Day 3｜10:00 前退房。Muse Park「ぐるりん號」土休日班次少：官方表列西武秩父站 09:30 → ミューズパーク中央 09:51；回程中央 12:41 → 秩父駅 13:07／西武秩父駅 13:17（皆須臨行確認）。',
    highlight:['11 / 01','Muse Park 金黃銀杏','10/23 官方公告約 3 km 的銀杏大道已開始見頃。週日提早搭公車上山、拍照與散步，保留足夠時間回市區搭特急。','秩父ミューズパーク イチョウ並木'],
    timeline:[
      ['08:00','09:10','早餐、退房與行李寄放','最晚 10:00 前退出武甲ステイ。前往西武秩父站，先找置物櫃或可收件的寄存服務；容量與空位不保證。','住宿','西武秩父駅','https://www.seiburailway.jp/','西武鐵道'],
      ['09:30','09:51','ぐるりん號 → Muse Park','依官方 2025/4/1 版土休日班表：西武秩父駅 09:30 發、ミューズパーク中央 09:51 到。提前候車。','班次參考','秩父ミューズパーク中央 バス停','https://www.muse-park.com/access','官方巴士時刻'],
      ['10:00','12:25','Muse Park 銀杏大道','在中央廣場／パルテノン周邊賞黃葉、沿 Sky Road 散步；不建議走完整條 3 km 後再遠離回程公車站。','賞銀杏','秩父ミューズパーク イチョウ並木','https://www.muse-park.com/flower','最新色況'],
      ['12:41','13:07','ぐるりん號 → 秩父站','依官方土休日班表：ミューズパーク中央 12:41 出發、秩父站 13:07 到（西武秩父站 13:17）；若錯過將影響後段安排。','重要班次','秩父駅','https://www.muse-park.com/access','官方巴士時刻'],
      ['13:10','13:45','秩父神社與番場通','秩父鐵道秩父站附近步行參拜。若當天體力或公車時間不允許，可略過直接午餐。','神社','秩父神社','https://www.chichibu-jinja.or.jp/','秩父神社'],
      ['13:45','14:40','秩父午餐、取回行李','推薦豚みそ丼、わらじカツ丼或蕎麥麵；提早回西武秩父站取行李，預留特急上車緩衝。','餐飲','西武秩父駅','https://www.seibu-leisure.co.jp/matsuri/','祭之湯'],
      ['15:00','16:45','西武秩父 → 池袋 → 東京','約 15:00 左右搭 Laview 回池袋、再轉 JR／地下鐵進東京都心。這是預計回程時間，不是已購班次。','返東京','池袋駅','https://www.seiburailway.jp/railway/reservedtrain/timetable/','西武特急時刻']
    ],
    transit:[
      ['09:30 → 09:51','西武秩父駅 → ミューズパーク中央','循環巴士「ぐるりん號」土休日，走音楽寺先回り（左回り）。','官方表為 2025/4/1 改正版本；11/1 班次可能改定，請最後核對。','https://www.muse-park.com/access'],
      ['12:41 → 13:07','ミューズパーク中央 → 秩父駅','同一左回り路線，於秩父駅下車拜訪秩父神社；若要直接取行李，可坐到西武秩父駅 13:17。','Miss 這班車的備案：提早叫計程車，或取消秩父神社。','https://www.muse-park.com/access'],
      ['約 15:00','西武秩父 → 池袋','Laview 特急指定席，約 80–90 分鐘，再依個人目的地轉乘。','盡可能提前買 4 個相鄰座位；不能假設一定有空位。','https://www.seiburailway.jp/railway/reservedtrain/timetable/']
    ], route:['西武秩父駅','秩父ミューズパーク 中央','秩父神社','西武秩父駅']
  }
};
const candidates = {
  food:[
    {id:'buta',days:[2,3],name:'豚みそ丼本舗 野さか',tag:'秩父 · 豚味噌丼',price:'約 ¥1,500–2,500／人',desc:'秩父代表性料理；需現場確認營業日、最後點餐與是否售完。',map:'豚みそ丼本舗 野さか',url:'https://www.chichibu-omotenashi.com/'},
    {id:'waraji',days:[2,3],name:'わらじカツ丼（市區店家）',tag:'秩父 · 炸豬排丼',price:'約 ¥1,200–2,200／人',desc:'可選靠近西武秩父站的店家，避免為名店多花大量排隊時間；目前未指定商家。',map:'西武秩父駅 わらじカツ丼',url:'https://www.chichibu-omotenashi.com/'},
    {id:'soba',days:[2],name:'長瀞站前蕎麥麵',tag:'長瀞 · 午餐',price:'約 ¥1,200–2,200／人',desc:'從岩疊回到站前用餐，吃完沿參道去寶登山神社；餐廳視當天候位選擇。',map:'長瀞駅 そば ランチ',url:'https://www.nagatoro.gr.jp/'},
    {id:'onigiri',days:[2],name:'SUSABINO 山頂輕食',tag:'寶登山 · 山頂簡餐',price:'約 ¥600–1,500／人',desc:'若午餐不太餓，寶登山山頂觀景露台有輕食可能；以現場開放為準。',map:'SUSABINO 宝登山',url:'https://www.hodosan-ropeway.co.jp/'},
    {id:'matsuri',days:[1,2,3],name:'西武秩父站・祭之湯商場',tag:'車站 · 餐飲商店',price:'約 ¥1,000–2,500／人',desc:'適合作為週日回東京前的午餐與伴手禮備案；週五較晚抵達時需先確認營業時間。',map:'西武秩父駅前温泉 祭の湯',url:'https://www.seibu-leisure.co.jp/matsuri/'}
  ],
  activity:[
    {id:'boat',days:[2],name:'長瀞ラインくだり',tag:'長瀞 · 優先活動',price:'普通期 ¥2,000／旺季 ¥2,200',desc:'須視水位與當天天氣，非已預訂；停航時改走岩疊河岸。',map:'長瀞ラインくだり',url:'https://www.chichibu-railway.co.jp/nagatoro/boat.html'},
    {id:'rope',days:[2],name:'寶登山纜車',tag:'長瀞 · 觀景活動',price:'成人往返 ¥1,200',desc:'通常適合午後從寶登山神社步行前往；山麓有一段上坡。',map:'宝登山ロープウェイ 山麓駅',url:'https://www.hodosan-ropeway.co.jp/information/'},
    {id:'museum',days:[2],name:'埼玉縣立自然博物館',tag:'長瀞 · 雨天備案',price:'依當期票價',desc:'如遊船因雨停航，可利用上長瀞附近博物館取代戶外行程，先確認營業。',map:'埼玉県立自然の博物館',url:'https://shizen.spec.ed.jp/'},
    {id:'muse',days:[3],name:'Muse Park 銀杏大道',tag:'秩父 · 週日主行程',price:'園區入場免費',desc:'10/23 已發布銀杏見頃；往返公車班次少，應先看回程時刻再開始散步。',map:'秩父ミューズパーク イチョウ並木',url:'https://www.muse-park.com/flower'},
    {id:'shrine',days:[3],name:'秩父神社',tag:'秩父 · 週日加碼',price:'參拜免費',desc:'從秩父鐵道秩父站步行約 3 分鐘；若公車延誤就略過。',map:'秩父神社',url:'https://www.chichibu-jinja.or.jp/'}
  ]
};
const checklist = [
  '核對實際已訂住宿日期：週五 10/30 入住、週日 11/1 退房是否正確（原搜尋網址是 10/31–11/3）',
  '訊息問武甲ステイ房東：週五約 19–20 時晚到能否入住、如何領鑰匙',
  '確認 4 人／3 間房／2 晚 ¥40,300 的訂單內容與付款狀態',
  '購買或查詢 10/30 去程、11/1 回程 Laview 四人座位',
  '確認橫瀨站到民宿實際步行路線及夜間交通',
  '核對 10/31 御花畑 → 長瀞的秩父鐵道發車時刻',
  '10/31 上午確認長瀞遊船運行、水位與票價',
  '確認 11/1 Muse Park 土休日公車 09:30 去、12:41 回班次',
  '週日 10:00 前退房，先找西武秩父站大型行李寄存位置',
  '查看秋季天氣、攜帶雨具、保暖外套、充電器與好走的鞋'
];
const parsedDay = Number(new URLSearchParams(location.search).get('day'));
let currentDay = days[parsedDay] ? parsedDay : Number(store.get('day')) || 1;
if (!days[currentDay]) currentDay = 1;
let chosen = new Set();
try { const val = JSON.parse(store.get('chosen') || '[]'); if (Array.isArray(val)) chosen = new Set(val); } catch {}

const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
function toast(message) { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2700); }
function renderTimeline(d) {
  $('#timeline').innerHTML = d.timeline.map((a,i)=>`<article class="timeline-entry ${a[4]==='彈性'?'flexible':''}">
    <div class="timeline-time"><strong>${escapeHtml(a[0])}</strong><span>${escapeHtml(a[1])}</span></div>
    <div class="timeline-dot"></div>
    <div class="timeline-content"><div class="entry-top"><h3>${escapeHtml(a[2])}</h3><span class="entry-tag">${escapeHtml(a[4])}</span></div><p>${escapeHtml(a[3])}</p><div class="entry-links"><a href="${mapUrl(a[5])}" target="_blank" rel="noopener noreferrer">Google 地圖 ↗</a>${a[6]?`<a href="${escapeHtml(a[6])}" target="_blank" rel="noopener noreferrer">${escapeHtml(a[7])} ↗</a>`:''}</div></div></article>`).join('');
}
function renderTransit(d) {
  $('#transportCards').innerHTML=d.transit.map(a=>`<article class="transit-card"><span class="transit-time">${escapeHtml(a[0])}</span><h3>${escapeHtml(a[1])}</h3><p>${escapeHtml(a[2])}</p><p class="transit-note">${escapeHtml(a[3])}</p><a href="${escapeHtml(a[4])}" target="_blank" rel="noopener noreferrer">查官方資訊 ↗</a></article>`).join('');
}
function renderChoices(d){
  for (const category of ['food','activity']) {
    const list=candidates[category].filter(v=>v.days.includes(currentDay));
    $('#'+category+'Count').textContent=`${list.length} 個`;
    $('#'+category+'Choices').innerHTML=list.length?list.map(a=>`<article class="choice-card ${chosen.has(a.id)?'is-chosen':''}">
      <div class="choice-detail"><small>${escapeHtml(a.tag)}</small><h3>${escapeHtml(a.name)}</h3><b class="choice-price">${escapeHtml(a.price)}</b><p>${escapeHtml(a.desc)}</p><div class="choice-actions"><a href="${mapUrl(a.map)}" target="_blank" rel="noopener noreferrer">地圖 ↗</a><a href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">資訊 ↗</a></div></div>
      <button class="pick-button" type="button" data-pick="${escapeHtml(a.id)}" aria-pressed="${chosen.has(a.id)}" aria-label="${chosen.has(a.id)?'取消收藏':'收藏'} ${escapeHtml(a.name)}">${chosen.has(a.id)?'✓ 已收藏':'+ 收藏'}</button>
    </article>`).join(''):'<p class="empty-choice">週五以交通、入住與休息為主，沒有另外塞付費活動。</p>';
  }
  $$('[data-pick]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.pick;if(chosen.has(id))chosen.delete(id);else chosen.add(id);store.set('chosen',JSON.stringify([...chosen]));renderChoices(days[currentDay]);toast(chosen.has(id)?'已收藏':'已取消收藏');}));
}
function render(){
  const d=days[currentDay];
  $$('[data-day]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.day)===currentDay)));
  $('#overviewTitle').textContent='Day '+currentDay+' · '+d.name;
  $('#overviewDate').textContent=d.dateJP+' · '+d.subtitle;
  $('#overviewClock').innerHTML=d.start.slice(0,2)+'<span>'+d.start.slice(2)+'</span>';
  $('#meetMap').href=mapUrl(d.meet);
  $('#modeNotice').textContent=d.notice;
  $('#highlightDate').textContent=d.highlight[0];
  $('#highlightTitle').textContent=d.highlight[1];
  $('#highlightDesc').textContent=d.highlight[2];
  $('#highlightLink').href=mapUrl(d.highlight[3]);
  $('#routeLink').href=currentDay===2?directionsUrl(d.route):currentDay===1?'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent('池袋駅')+'&destination='+encodeURIComponent('横瀬駅')+'&travelmode=transit':'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent('西武秩父駅')+'&destination='+encodeURIComponent('秩父ミューズパーク中央')+'&travelmode=transit';
  renderTimeline(d);renderTransit(d);renderChoices(d);showWeather();
}
function updateDay(day){if(!days[day])return;currentDay=day;store.set('day',String(day));if(location.protocol.startsWith('http')){const u=new URL(location.href);u.searchParams.set('day',String(day));history.replaceState(null,'',u);}render();}
function budget(){
  let variable=0;
  for(const id of ['transportCost','activityCost','foodCost','miscCost']){
    const amount=Number($('#'+id).value);$('#'+id+'Out').textContent=yen(amount);variable+=amount;
  }
  // 租屋四人總價固定 40,300；每人平均 10,075（不四捨五入到不正確金額）
  $('#perBudget').textContent=yen(variable+10075);
  $('#totalBudget').textContent=yen(variable*4+40300);
}
function renderChecklist(){
  let checked=[];try{checked=JSON.parse(store.get('checks')||'[]');if(!Array.isArray(checked))checked=[];}catch{}
  $('#checklist').innerHTML=checklist.map((line,i)=>`<label class="check-row"><input type="checkbox" data-check="${i}" ${checked.includes(i)?'checked':''}><span>${escapeHtml(line)}</span></label>`).join('');
  $$('[data-check]').forEach(el=>el.addEventListener('change',()=>{store.set('checks',JSON.stringify($$('[data-check]:checked').map(a=>Number(a.dataset.check))));}));
}
function share(){const u=new URL(location.href);u.searchParams.set('day',String(currentDay));const msg=`2026 秩父・長瀞 3天2夜｜${days[currentDay].dateJP} ${days[currentDay].name}\n${u}`;if(navigator.share){navigator.share({title:'秩父・長瀞三天兩夜',text:msg,url:u.toString()}).catch(()=>{});}else if(navigator.clipboard&&location.protocol.startsWith('http')){navigator.clipboard.writeText(u.toString()).then(()=>toast('已複製分享連結')).catch(()=>{toast('請手動複製網址列連結');});}else toast('可複製網址列連結分享');}
function formatIcs(date,time){return date.replaceAll('-','')+'T'+time.replace(':','')+'00';}
function icsEscape(s){return String(s).replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');}
function downloadICS(){
  const chunks=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Travel Plan//Chichibu Nagatoro 2026//ZH-TW','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:秩父・長瀞三天兩夜','X-WR-TIMEZONE:Asia/Tokyo'];
  for(const [key,d] of Object.entries(days))for(const [i,a] of d.timeline.entries()){
    chunks.push('BEGIN:VEVENT',`UID:chichibu-20261030-${key}-${i}@travel-plan`,`DTSTAMP:20261027T000000Z`,`DTSTART;TZID=Asia/Tokyo:${formatIcs(d.date,a[0])}`,`DTEND;TZID=Asia/Tokyo:${formatIcs(d.date,a[1])}`,`SUMMARY:${icsEscape(a[2])}`,`DESCRIPTION:${icsEscape(a[3]+'（行程暫定，班次與營業請現場確認）')}`,`LOCATION:${icsEscape(a[5])}`,'END:VEVENT');
  }
  chunks.push('END:VCALENDAR');
  const file=new Blob([chunks.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download='chichibu-nagatoro-2026-10-30-to-11-01.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已下載三天 .ics 行事曆');
}
let forecast=null;
function forecastLabel(code){if(code<=1)return ['晴朗','☀'];if(code<=3)return ['多雲','⛅'];if([45,48].includes(code))return ['有霧','🌫'];if([51,53,55,56,57].includes(code))return ['毛毛雨','🌦'];if([61,63,65,66,67,80,81,82].includes(code))return ['有雨','🌧'];if([71,73,75,77,85,86].includes(code))return ['有雪','❄'];if(code>=95)return ['雷雨','⛈'];return ['變化天氣','☁'];}
function showWeather(){
  const date=days[currentDay].date,idx=forecast?.daily?.time?.indexOf(date)??-1;
  if(idx<0){$('#weatherTemp').textContent='--°';$('#weatherLabel').textContent='尚無當日預報';$('#weatherSymbol').textContent='☁';$('#weatherForecast').textContent='預報尚未取得或日期超出預報範圍；請查看天氣服務。';return;}
  const d=forecast.daily,info=forecastLabel(d.weather_code[idx]);$('#weatherTemp').textContent=Math.round(d.temperature_2m_max[idx])+'°';$('#weatherLabel').textContent=info[0];$('#weatherSymbol').textContent=info[1];$('#weatherForecast').textContent=`高溫 ${Math.round(d.temperature_2m_max[idx])}°C · 低溫 ${Math.round(d.temperature_2m_min[idx])}°C · 降雨機率 ${d.precipitation_probability_max[idx]}%（秩父地區）`;
}
async function loadWeather(){
  $('#weatherChecked').textContent='正在更新天氣…';
  try{const u='https://api.open-meteo.com/v1/forecast?latitude=35.996&longitude=139.084&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=16';const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));forecast=await r.json();$('#weatherChecked').textContent='Open-Meteo · 更新於 '+new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'});showWeather();}
  catch{$('#weatherChecked').textContent='Open-Meteo · 無法連線';$('#weatherLabel').textContent='暫時無法取得預報';$('#weatherForecast').textContent='網頁需有網際網路連線。請開啟天氣 App 或官方預報。';}
}
function init(){
  $$('[data-day]').forEach(el=>el.addEventListener('click',()=>updateDay(Number(el.dataset.day))));
  for(const id of ['transportCost','activityCost','foodCost','miscCost']){$('#'+id).addEventListener('input',()=>{store.set(id,$('#'+id).value);budget();});const v=store.get(id);if(v!==null&&Number(v)>=$('#'+id).min&&Number(v)<=$('#'+id).max)$('#'+id).value=v;}
  $('#resetChecklist').addEventListener('click',()=>{store.remove('checks');renderChecklist();toast('已重設行前清單');});
  $('#shareTop').addEventListener('click',share);$('#sharePlan').addEventListener('click',share);
  $('#downloadCalendar').addEventListener('click',downloadICS);$('#reloadWeather').addEventListener('click',loadWeather);
  budget();renderChecklist();render();loadWeather();
}
init();
