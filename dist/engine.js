import { SENTENCES, LESSONS, LEVELS, MODES, ROLES, STATUSES, SIGNS, ROOTS, PATTERNS } from './data.js';

export const stripHarakat = value => value.normalize('NFC').replace(/[\u064b-\u0652\u0670]/gu,'');
export const normalizeID = value => value.normalize('NFC').toLocaleLowerCase('id').replace(/[.,!?;:“”"()]/g,' ').replace(/\s+/g,' ').trim();
export const normalizeAR = value => stripHarakat(value).replace(/[،؛.!؟]/g,' ').replace(/\s+/g,' ').trim();
export function shuffle(values, random=Math.random) {
  const copy=[...values];
  for (let i=copy.length-1;i>0;i--) {const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}
export function question(id,mode,direction='ar-id') {
  const s=SENTENCES.find(x=>x.id===id);
  if (!s || !MODES[mode] || !['ar-id','id-ar'].includes(direction)) throw new Error('Soal tidak dikenal');
  if(!['translation','free'].includes(mode))direction='ar-id';
  const options=direction==='ar-id' ? [s.translation,...s.distractors] :
    [s.ar,...SENTENCES.filter(x=>x.level===s.level&&x.ar!==s.ar).slice(0,2).map(x=>x.ar)];
  return {...s,mode,direction,key:`${id}/${mode}/${direction}`,options:options.map((text,i)=>({id:String(i),text})),lessonData:LESSONS.find(x=>x.id===s.lesson)};
}
export function chooseQuestion({level,mode,direction='ar-id',history=[],review=false,exclude=null,random=Math.random}) {
  if(!['translation','free'].includes(mode))direction='ar-id';
  let pool=SENTENCES.filter(s=>s.level===level&&s.id!==exclude);
  if (!pool.length) pool=SENTENCES.filter(s=>s.level===level);
  if (!pool.length) throw new Error('Level tidak dikenal');
  const latest=new Map();
  for (const h of history) if(h.mode===mode&&h.direction===direction) latest.set(h.questionId,h);
  if (review) {
    const weak=pool.filter(s=>{const h=latest.get(s.id);return h&&h.status==='evaluated'&&h.score<100;});
    if (weak.length) pool=weak;
  }
  const unseen=pool.filter(s=>!latest.has(s.id));
  if(unseen.length)pool=unseen;
  return question(pool[Math.floor(random()*pool.length)].id,mode,direction);
}
export function grade(q,answer) {
  const feedback=[]; let score=0;
  if(q.mode==='ordering') {
    const ids=Array.isArray(answer)?answer:[];
    const actual=ids.map(i=>q.words[i]);
    const valid=ids.length===q.words.length&&new Set(ids).size===ids.length&&ids.every(i=>Number.isInteger(i)&&i>=0&&i<q.words.length);
    const correct=valid&&q.words.every((w,i)=>actual[i]===w);
    score=correct?100:0;
    if(!correct){const i=q.words.findIndex((w,n)=>actual[n]!==w);feedback.push(`Pada posisi ${i+1} pola tugas meminta ${q.words[i]}. Urutan Anda belum memenuhi pola yang ditentukan; susunan Arab lain tidak otomatis salah secara gramatikal.`);}
  } else if(q.mode==='irab'||q.mode==='sharaf') {
    const fields=q.mode==='irab'?['role','status','sign']:['root','pattern'];
    const labels={role:'Kedudukan',status:'Status',sign:'Tanda',root:'Akar',pattern:'Wazan'};
    const ref=q.mode==='irab'?q.focus:q.morphology;
    let hits=0;
    for(const f of fields) {if(answer?.[f]===ref[f])hits++; else feedback.push(`${labels[f]}: jawaban yang sesuai ialah ${ref[f]}.`);}
    score=Math.round(hits/fields.length*100);
  } else if(q.mode==='translation') {
    score=answer==='0'?100:0;
    if(score===0)feedback.push('Pilihan ini belum mempertahankan makna kalimat rujukan. Periksa pelaku, negasi, dan keterangan waktunya.');
  } else {
    if(typeof answer!=='string'||!answer.trim())return {status:'invalid',score:null,feedback:['Tulis jawaban terlebih dahulu.']};
    const normalize=q.direction==='ar-id'?normalizeID:normalizeAR;
    const refs=q.direction==='ar-id'?q.variants:[q.ar];
    if(!refs.some(r=>normalize(r)===normalize(answer)))return {status:'needs_review',score:null,feedback:['Jawaban ini belum cocok dengan variasi rujukan lokal. Itu bukan berarti salah. Bandingkan makna di bawah atau gunakan AI lokal untuk saran; sistem tidak memberi skor otomatis pada parafrasa yang belum dikenali.']};
    score=100;
  }
  if(score===100)feedback.push('Jawaban sesuai dengan kunci dan batas latihan.');
  return {status:'evaluated',score,feedback};
}
export const DEFAULT_STATE=()=>({schemaVersion:1,settings:{name:'Pembelajar',level:'mutaqaddim',theme:'light',harakat:true,fontSize:32},history:[]});
export function validateState(raw) {
  if(!raw||raw.schemaVersion!==1||!raw.settings||!Array.isArray(raw.history)||raw.history.length>2000)throw new Error('Format backup tidak didukung.');
  const s=raw.settings;
  if(typeof s.name!=='string'||s.name.length>60||!LEVELS[s.level]||!['light','dark'].includes(s.theme)||typeof s.harakat!=='boolean'||![28,32,38].includes(s.fontSize))throw new Error('Pengaturan backup tidak valid.');
  const ids=new Set();
  const history=raw.history.map(h=>{
    if(!h||typeof h.id!=='string'||h.id.length>100||ids.has(h.id)||!SENTENCES.some(s=>s.id===h.questionId)||!MODES[h.mode]||!['ar-id','id-ar'].includes(h.direction)||!Number.isFinite(Date.parse(h.at))||!['evaluated','needs_review'].includes(h.status)||typeof h.first!=='boolean')throw new Error('Riwayat backup tidak valid.');
    if(h.status==='evaluated'&&(!Number.isInteger(h.score)||h.score<0||h.score>100)||h.status==='needs_review'&&h.score!==null)throw new Error('Skor backup tidak valid.');
    if(typeof h.answer!=='string'||h.answer.length>4000)throw new Error('Jawaban backup terlalu panjang.');
    if(['ordering','irab','sharaf'].includes(h.mode)){
      let parsed;try{parsed=JSON.parse(h.answer);}catch{throw new Error('Struktur jawaban backup tidak valid.');}
      const sentence=SENTENCES.find(s=>s.id===h.questionId);
      if(h.direction!=='ar-id')throw new Error('Arah soal non-terjemahan tidak valid.');
      if(h.mode==='ordering'){
        if(!Array.isArray(parsed)||parsed.length!==sentence.words.length||new Set(parsed).size!==parsed.length||!parsed.every(i=>Number.isInteger(i)&&i>=0&&i<sentence.words.length))throw new Error('Token backup tidak valid.');
      }else{
        const choices=h.mode==='irab'?{role:ROLES,status:STATUSES,sign:SIGNS}:{root:ROOTS,pattern:PATTERNS};
        if(!parsed||Array.isArray(parsed)||Object.keys(parsed).length!==Object.keys(choices).length||!Object.entries(choices).every(([key,list])=>list.includes(parsed[key])))throw new Error('Analisis backup tidak valid.');
      }
    }
    if(h.mode==='translation'&&!['0','1','2'].includes(h.answer))throw new Error('Pilihan backup tidak valid.');
    ids.add(h.id);
    return {id:h.id,questionId:h.questionId,mode:h.mode,direction:h.direction,at:h.at,status:h.status,score:h.score,first:h.first,answer:h.answer};
  });
  return {schemaVersion:1,settings:{name:s.name,level:s.level,theme:s.theme,harakat:s.harakat,fontSize:s.fontSize},history};
}
export function addAttempt(state,q,answer,result,now=new Date()) {
  if(!['evaluated','needs_review'].includes(result.status))return state;
  const key=h=>`${h.questionId}/${h.mode}/${h.direction}`;
  const first=!state.history.some(h=>key(h)===q.key);
  const answerText=typeof answer==='string'?answer:JSON.stringify(answer);
  const id=globalThis.crypto?.randomUUID?.()??`${now.getTime()}-${Math.random()}`;
  return {...state,history:[...state.history,{id,questionId:q.id,mode:q.mode,direction:q.direction,at:now.toISOString(),status:result.status,score:result.score,first,answer:answerText}].slice(-2000)};
}
export function stats(state) {
  const attempts=state.history.filter(h=>h.first&&h.status==='evaluated');
  const average=items=>items.length?Math.round(items.reduce((n,h)=>n+h.score,0)/items.length):0;
  return {completed:state.history.length,unique:attempts.length,accuracy:average(attempts),pending:state.history.filter(h=>h.status==='needs_review').length,
    skills:{nahwu:average(attempts.filter(h=>['ordering','irab'].includes(h.mode))),sharaf:average(attempts.filter(h=>h.mode==='sharaf')),tarjamah:average(attempts.filter(h=>['translation','free'].includes(h.mode)))}};
}
