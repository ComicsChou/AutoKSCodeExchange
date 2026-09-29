export const OFFICIAL = 'https://ks-giftcode.centurygame.com/';
export const labels = {pending:'等待中',working:'處理中',success:'兌換成功',already:'已兌換・自動略過',failed:'未成功',unknown:'結果未明・已略過',skipped:'略過',cancelled:'已取消'};
export const fresh = () => ({roles:[],history:[],run:null});
export function role(value) {
  const r = {id:String(value.id ?? '').trim(),kingdom:String(value.kingdom ?? '').trim(),name:String(value.name ?? '').trim().slice(0,40),enabled:value.enabled !== false};
  if (!/^[0-9]{1,10}$/.test(r.id)) throw Error('角色 ID 請填入 1–10 位數字。');
  if (!/^[0-9]{1,10}$/.test(r.kingdom) || Number(r.kingdom) < 1) throw Error('王國請填入 1–10 位正整數。');
  r.kingdom = String(Number(r.kingdom));
  return r;
}
export const key = r => JSON.stringify([r.id,r.kingdom]);
export const jobKey = j => JSON.stringify([j.id,j.kingdom,j.code]);
export function makeRun(roles, history, code, interval) {
  code = String(code).trim();
  if (!code || code.length > 20 || /\s/.test(code)) throw Error('請輸入最多 20 個字元、不含空白的兌換碼。');
  if (!Number.isInteger(interval) || interval < 10 || interval > 300) throw Error('間隔請設為 10–300 秒。');
  const done = new Set(history.filter(x=>['success','already'].includes(x.status)).map(jobKey));
  const latest = new Map(history.map(x=>[jobKey(x),x]));
  const seen = new Set();
  const jobs = roles.filter(r=>r.enabled).map(role).filter(r=>{const k=key(r);if(seen.has(k))return false;seen.add(k);return true;}).map(r=>({...r,code,status:done.has(jobKey({...r,code}))?'skipped':'pending',message:done.has(jobKey({...r,code}))?'本機紀錄顯示已完成。':''}));
  if (!jobs.length) throw Error('請先新增並勾選至少一個角色。');
  if(history.some(h=>h.code===code&&h.status==='failed'&&isExpiredReply(h.message)))for(const j of jobs){j.status='skipped';j.message='官方先前已回覆此碼過期，直接略過。';}
  for(const j of jobs)if(j.status==='pending'&&['unknown','skipped'].includes(latest.get(jobKey(j))?.status)){j.status='skipped';j.message='先前結果未明，直接略過，不自動重送。';}
  return {id:crypto.randomUUID(),code,interval,jobs,status:jobs.some(j=>j.status==='pending')?'running':'done',tabId:null,nextAt:0,startedAt:new Date().toISOString()};
}
// Only new, standalone result messages qualify. The site's permanent reward hint never does.
export function classify(text) {
  const t=String(text).trim().replace(/[。.!！]+$/,'').trim();
  if (/^(兌換成功|兑换成功|兌換成功，?獎勵已(發送|寄送).{0,50}|兑换成功，?奖励已发放.{0,50}|successfully redeemed|redeemed successfully|redemption successful|gift code redeemed successfully)$/i.test(t)) return 'success';
  if (/^(已(經)?(兌換|兑换|領取|领取)(過|过)?(此|該|该)?(兌換碼|兑换码|禮包|礼包|獎勵|奖励)?|(gift )?code (has )?already (been )?(redeemed|claimed)|already redeemed)$/i.test(t)) return 'already';
  if (/^(?:(?:您|你)(?:已經|已经|已)(?:使用|兌換|兑换|領取|领取)(?:過|过)?(?:了)?(?:此|該|该|這個|这个)?(?:兌換碼|兑换码|禮包碼|礼包码|禮包|礼包|獎勵|奖励)|(?:此|該|该|這個|这个)?(?:兌換碼|兑换码|禮包碼|礼包码|禮包|礼包|獎勵|奖励)(?:已經|已经|已)(?:被)?(?:使用|兌換|兑换|領取|领取)(?:過|过|了)?|(?:you(?: have|'ve)? )?already (?:redeemed|claimed|used)(?: (?:this|the) (?:gift code|code|gift|rewards?))?|(?:this |the )?(?:gift code|code|gift|rewards?) (?:has |have )?already (?:been )?(?:redeemed|claimed|used))$/i.test(t))return 'already';
  if (/(驗證|验证|captcha|too (many|frequent)|頻繁|频繁|稍後|稍后|try again later)/i.test(t)) return 'unknown';
  if(isExpiredReply(t))return 'failed';
  if (/^(兌換碼|兑换码|禮包碼|礼包码).{0,20}(不存在|無效|无效|過期|过期)|^(invalid|expired) (gift )?code$|^(角色|王國|王国).{0,20}(不存在|錯誤|错误)/i.test(t)) return 'failed';
  return null;
}
export function isExpiredReply(text){
  return String(text).split('\n').some(line=>/^(?:(?:此|該|该|這個|这个)?(?:兌換碼|兑换码|禮包碼|礼包码|禮包|礼包)(?:已經|已经|已)?(?:過期|过期)(?:了)?|(?:this |the )?(?:gift )?code (?:has )?(?:already )?expired|expired (?:gift )?code)[。.!！]*$/i.test(line.trim()));
}
export function classifyReply(text) {
  const found=String(text).split('\n').map(classify).filter(Boolean);
  return found.length&&!found.includes('unknown')&&new Set(found).size===1?found[0]:'unknown';
}
export function makeBatch(roles,history,codes,interval){
  if(!Array.isArray(codes)||!codes.length||codes.length>100)throw Error('有效碼清單為空或格式錯誤，請先更新。');
  const runs=[...new Set(codes)].map(code=>makeRun(roles,history,code,interval));
  const jobs=runs.flatMap(r=>r.jobs);
  return {...runs[0],codes:runs.map(r=>r.code),code:runs.map(r=>r.code).join('、'),jobs,status:jobs.some(j=>j.status==='pending')?'running':'done'};
}
export function recoverAlready(state){
  let changed=false;
  for(const h of state.history)if(h.status==='unknown'&&classifyReply(h.message)==='already'){h.status='already';h.source='reclassified';changed=true;}
  const r=state.run;
  if(r){
    for(const j of r.jobs)if(j.status==='unknown'&&classifyReply(j.message)==='already'){record(state,j,'already',j.message,'reclassified');changed=true;}
    if(changed&&r.status==='paused'&&!r.jobs.some(j=>j.status==='unknown'))r.status=r.jobs.some(j=>j.status==='pending')?'running':'done';
  }
  return changed;
}
export function record(state, job, status, message, source='website') {
  Object.assign(job,{status,message,time:new Date().toISOString()});
  state.history.push({...job,source,runId:state.run.id});
}
