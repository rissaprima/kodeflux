/* Kodeflux — "Request a tool" fun flow. Opens from any [data-toolreq]. Netlify form: kodeflux-toolreq */
(function(){
var STEPS=[
 {q:'Who are you building for?',id:'Kamu lagi bikin tool buat siapa?',key:'who',opts:[
  ['🛻','Rentals','Sewa kendaraan, alat, kamera, dll'],['🎉','Events & parties','Acara, vendor, EO'],['🧳','Travel & trips','Tour, open trip, itinerary'],['🎓','Mentoring & classes','Kursus, coaching, bimbel'],['🛍️','Shop & retail','Jualan produk, stok, order'],['🧑‍💻','Services & freelance','Jasa, klien, proyek'],['✨','Something else','Industri lain']],
  react:{'Rentals':'Booking bentrok? Classic.','Events & parties':'So many moving parts. We get it.','Travel & trips':'Itinerary chaos, say no more.','Mentoring & classes':'Teachers deserve nice tools too.','Shop & retail':'Stock and orders, always fighting.','Services & freelance':'Chasing invoices is no one’s dream.','Something else':'Ooh, a new one. Tell us more.'}},
 {q:'What’s the messiest part of your week?',id:'Bagian mana yang paling bikin pusing?',key:'mess',opts:[
  ['💸','Chasing payments','Tagih-tagih dan cek transferan'],['📅','Scheduling','Jadwal bentrok atau lupa'],['🧾','Quotes & invoices','Bikin penawaran dan tagihan'],['📦','Tracking stock / orders','Stok dan pesanan'],['💬','Customer follow-up','Balas chat dan tindak lanjut'],['📊','Reports & numbers','Rekap, laporan, angka']],
  react:{}},
 {q:'How are you surviving right now?',id:'Sekarang pakai apa buat bertahan?',key:'today',opts:[
  ['📑','Spreadsheets','Excel / Google Sheets'],['📱','WhatsApp + notes','Chat dan catatan HP'],['🧩','A few different apps','Banyak aplikasi terpisah'],['📒','Pen & paper','Masih tulis tangan'],['🤷','Honestly, nothing','Belum ada sistemnya']],
  react:{'Spreadsheets':'The spreadsheet has done its time.','WhatsApp + notes':'Scroll up to find that one message… yes.','A few different apps':'Seven tabs open. We see you.','Pen & paper':'Respect. Also: let’s fix this.','Honestly, nothing':'Fresh start. Best kind.'}},
 {type:'text',q:'If this tool existed tomorrow, it would…',id:'Kalau tool ini ada besok, dia bisa…',key:'dream',ph:'e.g. “remind customers to pay and show me who still owes”'},
 {q:'How soon do you need it?',id:'Seberapa cepat kamu butuh?',key:'when',opts:[
  ['🔥','Like, yesterday','Sudah mendesak'],['🗓️','This month','Dalam waktu dekat'],['🌱','No rush','Lagi cari-cari ide']],
  react:{'Like, yesterday':'Noted. Priority flag on.','This month':'Doable. Let’s talk.','No rush':'Perfect. Good ideas take shape slowly.'}}
];
var css='.trq{position:fixed;inset:0;z-index:1400;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(5,4,9,.78);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.trq.on{display:flex}'+
'.trq-card{position:relative;width:min(100%,760px);max-height:min(90svh,820px);overflow:auto;border:1px solid rgba(255,255,255,.16);border-radius:24px;background:rgba(15,13,20,.99);box-shadow:0 28px 90px rgba(0,0,0,.55);padding:32px}'+
'.trq-x{position:absolute;top:18px;right:18px;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#f4f1ea;font-size:1.3rem;cursor:pointer}'+
'.trq-dots{display:none}.trq-dotsx{display:flex;gap:6px;margin-bottom:18px}.trq-dots i{height:5px;flex:1;max-width:46px;border-radius:9px;background:rgba(255,255,255,.1);transition:.3s}.trq-dots i.on{background:linear-gradient(90deg,#7b4fd8,#c8578f,#e7b565)}'+
'.trq-k{font:600 .72rem ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:#e7b565}'+
'.trq h3{margin:8px 0 0;padding-right:44px;font-size:clamp(1.4rem,3vw,1.9rem);line-height:1.18;letter-spacing:-.025em;color:#f4f1ea}.trq h3 span{display:block;margin-top:6px;font-size:.88rem;font-weight:400;letter-spacing:0;color:#a29eab}'+
'.trq-step,.trq-lead,.trq-ok{display:none}.trq-step.on,.trq-lead.on,.trq-ok.on{display:block}'+
'.trq-opts{display:grid;gap:8px;margin-top:18px;grid-template-columns:1fr}.trq-opts button{display:flex;gap:12px;align-items:center;text-align:left;min-height:56px;padding:9px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#f4f1ea;font:inherit;cursor:pointer;transition:.2s}'+
'.trq-opts button:hover{border-color:rgba(255,255,255,.28);transform:translateY(-1px)}.trq-opts button.sel{border-color:rgba(231,181,101,.75);background:rgba(231,181,101,.09);transform:none}'+
'.trq-opts em{display:none}.trq-opts b{display:block;font-size:.9rem}.trq-opts small{display:block;margin-top:2px;color:#a29eab;font-size:.76rem;line-height:1.35}'+
'.trq-react{min-height:1.4em;margin-top:14px;color:#a29eab;font-size:.88rem}'+
'.trq textarea,.trq input{width:100%;margin-top:6px;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#f4f1ea;font:inherit}.trq textarea{min-height:120px;resize:vertical;margin-top:22px}.trq label{display:block;margin-top:14px;font-size:.8rem;color:#a29eab}'+
'.trq-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}'+
'.trq-nav{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:22px}.trq-back{background:none;border:0;color:#a29eab;font:inherit;cursor:pointer}'+
'.trq-go{padding:.7rem 1.3rem;border-radius:99px;border:0;font:600 .9rem inherit;color:#fff;background:linear-gradient(135deg,#7b4fd8,#c8578f);cursor:pointer}.trq-go[disabled]{opacity:.35;cursor:default}'+
'.trq-sum{margin-top:16px;padding:13px 14px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.025);color:#a29eab;font-size:.84rem;line-height:1.55}.trq p{color:#a29eab;line-height:1.6;margin:10px 0 0}.trq-st{margin-top:10px;font-size:.84rem;color:#e7b565}'+
'.trq-big{display:none;font-size:3rem;margin-top:10px;animation:trqp .8s ease}@keyframes trqp{0%{transform:scale(.3) rotate(-20deg);opacity:0}70%{transform:scale(1.2) rotate(8deg)}100%{transform:scale(1);opacity:1}}'+
'@media(max-width:600px){.trq{padding:10px}.trq-card{padding:26px 18px 20px}.trq-opts,.trq-grid{grid-template-columns:1fr}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

var h='<div class="trq-card" role="dialog" aria-modal="true" aria-label="Request a tool"><button class="trq-x" type="button" aria-label="Close">×</button><div class="trq-dots">'+STEPS.map(function(){return '<i></i>'}).join('')+'</div>';
STEPS.forEach(function(s,i){
 h+='<div class="trq-step" data-i="'+i+'"><span class="trq-k">'+String(i+1).padStart(2,'0')+' / '+String(STEPS.length).padStart(2,'0')+'</span><h3>'+s.q+'<span>'+s.id+'</span></h3>';
 if(s.type==='text')h+='<textarea data-t placeholder="'+s.ph+'"></textarea>';
 else{h+='<div class="trq-opts">'+s.opts.map(function(o){return '<button type="button" data-v="'+o[1]+'"><em>'+o[0]+'</em><span><b>'+o[1]+'</b><small>'+o[2]+'</small></span></button>'}).join('')+'</div>';}
 h+='<div class="trq-react"></div><div class="trq-nav"><button class="trq-back" type="button">'+(i?'Back':'')+'</button><button class="trq-go" type="button" disabled>'+(i===STEPS.length-1?'Last one →':'Next →')+'</button></div></div>';
});
h+='<div class="trq-lead"><span class="trq-k">Almost there</span><h3>Where do we send the good news?<span>Kemana kami kabari kamu?</span></h3><div class="trq-sum"></div><form name="kodeflux-toolreq" method="POST" data-netlify="true"><input type="hidden" name="form-name" value="kodeflux-toolreq"><input type="hidden" name="who"><input type="hidden" name="messiest"><input type="hidden" name="current_setup"><input type="hidden" name="dream_tool"><input type="hidden" name="urgency"><input type="hidden" name="page"><div class="trq-grid"><div><label>Name</label><input name="name" required autocomplete="name"></div><div><label>Your role / business</label><input name="role" required placeholder="e.g. owner, car rental"></div><div><label>WhatsApp</label><input name="whatsapp" type="tel" autocomplete="tel" placeholder="08xx…"></div><div><label>Email</label><input name="email" type="email" autocomplete="email"></div></div><p style="font-size:.78rem">WhatsApp or email, either one is fine.</p><div class="trq-nav"><button class="trq-back" type="button" data-lb>Back</button><button class="trq-go" type="submit">Send my idea ✨</button></div><div class="trq-st"></div></form></div>';
h+='<div class="trq-ok"><div class="trq-big">🎉</div><h3>Idea received!<span>Ide kamu sudah masuk.</span></h3><p>Thanks. We read every request, and the ones that many people ask for get built first. We’ll reach out through the contact you shared.</p></div></div>';
var m=document.createElement('div');m.className='trq';m.innerHTML=h;document.body.appendChild(m);

var steps=[].slice.call(m.querySelectorAll('.trq-step')),dots=[].slice.call(m.querySelectorAll('.trq-dots i')),lead=m.querySelector('.trq-lead'),ok=m.querySelector('.trq-ok'),form=m.querySelector('form'),A=[],cur=0;
function show(n){cur=n;steps.forEach(function(s,i){s.classList.toggle('on',i===n)});lead.classList.toggle('on',n===steps.length);ok.classList.remove('on');dots.forEach(function(d,i){d.classList.toggle('on',i<=n)});m.querySelector('.trq-card').scrollTop=0;
 if(n<steps.length){var s=steps[n];s.querySelectorAll('[data-v]').forEach(function(b){b.classList.toggle('sel',b.dataset.v===A[n])});s.querySelector('.trq-go').disabled=!A[n];var t=s.querySelector('[data-t]');if(t){t.value=A[n]||'';setTimeout(function(){t.focus()},60)}}
 else{m.querySelector('.trq-sum').textContent=STEPS.map(function(x,i){return x.key+': '+(A[i]||'—')}).join(' · ');}}
function open(src){m.classList.add('on');document.body.style.overflow='hidden';form.page.value=src||location.pathname;show(0)}
function close(){m.classList.remove('on');document.body.style.overflow=''}
steps.forEach(function(s,i){var go=s.querySelector('.trq-go'),rx=s.querySelector('.trq-react'),t=s.querySelector('[data-t]');
 s.querySelectorAll('[data-v]').forEach(function(b){b.onclick=function(){A[i]=b.dataset.v;s.querySelectorAll('[data-v]').forEach(function(x){x.classList.toggle('sel',x===b)});go.disabled=false;rx.textContent=(STEPS[i].react&&STEPS[i].react[A[i]])||['Nice pick.','Got it.','Good one.'][i%3]}});
 if(t)t.oninput=function(){A[i]=t.value.trim();go.disabled=A[i].length<4;rx.textContent=A[i].length>3?'Love it. Keep going if you want to add more.':''};
 go.onclick=function(){if(A[i])show(i+1)};s.querySelector('.trq-back').onclick=function(){if(i)show(i-1)}});
m.querySelector('[data-lb]').onclick=function(){show(steps.length-1)};
m.querySelector('.trq-x').onclick=close;m.addEventListener('click',function(e){if(e.target===m)close()});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('on'))close()});
document.addEventListener('click',function(e){var b=e.target.closest('[data-toolreq]');if(b){e.preventDefault();open(b.getAttribute('data-toolreq'))}});
form.addEventListener('submit',function(e){e.preventDefault();var stt=m.querySelector('.trq-st');
 if(!form.whatsapp.value.trim()&&!form.email.value.trim()){stt.textContent='Please add a WhatsApp number or an email.';return}
 form.who.value=A[0]||'';form.messiest.value=A[1]||'';form.current_setup.value=A[2]||'';form.dream_tool.value=A[3]||'';form.urgency.value=A[4]||'';
 var d={};new FormData(form).forEach(function(v,k){d[k]=v});var btn=form.querySelector('[type=submit]');btn.disabled=true;stt.textContent='Sending…';
 fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(d).toString()}).then(function(r){if(!r.ok)throw 0;lead.classList.remove('on');ok.classList.add('on');dots.forEach(function(x){x.classList.add('on')})}).catch(function(){stt.textContent='Couldn’t send yet. Please try again.'}).then(function(){btn.disabled=false});});
})();
