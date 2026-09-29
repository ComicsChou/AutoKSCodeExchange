import {isExpiredReply} from './core.js';
export const SOURCE_URL='https://kingshotoptimizer.com/gift-codes/';
export const emptySource=()=>({status:'idle',codes:[],expired:[],catalog:[],checkedAt:null,siteChecked:'',error:'',tabId:null});
export function mergeSource(previous,result,now=new Date().toISOString()){
  const known=new Map((previous?.catalog||[]).map(r=>[r.code,{...r,status:r.status==='expired'?'expired':'inactive'}]));
  for(const code of result.expired||[]){
    const old=known.get(code);
    if(old)known.set(code,{...old,status:'expired',lastSeen:now});
  }
  for(const r of result.codes){
    const old=known.get(r.code);
    known.set(r.code,{...r,firstSeen:old?.firstSeen||now,lastSeen:now,status:'active'});
  }
  return {...emptySource(),codes:result.codes,expired:result.expired||[],catalog:[...known.values()],status:'ready',checkedAt:now,siteChecked:result.siteChecked};
}
export function remainingRoles(code,roles,history){
  if(isCodeExpired(code,history))return 0;
  const done=new Set(history.filter(h=>h.code===code&&['success','already'].includes(h.status)).map(h=>JSON.stringify([h.id,h.kingdom])));
  return roles.filter(r=>r.enabled&&!done.has(JSON.stringify([r.id,r.kingdom]))).length;
}
export const isCodeExpired=(code,history)=>history.some(h=>h.code===code&&h.status==='failed'&&isExpiredReply(h.message));
export const availableCodes=(source,roles,history)=>(source?.codes||[]).filter(r=>remainingRoles(r.code,roles,history)>0).map(r=>r.code);

// Executed on the rendered source page: the static HTML contains an older list.
export async function readCodesOnPage() {
  if(location.origin!=='https://kingshotoptimizer.com'||!/^\/gift-codes\/?$/.test(location.pathname))throw Error('來源頁面位置不正確。');
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const started=Date.now();let previous='',stableAt=Date.now();
  while(Date.now()-started<20000){
    const heading=[...document.querySelectorAll('h2')].find(e=>e.textContent.trim()==='Active codes');
    const checked=document.body.innerText.match(/Verified daily\.\s*Last checked\s+(\d{4}-\d{2}-\d{2})/i);
    if(heading&&checked){
      const rows=[];
      for(let node=heading.nextElementSibling;node&&!/^H[12]$/.test(node.tagName);node=node.nextElementSibling){
        for(const el of node.querySelectorAll('code')){
          if(el.classList.contains('line-through')||el.closest('s,del'))continue;
          const code=el.textContent.trim();
          if(!/^[A-Za-z0-9_-]{1,20}$/.test(code))throw Error('來源兌換碼格式異常，停止更新。');
          const added=el.parentElement.textContent.match(/Added\s+(\d{4}-\d{2}-\d{2})/)?.[1]||'';
          rows.push({code,added});
        }
      }
      const codes=[...new Map(rows.map(r=>[r.code,r])).values()].sort((a,b)=>b.added.localeCompare(a.added));
      if(codes.length>100)throw Error('來源清單數量異常，停止更新。');
      const signature=JSON.stringify([codes,checked[1]]);
      if(signature!==previous){previous=signature;stableAt=Date.now();}
      if(Date.now()-stableAt>=2000){
        const expired=[];
        const end=[...document.querySelectorAll('h2')].find(e=>e.textContent.trim()==='Expired codes');
        for(let node=end?.nextElementSibling;node&&!/^H[12]$/.test(node.tagName);node=node.nextElementSibling){
          for(const el of node.querySelectorAll('code')){const code=el.textContent.trim();if(/^[A-Za-z0-9_-]{1,20}$/.test(code))expired.push(code);}
        }
        return {codes,expired:[...new Set(expired)],siteChecked:checked[1]};
      }
    }
    await sleep(250);
  }
  throw Error('未取得網站更新後的有效碼清單，可能被驗證頁阻擋或網站已改版。');
}
