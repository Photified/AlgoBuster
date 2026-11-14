export const CATEGORIES=['Entertainment','Science','Tech','Gaming','Food','Travel','Outdoors','Making','Sports'];
export function cleanVideos(data){if(!Array.isArray(data))return [];const ids=new Set();return data.filter(v=>{if(!v||!/^[\w-]{11}$/.test(v.id)||ids.has(v.id)||typeof v.title!=='string'||typeof v.channel!=='string'||!CATEGORIES.includes(v.category)||!Number.isFinite(Number(v.views))||Number(v.views)<0||!Number.isFinite(Date.parse(v.published)))return false;ids.add(v.id);return true;});}
export function makeMix(videos,category='All',previous=[],opened=[],random=Math.random,now=Date.now()){
 const eligible=videos.filter(v=>category==='All'||v.category===category);
 const previousSet=new Set(previous),openedSet=new Set(opened);
 const rank=v=>Math.log10(Number(v.views)+10)/(Math.max(1,(now-Date.parse(v.published))/86400000)**.22);
 const fresh=eligible.filter(v=>!previousSet.has(v.id)&&!openedSet.has(v.id));
 const candidates=fresh.length>=Math.min(6,eligible.length)?fresh:eligible.filter(v=>!previousSet.has(v.id));
 const pool=(candidates.length?candidates:eligible).map(v=>({v,score:rank(v)*(0.65+random()*.7)})).sort((a,b)=>b.score-a.score).map(x=>x.v);
 const result=[],counts=new Map(),used=new Set();
 const add=v=>{if(!used.has(v.id)){result.push(v);used.add(v.id);counts.set(v.channelId,(counts.get(v.channelId)||0)+1);}};
 if(category==='All'){
  const cats=CATEGORIES.map(cat=>({cat,r:random()})).sort((a,b)=>a.r-b.r);
  for(const {cat} of cats){const v=pool.find(v=>v.category===cat&&(counts.get(v.channelId)||0)<1);if(v)add(v);}
 }
 for(const limit of [1,2,3,12]){for(const v of pool){if(result.length>=12)break;if((counts.get(v.channelId)||0)<limit)add(v);}if(result.length>=12)break;}
 return result;
}
