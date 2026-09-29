import test from 'node:test';
import assert from 'node:assert/strict';
import {role,key,makeRun,makeBatch,classify,classifyReply,recoverAlready,isExpiredReply} from '../core.js';
import {redeemOnPage} from '../adapter.js';
import {mergeSource,availableCodes,remainingRoles,readCodesOnPage} from '../source.js';
const r={id:'0123456789',kingdom:'42',name:'主城',enabled:true};
test('validates IDs and kingdoms without losing ID leading zeros',()=>{assert.equal(role(r).id,r.id);assert.equal(role({...r,kingdom:'0042'}).kingdom,'42');for(const x of ['', '-1','a','12345678901'])assert.throws(()=>role({...r,id:x}));assert.throws(()=>role({...r,kingdom:'0'}));});
test('rejects invalid codes, empty selection and dangerous intervals',()=>{for(const code of ['', 'a b','x'.repeat(21)])assert.throws(()=>makeRun([r],[],code,30));assert.throws(()=>makeRun([],[],'ABC',30));assert.throws(()=>makeRun([r],[],'ABC',1));});
test('deduplication includes kingdom and case-sensitive code',()=>{const history=[{...r,code:'ABC',status:'success'}];const run=makeRun([r,r,{...r,kingdom:'43'}],history,'ABC',30);assert.equal(run.jobs.length,2);assert.equal(run.jobs[0].status,'skipped');assert.equal(run.jobs[1].status,'pending');assert.equal(makeRun([r],history,'abc',30).jobs[0].status,'pending');});
test('uncertain previous attempt skips instead of resubmitting',()=>{const run=makeRun([r],[{...r,code:'ABC',status:'unknown'}],'ABC',30);assert.equal(run.status,'done');assert.equal(run.jobs[0].status,'skipped');});
test('never calls static reward hint success; handles challenges conservatively',()=>{assert.equal(classify('*兌換成功後，獎勵將自動發送到角色的信箱中。'),null);assert.equal(classify('兌換成功'), 'success');assert.equal(classify('已兌換過'), 'already');assert.equal(classify('兌換碼不存在'), 'failed');assert.equal(classify('操作頻繁，請稍後再試'), 'unknown');assert.equal(classify('please solve captcha'), 'unknown');assert.equal(classify('兌換不成功'),null);});

