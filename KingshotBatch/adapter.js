// Serialized by chrome.scripting; keep this function self-contained.
export async function redeemOnPage(job) {
  if (location.origin !== 'https://ks-giftcode.centurygame.com') return {kind:'unknown',text:'頁面已離開官方兌換中心。'};
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const visible=e=>!!(e && e.getClientRects().length && getComputedStyle(e).visibility!=='hidden');
  const lines=()=>new Set(document.body.innerText.split('\n').map(s=>s.trim()).filter(Boolean));
  const started=Date.now();
  let fields,button;
  while(Date.now()-started<12000) {
    fields=['角色ID','王國','請輸入兌換碼'].map(p=>document.querySelector(`input[placeholder="${p}"]`));
    button=document.querySelector('.exchange_btn');
    if(fields.every(visible)&&visible(button))break;
    await sleep(250);
  }
  if(!fields?.every(visible)||!visible(button)) return {kind:'unknown',text:'找不到官方繁體中文表單。請切換為繁體中文，或確認網站是否改版。尚未送出。'};
  const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
  for(let i=0;i<fields.length;i++) {
    setter.call(fields[i],[job.id,job.kingdom,job.code][i]);
    fields[i].dispatchEvent(new Event('input',{bubbles:true}));
    fields[i].dispatchEvent(new Event('change',{bubbles:true}));
  }
  await sleep(250);
  if(fields.some((e,i)=>e.value!==[job.id,job.kingdom,job.code][i]))return {kind:'unknown',text:'表單填入值不一致，尚未送出。'};
  if(button.classList.contains('disabled')||button.disabled)return {kind:'unknown',text:'官方兌換按鈕未啟用，尚未送出。'};
  const before=lines(), captured=new Set();
  const capture=()=>{for(const s of lines())if(!before.has(s))captured.add(s);};
  const observer=new MutationObserver(capture);
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style']});
  try {
    button.click();
    // Do not interact with challenges, confirm dialogs, or an additional submission button.
    const until=Date.now()+18000;
    while(Date.now()<until) {
      capture();
      if(captured.size) {
        await sleep(800);capture();
        return {kind:'response',text:[...captured].join('\n').slice(0,3000)};
      }
      await sleep(200);
    }
    return {kind:'unknown',text:'已送出，但 18 秒內沒有取得可確認的結果。結果未明，直接略過；不會自動重送。'};
  } finally {observer.disconnect();}
}
