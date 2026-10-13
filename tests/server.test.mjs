import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createServer} from '../server.mjs';
import {readFile,access} from 'node:fs/promises';

async function withServer(callback){
 const server=createServer({evaluate:async()=>({verdict:'Perlu tinjauan',corrected_answer:'contoh',feedback:['Periksa konteks.'],explanation:'Uji transport, bukan model nyata.'})});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{await callback(base);}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
}
test('HTTP menyajikan halaman, JS modules dan ikon dengan MIME benar',async()=>withServer(async base=>{
 for(const [path,type] of [['/','text/html'],['/app.js','text/javascript'],['/manifest.webmanifest','application/manifest+json'],['/icons/icon-192.png','image/png'],['/sw.js','text/javascript']]){const r=await fetch(base+path);assert.equal(r.status,200,path);assert(r.headers.get('content-type').startsWith(type));}
 assert.equal((await fetch(base+'/missing')).status,404);
 assert.equal((await fetch(base+'/server.mjs')).status,404);
 const head=await fetch(base+'/app.js',{method:'HEAD'});assert.equal(await head.text(),'');
}));
test('API menolak cross-origin dan tipe konten salah',async()=>withServer(async base=>{
 const body=JSON.stringify({task:'evaluate',questionId:'dasar-1',answer:'siswa'});
 assert.equal((await fetch(base+'/api/ai',{method:'POST',headers:{Origin:'https://evil.invalid','Content-Type':'application/json'},body})).status,403);
 assert.equal((await fetch(base+'/api/ai',{method:'POST',headers:{Origin:base,'Content-Type':'text/plain'},body})).status,415);
 assert.equal((await fetch(base+'/api/ai',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:'{'})).status,400);
}));
test('API lokal berhasil melalui same origin dan menandai hasil belum diverifikasi',async()=>withServer(async base=>{
 const r=await fetch(base+'/api/ai',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({task:'evaluate',questionId:'dasar-1',answer:'siswa itu membaca buku itu'})});assert.equal(r.status,200);assert.equal((await r.json()).verified,false);
}));
test('host palsu ditolak untuk mengurangi risiko DNS rebinding',async()=>withServer(async base=>{
 const code=await new Promise((resolve,reject)=>{http.get(base,{headers:{Host:'evil.invalid'}},r=>{r.resume();resolve(r.statusCode);}).on('error',reject);});assert.equal(code,403);
}));
test('traversal terenkode tidak membuka file di luar docs',async()=>withServer(async base=>{
 const code=await new Promise((resolve,reject)=>{http.get(base+'/%2e%2e%2fserver.mjs',r=>{r.resume();resolve(r.statusCode);}).on('error',reject);});assert.equal(code,403);
}));
test('semua asset precache tersedia, path manifest relatif aman untuk subfolder repo',async()=>{
 const base=new URL('../docs/',import.meta.url);const sw=await readFile(new URL('sw.js',base),'utf8');
 const list=sw.match(/const ASSETS=\[(.*?)\];/s)[1].match(/'[^']+'/g).map(s=>s.slice(1,-1));
 for(const item of list)await access(new URL(item,base));
 const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',base),'utf8'));assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');for(const icon of manifest.icons)await access(new URL(icon.src,base));
});