// Exercise the actual background worker with an in-memory Chrome API and scripted site replies.
const listeners={},alarms=new Map();let stored,reply={kind:'response',text:'兌換成功'},submissions=0,release,sourceFailure=false,sourceReads=0;
const sourceReply={codes:[{code:'NEW',added:'2026-09-28'},{code:'OLD',added:'2026-08-01'}],expired:['EXPIRED'],siteChecked:'2026-09-28'};
const event=name=>({addListener:fn=>listeners[name]=fn});
globalThis.chrome={storage:{local:{get:async()=>({state:structuredClone(stored)}),set:async({state})=>{stored=structuredClone(state);}}},runtime:{id:'test',getURL:p=>'chrome-extension://test/'+p,onMessage:event('message')},action:{onClicked:event('action')},alarms:{get:async n=>alarms.get(n),create:async(n,a)=>alarms.set(n,a),clear:async n=>alarms.delete(n),onAlarm:event('alarm')},tabs:{remove:async()=>{},get:async id=>({id,status:'complete'}),create:async()=>({id:1,status:'complete'}),update:async id=>({id,status:'complete'})},scripting:{executeScript:async({func})=>{if(func.name==='readCodesOnPage'){sourceReads++;if(sourceFailure)throw Error('來源載入失敗');return [{result:structuredClone(sourceReply)}];}submissions++;if(reply==='wait')await new Promise(r=>release=r);return [{result:reply}];}}};
await import('../background.js');
const send=m=>new Promise(resolve=>listeners.message(m,{id:'test',url:'chrome-extension://test/app.html'},resolve));
async function until(fn){for(let i=0;i<100;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('Timed out waiting for worker');}
test('worker serializes submissions, records unknown without pausing, skips known success',async()=>{
  assert.equal((await send({type:'roles',roles:[r,{...r,id:'99'}]})).ok,true);
  reply={kind:'response',text:'兌換成功'};await send({type:'start',code:'ABC',interval:30});await until(()=>stored.history.length===1);
  assert.equal(submissions,1);assert.equal(stored.run.jobs[1].status,'pending');assert.ok(alarms.has('next'));
  reply={kind:'unknown',text:'驗證碼'};stored.run.nextAt=Date.now()-1;listeners.alarm({name:'next'});await until(()=>stored.run.status==='done');assert.equal(submissions,2);
  assert.equal((await send({type:'resolve',status:'already'})).ok,false);
  await send({type:'start',code:'ABC',interval:30});assert.equal(stored.run.status,'done');assert.equal(submissions,2);
});
test('stop while submitted waits for result and cancels remaining jobs',async()=>{
  reply='wait';await send({type:'start',code:'DEF',interval:30});await until(()=>!!release);
  await send({type:'stop'});assert.equal(stored.run.status,'stopping');
  reply={kind:'response',text:'兌換成功'};release();release=null;await until(()=>stored.run.status==='stopped');assert.equal(stored.run.jobs[0].status,'success');assert.equal(stored.run.jobs[1].status,'cancelled');
});
test('worker restart converts potentially submitted job to unknown, no resubmit',async()=>{
  stored.run=makeRun([r],[],'XYZ',30);stored.run.jobs[0].status='working';const before=submissions;
  await import('../background.js?restart');await until(()=>stored.run.status==='done');assert.equal(stored.run.jobs[0].status,'unknown');assert.equal(submissions,before);
});
test('page adapter fills observed fields, submits once and excludes permanent hint',async()=>{
  let clicked=0;
  class Input {constructor(){this.v='';}get value(){return this.v;}set value(v){this.v=v;}dispatchEvent(){}getClientRects(){return [1];}}
  const inputs=[new Input(),new Input(),new Input()];
  globalThis.location={origin:'https://ks-giftcode.centurygame.com'};
  globalThis.HTMLInputElement=Input;globalThis.getComputedStyle=()=>({visibility:'visible'});
  globalThis.MutationObserver=class {observe(){}disconnect(){}};
  const body={innerText:'兌換中心\n*兌換成功後，獎勵將自動發送到角色的信箱中。'};
  const button={getClientRects:()=>[1],classList:{contains:()=>false},click:()=>{clicked++;body.innerText+='\n兌換成功';}};
  globalThis.document={body,querySelector:s=>s==='.exchange_btn'?button:inputs[['input[placeholder="角色ID"]','input[placeholder="王國"]','input[placeholder="請輸入兌換碼"]'].indexOf(s)]};
  const result=await redeemOnPage({...r,code:'ABC'});
  assert.equal(clicked,1);assert.deepEqual(inputs.map(i=>i.value),[r.id,r.kingdom,'ABC']);assert.deepEqual(result,{kind:'response',text:'兌換成功'});
  button.classList.contains=()=>true;const blocked=await redeemOnPage({...r,code:'DEF'});assert.equal(clicked,1);assert.equal(blocked.kind,'unknown');
  location.origin='https://example.com';assert.equal((await redeemOnPage({...r,code:'ABC'})).kind,'unknown');assert.equal(clicked,1);
});
test('already-used variants skip without misclassifying instructions or failure',()=>{
  for(const text of ['您已使用過該兌換碼','該禮包已被領取','兌換碼已被使用','You have already redeemed this gift code.','This gift code has already been used.','已兌換過'])assert.equal(classifyReply(text),'already',text);
  for(const text of ['若已兌換過，請略過','兌換碼尚未使用','Code already expired','未領取獎勵','您已兌換失敗','Please confirm whether you have already redeemed this code'])assert.notEqual(classifyReply(text),'already',text);
});
test('previous unknown already-redeemed result is migrated without confirmation',()=>{
  const s={history:[{...r,code:'A',status:'unknown',message:'該禮包已被領取'}],run:makeBatch([r],[],['A','B'],10)};
  s.run.status='paused';Object.assign(s.run.jobs[0],{status:'unknown',message:'該禮包已被領取'});
  assert.equal(recoverAlready(s),true);assert.equal(s.run.jobs[0].status,'already');assert.equal(s.run.status,'running');assert.equal(s.history[0].status,'already');
});
test('catalog persists loaded codes, marks missing and expired, preserves firstSeen',()=>{
  const first=mergeSource(null,{codes:[{code:'A'},{code:'B'},{code:'C'}],expired:[],siteChecked:'2026-09-27'},'2026-09-27T00:00:00Z');
  const second=mergeSource(first,{codes:[{code:'A'},{code:'D'}],expired:['B'],siteChecked:'2026-09-28'},'2026-09-28T00:00:00Z');
  assert.equal(second.catalog.length,4);assert.equal(second.catalog.find(c=>c.code==='A').firstSeen,'2026-09-27T00:00:00Z');assert.equal(second.catalog.find(c=>c.code==='B').status,'expired');assert.equal(second.catalog.find(c=>c.code==='C').status,'inactive');assert.deepEqual(second.codes.map(c=>c.code),['A','D']);
});
test('used code is excluded per selected role, never globally for new roles',()=>{
  const source={codes:[{code:'A'},{code:'B'}]},history=[{...r,code:'A',status:'already'}];
  assert.deepEqual(availableCodes(source,[r],history),['B']);assert.equal(remainingRoles('A',[r,{...r,id:'new'}],history),1);assert.deepEqual(availableCodes(source,[r,{...r,id:'new'}],history),['A','B']);
  const run=makeBatch([r,{...r,id:'99'}],history,['A','B'],10);assert.equal(run.jobs.length,4);assert.equal(run.jobs[0].status,'skipped');assert.equal(run.jobs[1].status,'pending');
});
test('official expired result excludes a code for all roles',()=>{
  assert.equal(isExpiredReply('該兌換碼已過期。'),true);assert.equal(isExpiredReply('Codes can expire at any time'),false);
  const history=[{...r,code:'A',status:'failed',message:'Gift code has expired.'}];
  assert.deepEqual(availableCodes({codes:[{code:'A'}]},[{...r,id:'99'}],history),[]);assert.equal(makeRun([r],history,'A',10).jobs[0].status,'skipped');
});
test('source synchronization persists catalog; failure retains history and blocks stale batch',async()=>{
  await send({type:'stop'});
  await send({type:'refreshCodes'});assert.equal(stored.source.status,'ready');assert.equal(stored.source.catalog.length,2);assert.ok(alarms.has('refresh-codes'));
  const previous=structuredClone(stored.source.catalog);sourceFailure=true;await send({type:'refreshCodes'});assert.equal(stored.source.status,'error');assert.deepEqual(stored.source.catalog,previous);assert.equal((await send({type:'startLatest',interval:10})).ok,false);sourceFailure=false;
});
test('hourly alarm refreshes codes without starting redemption',async()=>{
  const before=submissions,reads=sourceReads;listeners.alarm({name:'refresh-codes'});await until(()=>sourceReads>reads&&stored.source.status==='ready');assert.equal(submissions,before);
});
test('10 second spacing, automatic already skip and expired remainder skip',async()=>{
  reply={kind:'response',text:'This gift code has already been used.'};await send({type:'startLatest',interval:10});await until(()=>stored.run.jobs[0].status==='already');
  assert.equal(stored.run.status,'running');const delay=stored.run.nextAt-Date.now();assert.ok(delay>9000&&delay<=10000);
  const before=submissions;listeners.alarm({name:'next'});await new Promise(r=>setTimeout(r,20));assert.equal(submissions,before,'early alarms must not submit');
  stored.run.nextAt=Date.now()-1;listeners.alarm({name:'next'});await until(()=>stored.run.jobs[1].status==='already');
  reply={kind:'response',text:'兌換碼已過期'};stored.run.nextAt=Date.now()-1;listeners.alarm({name:'next'});await until(()=>stored.run.status==='done');
  assert.equal(stored.run.jobs[2].status,'failed');assert.equal(stored.run.jobs[3].status,'skipped');assert.equal(submissions,before+2);
  assert.equal((await send({type:'startLatest',interval:10})).ok,false,'all codes now used or expired');
});
test('rendered source parser excludes expired codes and sorts newest first',async()=>{
  location.origin='https://kingshotoptimizer.com';location.pathname='/gift-codes/';
  const code=(text,date)=>({textContent:text,classList:{contains:()=>false},closest:()=>null,parentElement:{textContent:'Added '+date}});
  const end={tagName:'H2',textContent:'How to redeem',nextElementSibling:null};
  const active={tagName:'H2',textContent:'Active codes',nextElementSibling:{tagName:'DIV',querySelectorAll:()=>[code('OLD','2026-08-01'),code('NEW','2026-09-28'),code('NEW','2026-09-28')],nextElementSibling:end}};
  const expired={tagName:'H2',textContent:'Expired codes',nextElementSibling:{tagName:'UL',querySelectorAll:()=>[code('EXPIRED','')],nextElementSibling:null}};
  document.body.innerText='Verified daily. Last checked 2026-09-28.';document.querySelectorAll=()=>[active,end,expired];
  const result=await readCodesOnPage();assert.deepEqual(result.codes.map(c=>c.code),['NEW','OLD']);assert.deepEqual(result.expired,['EXPIRED']);
});
test('manual code known expired at the source is recorded and never submitted',async()=>{
  const before=submissions;const response=await send({type:'start',code:'EXPIRED',interval:10});assert.equal(response.ok,true);assert.equal(stored.run.status,'done');assert.ok(stored.run.jobs.every(j=>j.status==='skipped'));assert.equal(submissions,before);assert.equal(stored.history.at(-1).code,'EXPIRED');
});
test('unknown first result continues to next role without confirmation',async()=>{
  reply={kind:'unknown',text:'無法辨識回覆'};
  await send({type:'start',code:'NO_CONFIRM',interval:10});await until(()=>stored.run.jobs[0].status==='unknown');
  assert.equal(stored.run.status,'running');assert.equal(stored.run.jobs[1].status,'pending');assert.ok(alarms.has('next'));
  reply={kind:'response',text:'兌換成功'};stored.run.nextAt=Date.now()-1;listeners.alarm({name:'next'});await until(()=>stored.run.status==='done');assert.equal(stored.run.jobs[1].status,'success');
});
test('legacy paused batch automatically resumes remaining jobs',async()=>{
  stored.run=makeRun([r,{...r,id:'99'}],[],'LEGACY',10);stored.run.status='paused';stored.run.jobs[0].status='unknown';stored.run.jobs[0].message='舊版待確認';
  const before=submissions;await import('../background.js?legacy');await until(()=>stored.run.status==='running');assert.equal(stored.run.jobs[0].status,'unknown');assert.equal(stored.run.jobs[1].status,'pending');assert.equal(submissions,before);await send({type:'stop'});
});
