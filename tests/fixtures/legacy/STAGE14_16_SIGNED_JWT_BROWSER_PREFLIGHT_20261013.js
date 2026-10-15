/* Signed JWT preflight v2 — read-only. Run on authenticated Mahjong browser.
   Prints only statuses; never prints token, user ID, PIN, or game snapshot. */
(async()=>{
 const results=[];const add=(check,ok,detail='')=>results.push({check,status:ok?'PASS':'FAIL',detail});
 try{
  const client=typeof mahjongSupabase!=='undefined'?mahjongSupabase:null;
  if(!client?.auth?.getSession||!client?.auth?.getUser||!client?.rpc){add('Supabase client available',false);console.table(results);return;}
  const {data:sd,error:se}=await client.auth.getSession();const session=sd?.session;
  if(se||!session?.access_token){add('Authenticated session present',false);console.table(results);return;}
  add('Authenticated session present',true);
  const {data:ud,error:ue}=await client.auth.getUser();
  add('Auth server verifies user',!ue&&!!ud?.user&&ud.user.id===session.user?.id);
  let claims=null;
  try{const p=session.access_token.split('.')[1];claims=JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(p.length/4)*4,'=')));}catch{}
  add('JWT session_id present',typeof claims?.session_id==='string'&&claims.session_id.length>0);
  add('JWT subject matches',!!claims?.sub&&claims.sub===session.user?.id);
  add('JWT not expired',typeof claims?.exp==='number'&&claims.exp>Date.now()/1000);
  const {data,error}=await client.rpc('mahjong_sync_peek');
  const valid=!error&&data&&typeof data==='object'&&!Array.isArray(data)&&typeof data.ok==='boolean';
  add('RPC returned valid contract',valid,error?'RPC error '+String(error.code||'unknown'):'');
  // no-cloud-game is a legitimate authenticated, read-only result, NOT a cloud game or writer lease.
  const outcome=valid?(data.ok===true?'cloud-game-present':data.reason==='no-cloud-game'?'no-cloud-game':data.reason==='newer-login'?'newer-login':data.reason==='session-revoked'?'session-revoked':'other-rejection'):'rpc-unavailable';
  add('Authenticated RPC outcome classified',valid&&['cloud-game-present','no-cloud-game','newer-login','session-revoked','other-rejection'].includes(outcome),outcome);
  add('Cloud game available',valid&&data.ok===true,outcome==='no-cloud-game'?'NOT READY (expected without cloud game)':outcome);
 }catch(e){add('Browser diagnostic completed',false,e?.name||'Error');}
 console.table(results);
 console.info('READ-ONLY. Share only check/status/detail. No JWT, PIN, user ID, or game data.');
})();
