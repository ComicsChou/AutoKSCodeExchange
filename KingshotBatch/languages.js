// Local translations only. Values and gift codes are never sent to a translation service.
(() => {
const rows = [
['問題回報：','Report an issue:','Problem melden:'],
['YOUR KINGDOMS, ONE PLACE','YOUR KINGDOMS, ONE PLACE','DEINE KÖNIGREICHE AN EINEM ORT'],
['01 / ROSTER','01 / ROSTER','01 / CHARAKTERE'],['02 / REDEEM','02 / REDEEM','02 / EINLÖSEN'],['03 / ACTIVITY','03 / ACTIVITY','03 / VERLAUF'],['AUTO / GIFT CODES','AUTO / GIFT CODES','AUTO / GESCHENKCODES'],['YOUR ROSTER','YOUR ROSTER','DEINE CHARAKTERE'],
['批次兌換助手','Batch Redemption Helper','Assistent für Sammeleinlösungen'],
['KINGSHOT｜批次兌換助手','KINGSHOT | Batch Redemption Helper','KINGSHOT | Sammeleinlösungen'],
['● 資料儲存於本機','● Data stored locally','● Daten lokal gespeichert'],
['一組兌換碼，','One gift code.','Ein Geschenkcode.'],
['照顧每一個王國。','Every kingdom covered.','Für jedes Königreich.'],
['管理你的角色，讓獎勵依序送達。','Manage your characters and redeem rewards in sequence.','Verwalte deine Charaktere und löse Belohnungen nacheinander ein.'],
['官方兌換中心','Official redemption center','Offizielles Einlösezentrum'],
['角色 ID → 王國 → 兌換','Player ID → Kingdom → Redeem','Spieler-ID → Königreich → Einlösen'],
['前往官方網站 ↗','Open official website ↗','Offizielle Website öffnen ↗'],
['介面預覽模式：可試用角色管理，無法送出兌換。請依使用說明載入擴充功能。','Preview: character management is available, but redemption is disabled. Load the extension as described in the guide.','Vorschau: Charakterverwaltung verfügbar, Einlösung deaktiviert. Lade die Erweiterung gemäß der Anleitung.'],
['我的角色','My characters','Meine Charaktere'],
['＋ 新增角色','＋ Add character','＋ Charakter hinzufügen'],
['新增角色','Add character','Charakter hinzufügen'],
['編輯角色','Edit character','Charakter bearbeiten'],
['全選角色','Select all characters','Alle Charaktere auswählen'],
['角色','Character','Charakter'],
['王國','Kingdom','Königreich'],
['操作','Actions','Aktionen'],
['迎接你的第一位領主','Add your first governor','Füge deinen ersten Statthalter hinzu'],
['新增角色 ID 與王國，開始建立兌換清單。','Add a player ID and kingdom to build your roster.','Füge eine Spieler-ID und ein Königreich hinzu, um deine Liste anzulegen.'],
['新增第一個角色','Add first character','Ersten Charakter hinzufügen'],
['已選擇 {n} 位角色','Selected characters: {n}','Ausgewählte Charaktere: {n}'],
['匯入角色','Import characters','Charaktere importieren'],
['備份資料','Back up data','Daten sichern'],
['發送這次的獎勵','Redeem your rewards','Belohnungen einlösen'],
['手動輸入兌換碼','Enter a gift code manually','Geschenkcode manuell eingeben'],
['也可以使用下方自動取得的最新碼','Or use the latest codes below','Oder verwende die aktuellen Codes unten'],
['每筆兌換間隔','Delay between redemptions','Wartezeit zwischen Einlösungen'],
['{n} 秒','{n} seconds','{n} Sekunden'],
['5 分鐘','5 minutes','5 Minuten'],
['已兌換、驗證或結果未明均記錄並略過，繼續下一筆；結果未明不自動重送。','Already redeemed, verification required or unknown: log and skip, then continue. Unknown results are never retried automatically.','Bereits eingelöst, Verifizierung nötig oder Ergebnis unklar: protokollieren, überspringen und fortfahren. Unklare Ergebnisse werden nicht automatisch erneut gesendet.'],
['兌換手動輸入的碼','Redeem entered code','Eingegebenen Code einlösen'],
['下方清單在開啟工具及每小時自動更新。執行期間請保持瀏覽器開啟。','The list refreshes when you open the tool and every hour. Keep the browser open while running.','Die Liste wird beim Öffnen und stündlich aktualisiert. Lass den Browser während der Ausführung geöffnet.'],
['最新兌換碼','Latest gift codes','Aktuelle Geschenkcodes'],
['來源：Kingshot Optimizer ↗','Source: Kingshot Optimizer ↗','Quelle: Kingshot Optimizer ↗'],
['更新清單','Refresh list','Liste aktualisieren'],
['尚未取得清單。','No list loaded yet.','Noch keine Liste geladen.'],
['已載入的碼會保留紀錄。只兌換仍有效、且勾選角色尚未使用的組合。','Loaded codes stay in your records. Only active codes unused by selected characters are submitted.','Geladene Codes bleiben gespeichert. Gesendet werden nur aktive Codes, die ausgewählte Charaktere noch nicht verwendet haben.'],
['批次兌換未使用的有效碼 →','Redeem unused active codes →','Ungenutzte aktive Codes einlösen →'],
['已載入兌換碼紀錄','Loaded code history','Verlauf geladener Codes'],
['兌換碼','Gift code','Geschenkcode'],
['狀態','Status','Status'],
['首次載入','First loaded','Erstmals geladen'],
['最後見於來源','Last seen at source','Zuletzt in der Quelle gesehen'],
['兌換進度','Redemption progress','Einlösefortschritt'],
['尚未開始','Not started','Noch nicht gestartet'],
['查看兌換分頁 ↗','Open redemption tab ↗','Einlöse-Tab öffnen ↗'],
['停止批次','Stop batch','Stapel stoppen'],
['加入角色並輸入兌換碼後，這裡會顯示每一筆結果。','Add characters and start a batch to see each result here.','Füge Charaktere hinzu und starte einen Stapel, um hier die Ergebnisse zu sehen.'],
['角色 / 王國','Character / Kingdom','Charakter / Königreich'],
['官方回覆 / 備註','Official response / Notes','Offizielle Antwort / Hinweise'],
['歷史紀錄','History','Verlauf'],
['時間','Time','Zeit'],
['備註','Notes','Hinweise'],
['獨立本機工具 · 非 KINGSHOT 官方產品','Independent local tool · Not an official KINGSHOT product','Unabhängiges lokales Tool · Kein offizielles KINGSHOT-Produkt'],
['只在官方兌換中心送出角色 ID、王國與兌換碼','Player ID, kingdom and gift code are sent only to the official redemption center','Spieler-ID, Königreich und Geschenkcode werden nur an das offizielle Einlösezentrum gesendet'],
['角色暱稱','Character nickname','Charaktername'],
['（選填）','(optional)','(optional)'],
['例如：主城、小號','For example: Main, Alt','Zum Beispiel: Hauptcharakter, Zweitcharakter'],
['角色 ID','Player ID','Spieler-ID'],
['遊戲頭像 → 領主頁面','In-game avatar → Governor profile','Avatar im Spiel → Statthalterprofil'],
['例如：123','For example: 123','Zum Beispiel: 123'],
['取消','Cancel','Abbrechen'],
['儲存角色','Save character','Charakter speichern'],
['編輯','Edit','Bearbeiten'],
['移除','Remove','Entfernen'],
['未命名角色','Unnamed character','Unbenannter Charakter'],
['選擇 {name}','Select {name}','{name} auswählen'],
['王國 {id}','Kingdom {id}','Königreich {id}'],
['移除 {name}（王國 {id}）？兌換紀錄仍保留。','Remove {name} (Kingdom {id})? Redemption history will be kept.','{name} (Königreich {id}) entfernen? Der Einlöseverlauf bleibt erhalten.'],
['等待中','Pending','Ausstehend'],['處理中','Processing','In Bearbeitung'],
['兌換成功','Redeemed successfully','Erfolgreich eingelöst'],
['已兌換・自動略過','Already redeemed · Skipped','Bereits eingelöst · Übersprungen'],
['未成功','Unsuccessful','Nicht erfolgreich'],
['結果未明・已略過','Unknown result · Skipped','Ergebnis unklar · Übersprungen'],
['略過','Skipped','Übersprungen'],['已取消','Cancelled','Abgebrochen'],
['執行中','Running','Läuft'],['停止中','Stopping','Wird gestoppt'],['已停止','Stopped','Gestoppt'],['批次結束','Batch finished','Stapel beendet'],
['正在載入來源網站更新後的清單…','Loading the updated list from the source…','Aktualisierte Liste wird von der Quelle geladen…'],
['更新失敗：{error}。保留先前紀錄，暫不使用舊清單。','Refresh failed: {error} Previous records are kept; the old list will not be used.','Aktualisierung fehlgeschlagen: {error} Vorherige Daten bleiben erhalten; die alte Liste wird nicht verwendet.'],
['取得 {n} 組有效碼','Loaded active codes: {n}','Geladene aktive Codes: {n}'],
['更新於 {date}','Updated: {date}','Aktualisiert: {date}'],
['來源檢查日 {date}','Source checked: {date}','Quellenprüfung: {date}'],
['每小時自動更新','Refreshes hourly','Stündliche Aktualisierung'],
['開啟工具後自動取得最新碼；預覽模式不連線。','Latest codes load automatically in the extension; preview mode stays offline.','Aktuelle Codes werden in der Erweiterung automatisch geladen; die Vorschau bleibt offline.'],
['官方回覆已到期 · 排除','Expired per official response · Excluded','Laut offizieller Antwort abgelaufen · Ausgeschlossen'],
['請先勾選角色','Select characters first','Zuerst Charaktere auswählen'],
['{n} 位角色尚未使用','Unused by {n} character(s)','Von {n} Charakter(en) noch nicht verwendet'],
['所有勾選角色皆已使用 · 略過','Used by all selected characters · Skipped','Von allen ausgewählten Charakteren verwendet · Übersprungen'],
['已到期 · 排除','Expired · Excluded','Abgelaufen · Ausgeschlossen'],
['不在有效清單 · 排除','Not in active list · Excluded','Nicht in der aktiven Liste · Ausgeschlossen'],
['勾選角色已使用 · 排除','Used by selected characters · Excluded','Von ausgewählten Charakteren verwendet · Ausgeschlossen'],
['有效','Active','Aktiv'],
['{done} / {total} 筆已處理','{done} / {total} processed','{done} / {total} bearbeitet'],
['{n} 筆成功或已兌換','{n} successful or already redeemed','{n} erfolgreich oder bereits eingelöst'],
['{n} 組碼','{n} code(s)','{n} Code(s)'],
['等待下一筆（瀏覽器可能延後執行）','Waiting for next item (browser delays are possible)','Warten auf nächsten Eintrag (Browser-Verzögerungen möglich)'],
['等待目前項目回覆，已送出的請求無法撤回','Waiting for the current response; submitted requests cannot be recalled','Warten auf die aktuelle Antwort; gesendete Anfragen können nicht zurückgenommen werden'],
['使用說明','User guide','Anleitung'],
['語言','Language','Sprache'],
['請先載入瀏覽器擴充功能','Load the browser extension first','Zuerst die Browser-Erweiterung laden'],
['你目前是直接開啟 HTML 檔案。請依下列步驟啟用工具；完成後，從擴充功能圖示開啟操作介面。','You opened the HTML file directly. Follow these steps, then open the tool from the extensions menu.','Du hast die HTML-Datei direkt geöffnet. Führe diese Schritte aus und öffne das Tool anschließend über das Erweiterungsmenü.'],
['在 Edge 網址列輸入 edge://extensions；Chrome 則輸入 chrome://extensions。','Enter edge://extensions in Edge, or chrome://extensions in Chrome.','Gib in Edge edge://extensions oder in Chrome chrome://extensions ein.'],
['開啟「開發人員模式」，按「載入解壓縮」（或「載入未封裝項目」）。','Enable Developer mode and click Load unpacked.','Aktiviere den Entwicklermodus und klicke auf Entpackte Erweiterung laden.'],
['選擇內含 manifest.json 的 KingshotBatch 資料夾，不是選 app.html 或 ZIP。','Select the KingshotBatch folder containing manifest.json, not app.html or the ZIP file.','Wähle den Ordner KingshotBatch mit manifest.json, nicht app.html oder die ZIP-Datei.'],
['點擊瀏覽器工具列的擴充功能圖示，選「KINGSHOT 批次兌換助手」，即可新增角色與開始兌換。','Open the browser extensions menu and select KINGSHOT Batch Redemption Helper to add characters and redeem codes.','Öffne das Erweiterungsmenü und wähle KINGSHOT, um Charaktere hinzuzufügen und Codes einzulösen.'],
['步驟 3 要選擇的資料夾：','Folder to select in step 3:','In Schritt 3 auszuwählender Ordner:'],
['擴充功能資料夾','Extension folder','Erweiterungsordner'],
['工具未能啟動','Unable to start the tool','Tool konnte nicht gestartet werden'],
['請確認解壓縮後保留所有檔案，再到擴充功能管理頁面重新載入工具。','Keep all extracted files, then reload the tool on the extensions page.','Behalte alle entpackten Dateien und lade das Tool auf der Erweiterungsseite neu.'],
['預覽模式無法兌換。請先載入擴充功能。','Preview mode cannot redeem codes. Load the extension first.','In der Vorschau können keine Codes eingelöst werden. Lade zuerst die Erweiterung.'],
['背景程式沒有回應，請重新載入擴充功能。','The background worker is not responding. Reload the extension.','Der Hintergrundprozess antwortet nicht. Lade die Erweiterung neu.'],
['這個角色與王國已在清單中。','This player ID and kingdom are already listed.','Diese Spieler-ID und dieses Königreich sind bereits in der Liste.'],
['兌換分頁已關閉，結果已保留在紀錄中。','The redemption tab is closed. Results remain in history.','Der Einlöse-Tab ist geschlossen. Die Ergebnisse bleiben im Verlauf.'],
['匯入檔案不可超過 5 MB。','Import files must not exceed 5 MB.','Importdateien dürfen höchstens 5 MB groß sein.'],
['找不到角色清單。','No character list found.','Keine Charakterliste gefunden.'],
['最多可管理 1000 位角色。','Up to 1,000 characters are supported.','Bis zu 1.000 Charaktere werden unterstützt.'],
['已合併匯入角色；現有角色不覆寫，歷史紀錄不匯入。','Characters merged. Existing entries were kept; history was not imported.','Charaktere zusammengeführt. Bestehende Einträge bleiben erhalten; der Verlauf wurde nicht importiert.'],
['角色 ID 請填入 1–10 位數字。','Player ID must contain 1–10 digits.','Die Spieler-ID muss aus 1–10 Ziffern bestehen.'],
['王國請填入 1–10 位正整數。','Kingdom must be a positive number with 1–10 digits.','Das Königreich muss eine positive Zahl mit 1–10 Ziffern sein.'],
['請輸入最多 20 個字元、不含空白的兌換碼。','Enter a gift code of up to 20 characters without whitespace.','Gib einen Geschenkcode mit höchstens 20 Zeichen ohne Leerzeichen ein.'],
['間隔請設為 10–300 秒。','Set the delay to 10–300 seconds.','Wähle eine Wartezeit von 10–300 Sekunden.'],
['請先新增並勾選至少一個角色。','Add and select at least one character first.','Füge zuerst mindestens einen Charakter hinzu und wähle ihn aus.'],
['本機紀錄顯示已完成。','Local history shows this was already completed.','Laut lokalem Verlauf bereits abgeschlossen.'],
['官方先前已回覆此碼過期，直接略過。','The official site previously reported this code expired. Skipped.','Die offizielle Website hat diesen Code bereits als abgelaufen gemeldet. Übersprungen.'],
['先前結果未明，直接略過，不自動重送。','Previous result unknown. Skipped without resubmission.','Vorheriges Ergebnis unklar. Ohne erneutes Senden übersprungen.'],
['有效碼清單為空或格式錯誤，請先更新。','The active code list is empty or invalid. Refresh it first.','Die Liste aktiver Codes ist leer oder ungültig. Aktualisiere sie zuerst.'],
['來源回覆格式不正確。','Invalid source response format.','Ungültiges Antwortformat der Quelle.'],
['官方網頁載入逾時。','Page loading timed out.','Zeitüberschreitung beim Laden der Seite.'],
['上次執行中斷，結果未明，直接略過且不重送。','The previous attempt was interrupted. Result unknown; skipped without resubmission.','Der vorherige Versuch wurde unterbrochen. Ergebnis unklar; ohne erneutes Senden übersprungen.'],
['停止前尚未送出。','Stopped before submission.','Vor dem Senden gestoppt.'],
['無法讀取官方回覆，直接略過且不重送。','Unable to read the official response. Skipped without resubmission.','Offizielle Antwort nicht lesbar. Ohne erneutes Senden übersprungen.'],
['執行中斷，可能已送出，直接略過：{error}','Interrupted; submission may have occurred. Skipped: {error}','Unterbrochen; Anfrage möglicherweise bereits gesendet. Übersprungen: {error}'],
['官方回覆此碼已過期，剩餘角色直接略過。','The official site reported this code expired. Remaining characters are skipped.','Die offizielle Website meldet den Code als abgelaufen. Verbleibende Charaktere werden übersprungen.'],
['請先完成或停止目前批次，再修改角色。','Finish or stop the current batch before editing characters.','Beende oder stoppe den aktuellen Stapel, bevor du Charaktere bearbeitest.'],
['角色清單格式錯誤，最多 1000 位。','Invalid character list. Maximum: 1,000 characters.','Ungültige Charakterliste. Höchstens 1.000 Charaktere.'],
['相同 ID 與王國不可重複。','Duplicate player ID and kingdom pairs are not allowed.','Doppelte Kombinationen aus Spieler-ID und Königreich sind nicht erlaubt.'],
['目前已有批次，請先完成或停止。','A batch is already active. Finish or stop it first.','Ein Stapel läuft bereits. Beende oder stoppe ihn zuerst.'],
['最新清單尚未取得或已過時，請按「更新清單」後再試。','The latest list is missing or outdated. Refresh the list and try again.','Die aktuelle Liste fehlt oder ist veraltet. Aktualisiere die Liste und versuche es erneut.'],
['沒有尚未使用的有效碼，已到期及所有勾選角色都已領過的碼已排除。','No unused active codes. Expired codes and codes used by all selected characters are excluded.','Keine ungenutzten aktiven Codes. Abgelaufene und von allen ausgewählten Charakteren verwendete Codes sind ausgeschlossen.'],
['來源已列為過期或已移出有效清單，直接略過。','The source lists this code as expired or no longer active. Skipped.','Laut Quelle abgelaufen oder nicht mehr aktiv. Übersprungen.'],
['本機已有成功／已兌換紀錄，直接略過。','Local history shows success or prior redemption. Skipped.','Lokaler Verlauf zeigt Erfolg oder frühere Einlösung. Übersprungen.'],
['不支援的操作。','Unsupported action.','Nicht unterstützte Aktion.'],
['上次清單更新中斷，請重新更新。','The previous list refresh was interrupted. Refresh again.','Die letzte Listenaktualisierung wurde unterbrochen. Aktualisiere erneut.'],
['瀏覽器或背景工作中斷，結果未明，直接略過且不重送。','Browser or background worker interrupted. Result unknown; skipped without resubmission.','Browser oder Hintergrundprozess unterbrochen. Ergebnis unklar; ohne erneutes Senden übersprungen.'],
['頁面已離開官方兌換中心。','The page is no longer at the official redemption center.','Die Seite befindet sich nicht mehr im offiziellen Einlösezentrum.'],
['找不到官方繁體中文表單。請切換為繁體中文，或確認網站是否改版。尚未送出。','Official Traditional Chinese form not found. Set the official site to Traditional Chinese; its layout may also have changed. Nothing submitted.','Offizielles Formular auf Traditionellem Chinesisch nicht gefunden. Stelle die offizielle Website auf Traditionelles Chinesisch; eventuell wurde auch das Layout geändert. Nichts gesendet.'],
['表單填入值不一致，尚未送出。','Form values do not match. Nothing submitted.','Formularwerte stimmen nicht überein. Nichts gesendet.'],
['官方兌換按鈕未啟用，尚未送出。','The official redeem button is disabled. Nothing submitted.','Die offizielle Einlöse-Schaltfläche ist deaktiviert. Nichts gesendet.'],
['已送出，但 18 秒內沒有取得可確認的結果。結果未明，直接略過；不會自動重送。','Submitted, but no definite result within 18 seconds. Result unknown; skipped without automatic resubmission.','Gesendet, aber innerhalb von 18 Sekunden kein eindeutiges Ergebnis. Ergebnis unklar; ohne automatisches erneutes Senden übersprungen.'],
['來源頁面位置不正確。','Unexpected source page address.','Unerwartete Adresse der Quellseite.'],
['來源兌換碼格式異常，停止更新。','Unexpected gift code format at the source. Refresh stopped.','Unerwartetes Codeformat in der Quelle. Aktualisierung gestoppt.'],
['來源清單數量異常，停止更新。','Unexpected number of source codes. Refresh stopped.','Unerwartete Anzahl von Codes in der Quelle. Aktualisierung gestoppt.'],
['未取得網站更新後的有效碼清單，可能被驗證頁阻擋或網站已改版。','Unable to load the updated active list. A verification page may be blocking access, or the site may have changed.','Aktualisierte aktive Liste nicht verfügbar. Möglicherweise blockiert eine Verifizierungsseite den Zugriff oder die Website wurde geändert.']
];
const supported=['zh-TW','en','de'];
const normalize=value=>supported.includes(value)?value:String(value).toLowerCase().startsWith('de')?'de':String(value).toLowerCase().startsWith('en')?'en':'zh-TW';
let language=normalize(globalThis.navigator?.language||'zh-TW');
try{const saved=localStorage.getItem('ks-language');if(saved)language=normalize(saved);}catch{}
const exact=new Map(rows.map(row=>[row[0],row]));
const templates=rows.filter(r=>r[0].includes('{')).map(row=>{
  const names=[];const pieces=row[0].split(/(\{\w+\})/g).map(piece=>{if(/^\{\w+\}$/.test(piece)){const name=piece.slice(1,-1);names.push(name);return ['n','done','total','id'].includes(name)?'([0-9]+)':'([\\s\\S]*?)';}return piece.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');});
  return {row,names,re:new RegExp('^'+pieces.join('')+'$')};
});
function t(value,lang=language,depth=0){
  const input=String(value??''),text=input.trim(),index=lang==='de'?2:1;
  if(lang==='zh-TW'||!text)return input;
  let translated=exact.get(text)?.[index];
  if(translated===undefined)for(const item of templates){const match=text.match(item.re);if(match){translated=item.row[index].replace(/\{(\w+)\}/g,(_,name)=>{const v=match[item.names.indexOf(name)+1];return name==='error'&&depth<3?t(v,lang,depth+1):v;});break;}}
  if(translated===undefined&&text.includes(' · '))translated=text.split(' · ').map(part=>t(part,lang,depth+1)).join(' · ');
  return translated===undefined?input:input.slice(0,input.indexOf(text))+translated+input.slice(input.indexOf(text)+text.length);
}
const staticNodes=[];
function capture(root=document.body){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node;while(node=walker.nextNode())if(node.nodeValue.trim()&&!node.parentElement.closest('script,style,select#language,[data-raw]'))staticNodes.push({node,text:node.nodeValue});
  for(const element of root.querySelectorAll('[placeholder],[aria-label]'))for(const attr of ['placeholder','aria-label'])if(element.hasAttribute(attr))staticNodes.push({element,attr,text:element.getAttribute(attr)});
}
function apply(){
  document.documentElement.lang=language==='zh-TW'?'zh-Hant':language;
  document.title=t('KINGSHOT｜批次兌換助手');
  for(const item of staticNodes){if(item.node?.isConnected)item.node.nodeValue=t(item.text);else if(item.element?.isConnected)item.element.setAttribute(item.attr,t(item.text));}
  const select=document.getElementById('language');if(select)select.value=language;
  const guide=document.getElementById('guide');if(guide)guide.href=`guide-${language}.html`;
}
function setLanguage(value){language=normalize(value);try{localStorage.setItem('ks-language',language);}catch{}apply();globalThis.dispatchEvent?.(new Event('ks-language-changed'));}
globalThis.KS_I18N={rows,t,capture,apply,setLanguage,get language(){return language;},get locale(){return language==='en'?'en-US':language==='de'?'de-DE':'zh-TW';}};
globalThis.addEventListener?.('storage',e=>{if(e.key==='ks-language'){language=normalize(e.newValue);apply();globalThis.dispatchEvent(new Event('ks-language-changed'));}});
})();
