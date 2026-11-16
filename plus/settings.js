(function () {
  const KEY = 'plusSettings';

  const DEFAULTS = {
    targetLang: 'zh_cn',
    tts: {
      rate: 1,
      voiceURI: '',
      autoSpeakTranslation: false
    },
    selection: {
      mode: 'bubble',
      service: '',
      wordPopup: true
    }
  };

  function merge(base, patch) {
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    if (!patch || typeof patch !== 'object') return out;
    for (const k of Object.keys(patch)) {
      const b = out[k];
      const p = patch[k];
      if (b && p && typeof b === 'object' && typeof p === 'object' && !Array.isArray(b)) {
        out[k] = merge(b, p);
      } else if (p !== undefined) {
        out[k] = p;
      }
    }
    return out;
  }

  const OBSOLETE = {
    tts: ['pitch', 'volume'],
    selection: ['enabled', 'trigger', 'maxChars', 'targetLang', 'pitch', 'volume']
  };

  function migrate(raw) {
    const stored = raw && typeof raw === 'object' ? raw : {};
    const merged = merge(DEFAULTS, stored);

    const oldSel = stored.selection || {};
    if (merged.selection.mode === DEFAULTS.selection.mode && oldSel.mode === undefined) {
      if (oldSel.enabled === false) merged.selection.mode = 'off';
      else if (oldSel.trigger === 'auto') merged.selection.mode = 'auto';
    }
    if (['off', 'bubble', 'auto'].indexOf(merged.selection.mode) === -1) {
      merged.selection.mode = DEFAULTS.selection.mode;
    }

    if (oldSel.targetLang && stored.targetLang === undefined) {
      merged.targetLang = oldSel.targetLang;
    }

    Object.keys(OBSOLETE).forEach(function (group) {
      OBSOLETE[group].forEach(function (field) {
        if (merged[group]) delete merged[group][field];
      });
    });
    return merged;
  }

  function get() {
    return new Promise(function (resolve) {
      chrome.storage.local.get(KEY, function (res) {
        const raw = res && res[KEY];
        const next = migrate(raw);
        if (!raw || JSON.stringify(raw) !== JSON.stringify(next)) {
          chrome.storage.local.set({ [KEY]: next });
        }
        resolve(next);
      });
    });
  }

  function set(patch) {
    return get().then(function (current) {
      const next = merge(current, patch);
      return new Promise(function (resolve) {
        chrome.storage.local.set({ [KEY]: next }, function () {
          resolve(next);
        });
      });
    });
  }

  function onChange(handler) {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area !== 'local' || !changes[KEY]) return;
      handler(migrate(changes[KEY].newValue));
    });
  }

  const SERVICE_ORDER = [
    'Google',
    'Microsoft',
    'DeepL',
    'Tencent',
    'ByteDance',
    'OpenAI',
    'DeepSeek',
    'Moonshot',
    'xAI'
  ];

  function enabledServices() {
    return new Promise(function (resolve) {
      chrome.storage.local.get(['translateServiceStatus', 'generalForm'], function (res) {
        const status = res.translateServiceStatus || {};
        const names = Object.keys(status).filter(function (n) {
          return status[n];
        });
        names.sort(function (a, b) {
          const ia = SERVICE_ORDER.indexOf(a);
          const ib = SERVICE_ORDER.indexOf(b);
          if (ia === -1 && ib === -1) return a.localeCompare(b);
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        });
        resolve({ services: names, nativeLang: (res.generalForm && res.generalForm.nativeLanguage) || 'zh_cn' });
      });
    });
  }

  function pickService(services, preferred) {
    if (!services || !services.length) return '';
    if (preferred && services.indexOf(preferred) !== -1) return preferred;
    if (services.indexOf('Google') !== -1) return 'Google';
    return services[0];
  }

  function langName(code) {
    const map = self.PLUS_LANG_NAMES || {};
    return map[code] || code;
  }

  function bcp47(code) {
    if (!code) return 'en-US';
    const c = String(code).replace('_', '-');
    const full = {
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'en': 'en-US',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'es': 'es-ES',
      'ru': 'ru-RU',
      'pt': 'pt-PT',
      'it': 'it-IT'
    };
    if (full[c]) return full[c];
    if (/^[a-z]{2,3}$/i.test(c)) return c.toLowerCase() + '-' + c.toUpperCase();
    return c;
  }

  function detectSourceLang(text) {
    if (!text) return 'en';
    const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const kana = (text.match(/[\u3040-\u30ff]/g) || []).length;
    const hangul = (text.match(/[\uac00-\ud7af]/g) || []).length;
    if (kana > 0) return 'ja';
    if (hangul > 0) return 'ko';
    if (cjk > 0) return 'zh_cn';
    if (/[\u0400-\u04ff]/.test(text)) return 'ru';
    return 'en';
  }

  function translate(opts) {
    return new Promise(function (resolve, reject) {
      const text = String(opts.text || '');
      if (!text.trim()) {
        reject(new Error('没有可翻译的内容'));
        return;
      }
      const port = chrome.runtime.connect({ name: 'portMessage' });
      const id = 'plus_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
      let settled = false;
      const finish = function (fn, value) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try {
          port.disconnect();
        } catch (e) {}
        fn(value);
      };
      const timer = setTimeout(function () {
        finish(reject, new Error('翻译超时'));
      }, 120000);

      port.onMessage.addListener(function (msg) {
        if (!msg || msg.name !== 'translateContentResponse') return;
        const data = msg.data || {};
        if (data.id !== id) return;
        if (data.status === 'Finish') finish(resolve, data.content || '');
        else if (data.status === 'Error') finish(reject, new Error(data.content || '翻译失败'));
        else if (data.status === 'Translating' && opts.onProgress) opts.onProgress(data.content || '');
      });

      port.onDisconnect.addListener(function () {
        if (!settled) finish(reject, new Error('后台连接已断开'));
      });

      try {
        port.postMessage({
          name: 'translateContent',
          data: {
            id: id,
            content: text,
            languageCode: opts.targetLang || 'zh_cn',
            translateService: opts.service,
            type: 'SidePanelTranslate'
          }
        });
      } catch (e) {
        finish(reject, e);
      }
    });
  }

  function abort(service) {
    try {
      chrome.runtime.sendMessage({ name: 'abortTranslation', data: { translateService: service, type: 'SidePanelTranslate' } });
    } catch (e) {}
  }

  self.PlusSettings = {
    KEY: KEY,
    DEFAULTS: DEFAULTS,
    get: get,
    set: set,
    onChange: onChange,
    enabledServices: enabledServices,
    pickService: pickService,
    langName: langName,
    bcp47: bcp47,
    detectSourceLang: detectSourceLang,
    translate: translate,
    abort: abort
  };
})();
