(function () {
  if (window.top !== window) return;
  if (window.__plusSelectionLoaded) return;
  window.__plusSelectionLoaded = true;

  const settingsApi = self.PlusSettings;
  const tts = self.PlusTTS;
  if (!settingsApi) return;

  let settings = null;
  let host = null;
  let root = null;
  let bubble = null;
  let card = null;
  let lastSelection = null;
  let hideTimer = null;
  let busy = false;
  let busyAt = 0;
  let autoKey = '';
  let currentService = '';
  let currentResult = '';

  const STYLE = `
  :host { all: initial; }
  * { box-sizing: border-box; }
  .layer { position: fixed; inset: 0; pointer-events: none; z-index: 2147483600;
    font-family: -apple-system, "Segoe UI", "Microsoft YaHei", Roboto, sans-serif; }
  .bubble { position: absolute; pointer-events: none; display: flex; align-items: center; gap: 4px;
    height: 26px; padding: 0 9px; border-radius: 13px; cursor: pointer; user-select: none;
    background: #1f2430; color: #fff; font-size: 12px; line-height: 1; letter-spacing: .3px;
    box-shadow: 0 3px 10px rgba(0,0,0,.28); opacity: 0; transform: translateY(2px);
    visibility: hidden; transition: opacity .12s ease, transform .12s ease, visibility 0s linear .12s; }
  .bubble.show { opacity: 1; transform: translateY(0); pointer-events: auto; visibility: visible;
    transition: opacity .12s ease, transform .12s ease, visibility 0s; }
  .bubble:hover { background: #2c3444; }
  .bubble svg { width: 13px; height: 13px; }
  .card { position: absolute; pointer-events: none; width: 380px; max-width: calc(100vw - 24px);
    background: #fff; color: #1c1f26; border-radius: 10px; overflow: hidden;
    box-shadow: 0 8px 30px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.07);
    opacity: 0; transform: translateY(4px); visibility: hidden;
    transition: opacity .13s ease, transform .13s ease, visibility 0s linear .13s; }
  .card.show { opacity: 1; transform: translateY(0); pointer-events: auto; visibility: visible;
    transition: opacity .13s ease, transform .13s ease, visibility 0s; }
  .head { display: flex; align-items: center; gap: 6px; padding: 8px 10px;
    border-bottom: 1px solid #eef0f3; background: #fafbfc; }
  .title { font-size: 11.5px; font-weight: 600; color: #5b6472; letter-spacing: .2px; }
  .spacer { flex: 1; }
  .icon-btn { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
    border: 0; background: transparent; border-radius: 5px; cursor: pointer; color: #6b7482; padding: 0; }
  .icon-btn:hover { background: #eceff3; color: #2b3240; }
  .icon-btn.active { background: #e6efff; color: #1668dc; }
  .icon-btn svg { width: 14px; height: 14px; }
  .body { padding: 10px 12px 12px; max-height: 260px; overflow-y: auto; }
  .src { font-size: 11.5px; color: #8a93a1; line-height: 1.5; margin-bottom: 6px;
    max-height: 54px; overflow: hidden; white-space: pre-wrap; word-break: break-word; }
  .out { font-size: 14px; line-height: 1.62; white-space: pre-wrap; word-break: break-word; }
  .out.muted { color: #9aa3b1; font-size: 12.5px; }
  .err { color: #d4380d; font-size: 12.5px; line-height: 1.5; }
  .foot { display: flex; align-items: center; gap: 8px; padding: 7px 10px;
    border-top: 1px solid #eef0f3; background: #fafbfc; font-size: 11px; color: #8a93a1; }
  .spin { width: 12px; height: 12px; border-radius: 50%; border: 1.6px solid #cfd6e0;
    border-top-color: #1668dc; animation: sp .7s linear infinite; }
  @keyframes sp { to { transform: rotate(360deg); } }
  .dark .card { background: #24262b; color: #e6e8ec; box-shadow: 0 8px 30px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.09); }
  .dark .head, .dark .foot { background: #2b2e34; border-color: #383c44; }
  .dark .title { color: #a4acb9; }
  .dark .icon-btn { color: #a4acb9; }
  .dark .icon-btn:hover { background: #383c44; color: #e6e8ec; }
  .dark .icon-btn.active { background: #1d3a63; color: #74a9ff; }
  .dark .src { color: #8b93a1; }
  .dark .foot { color: #8b93a1; }
  .dark .out.muted { color: #7e8794; }
  .tip { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%) translateY(6px);
    background: #1f2430; color: #fff; font-size: 12px; padding: 7px 12px; border-radius: 6px;
    opacity: 0; transition: opacity .16s ease, transform .16s ease; pointer-events: none; white-space: nowrap; }
  .tip.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .words { display: flex; flex-wrap: wrap; gap: 4px; padding: 8px 10px 0; }
  .words:empty { display: none; }
  .wchip { border: 1px solid #e3e7ee; background: #f7f9fc; color: #3b4453; border-radius: 11px;
    padding: 2px 8px; font-size: 11.5px; cursor: pointer; line-height: 1.6; }
  .wchip:hover { border-color: #1668dc; color: #1668dc; }
  .wchip.on { background: #1668dc; border-color: #1668dc; color: #fff; }
  .dark .wchip { background: #2f333a; border-color: #3d424b; color: #c3cad6; }
  .dark .wchip.on { background: #1668dc; border-color: #1668dc; color: #fff; }
  `;

  const ICONS = {
    translate:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
    speak:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    stop:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    copy:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    book:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    open:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'
  };

  function ensureUI() {
    if (host && host.isConnected) return;
    host = document.createElement('div');
    host.id = 'plus-selection-root';
    host.style.cssText = 'all: initial; position: static;';
    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = STYLE;
    shadow.appendChild(style);

    root = document.createElement('div');
    root.className = 'layer';
    shadow.appendChild(root);

    bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = ICONS.translate + '<span>翻译</span>';
    let pendingSelection = null;
    const isolate = function (e) {
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    };
    bubble.addEventListener('pointerdown', function (e) {
      pendingSelection = lastSelection || readSelection();
      isolate(e);
    }, true);
    bubble.addEventListener('mousedown', function (e) {
      e.preventDefault();
      isolate(e);
    }, true);
    ['pointerup', 'mouseup', 'selectstart'].forEach(function (type) {
      bubble.addEventListener(type, isolate, true);
    });
    bubble.addEventListener('click', function (e) {
      e.preventDefault();
      isolate(e);
      const sel = pendingSelection || lastSelection || readSelection();
      if (!sel) {
        toastTip('请先选中要翻译的文字');
        return;
      }
      runTranslate(sel);
    });
    root.appendChild(bubble);

    card = document.createElement('div');
    card.className = 'card';
    card.innerHTML =
      '<div class="head">' +
      '<span class="title">划词翻译</span>' +
      '<span class="spacer"></span>' +
      '<button class="icon-btn" data-act="speakSrc" title="朗读原文">' + ICONS.speak + '</button>' +
      '<button class="icon-btn" data-act="speakOut" title="朗读译文">' + ICONS.speak + '</button>' +
      '<button class="icon-btn" data-act="copy" title="复制译文">' + ICONS.copy + '</button>' +
      '<button class="icon-btn" data-act="panel" title="在侧边栏打开">' + ICONS.open + '</button>' +
      '<button class="icon-btn" data-act="close" title="关闭">' + ICONS.close + '</button>' +
      '</div>' +
      '<div class="body"><div class="src"></div><div class="out muted">正在翻译…</div></div>' +
      '<div class="words"></div>' +
      '<div class="foot"><span class="spin"></span><span class="meta">正在翻译…</span></div>';

    ['pointerdown', 'mousedown', 'pointerup', 'mouseup'].forEach(function (type) {
      card.addEventListener(type, function (e) {
        e.stopPropagation();
      }, true);
    });
    card.addEventListener('click', function (e) {
      const chip = e.target.closest('.wchip');
      if (chip) {
        e.preventDefault();
        e.stopPropagation();
        addChipWord(chip);
        return;
      }
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      onAction(btn.getAttribute('data-act'), btn);
    });
    root.appendChild(card);

    (document.body || document.documentElement).appendChild(host);

    document.addEventListener('mousedown', onDocMouseDown, true);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', hideAll, true);
    document.addEventListener('keydown', onKeyDown, true);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') hideAll();
  }

  function onDocMouseDown(e) {
    if (!host) return;
    const path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(host) !== -1) return;
    hideAll();
  }

  function onScroll() {
    if (card && card.classList.contains('show')) {
      hideCard();
      return;
    }
    scheduleFollow();
  }

  function hideAll() {
    if (bubble) bubble.classList.remove('show');
    if (card) card.classList.remove('show');
    lastSelection = null;
    autoKey = '';
  }

  let followRaf = null;

  function scheduleFollow() {
    if (followRaf) return;
    const raf = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); };
    followRaf = raf(function () {
      followRaf = null;
      followSelection();
    });
  }

  function followSelection() {
    if (!bubble || !bubble.classList.contains('show')) return;
    const found = readSelection();
    if (!found) {
      hideAll();
      return;
    }
    lastSelection = found;
    place(bubble, found.rect, 8, 'above');
  }

  function hideBubble() {
    if (bubble) bubble.classList.remove('show');
  }

  function hideCard() {
    if (card) card.classList.remove('show');
    if (tts) tts.stop();
  }

  function place(el, rect, gap, prefer, fallbackGap) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el.offsetWidth || (el === card ? 380 : 90);
    const h = el.offsetHeight || 26;
    let left = rect.left + rect.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, vw - w - 8));
    const below = rect.bottom + (gap || 8);
    const belowFar = rect.bottom + (fallbackGap || gap || 8);
    const above = rect.top - h - (gap || 8);
    let top;
    const fitsAbove = above >= 8;
    const fitsBelow = below + h <= vh - 8;
    if (prefer === 'above') {
      if (fitsAbove) top = above;
      else if (belowFar + h <= vh - 8) top = belowFar;
      else if (fitsBelow) top = below;
      else top = Math.max(8, Math.min(vh - h - 8, belowFar));
    } else {
      top = fitsBelow ? below : fitsAbove ? above : Math.max(8, Math.min(vh - h - 8, below));
    }
    el.style.left = Math.round(left) + 'px';
    el.style.top = Math.round(top) + 'px';
  }

  function readSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return null;
    const text = sel.toString().replace(/\s+/g, ' ').trim();
    if (!text) return null;
    const range = sel.getRangeAt(0);
    const rects = range.getClientRects();
    const bbox = range.getBoundingClientRect();
    const last = rects.length ? rects[rects.length - 1] : bbox;
    if (!bbox || (!bbox.width && !bbox.height)) return null;
    return { text: text, rect: bbox, last: last };
  }

  function isEditable(node) {
    let el = node && node.nodeType === 1 ? node : node && node.parentElement;
    while (el) {
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      el = el.parentElement;
    }
    return false;
  }

  const MAX_CHARS = 1200;

  function onSelectionChange() {
    if (!settings || settings.selection.mode === 'off') return;
    const found = readSelection();
    if (!found) {
      hideBubble();
      return;
    }
    if (found.text.length > MAX_CHARS) {
      hideBubble();
      return;
    }
    if (settings.selection.mode === 'auto') {
      if (busy) return;
      if (autoKey === found.text) return;
      autoKey = found.text;
      runTranslate(found);
      return;
    }
    lastSelection = found;
    place(bubble, found.rect, 8, 'above');
    bubble.classList.add('show');
  }

  function onMouseUp(e) {
    if (!settings || settings.selection.mode === 'off') return;
    if (host && e.composedPath && e.composedPath().indexOf(host) !== -1) return;
    setTimeout(onSelectionChange, 10);
    setTimeout(onSelectionChange, 130);
    setTimeout(onSelectionChange, 360);
  }

  function isDark() {
    try {
      const nodes = [document.body, document.documentElement];
      for (const node of nodes) {
        if (!node) continue;
        const bg = getComputedStyle(node).backgroundColor;
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(bg || '');
        if (!m) continue;
        const alpha = m[4] === undefined ? 1 : Number(m[4]);
        if (alpha < 0.4) continue;
        const lum = (Number(m[1]) * 299 + Number(m[2]) * 587 + Number(m[3]) * 114) / 1000;
        return lum < 110;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  function renderCard(sel) {
    ensureUI();
    const dark = isDark();
    root.classList.toggle('dark', dark);
    card.querySelector('.src').textContent = sel.text;
    card.querySelector('.out').textContent = '正在翻译…';
    card.querySelector('.out').className = 'out muted';
    card.querySelector('.meta').textContent = '正在翻译…';
    card.querySelector('.foot .spin').style.display = '';
    renderWordChips(sel.text);
    place(card, sel.rect, 10, 'above', 46);
    card.classList.add('show');
  }

  function renderWordChips(text) {
    const box = card.querySelector('.words');
    if (!box) return;
    box.innerHTML = '';
    currentWords = [];
    const seen = {};
    const tokens = String(text || '').match(/[A-Za-z][A-Za-z'’-]{2,}/g) || [];
    tokens.forEach(function (raw) {
      const word = raw.replace(/^[-']+|[-']+$/g, '');
      const key = word.toLowerCase();
      if (!word || seen[key]) return;
      seen[key] = true;
      currentWords.push(word);
    });
    currentWords = currentWords.slice(0, 24);
    const wordbook = self.PlusWordbook;
    const existing = {};
    if (wordbook) {
      wordbook.readAll().then(function (data) {
        data.words.forEach(function (w) {
          existing[String(w.word).toLowerCase()] = true;
        });
        paintChips(existing);
      });
    } else {
      paintChips(existing);
    }
  }

  function paintChips(existing) {
    const box = card && card.querySelector('.words');
    if (!box) return;
    box.innerHTML = '';
    currentWords.forEach(function (word) {
      const chip = document.createElement('button');
      chip.className = 'wchip' + (existing[word.toLowerCase()] ? ' on' : '');
      chip.textContent = word;
      chip.title = existing[word.toLowerCase()] ? '已在生词本' : '点击加入生词本';
      box.appendChild(chip);
    });
  }

  function addChipWord(chip) {
    const wordbook = self.PlusWordbook;
    if (!wordbook) return;
    const word = chip.textContent;
    if (chip.classList.contains('on')) {
      wordbook.remove(word).then(function () {
        chip.classList.remove('on');
        chip.title = '点击加入生词本';
        toastTip('已从生词本移除');
      });
      return;
    }
    wordbook.add([word], { source: '划词收藏' }).then(function (res) {
      chip.classList.add('on');
      chip.title = '已在生词本';
      toastTip(res.added.length ? '已加入生词本' : '这个词已在生词本');
    });
  }

  function runTranslate(sel) {
    if (busy) {
      if (Date.now() - busyAt < 90000) return;
      busy = false;
    }
    lastSelection = sel;
    hideBubble();
    renderCard(sel);
    busy = true;
    busyAt = Date.now();
    currentResult = '';

    const targetLang = settings.targetLang || 'zh_cn';
    settingsApi
      .enabledServices()
      .then(function (info) {
        const service = settingsApi.pickService(info.services, settings.selection.service);
        if (!service) throw new Error('请先在设置里启用一个翻译服务');
        currentService = service;
        card.querySelector('.title').textContent = '划词翻译 · ' + service;
        return settingsApi.translate({
          text: sel.text,
          targetLang: targetLang,
          service: service,
          onProgress: function (partial) {
            if (!partial) return;
            const out = card.querySelector('.out');
            out.textContent = partial;
            out.className = 'out';
          }
        });
      })
      .then(function (text) {
        currentResult = text || '';
        const out = card.querySelector('.out');
        out.textContent = currentResult || '（空结果）';
        out.className = 'out';
        card.querySelector('.foot .spin').style.display = 'none';
        card.querySelector('.meta').textContent = settingsApi.langName(targetLang);
        if (lastSelection) place(card, lastSelection.rect, 10, 'above', 46);
        if (settings.tts && settings.tts.autoSpeakTranslation && currentResult) {
          speakText(currentResult, targetLang, card.querySelector('[data-act="speakOut"]'));
        }
      })
      .catch(function (err) {
        const out = card.querySelector('.out');
        out.textContent = (err && err.message) || '翻译失败';
        out.className = 'out err';
        card.querySelector('.foot .spin').style.display = 'none';
        card.querySelector('.meta').textContent = '翻译失败';
      })
      .then(function () {
        busy = false;
      });
  }

  function speakText(text, langCode, btn) {
    if (!tts || !tts.supported) return;
    if (btn && btn.classList.contains('active')) {
      tts.stop();
      btn.classList.remove('active');
      return;
    }
    card.querySelectorAll('[data-act^="speak"]').forEach(function (b) {
      b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
    tts
      .speak(text, {
        lang: settingsApi.bcp47(langCode),
        rate: settings.tts.rate,
        voiceURI: settings.tts.voiceURI
      })
      .catch(function () {})
      .then(function () {
        if (btn) btn.classList.remove('active');
      });
  }

  function onAction(act, btn) {
    if (!lastSelection) return;
    if (act === 'close') {
      hideCard();
      return;
    }
    if (act === 'copy') {
      if (!currentResult) return;
      navigator.clipboard
        .writeText(currentResult)
        .then(function () {
          btn.classList.add('active');
          setTimeout(function () {
            btn.classList.remove('active');
          }, 900);
        })
        .catch(function () {});
      return;
    }
    if (act === 'panel') {
      try {
        chrome.runtime.sendMessage({ name: 'plusOpenPanel', data: { text: lastSelection.text } });
      } catch (e) {}
      if (currentResult) {
        navigator.clipboard.writeText(currentResult).catch(function () {});
        toastTip('译文已复制');
      }
      return;
    }
    if (act === 'speakSrc') {
      speakText(lastSelection.text, settingsApi.detectSourceLang(lastSelection.text), btn);
      return;
    }
    if (act === 'speakOut') {
      if (!currentResult) return;
      speakText(currentResult, settings.targetLang || 'zh_cn', btn);
    }
  }

  function toastTip(msg) {
    if (!ensureUI) return;
    let tip = root.querySelector('.tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'tip';
      root.appendChild(tip);
    }
    tip.textContent = msg;
    tip.classList.add('show');
    clearTimeout(toastTip.timer);
    toastTip.timer = setTimeout(function () {
      tip.classList.remove('show');
    }, 2200);
  }

  function init() {
    settingsApi.get().then(function (s) {
      settings = s;
      if (s.selection.mode === 'off') return;
      ensureUI();
      document.addEventListener('mouseup', onMouseUp, true);
      document.addEventListener('selectionchange', function () {
        if (settings.selection.mode === 'auto') onSelectionChange();
      });
    });
    settingsApi.onChange(function (s) {
      settings = s;
      if (s.selection.mode === 'off') hideAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
