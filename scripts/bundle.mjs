import fs from 'node:fs';
const root=new URL('../',import.meta.url);const read=p=>fs.readFileSync(new URL(p,root),'utf8');const files={};
function walk(dir){for(const f of fs.readdirSync(new URL(dir,root),{withFileTypes:true})){const p=dir+'/'+f.name;if(f.isDirectory())walk(p);else{const key='/'+p.slice(4);files[key]={data:fs.readFileSync(new URL(p,root)).toString('base64'),type:p.endsWith('.html')?'text/html; charset=utf-8':p.endsWith('.css')?'text/css; charset=utf-8':p.endsWith('.js')?'application/javascript; charset=utf-8':p.endsWith('.png')?'image/png':p.endsWith('.webmanifest')?'application/manifest+json':'application/json; charset=utf-8'};}}}walk('web');
const feedCode=read('worker/feed.js').replaceAll('export ','');
const code=feedCode+'\nconst FILES='+JSON.stringify(files)+';\nconst CHANNELS='+read('channels.json')+';\nconst SEED='+read('web/feed.json')+';\n'+read('worker/runtime.txt');
fs.writeFileSync(new URL('worker/index.js',root),code);
console.log('Bundled '+Object.keys(files).length+' local assets');
