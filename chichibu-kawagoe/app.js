/* Kawagoe · Chichibu · Nagatoro / 2026-10-31 to 2026-11-03. Static site. */
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const yen=n=>'¥'+Math.round(n).toLocaleString('ja-JP');
const mapUrl=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const storage={get(k){try{return localStorage.getItem('saitama_'+k)}catch{return null}},set(k,v){try{localStorage.setItem('saitama_'+k,v)}catch{}},remove(k){try{localStorage.removeItem('saitama_'+k)}catch{}}};
const days={
1:{date:'2026-10-31',dateJP:'10/31（六）',name:'川越',subtitle:'小江戶、和服、甜點',start:'09:00',meet:'池袋站',notice:'Day 1｜川越慢遊。和服可在老街區域租借；冰川神社至老街不遠，請避免一天換太多地點。川越東武飯店僅為候選，未預訂。',highlight:['10 / 31','老街與冰川神社','上午穿和服、下午走藏造老街與時之鐘。假日小川菊排隊可能較久，可用附近備選替換。','川越氷川神社'],
timeline:[
['09:00','09:45','池袋 → 川越','搭東武東上線至川越，約 30–45 分鐘；預留下車與寄行李時間。','交通','川越駅','https://www.tobu.co.jp/railway/','東武鐵道'],
['09:45','10:20','川越站寄放行李','先到川越站西口飯店寄行李，再搭觀光巴士前往神社。','住宿待定','川越東武ホテル','https://www.tobuhotel.co.jp/kawagoe2020/','旅館候選'],
['10:30','11:15','川越冰川神社','鯛魚御神籤、繪馬隧道、日式街拍。','神社','川越氷川神社','https://www.kawagoehikawa.jp/','官方網站'],
['11:30','12:10','租借和服・拍照','建議在一番街附近選店，避免歸還時跨區奔波；如不想換裝，可改咖啡店。','可選','川越一番街','https://www.koedo.or.jp/','川越觀光'],
['12:15','13:15','鰻魚飯午餐','小川菊／林屋等候選，週末可能排隊。用餐店家尚未選定。','餐廳待定','小川菊 川越','https://www.koedo.or.jp/','在地觀光'],
['13:15','14:35','藏造老街、時之鐘','傳統建築、日式雜貨；沿街邊逛邊拍。','步行','時の鐘 川越','https://www.koedo.or.jp/','觀光資訊'],
['14:35','15:30','菓子屋橫丁、地瓜布丁','吃川越地瓜甜點、布丁，保留店內休息時間。','甜點','菓子屋横丁 川越','https://www.koedo.or.jp/','觀光資訊'],
['15:30','16:40','大正浪漫夢通、下午茶','返還和服前享受老街咖啡。','彈性','大正浪漫夢通り 川越','https://www.koedo.or.jp/','觀光資訊'],
['17:00','19:30','Check-in、晚餐','住宿選川越站附近較容易銜接隔日轉車；晚餐依食慾自由選擇。','住宿待定','川越駅','https://www.tobuhotel.co.jp/kawagoe2020/','住宿候選']
],transit:[
['09:00 前後','池袋 → 川越','東武東上線急行／快速急行（依當日停車站）；約 30–45 分鐘。','規劃出發窗，不是指定列車。','https://www.tobu.co.jp/railway/'],
['10:00 前後','川越站 → 川越冰川神社','小江戶巡迴巴士或東武巴士，依候車時間選擇。','假日班次、乘車位置與票價需臨行核實。','https://www.new-wing.co.jp/koedo/']
],route:['川越駅','川越氷川神社','時の鐘 川越','菓子屋横丁 川越']},
2:{date:'2026-11-01',dateJP:'11/01（日）',name:'秩父',subtitle:'神社、武甲山景、溫泉',start:'08:30',meet:'川越站',notice:'Day 2｜川越移動到秩父。川越→小川町→寄居→秩父約 1.5–2 小時，需按假日列車銜接。郊區旅館若提供接送，先確認接送時間再定傍晚行程。',highlight:['11 / 01','羊山公園 · 武甲山','羊山公園的見晴之丘眺望武甲山，春季芝櫻已過，但秋日山景依然值得散步。','羊山公園 秩父'],
timeline:[
['08:30','10:45','川越 → 秩父','東武東上線經小川町至寄居，再轉秩父鐵道至秩父。班次需實際核對。','交通','秩父駅','https://www.chichibu-railway.co.jp/','秩父鐵道'],
['10:45','11:45','秩父神社與番場通','神社參拜、商店街散策；秩父站附近先找行李置物或寄放。','神社','秩父神社','https://www.chichibu-jinja.or.jp/','官方網站'],
['12:00','13:05','秩父名物午餐','豚みそ丼／わらじカツ丼／蕎麥麵，餐廳待定。避免為偏遠店家增加移動。','餐廳待定','西武秩父駅','https://www.chichibu-omotenashi.com/','秩父觀光'],
['13:20','14:50','羊山公園、見晴之丘','武甲山與秩父市景。步行坡度稍多，需穿舒適鞋。','戶外','羊山公園 見晴しの丘','https://www.city.chichibu.lg.jp/','秩父市'],
['15:00','16:00','秩父市區咖啡與甜點','留白時段，作為旅館接送前的緩衝。','彈性','西武秩父駅','https://www.chichibu-omotenashi.com/','秩父觀光'],
['16:00','18:00','入住秩父旅館・泡湯','若選美やま或和どう，請遵守旅館指定接送時段；如住車站附近可自由安排。','住宿待定','ホテル美やま 秩父','https://www.miyama-onsen.com/','旅館參考'],
['18:00','20:00','晚餐與休息','溫泉旅館可考慮含兩餐方案；若不含餐，需先查附近晚餐供應。','住宿相關','秩父市','https://www.chichibu-omotenashi.com/','區域介紹']
],transit:[
['08:30–10:45 預留','川越 → 小川町 → 寄居 → 秩父','東武東上線轉秩父鐵道。中間兩次轉乘不可漏算。','並非已確認的單一列車班次；週日請查假日時刻。','https://www.tobu.co.jp/railway/'],
['15:30–17:00','秩父站區 → 溫泉旅館','優先使用旅館預約制接送；不能預設隨時有車。','旅館未選，接送時間尚未定案。','https://www.miyama-onsen.com/']
],route:['秩父駅','秩父神社','羊山公園 見晴しの丘','西武秩父駅']},
3:{date:'2026-11-02',dateJP:'11/02（一）',name:'長瀞',subtitle:'河谷遊船、岩疊、寶登山',start:'08:30',meet:'秩父站／旅館接送點',notice:'Day 3｜長瀞溪谷。長瀞ラインくだり會受河川水位影響，不能視為已訂妥；若停航，就延長岩疊散步與寶登山咖啡時間。11 月初楓葉可能仍偏早。',highlight:['11 / 02','長瀞岩疊與遊船','沿荒川看岩層地形，再搭纜車上寶登山。遊船受水位影響，先到現場確認營運。','長瀞岩畳'],
timeline:[
['08:30','09:40','旅館 → 長瀞站','接送到秩父鐵道車站後，搭車前往長瀞；須依旅館位置核對。','交通','長瀞駅','https://www.chichibu-railway.co.jp/','秩父鐵道'],
['09:45','10:50','長瀞ラインくだり','木船沿荒川遊覽，可能排隊或因水位停航。','水位依存','長瀞ラインくだり','https://www.chichibu-railway.co.jp/nagatoro/','遊船官方'],
['10:50','11:45','岩疊溪谷散步','岩層、河水與攝影；濕滑時勿靠近河緣。','戶外','長瀞岩畳','https://www.nagatoro.gr.jp/','長瀞觀光'],
['12:00','13:00','長瀞午餐','以站前蕎麥麵或日式定食為主，實際餐廳待定。','餐廳待定','長瀞駅','https://www.nagatoro.gr.jp/','餐廳查找'],
['13:00','13:45','寶登山神社','參拜後往山麓纜車站移動，步行有緩坡。','神社','宝登山神社','https://www.hodosan-jinja.or.jp/','官方網站'],
['14:00','15:30','寶登山纜車、山頂散步','搭乘纜車看秩父群山；依當日班表搭上下山班次。','纜車','宝登山ロープウェイ','https://www.hodosan-ropeway.co.jp/','纜車官方'],
['15:30','16:30','長瀞咖啡或伴手禮','可依體力選擇；保留返程轉車緩衝。','彈性','長瀞駅','https://www.nagatoro.gr.jp/','長瀞觀光'],
['16:30','18:30','返回秩父旅館','秩父鐵道返回；若旅館有固定接送，需提前確認最後一班。','住宿相關','秩父駅','https://www.chichibu-railway.co.jp/','時刻資訊']
],transit:[
['09:00 前後','秩父／御花畑／和銅黑谷 → 長瀞','秩父鐵道，實際搭乘站依旅館而定，約 20–40 分鐘加接送。','11/2 是平日，請使用平日時刻。','https://www.chichibu-railway.co.jp/'],
['14:00–15:30（規劃）','寶登山纜車往返','纜車可能每半小時一班或旺季加開，須以官方當日時刻為準。','14:00／15:30 是建議選擇時段，不保證該班營運。','https://www.hodosan-ropeway.co.jp/']
],route:['長瀞駅','長瀞岩畳','宝登山神社','宝登山ロープウェイ']},
4:{date:'2026-11-03',dateJP:'11/03（二・文化の日）',name:'秩父 Muse Park',subtitle:'銀杏大道、午餐、返東京',start:'08:30',meet:'西武秩父站',notice:'Day 4｜文化之日，公車採土休日班表。Muse Park 銀杏 11 月初可能已經落葉；若景況欠佳可改市區咖啡、祭之湯或伴手禮。返程 Laview 指定席建議預先查票。',highlight:['11 / 03','Muse Park 銀杏大道','銀杏盛況受天氣影響很大，11 月初可能過了高峰。搭循環巴士務必記住返程班次。','秩父ミューズパーク'],
timeline:[
['08:30','09:20','早餐、退房、寄放行李','把行李寄旅館或車站可行位置，攜帶輕便背包。','住宿相關','西武秩父駅','https://www.seiburailway.jp/','西武鐵道'],
['09:30','10:00','前往 Muse Park','優先搭「ぐるりん號」循環巴士；09:30 為規劃目標，非本站已核實班次。','交通','秩父ミューズパーク','https://www.muse-park.com/access','官方交通'],
['10:00','11:45','銀杏大道散步','沿 Sky Road 賞銀杏與拍照；留意腳下落葉。','戶外','秩父ミューズパーク イチョウ並木','https://www.muse-park.com/','公園網站'],
['11:45','12:30','展望休息、準備回程','提早走回巴士站候車；錯過車可能需要久等。','彈性','秩父ミューズパーク','https://www.muse-park.com/access','巴士資訊'],
['12:30','13:30','返回西武秩父站','依當天土休日循環巴士表決定上車時間。','交通','西武秩父駅','https://www.muse-park.com/access','官方交通'],
['13:30','14:35','午餐、伴手禮','車站周邊豚味噌丼、蕎麥麵或祭之湯商場。','餐廳待定','西武秩父駅','https://www.seibu-leisure.co.jp/matsuri/','祭之湯'],
['15:00','17:00','西武秩父 → 池袋','西武特急 Laview 或一般列車經飯能返回；指定席要先查空位。','返東京','池袋駅','https://www.seiburailway.jp/railway/reservedtrain/timetable/','特急時刻']
],transit:[
['09:00–10:00','西武秩父駅 → Muse Park','ぐるりん號循環巴士，選停靠銀杏大道方便的站點。','11/3 國定假日，須看土休日表；不可誤把目標 09:30 當確定班次。','https://www.muse-park.com/access'],
['12:00–13:30','Muse Park → 西武秩父站','返程公車較少，現場確認班次後再決定步道停留時間。','若班次不合，改短走或縮短景點。','https://www.muse-park.com/access'],
['15:00 前後','西武秩父 → 池袋','Laview 特急（須另購特急券）或一般列車轉乘。','僅為預計離開時間；不是已預訂列車。','https://www.seiburailway.jp/railway/reservedtrain/timetable/']
],route:['西武秩父駅','秩父ミューズパーク','西武秩父駅']}
};
const candidates={
food:[
{id:'ogakiku',days:[1],name:'小川菊',tag:'川越 · 鰻魚飯',price:'約 ¥4,000–6,000／人',desc:'歷史悠久的鰻魚料理店，午餐氣氛佳；週末排隊可能較久，須現場確認營業與排隊規則。',map:'小川菊 川越',site:'https://www.koedo.or.jp/'},
{id:'hayashiya',days:[1],name:'林屋 川越店',tag:'川越 · 鰻魚飯候補',price:'約 ¥3,000–5,000／人',desc:'可替換小川菊，從老街走路可達；依當日營業與候位決定。',map:'林屋 川越',site:'https://www.koedo.or.jp/'},
{id:'kawagoe-purin',days:[1],name:'川越プリン',tag:'川越 · 下午茶',price:'約 ¥400–1,000／人',desc:'地瓜布丁、甜點散策。可以當作逛菓子屋橫丁時的彈性停留點。',map:'川越プリン',site:'https://www.koedo.or.jp/'},
{id:'nosaka',days:[2,4],name:'野さか',tag:'秩父 · 豚みそ丼',price:'約 ¥1,400–2,500／人',desc:'西武秩父站附近的秩父名物豬肉味噌丼；排隊、營業日和售完情形須核對。',map:'豚みそ丼本舗 野さか',site:'https://www.chichibu-omotenashi.com/'},
{id:'chichibu-soba',days:[2,4],name:'秩父市區蕎麥麵',tag:'秩父 · 清爽午餐替代',price:'約 ¥1,100–2,200／人',desc:'如果不想排豚味噌丼，改選秩父站至西武秩父站一帶的蕎麥麵店；具體店名待決。',map:'秩父駅 そば',site:'https://www.chichibu-omotenashi.com/'},
{id:'nagatoro-soba',days:[3],name:'長瀞站前蕎麥麵店',tag:'長瀞 · 午餐候選',price:'約 ¥1,200–2,200／人',desc:'以離長瀞站與岩疊近的蕎麥麵店優先，避免因午餐錯過下午纜車；店名尚未定案。',map:'長瀞駅 そば',site:'https://www.nagatoro.gr.jp/'},
{id:'nagatoro-cafe',days:[3],name:'長瀞站前咖啡與甜點',tag:'長瀞 · 下午茶候選',price:'約 ¥600–1,400／人',desc:'遊船結束或搭纜車後，依營業情況挑一間休息；不預先指定店面。',map:'長瀞駅 カフェ',site:'https://www.nagatoro.gr.jp/'}
],hotels:[
{id:'kawagoe-tobu',days:[1],name:'川越東武ホテル',tag:'川越 · 車站最方便',price:'估 ¥15,000–25,000／房／晚',desc:'川越站西口 U_PLACE，出站易抵達。隔天搭東武東上線最省移動，適合不想拖行李走老街。',map:'川越東武ホテル',site:'https://www.tobuhotel.co.jp/kawagoe2020/'},
{id:'kawagoe-prince',days:[1],name:'川越プリンスホテル',tag:'川越 · 本川越站周邊',price:'估 ¥15,000–26,000／房／晚',desc:'靠近本川越站，老街觀光便利；隔日搭東武東上線須先移動到川越站／川越市站。',map:'川越プリンスホテル',site:'https://www.princehotels.co.jp/kawagoe/'},
{id:'miyama',days:[2,3],name:'ホテル美やま',tag:'秩父 · 溪流溫泉旅館',price:'估 ¥16,000–26,000／人／晚（含兩餐方案）',desc:'溫泉旅館氣氛佳，較偏郊區。兩晚連住需確認空房、含餐規則、接送地點及時間。',map:'ホテル美やま 秩父',site:'https://www.miyama-onsen.com/'},
{id:'wado',days:[2,3],name:'和銅鉱泉 ゆの宿 和どう',tag:'秩父 · 郊區溫泉',price:'估 ¥15,000–25,000／人／晚（含兩餐方案）',desc:'和銅黑谷站周邊的傳統旅宿；可搭秩父鐵道往長瀞，但接送須先預約確認。',map:'和銅鉱泉 ゆの宿 和どう',site:'https://www.wadoh.co.jp/'},
{id:'routeinn',days:[2,3],name:'ホテルルートインGrand秩父',tag:'秩父 · 交通便利替代',price:'估 ¥12,000–22,000／房／晚',desc:'若優先重視自由用餐與少用接駁車，秩父市區飯店比郊區旅館實際。價位為規劃估值。',map:'ホテルルートインGrand秩父',site:'https://www.route-inn.co.jp/'}
]};
const checklist=['確認 10/31 川越住宿','確認 11/1–11/3 秩父兩晚住宿與接送','確認 11/1 川越→寄居→秩父轉乘時刻','查 11/3 Muse Park 土休日巴士班表','確認餐廳營業日與候位方式','確認遊船水位、纜車營運與天氣','手機充電、交通 IC 卡、好走的鞋子'];
const query=new URLSearchParams(location.search);let currentDay=/^[1-4]$/.test(query.get('day'))?Number(query.get('day')):Number(storage.get('day'))||1;
if(!days[currentDay])currentDay=1;
let chosen=new Set();try{const a=JSON.parse(storage.get('chosen')||'[]');if(Array.isArray(a))chosen=new Set(a)}catch{}
const toast=msg=>{const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3000)};
function daily(){return days[currentDay]}
function updateDay(day){
if(!days[day])return;currentDay=day;storage.set('day',String(day));
if(location.protocol.startsWith('http')){const u=new URL(location.href);u.searchParams.set('day',String(day));history.replaceState(null,'',u)}
render();
}
function render(){
const d=daily();
$$('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.day)===currentDay)));
$('#overviewTitle').textContent='Day '+currentDay+' · '+d.name;
$('#overviewDate').textContent=d.dateJP+' · '+d.subtitle;
$('#overviewClock').innerHTML=d.start.slice(0,2)+'<span>'+d.start.slice(2)+'</span>';
$('#meetMap').href=mapUrl(d.meet);$('#modeNotice').textContent=d.notice;
$('#highlightDate').textContent=d.highlight[0];$('#highlightTitle').textContent=d.highlight[1];$('#highlightDesc').textContent=d.highlight[2];$('#highlightLink').href=mapUrl(d.highlight[3]);
$('#timeline').innerHTML=d.timeline.map((a,i)=>'<article class="timeline-item '+(i===0?'fixed':'')+'"><span class="timeline-dot" aria-hidden="true"></span><div class="timeline-time">'+a[0]+' — '+a[1]+'</div><div class="timeline-content"><div class="timeline-split"><div><div class="timeline-badges"><span class="timeline-tag '+(i===0?'fixed-tag':'')+'">'+a[4]+'</span></div><h3>'+a[2]+'</h3></div><span class="timeline-number" aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span></div><p>'+a[3]+'</p><div class="timeline-links"><a href="'+mapUrl(a[5])+'" target="_blank" rel="noopener noreferrer">地圖導航 ↗</a><a href="'+a[6]+'" target="_blank" rel="noopener noreferrer">'+a[7]+' ↗</a></div></div></article>').join('');
$('#transportCards').innerHTML=d.transit.map(t=>'<article class="transit-card"><div class="transit-time">'+t[0]+'</div><h3>'+t[1]+'</h3><p>'+t[2]+'</p><a href="'+t[4]+'" target="_blank" rel="noopener noreferrer">交通業者／時刻資訊 ↗</a><small class="transit-hint">'+t[3]+'</small></article>').join('');
const origin=d.route[0],destination=d.route[d.route.length-1];
const waypoints=d.route.slice(1,-1).join('|');
$('#routeLink').href='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(origin)+'&destination='+encodeURIComponent(destination)+'&waypoints='+encodeURIComponent(waypoints);
renderCandidates();loadWeather();
}
function renderCandidates(){
for(const type of ['food','hotels']){
const all=candidates[type].filter(c=>c.days.includes(currentDay));
$('#'+(type==='food'?'foodCount':'hotelCount')).textContent='（'+all.length+' 個可展開選項）';
$('#'+(type==='food'?'foodChoices':'hotelChoices')).innerHTML=all.map(c=>'<details class="choice-card"><summary><div><h3>'+c.name+' <span class="choice-status">待定</span></h3><div class="choice-tag">'+c.tag+'</div></div><span class="choice-price">'+c.price+'</span></summary><p>'+c.desc+'</p><div class="choice-actions"><a href="'+mapUrl(c.map)+'" target="_blank" rel="noopener noreferrer">Google Maps ↗</a><a href="'+c.site+'" target="_blank" rel="noopener noreferrer">官網／旅遊資訊 ↗</a><button class="candidate-button" type="button" data-pick="'+c.id+'" aria-pressed="'+chosen.has(c.id)+'">'+(chosen.has(c.id)?'★ 已列入考慮':'☆ 列入考慮')+'</button></div><small class="choice-note">僅供比較，未預約、價格未經即時核實。</small></details>').join('');
}
}
function updateBudget(){
const ids=['people','kawagoeStay','chichibuStay','foodCost'],nums=Object.fromEntries(ids.map(id=>[id,Number($('#'+id).value)]));
ids.forEach(id=>$('#'+id+'Out').textContent=id==='people'?nums[id]:yen(nums[id]));
const per=nums.kawagoeStay+nums.chichibuStay*2+nums.foodCost+6500+7500+3000;
$('#perBudget').textContent=yen(per);$('#totalBudget').textContent=yen(per*nums.people);
ids.forEach(id=>storage.set('budget_'+id,String(nums[id])));
}
function checklistRender(){
let done=[];try{const a=JSON.parse(storage.get('checks')||'[]');if(Array.isArray(a))done=a}catch{}
$('#checklist').innerHTML=checklist.map((v,i)=>'<label class="check-item"><input type="checkbox" data-check="'+i+'" '+(done.includes(i)?'checked':'')+'><span>'+v+'</span></label>').join('');
}
function isoToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
async function loadWeather(){
const d=daily(),target=d.date;$('#weatherChecked').textContent=d.name+'周邊 · Open-Meteo';
if(isoToday()>target){$('#weatherTemp').textContent='—';$('#weatherLabel').textContent='旅行日期已過';$('#weatherForecast').textContent='預報已停止更新，行程仍可回顧。';return}
$('#weatherLabel').textContent='查詢天氣中…';$('#weatherForecast').textContent='氣象預報僅供參考。';
const coord=currentDay===1?[35.9251,139.4858]:currentDay===3?[36.1143,139.1098]:[35.9918,139.0861];
const url='https://api.open-meteo.com/v1/forecast?latitude='+coord[0]+'&longitude='+coord[1]+'&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&start_date='+target+'&end_date='+target;
const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),7000);
try{
const r=await fetch(url,{signal:ac.signal});if(!r.ok)throw Error('HTTP '+r.status);
const j=await r.json(),ix=(j.daily?.time||[]).indexOf(target);if(ix<0)throw Error('尚未進入預報範圍');
if(target!==daily().date)return;
const hi=j.daily.temperature_2m_max[ix],lo=j.daily.temperature_2m_min[ix],p=j.daily.precipitation_probability_max[ix];
$('#weatherTemp').textContent=Math.round(lo)+'–'+Math.round(hi)+'°';
$('#weatherLabel').textContent='最高降雨機率 '+p+'%';$('#weatherForecast').textContent='所選日期：'+d.dateJP+'，預報會隨時間改變。';
$('#weatherSymbol').textContent=p>=60?'☂':p>=30?'☁':'☀';$('#weatherChecked').textContent='Open-Meteo · '+new Intl.DateTimeFormat('zh-TW',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Tokyo'}).format(new Date())+' JST';
}catch(e){if(target!==daily().date)return;$('#weatherTemp').textContent='—';$('#weatherLabel').textContent='目前無法取得預報';$('#weatherForecast').textContent='可能尚未進入預報涵蓋期；請於出發前重新整理。'}finally{clearTimeout(timer)}
}
async function share(){
if(location.protocol==='file:'){toast('本機檔案需部署 GitHub Pages 才能分享');return}
const u=new URL(location.href);u.searchParams.set('day',String(currentDay));u.hash='';
const message='川越 × 秩父 × 長瀞｜2026/10/31–11/3｜Day '+currentDay;
if(navigator.share){try{await navigator.share({title:message,url:u.href});return}catch(e){if(e?.name==='AbortError')return}}
try{await navigator.clipboard.writeText(u.href);toast('已複製本日行程網址');$('#copyMessage').textContent='已複製網址，可貼到 LINE 或群組。'}catch{$('#copyMessage').textContent='請複製：'+u.href}
}
function icsEscape(s){return String(s).replaceAll('\\','\\\\').replaceAll(';','\\;').replaceAll(',','\\,').replaceAll('\n','\\n')}
function downloadICS(){
const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
const events=Object.entries(days).flatMap(([n,d])=>d.timeline.map((item,i)=>{
const datetime=t=>d.date.replaceAll('-','')+'T'+t.replace(':','')+'00';
return ['BEGIN:VEVENT','UID:saitama-'+n+'-'+i+'@travel-plan.local','DTSTAMP:'+stamp,'DTSTART;TZID=Asia/Tokyo:'+datetime(item[0]),'DTEND;TZID=Asia/Tokyo:'+datetime(item[1]),'SUMMARY:'+icsEscape('Day '+n+'｜'+item[2]),'DESCRIPTION:'+icsEscape(item[3]+'（時間、訂位均屬暫定）'),'LOCATION:'+icsEscape(item[5]),'END:VEVENT'].join('\r\n')})).join('\r\n');
const data=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Travel Plan//Saitama 2026//ZH','CALSCALE:GREGORIAN','X-WR-CALNAME:川越秩父四天三夜',events,'END:VCALENDAR'].join('\r\n');
const url=URL.createObjectURL(new Blob([data],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='kawagoe-chichibu-2026.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('已建立四天行事曆');
}
function init(){
$$('[data-day]').forEach(b=>b.addEventListener('click',()=>updateDay(Number(b.dataset.day))));
for(const id of ['people','kawagoeStay','chichibuStay','foodCost']){const v=Number(storage.get('budget_'+id));if(v>=Number($('#'+id).min)&&v<=Number($('#'+id).max))$('#'+id).value=String(v);$('#'+id).addEventListener('input',updateBudget)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(!b)return;const id=b.dataset.pick;chosen.has(id)?chosen.delete(id):chosen.add(id);storage.set('chosen',JSON.stringify([...chosen]));b.setAttribute('aria-pressed',String(chosen.has(id)));b.textContent=chosen.has(id)?'★ 已列入考慮':'☆ 列入考慮';toast('候選偏好只儲存在本機，尚未預訂')});
$('#checklist').addEventListener('change',()=>storage.set('checks',JSON.stringify($$('[data-check]:checked').map(el=>Number(el.dataset.check)))));
$('#resetChecklist').addEventListener('click',()=>{storage.remove('checks');checklistRender();toast('清單已重設')});
$('#shareTop').addEventListener('click',share);$('#sharePlan').addEventListener('click',share);$('#downloadCalendar').addEventListener('click',downloadICS);$('#reloadWeather').addEventListener('click',loadWeather);
checklistRender();updateBudget();render();
}
init();
