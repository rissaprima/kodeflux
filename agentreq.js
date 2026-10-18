/* Kodeflux — "Request an industry" fun flow. Opens from any [data-agentreq]. Netlify form: kodeflux-agentreq */
(function(){
var STEPS=[
 {q:'What kind of business do you run?',id:'Bisnismu bergerak di bidang apa?',key:'industry',opts:[
  ['💆','Wellness & clinics','Klinik, salon, spa, studio'],['🍽️','Food & beverage','Kafe, resto, katering'],['🏡','Property & hospitality','Villa, kos, penginapan'],['🏗️','Construction & contractors','Kontraktor, interior, proyek'],['💼','Professional services','Konsultan, hukum, akuntan'],['✨','Something else','Nanti kamu ceritakan di akhir']],
  react:{'Wellness & clinics':'Appointments, reminders, follow-ups. Agents love that.','Food & beverage':'Orders, bookings and suppliers. Busy kitchen, busy inbox.','Property & hospitality':'Guests, owners, schedules. We know that one.','Construction & contractors':'Quotes, progress, payments. Lots of moving parts.','Professional services':'Clients, proposals, invoices. Classic desk work.','Something else':'Oh, interesting. We want to hear it.'}},
 {q:'Which desk is struggling most?',id:'Meja mana yang paling kewalahan?',key:'desk',opts:[
  ['📥','Inquiries','Pesan masuk yang telat dibalas'],['🧾','Quotes','Bikin penawaran memakan waktu'],['📅','Scheduling','Jadwal bentrok atau terlewat'],['📦','Delivery','Hasil kerja dan serah terima'],['💸','Billing','Tagihan dan follow-up bayar'],['📊','Owner brief','Susah lihat gambaran besarnya']],
  react:{}},
 {q:'How do inquiries reach you today?',id:'Sekarang pesan pelanggan masuk lewat mana?',key:'inquiry_flow',opts:[
  ['💬','WhatsApp','Semua lewat chat'],['📸','Instagram DMs','Dari media sosial'],['✉️','Email','Surat dan form'],['📞','Phone & walk-in','Telepon atau datang langsung'],['🌐','Website & marketplace','Form web dan platform'],['🌀','A bit of everything','Masuk dari mana-mana']],
  react:{'WhatsApp':'The inbox that never closes. Yes.','Instagram DMs':'Scrolling DMs at midnight, we see you.','Email':'Inbox zero is a myth, but we can help.','Phone & walk-in':'Old school works. Let’s add a safety net.','Website & marketplace':'Good, structured leads. A solid start.','A bit of everything':'Five channels, one tired owner. Let’s fix that.'}},
 {type:'text',q:'If agents ran it for you, you’d hand over…',id:'Kalau agent yang jalanin, kamu mau serahkan apa?',key:'agent_tasks',ph:'e.g. “answer first questions, send quotes, remind clients to pay”'},
 {q:'How soon do you need it?',id:'Seberapa cepat kamu butuh?',key:'when',opts:[
  ['🔥','Like, yesterday','Sudah mendesak'],['🗓️','This month','Dalam waktu dekat'],['🌱','No rush','Lagi cari-cari ide']],
  react:{'Like, yesterday':'Noted. Priority flag on. 🚩','This month':'Doable. Let’s talk.','No rush':'Perfect. Good systems are built calmly.'}}
];

var css='.arq{position:fixed;inset:0;z-index:1400;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(5,4,9,.78);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.arq.on{display:flex}'+
'.arq-card{position:relative;width:min(100%,680px);max-height:min(90svh,820px);overflow:auto;border:1px solid rgba(255,255,255,.16);border-radius:24px;background:rgba(15,13,20,.99);box-shadow:0 28px 90px rgba(0,0,0,.55);padding:30px}'+
'.arq-x{position:absolute;top:16px;right:16px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#f4f1ea;font-size:1.3rem;cursor:pointer}'+
'.arq-dots{display:flex;gap:6px;margin-bottom:18px}.arq-dots i{height:5px;flex:1;max-width:46px;border-radius:9px;background:rgba(255,255,255,.1);transition:.3s}.arq-dots i.on{background:linear-gradient(90deg,#7b4fd8,#c8578f,#e7b565)}'+
'.arq-k{font:600 .72rem ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:#e7b565}'+
'.arq h3{margin:8px 0 0;padding-right:44px;font-size:clamp(1.4rem,3vw,1.9rem);line-height:1.18;letter-spacing:-.025em;color:#f4f1ea}.arq h3 span{display:block;margin-top:6px;font-size:.88rem;font-weight:400;letter-spacing:0;color:#a29eab}'+
'.arq-step,.arq-lead,.arq-ok{display:none}.arq-step.on,.arq-lead.on,.arq-ok.on{display:block}'+
'.arq-opts{display:grid;gap:10px;margin-top:22px;grid-template-columns:1fr 1fr}.arq-opts button{display:flex;gap:12px;align-items:center;text-align:left;min-height:62px;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#f4f1ea;font:inherit;cursor:pointer;transition:.2s}'+
'.arq-opts button:hover{border-color:rgba(255,255,255,.28);transform:translateY(-1px)}.arq-opts button.sel{border-color:rgba(231,181,101,.75);background:rgba(231,181,101,.09);transform:scale(1.015)}'+
'.arq-opts em{font-style:normal;font-size:1.5rem;line-height:1}.arq-opts b{display:block;font-size:.9rem}.arq-opts small{display:block;margin-top:2px;color:#a29eab;font-size:.76rem;line-height:1.35}'+
'.arq-react{min-height:1.4em;margin-top:14px;color:#e7b565;font-size:.88rem}'+
'.arq textarea,.arq input{width:100%;margin-top:6px;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#f4f1ea;font:inherit}.arq textarea{min-height:120px;resize:vertical;margin-top:22px}.arq label{display:block;margin-top:14px;font-size:.8rem;color:#a29eab}'+
'.arq-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}'+
'.arq-nav{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:22px}.arq-back{background:none;border:0;color:#a29eab;font:inherit;cursor:pointer}'+
'.arq-go{padding:.7rem 1.3rem;border-radius:99px;border:0;font:600 .9rem inherit;color:#fff;background:linear-gradient(135deg,#7b4fd8,#c8578f);cursor:pointer}.arq-go[disabled]{opacity:.35;cursor:default}'+
'.arq-sum{margin-top:16px;padding:13px 14px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.025);color:#a29eab;font-size:.84rem;line-height:1.55}.arq p{color:#a29eab;line-height:1.6;margin:10px 0 0}.arq-st{margin-top:10px;font-size:.84rem;color:#e7b565}'+
'.arq-big{font-size:3rem;margin-top:10px;animation:arqp .8s ease}@keyframes arqp{0%{transform:scale(.3) rotate(-20deg);opacity:0}70%{transform:scale(1.2) rotate(8deg)}100%{transform:scale(1);opacity:1}}'+
'@media(max-width:600px){.arq{padding:10px}.arq-card{padding:26px 18px 20px}.arq-opts,.arq-grid{grid-template-columns:1fr}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

var h='<div class="arq-card" role="dialog" aria-modal="true" aria-label="Request an industry"><button class="arq-x" type="button" aria-label="Close">×</button><div class="arq-dots">'+STEPS.map(function(){return '<i></i>'}).join('')+'</div>';
STEPS.forEach(function(s,i){
 h+='<div class="arq-step" data-i="'+i+'"><span class="arq-k">'+String(i+1).padStart(2,'0')+' / '+String(STEPS.length).padStart(2,'0')+'</span><h3>'+s.q+'<span>'+s.id+'</span></h3>';
 if(s.type==='text')h+='<textarea data-t placeholder="'+s.ph+'"></textarea>';
 else{h+='<div class="arq-opts">'+s.opts.map(function(o){return '<button type="button" data-v="'+o[1]+'"><em>'+o[0]+'</em><span><b>'+o[1]+'</b><small>'+o[2]+'</small></span></button>'}).join('')+'</div>';}
 h+='<div class="arq-react"></div><div class="arq-nav"><button class="arq-back" type="button">'+(i?'Back':'')+'</button><button class="arq-go" type="button" disabled>'+(i===STEPS.length-1?'Last one →':'Next →')+'</button></div></div>';
});
h+='<div class="arq-lead"><span class="arq-k">Almost there 🚀</span><h3>Where do we send the update?<span>Kemana kami kabari kamu?</span></h3><div class="arq-sum"></div><form name="kodeflux-agentreq" method="POST" data-netlify="true"><input type="hidden" name="form-name" value="kodeflux-agentreq"><input type="hidden" name="industry"><input type="hidden" name="desk"><input type="hidden" name="inquiry_flow"><input type="hidden" name="agent_tasks"><input type="hidden" name="urgency"><input type="hidden" name="page"><div class="arq-grid"><div><label>Name</label><input name="name" required autocomplete="name"></div><div><label>Your role / business</label><input name="role" required placeholder="e.g. owner, dental clinic"></div><div><label>WhatsApp</label><input name="whatsapp" type="tel" autocomplete="tel" placeholder="08xx…"></div><div><label>Email</label><input name="email" type="email" autocomplete="email"></div></div><p style="font-size:.78rem">WhatsApp or email, either one is fine.</p><div class="arq-nav"><button class="arq-back" type="button" data-lb>Back</button><button class="arq-go" type="submit">Send my request ✨</button></div><div class="arq-st"></div></form></div>';
h+='<div class="arq-ok"><div class="arq-big">🎉</div><h3>Request received!<span>Request kamu sudah masuk.</span></h3><p>Thanks. We read every request, and industries that many people ask for are added first. We’ll reach out through the contact you shared.</p></div></div>';
var m=document.createElement('div');m.className='arq';m.innerHTML=h;document.body.appendChild(m);

var steps=[].slice.call(m.querySelectorAll('.arq-step')),dots=[].slice.call(m.querySelectorAll('.arq-dots i')),lead=m.querySelector('.arq-lead'),ok=m.querySelector('.arq-ok'),form=m.querySelector('form'),A=[],cur=0;
function show(n){cur=n;steps.forEach(function(s,i){s.classList.toggle('on',i===n)});lead.classList.toggle('on',n===steps.length);ok.classList.remove('on');dots.forEach(function(d,i){d.classList.toggle('on',i<=n)});m.querySelector('.arq-card').scrollTop=0;
 if(n<steps.length){var s=steps[n];s.querySelectorAll('[data-v]').forEach(function(b){b.classList.toggle('sel',b.dataset.v===A[n])});s.querySelector('.arq-go').disabled=!A[n];var t=s.querySelector('[data-t]');if(t){t.value=A[n]||'';setTimeout(function(){t.focus()},60)}}
 else{m.querySelector('.arq-sum').textContent=STEPS.map(function(x,i){return x.key+': '+(A[i]||'—')}).join(' · ');}}
function open(src){m.classList.add('on');document.body.style.overflow='hidden';form.page.value=src||location.pathname;show(0)}
function close(){m.classList.remove('on');document.body.style.overflow=''}
steps.forEach(function(s,i){var go=s.querySelector('.arq-go'),rx=s.querySelector('.arq-react'),t=s.querySelector('[data-t]');
 s.querySelectorAll('[data-v]').forEach(function(b){b.onclick=function(){A[i]=b.dataset.v;s.querySelectorAll('[data-v]').forEach(function(x){x.classList.toggle('sel',x===b)});go.disabled=false;rx.textContent=(STEPS[i].react&&STEPS[i].react[A[i]])||['Nice pick.','Got it.','Good one.'][i%3]}});
 if(t)t.oninput=function(){A[i]=t.value.trim();go.disabled=A[i].length<4;rx.textContent=A[i].length>3?'Love it. Keep going if you want to add more.':''};
 go.onclick=function(){if(A[i])show(i+1)};s.querySelector('.arq-back').onclick=function(){if(i)show(i-1)}});
m.querySelector('[data-lb]').onclick=function(){show(steps.length-1)};
m.querySelector('.arq-x').onclick=close;m.addEventListener('click',function(e){if(e.target===m)close()});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('on'))close()});
document.addEventListener('click',function(e){var b=e.target.closest('[data-agentreq]');if(b){e.preventDefault();open(b.getAttribute('data-agentreq'))}});
form.addEventListener('submit',function(e){e.preventDefault();var stt=m.querySelector('.arq-st');
 if(!form.whatsapp.value.trim()&&!form.email.value.trim()){stt.textContent='Please add a WhatsApp number or an email.';return}
 form.industry.value=A[0]||'';form.desk.value=A[1]||'';form.inquiry_flow.value=A[2]||'';form.agent_tasks.value=A[3]||'';form.urgency.value=A[4]||'';
 var d={};new FormData(form).forEach(function(v,k){d[k]=v});var btn=form.querySelector('[type=submit]');btn.disabled=true;stt.textContent='Sending…';
 fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(d).toString()}).then(function(r){if(!r.ok)throw 0;lead.classList.remove('on');ok.classList.add('on');dots.forEach(function(x){x.classList.add('on')})}).catch(function(){stt.textContent='Couldn’t send yet. Please try again.'}).then(function(){btn.disabled=false});});
})();
