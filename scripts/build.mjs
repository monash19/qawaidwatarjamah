import {cp,mkdir,rm,readFile,access} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('docs/manifest.webmanifest',root),'utf8'));
for(const icon of manifest.icons)await access(new URL(icon.src,new URL('docs/',root)));
await rm(new URL('dist/',root),{recursive:true,force:true});
await mkdir(new URL('dist/',root),{recursive:true});
await cp(new URL('docs/',root),new URL('dist/',root),{recursive:true});
console.log('Build selesai. Folder dist siap untuk static hosting. Untuk GitHub Pages gunakan main /docs; tidak perlu build.');
