(function () {
  const S = self.PlusSettings;
  const TTS = self.PlusTTS;
  const LANGS = self.PLUS_LANGS || [];

  const ICONS = {
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    speak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    reload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
    translate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13v8"/><path d="m8 17 4-4 4 4"/><path d="M20.4 14.5A5 5 0 0 0 18 5h-1.3A8 8 0 1 0 4 13.9"/></svg>'
    ,
    push: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v10"/><path d="M8 7h8"/><path d="M20.4 16.5A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 15.9"/></svg>'
  };

  const state = {
    text: '',
    targetLang: 'zh_cn',
    services: [],
    results: [],
    busy: false,
    settings: null,
    pickMode: false,
    picked: {},
    words: [],
    bookMeta: {},
    translations: {},
    translating: {},
    syncing: false,
    wordPop: null,
    pointer: null
  };

  const app = document.getElementById('app');
  let els = {};

  function h(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k of Object.keys(attrs)) {
        const v = attrs[k];
        if (v === undefined || v === null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    if (children) {
      for (const c of [].concat(children)) {
        if (c === null || c === undefined || c === false) continue;
        el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return el;
  }

  function build() {
    els.textarea = h('textarea', {
      placeholder: 'Enter content here...',
      spellcheck: 'false',
      oninput: function (e) {
        state.text = e.target.value;
        updateCount();
        els.btnTranslate.disabled = !state.text.trim();
      },
      onkeydown: function (e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          translateAll();
        }
      }
    });
    els.textarea.addEventListener('select', scheduleWordPop);
    els.textarea.addEventListener('keyup', scheduleWordPop);
    els.textarea.addEventListener('mouseup', function (e) {
      state.pointer = { x: e.clientX, y: e.clientY };
      scheduleWordPop();
    });
    els.textarea.addEventListener('mousedown', function (e) {
      state.pointer = { x: e.clientX, y: e.clientY };
    });
    els.textarea.addEventListener('blur', function () {
      setTimeout(function () {
        if (els.wordPop && els.wordPop.contains(document.activeElement)) return;
        hideWordPop();
      }, 180);
    });

    els.count = h('span', { class: 'pill', text: '0 Chars' });
    els.btnClear = h('button', { class: 'icon', title: '清空', html: ICONS.trash, onclick: clearAll });
    els.btnSpeakSrc = h('button', { class: 'icon', title: '朗读原文', html: ICONS.speak, onclick: speakSource });
    els.btnPick = h('button', {
      class: 'icon',
      title: '取词模式：点单词加入生词本',
      html: ICONS.plus,
      onclick: togglePickMode
    });
    els.btnBook = h('button', {
      class: 'icon',
      title: '生词本',
      html: ICONS.book,
      onclick: openBook
    });

    els.select = h('select', {
      class: 'lang',
      onchange: function (e) {
        state.targetLang = e.target.value;
        S.set({ targetLang: e.target.value });
        if (state.text.trim()) translateAll();
      }
    });

    els.btnTranslate = h('button', {
      class: 'btn-primary',
      html: ICONS.translate + '<span>Translate</span>',
      disabled: true,
      onclick: translateAll
    });

    els.results = h('div', { class: 'results' });

    els.pickLayer = h('div', { class: 'pick-layer' });
    els.pickCount = h('span', { class: 'pick-count', text: '已选 0 个' });
    els.pickHint = h('div', { class: 'pick-hint', text: '取词模式：点原文里的单词，逐个加入生词本' });
    els.pickHint.style.display = 'none';
    els.pickBar = h('div', { class: 'pick-bar' }, [
      els.pickCount,
      h('div', { class: 'grow' }),
      h('button', { class: 'btn-small', text: '清空', onclick: function () { state.picked = {}; renderPick(); renderPickBar(); } }),
      h('button', { class: 'btn-small primary', text: '加入生词本', onclick: commitPicked })
    ]);

    els.sheet = h('div', { class: 'sheet' });
    els.drawer = h('div', {
      class: 'drawer',
      onclick: function (e) {
        if (e.target === els.drawer) closeDrawer();
      }
    }, [els.sheet]);

    els.toast = h('div', { class: 'toast' });
    els.wordPop = h('div', { class: 'word-pop' });

    app.append(
      h('div', { class: 'top' }, [
        h('div', { class: 'brand', html: 'Translator <span>Plus</span>' }),
        h('div', { class: 'grow' }),
        h('button', { class: 'icon', title: '重新加载', html: ICONS.reload, onclick: function () { location.reload(); } }),
        h('button', { class: 'icon', title: '翻译服务与 API 设置', html: ICONS.external, onclick: function () { chrome.runtime.openOptionsPage(); } }),
        els.btnBook,
        h('button', { class: 'icon', title: '朗读与划词设置', html: ICONS.settings, onclick: openDrawer })
      ]),
      h('div', { class: 'main' }, [
        h('div', { class: 'editor' }, [
          els.textarea,
          els.pickLayer,
          h('div', { class: 'tools' }, [
            h('button', { class: 'icon', title: '复制原文', html: ICONS.copy, onclick: copySource }),
            els.btnSpeakSrc,
            els.btnPick,
            els.count,
            h('div', { class: 'grow' }),
            els.btnClear
          ])
        ]),
        els.pickHint,
        els.pickBar,
        h('div', { class: 'row' }, [h('div', { class: 'select-wrap' }, [els.select]), els.btnTranslate]),
        els.results
      ]),
      els.drawer,
      els.wordPop,
      els.toast
    );

    document.addEventListener('mousedown', function (e) {
      if (!els.wordPop || !els.wordPop.classList.contains('show')) return;
      if (els.wordPop.contains(e.target)) return;
      hideWordPop();
    }, true);
    document.addEventListener('mouseup', function (e) {
      if (els.wordPop && els.wordPop.contains(e.target)) return;
      const main = e.target && e.target.closest && e.target.closest('.main');
      if (!main) return;
      if (e.target === els.textarea) return;
      state.pointer = { x: e.clientX, y: e.clientY };
      scheduleWordPop();
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideWordPop();
    }, true);

    LANGS.forEach(function (l) {
      els.select.appendChild(h('option', { value: l.code, text: l.name }));
    });
    els.select.value = state.targetLang;
  }

  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () {
      els.toast.classList.remove('show');
    }, 1600);
  }

  function updateCount() {
    els.count.textContent = state.text.length + ' Chars';
    els.count.classList.toggle('warn', state.text.length > 5000);
  }

  function tokenize(text) {
    const out = [];
    const re = /([A-Za-z][A-Za-z'’-]*)|([^A-Za-z]+)/g;
    let m;
    while ((m = re.exec(text))) {
      if (m[1]) out.push({ type: 'word', value: m[1] });
      else out.push({ type: 'gap', value: m[2] });
    }
    return out;
  }

  function renderPick() {
    if (!els.pickLayer) return;
    els.pickLayer.innerHTML = '';
    if (!state.pickMode) {
      els.pickLayer.style.display = '';
      els.textarea.style.display = '';
      els.pickHint.style.display = 'none';
      return;
    }
    els.pickLayer.style.display = 'block';
    els.textarea.style.display = 'none';
    els.pickHint.style.display = 'block';

    tokenize(state.text).forEach(function (tok) {
      if (tok.type === 'gap') {
        els.pickLayer.appendChild(document.createTextNode(tok.value));
        return;
      }
      const key = tok.value.toLowerCase();
      const on = !!state.picked[key];
      const chip = h('span', {
        class: 'word' + (on ? ' on' : ''),
        text: tok.value,
        onclick: function () {
          if (state.picked[key]) delete state.picked[key];
          else state.picked[key] = tok.value;
          renderPick();
          renderPickBar();
        }
      });
      els.pickLayer.appendChild(chip);
    });
    els.pickLayer.scrollTop = 0;
  }

  function renderPickBar() {
    if (!els.pickBar) return;
    const count = Object.keys(state.picked).length;
    els.pickBar.style.display = state.pickMode && count ? 'flex' : 'none';
    if (els.pickCount) els.pickCount.textContent = '已选 ' + count + ' 个';
  }

  function togglePickMode() {
    state.pickMode = !state.pickMode;
    els.btnPick.classList.toggle('on', state.pickMode);
    renderPick();
    renderPickBar();
    if (state.pickMode) toast('点单词即可选中，再点取消');
  }

  function commitPicked() {
    const words = Object.keys(state.picked).map(function (k) {
      return state.picked[k];
    });
    if (!words.length) return;
    self.PlusWordbook.add(words, { source: '原文取词' }).then(function (res) {
      state.picked = {};
      renderPick();
      renderPickBar();
      toast('已加入生词本 ' + res.added.length + ' 个，共 ' + res.total + ' 个');
    });
  }

  function openBook() {
    if (els.bookDrawer) {
      els.bookDrawer.classList.add('open');
      renderBook();
      return;
    }
    els.bookBody = h('div', { class: 'book-body' });
    els.bookSheet = h('div', { class: 'sheet book-sheet' }, [
      h('div', { class: 'book-head' }, [
        h('span', { class: 'book-title', text: '生词本' }),
        h('div', { class: 'grow' }),
        h('button', { class: 'icon', title: '关闭', html: ICONS.chevron, onclick: function () { els.bookDrawer.classList.remove('open'); } })
      ]),
      els.bookBody
    ]);
    els.bookDrawer = h('div', {
      class: 'drawer open',
      onclick: function (e) {
        if (e.target === els.bookDrawer) els.bookDrawer.classList.remove('open');
      }
    }, [els.bookSheet]);
    app.appendChild(els.bookDrawer);
    renderBook();
  }

  function renderBook() {
    if (!els.bookBody) return;
    els.bookBody.innerHTML = '';

    self.PlusWordbook.readAll().then(function (data) {
      state.words = data.words;
      state.bookMeta = data.meta;
      els.bookBody.innerHTML = '';

      const count = data.words.length;
      const stat = h('div', { class: 'book-stat' }, [
        h('span', { text: '共 ' + count + ' 个单词' }),
        h('div', { class: 'grow' })
      ]);
      if (count) {
        stat.appendChild(
          h('button', {
            class: 'btn-small',
            text: '清空',
            onclick: function () {
              stat.innerHTML = '';
              stat.classList.add('confirm');
              stat.appendChild(h('span', { text: '清空 ' + count + ' 个单词？' }));
              stat.appendChild(h('div', { class: 'grow' }));
              stat.appendChild(
                h('button', {
                  class: 'btn-small danger',
                  text: '确认清空',
                  onclick: function () {
                    self.PlusWordbook.clear().then(function () {
                      renderBook();
                      toast('已清空生词本');
                    });
                  }
                })
              );
              stat.appendChild(
                h('button', {
                  class: 'btn-small',
                  text: '取消',
                  onclick: function () {
                    renderBook();
                  }
                })
              );
            }
          })
        );
      }
      els.bookBody.appendChild(stat);

      els.bookBody.appendChild(
        h('div', { class: 'book-actions' }, [
          h('button', {
            class: 'btn-small primary',
            html: ICONS.copy + '<span>复制全部</span>',
            disabled: !count,
            onclick: function () {
              self.PlusWordbook.text().then(function (txt) {
                if (!txt) return;
                copyText(txt)
                  .then(function () {
                    toast('已复制 ' + count + ' 个单词，可粘贴到墨墨');
                  })
                  .catch(function () {
                    toast('复制失败，请手动选择列表复制');
                  });
              });
            }
          }),
          h('button', {
            class: 'btn-small',
            html: ICONS.cloud + '<span>同步到墨墨</span>',
            disabled: !count,
            onclick: syncBookToMaimemo
          })
        ])
      );

      if (!count) {
        els.bookBody.appendChild(
          h('div', { class: 'book-empty', text: '还没有单词。切到「取词模式」，点原文里的单词即可收集。' })
        );
        renderBookSettings();
        return;
      }

      const list = h('div', { class: 'book-list' });
      data.words.forEach(function (w) {
        list.appendChild(renderBookRow(w));
      });
      els.bookBody.appendChild(list);
      renderBookSettings();
    });
  }

  function renderBookRow(w) {
    const key = String(w.word).toLowerCase();
    const cached = state.translations[key] || '';

    const btnSpeak = h('button', {
      class: 'icon small',
      title: '朗读这个单词',
      html: ICONS.speak,
      onclick: function () {
        speak(w.word, 'en', btnSpeak);
      }
    });
    const btnTrans = h('button', {
      class: 'icon small',
      title: '翻译这个单词',
      html: ICONS.translate,
      onclick: function () {
        if (state.translations[key]) {
          delete state.translations[key];
          renderBook();
          return;
        }
        if (state.translating[key]) return;
        state.translating[key] = true;
        btnTrans.classList.add('on');
        renderBook();
        translateWord(w.word).then(function (text) {
          state.translations[key] = text;
        }).catch(function (e) {
          state.translations[key] = '翻译失败：' + ((e && e.message) || '未知错误');
        }).then(function () {
          delete state.translating[key];
          renderBook();
        });
      }
    });
    if (state.translating[key]) btnTrans.classList.add('on');
    const btnPush = h('button', {
      class: 'icon small',
      title: '只把这个单词加入墨墨',
      html: ICONS.push,
      onclick: function () {
        if (btnPush.disabled) return;
        btnPush.disabled = true;
        pushWordToMaimemo(w.word).then(function () {
          btnPush.disabled = false;
        });
      }
    });
    const btnDel = h('button', {
      class: 'icon small',
      title: '从生词本移除',
      html: ICONS.trash,
      onclick: function () {
        self.PlusWordbook.remove(w.word).then(function () {
          renderBook();
        });
      }
    });

    const row = h('div', { class: 'book-item' }, [
      h('div', { class: 'book-row' }, [
        h('span', { class: 'book-word', text: w.word }),
        w.source ? h('span', { class: 'book-src', text: w.source }) : null,
        h('div', { class: 'grow' }),
        btnSpeak,
        btnTrans,
        btnPush,
        btnDel
      ])
    ]);

    if (cached) {
      row.appendChild(
        h('div', { class: 'book-trans' + (/^翻译失败/.test(cached) ? ' err' : ''), text: cached })
      );
    } else if (state.translating[key]) {
      row.appendChild(h('div', { class: 'book-trans muted', text: '正在翻译…' }));
    }
    return row;
  }

  function translateWord(word) {
    const cfg = currentSettings();
    return S.enabledServices().then(function (info) {
      const service = S.pickService(info.services, (cfg.selection && cfg.selection.service) || '');
      if (!service) throw new Error('请先在设置里启用一个翻译服务');
      return S.translate({
        text: word,
        targetLang: state.targetLang || 'zh_cn',
        service: service
      });
    });
  }

  function pushWordToMaimemo(word) {
    return self.PlusWordbook.readAll().then(function (data) {
      if (!data.meta.notepadId) {
        throw new Error('请先在下方选择目标云词本');
      }
      return self.PlusMaimemo.appendWords([word], {
        notepadId: data.meta.notepadId,
        title: '翻译助手生词本',
        brief: '由 Side Panel Translator Plus 收集'
      }).then(function (res) {
        if (!res.appended) toast('「' + res.notepad.title + '」里已有 ' + word);
        else toast('已把 ' + word + ' 加入「' + res.notepad.title + '」');
      });
    }).catch(function (e) {
      toast('加入失败：' + e.message);
    });
  }

  function renderBookSettings() {
    const box = h('div', { class: 'book-setup' });
    const tokenInput = h('input', {
      type: 'password',
      placeholder: '墨墨开放 API Token',
      class: 'book-input'
    });
    const status = h('div', { class: 'hint', text: '' });
    const npBox = h('div', { class: 'np-box' });
    const newBox = h('div', { class: 'np-new' });

    box.appendChild(h('div', { class: 'book-section-title', text: '墨墨云词本' }));
    box.appendChild(tokenInput);
    box.appendChild(
      h('div', { class: 'book-actions' }, [
        h('button', {
          class: 'btn-small',
          text: '保存 Token',
          onclick: function () {
            const v = tokenInput.value.trim();
            if (!v) {
              toast('请先粘贴 Token');
              return;
            }
            self.PlusMaimemo.setToken(v).then(function () {
              tokenInput.value = '';
              toast('Token 已保存');
              renderBook();
            });
          }
        }),
        h('button', {
          class: 'btn-small',
          html: ICONS.plus + '<span>新建词本</span>',
          onclick: function () {
            newBox.innerHTML = '';
            const input = h('input', {
              type: 'text',
              class: 'book-input',
              placeholder: '新词本名称，例如「论文生词」'
            });
            const create = function () {
              const title = input.value.trim();
              if (!title) {
                toast('请填写词本名称');
                return;
              }
              self.PlusMaimemo.createNotepad({
                title: title,
                brief: '由 Side Panel Translator Plus 收集',
                content: state.words
                  .map(function (w) {
                    return w.word;
                  })
                  .join('\n')
              })
                .then(function (np) {
                  return self.PlusWordbook.setMeta({
                    notepadId: np.id,
                    notepadTitle: np.title,
                    lastSyncAt: Date.now()
                  }).then(function () {
                    toast('已新建「' + np.title + '」');
                    renderBook();
                  });
                })
                .catch(function (e) {
                  toast('新建失败：' + e.message);
                });
            };
            newBox.appendChild(input);
            newBox.appendChild(
              h('div', { class: 'book-actions' }, [
                h('button', { class: 'btn-small primary', text: '创建', onclick: create }),
                h('button', {
                  class: 'btn-small',
                  text: '取消',
                  onclick: function () {
                    newBox.innerHTML = '';
                  }
                })
              ])
            );
            input.focus();
            input.addEventListener('keydown', function (e) {
              if (e.key === 'Enter') create();
            });
          }
        })
      ])
    );
    box.appendChild(npBox);
    box.appendChild(newBox);
    box.appendChild(status);

    self.PlusMaimemo.getToken().then(function (t) {
      if (t) tokenInput.placeholder = '已保存 Token（重新粘贴可覆盖）';
      if (!t) {
        status.textContent = '填写 Token 后即可管理云词本。';
        return;
      }
      loadNotepads(npBox, status);
    });

    box.appendChild(
      h('div', {
        class: 'hint',
        text: 'Token 获取：墨墨 App → 我的 → 更多设置 → 实验功能 → 开放 API。'
      })
    );
    els.bookBody.appendChild(box);
  }

  function loadNotepads(npBox, status) {
    status.textContent = '正在读取云词本…';
    self.PlusMaimemo.listNotepads()
      .then(function (nps) {
        status.textContent = '';
        npBox.innerHTML = '';
        if (!nps.length) {
          npBox.appendChild(h('div', { class: 'book-empty', text: '还没有云词本，点「新建词本」创建一个。' }));
          return;
        }
        nps.forEach(function (np) {
          npBox.appendChild(renderNotepadRow(np));
        });
      })
      .catch(function (e) {
        status.textContent = '读取词本失败：' + e.message;
      });
  }

  function renderNotepadRow(np) {
    const active = state.bookMeta.notepadId === np.id;
    const row = h('div', { class: 'np-row' + (active ? ' on' : '') });

    const name = h('span', { class: 'np-name', text: np.title });
    name.addEventListener('click', function () {
      selectNotepad(np);
    });

    const actions = h('div', { class: 'np-actions' });

    const editBtn = h('button', {
      class: 'icon small',
      title: '重命名',
      html: ICONS.pencil,
      onclick: function () {
        row.innerHTML = '';
        const input = h('input', { type: 'text', class: 'book-input np-input', value: np.title });
        const save = function () {
          const title = input.value.trim();
          if (!title) {
            toast('名称不能为空');
            return;
          }
          self.PlusMaimemo.renameNotepad(np.id, title)
            .then(function () {
              if (state.bookMeta.notepadId === np.id) {
                return self.PlusWordbook.setMeta({ notepadTitle: title });
              }
              return null;
            })
            .then(function () {
              toast('已重命名为「' + title + '」');
              renderBook();
            })
            .catch(function (e) {
              toast('重命名失败：' + e.message);
            });
        };
        row.appendChild(input);
        row.appendChild(
          h('div', { class: 'book-actions' }, [
            h('button', { class: 'btn-small primary', text: '保存', onclick: save }),
            h('button', {
              class: 'btn-small',
              text: '取消',
              onclick: function () {
                renderBook();
              }
            })
          ])
        );
        input.focus();
        input.select();
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') save();
        });
      }
    });

    const delBtn = h('button', {
      class: 'icon small',
      title: '删除云词本',
      html: ICONS.trash,
      onclick: function () {
        row.innerHTML = '';
        row.classList.add('confirm');
        row.appendChild(
          h('div', { class: 'np-confirm' }, [
            h('span', { text: '删除「' + np.title + '」？' }),
            h('div', { class: 'grow' }),
            h('button', {
              class: 'btn-small danger',
              text: '确认删除',
              onclick: function () {
                self.PlusMaimemo.deleteNotepad(np.id)
                  .then(function () {
                    if (state.bookMeta.notepadId === np.id) {
                      return self.PlusWordbook.setMeta({ notepadId: '', notepadTitle: '' })
                        .then(function () {
                          toast('已删除「' + np.title + '」');
                          renderBook();
                        });
                    }
                    toast('已删除「' + np.title + '」');
                    renderBook();
                  })
                  .catch(function (e) {
                    toast('删除失败：' + e.message);
                  });
              }
            }),
            h('button', {
              class: 'btn-small',
              text: '取消',
              onclick: function () {
                renderBook();
              }
            })
          ])
        );
      }
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    row.appendChild(name);
    if (active) row.appendChild(h('span', { class: 'np-badge', text: '当前' }));
    row.appendChild(h('div', { class: 'grow' }));
    row.appendChild(actions);
    return row;
  }

  function selectNotepad(np) {
    state.bookMeta.notepadId = np.id;
    state.bookMeta.notepadTitle = np.title;
    self.PlusWordbook.setMeta({ notepadId: np.id, notepadTitle: np.title }).then(function () {
      toast('已选择「' + np.title + '」');
      renderBook();
    });
  }

  function syncBookToMaimemo() {
    if (state.syncing) return;
    state.syncing = true;
    toast('正在同步到墨墨…');
    self.PlusWordbook.readAll()
      .then(function (data) {
        const words = data.words.map(function (w) {
          return w.word;
        });
        if (!words.length) throw new Error('生词本是空的');
        state.words = data.words;
        state.bookMeta = data.meta;
        return self.PlusMaimemo.appendWords(words, {
          notepadId: data.meta.notepadId || '',
          title: '翻译助手生词本',
          brief: '由 Side Panel Translator Plus 收集'
        });
      })
      .then(function (res) {
        return self.PlusWordbook.setMeta({
          notepadId: res.notepad.id,
          notepadTitle: res.notepad.title,
          lastSyncAt: Date.now()
        }).then(function () {
          let msg;
          if (!res.appended) msg = '「' + res.notepad.title + '」里已有全部单词';
          else if (res.created) msg = '已新建「' + res.notepad.title + '」，' + res.appended + ' 个单词';
          else msg = '已向「' + res.notepad.title + '」追加 ' + res.appended + ' 个单词';
          toast(msg);
          renderBook();
        });
      })
      .catch(function (e) {
        toast('同步失败：' + e.message);
      })
      .then(function () {
        state.syncing = false;
      });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text);
      });
    }
    return fallbackCopy(text);
  }

  function fallbackCopy(text) {
    return new Promise(function (resolve, reject) {
      const ta = h('textarea', { style: 'position:fixed;left:-9999px;top:0;opacity:0' });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  function copySource() {
    if (!state.text.trim()) return;
    copyText(state.text)
      .then(function () {
        toast('已复制原文');
      })
      .catch(function () {
        toast('复制失败');
      });
  }

  function clearAll() {
    if (state.busy) return;
    state.text = '';
    state.results = [];
    els.textarea.value = '';
    els.btnTranslate.disabled = true;
    updateCount();
    renderResults();
    TTS.stop();
  }

  function currentSettings() {
    return state.settings || { tts: { rate: 1, voiceURI: '', autoSpeakTranslation: false }, selection: {} };
  }

  function speak(text, lang, btn) {
    if (!text || !text.trim()) return;
    const cfg = currentSettings().tts;
    if (btn && btn.classList.contains('on')) {
      TTS.stop();
      btn.classList.remove('on');
      btn.innerHTML = ICONS.speak;
      return;
    }
    document.querySelectorAll('.icon.speaking').forEach(function (b) {
      b.classList.remove('on', 'speaking');
      b.innerHTML = ICONS.speak;
    });
    if (btn) {
      btn.classList.add('on', 'speaking');
      btn.innerHTML = ICONS.stop;
    }
    TTS.speak(text, {
      lang: S.bcp47(lang),
      rate: cfg.rate,
      voiceURI: cfg.voiceURI
    })
      .catch(function (err) {
        toast((err && err.message) || '朗读失败');
      })
      .then(function () {
        if (btn) {
          btn.classList.remove('on', 'speaking');
          btn.innerHTML = ICONS.speak;
        }
      });
  }

  function speakSource() {
    if (!state.text.trim()) return;
    speak(state.text, S.detectSourceLang(state.text), els.btnSpeakSrc);
  }

  let wordPopTimer = null;

  function scheduleWordPop() {
    clearTimeout(wordPopTimer);
    wordPopTimer = setTimeout(function () {
      const cfg = currentSettings();
      if (cfg.selection && cfg.selection.wordPopup === false) return;
      const hit = readWordSelection();
      if (!hit) {
        hideWordPop();
        return;
      }
      showWordPop(hit);
    }, 120);
  }

  function readWordSelection() {
    const active = document.activeElement;
    if (active === els.textarea) {
      const start = els.textarea.selectionStart;
      const end = els.textarea.selectionEnd;
      if (start === end) return null;
      const raw = els.textarea.value.slice(start, end);
      const word = cleanWord(raw);
      if (!word) return null;
      return { word: word, anchor: pointerAnchor(els.textarea) };
    }
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return null;
    const raw = sel.toString();
    const word = cleanWord(raw);
    if (!word) return null;
    const node = sel.anchorNode;
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    if (!el || !el.closest || !el.closest('.main')) return null;
    if (el.closest('.pick-layer')) return null;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) return null;
    return { word: word, anchor: { left: rect.left + rect.width / 2, top: rect.top, bottom: rect.bottom } };
  }

  function cleanWord(raw) {
    const text = String(raw || '').trim().replace(/^[^\w]+|[^\w]+$/g, '');
    if (!text || /\s/.test(text)) return '';
    if (text.length > 40) return '';
    if (!/[A-Za-z\u00c0-\u024f]/.test(text)) return '';
    if (!/^[A-Za-z\u00c0-\u024f][A-Za-z\u00c0-\u024f'’-]*$/.test(text)) return '';
    return text;
  }

  function pointerAnchor(el) {
    const rect = el.getBoundingClientRect();
    const p = state.pointer;
    if (p && p.x >= rect.left && p.x <= rect.right && p.y >= rect.top - 40 && p.y <= rect.bottom + 40) {
      return { left: p.x, top: p.y, bottom: p.y };
    }
    return { left: rect.left + rect.width / 2, top: rect.top + 24, bottom: rect.top + 24 };
  }

  function showWordPop(hit) {
    if (!els.wordPop) return;
    const key = hit.word.toLowerCase();
    if (state.wordPop && state.wordPop.key === key && els.wordPop.classList.contains('show')) {
      placeWordPop(hit.anchor);
      return;
    }

    state.wordPop = { key: key, word: hit.word, result: '' };
    els.wordPop.innerHTML = '';

    const title = h('div', { class: 'wp-head' }, [
      h('span', { class: 'wp-word', text: hit.word }),
      h('div', { class: 'grow' }),
      h('button', {
        class: 'icon small',
        title: '朗读',
        html: ICONS.speak,
        onclick: function (e) {
          e.stopPropagation();
          speak(hit.word, 'en', null);
        }
      }),
      h('button', {
        class: 'icon small',
        title: '加入生词本',
        html: ICONS.book,
        onclick: function (e) {
          e.stopPropagation();
          self.PlusWordbook.add([hit.word], { source: '选中取词' }).then(function (res) {
            toast(res.added.length ? '已加入生词本：' + hit.word : '这个词已在生词本');
          });
        }
      }),
      h('button', {
        class: 'icon small',
        title: '关闭',
        html: ICONS.chevron,
        onclick: function (e) {
          e.stopPropagation();
          hideWordPop();
        }
      })
    ]);
    const body = h('div', { class: 'wp-body muted', text: '正在翻译…' });

    els.wordPop.appendChild(title);
    els.wordPop.appendChild(body);
    els.wordPop.classList.add('show');
    placeWordPop(hit.anchor);

    translateWord(hit.word)
      .then(function (text) {
        if (!state.wordPop || state.wordPop.key !== key) return;
        state.wordPop.result = text || '（无结果）';
        body.className = 'wp-body';
        body.textContent = state.wordPop.result;
        placeWordPop(hit.anchor);
      })
      .catch(function (e) {
        if (!state.wordPop || state.wordPop.key !== key) return;
        body.className = 'wp-body err';
        body.textContent = '翻译失败：' + ((e && e.message) || '未知错误');
        placeWordPop(hit.anchor);
      });
  }

  function placeWordPop(anchor) {
    if (!els.wordPop) return;
    const el = els.wordPop;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el.offsetWidth || 240;
    const hgt = el.offsetHeight || 80;
    let left = anchor.left - w / 2;
    left = Math.max(8, Math.min(left, vw - w - 8));
    let top = anchor.bottom + 8;
    if (top + hgt > vh - 8) top = Math.max(8, anchor.top - hgt - 8);
    el.style.left = Math.round(left) + 'px';
    el.style.top = Math.round(top) + 'px';
  }

  function hideWordPop() {
    clearTimeout(wordPopTimer);
    state.wordPop = null;
    if (els.wordPop) els.wordPop.classList.remove('show');
  }

  function renderResults() {
    els.results.innerHTML = '';
    if (!state.results.length) {
      els.results.appendChild(h('div', { class: 'empty', text: '在上方输入内容，然后点 Translate。' }));
      return;
    }
    state.results.forEach(function (r, idx) {
      const bodyClass = r.status === 'error' ? 'result-body err' : r.status === 'pending' ? 'result-body muted' : 'result-body';
      const body = h('div', { class: bodyClass, text: r.content || (r.status === 'pending' ? '正在翻译…' : '') });
      body.contentEditable = r.status === 'done' ? 'true' : 'false';
      body.addEventListener('input', function () {
        r.content = body.textContent;
      });

      const head = h('div', { class: 'result-head' }, [
        r.status === 'pending' ? h('span', { class: 'spin' }) : null,
        h('span', { class: 'result-name', text: r.service }),
        h('span', { class: 'grow' }),
        h('button', {
          class: 'icon',
          title: r.collapsed ? '展开' : '收起',
          html: ICONS.chevron,
          style: r.collapsed ? 'transform:rotate(-90deg)' : '',
          onclick: function () {
            r.collapsed = !r.collapsed;
            renderResults();
          }
        })
      ]);

      const btnSpeak = h('button', { class: 'icon', title: '朗读译文', html: ICONS.speak });
      btnSpeak.addEventListener('click', function () {
        speak(r.content, state.targetLang, btnSpeak);
      });
      const btnCopy = h('button', {
        class: 'icon',
        title: '复制译文',
        html: ICONS.copy,
        onclick: function () {
          navigator.clipboard.writeText(r.content || '').then(function () {
            toast('已复制译文');
          });
        }
      });

      els.results.appendChild(
        h('div', { class: 'result' + (r.collapsed ? ' collapsed' : '') }, [
          head,
          body,
          h('div', { class: 'result-tools' }, [btnCopy, btnSpeak])
        ])
      );
    });
  }

  function translateAll() {
    const text = state.text.trim();
    if (!text) return;
    if (state.busy) return;
    if (!state.services.length) {
      toast('请先在设置里启用一个翻译服务');
      return;
    }
    state.busy = true;
    els.btnTranslate.disabled = true;
    els.btnTranslate.innerHTML = '<span class="spin"></span><span>Translating</span>';

    const jobs = state.services.map(function (service) {
      return { service: service, status: 'pending', content: '', collapsed: false };
    });
    state.results = jobs;
    renderResults();

    let done = 0;
    jobs.forEach(function (job) {
      S.translate({
        text: text,
        targetLang: state.targetLang,
        service: job.service,
        onProgress: function (partial) {
          job.content = partial;
          job.status = 'pending';
          const idx = state.results.indexOf(job);
          const node = els.results.children[idx];
          if (node) {
            const body = node.querySelector('.result-body');
            if (body) body.textContent = partial;
          }
        }
      })
        .then(function (result) {
          job.status = 'done';
          job.content = result || '';
          if (currentSettings().tts.autoSpeakTranslation && result) {
            const first = state.results.filter(function (r) {
              return r.status === 'done' && r.content;
            })[0];
            if (first === job) speak(result, state.targetLang, null);
          }
        })
        .catch(function (err) {
          job.status = 'error';
          job.content = (err && err.message) || '翻译失败';
        })
        .then(function () {
          done += 1;
          renderResults();
          if (done === jobs.length) {
            state.busy = false;
            els.btnTranslate.disabled = !state.text.trim();
            els.btnTranslate.innerHTML = ICONS.translate + '<span>Translate</span>';
          }
        });
    });
  }

  function openDrawer() {
    renderSheet();
    els.drawer.classList.add('open');
  }

  function closeDrawer() {
    els.drawer.classList.remove('open');
  }

  function renderSheet() {
    const cfg = currentSettings();
    els.sheet.innerHTML = '';

    const rateVal = h('span', { class: 'value', text: cfg.tts.rate.toFixed(2) + 'x' });
    const rate = h('input', {
      type: 'range',
      min: '0.5',
      max: '2',
      step: '0.05',
      value: String(cfg.tts.rate),
      oninput: function (e) {
        rateVal.textContent = Number(e.target.value).toFixed(2) + 'x';
        S.set({ tts: { rate: Number(e.target.value) } });
        state.settings.tts.rate = Number(e.target.value);
      }
    });

    const voiceSel = h('select', {
      onchange: function (e) {
        S.set({ tts: { voiceURI: e.target.value } });
        state.settings.tts.voiceURI = e.target.value;
      }
    });
    voiceSel.appendChild(h('option', { value: '', text: '自动（按语言匹配）' }));

    const testBtn = h('button', {
      class: 'btn-primary',
      html: ICONS.speak + '<span>试听</span>',
      style: 'min-width:84px;height:28px',
      onclick: function () {
        speak(state.text.trim() || 'This is a voice preview.', S.detectSourceLang(state.text), null);
      }
    });

    const autoSpeak = h('input', {
      type: 'checkbox',
      checked: !!cfg.tts.autoSpeakTranslation,
      onchange: function (e) {
        S.set({ tts: { autoSpeakTranslation: e.target.checked } });
        state.settings.tts.autoSpeakTranslation = e.target.checked;
      }
    });

    els.sheet.appendChild(h('h3', { text: '朗读' }));
    els.sheet.appendChild(h('div', { class: 'field' }, [h('label', { text: '语速' }, [rateVal]), rate]));
    els.sheet.appendChild(h('div', { class: 'field' }, [h('label', { text: '语音' }), voiceSel, h('div', { class: 'hint', text: '留空则按文本语言自动选择系统语音。' })]));
    els.sheet.appendChild(h('div', { class: 'field' }, [h('label', {}, [autoSpeak, h('span', { text: '翻译完成后自动朗读' })])]));
    els.sheet.appendChild(h('div', { class: 'field' }, [testBtn]));

    els.sheet.appendChild(h('hr'));
    els.sheet.appendChild(h('h3', { text: '划词翻译' }));

    const modeSel = h('select', {
      onchange: function (e) {
        S.set({ selection: { mode: e.target.value } });
        state.settings.selection.mode = e.target.value;
        if (e.target.value === 'off') hideWordPop();
      }
    });
    [
      ['bubble', '显示气泡，点击后翻译'],
      ['auto', '选中即自动翻译'],
      ['off', '关闭网页划词']
    ].forEach(function (o) {
      const opt = h('option', { value: o[0], text: o[1] });
      if (cfg.selection.mode === o[0]) opt.selected = true;
      modeSel.appendChild(opt);
    });
    els.sheet.appendChild(
      h('div', { class: 'field' }, [
        h('label', { text: '网页划词' }),
        modeSel,
        h('div', { class: 'hint', text: '只影响网页里的划词浮层，不影响侧边栏内的单词弹窗。' })
      ])
    );

    const wordPopEnable = h('input', {
      type: 'checkbox',
      checked: cfg.selection.wordPopup !== false,
      onchange: function (e) {
        S.set({ selection: { wordPopup: e.target.checked } });
        state.settings.selection.wordPopup = e.target.checked;
        if (!e.target.checked) hideWordPop();
      }
    });
    els.sheet.appendChild(
      h('div', { class: 'field' }, [
        h('label', {}, [wordPopEnable, h('span', { text: '选中单个单词时，在侧边栏直接弹出该词释义' })]),
        h('div', { class: 'hint', text: '适用于原文输入框和译文区；选整句不会弹。' })
      ])
    );

    const svcSel = h('select', {
      onchange: function (e) {
        S.set({ selection: { service: e.target.value } });
        state.settings.selection.service = e.target.value;
      }
    });
    svcSel.appendChild(h('option', { value: '', text: '跟随默认' }));
    state.services.forEach(function (s) {
      const opt = h('option', { value: s, text: s });
      if (cfg.selection.service === s) opt.selected = true;
      svcSel.appendChild(opt);
    });
    els.sheet.appendChild(h('div', { class: 'field' }, [h('label', { text: '划词翻译服务' }), svcSel]));

    const closeBtn = h('button', { class: 'btn-primary', text: '完成', style: 'width:100%;margin-top:6px', onclick: closeDrawer });
    els.sheet.appendChild(closeBtn);

    TTS.getVoices().then(function (voices) {
      voiceSel.innerHTML = '';
      voiceSel.appendChild(h('option', { value: '', text: '自动（按语言匹配）' }));
      voices.forEach(function (v) {
        const opt = h('option', { value: v.voiceURI, text: v.name + ' · ' + v.lang + (v.localService ? '' : ' · 在线') });
        if (cfg.tts.voiceURI === v.voiceURI) opt.selected = true;
        voiceSel.appendChild(opt);
      });
    });
  }

  function init() {
    build();
    updateCount();
    renderResults();

    S.get().then(function (s) {
      state.settings = s;
      if (s.targetLang) {
        state.targetLang = s.targetLang;
        els.select.value = state.targetLang;
      }
      return S.enabledServices();
    }).then(function (info) {
      state.services = info.services;
      if (!state.services.length) toast('未检测到已启用的翻译服务');
      watchServices();
    });

    S.onChange(function (s) {
      state.settings = s;
    });

    chrome.runtime.onMessage.addListener(function (msg) {
      if (!msg || msg.name !== 'plusTranslateText') return;
      acceptText((msg.data && msg.data.text) || '');
    });

    chrome.runtime.sendMessage({ name: 'plusTakePending' }, function (res) {
      if (chrome.runtime.lastError) return;
      if (res && res.text) acceptText(res.text);
    });

    self.PlusWordbook.readAll().then(function (data) {
      state.words = data.words;
      state.bookMeta = data.meta;
    });
    self.PlusWordbook.onChange(function (data) {
      state.words = data.words;
      state.bookMeta = data.meta;
      if (els.bookDrawer && els.bookDrawer.classList.contains('open')) renderBook();
    });
  }

  let lastAccepted = '';

  function watchServices() {
    let ticks = 0;
    const timer = setInterval(function () {
      ticks += 1;
      S.enabledServices().then(function (info) {
        const next = info.services.join(',');
        if (next !== state.services.join(',')) {
          state.services = info.services;
          if (els.drawer.classList.contains('open')) renderSheet();
        }
        if (ticks >= 8) clearInterval(timer);
      });
    }, 700);
  }

  function acceptText(text) {
    if (!text || text === lastAccepted) return;
    lastAccepted = text;
    state.text = text;
    els.textarea.value = text;
    updateCount();
    els.btnTranslate.disabled = false;
    els.textarea.scrollTop = 0;
    translateAll();
  }

  init();
})();
