(function () {
  const KEY = 'plusWordbook';
  const META_KEY = 'plusWordbookMeta';

  const DEFAULTS_META = {
    notepadId: '',
    notepadTitle: '',
    lastSyncAt: 0
  };

  let queue = Promise.resolve();

  function serial(task) {
    const run = queue.then(task, task);
    queue = run.then(
      function () {},
      function () {}
    );
    return run;
  }

  function normalize(word) {
    return String(word || '').trim().toLowerCase();
  }

  function readAll() {
    return new Promise(function (resolve) {
      chrome.storage.local.get([KEY, META_KEY], function (res) {
        resolve({
          words: Array.isArray(res && res[KEY]) ? res[KEY] : [],
          meta: Object.assign({}, DEFAULTS_META, (res && res[META_KEY]) || {})
        });
      });
    });
  }

  function writeAll(words, meta) {
    return new Promise(function (resolve) {
      chrome.storage.local.set({ [KEY]: words, [META_KEY]: meta }, function () {
        resolve({ words: words, meta: meta });
      });
    });
  }

  function add(words, extra) {
    return serial(function () {
      return readAll().then(function (cur) {
        const seen = {};
        cur.words.forEach(function (w) {
          seen[normalize(w.word)] = true;
        });
        const added = [];
        [].concat(words).forEach(function (raw) {
          const word = String(raw || '').trim();
          const key = normalize(word);
          if (!word || seen[key]) return;
          seen[key] = true;
          added.push(
            Object.assign(
              {
                word: word,
                addedAt: Date.now(),
                source: ''
              },
              extra || {}
            )
          );
        });
        if (!added.length) return { added: [], total: cur.words.length, words: cur.words, meta: cur.meta };
        const next = added.concat(cur.words);
        return writeAll(next, cur.meta).then(function () {
          return { added: added, total: next.length, words: next, meta: cur.meta };
        });
      });
    });
  }

  function remove(word) {
    return serial(function () {
      return readAll().then(function (cur) {
        const key = normalize(word);
        const next = cur.words.filter(function (w) {
          return normalize(w.word) !== key;
        });
        return writeAll(next, cur.meta).then(function () {
          return { total: next.length, words: next, meta: cur.meta };
        });
      });
    });
  }

  function clear() {
    return serial(function () {
      return readAll().then(function (cur) {
        return writeAll([], cur.meta);
      });
    });
  }

  function setMeta(patch) {
    return serial(function () {
      return readAll().then(function (cur) {
        return writeAll(cur.words, Object.assign({}, cur.meta, patch));
      });
    });
  }

  function text() {
    return readAll().then(function (cur) {
      return cur.words
        .map(function (w) {
          return w.word;
        })
        .join('\n');
    });
  }

  function onChange(fn) {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area !== 'local') return;
      if (!changes[KEY] && !changes[META_KEY]) return;
      readAll().then(fn);
    });
  }

  self.PlusWordbook = {
    readAll: readAll,
    add: add,
    remove: remove,
    clear: clear,
    setMeta: setMeta,
    text: text,
    onChange: onChange
  };
})();
