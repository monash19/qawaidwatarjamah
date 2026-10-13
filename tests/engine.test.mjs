import test from 'node:test';
import assert from 'node:assert/strict';
import {SENTENCES,LESSONS,LEVELS,MODES} from '../docs/data.js';
import {question,grade,stripHarakat,normalizeAR,normalizeID,DEFAULT_STATE,validateState,addAttempt,stats,chooseQuestion,shuffle} from '../docs/engine.js';

test('bank soal unik, konteks lengkap, semua level terwakili',()=>{
 assert(SENTENCES.length>=42);assert.equal(new Set(SENTENCES.map(s=>s.id)).size,SENTENCES.length);
 for(const s of SENTENCES){assert(LEVELS[s.level]);assert(LESSONS.some(l=>l.id===s.lesson));assert(s.words[s.focus.index]);assert(s.focus.reason);assert(s.morphology.root);assert.equal(s.ar,s.words.join(' '));assert.equal(s.distractors.length,2);assert(!s.distractors.includes(s.translation));}
 for(const level of Object.keys(LEVELS))assert(SENTENCES.some(s=>s.level===level));
});
test('semua soal dan mode menerima kunci yang benar',()=>{
 for(const s of SENTENCES)for(const mode of Object.keys(MODES))for(const direction of ['ar-id','id-ar']){
  const q=question(s.id,mode,direction);
  const answer=mode==='ordering'?q.words.map((_,i)=>i):mode==='irab'?q.focus:mode==='sharaf'?q.morphology:mode==='translation'?'0':direction==='ar-id'?q.translation:q.ar;
  const result=grade(q,answer);assert.equal(result.status,'evaluated',q.key);assert.equal(result.score,100,q.key);
 }
});
test('ordering menolak token hilang, ganda, tak dikenal dan urutan keliru',()=>{
 const q=question('dasar-1','ordering');
 for(const bad of [[0,0,2],[0,1],[2,1,0],[0,1,99],['0',1,2]])assert.equal(grade(q,bad).score,0);
});
test('kata identik dinilai berdasarkan bentuk, bukan ID semata',()=>{
 const q={...question('dasar-1','ordering'),words:['هُوَ','هُوَ']};
 assert.equal(grade(q,[1,0]).score,100);
});
test('i’rab memberi koreksi khusus status yang salah',()=>{
 const q=question('lanjut-lam','irab');const result=grade(q,{...q.focus,status:'Marfu'});
 assert.equal(result.score,67);assert.deepEqual(result.feedback,['Status: jawaban yang sesuai ialah Majzum.']);
});
test('sharaf memberi kredit parsial dan tidak menyamakan akar dengan wazan',()=>{
 const q=question('dasar-1','sharaf');assert.equal(grade(q,{root:q.morphology.root,pattern:'مَفْعُول'}).score,50);
});
test('terjemahan pilihan yang salah tidak mendapat nilai',()=>assert.equal(grade(question('lanjut-hal','translation'),'2').score,0));
test('parafrasa tak terdaftar diberi needs_review bukan salah',()=>{
 const q=question('dasar-1','free');assert.equal(grade(q,'Sang pelajar sedang membaca sebuah buku.').status,'needs_review');assert.equal(grade(q,'Sang pelajar sedang membaca sebuah buku.').score,null);
});
test('sinonim yang disetujui dan tanda baca diterima',()=>{
 const q=question('dasar-1','free');assert.equal(grade(q,'Murid itu membaca buku itu!').score,100);assert.equal(normalizeID('  SISWA itu. '),'siswa itu');
});
test('jawaban kosong tidak menjadi attempt',()=>{
 const q=question('dasar-1','free');const result=grade(q,'  ');assert.equal(result.status,'invalid');assert.equal(addAttempt(DEFAULT_STATE(),q,'',result).history.length,0);
});
test('normalisasi harakat mempertahankan hamzah, ta marbuthah dan alif maqsurah',()=>{
 assert.equal(stripHarakat('قَرَأَ'),'قرأ');assert.equal(normalizeAR('مَدْرَسَةٌ'),'مدرسة');assert.equal(normalizeAR('عَلَى'),'على');assert.notEqual(normalizeAR('قرأ'),normalizeAR('قرا'));
});
test('pengulangan setelah kunci tidak mengubah akurasi pertama',()=>{
 const q=question('dasar-1','ordering');let s=DEFAULT_STATE();s=addAttempt(s,q,[2,1,0],grade(q,[2,1,0]));s=addAttempt(s,q,[0,1,2],grade(q,[0,1,2]));assert.equal(s.history[1].first,false);assert.equal(stats(s).accuracy,0);assert.equal(stats(s).completed,2);
});
test('status needs_review tidak masuk akurasi',()=>{
 const q=question('dasar-1','free');const s=addAttempt(DEFAULT_STATE(),q,'parafrasa baru',grade(q,'parafrasa baru'));assert.equal(stats(s).unique,0);assert.equal(stats(s).pending,1);
});
test('mode non-terjemahan tidak mempunyai dua kunci progres arah bahasa',()=>assert.equal(question('dasar-1','irab','id-ar').key,question('dasar-1','irab','ar-id').key));
test('pemilihan adaptif memprioritaskan kesalahan dalam mode dan level',()=>{
 const q=question('lanjut-hal','irab');const s=addAttempt(DEFAULT_STATE(),q,{},grade(q,{}));
 const next=chooseQuestion({level:'mutaqaddim',mode:'irab',history:s.history,review:true,random:()=>0});assert.equal(next.id,q.id);
});
test('pemilihan soal menghindari pengulangan segera jika tersedia',()=>{
 const q=chooseQuestion({level:'mutaqaddim',mode:'ordering',exclude:'lanjut-hal',random:()=>0});assert.notEqual(q.id,'lanjut-hal');
});
test('shuffle mempertahankan semua token',()=>assert.deepEqual(shuffle([0,1,2,3],()=>.1).sort(),[0,1,2,3]));
test('backup roundtrip dan penolakan input rusak',()=>{
 const q=question('dasar-1','ordering');const state=addAttempt(DEFAULT_STATE(),q,[0,1,2],grade(q,[0,1,2]));assert.deepEqual(validateState(JSON.parse(JSON.stringify(state))),state);
 for(const patch of [{schemaVersion:99},{history:{}},{settings:{...state.settings,theme:'url(javascript:evil)'}},{history:[{...state.history[0],score:NaN}]},{history:[{...state.history[0],questionId:'unknown'}]},{history:[state.history[0],state.history[0]]},{history:[{...state.history[0],answer:'{}'}]}])assert.throws(()=>validateState({...state,...patch}));
});
