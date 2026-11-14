"""Refresh the discovery pool using public YouTube channel RSS feeds. No API key."""
import concurrent.futures, datetime, json, pathlib, urllib.request, xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parent.parent
NS={'a':'http://www.w3.org/2005/Atom','yt':'http://www.youtube.com/xml/schemas/2015','m':'http://search.yahoo.com/mrss/'}
channels=json.loads((ROOT/'channels.json').read_text())
def get_channel(c):
 try:
  req=urllib.request.Request('https://www.youtube.com/feeds/videos.xml?channel_id='+c['id'],headers={'User-Agent':'AlgoBuster/1.0'})
  with urllib.request.urlopen(req,timeout=15) as r:root=ET.fromstring(r.read())
  result=[]
  name=root.findtext('a:title','',NS)
  for e in root.findall('a:entry',NS):
   link=e.find('a:link',NS);vid=e.findtext('yt:videoId','',NS);stats=e.find('.//m:statistics',NS)
   if link is None or '/shorts/' in link.attrib.get('href','') or len(vid)!=11:continue
   result.append({'id':vid,'title':e.findtext('a:title','',NS),'channel':name,'channelId':c['id'],'category':c['category'],'published':e.findtext('a:published','',NS),'views':int(stats.attrib.get('views','0')) if stats is not None else 0})
  return result,{'id':c['id'],'name':name,'category':c['category']}
 except Exception as e:
  print('Feed unavailable:',c['id'],str(e)[:80]);return [],None
videos=[];active=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for v,c in pool.map(get_channel,channels):
  videos.extend(v)
  if c:active.append(c)
if len(active)<8:raise SystemExit('Not enough sources responded; previous feed kept.')
now=datetime.datetime.now(datetime.timezone.utc)
cutoff=now-datetime.timedelta(days=90)
videos=[v for v in videos if datetime.datetime.fromisoformat(v['published'].replace('Z','+00:00'))>=cutoff]
videos=list({v['id']:v for v in videos}.values())
data={'updatedAt':now.isoformat(),'channels':active,'videos':videos}
(ROOT/'web/feed.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
print('Saved',len(videos),'videos from',len(active),'channels')
print('Source channels:',', '.join(c['name'] for c in active))
