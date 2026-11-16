(function () {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  let voices = [];
  const voiceWaiters = [];
  let current = null;

  function refreshVoices() {
    if (!synth) return [];
    const list = synth.getVoices() || [];
    if (list.length) {
      voices = list.slice().sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      while (voiceWaiters.length) {
        const fn = voiceWaiters.shift();
        try {
          fn(voices);
        } catch (e) {}
      }
    }
    return voices;
  }

  function getVoices() {
    if (!synth) return Promise.resolve([]);
    const list = refreshVoices();
    if (list.length) return Promise.resolve(list);
    return new Promise(function (resolve) {
      voiceWaiters.push(resolve);
      setTimeout(function () {
        const idx = voiceWaiters.indexOf(resolve);
        if (idx !== -1) {
          voiceWaiters.splice(idx, 1);
          resolve(refreshVoices());
        }
      }, 3000);
    });
  }

  if (synth) {
    refreshVoices();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', refreshVoices);
    } else {
      synth.onvoiceschanged = refreshVoices;
    }
  }

  function normalize(lang) {
    return String(lang || '').replace('_', '-').toLowerCase();
  }

  function scoreVoice(voice, lang) {
    const vl = normalize(voice.lang);
    const target = normalize(lang);
    if (!target) return 0;
    if (vl === target) return 100;
    const base = target.split('-')[0];
    if (vl === base) return 80;
    if (vl.split('-')[0] === base) return 60;
    return 0;
  }

  function pickVoice(lang, preferredURI) {
    const list = voices.length ? voices : refreshVoices();
    if (!list.length) return null;
    if (preferredURI) {
      const hit = list.filter(function (v) {
        return v.voiceURI === preferredURI;
      })[0];
      if (hit) return hit;
    }
    let best = null;
    let bestScore = 0;
    for (const v of list) {
      const s = scoreVoice(v, lang);
      if (s > bestScore) {
        bestScore = s;
        best = v;
      }
    }
    if (best) {
      const local = list.filter(function (v) {
        return scoreVoice(v, lang) === bestScore && v.localService;
      })[0];
      return local || best;
    }
    return null;
  }

  function speak(text, opts) {
    return new Promise(function (resolve, reject) {
      const content = String(text || '').trim();
      if (!content) {
        reject(new Error('没有可朗读的内容'));
        return;
      }
      if (!synth) {
        reject(new Error('当前环境不支持语音合成'));
        return;
      }
      const options = opts || {};
      stop();

      const utter = new SpeechSynthesisUtterance(content.slice(0, 30000));
      const lang = options.lang || 'en-US';
      utter.lang = lang;
      utter.rate = clamp(options.rate, 0.5, 2, 1);
      utter.pitch = 1;
      utter.volume = 1;

      const voice = pickVoice(lang, options.voiceURI);
      if (voice) {
        utter.voice = voice;
        if (voice.lang) utter.lang = voice.lang;
      }

      current = { utter: utter, resolve: resolve, reject: reject };
      utter.onend = function () {
        if (current && current.utter === utter) current = null;
        resolve();
      };
      utter.onerror = function (ev) {
        if (current && current.utter === utter) current = null;
        const reason = ev && ev.error ? ev.error : 'speech-error';
        if (reason === 'interrupted' || reason === 'canceled') resolve();
        else reject(new Error(reason));
      };
      synth.speak(utter);
    });
  }

  function clamp(value, min, max, fallback) {
    const n = Number(value);
    if (!isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function stop() {
    if (!synth) return;
    try {
      synth.cancel();
    } catch (e) {}
    if (current) {
      const r = current.resolve;
      current = null;
      try {
        r();
      } catch (e) {}
    }
  }

  function speaking() {
    return !!(synth && (synth.speaking || synth.pending));
  }

  self.PlusTTS = {
    supported: !!synth,
    getVoices: getVoices,
    speak: speak,
    stop: stop,
    speaking: speaking,
    pickVoice: pickVoice
  };
})();
