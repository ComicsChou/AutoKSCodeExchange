import {OFFICIAL,fresh,role,key,makeRun,makeBatch,classifyReply,record,recoverAlready,isExpiredReply} from './core.js';
import {redeemOnPage} from './adapter.js';
import {SOURCE_URL,emptySource,readCodesOnPage,mergeSource,availableCodes} from './source.js';
let serial=Promise.resolve(), busy=false;
let syncing=null,nextTimer=null;
const locked=fn=>{const p=serial.then(fn);serial=p.catch(()=>{});return p;};
const read=async()=> (await chrome.storage.local.get('state')).state ?? fresh();
const save=s=>chrome.storage.local.set({state:s});
const active=s=>s.run&&['running','stopping'].includes(s.run.status);
function refreshCodes(){
  if(syncing)return syncing;
  syncing=(async()=>{
    let tabId=null;
    await locked(async()=>{const s=await read();s.source={...emptySource(),...s.source,status:'refreshing',error:''};await save(s);});
    try{
      const tab=await chrome.tabs.create({url:SOURCE_URL,active:false});tabId=tab.id;
      await locked(async()=>{const s=await read();s.source.tabId=tabId;await save(s);});
      await loaded(tabId);
      const response=await chrome.scripting.executeScript({target:{tabId},func:readCodesOnPage});
      const result=response[0]?.result;
      if(!result||!Array.isArray(result.codes)||result.codes.length>100||!Array.isArray(result.expired)||result.codes.some(r=>!r||typeof r.code!=='string'||!/^[A-Za-z0-9_-]{1,20}$/.test(r.code))||result.expired.some(code=>typeof code!=='string'||!/^[A-Za-z0-9_-]{1,20}$/.test(code)))throw Error('來源回覆格式不正確。');
      await locked(async()=>{const s=await read();s.source=mergeSource(s.source,result);await save(s);});
    }catch(e){
      await locked(async()=>{const s=await read();s.source={...emptySource(),...s.source,status:'error',error:e.message,tabId:null};await save(s);});
    }finally{
      if(tabId!==null){try{await chrome.tabs.remove(tabId);}catch{}}
    }
    return read();
  })().finally(()=>{syncing=null;});
  return syncing;
}
async function schedule(s) {
  if(s.run?.status==='running') {
    s.run.nextAt=Date.now()+s.run.interval*1000;
    await save(s);
    await armNext(s.run.nextAt);
  }
}
async function armNext(at){
  if(nextTimer!==null)clearTimeout(nextTimer);
  // Chrome alarms may delay to 30s. A live worker timer supports the 10s option;
  // the persisted alarm remains a fallback after suspension or system sleep.
  await chrome.alarms.create('next',{when:at});
  nextTimer=setTimeout(()=>{nextTimer=null;void step();},Math.max(0,at-Date.now()));
}
async function loaded(id) {
  for(let i=0;i<60;i++) {
    const tab=await chrome.tabs.get(id);
    if(tab.status==='complete')return;
    await new Promise(r=>setTimeout(r,250));
  }
  throw Error('官方網頁載入逾時。');
}
async function step() {
  if(busy)return;busy=true;
  let ticket;
  try {
    ticket=await locked(async()=>{
      const s=await read(),r=s.run;
      if(!r||r.status!=='running')return null;
      if(r.nextAt>Date.now()){await armNext(r.nextAt);return null;}
      const stale=r.jobs.find(j=>j.status==='working');
      if(stale){record(s,stale,'unknown','上次執行中斷，結果未明，直接略過且不重送。','recovery');}
      const index=r.jobs.findIndex(j=>j.status==='pending');
      if(index<0){r.status='done';await save(s);return null;}
      r.jobs[index].status='working';r.nextAt=0;
      if(nextTimer!==null){clearTimeout(nextTimer);nextTimer=null;}
      await chrome.alarms.clear('next');
      await save(s);await chrome.alarms.create('watchdog',{when:Date.now()+90000});
      return {runId:r.id,index,job:{...r.jobs[index]},tabId:r.tabId};
    });
    if(!ticket)return;
    let result;
    try {
      let tab;
      if(ticket.tabId){try{tab=await chrome.tabs.get(ticket.tabId);}catch{}}
      // A new page for each job clears previous result dialogs and stale values.
      if(tab)tab=await chrome.tabs.update(tab.id,{url:OFFICIAL,active:false});
      else tab=await chrome.tabs.create({url:OFFICIAL,active:true});
      await locked(async()=>{const s=await read();if(s.run?.id===ticket.runId){s.run.tabId=tab.id;await save(s);}});
      await loaded(tab.id);
      // A stop requested during navigation prevents submission.
      const current=await read();
      if(current.run?.status==='stopping') result={kind:'cancelled',text:'停止前尚未送出。'};
      else {
        const response=await chrome.scripting.executeScript({target:{tabId:tab.id},func:redeemOnPage,args:[ticket.job]});
        result=response[0]?.result ?? {kind:'unknown',text:'無法讀取官方回覆，直接略過且不重送。'};
      }
    }catch(e){result={kind:'unknown',text:`執行中斷，可能已送出，直接略過：${e.message}`};}
    await locked(async()=>{
      const s=await read();if(s.run?.id!==ticket.runId)return;
      const r=s.run,j=r.jobs[ticket.index];
      let status=result.kind==='cancelled'?'cancelled':'unknown';
      if(result.kind==='response') {
        status=classifyReply(result.text);
      }
      record(s,j,status,result.text);
      if(status==='failed'&&isExpiredReply(result.text))for(const pending of r.jobs)if(pending.status==='pending'&&pending.code===j.code)record(s,pending,'skipped','官方回覆此碼已過期，剩餘角色直接略過。','expired-skip');
      if(r.status==='stopping'){r.status='stopped';r.jobs.filter(x=>x.status==='pending').forEach(x=>x.status='cancelled');}
      else if(!r.jobs.some(x=>x.status==='pending'))r.status='done';
      await save(s);await chrome.alarms.clear('watchdog');await schedule(s);
    });
  } finally {busy=false;}
}
async function command(m) {
  return locked(async()=>{
    const s=await read();
    if(m.type==='get')return s;
    if(m.type==='roles') {
      if(active(s))throw Error('請先完成或停止目前批次，再修改角色。');
      if(!Array.isArray(m.roles)||m.roles.length>1000)throw Error('角色清單格式錯誤，最多 1000 位。');
      const rows=m.roles.map(role),seen=new Set();
      for(const r of rows){if(seen.has(key(r)))throw Error('相同 ID 與王國不可重複。');seen.add(key(r));}
      s.roles=rows;
    } else if(m.type==='start'||m.type==='startLatest') {
      if(active(s))throw Error('目前已有批次，請先完成或停止。');
      if(m.type==='startLatest'){
        if(s.source?.status!=='ready'||Date.now()-Date.parse(s.source.checkedAt)>65*60*1000)throw Error('最新清單尚未取得或已過時，請按「更新清單」後再試。');
        const codes=availableCodes(s.source,s.roles,s.history);
        if(!codes.length)throw Error('沒有尚未使用的有效碼，已到期及所有勾選角色都已領過的碼已排除。');
        s.run=makeBatch(s.roles,s.history,codes,Number(m.interval));
      }else {
        s.run=makeRun(s.roles,s.history,m.code,Number(m.interval));
        if(s.source?.expired?.includes(s.run.code)||s.source?.catalog?.some(c=>c.code===s.run.code&&['expired','inactive'].includes(c.status))){
          for(const j of s.run.jobs){j.status='skipped';j.message='來源已列為過期或已移出有效清單，直接略過。';}
          s.run.status='done';
        }
      }
      for(const j of s.run.jobs)if(j.status==='skipped')record(s,j,'skipped',j.message||'本機已有成功／已兌換紀錄，直接略過。','local-skip');
    } else if(m.type==='stop') {
      if(!active(s))return s;
      if(s.run.jobs.some(j=>j.status==='working'))s.run.status='stopping';
      else {s.run.status='stopped';s.run.jobs.filter(j=>j.status==='pending').forEach(j=>j.status='cancelled');}
      await chrome.alarms.clear('next');
      if(nextTimer!==null){clearTimeout(nextTimer);nextTimer=null;}
    } else throw Error('不支援的操作。');
    await save(s);
    return s;
  });
}
chrome.runtime.onMessage.addListener((m,sender,reply)=>{
  if(sender.id!==chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL('app.html')))return false;
  (m.type==='refreshCodes'?refreshCodes():command(m)).then(s=>{reply({ok:true,state:s});if(['start','startLatest'].includes(m.type))void step();}).catch(e=>reply({ok:false,error:e.message}));return true;
});
chrome.action.onClicked.addListener(()=>chrome.tabs.create({url:chrome.runtime.getURL('app.html')}));
chrome.alarms.onAlarm.addListener(a=>{if(['next','watchdog'].includes(a.name))void step();if(a.name==='refresh-codes')void refreshCodes();});
// Worker/browsers may restart. Never retry a potentially submitted item.
void locked(async()=>{
  const s=await read();
  recoverAlready(s);
  if(s.run?.status==='paused')s.run.status=s.run.jobs.some(j=>j.status==='pending')?'running':'done';
  if(s.source?.status==='refreshing'){
    if(s.source.tabId!==null){try{await chrome.tabs.remove(s.source.tabId);}catch{}}
    s.source={...s.source,status:'error',tabId:null,error:'上次清單更新中斷，請重新更新。'};
  }
  await save(s);
  if(!await chrome.alarms.get('refresh-codes'))await chrome.alarms.create('refresh-codes',{delayInMinutes:60,periodInMinutes:60});
  if(s.run?.jobs.some(j=>j.status==='working')) {
    const j=s.run.jobs.find(j=>j.status==='working');record(s,j,'unknown','瀏覽器或背景工作中斷，結果未明，直接略過且不重送。','recovery');
    if(s.run.status==='stopping'){s.run.status='stopped';s.run.jobs.filter(x=>x.status==='pending').forEach(x=>x.status='cancelled');}
    else s.run.status=s.run.jobs.some(x=>x.status==='pending')?'running':'done';
    await save(s);
  }
  if(s.run?.status==='running')await armNext(Math.max(Date.now()+1000,s.run.nextAt||0));
});
