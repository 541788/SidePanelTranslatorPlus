(function () {
  const BASE = 'https://open.maimemo.com/open/api/v1';
  const TOKEN_KEY = 'plusMaimemoToken';

  let queue = Promise.resolve();

  function serial(task) {
    const run = queue.then(task, task);
    queue = run.then(
      function () {},
      function () {}
    );
    return run;
  }

  function getToken() {
    return new Promise(function (resolve) {
      chrome.storage.local.get(TOKEN_KEY, function (res) {
        resolve((res && res[TOKEN_KEY]) || '');
      });
    });
  }

  function setToken(token) {
    return new Promise(function (resolve) {
      chrome.storage.local.set({ [TOKEN_KEY]: String(token || '').trim() }, resolve);
    });
  }

  function request(method, path, options) {
    const opts = options || {};
    return getToken().then(function (token) {
      if (!token) throw new Error('请先填写墨墨开放 API Token');
      let url = BASE + path;
      if (opts.query) url += '?' + new URLSearchParams(opts.query).toString();
      return fetch(url, {
        method: method,
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined
      }).then(function (resp) {
        return resp.text().then(function (text) {
          let json = null;
          try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }
          if (!resp.ok) {
            let msg = 'HTTP ' + resp.status;
            if (json && json.errors && json.errors.length) {
              msg = json.errors.map(function (e) { return e.msg || e.code; }).join('; ');
            }
            throw new Error(msg);
          }
          if (json && json.success === false) {
            const errs = json.errors || [];
            throw new Error(errs.length ? errs[0].msg || errs[0].code : '请求失败');
          }
          return (json && json.data) || {};
        });
      });
    });
  }

  function listNotepads() {
    return request('GET', '/memo/notepads', { query: { limit: 10 } }).then(function (d) {
      return d.notepads || [];
    });
  }

  function getNotepad(id) {
    return request('GET', '/memo/notepads/' + encodeURIComponent(id)).then(function (d) {
      return d.notepad;
    });
  }

  function createNotepad(fields) {
    return request('POST', '/memo/notepads', {
      body: {
        notepad: {
          status: 'PUBLISHED',
          content: fields.content || '',
          title: fields.title,
          brief: fields.brief || '',
          tags: fields.tags || []
        }
      }
    }).then(function (d) { return d.notepad; });
  }

  function updateNotepad(id, fields) {
    return request('POST', '/memo/notepads/' + encodeURIComponent(id), {
      body: {
        id: id,
        notepad: {
          status: fields.status || 'PUBLISHED',
          content: fields.content || '',
          title: fields.title || '',
          brief: fields.brief || '',
          tags: fields.tags || []
        }
      }
    });
  }

  function renameNotepad(id, title) {
    return getNotepad(id).then(function (np) {
      return updateNotepad(id, {
        status: np.status || 'PUBLISHED',
        content: np.content || '',
        title: String(title || '').trim(),
        brief: np.brief || '',
        tags: np.tags || []
      }).then(function () {
        return Object.assign({}, np, { title: String(title || '').trim() });
      });
    });
  }

  function deleteNotepad(id) {
    return request('DELETE', '/memo/notepads/' + encodeURIComponent(id));
  }

  function appendWords(spellings, opts) {
    const options = opts || {};
    const uniq = [];
    const seen = {};
    [].concat(spellings).forEach(function (s) {
      const w = String(s || '').trim();
      const k = w.toLowerCase();
      if (!w || seen[k]) return;
      seen[k] = true;
      uniq.push(w);
    });
    if (!uniq.length) return Promise.resolve({ appended: 0, created: false });

    return serial(function () {
      if (!options.notepadId) return createFresh(uniq, options);
      return getNotepad(options.notepadId)
        .then(function (np) { return syncInto(np, uniq); })
        .catch(function () { return createFresh(uniq, options); });
    });
  }

  function syncInto(np, words) {
    const existing = String(np.content || '').split('\n');
    const seen = {};
    existing.forEach(function (line) { seen[line.trim().toLowerCase()] = true; });
    const fresh = words.filter(function (w) { return !seen[w.toLowerCase()]; });
    if (!fresh.length) return Promise.resolve({ appended: 0, created: false, notepad: np });
    const content = String(np.content || '').replace(/\s+$/, '');
    const next = (content ? content + '\n' : '') + fresh.join('\n');
    return updateNotepad(np.id, {
      status: np.status || 'PUBLISHED',
      content: next,
      title: np.title,
      brief: np.brief,
      tags: np.tags
    }).then(function () {
      return { appended: fresh.length, created: false, notepad: np };
    });
  }

  function createFresh(words, options) {
    const title = options.title || '翻译助手生词本';
    return createNotepad({
      title: title,
      brief: options.brief || '由 Side Panel Translator Plus 收集',
      tags: options.tags || [],
      content: words.join('\n')
    }).then(function (np) {
      return { appended: words.length, created: true, notepad: np };
    });
  }

  self.PlusMaimemo = {
    getToken: getToken,
    setToken: setToken,
    listNotepads: listNotepads,
    getNotepad: getNotepad,
    createNotepad: createNotepad,
    updateNotepad: updateNotepad,
    renameNotepad: renameNotepad,
    deleteNotepad: deleteNotepad,
    appendWords: appendWords
  };
})();
