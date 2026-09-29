// Classic scripts can load from file://. Only import modules on a supported origin.
(() => {
  KS_I18N.capture(); KS_I18N.apply();
  document.getElementById("language").onchange=e=>KS_I18N.setLanguage(e.target.value);
  const showGuide = (title, explanation) => {
    const main = document.querySelector('main');
    const card = document.createElement('section');
    card.className = 'card';
    card.style.cssText = 'margin:32px 0;padding:30px;line-height:1.9';
    const heading = document.createElement('h1');
    heading.style.fontSize = '28px';
    heading.textContent = title;
    const paragraph = document.createElement('p');
    paragraph.textContent = explanation;
    const list = document.createElement('ol');
    for (const text of [
      '在 Edge 網址列輸入 edge://extensions；Chrome 則輸入 chrome://extensions。',
      '開啟「開發人員模式」，按「載入解壓縮」（或「載入未封裝項目」）。',
      '選擇內含 manifest.json 的 KingshotBatch 資料夾，不是選 app.html 或 ZIP。',
      '點擊瀏覽器工具列的擴充功能圖示，選「KINGSHOT 批次兌換助手」，即可新增角色與開始兌換。'
    ]) {
      const item = document.createElement('li');
      item.textContent = text;
      list.append(item);
    }
    card.append(heading, paragraph, list);
    if (location.protocol === 'file:') {
      const label = document.createElement('p');
      label.textContent = '步驟 3 要選擇的資料夾：';
      const folder = document.createElement('input');
      folder.readOnly = true;
      folder.setAttribute('aria-label', '擴充功能資料夾');
      folder.value = decodeURIComponent(location.pathname).replace(/\/[^/]*$/, '').replace(/^\/(?=[A-Za-z]:)/, '').replaceAll('/', '\\');
      folder.addEventListener('click', () => folder.select());
      card.append(label, folder);
    }
    main.replaceChildren(card);
    document.getElementById('role-dialog')?.remove();
    KS_I18N.capture(card); KS_I18N.apply();
  };
  if (location.protocol === 'file:') {
    showGuide('請先載入瀏覽器擴充功能', '你目前是直接開啟 HTML 檔案。請依下列步驟啟用工具；完成後，從擴充功能圖示開啟操作介面。');
    return;
  }
  import('./app.js').catch(error => {
    console.error('KINGSHOT 啟動失敗：', error);
    showGuide('工具未能啟動', '請確認解壓縮後保留所有檔案，再到擴充功能管理頁面重新載入工具。');
  });
})();
