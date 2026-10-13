import http from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {runAI} from './lib/ai.mjs';
import {SENTENCES} from './docs/data.js';

const ROOT=fileURLToPath(new URL('./docs/',import.meta.url));
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const CSP="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
export function createServer({evaluate=runAI}={}){
 let busy=false;let requestTimes=[];
 return http.createServer(async(req,res)=>{
  const port=req.socket.localPort;
  const hosts=new Set([`localhost:${port}`,`127.0.0.1:${port}`]);
  const json=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',CSP);
  if(!hosts.has(req.headers.host))return json(403,{error:'Server ini hanya menerima host localhost.'});
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return json(400,{error:'URL tidak valid.'});}
  if(pathname==='/api/health'&&req.method==='GET')return json(200,{ok:true,localAI:true});
  if(pathname==='/api/ai'){
   if(req.method!=='POST')return json(405,{error:'Gunakan POST.'});
   if(req.headers.origin!==`http://${req.headers.host}`)return json(403,{error:'Origin harus sama dengan aplikasi lokal.'});
   if(!req.headers['content-type']?.startsWith('application/json'))return json(415,{error:'Gunakan application/json.'});
   if(Number(req.headers['content-length']||0)>20000)return json(413,{error:'Payload terlalu besar.'});
   if(busy)return json(429,{error:'Satu permintaan AI masih berjalan. Tunggu sampai selesai.'});
   requestTimes=requestTimes.filter(t=>Date.now()-t<60000);
   if(requestTimes.length>=6)return json(429,{error:'Batas lokal 6 permintaan per menit. Coba sebentar lagi.'});
   let payload;
   try{let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>20000)throw new Error('too big');}payload=JSON.parse(body);}catch{return json(400,{error:'JSON tidak valid atau terlalu besar.'});}
   if(!payload||!['evaluate','generate'].includes(payload.task)||!SENTENCES.some(s=>s.id===payload.questionId)||typeof payload.answer!=='string'||payload.answer.length>4000||(payload.task==='evaluate'&&!payload.answer.trim()))return json(400,{error:'Input tugas, soal, atau jawaban tidak valid.'});
   busy=true;requestTimes.push(Date.now());
   try{const result=await evaluate(payload);return json(200,{result,verified:false});}
   catch(error){return json(503,{error:error.name==='TimeoutError'?'Waktu tunggu model habis. Coba model lebih kecil.':error.message==='fetch failed'?'Ollama belum aktif. Buka aplikasi Ollama dan unduh model terlebih dahulu.':error.message});}
   finally{busy=false;}
  }
  if(!['GET','HEAD'].includes(req.method))return json(405,{error:'Metode tidak didukung.'});
  if(pathname.includes('\\')||pathname.split('/').some(p=>p==='..'||p.startsWith('.')))return json(403,{error:'Path tidak diizinkan.'});
  if(pathname==='/')pathname='/index.html';
  try{
   const target=await realpath(path.join(ROOT,pathname));
   if(!target.startsWith(path.resolve(ROOT)+path.sep))return json(403,{error:'Path tidak diizinkan.'});
   const mime=MIME[path.extname(target)];if(!mime)return json(403,{error:'Jenis file tidak diizinkan.'});
   const data=await readFile(target);res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-cache','Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);
  }catch{return json(404,{error:'Halaman tidak ditemukan.'});}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||4173);
 if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PORT harus angka 1024–65535.');
 const server=createServer();
 server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} sedang dipakai. Tutup proses lama atau ganti PORT.`:error.message);process.exitCode=1;});
 server.listen(port,'127.0.0.1',()=>console.log(`Qawaid Studio siap: http://localhost:${port}\nTidak perlu npm install. Tekan Ctrl+C untuk berhenti.\nAI lokal opsional: buka Ollama dan unduh qwen2.5:7b.`));
}
