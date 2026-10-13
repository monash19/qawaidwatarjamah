// Unit smoke dengan DOM minimal, bukan pengganti pemeriksaan browser/layout.
import test from 'node:test';
import assert from 'node:assert/strict';

test('modul UI merender seluruh halaman, mode latihan dan tema',async()=>{
 const events={},windowEvents={},elements=new Map();
 const el=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',disabled:false,hidden:false,classList:{add(){},remove(){},toggle(){}},focus(){},style:{setProperty(){}}});return elements.get(id);};
 globalThis.document={title:'',documentElement:{dataset:{},style:{setProperty(){}}},querySelector:selector=>el(selector),querySelectorAll:()=>[],addEventListener:(name,fn)=>events[name]=fn};
 globalThis.location={href:'https://example.invalid/qawaid/',hash:'',hostname:'example.invalid',protocol:'https:'};
 globalThis.window={addEventListener:(name,fn)=>windowEvents[name]=fn,scrollTo(){}};
 Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
 const stored=new Map();globalThis.localStorage={getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)};
 await import('../docs/app.js');
 assert(el('#app').innerHTML.includes('Dari kaidah,'));
 for(const route of ['practice','lessons','history','ai','settings','home']){
  location.hash='#'+route;windowEvents.hashchange();assert(el('#app').innerHTML.includes('id="main"'));assert(!el('#app').innerHTML.includes('undefined'));assert(!el('#app').innerHTML.includes('NaN'));
 }
 for(const mode of ['ordering','irab','sharaf','translation','free']){
  location.hash='#practice';await events.click({target:{closest:()=>({dataset:{action:'start',mode},disabled:false})}});
  assert(el('#app').innerHTML.includes('id="check"'));assert(!el('#app').innerHTML.includes('undefined'));
 }
 await events.click({target:{closest:()=>({dataset:{action:'theme'},disabled:false})}});
 assert.equal(document.documentElement.dataset.theme,'dark');assert.equal(stored.size,1);
});
