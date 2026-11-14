export const CATEGORIES=['Entertainment','Science','Tech','Gaming','Food','Travel','Outdoors','Making','Sports','History','Art','Design','Animals','Music','Learning','Documentary'];
export function cleanVideos(data){if(!Array.isArray(data))return [];const ids=new Set();return data.filter(v=>{if(!v||!/^[\w-]{11}$/.test(v.id)||ids.has(v.id)||typeof v.title!=='string'||typeof v.channel!=='string'||!CATEGORIES.includes(v.category)||!Number.isFinite(Number(v.views))||Number(v.views)<0||!Number.isFinite(Date.parse(v.published)))return false;ids.add(v.id);return true;});}
export function makeMix(videos,category='All',previous=[],opened=[],random=Math.random,now=Date.now()){
 const eligible=videos.filter(v=>category==='All'||v.category===category);
 const seen=new Set(previous),clicked=new Set(opened);
 const familiar=new Set(eligible.filter(v=>seen.has(v.id)||clicked.has(v.id)).map(v=>v.channelId));
 const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 let pool=eligible.filter(v=>!seen.has(v.id)&&!clicked.has(v.id));
 if(!pool.length)pool=eligible.filter(v=>!clicked.has(v.id));
 if(!pool.length)pool=eligible;
 const groups=new Map();for(const v of pool){if(!groups.has(v.channelId))groups.set(v.channelId,[]);groups.get(v.channelId).push(v);}
 // Give each channel a chance, instead of allowing the biggest view counts to dominate.
 const channelOrder=[...shuffle([...groups.keys()].filter(id=>!familiar.has(id))),...shuffle([...groups.keys()].filter(id=>familiar.has(id)))];
 const picks=channelOrder.map(id=>{const choices=groups.get(id).sort((a,b)=>{
  const score=v=>Math.log10(Number(v.views)+10)/Math.max(1,(now-Date.parse(v.published))/86400000)**.15;
  return score(b)-score(a);
 }).slice(0,6);return choices[Math.floor(random()*choices.length)];});
 const result=[],topics=new Set();
 // Mix subjects first, then fill spare slots. Always one video per channel.
 if(category==='All')for(const v of picks){if(result.length>=12)break;if(!topics.has(v.category)){result.push(v);topics.add(v.category);}}
 for(const v of picks){if(result.length>=12)break;if(!result.some(x=>x.id===v.id))result.push(v);}
 return result;
}
