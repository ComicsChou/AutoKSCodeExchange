import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const base=new URL('../',import.meta.url);
const code=fs.readFileSync(new URL('languages.js',base),'utf8');
const storage=new Map();
function context(){const ctx=vm.createContext({navigator:{language:'en-US'},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},document:{documentElement:{},getElementById:()=>null},Event:class{},dispatchEvent:()=>{}});vm.runInContext(code,ctx);return ctx;}
const ctx=context(),i=ctx.KS_I18N;
test('all translation rows have complete English/German values and matching placeholders',()=>{
  const seen=new Set();
  for(const row of i.rows){assert.equal(row.length,3);assert.ok(!seen.has(row[0]),row[0]);seen.add(row[0]);for(const s of row){assert.ok(s.trim());assert.deepEqual([...s.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort(),[...row[0].matchAll(/\{\w+\}/g)].map(m=>m[0]).sort());}}
});
test('dynamic counts and multi-part summaries translate without changing values',()=>{
  assert.equal(i.t('已選擇 12 位角色','en'),'Selected characters: 12');
  assert.equal(i.t('已選擇 12 位角色','de'),'Ausgewählte Charaktere: 12');
  const summary='1 / 4 筆已處理 · 1 筆成功或已兌換 · 2 組碼';
  assert.equal(i.t(summary,'en'),'1 / 4 processed · 1 successful or already redeemed · 2 code(s)');
  assert.ok(!/[\u3400-\u9fff]/.test(i.t(summary,'de')));
  assert.equal(i.t('VIP777','de'),'VIP777');assert.equal(i.t('  10 秒  ','de'),'  10 Sekunden  ');
});
test('nested source error and validation messages translate',()=>{
  for(const lang of ['en','de']){
    assert.ok(!/[\u3400-\u9fff]/.test(i.t('更新失敗：來源回覆格式不正確。。保留先前紀錄，暫不使用舊清單。',lang)));
    assert.notEqual(i.t('角色 ID 請填入 1–10 位數字。',lang),'角色 ID 請填入 1–10 位數字。');
  }
});
test('language persists across initialization and invalid values fall back safely',()=>{
  i.setLanguage('de');assert.equal(storage.get('ks-language'),'de');assert.equal(context().KS_I18N.language,'de');
  i.setLanguage('zh-TW');assert.equal(context().KS_I18N.language,'zh-TW');i.setLanguage('unknown');assert.equal(i.language,'zh-TW');
});
test('all static Chinese UI strings have translations; help and manifest locales exist',()=>{
  const html=fs.readFileSync(new URL('app.html',base),'utf8');
  const texts=[...html.matchAll(/>([^<>]+)</g)].map(m=>m[1]);
  texts.push(...[...html.matchAll(/(?:placeholder|aria-label)="([^"]+)"/g)].map(m=>m[1]));
  for(const text of texts.filter(t=>/[\u3400-\u9fff]/.test(t)&&t!=='繁體中文'))for(const lang of ['en','de'])assert.notEqual(i.t(text,lang),text,text);
  for(const lang of ['en','de','zh-TW'])assert.ok(fs.existsSync(new URL(`guide-${lang}.html`,base)));
  for(const lang of ['en','de','zh_TW'])assert.ok(JSON.parse(fs.readFileSync(new URL(`_locales/${lang}/messages.json`,base),'utf8')).appName.message);
});
