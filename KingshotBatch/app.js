import {fresh,role,key,labels} from './core.js';
import {availableCodes,remainingRoles,isCodeExpired} from './source.js';
const $=id=>document.getElementById(id);
const t=value=>KS_I18N.t(value);
const date=value=>new Date(value).toLocaleString(KS_I18N.locale);
const live=!!globalThis.chrome?.runtime?.id;
let state=fresh(), editing=null;
const active=()=>state.run&&['running','stopping'].includes(state.run.status);
function notify(text){$('toast').textContent=t(text);$('toast').hidden=false;}
async function call(type,data={}) {
  if(!live){
    if(type==='get'){try{state=JSON.parse(localStorage.getItem('ks-preview')||'null')||fresh();}catch{state=fresh();}}
    else if(type==='roles'){state.roles=data.roles.map(role);localStorage.setItem('ks-preview',JSON.stringify(state));}
    else throw Error('預覽模式無法兌換。請先載入擴充功能。');
  }else{const reply=await chrome.runtime.sendMessage({type,...data});if(!reply?.ok)throw Error(reply?.error||'背景程式沒有回應，請重新載入擴充功能。');state=reply.state;}
  render();
}
function el(tag,text,cls,raw=false){const e=document.createElement(tag);if(text!==undefined)e.textContent=raw?text:t(text);if(cls)e.className=cls;return e;}
function badge(status){return el('span',labels[status]||status,`badge ${status}`);}
function roleCell(r){const c=el('td');c.textContent=r.name||r.id;c.append(el('small',`${r.name?`${r.id} · `:''}王國 ${r.kingdom}`));return c;}
function render(){
  const locked=active();$('roles').replaceChildren();$('count').textContent=state.roles.length;
  $('empty').hidden=state.roles.length>0;
  $('selected').textContent=`已選擇 ${state.roles.filter(r=>r.enabled).length} 位角色`;
  for(const r of state.roles){
    const tr=el('tr'),box=el('input');box.type='checkbox';box.checked=r.enabled;box.disabled=locked;box.setAttribute('aria-label',t(`選擇 ${r.name||r.id}`));
    box.onchange=()=>safe(()=>call('roles',{roles:state.roles.map(x=>key(x)===key(r)?{...x,enabled:box.checked}:x)}));
    const c=el('td');c.append(box);tr.append(c);
    const n=el('td');n.textContent=r.name||t('未命名角色');n.append(el('small',r.id));tr.append(n,el('td',`# ${r.kingdom}`));
    const a=el('td'),edit=el('button','編輯','text-button'),del=el('button','移除','text-button danger');edit.disabled=del.disabled=locked;
    edit.onclick=()=>openRole(r);del.onclick=()=>safe(async()=>{if(confirm(t(`移除 ${r.name||r.id}（王國 ${r.kingdom}）？兌換紀錄仍保留。`)))await call('roles',{roles:state.roles.filter(x=>key(x)!==key(r))});});a.append(edit,del);tr.append(a);$('roles').append(tr);
  }
  for(const id of ['add','first','import','all','code','interval'])$(id).disabled=locked;
  $('all').checked=state.roles.length>0&&state.roles.every(r=>r.enabled);$('all').indeterminate=state.roles.some(r=>r.enabled)&&!$('all').checked;
  $('start').disabled=locked||!live||!state.roles.some(r=>r.enabled);$('stop').disabled=!locked||state.run?.status==='stopping';
  const source=state.source,ready=source?.status==='ready',available=availableCodes(source,state.roles,state.history);
  $('refresh-codes').disabled=!live||source?.status==='refreshing';
  $('source-count').textContent=available.length;
  $('source-status').textContent=source?.status==='refreshing'?'正在載入來源網站更新後的清單…':source?.status==='error'?`更新失敗：${source.error}。保留先前紀錄，暫不使用舊清單。`:ready?`取得 ${source.codes.length} 組有效碼 · 更新於 ${date(source.checkedAt)} · 來源檢查日 ${source.siteChecked} · 每小時自動更新`:'開啟工具後自動取得最新碼；預覽模式不連線。';
  $('start-latest').disabled=locked||!live||!ready||!available.length;
  $('code-list').replaceChildren();
  for(const c of source?.codes||[]){const n=remainingRoles(c.code,state.roles,state.history),card=el('div',undefined,'code-chip');card.append(el('strong',c.code),el('small',isCodeExpired(c.code,state.history)?'官方回覆已到期 · 排除':!state.roles.some(r=>r.enabled)?'請先勾選角色':n?`${n} 位角色尚未使用`:'所有勾選角色皆已使用 · 略過'));$('code-list').append(card);}
  $('catalog-count').textContent=source?.catalog?.length||0;$('catalog').replaceChildren();
  for(const c of [...(source?.catalog||[])].reverse()){
    const status=isCodeExpired(c.code,state.history)?'官方回覆已到期 · 排除':c.status==='expired'?'已到期 · 排除':c.status==='inactive'?'不在有效清單 · 排除':state.roles.some(r=>r.enabled)&&!remainingRoles(c.code,state.roles,state.history)?'勾選角色已使用 · 排除':'有效';
    const tr=el('tr');tr.append(el('td',c.code),el('td',status),el('td',date(c.firstSeen)),el('td',date(c.lastSeen)));$('catalog').append(tr);
  }
  $('jobs').replaceChildren();const r=state.run;
  const names={running:'執行中',stopping:'停止中',stopped:'已停止',done:'批次結束'};
  $('run-label').textContent=r?names[r.status]:'尚未開始';
  $('official-tab').hidden=!r?.tabId||!live;
  if(r){
    const completed=r.jobs.filter(j=>!['pending','working'].includes(j.status)).length;
    const ok=r.jobs.filter(j=>['success','already'].includes(j.status)).length;
    $('summary').textContent=`${completed} / ${r.jobs.length} 筆已處理 · ${ok} 筆成功或已兌換 · ${r.codes?.length||1} 組碼${r.status==='running'&&r.nextAt?' · 等待下一筆（瀏覽器可能延後執行）':''}${r.status==='stopping'?' · 等待目前項目回覆，已送出的請求無法撤回':''}`;
    $('progress').max=r.jobs.length||1;$('progress').value=completed;
    for(const j of r.jobs){const tr=el('tr'),c=el('td');c.append(badge(j.status));tr.append(roleCell(j),el('td',j.code,undefined,true),c,el('td',j.message));$('jobs').append(tr);}
  }else $('summary').textContent='加入角色並輸入兌換碼後，這裡會顯示每一筆結果。';
  $('history-count').textContent=state.history.length;$('history').replaceChildren();
  for(const j of state.history.slice(-200).reverse()){const tr=el('tr'),c=el('td');c.append(badge(j.status));tr.append(el('td',date(j.time)),roleCell(j),el('td',j.code,undefined,true),c,el('td',`${j.message}`));$('history').append(tr);}
  for(const id of ['selected','source-status','summary','run-label'])$(id).textContent=t($(id).textContent);
}
async function safe(fn){try{await fn();}catch(e){notify(e.message);}}
function openRole(r=null){editing=r?key(r):null;$('dialog-title').textContent=t(r?'編輯角色':'新增角色');$('name').value=r?.name||'';$('role-id').value=r?.id||'';$('kingdom').value=r?.kingdom||'';$('form-error').textContent='';$('role-dialog').showModal();}
$('add').onclick=$('first').onclick=()=>openRole();$('cancel').onclick=()=>$('role-dialog').close();
$('role-form').onsubmit=async e=>{e.preventDefault();try{
  const old=state.roles.find(r=>key(r)===editing);
  const r=role({id:$('role-id').value,kingdom:$('kingdom').value,name:$('name').value,enabled:old?.enabled??true});
  if(state.roles.some(x=>key(x)===key(r)&&key(x)!==editing))throw Error('這個角色與王國已在清單中。');
  const rows=editing?state.roles.map(x=>key(x)===editing?r:x):[...state.roles,r];await call('roles',{roles:rows});$('role-dialog').close();
}catch(e){$('form-error').textContent=t(e.message);}};
$('all').onchange=()=>safe(()=>call('roles',{roles:state.roles.map(r=>({...r,enabled:$('all').checked}))}));
$('redeem-form').onsubmit=e=>{e.preventDefault();safe(()=>call('start',{code:$('code').value,interval:Number($('interval').value)}));};
$('refresh-codes').onclick=()=>safe(()=>call('refreshCodes'));
$('start-latest').onclick=()=>safe(()=>call('startLatest',{interval:Number($('interval').value)}));
$('stop').onclick=()=>safe(()=>call('stop'));
$('official-tab').onclick=()=>safe(async()=>{try{await chrome.tabs.update(state.run.tabId,{active:true});}catch{notify('兌換分頁已關閉，結果已保留在紀錄中。');}});
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({version:1,...state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=`Kingshot-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('import').onclick=()=>$('file').click();
$('file').onchange=()=>safe(async()=>{const f=$('file').files[0];$('file').value='';if(!f)return;if(f.size>5_000_000)throw Error('匯入檔案不可超過 5 MB。');const data=JSON.parse(await f.text()),rows=Array.isArray(data)?data:data.roles;if(!Array.isArray(rows))throw Error('找不到角色清單。');const merged=new Map(state.roles.map(r=>[key(r),r]));for(const v of rows){const r=role(v);if(!merged.has(key(r)))merged.set(key(r),r);}if(merged.size>1000)throw Error('最多可管理 1000 位角色。');await call('roles',{roles:[...merged.values()]});notify('已合併匯入角色；現有角色不覆寫，歷史紀錄不匯入。');});
if(live)chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.state){state=changes.state.newValue||fresh();render();}});
else $('preview').hidden=false;
void safe(async()=>{await call('get');if(live)await call('refreshCodes');});

window.addEventListener('ks-language-changed',()=>{render();if($('role-dialog').open)$('dialog-title').textContent=t(editing?'編輯角色':'新增角色');$('toast').hidden=true;$('form-error').textContent='';});
