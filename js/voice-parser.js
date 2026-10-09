/* Mahjong Score v15.6.55 — Voice parser module. Depends on live game state s and scoring patterns pats; does not mutate scores. */
function voiceNormalize(t){return String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim()}
function voicePlayerAliases(i){
 const a=[`pemain ${i+1}`,`player ${i+1}`],name=voiceNormalize(s.names[i]);if(name)a.push(name);
 const wind=Array.isArray(s.seatWinds)?s.seatWinds[i]:((s.dealer-i+4)%4);
 const aliases=[['timur','east','dong','tung'],['selatan','south','nan'],['barat','west','xi','si'],['utara','north','bei','pei']][wind]||[];
 return [...a,...aliases].map(voiceNormalize).filter(Boolean).sort((x,y)=>y.length-x.length)
}
function voiceEditDistance(a,b){
 a=String(a||'');b=String(b||'');const m=a.length,n=b.length,dp=Array(n+1).fill(0).map((_,j)=>j);
 for(let i=1;i<=m;i++){let prev=dp[0];dp[0]=i;for(let j=1;j<=n;j++){const old=dp[j];dp[j]=Math.min(dp[j]+1,dp[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old}}return dp[n]
}
function voicePlayerHits(text,exclude=null){
 text=voiceNormalize(text);const hits=[];
 // Exact aliases remain authoritative: player number, current name and actual seat wind.
 for(let i=0;i<4;i++){if(i===exclude)continue;for(const a of voicePlayerAliases(i)){const esc=a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),m=text.match(new RegExp(`(^|\\s)${esc}(?=\\s|$)`));if(m){hits.push({i,pos:m.index+(m[1]?m[1].length:0),len:a.length,alias:a,score:100});break}}}
 // v15.6.54: fuzzy-match only the four real player names, so Safari spelling drift can be recovered without guessing arbitrary words.
 const words=text.split(' ').filter(Boolean);let offset=0,positions=[];for(const w of words){const pos=text.indexOf(w,offset);positions.push(pos);offset=pos+w.length}
 for(let i=0;i<4;i++){if(i===exclude||hits.some(h=>h.i===i))continue;const name=voiceNormalize(s.names[i]);if(name.length<3)continue;const parts=name.split(' '),span=parts.length;
   for(let k=0;k<words.length;k++){for(let d=-1;d<=1;d++){const count=span+d;if(count<1||k+count>words.length)continue;const cand=words.slice(k,k+count).join(' ');if(cand.length<3)continue;const dist=voiceEditDistance(name,cand),limit=name.length<=4?1:name.length<=7?2:Math.max(2,Math.floor(name.length*.28));if(dist<=limit){const score=80-dist*8-Math.abs(name.length-cand.length);hits.push({i,pos:positions[k],len:cand.length,alias:cand,score});k=words.length;break}}}
 }
 hits.sort((a,b)=>a.pos-b.pos||b.score-a.score||b.len-a.len);return hits
}
function voiceFindPlayer(text,exclude=null){const hits=voicePlayerHits(text,exclude);return hits.length?hits[0].i:null}
function voiceNumber(t){const map={nol:0,zero:0,satu:1,one:1,dua:2,two:2,tiga:3,three:3,empat:4,four:4,ling:0,yi:1,er:2,liang:2,san:3,si:4};if(/^\d+$/.test(t))return Math.max(0,Math.min(4,+t));return map[t]??null}
// v15.6.54 — Diagnostic-trained aliases from iPhone Safari (id-ID). These aliases are consumed only while parsing a Mahjong score command.
// v15.6.54 — One authoritative list of Indonesian-accent Zi Mo recognition aliases.
// Ambiguous phonetic aliases are only considered when a method is expected, never as player names.
const VOICE_ZIMO_ALIASES=[
 'zi mo','zhi mo','zimo','zhimo','zi moh','zhi moh','zi mau','zhi mau',
 'ci mo','cimo','ci moh','ci mau','ji mo','jimo','ji moh','ji mau',
 'chi mo','chimo','shi mo','shimo','tsi mo','tsimo','si mo','simo',
 'ce mo','cemo','ze mo','zemo','zee mo','zee moh','jee mo','chee mo',
 'cemok','cemuk','jemuk','cukem','cemuh','cemoko','gemuk','zi zi mo','zhi zhi mo',
 'ji ji mo','ci ci mo','self draw','selfdraw','self drawn','selfdrawn',
 'ambil sendiri','ambil sendiri kartunya','menang sendiri','mengambil sendiri','dapat sendiri','tarik sendiri','tarik dari tembok','ambil dari tembok','dapat dari tembok','kartu sendiri','menang dengan kartu sendiri'
];
const VOICE_HU_ALIASES=['hu','hoo','who','hue','huu','ambil buangan','mengambil buangan','menang dari buangan','dapat buangan','ambil dari pemain','menang dari pemain','menang dari kartu buangan','menang dari buangan pemain','kartu buangan','menang dengan kartu buangan'];
function voiceAliasRegex(aliases){return new RegExp('(?:^|\\s)('+[...new Set(aliases)].sort((a,b)=>b.length-a.length).map(a=>a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\\ /g,'\\s+')).join('|')+')(?![a-z0-9])')}
const VOICE_ZIMO_RE=voiceAliasRegex(VOICE_ZIMO_ALIASES);
const VOICE_HU_RE=voiceAliasRegex(VOICE_HU_ALIASES);
const VOICE_METHOD_RE=voiceAliasRegex([...VOICE_ZIMO_ALIASES,...VOICE_HU_ALIASES]);
function voiceMethodHit(text){const z=VOICE_ZIMO_RE.exec(text),h=VOICE_HU_RE.exec(text);if(!z)return h?{method:'hu',index:h.index+(h[0].length-h[1].length),length:h[1].length}:null;if(!h)return {method:'zimo',index:z.index+(z[0].length-z[1].length),length:z[1].length};const zi=z.index+(z[0].length-z[1].length),hi=h.index+(h[0].length-h[1].length);return zi<=hi?{method:'zimo',index:zi,length:z[1].length}:{method:'hu',index:hi,length:h[1].length}}
// v15.6.54 — Voice combination parser uses the existing `pats` list as the single source of truth.
function voicePatternAliases(i){
 const full=voiceNormalize(pats[i]?.[0]||'');if(!full)return [];
 const base=voiceNormalize(String(pats[i][0]).replace(/\([^)]*\)/g,' '));
 const a=[full,base];
 if(/pinhu/i.test(pats[i][0]))a.push('pinhu','pin hu');
 if(/^13\s/i.test(pats[i][0]))a.push('tiga belas rakyat','thirteen rakyat');
 if(/^7\s/i.test(pats[i][0]))a.push('tujuh tangga surga');
 if(/3 Naga Besar/i.test(pats[i][0]))a.push('tiga naga besar');
 if(/4 Angin/i.test(pats[i][0]))a.push('empat angin besar','empat angin kecil','empat angin besar kecil');
 if(/4 Quad/i.test(pats[i][0]))a.push('quad murni','empat quad','empat gang','empat kong');
 return [...new Set(a.map(voiceNormalize).filter(Boolean))].sort((x,y)=>y.length-x.length)
}
function voicePatternHits(text){
 text=voiceNormalize(text);const hits=[];
 for(let i=0;i<pats.length;i++)for(const a of voicePatternAliases(i)){const esc=a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),m=text.match(new RegExp(`(^|\\s)${esc}(?=\\s|$)`));if(m){hits.push({i,pos:m.index+(m[1]?m[1].length:0),len:a.length,alias:a});break}}
 return hits.sort((a,b)=>a.pos-b.pos||b.len-a.len)
}
function voicePlayerMentions(text){
 text=voiceNormalize(text);const out=[];
 for(let i=0;i<4;i++)for(const a of voicePlayerAliases(i)){
   const esc=a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),re=new RegExp(`(^|\\s)${esc}(?=\\s|$)`,'g');let m;
   while((m=re.exec(text))){out.push({i,pos:m.index+(m[1]?m[1].length:0),len:a.length,alias:a});if(re.lastIndex===m.index)re.lastIndex++}
 }
 // Prefer the longest alias when two aliases identify the same mention.
 return out.sort((a,b)=>a.pos-b.pos||b.len-a.len).filter((h,k,a)=>!a.slice(0,k).some(x=>x.i===h.i&&x.pos===h.pos))
}
function voicePatternsByPlayer(text){
 const out=[null,null,null,null],players=voicePlayerMentions(text),patterns=voicePatternHits(text);
 for(const ph of patterns){
   // Each pattern belongs to the nearest player mention immediately before it, including repeated player names later in the sentence.
   const owner=[...players].filter(h=>h.pos<ph.pos).sort((a,b)=>b.pos-a.pos)[0];
   if(owner)out[owner.i]=ph.i;
 }
 return out
}
function parseVoiceScore(raw){
 const text=voiceNormalize(raw),methodHit=voiceMethodHit(text);let mth=methodHit?.method||null;
 const allHits=voicePlayerHits(text),uniqueHits=[];for(const h of allHits)if(!uniqueHits.some(x=>x.i===h.i))uniqueHits.push(h);
 // Prefer the player spoken before HU/ZI MO as winner. If Safari drops the Mahjong keyword, first spoken player remains winner.
 let win=null;if(methodHit){const before=voicePlayerHits(text.slice(0,methodHit.index));if(before.length)win=before[0].i}
 if(win===null&&uniqueHits.length)win=uniqueHits[0].i;
 // Quad-only phrases must never be misread as a change of winner.
 if(!mth&&uniqueHits.length>=2&&!/\b(?:quad|kuad|quat|kwad|kwat|guad|kuat|gang|kang|kong|gong|cong|kan)\b/.test(text))mth='hu';
 let disc=null;if(mth==='hu'){
   const cue=text.match(/\b(?:dari|from|buangan|buang|yang\s+buang|yang\s+membuang|pembuang|pemberi|dibuang\s+oleh|discard(?:ed)?\s+by|gave|given\s+by)\b([\s\S]*)/);
   if(cue)disc=voiceFindPlayer(cue[1],win);
   if(disc===null&&methodHit)disc=voiceFindPlayer(text.slice(methodHit.index+methodHit.length),win);
   if(disc===null){const other=uniqueHits.find(h=>h.i!==win);if(other)disc=other.i}
 }
 // v15.6.54 — Quad/Gang voice parser. Each spoken player can carry an independent 0–4 value.
 // Accept common Safari/Android spellings: quad/kuad/quat and gang/kang/kong.
 let qs=[null,null,null,null];
 const quadWord='(?:quad|kuad|quat|kwad|kwat|guad|kuat|gang|kang|kong|gong|cong|kan)',quadNum='(?:nol|zero|satu|one|dua|two|tiga|three|empat|four|ling|yi|er|liang|san|si|[0-4])';
 const qHits=voicePlayerHits(text);
 const patternByPlayer=voicePatternsByPlayer(text);
 for(const h of qHits){
   const after=text.slice(h.pos+h.len),before=text.slice(0,h.pos);
   let q=after.match(new RegExp(`^\\s*(?:${quadWord}(?!\\s+murni)\\s*(${quadNum})?|(${quadNum})\\s*${quadWord})\\b`));
   if(!q){const tail=before.slice(Math.max(0,before.length-40));q=tail.match(new RegExp(`(?:${quadWord}\\s*(${quadNum})?|(${quadNum})\\s*${quadWord})\\s*$`))}
   if(q){const n=voiceNumber(q[1]||q[2]||'satu');if(n!==null)qs[h.i]=n}
 }
 // Backward-compatible winner shorthand: a lone Quad/Gang phrase applies to winner only when no player-specific value was found.
 if(win!==null&&!qs.some(n=>n!==null)){
   const q=text.match(new RegExp(`\\b(${quadNum})\\s*${quadWord}\\b|\\b${quadWord}\\s*(${quadNum})?\\b`));
   if(q){const n=voiceNumber(q[1]||q[2]||'satu');if(n!==null)qs[win]=n}
 }
 return {raw,text,winner:win,method:mth,discarder:disc,quads:qs,patterns:patternByPlayer}
}
