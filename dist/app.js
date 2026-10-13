import {LEVELS,MODES,LESSONS,SENTENCES,ROLES,STATUSES,SIGNS,ROOTS,PATTERNS} from './data.js';
import {DEFAULT_STATE,validateState,question,chooseQuestion,grade,addAttempt,stats,shuffle,stripHarakat} from './engine.js';

const $=s=>document.querySelector(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const scope=new URL('./',location.href).pathname;
const storageKey='qawaid-studio-v1:'+scope;
let state=DEFAULT_STATE(),storageIssue='';
try {const raw=localStorage.getItem(storageKey);if(raw)state=validateState(JSON.parse(raw));}catch{storageIssue='Progres tersimpan tidak dapat dibaca. Data lama tidak ditimpa sampai Anda menyimpan perubahan.';}
let session={q:null,answer:null,result:null,bank:[],choices:[],mode:'ordering',direction:'ar-id',count:0,review:false};
let aiAvailable=false,aiBusy=false,aiResult=null,aiError='',aiText='',aiTask='evaluate',aiQuestionId='lanjut-hal';
let deferredInstall=null,toastTimer=null;
const routes={home:'Beranda',practice:'Latihan',lessons:'Kaidah',history:'Riwayat',ai:'Studio AI',settings:'Pengaturan'};
const paths={
 home:'M3 10 12 3l9 7v10H3z M9 20v-7h6v7',
 layers:'m12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5',
 scan:'M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5 M7 12h10 M12 7v10',
 branch:'M6 3v12a4 4 0 0 0 4 4h8 M6 8h8a4 4 0 0 0 4-4 M16 17l3 2-3 2',
 translate:'M3 5h12 M9 3v2 M5 6c1 5 3 7 8 9 M12 6c-1 5-4 8-9 10 M13 21l4-10 4 10 M15 17h4',
 pen:'m4 16 11-11 4 4L8 20H4z M13 7l4 4',
 book:'M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2z M12 6v15',
 clock:'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
 spark:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
 settings:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M9 15v6',
 arrow:'M4 12h16 M14 6l6 6-6 6',
 check:'m5 12 4 4L19 6',
 sun:'M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 download:'M12 3v12 M7 10l5 5 5-5 M4 17v4h16v-4',
 leaf:'M20 3C7 2 1 10 7 17c6 6 15-1 13-14z M5 21 16 9',
 target:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0 M12 10v4 M10 12h4'
};
function icon(name,cls=''){return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.book}"/></svg>`;}
function ar(text,cls=''){return `<bdi lang="ar" dir="rtl" class="arabic ${cls}">${escape(state.settings.harakat?text:stripHarakat(text))}</bdi>`;}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));storageIssue='';}catch{storageIssue='Penyimpanan browser tidak tersedia atau penuh. Ekspor progres agar tidak hilang.';toast(storageIssue);}}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4500);}
function page(){return routes[location.hash.slice(1)]?location.hash.slice(1):'home';}
function go(route){if(page()===route){render();focusMain();}else location.hash=route;}
function focusMain(){$('#main')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
function optionList(map,current){return Object.entries(map).map(([k,v])=>`<option value="${escape(k)}" ${k===current?'selected':''}>${escape(typeof v==='string'?v:v.title)}</option>`).join('');}
function heading(kicker,title,desc){return `<div class="page-heading"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${desc}</p></div>`;}
function openQuestion(mode=session.mode,{review=false,reset=false}={}){
  if(reset)session.count=0;
  const old=session.q?.id;
  session.mode=mode;session.review=review;
  session.q=chooseQuestion({level:state.settings.level,mode,direction:session.direction,history:state.history,review,exclude:old});
  session.answer=mode==='ordering'?[]:mode==='irab'||mode==='sharaf'?{}:'';
  session.result=null;
  session.bank=shuffle(session.q.words.map((_,i)=>i));
  if(session.bank.every((id,i)=>id===i)&&session.bank.length>1)session.bank.push(session.bank.shift());
  session.choices=shuffle(session.q.options);
}

function home(){
 const s=stats(state);
 const skillRows=[['nahwu','Nahwu','Struktur & kedudukan'],['sharaf','Sharaf','Bentuk & pola kata'],['tarjamah','Tarjamah','Ketepatan makna']];
 return `${heading('RUANG BELAJAR ANDA',`Ahlan, ${escape(state.settings.name)}.`,`Sedikit demi sedikit, pahami bahasa Arab lebih dalam.`)}
 <div class="dashboard-grid">
   <section class="hero"><div class="hero-copy"><span class="pill light">${icon('leaf')} Belajar dengan memahami</span><h2>Dari kaidah,<br>menuju makna.</h2><p>Bedah strukturnya. Temukan maknanya.<br>Bangun pemahaman, satu kalimat setiap hari.</p><button class="btn cream" data-action="start" data-mode="ordering">Mulai latihan ${icon('arrow')}</button><span class="hero-note">Tanpa akun · Tanpa biaya layanan</span></div><div class="hero-art" aria-hidden="true"><div class="art-orbit"></div><div class="paper paper-back"></div><div class="paper paper-front"><span class="mini-label">قَوَاعِدُ وَتَرْجَمَةٌ</span><div class="paper-word">عِلْمٌ</div><div class="paper-line"></div><div class="paper-line short"></div><span class="paper-caption">ilmu · pemahaman</span></div><div class="art-seal">${icon('book')}</div></div></section>
   <section class="panel mastery"><div class="section-top"><h2>Peta pemahaman</h2>${icon('target')}</div><p class="muted small">Akurasi jawaban pertama yang dinilai</p>${skillRows.map(([key,name,note])=>`<div class="skill-row"><div><strong>${name}</strong><span>${s.skills[key]}%</span></div><div class="meter" role="meter" aria-label="${name}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.skills[key]}"><span style="width:${s.skills[key]}%"></span></div><small>${note}</small></div>`).join('')}<p class="small muted">${s.unique?`${s.unique} bukti latihan. Angka ini bukan sertifikasi kemampuan.`:'Belum ada bukti latihan. Mulai untuk melihat progres Anda.'}</p></section>
 </div>
 <div class="stats-grid"><div class="stat">${icon('check')}<div><strong>${s.completed}</strong><span>Latihan diselesaikan</span></div></div><div class="stat">${icon('target')}<div><strong>${s.accuracy}<small>%</small></strong><span>Akurasi pertama</span></div></div><div class="stat">${icon('book')}<div><strong>${SENTENCES.length}</strong><span>Variasi kalimat</span></div></div></div>
 <div class="section-top spaced"><div><p class="eyebrow">PILIH CARA BELAJAR</p><h2>Satu bahasa, banyak sudut pandang.</h2></div><button class="link-button" data-action="review">Ulangi kesalahan ${icon('arrow')}</button></div>
 <div class="mode-grid">${Object.entries(MODES).map(([key,m],i)=>`<button class="mode-card" data-action="start" data-mode="${key}"><span class="mode-icon tone-${i}">${icon(m.icon)}</span><span class="mode-number">0${i+1}</span><h3>${m.title}</h3><p>${m.description}</p><span class="mode-bottom">Mulai belajar ${icon('arrow')}</span></button>`).join('')}</div>
 <section class="daily-card"><div><p class="eyebrow">KAIDAH PILIHAN</p><h2>Perubahan kecil, makna yang berbeda.</h2><p>Kenali perbedaan isim dan khabar pada <em>inna</em> dan <em>kana</em>.</p><a class="text-link" href="#lessons">Buka pustaka kaidah ${icon('arrow')}</a></div><div class="daily-ar">${ar('إِنَّ الطَّالِبَ مُجْتَهِدٌ')}<span>Sungguh, siswa itu rajin.</span></div></section>`;
}
function selectField(name,label,values,current){return `<label class="field">${label}<select data-answer="${name}" ${session.result?'disabled':''}><option value="">Pilih ${label.toLowerCase()}</option>${values.map(v=>`<option value="${escape(v)}" ${current===v?'selected':''}>${escape(v)}</option>`).join('')}</select></label>`;}
function exerciseBody(q){
 if(q.mode==='ordering')return `<div class="prompt-text"><span class="micro-label">TARGET MAKNA</span><p>${escape(q.translation)}</p></div><p>${escape(q.constraint)}</p><div class="answer-label"><strong>Jawaban Anda</strong><span>Kata pertama dimulai dari kanan</span></div><div class="word-tray selected" lang="ar" dir="rtl" aria-label="Urutan jawaban">${session.answer.length?session.answer.map((id,i)=>`<button class="word" data-action="remove-word" data-id="${id}" ${session.result?'disabled':''} aria-label="Kembalikan kata ${i+1}: ${escape(q.words[id])}">${ar(q.words[id])}</button>`).join(''):'<span class="tray-empty" lang="id" dir="ltr">Ketuk kata di bawah untuk menyusun kalimat</span>'}</div><div class="answer-label"><strong>Bank kata</strong><span>Ketuk kata terpilih untuk membatalkan</span></div><div class="word-tray" lang="ar" dir="rtl" aria-label="Bank kata">${session.bank.filter(id=>!session.answer.includes(id)).map(id=>`<button class="word" data-action="add-word" data-id="${id}" ${session.result?'disabled':''} aria-label="Pilih ${escape(q.words[id])}">${ar(q.words[id])}</button>`).join('')}</div>`;
 if(q.mode==='irab')return `<div class="sentence">${ar(q.ar)}</div><p>Analisis kata ${ar(q.words[q.focus.index],'inline-ar')} dalam kalimat di atas.</p><div class="fields-grid">${selectField('role','Kedudukan',ROLES,session.answer.role)}${selectField('status','Status',STATUSES,session.answer.status)}${selectField('sign','Tanda',SIGNS,session.answer.sign)}</div>`;
 if(q.mode==='sharaf')return `<div class="sentence">${ar(q.morphology.word)}</div><p>Tentukan akar dan wazan bentuk yang ditampilkan. Wazan ini memakai bentuk rujukan, bukan perubahan harakat karena kedudukan kalimat.</p><div class="fields-grid two">${selectField('root','Akar',ROOTS,session.answer.root)}${selectField('pattern','Wazan',PATTERNS,session.answer.pattern)}</div>`;
 const source=q.direction==='ar-id'?`<div class="sentence">${ar(q.ar)}</div>`:`<div class="prompt-text"><span class="micro-label">TERJEMAHKAN KE ARAB</span><p>${escape(q.translation)}</p></div>`;
 if(q.mode==='translation')return `${source}<fieldset class="choices"><legend>Pilih terjemahan yang paling sesuai.</legend>${session.choices.map((o,i)=>`<label class="choice ${session.answer===o.id?'chosen':''}"><input type="radio" name="translation" value="${o.id}" ${session.answer===o.id?'checked':''} ${session.result?'disabled':''}><span class="choice-letter">${String.fromCharCode(65+i)}</span><span>${q.direction==='id-ar'?ar(o.text):escape(o.text)}</span></label>`).join('')}</fieldset>`;
 return `${source}<label class="field" for="free-answer">Jawaban Anda<textarea id="free-answer" maxlength="4000" rows="4" ${q.direction==='id-ar'?'lang="ar" dir="rtl" class="arabic"':''} placeholder="${q.direction==='ar-id'?'Tuliskan terjemahan Indonesia Anda…':'اُكْتُبْ تَرْجَمَتَكَ هُنَا'}" ${session.result?'disabled':''}>${escape(session.answer)}</textarea></label><p class="small muted">Koreksi lokal mengenali variasi rujukan. Parafrasa lain tidak otomatis dinyatakan salah. ${q.direction==='id-ar'?'Harakat tidak diwajibkan pada latihan terjemahan ini.':''}</p>`;
}
function ready(){if(!session.q||session.result)return false;const m=session.q.mode,a=session.answer;return m==='ordering'?a.length===session.q.words.length:m==='irab'?!!(a.role&&a.status&&a.sign):m==='sharaf'?!!(a.root&&a.pattern):typeof a==='string'&&a.trim().length>0;}
function explanation(q,result){return `<section class="panel feedback" id="feedback" tabindex="-1" aria-labelledby="feedback-heading"><div class="feedback-heading"><div class="feedback-symbol ${result.score===100?'good':''}">${icon(result.score===100?'check':'book')}</div><div><p class="eyebrow">PEMBAHASAN KAIDAH</p><h2 id="feedback-heading">${result.status==='needs_review'?'Mari tinjau maknanya.':result.score===100?'Tepat. Sekarang pahami alasannya.':'Belum tepat seluruhnya. Mari bedah.'}</h2></div>${result.score!==null?`<span class="score">${result.score}<small>/100</small></span>`:'<span class="pill">Tanpa skor</span>'}</div><ul class="feedback-list">${result.feedback.map(f=>`<li>${escape(f)}</li>`).join('')}</ul><div class="reference"><span class="micro-label">KALIMAT RUJUKAN</span>${ar(q.ar)}<p>${escape(q.translation)}</p></div><div class="explain-grid"><div><h3>Alasan i’rab</h3><p>${ar(q.words[q.focus.index],'inline-ar')} — <strong>${escape(q.focus.role)}</strong>, ${escape(q.focus.status.toLowerCase())} dengan ${escape(q.focus.sign.toLowerCase())}.</p><p>${escape(q.focus.reason)}</p></div><div><h3>Alasan sharaf</h3><p>${ar(q.morphology.word,'inline-ar')} · akar ${ar(q.morphology.root,'inline-ar')} · wazan ${ar(q.morphology.pattern,'inline-ar')}</p><p>${escape(q.morphology.reason)}</p></div></div><details><summary>Alur penerjemahan dan catatan kaidah</summary><ol><li>Kenali struktur: ${escape(q.lessonData.title)}.</li><li>${escape(q.focus.reason)}</li><li>Pertahankan relasi makna saat menyusun bahasa target: “${escape(q.translation)}”.</li></ol><p>${escape(q.lessonData.note)}</p></details><div class="action-row"><button class="btn primary" data-action="next">Soal berikutnya ${icon('arrow')}</button><button class="btn secondary" data-action="retry">Coba soal ini lagi</button>${q.mode==='free'?'<button class="link-button" data-action="send-ai">Tinjau dengan AI lokal</button>':''}</div><p class="small muted">Mengulang soal yang sama tidak menambah bukti akurasi pertama.</p></section>`;}
function practice(){
 if(!session.q)openQuestion();const q=session.q;
 return `${heading('LATIHAN TERARAH',MODES[q.mode].title,'Pahami kaidahnya, kerjakan latihannya, lalu telusuri alasannya.')}<div class="practice-toolbar"><label class="field">Mode<select id="mode">${optionList(MODES,session.mode)}</select></label><label class="field">Level<select id="level">${optionList(LEVELS,state.settings.level)}</select></label>${['translation','free'].includes(q.mode)?`<label class="field">Arah<select id="direction">${optionList({'ar-id':'Arab → Indonesia','id-ar':'Indonesia → Arab'},session.direction)}</select></label>`:''}<label class="toggle"><input id="harakat" type="checkbox" ${state.settings.harakat?'checked':''}> Tampilkan harakat</label></div><div class="practice-layout"><div><section class="panel exercise"><div class="exercise-meta"><span class="pill">${escape(q.lessonData.title)}</span><span>Latihan ${session.count+(session.result?0:1)}${session.review?' · Ulasan':''}</span></div>${exerciseBody(q)}<div class="exercise-footer"><button class="btn primary" id="check" data-action="check" ${ready()?'':'disabled'}>Periksa jawaban ${icon('check')}</button><button class="btn secondary" data-action="reset-answer" ${session.result?'disabled':''}>Kosongkan</button><span class="small muted">${session.result?'Jawaban tersimpan':'Tidak ada batas waktu'}</span></div></section>${session.result?explanation(q,session.result):''}</div><aside class="panel learning-aside"><span class="mode-icon">${icon('book')}</span><p class="eyebrow">CARA BELAJAR</p><h2>Amati. Analisis.<br>Terjemahkan.</h2><ol><li>Baca instruksi dan tentukan struktur yang diminta.</li><li>Perhatikan bentuk kata serta harakat akhirnya.</li><li>Kerjakan dahulu, lalu baca pembahasan.</li></ol><div class="aside-note">${session.count} latihan selesai dalam sesi ini.</div><a href="#lessons" class="text-link">Buka kaidah ${icon('arrow')}</a></aside></div>`;
}
function lessons(){return `${heading('PUSTAKA KAIDAH','Rujukan kecil, pemahaman besar.','Baca aturan, perhatikan contoh, dan hubungkan dengan latihan.')}<label class="field search">Cari topik<input type="search" id="lesson-search" placeholder="Misalnya: kana, hal, pasif…"></label><div class="lesson-grid">${LESSONS.map(l=>`<article class="panel lesson" data-search="${escape((l.title+' '+l.body+' '+l.id).toLowerCase())}"><span class="pill">${LEVELS[l.level].split(' · ')[1]}</span><h2>${escape(l.title)}</h2>${ar(l.arabic,'lesson-ar')}<p>${escape(l.body)}</p><div class="lesson-example">${ar(l.example)}<p>${escape(l.translation)}</p></div><details><summary>Catatan penting</summary><p>${escape(l.note)}</p></details><button class="link-button" data-action="lesson-practice" data-lesson="${l.id}" data-level="${l.level}">Latihan terkait ${icon('arrow')}</button></article>`).join('')}</div><p id="no-lessons" hidden>Tidak ditemukan. Coba kata pencarian lain.</p>`;}
function history(){const rows=[...state.history].reverse();return `${heading('CATATAN BELAJAR','Setiap percobaan punya cerita.','Riwayat tersimpan di browser ini. Ekspor melalui Pengaturan untuk membuat cadangan.')}<div class="panel">${rows.length?`<div class="table-scroll"><table><thead><tr><th>Waktu</th><th>Latihan</th><th>Kalimat</th><th>Hasil</th><th>Tinjau</th></tr></thead><tbody>${rows.slice(0,100).map(h=>{const s=SENTENCES.find(x=>x.id===h.questionId);return `<tr><td>${new Date(h.at).toLocaleString('id-ID',{dateStyle:'short',timeStyle:'short'})}<small>${h.first?'Percobaan pertama':'Pengulangan'}</small></td><td>${MODES[h.mode].short}<small>${h.direction}</small></td><td>${ar(s.ar,'history-ar')}</td><td><span class="pill ${h.score===100?'success':''}">${h.score===null?'Perlu tinjauan':h.score+' / 100'}</span></td><td><button class="link-button" data-action="history-open" data-id="${escape(h.id)}">Buka</button></td></tr>`;}).join('')}</tbody></table></div><p class="small muted">Menampilkan ${Math.min(rows.length,100)} dari ${rows.length} percobaan terbaru. Backup mencakup maksimal 2.000 percobaan.</p>`:`<div class="empty-state">${icon('clock')}<h2>Halaman pertama masih kosong.</h2><p>Mulai satu latihan. Progres Anda akan muncul di sini.</p><button class="btn primary" data-action="start" data-mode="ordering">Mulai latihan</button></div>`}</div>`;}
function ai(){return `${heading('OPSIONAL · DI KOMPUTER SENDIRI','Studio AI lokal.','Saran belajar dari model lokal melalui Ollama. Tidak memerlukan API berbayar.')}<div class="notice ${aiAvailable?'positive':''}"><strong>${aiAvailable?'Server lokal terdeteksi.':'AI lokal belum tersedia di halaman ini.'}</strong><p>${aiAvailable?'Jalankan Ollama dan unduh model terlebih dahulu. Hasil AI adalah saran, tidak mengubah nilai atau progres.':'Fitur ini digunakan melalui http://localhost:4173 setelah menjalankan server.mjs. GitHub Pages hanya melayani aplikasi statis; AI tidak berjalan di server GitHub.'}</p></div><div class="panel"><div class="fields-grid two"><label class="field">Tugas<select id="ai-task" ${aiBusy?'disabled':''}>${optionList({evaluate:'Tinjau terjemahan Indonesia',generate:'Buat draf soal baru'},aiTask)}</select></label><label class="field">Contoh rujukan<select id="ai-question" ${aiBusy?'disabled':''}>${SENTENCES.map(s=>`<option value="${s.id}" ${s.id===aiQuestionId?'selected':''}>${escape(s.ar)}</option>`).join('')}</select></label></div><div class="sentence">${ar(SENTENCES.find(s=>s.id===aiQuestionId).ar)}</div>${aiTask==='evaluate'?`<label class="field">Terjemahan Anda<textarea id="ai-text" rows="4" maxlength="4000" ${aiBusy?'disabled':''}>${escape(aiText)}</textarea></label>`:'<p>AI akan menyusun satu contoh baru dengan kaidah yang sama. Draf tidak otomatis masuk bank soal karena perlu ditinjau pengajar.</p>'}<button class="btn primary" data-action="ask-ai" ${!aiAvailable||aiBusy?'disabled':''}>${icon('spark')} ${aiBusy?'Model sedang bekerja…':aiTask==='evaluate'?'Minta saran AI lokal':'Buat draf soal'}</button><p class="small muted">Pemrosesan dapat lambat tergantung RAM/CPU/GPU. Server menunggu maksimal 120 detik.</p>${aiError?`<p class="error" role="alert">${escape(aiError)}</p>`:''}${aiResult?`<section class="ai-output" aria-live="polite"><span class="pill">${aiTask==='generate'?'Draf · perlu review':'Saran · belum diverifikasi'}</span>${aiTask==='generate'?`${ar(aiResult.arabic)}<p><strong>Terjemahan:</strong> ${escape(aiResult.translation)}</p><p><strong>Pertanyaan:</strong> ${escape(aiResult.question)}</p><p><strong>Kunci:</strong> ${escape(aiResult.answer)}</p>`:`<h3>${escape(aiResult.verdict)}</h3><p><strong>Usulan terjemahan:</strong> ${escape(aiResult.corrected_answer)}</p><ul>${aiResult.feedback.map(x=>`<li>${escape(x)}</li>`).join('')}</ul>`}<p>${escape(aiResult.explanation)}</p></section>`:''}</div><details class="panel"><summary>Cara mengaktifkan</summary><ol><li>Instal Ollama dari ollama.com.</li><li>Di terminal, jalankan <code>ollama pull qwen2.5:7b</code>.</li><li>Pastikan Ollama aktif, kemudian jalankan <code>npm start</code> dari folder aplikasi.</li><li>Buka <code>http://localhost:4173/#ai</code>.</li></ol><p>Model diunduh sekali, sekitar 4,7 GB. Tidak ada tagihan API, tetapi Anda memakai perangkat, listrik, dan koneksi sendiri. Model tidak disertakan dalam ZIP. Lihat README untuk rincian.</p></details>`;}
function settings(){return `${heading('SESUAIKAN RUANG ANDA','Nyaman dibaca, mudah dilanjutkan.','Pengaturan dan progres disimpan hanya pada browser ini.')}<div class="settings-grid"><section class="panel"><h2>Preferensi belajar</h2><form id="settings-form"><label class="field">Nama panggilan<input name="name" maxlength="60" value="${escape(state.settings.name)}" required></label><label class="field">Level latihan<select name="level">${optionList(LEVELS,state.settings.level)}</select></label><label class="field">Ukuran huruf Arab<select name="fontSize">${optionList({'28':'Nyaman · 28 px','32':'Besar · 32 px','38':'Sangat besar · 38 px'},String(state.settings.fontSize))}</select></label><label class="field">Tema<select name="theme">${optionList({light:'Terang',dark:'Gelap'},state.settings.theme)}</select></label><button class="btn primary" type="submit">Simpan pengaturan</button></form><div class="sentence">${ar('الْعِلْمُ نُورٌ')}</div></section><section class="panel"><h2>Cadangan & privasi</h2><p>Tidak ada akun, pelacak, database cloud, atau sinkronisasi otomatis. Menghapus data browser dapat menghapus progres.</p><div class="vertical-actions"><button class="btn secondary" data-action="export">${icon('download')} Ekspor progres JSON</button><label class="btn secondary file-button">Impor cadangan<input type="file" id="import" accept="application/json,.json"></label><button class="link-button danger" data-action="clear">Hapus progres pada browser ini</button></div><hr><h3>Pasang di HP</h3><p>Buka URL HTTPS aplikasi di Chrome Android, kemudian pilih menu <strong>Instal aplikasi</strong> atau <strong>Tambahkan ke layar utama</strong>. Opsi yang muncul bergantung browser.</p><button class="btn primary" data-action="install">${icon('download')} Pasang PWA</button><hr><h3>Ruang lingkup versi gratis</h3><p>Seluruh latihan utama berjalan lokal. Kunci ada di perangkat agar dapat dipakai offline, sehingga aplikasi ini cocok untuk belajar mandiri, bukan ujian dengan pengawasan.</p><p>Hosting statis GitHub Pages memakai paket gratis dan batas penggunaannya. Distribusi melalui Google Play tidak termasuk jalur tanpa biaya.</p></section></div>`;}

function render(){
 const route=page();document.documentElement.dataset.theme=state.settings.theme;
 document.documentElement.style.setProperty('--arabic-size',state.settings.fontSize+'px');
 document.title=`${routes[route]} · Qawaid Studio`;
 const navIcons={home:'home',practice:'layers',lessons:'book',history:'clock',ai:'spark',settings:'settings'};
 $('#app').innerHTML=`<aside class="sidebar"><a class="brand" href="#home"><span class="brand-mark">${icon('book')}</span><span>qawaid<span class="brand-sub">STUDIO</span></span></a><span class="nav-label">RUANG BELAJAR</span><nav aria-label="Navigasi utama">${Object.entries(routes).map(([key,label])=>`<a href="#${key}" ${route===key?'aria-current="page"':''}>${icon(navIcons[key])}<span>${label}</span>${route===key?'<i></i>':''}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="offline-tag"><span class="status-dot"></span><span id="connection-label">${navigator.onLine?'Siap belajar':'Mode offline'}</span></div><p>Belajar mandiri.<br>Tanpa biaya layanan.</p><small>Qawaid Studio · 1.0</small></div></aside><div class="workspace"><header class="topbar"><div class="breadcrumb">Ruang belajar <span>/</span> <strong>${routes[route]}</strong></div><div class="top-actions"><span class="level-chip">${escape(LEVELS[state.settings.level].split(' · ')[1])}</span><button class="icon-button" data-action="theme" aria-label="Ganti tema">${icon('sun')}</button><span class="avatar" aria-label="Profil">${escape(state.settings.name.slice(0,1).toUpperCase()||'P')}</span></div></header><main id="main" tabindex="-1">${storageIssue?`<p class="notice" role="alert">${escape(storageIssue)}</p>`:''}${({home,practice,lessons,history,ai,settings}[route])()}</main><footer class="footer"><span>Qawa’id wa Tarjamah</span><span>Memahami struktur. Menjaga makna.</span></footer></div>`;
}

function resetAnswer(){session.answer=session.q.mode==='ordering'?[]:['irab','sharaf'].includes(session.q.mode)?{}:'';session.result=null;render();}
function showHistory(id){const h=state.history.find(x=>x.id===id);if(!h)return;state.settings.level=SENTENCES.find(x=>x.id===h.questionId).level;session.mode=h.mode;session.direction=h.direction;session.q=question(h.questionId,h.mode,h.direction);try{session.answer=['ordering','irab','sharaf'].includes(h.mode)?JSON.parse(h.answer):h.answer;}catch{session.answer=h.answer;}session.result=grade(session.q,session.answer);session.bank=shuffle(session.q.words.map((_,i)=>i));session.choices=shuffle(session.q.options);go('practice');}
async function askAI(){
 if(aiBusy||!aiAvailable)return;
 if(aiTask==='evaluate'&&!aiText.trim()){toast('Tuliskan terjemahan dahulu.');return;}
 aiBusy=true;aiError='';aiResult=null;render();
 try {
  const res=await fetch('./api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:aiTask,questionId:aiQuestionId,answer:aiText}),signal:AbortSignal.timeout(125000)});
  const data=await res.json();if(!res.ok)throw new Error(data.error||'AI belum tersedia.');
  aiResult=data.result;
 }catch(e){aiError=e.name==='TimeoutError'?'Waktu tunggu habis. Model mungkin terlalu berat untuk perangkat ini.':e.message;}
 finally{aiBusy=false;if(page()==='ai')render();}
}

document.addEventListener('click',async e=>{
 const el=e.target.closest('[data-action]');if(!el||el.disabled)return;
 const action=el.dataset.action;
 if(action==='theme'){state.settings.theme=state.settings.theme==='light'?'dark':'light';save();render();}
 if(action==='start'){openQuestion(el.dataset.mode,{reset:true});go('practice');}
 if(action==='review'){openQuestion('irab',{review:true,reset:true});go('practice');toast('Soal keliru diprioritaskan; jika belum ada, tampil soal baru.');}
 if(action==='add-word'){const id=Number(el.dataset.id);if(session.result||session.answer.includes(id))return;session.answer.push(id);render();$('.word-tray:not(.selected) button')?.focus();toast('Kata ditambahkan.');}
 if(action==='remove-word'){if(session.result)return;session.answer=session.answer.filter(id=>id!==Number(el.dataset.id));render();$('.word-tray.selected button')?.focus();toast('Kata dikembalikan ke bank.');}
 if(action==='reset-answer')resetAnswer();
 if(action==='check'&&ready()){
  session.result=grade(session.q,session.answer);state=addAttempt(state,session.q,session.answer,session.result);save();session.count++;render();$('#feedback')?.focus();
 }
 if(action==='next'){openQuestion(session.mode,{review:session.review});render();focusMain();}
 if(action==='retry'){resetAnswer();toast('Pengulangan untuk belajar; akurasi pertama tetap.');}
 if(action==='lesson-practice'){
  state.settings.level=el.dataset.level;const ref=SENTENCES.find(s=>s.lesson===el.dataset.lesson)||(el.dataset.lesson==='sharaf'?SENTENCES[0]:null);
  openQuestion(el.dataset.lesson==='sharaf'?'sharaf':'irab',{reset:true});if(ref)session.q=question(ref.id,session.mode);save();go('practice');
 }
 if(action==='history-open')showHistory(el.dataset.id);
 if(action==='send-ai'){
  if(aiBusy){toast('Tunggu permintaan AI sebelumnya selesai.');return;}
  if(session.direction!=='ar-id'){toast('Studio AI saat ini meninjau Arab → Indonesia.');return;}
  aiTask='evaluate';aiQuestionId=session.q.id;aiText=session.answer;aiResult=null;go('ai');
 }
 if(action==='ask-ai')await askAI();
 if(action==='export'){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='qawaid-progres-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('Cadangan diunduh.');
 }
 if(action==='clear'&&confirm('Hapus seluruh riwayat latihan di browser ini? Ekspor dahulu jika perlu.')){state.history=[];save();session.q=null;render();toast('Riwayat latihan dihapus.');}
 if(action==='install'){
  if(deferredInstall){await deferredInstall.prompt();deferredInstall=null;}
  else toast('Gunakan menu browser → Instal aplikasi / Tambahkan ke layar utama. Pastikan URL HTTPS dan aplikasi sudah dimuat.');
 }
});
document.addEventListener('input',e=>{
 if(e.target.id==='free-answer')session.answer=e.target.value;
 if(e.target.id==='ai-text')aiText=e.target.value;
 if(e.target.id==='lesson-search'){
  let visible=0;const term=e.target.value.toLocaleLowerCase('id');
  document.querySelectorAll('.lesson').forEach(el=>{el.hidden=!el.dataset.search.includes(term);if(!el.hidden)visible++;});$('#no-lessons').hidden=visible>0;
 }
 const button=$('#check');if(button)button.disabled=!ready();
});
document.addEventListener('change',async e=>{
 const el=e.target;
 if(el.id==='mode'){openQuestion(el.value,{reset:true});render();}
 if(el.id==='level'){state.settings.level=el.value;save();openQuestion(session.mode,{reset:true});render();}
 if(el.id==='direction'){session.direction=el.value;openQuestion(session.mode,{reset:true});render();}
 if(el.id==='harakat'){state.settings.harakat=el.checked;save();render();}
 if(el.dataset.answer){session.answer[el.dataset.answer]=el.value;$('#check').disabled=!ready();}
 if(el.name==='translation'){session.answer=el.value;document.querySelectorAll('.choice').forEach(label=>label.classList.toggle('chosen',label.contains(el)));$('#check').disabled=!ready();}
 if(el.id==='ai-task'){aiTask=el.value;aiResult=null;aiError='';render();}
 if(el.id==='ai-question'){aiQuestionId=el.value;aiResult=null;render();}
 if(el.id==='import'&&el.files?.[0]){
  try{if(el.files[0].size>3_000_000)throw new Error('Batas cadangan adalah 3 MB.');const imported=validateState(JSON.parse(await el.files[0].text()));if(confirm('Ganti progres dan pengaturan sekarang dengan cadangan ini?')){state=imported;session.q=null;save();render();toast('Cadangan berhasil diimpor.');}}
  catch(error){toast(error.message||'Cadangan tidak dapat dibaca.');}finally{el.value='';}
 }
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='settings-form')return;e.preventDefault();const form=new FormData(e.target);
 const previous=state.settings.level;
 state.settings={...state.settings,name:String(form.get('name')).trim()||'Pembelajar',level:String(form.get('level')),fontSize:Number(form.get('fontSize')),theme:String(form.get('theme'))};
 if(previous!==state.settings.level)session.q=null;save();render();toast('Pengaturan disimpan.');
});
window.addEventListener('hashchange',()=>{render();focusMain();});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;});
for(const event of ['online','offline'])window.addEventListener(event,()=>{const el=$('#connection-label');if(el)el.textContent=navigator.onLine?'Siap belajar':'Mode offline';toast(navigator.onLine?'Koneksi tersedia.':'Offline. Latihan yang sudah tersimpan tetap dapat dibuka.');});
render();
if(['localhost','127.0.0.1'].includes(location.hostname))fetch('./api/health').then(r=>r.ok?r.json():null).then(data=>{aiAvailable=data?.localAI===true;if(page()==='ai')render();}).catch(()=>{});
if('serviceWorker' in navigator && (location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname))){
 navigator.serviceWorker.register('./sw.js').then(reg=>{
  if(reg.waiting)toast('Pembaruan siap. Tutup semua tab aplikasi, lalu buka kembali.');
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')toast(navigator.serviceWorker.controller?'Pembaruan siap setelah seluruh tab ditutup.':'Aplikasi siap digunakan offline.');});});
 }).catch(()=>toast('Penyimpanan offline belum aktif. Coba muat ulang saat terhubung.'));
}
