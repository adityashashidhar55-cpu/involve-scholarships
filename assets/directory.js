/* Involve Scholarships — directory tier.
 *
 * A second, deliberately separate register: awards harvested from official
 * national and institutional scholarship databases. These are LISTINGS, not
 * verified records. We hold a name, a funder and an official link; we have not
 * read the eligibility rules, so nothing here is matched against a profile and
 * nothing here claims a verified deadline.
 *
 * Data is sharded by destination country so a phone downloads one country
 * (largest single fetch 162 KB gzipped), never the whole 22,400-row set.
 */
(function () {
  'use strict';

  var BASE = './data/';
  var INDEX = null;          // directory-index.json
  var SHARD = {};            // country code -> rows loaded so far
  var PENDING = {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function cname(c) {
    var V = window.INVOLVE_VOCAB;
    if (c === 'XX') return 'Not tied to one country';
    return (V && V.countryName) ? V.countryName(c) : c;
  }
  function fill(id, html) {
    var n = document.getElementById(id);
    if (n) n.innerHTML = html;
  }

  function getJSON(url) {
    if (PENDING[url]) return PENDING[url];
    PENDING[url] = fetch(url, { cache: 'force-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' -> HTTP ' + r.status);
      return r.json();
    });
    return PENDING[url];
  }
  function loadIndex() {
    if (INDEX) return Promise.resolve(INDEX);
    return getJSON(BASE + 'directory-index.json').then(function (j) { INDEX = j; return j; });
  }
  /**
   * Shards are split into parts of <=1,500 rows so no single fetch is heavy on a
   * phone (largest is 162 KB gzipped). Part 1 resolves immediately so the page
   * paints; the rest stream in behind it and call onMore as they land.
   * The US shard is 7 parts — this is the difference between a fast page and a
   * 3 MB JSON parse on a budget handset.
   */
  function shardMeta(c) {
    return loadIndex().then(function (j) {
      for (var i = 0; i < j.shards.length; i++) if (j.shards[i].country === c) return j.shards[i];
      throw new Error('No directory shard for ' + c);
    });
  }
  function loadShard(c, onMore) {
    if (SHARD[c] && SHARD[c]._complete) return Promise.resolve(SHARD[c]);
    return shardMeta(c).then(function (meta) {
      var parts = meta.parts || [{ file: 'directory-' + c + '.json' }];
      return getJSON(BASE + parts[0].file).then(function (first) {
        var rows = first.slice();
        rows._complete = parts.length === 1;
        rows._total = meta.count;
        SHARD[c] = rows;
        if (parts.length > 1) {
          Promise.all(parts.slice(1).map(function (p) { return getJSON(BASE + p.file); }))
            .then(function (rest) {
              rest.forEach(function (chunk) { Array.prototype.push.apply(rows, chunk); });
              rows._complete = true;
              if (onMore) onMore(rows);
            }).catch(function () { if (onMore) onMore(rows); });
        }
        return rows;
      });
    });
  }

  /** The disclaimer. Shown on every directory surface, never abbreviated. */
  function caveat() {
    return '<div class="banner noprint" style="margin-top:18px">' +
      '<p class="label" style="color:var(--steel)">DIRECTORY LISTING — ELIGIBILITY NOT CHECKED</p>' +
      '<p class="small muted" style="margin-top:6px;max-width:70ch">These entries come from official national and university scholarship ' +
      'databases. We have recorded the name, the funder and the official link exactly as published. ' +
      'We have <strong>not</strong> read the eligibility rules, so these are not matched to your profile ' +
      'and carry no verified deadline or amount. Treat them as leads and confirm everything on the ' +
      'official page. The <a href="#/explore">verified register</a> is the part we have checked line by line.</p></div>';
  }

  function levelBadges(l) {
    if (!l || !l.length) return '';
    return l.slice(0, 4).map(function (x) {
      return '<span class="badge badge-steel">' + esc(String(x).replace(/_/g, ' ')) + '</span>';
    }).join('');
  }

  function rowCard(c, r) {
    return '<div class="card card-tight">' +
      '<div class="spread"><div>' +
      '<p class="label dim">' + esc(r.f || r.h) + '</p>' +
      '<h3 style="margin-top:5px"><a href="#/directory/' + esc(c) + '/' + esc(r.i) + '">' + esc(r.n) + '</a></h3>' +
      '</div>' + (r.q === 'high' ? '<span class="badge">detail on file</span>' : '') + '</div>' +
      (r.s ? '<p class="small muted" style="margin-top:8px">' + esc(String(r.s).slice(0, 230)) + '</p>' : '') +
      '<div class="row" style="margin-top:10px">' + levelBadges(r.l) +
      (r.a ? '<span class="badge badge-ember">' + esc(r.a) + '</span>' : '') +
      (r.d ? '<span class="badge badge-warn">' + esc(r.d) + '</span>' : '') +
      '</div></div>';
  }

  // ------------------------------------------------------------------- pages
  function hub() {
    loadIndex().then(function (j) {
      var shards = j.shards.slice().sort(function (a, b) { return b.count - a.count; });
      fill('dirBody',
        '<p class="muted" style="margin-top:14px;max-width:66ch">' + j.total.toLocaleString() +
        ' awards from ' + j.hosts + ' official government and university scholarship databases. ' +
        'Pick a destination — each loads on its own, so you never download the whole set.</p>' +
        caveat() +
        '<div style="overflow-x:auto;margin-top:26px"><table><thead><tr>' +
        '<th>Destination</th><th class="num">Listings</th><th class="num">Download</th></tr></thead><tbody>' +
        shards.map(function (s) {
          return '<tr><td><a href="#/directory/' + esc(s.country) + '">' + esc(cname(s.country)) + '</a></td>' +
            '<td class="num">' + s.count.toLocaleString() + '</td>' +
            '<td class="num dim">' + Math.round(s.gzip / 1024) + ' KB</td></tr>';
        }).join('') + '</tbody></table></div>');
    }).catch(function (e) {
      fill('dirBody', '<p class="err" style="margin-top:18px">The directory index did not load. ' + esc(e.message) + '</p>');
    });
    return '<div class="wrap section"><p class="eyebrow">DIRECTORY</p>' +
      '<h1 style="margin-top:10px">Scholarship directory</h1>' +
      '<div id="dirBody"><p class="muted" style="margin-top:14px">Loading the index…</p></div></div>';
  }

  function country(c) {
    c = decodeURIComponent(c);
    var redraw = null;
    loadShard(c, function () { if (redraw) redraw(); }).then(function (rows) {
      var state = { q: '', level: '', page: 0, per: 50 };
      function draw() {
        var q = state.q.toLowerCase();
        var list = rows.filter(function (r) {
          if (state.level && (r.l || []).indexOf(state.level) < 0) return false;
          if (!q) return true;
          return (r.n + ' ' + (r.f || '') + ' ' + (r.s || '')).toLowerCase().indexOf(q) >= 0;
        });
        var pages = Math.max(1, Math.ceil(list.length / state.per));
        if (state.page >= pages) state.page = pages - 1;
        var slice = list.slice(state.page * state.per, (state.page + 1) * state.per);
        fill('dirList',
          '<p class="small dim" style="margin-top:16px">' + list.length.toLocaleString() +
          ' listing' + (list.length === 1 ? '' : 's') +
          (list.length !== rows.length ? ' of ' + rows.length.toLocaleString() : '') +
          ' · page ' + (state.page + 1) + ' of ' + pages +
          (rows._complete ? '' : ' · still loading ' + (rows._total - rows.length).toLocaleString() + ' more') + '</p>' +
          '<div class="stack" style="margin-top:14px">' + slice.map(function (r) { return rowCard(c, r); }).join('') + '</div>' +
          (pages > 1 ? '<div class="row" style="margin-top:18px">' +
            '<button class="btn btn-sm" id="dirPrev"' + (state.page === 0 ? ' disabled' : '') + '>Previous</button>' +
            '<button class="btn btn-sm" id="dirNext"' + (state.page >= pages - 1 ? ' disabled' : '') + '>Next</button></div>' : ''));
        var p = document.getElementById('dirPrev'), n = document.getElementById('dirNext');
        if (p) p.onclick = function () { state.page--; draw(); };
        if (n) n.onclick = function () { state.page++; draw(); window.scrollTo(0, 0); };
      }
      redraw = draw;
      var levels = {};
      rows.forEach(function (r) { (r.l || []).forEach(function (x) { levels[x] = (levels[x] || 0) + 1; }); });
      fill('dirBody',
        '<p class="muted" style="margin-top:14px">' + rows.length.toLocaleString() +
        ' listings from official sources.</p>' + caveat() +
        '<div class="row" style="margin-top:20px">' +
        '<input id="dirQ" class="data" placeholder="Search name, funder or description" style="min-width:280px">' +
        '<select id="dirL" class="data"><option value="">Any level</option>' +
        Object.keys(levels).sort().map(function (k) {
          return '<option value="' + esc(k) + '">' + esc(k.replace(/_/g, ' ')) + ' (' + levels[k] + ')</option>';
        }).join('') + '</select></div><div id="dirList"></div>');
      var qi = document.getElementById('dirQ'), li = document.getElementById('dirL');
      var t;
      qi.oninput = function () { clearTimeout(t); t = setTimeout(function () { state.q = qi.value; state.page = 0; draw(); }, 160); };
      li.onchange = function () { state.level = li.value; state.page = 0; draw(); };
      draw();
    }).catch(function (e) {
      fill('dirBody', '<p class="err" style="margin-top:18px">No directory shard for that destination. ' + esc(e.message) + '</p>');
    });
    return '<div class="wrap section"><p class="small"><a href="#/directory">Directory</a> <span class="dim">/</span> ' + esc(cname(c)) + '</p>' +
      '<h1 style="margin-top:14px">Scholarships in ' + esc(cname(c)) + '</h1>' +
      '<div id="dirBody"><p class="muted" style="margin-top:14px">Loading ' + esc(cname(c)) + '…</p></div></div>';
  }

  function record(c, id) {
    c = decodeURIComponent(c); id = decodeURIComponent(id);
    function find(rows) {
      for (var i = 0; i < rows.length; i++) if (rows[i].i === id) return rows[i];
      return null;
    }
    loadShard(c, function (rows) { if (!SHOWN && find(rows)) show(find(rows)); else if (!SHOWN) miss(); })
      .then(function (rows) {
      var r = find(rows);
      if (!r) { if (rows._complete) miss(); return; }
      show(r);
    }).catch(function (e) {
      fill('dirBody', '<p class="err" style="margin-top:18px">' + esc(e.message) + '</p>');
    });
    var SHOWN = false;
    function miss() {
      fill('dirBody', '<p class="err" style="margin-top:18px">No listing with that id in ' + esc(cname(c)) + '.</p>');
    }
    function show(r) {
      SHOWN = true;
      document.title = r.n + ' — Involve Scholarships';
      fill('dirBody',
        '<p class="label dim" style="margin-top:6px">' + esc(r.f || r.h) + '</p>' +
        '<h1 style="margin-top:8px">' + esc(r.n) + '</h1>' +
        (r.s ? '<p class="muted" style="margin-top:14px;max-width:70ch">' + esc(r.s) + '</p>' : '') +
        caveat() +
        '<div class="row" style="margin-top:20px">' + levelBadges(r.l) +
        (r.k === 'research_funding' ? '<span class="badge badge-steel">research funding</span>' : '') + '</div>' +
        '<table style="margin-top:24px"><tbody>' +
        [['Funder', r.f], ['Destination', r.c ? cname(r.c) : 'Not tied to one country'],
         ['Value as published', r.a], ['Deadline as published', r.d || r.dd],
         ['Source database', r.h], ['Language of the listing', r.g]]
          .filter(function (p) { return p[1]; })
          .map(function (p) { return '<tr><td class="dim">' + esc(p[0]) + '</td><td>' + esc(p[1]) + '</td></tr>'; }).join('') +
        '</tbody></table>' +
        '<div class="row" style="margin-top:24px">' +
        '<a class="btn btn-primary" href="' + esc(r.u) + '" target="_blank" rel="noopener nofollow">Open the official page</a>' +
        '<a class="btn" href="#/directory/' + esc(c) + '">Back to ' + esc(cname(c)) + '</a></div>' +
        (r.x ? '<p class="small dim" style="margin-top:16px">The official link points at the database page that lists this award ' +
          'alongside others, not at a page of its own — that is how the source publishes it.</p>' : ''));
    }
    return '<div class="wrap section"><p class="small"><a href="#/directory">Directory</a> <span class="dim">/</span> ' +
      '<a href="#/directory/' + esc(c) + '">' + esc(cname(c)) + '</a></p>' +
      '<div id="dirBody"><p class="muted" style="margin-top:14px">Loading…</p></div></div>';
  }

  window.InvolveDirectory = { hub: hub, country: country, record: record };
})();
