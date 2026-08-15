/* Involve Scholarships — preview app.
 * Matching, calendar and provenance run through window.InvolveCore, generated
 * from packages/core/src. No engine logic is re-implemented here.
 */
(function () {
  'use strict';

  var CORE = window.InvolveCore;
  var V = window.INVOLVE_VOCAB;
  var NOW = new Date();
  var STALE_DAYS = 90;

  /**
   * The register is served as two files so a phone does not download and parse
   * college awards it has not asked for:
   *   data-core.json         government, foundation and multilateral awards —
   *                          the main product, loaded before first paint
   *   data-universities.json awards held by a named university — fetched in the
   *                          background once the page is interactive
   * The single-file build inlines both as window.INVOLVE_CATALOGUE.
   */
  var ALL = [], GENERAL = [], COLLEGE = [], BY_SLUG = {}, SCHOOL_NAMES = [], SCHOOL_META = {}, SCHOOLS = [], FUNDERS = [];
  var universitiesLoaded = false;
  // Data packs are served with a long cache lifetime, so a published data update
  // would otherwise sit behind a returning visitor's browser cache. The build
  // stamps a version here and every data fetch carries it, which makes a new
  // build a new URL. window.INVOLVE_DATA_V is injected by assemble.mjs.
  var DATA_V = '?v=' + (window.INVOLVE_DATA_V || '0');

  /** Directory listings — breadth without claimed detail. See directoryPage(). */
  var LISTINGS = [], listingsLoaded = false;

  /** Government / private / multilateral — never tied to one institution. */
  function isCollegeSpecific(r) { return r.scope === 'school' || !!r.school_name; }

  function hydrate(pack) {
    (pack.scholarships || []).forEach(function (r) {
      if (BY_SLUG[r.slug]) return;
      BY_SLUG[r.slug] = r;
      ALL.push(r);
      (isCollegeSpecific(r) ? COLLEGE : GENERAL).push(r);
    });
    (pack.schools || []).forEach(function (s) {
      if (!s || !s.name || SCHOOL_META[s.name]) return;
      SCHOOL_META[s.name] = s; SCHOOLS.push(s);
    });
    (pack.funders || []).forEach(function (f) { if (f && f.name) FUNDERS.push(f); });
    var names = {};
    COLLEGE.forEach(function (r) { if (r.school_name) names[r.school_name] = 1; });
    SCHOOLS.forEach(function (r) { if (r.name) names[r.name] = 1; });
    SCHOOL_NAMES = Object.keys(names).sort();
  }

  /**
   * Pull the university file in when it is actually needed. Safe to call
   * repeatedly; re-renders the current route once the data lands.
   */
  /**
   * The directory is sharded by destination. A single file would be 21 MB to
   * parse and 2.5 MB over the wire, which is exactly what the split-data build
   * exists to avoid, so nothing here ever loads the whole set.
   *
   * ensureListings()      -> the index only (counts per destination), tiny
   * ensureCountry(cc, cb) -> that destination's shards; part 1 resolves first
   *                          and the rest stream in behind it
   */
  var LISTING_INDEX = null, indexLoading = false;
  var COUNTRY_ROWS = {};      // cc -> array (carries _complete / _total)

  function ensureListings(then) {
    if (listingsLoaded) { if (then) then(); return; }
    if (indexLoading) return;
    indexLoading = true;
    if (window.INVOLVE_LISTINGS) {
      LISTINGS = window.INVOLVE_LISTINGS.listings || [];
      listingsLoaded = true; if (then) then(); return;
    }
    if (!window.fetch) { listingsLoaded = true; if (then) then(); return; }
    window.fetch('data-listings-index.json' + DATA_V)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (j) { LISTING_INDEX = j; listingsLoaded = true; render(); }
        if (then) then();
      })
      .catch(function () { listingsLoaded = true; if (then) then(); });
  }

  function shardMeta(cc) {
    if (!LISTING_INDEX) return null;
    for (var i = 0; i < LISTING_INDEX.shards.length; i++) {
      if (LISTING_INDEX.shards[i].country === cc) return LISTING_INDEX.shards[i];
    }
    return null;
  }

  function ensureCountry(cc, onReady, onMore) {
    var have = COUNTRY_ROWS[cc];
    if (have && have._complete) { onReady(have); return; }
    if (have && have._loading) return;
    var meta = shardMeta(cc);
    if (!meta || !window.fetch) { onReady([]); return; }
    var rows = COUNTRY_ROWS[cc] = [];
    rows._loading = true; rows._total = meta.count; rows._complete = false;
    window.fetch(meta.parts[0].file + DATA_V)
      .then(function (r) { return r.ok ? r.json() : { listings: [] }; })
      .then(function (pack) {
        Array.prototype.push.apply(rows, pack.listings || []);
        rows._complete = meta.parts.length === 1;
        rows._loading = !rows._complete;
        onReady(rows);
        if (meta.parts.length > 1) {
          var rest = meta.parts.slice(1).map(function (p) {
            return window.fetch(p.file + DATA_V).then(function (r) { return r.ok ? r.json() : { listings: [] }; });
          });
          Promise.all(rest).then(function (packs) {
            packs.forEach(function (pk) { Array.prototype.push.apply(rows, pk.listings || []); });
            rows._complete = true; rows._loading = false;
            if (onMore) onMore(rows);
          }).catch(function () { rows._complete = true; rows._loading = false; if (onMore) onMore(rows); });
        }
      })
      .catch(function () { rows._complete = true; rows._loading = false; onReady(rows); });
  }

  function ensureUniversities(then) {
    if (universitiesLoaded) { if (then) then(); return; }
    universitiesLoaded = true;
    if (!window.fetch) { if (then) then(); return; }
    window.fetch('data-universities.json' + DATA_V)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (pack) { if (pack) { hydrate(pack); render(); } if (then) then(); })
      .catch(function () { if (then) then(); });
  }

  // -------------------------------------------------------------- utilities
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(id) { return document.getElementById(id); }
  function titleCase(s) { return String(s || '').replace(/[_-]/g, ' ').replace(/\b\w/g, function (m) { return m.toUpperCase(); }); }
  function uniq(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }
  function cname(c) { return V.countryName(c); }

  /**
   * The engine quotes criterion values verbatim, so its explanations carry raw
   * ISO codes ("nationality in IN, PK, BD"). Users never see codes on this
   * site, so every engine-authored string is passed through here first.
   * Only tokens that are actually country codes are replaced.
   */
  function humanize(text) {
    if (!text) return '';
    return String(text).replace(/\b[A-Za-z]{2,12}\b/g, function (tok) {
      var name = V.COUNTRY_NAME[tok];
      return name && tok === tok.toUpperCase() && tok.length === 2 ? name
        : (V.COUNTRY_NAME[tok] && tok === tok.toLowerCase() && tok.length > 2 ? V.COUNTRY_NAME[tok] : tok);
    });
  }
  function levelLabel(k) {
    for (var i = 0; i < V.STUDY_LEVELS.length; i++) if (V.STUDY_LEVELS[i].key === k) return V.STUDY_LEVELS[i].label;
    return titleCase(k);
  }

  function daysSince(iso) { var t = Date.parse(iso); return isNaN(t) ? null : Math.floor((NOW - t) / 86400000); }
  function daysUntil(iso) { var t = Date.parse(iso); return isNaN(t) ? null : Math.ceil((t - NOW) / 86400000); }
  function fmtDate(iso) {
    if (!iso) return null;
    var d = new Date(iso);
    return isNaN(d) ? null : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fmtMoney(n, cur) {
    if (n == null) return null;
    try { return new Intl.NumberFormat('en', { style: 'currency', currency: cur || 'USD', maximumFractionDigits: 0 }).format(n); }
    catch (e) { return (cur ? cur + ' ' : '') + n.toLocaleString('en'); }
  }

  function nullState(field, url) {
    return '<span class="null">NOT PUBLISHED — ' + esc(field) +
      (url ? ' · <a href="' + esc(url) + '" target="_blank" rel="noreferrer">check official page</a>' : '') + '</span>';
  }

  function freshnessBadge(rec) {
    var d = rec.last_verified_at ? daysSince(rec.last_verified_at) : null;
    if (d === null) return '<span class="badge badge-warn">VERIFICATION DATE NOT RECORDED</span>';
    var stale = d > STALE_DAYS;
    return '<span class="badge ' + (stale ? 'badge-warn' : 'badge-ember') + '"><span class="dot"></span>VERIFIED ' +
      (d === 0 ? 'TODAY' : d + ' DAY' + (d === 1 ? '' : 'S') + ' AGO') + (stale ? ' · STALE' : '') + '</span>';
  }
  function statusBadge(rec) {
    if (rec.status === 'cycle_closed') return '<span class="badge badge-warn">CYCLE CLOSED</span>';
    if (rec.status === 'discontinued') return '<span class="badge badge-warn">DISCONTINUED</span>';
    var d = rec.deadline_date ? daysUntil(rec.deadline_date) : null;
    if (d !== null && d >= 0 && d <= 30) return '<span class="badge badge-steel">CLOSES IN ' + d + ' DAY' + (d === 1 ? '' : 'S') + '</span>';
    return '<span class="badge badge-ember">OPEN</span>';
  }

  /** True when a record carries any financial-need rule the engine cannot score. */
  function needBasedRules(rec) {
    return (rec.criteria || []).filter(function (c) {
      return c.attribute === 'income_max' && typeof c.value !== 'number';
    });
  }
  function numericIncomeRules(rec) {
    return (rec.criteria || []).filter(function (c) {
      return c.attribute === 'income_max' && typeof c.value === 'number';
    });
  }

  // ----------------------------------------------------------------- storage
  var PROFILE_KEY = 'involve:profile:v2';
  var SHORTLIST_KEY = 'involve:shortlist:v1';
  function readLS(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function writeLS(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  function str(v) { return typeof v === 'string' && v.trim() !== '' ? v.trim() : null; }
  function num(v) { return typeof v === 'number' && isFinite(v) ? v : null; }
  function boolOrNull(v) { return typeof v === 'boolean' ? v : null; }
  function strArr(v) { return Array.isArray(v) ? v.filter(function (x) { return typeof x === 'string' && x.trim() !== ''; }) : []; }

  function sanitizeProfile(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var gpa = null;
    if (raw.gpa && typeof raw.gpa === 'object') {
      var gv = num(raw.gpa.value), gs = num(raw.gpa.scale);
      if (gv !== null && gs !== null && gs > 0) gpa = { value: gv, scale: gs };
    }
    var ts = null;
    if (raw.test_scores && typeof raw.test_scores === 'object') {
      ts = {};
      ['gmat', 'gre', 'ielts', 'toefl'].forEach(function (k) { var n = num(raw.test_scores[k]); if (n !== null) ts[k] = n; });
      if (!Object.keys(ts).length) ts = null;
    }
    return {
      nationality: str(raw.nationality), residence: str(raw.residence), study_level: str(raw.study_level),
      fields: strArr(raw.fields), destinations: strArr(raw.destinations), schools: strArr(raw.schools),
      target_schools: strArr(raw.target_schools),
      course_groups: strArr(raw.course_groups),
      application_year: num(raw.application_year), intake_term: str(raw.intake_term),
      age: num(raw.age), gender: str(raw.gender),
      highest_degree: str(raw.highest_degree), prior_degree_field: str(raw.prior_degree_field),
      prior_degree_class: str(raw.prior_degree_class),
      gpa: gpa, work_experience_years: num(raw.work_experience_years),
      employment_status: str(raw.employment_status), test_scores: ts,
      certified_languages: strArr(raw.certified_languages),
      enrolled_full_time: boolOrNull(raw.enrolled_full_time),
      household_income_amount: num(raw.household_income_amount),
      household_income_currency: str(raw.household_income_currency),
      declares_financial_need: boolOrNull(raw.declares_financial_need),
      special_status: strArr(raw.special_status),
      other_status_note: str(raw.other_status_note),
      has_admission: boolOrNull(raw.has_admission),
      holds_other_award: boolOrNull(raw.holds_other_award),
      willing_to_return_home: boolOrNull(raw.willing_to_return_home)
    };
  }
  function loadProfile() {
    var raw = readLS(PROFILE_KEY);
    if (!raw) return null;
    try { return sanitizeProfile(JSON.parse(raw)); } catch (e) { return null; }
  }
  function saveProfile(p) { writeLS(PROFILE_KEY, JSON.stringify(p)); }

  function loadShortlist() {
    var raw = readLS(SHORTLIST_KEY);
    if (!raw) return [];
    try { return strArr(JSON.parse(raw)).filter(function (s) { return BY_SLUG[s]; }); } catch (e) { return []; }
  }
  function saveShortlist(l) { writeLS(SHORTLIST_KEY, JSON.stringify(uniq(l))); }
  function toggleShortlist(slug) {
    var l = loadShortlist(), i = l.indexOf(slug);
    if (i >= 0) l.splice(i, 1); else l.push(slug);
    saveShortlist(l);
    return l.indexOf(slug) >= 0;
  }

  // ------------------------------------------------------------------ router
  var routes = [];
  function route(re, fn) { routes.push([re, fn]); }
  function go(h) { window.location.hash = h; }
  function currentPath() { return (window.location.hash || '#/').replace(/^#/, ''); }

  function render() {
    var path = currentPath(), root = el('view');
    for (var i = 0; i < routes.length; i++) {
      var m = path.match(routes[i][0]);
      if (m) {
        try { root.innerHTML = routes[i][1].apply(null, m.slice(1)); }
        catch (e) { console.error('[involve] page render failed', path, e); root.innerHTML = errorPage(e); }
        window.scrollTo(0, 0); syncNav(path); bind(); return;
      }
    }
    root.innerHTML = notFoundPage(path); syncNav(path); bind();
  }
  function syncNav(path) {
    Array.prototype.forEach.call(document.querySelectorAll('a.navlink'), function (a) {
      var href = a.getAttribute('href').replace(/^#/, '');
      a.classList.toggle('active', href === '/' ? path === '/' : path.indexOf(href) === 0);
    });
  }
  function errorPage(e) {
    return '<div class="wrap section"><p class="eyebrow">SORRY</p><h1>This page didn\u2019t load</h1>' +
      '<p class="muted" style="margin-top:14px;max-width:60ch">Your saved details may be from an older version of the site — this is a fault in the page. The most common cause is saved intake data from an older version.</p>' +
      '<div class="row" style="margin-top:22px"><a class="btn btn-primary" href="#/">Go home</a><button class="btn" id="clearAll">Clear saved data</button></div>' +
      '</div>';
  }
  function notFoundPage(path) {
    return '<div class="wrap section"><p class="eyebrow">404</p><h1>Nothing at this address</h1>' +
      '<p class="muted" style="margin-top:14px"><code class="mono">' + esc(path) + '</code> is not a page on this site.</p>' +
      '<div class="row" style="margin-top:22px"><a class="btn btn-primary" href="#/explore">Browse all funding</a></div></div>';
  }

  // ------------------------------------------------------------------ intake
  function nationalityOptions() {
    var set = {};
    ALL.forEach(function (r) {
      (r.eligible_nationalities || []).forEach(function (c) { if (c && ['any', 'eea', 'commonwealth', 'developing'].indexOf(c) < 0) set[c] = 1; });
    });
    return Object.keys(set).sort(function (a, b) { return cname(a).localeCompare(cname(b)); });
  }
  function destinationOptions() {
    var set = {};
    ALL.forEach(function (r) { (r.destination_countries || []).forEach(function (c) { if (c && c !== 'any') set[c] = 1; }); });
    return Object.keys(set).sort(function (a, b) { return cname(a).localeCompare(cname(b)); });
  }
  function deadlineYears() {
    var set = {};
    ALL.forEach(function (r) { if (r.deadline_date) set[r.deadline_date.slice(0, 4)] = 1; });
    return Object.keys(set).sort();
  }

  function opt(value, label, selected) {
    return '<option value="' + esc(value) + '"' + (selected === value ? ' selected' : '') + '>' + esc(label) + '</option>';
  }
  function sel(id, items, selected, placeholder) {
    return '<select id="' + id + '"><option value="">' + esc(placeholder) + '</option>' +
      items.map(function (it) { return opt(it.key, it.label, selected); }).join('') + '</select>';
  }
  function chips(group, items, chosen) {
    return '<div class="chipset" style="margin-top:8px">' + items.map(function (it) {
      var on = (chosen || []).indexOf(it.key) >= 0;
      return '<button type="button" class="chip" data-chip="' + group + '" data-value="' + esc(it.key) + '" aria-pressed="' + on + '">' + esc(it.label) + '</button>';
    }).join('') + '</div>';
  }
  /**
   * Searchable multi-select. Renders a filter box, a scrollable option list and
   * the current selection as removable chips.
   *
   * The selected chips carry data-chip/aria-pressed exactly like the old wall,
   * so chosen(group) keeps working unchanged — this is a UI swap, not a data
   * model change.
   */
  function picker(group, items, chosen, placeholder) {
    var id = 'pk-' + group;
    var sel = (chosen || []).slice();
    var chosenSet = {};
    sel.forEach(function (v) { chosenSet[v] = 1; });
    return '<div class="picker" data-picker="' + group + '" data-items="' +
      esc(JSON.stringify(items)) + '">' +
      '<div class="chipset picker-chosen" style="margin-bottom:10px">' +
        items.filter(function (it) { return chosenSet[it.key]; }).map(function (it) {
          return pickerChip(group, it);
        }).join('') +
      '</div>' +
      '<label class="sr" for="' + id + '">Search ' + esc(placeholder || group) + '</label>' +
      '<input id="' + id + '" class="picker-input" type="text" autocomplete="off" ' +
        'placeholder="' + esc(placeholder || 'Type to search…') + '">' +
      '<div class="picker-menu" hidden></div>' +
      '<p class="small dim picker-count" style="margin-top:6px">' + items.length +
        ' to choose from' + (sel.length ? ' · ' + sel.length + ' selected' : '') + '</p>' +
      '</div>';
  }

  function pickerChip(group, it) {
    return '<button type="button" class="chip chip-remove" data-chip="' + group + '" ' +
      'data-picker-chip="1" data-value="' + esc(it.key) + '" aria-pressed="true" ' +
      'title="Remove">' + esc(it.label) + '<span aria-hidden="true"> ×</span></button>';
  }

  /** Wire every picker on the page. Called from bind(). */
  function bindPickers() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-picker]'), function (root) {
      if (root.getAttribute('data-bound')) return;
      root.setAttribute('data-bound', '1');
      var group = root.getAttribute('data-picker');
      var items = [];
      try { items = JSON.parse(root.getAttribute('data-items')) || []; } catch (e) { items = []; }
      var input = root.querySelector('.picker-input');
      var menu = root.querySelector('.picker-menu');
      var bag = root.querySelector('.picker-chosen');
      var count = root.querySelector('.picker-count');
      var active = -1;

      function selected() {
        return Array.prototype.slice.call(bag.querySelectorAll('[data-value]'))
          .map(function (b) { return b.getAttribute('data-value'); });
      }
      function updateCount() {
        var n = selected().length;
        count.textContent = items.length + ' to choose from' + (n ? ' \u00b7 ' + n + ' selected' : '');
      }
      function close() { menu.hidden = true; menu.innerHTML = ''; active = -1; }

      function open() {
        var q = input.value.trim().toLowerCase();
        var have = {};
        selected().forEach(function (v) { have[v] = 1; });
        var hits = items.filter(function (it) {
          if (have[it.key]) return false;
          return !q || it.label.toLowerCase().indexOf(q) >= 0;
        }).slice(0, 60);
        if (!hits.length) {
          menu.innerHTML = '<p class="picker-empty small dim">' +
            (q ? 'Nothing matches “' + esc(input.value.trim()) + '”' : 'Everything is already selected') + '</p>';
          menu.hidden = false;
          return;
        }
        menu.innerHTML = hits.map(function (it, i) {
          return '<button type="button" class="picker-opt" role="option" data-value="' +
            esc(it.key) + '" data-i="' + i + '"' + (i === active ? ' data-active="1"' : '') + '>' +
            esc(it.label) + '</button>';
        }).join('');
        menu.hidden = false;
      }

      function add(key) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].key === key) {
            bag.insertAdjacentHTML('beforeend', pickerChip(group, items[i]));
            break;
          }
        }
        input.value = '';
        updateCount();
        open();
        input.focus();
      }

      input.addEventListener('focus', open);
      input.addEventListener('input', function () { active = -1; open(); });
      input.addEventListener('keydown', function (ev) {
        var opts = menu.querySelectorAll('.picker-opt');
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          if (!opts.length) return;
          active += (ev.key === 'ArrowDown' ? 1 : -1);
          if (active < 0) active = opts.length - 1;
          if (active >= opts.length) active = 0;
          Array.prototype.forEach.call(opts, function (o, i) {
            if (i === active) { o.setAttribute('data-active', '1'); o.scrollIntoView({ block: 'nearest' }); }
            else o.removeAttribute('data-active');
          });
        } else if (ev.key === 'Enter') {
          ev.preventDefault();
          var pick = active >= 0 ? opts[active] : opts[0];
          if (pick) add(pick.getAttribute('data-value'));
        } else if (ev.key === 'Escape') {
          close();
        }
      });
      menu.addEventListener('mousedown', function (ev) {
        var b = ev.target.closest ? ev.target.closest('.picker-opt') : null;
        if (!b) return;
        ev.preventDefault();
        add(b.getAttribute('data-value'));
      });
      bag.addEventListener('click', function (ev) {
        var b = ev.target.closest ? ev.target.closest('[data-picker-chip]') : null;
        if (!b) return;
        b.parentNode.removeChild(b);
        updateCount();
      });
      document.addEventListener('click', function (ev) {
        if (!root.contains(ev.target)) close();
      });
    });
  }

  function tri(group, value, yes, no) {
    return '<div class="chipset" style="margin-top:8px">' +
      '<button type="button" class="chip" data-radio="' + group + '" data-value="yes" aria-pressed="' + (value === true) + '">' + esc(yes || 'Yes') + '</button>' +
      '<button type="button" class="chip" data-radio="' + group + '" data-value="no" aria-pressed="' + (value === false) + '">' + esc(no || 'No') + '</button>' +
      '</div>';
  }
  function fieldset(title, note, body) {
    return '<section class="card" style="margin-top:18px"><p class="label">' + esc(title) + '</p>' +
      (note ? '<p class="small dim" style="margin-top:6px;max-width:70ch">' + note + '</p>' : '') +
      '<div style="margin-top:16px">' + body + '</div></section>';
  }

  function homePage() {
    var p = loadProfile() || {};
    var years = deadlineYears();

    return '' +
    '<section class="wrap section">' +
      '<p class="eyebrow">INVOLVE SCHOLARSHIPS</p>' +
      '<h1 style="margin-top:10px;max-width:16ch">Find the funding you are actually eligible for.</h1>' +
      '<p class="muted" style="margin-top:18px;max-width:62ch">Government, foundation and multilateral scholarships — the awards you apply for directly, on your own merits. Every one is read from the funder\u2019s official page, quotes their exact wording, and shows the date we last checked it. Where a funder has not published something, we say so instead of guessing.</p>' +
      '<div class="row" style="margin-top:26px"><a class="btn btn-primary" href="#intake">Match my profile</a>' +
      '<a class="btn" href="#/explore">Browse all funding</a><a class="btn" href="#/directory">Funding directory</a></div>' +
      '<div class="grid grid-3" style="margin-top:44px">' +
        statTile(GENERAL.length, 'government & private awards') +
        statTile(GENERAL.filter(function (r) { return r.status === 'open'; }).length, 'currently open') +
        statTile(COLLEGE.length || '—', 'university-run, listed separately') +
      '</div>' +
    '</section>' +

    '<section class="wrap section" id="intake" style="border-top:1px solid var(--hairline)">' +
      '<p class="eyebrow">INTAKE</p>' +
      '<h2 style="margin-top:10px">The more you tell us, the fewer false hopes</h2>' +
      '<p class="muted" style="margin-top:12px;max-width:62ch">Only nationality and study level are required. Every other field turns an <em>unknown</em> into a real yes or no — leave one blank and the engine reports unknown for rules that depend on it, never a guess.</p>' +
      '<form id="intake-form" style="margin-top:22px">' +

      fieldset('1 · Who you are', 'Nationality decides more awards than anything else you can tell us — most funders restrict by it.',
        '<div class="grid grid-2">' +
          '<div><label class="field label" for="f-nat">Nationality *</label>' +
            '<select id="f-nat"><option value="">Select a country…</option>' +
            nationalityOptions().map(function (c) { return opt(c, cname(c), p.nationality); }).join('') + '</select>' +
            '<p class="err" id="e-nat" hidden>Pick your nationality — it drives the whole match.</p></div>' +
          '<div><label class="field label" for="f-res">Country of residence</label>' +
            '<select id="f-res"><option value="">Same as nationality</option>' +
            nationalityOptions().map(function (c) { return opt(c, cname(c), p.residence); }).join('') + '</select></div>' +
          '<div><label class="field label" for="f-age">Age</label>' +
            '<input id="f-age" type="number" min="14" max="99" step="1" value="' + esc(p.age == null ? '' : p.age) + '" placeholder="e.g. 24">' +
            '<p class="err" id="e-age" hidden>Age must be between 14 and 99.</p></div>' +
          '<div><label class="field label" for="f-gender">Gender <span class="dim">(3 awards are women-only)</span></label>' +
            sel('f-gender', [{ key: 'female', label: 'Woman' }, { key: 'male', label: 'Man' }, { key: 'other', label: 'Another gender identity' }], p.gender, 'Prefer not to say') + '</div>' +
        '</div>') +

      fieldset('2 · What you want to study', 'Pick a course area, and name universities if you already have a shortlist. University-specific awards are listed separately so they never crowd out national and multilateral funding.',
        '<div class="grid grid-2">' +
          '<div><label class="field label" for="f-level">Study level *</label>' +
            sel('f-level', V.STUDY_LEVELS, p.study_level, 'Select…') +
            '<p class="err" id="e-level" hidden>Pick a study level to continue.</p></div>' +
          '<div><label class="field label" for="f-term">Intake term</label>' +
            sel('f-term', V.INTAKE_TERMS, p.intake_term, 'Not sure yet') + '</div>' +
        '</div>' +
        '<div style="margin-top:18px"><p class="label">Course area <span class="dim">(type to search)</span></p>' + picker('course_groups', V.COURSE_GROUPS, p.course_groups, 'Search course areas…') + '</div>' +
        '<div style="margin-top:18px"><label class="field label" for="f-course">Specific course or subject <span class="dim">(free text — matched against the funder’s own wording)</span></label>' +
          '<input id="f-course" type="text" placeholder="e.g. renewable energy engineering" value="' + esc((p.fields || []).join(', ')) + '"></div>' +
        '<div style="margin-top:18px"><p class="label">Target universities <span class="dim">(' + SCHOOL_NAMES.length + ' with their own awards — type to search)</span></p>' +
          picker('target_schools', SCHOOL_NAMES.map(function (n) { return { key: n, label: n }; }), p.target_schools, 'Search universities…') + '</div>' +
        '<div style="margin-top:18px"><p class="label">Destination countries <span class="dim">(blank = open to anywhere)</span></p>' +
          picker('destinations', destinationOptions().map(function (c) { return { key: c, label: cname(c) }; }), p.destinations, 'Search countries…') + '</div>') +

      fieldset('3 · When you plan to apply', 'Cycles matter more than anything else on this site. Picking a year hides rounds that have already closed rather than showing you a deadline you cannot meet.',
        '<div class="grid grid-2"><div><label class="field label" for="f-year">Application year</label>' +
          '<select id="f-year"><option value="">Any year</option>' +
          years.map(function (y) { return opt(y, y + ' cycle', p.application_year ? String(p.application_year) : ''); }).join('') +
          '</select></div></div>') +

      fieldset('4 · Academic record',
        'Many awards set a minimum degree class or grade average. Filling these in turns a maybe into a yes or no.',
        '<div class="grid grid-2">' +
          '<div><label class="field label" for="f-degree">Highest degree completed</label>' +
            sel('f-degree', [{ key: 'secondary', label: 'Secondary school' }, { key: 'bachelor', label: 'Bachelor’s' }, { key: 'masters', label: 'Master’s' }, { key: 'phd', label: 'PhD' }], p.highest_degree, 'Select…') + '</div>' +
          '<div><label class="field label" for="f-class">Degree classification</label>' +
            sel('f-class', V.DEGREE_CLASSES, p.prior_degree_class, 'Select…') + '</div>' +
          '<div><label class="field label" for="f-gpa">GPA</label><input id="f-gpa" type="number" step="0.01" min="0" placeholder="e.g. 8.2" value="' + esc(p.gpa ? p.gpa.value : '') + '"></div>' +
          '<div><label class="field label" for="f-gpascale">GPA scale</label><input id="f-gpascale" type="number" step="0.1" min="1" placeholder="e.g. 10" value="' + esc(p.gpa ? p.gpa.scale : '') + '"><p class="err" id="e-gpa" hidden>GPA cannot exceed its scale.</p></div>' +
          '<div><label class="field label" for="f-priorfield">Field of your previous degree</label><input id="f-priorfield" type="text" placeholder="e.g. electrical engineering" value="' + esc(p.prior_degree_field || '') + '"></div>' +
          '<div><label class="field label" for="f-enrolled">Currently enrolled full-time?</label>' + tri('enrolled_full_time', p.enrolled_full_time) + '</div>' +
        '</div>' +
        '<div style="margin-top:18px"><p class="label">Languages you can certify</p>' +
          picker('certified_languages', V.LANGUAGES.map(function (l) { return { key: l, label: l }; }), p.certified_languages, 'Search languages…') + '</div>') +

      fieldset('5 · Tests and work', null,
        '<div class="grid grid-2">' +
          '<div><label class="field label" for="f-ielts">IELTS</label><input id="f-ielts" type="number" step="0.5" min="0" max="9" placeholder="max 9" value="' + esc(p.test_scores && p.test_scores.ielts != null ? p.test_scores.ielts : '') + '"><p class="err" id="e-ielts" hidden>IELTS is scored 0–9.</p></div>' +
          '<div><label class="field label" for="f-toefl">TOEFL iBT</label><input id="f-toefl" type="number" step="1" min="0" max="120" placeholder="max 120" value="' + esc(p.test_scores && p.test_scores.toefl != null ? p.test_scores.toefl : '') + '"><p class="err" id="e-toefl" hidden>TOEFL iBT is scored 0–120.</p></div>' +
          '<div><label class="field label" for="f-gre">GRE total</label><input id="f-gre" type="number" step="1" min="260" max="340" placeholder="260–340" value="' + esc(p.test_scores && p.test_scores.gre != null ? p.test_scores.gre : '') + '"><p class="err" id="e-gre" hidden>GRE total is 260–340.</p></div>' +
          '<div><label class="field label" for="f-gmat">GMAT total</label><input id="f-gmat" type="number" step="1" min="205" max="805" placeholder="205–805" value="' + esc(p.test_scores && p.test_scores.gmat != null ? p.test_scores.gmat : '') + '"><p class="err" id="e-gmat" hidden>GMAT total is 205–805.</p></div>' +
          '<div><label class="field label" for="f-work">Years of full-time work experience</label><input id="f-work" type="number" step="1" min="0" max="60" value="' + esc(p.work_experience_years == null ? '' : p.work_experience_years) + '"></div>' +
          '<div><label class="field label" for="f-employ">Current situation</label>' + sel('f-employ', V.EMPLOYMENT, p.employment_status, 'Select…') + '</div>' +
        '</div>') +

      fieldset('6 · Money',
        'Some funders publish an income cap as a figure; most simply ask you to demonstrate financial need. We compare the figures and flag the rest as need-based rather than guess on your behalf.',
        '<div class="grid grid-2">' +
          '<div><label class="field label" for="f-income">Annual household income</label><input id="f-income" type="number" step="1000" min="0" placeholder="leave blank if unsure" value="' + esc(p.household_income_amount == null ? '' : p.household_income_amount) + '"></div>' +
          '<div><label class="field label" for="f-cur">Currency</label>' +
            '<select id="f-cur"><option value="">Select…</option>' + V.CURRENCIES.map(function (c) { return opt(c, c, p.household_income_currency); }).join('') + '</select></div>' +
        '</div>' +
        '<div style="margin-top:16px"><p class="label">Will you apply as a need-based candidate?</p>' + tri('declares_financial_need', p.declares_financial_need, 'Yes, I will document need', 'No') + '</div>') +

      fieldset('7 · Circumstances and constraints',
        'Funders price these in explicitly. Anything not on the list goes in the free-text box — it is shown to you and included in a consultant handoff, but never auto-evaluated.',
        '<p class="label">Status</p>' + chips('special_status', V.STATUSES, p.special_status) +
        '<div style="margin-top:18px"><label class="field label" for="f-other">Any other status or circumstance</label>' +
          '<textarea id="f-other" rows="2" placeholder="e.g. I support a dependent parent; my degree was interrupted by conflict">' + esc(p.other_status_note || '') + '</textarea></div>' +
        '<div class="grid grid-2" style="margin-top:18px">' +
          '<div><p class="label">Do you already hold university admission?</p>' + tri('has_admission', p.has_admission, 'Yes', 'Not yet') + '</div>' +
          '<div><p class="label">Do you hold another major award?</p>' + tri('holds_other_award', p.holds_other_award, 'Yes', 'No') + '</div>' +
          '<div><p class="label">Willing to return home after graduating?</p>' + tri('willing_to_return_home', p.willing_to_return_home, 'Yes', 'No') + '</div>' +
        '</div>') +

      '<div class="row" style="margin-top:28px"><button class="btn btn-primary" type="submit">See my four buckets</button>' +
      '<span class="small dim">Nothing leaves your browser.</span></div>' +
      '</form>' +
    '</section>';
  }

  function statTile(n, label) {
    return '<div class="card"><p class="data" style="font-size:2rem">' + esc(n) + '</p><p class="label" style="margin-top:6px">' + esc(label) + '</p></div>';
  }

  // ----------------------------------------------------------------- results
  var BUCKET_META = {
    eligible_now: { cls: 'b1', title: 'Eligible now', blurb: 'Every hard rule the funder published is satisfied by what you told us.' },
    eligible_if_you_act: { cls: 'b2', title: 'Eligible if you act', blurb: 'One or more hard rules are not yet met — each is something you can still do or supply.' },
    competitive_stretch: { cls: 'b3', title: 'Competitive stretch', blurb: 'You clear the hard rules but sit below the typical bar. Worth applying with a strong case.' },
    not_eligible: { cls: 'b4', title: 'Not eligible', blurb: 'A published rule rules you out. The exact rule is quoted so you can check it yourself.' }
  };

  function courseMatches(rec, groups, freeText) {
    if ((!groups || !groups.length) && !freeText) return true;
    var hay = ((rec.fields_of_study || []).join(' ') + ' ' + rec.name).toLowerCase();
    if (hay.indexOf('any') >= 0 && (rec.fields_of_study || []).indexOf('any') >= 0) return true;
    if (freeText) {
      var words = freeText.toLowerCase().split(/[,\s]+/).filter(function (w) { return w.length > 3; });
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) >= 0) return true;
    }
    for (var g = 0; g < (groups || []).length; g++) {
      var grp = V.COURSE_GROUPS.filter(function (x) { return x.key === groups[g]; })[0];
      if (!grp) continue;
      for (var m = 0; m < grp.match.length; m++) if (hay.indexOf(grp.match[m]) >= 0) return true;
    }
    return false;
  }

  function yearMatches(rec, year) {
    if (!year) return true;
    if (!rec.deadline_date) return true; // undated records are never hidden by a year filter
    if (String(rec.deadline_date).slice(0, 4) === String(year)) return true;
    return (rec.rounds || []).some(function (r) { return String(r.deadline || '').slice(0, 4) === String(year); });
  }

  function applyFilters(list, p) {
    return list.filter(function (r) {
      return courseMatches(r, p.course_groups, (p.fields || []).join(' ')) && yearMatches(r, p.application_year);
    });
  }

  function resultsPage() {
    var p = loadProfile();
    if (!p || !p.nationality || !p.study_level) {
      return '<div class="wrap section"><p class="eyebrow">NO PROFILE YET</p><h1>Tell us who you are first</h1>' +
        '<p class="muted" style="margin-top:14px;max-width:58ch">The four buckets are computed against your profile. Nationality and study level are the minimum.</p>' +
        '<div class="row" style="margin-top:22px"><a class="btn btn-primary" href="#intake">Start the intake</a></div></div>';
    }

    var generalPool = applyFilters(GENERAL, p);
    var collegePool = applyFilters(
      (p.target_schools || []).length
        ? COLLEGE.filter(function (r) { return p.target_schools.indexOf(r.school_name) >= 0; })
        : COLLEGE, p);

    var out = CORE.matchScholarships(p, generalPool, NOW);
    var collegeOut = CORE.matchScholarships(p, collegePool, NOW);
    var order = ['eligible_now', 'eligible_if_you_act', 'competitive_stretch', 'not_eligible'];

    var filterNote = [];
    if (p.application_year) filterNote.push('cycle ' + p.application_year);
    if ((p.course_groups || []).length) filterNote.push(p.course_groups.map(function (k) {
      var g = V.COURSE_GROUPS.filter(function (x) { return x.key === k; })[0]; return g ? g.label : k;
    }).join(', '));
    if ((p.fields || []).length) filterNote.push('“' + p.fields.join(', ') + '”');

    var html = '<div class="wrap section">' +
      '<p class="eyebrow">YOUR MATCH</p>' +
      '<h1 style="margin-top:10px">Four buckets, never one list</h1>' +
      '<div class="row" style="margin-top:16px">' + profileChips(p) + '<a class="btn btn-sm" href="#intake">Edit profile</a></div>' +
      '<p class="small dim" style="margin-top:12px">' + generalPool.length + ' of ' + GENERAL.length + ' open-pool records assessed' +
        (filterNote.length ? ' after filtering by ' + esc(filterNote.join(' · ')) : '') +
        '. University-specific awards are assessed separately below.</p>' +
      '<div class="grid grid-3" style="margin-top:24px">' +
        order.slice(0, 3).map(function (k) {
          return '<div class="card card-tight"><p class="count">' + out.buckets[k].length + '</p><p class="label" style="margin-top:4px">' + esc(BUCKET_META[k].title) + '</p></div>';
        }).join('') + '</div>';

    order.forEach(function (k) {
      var list = out.buckets[k], meta = BUCKET_META[k];
      html += '<section class="bucket"><div class="bucket-head ' + meta.cls + '"><div class="spread">' +
        '<h2>' + esc(meta.title) + '</h2><p class="data">' + list.length + '</p></div>' +
        '<p class="muted small" style="margin-top:6px;max-width:64ch">' + esc(meta.blurb) + '</p></div>';
      if (!list.length) html += '<p class="null">Nothing in this bucket for your profile.</p>';
      else if (k === 'not_eligible') html += '<details><summary class="label">Show all ' + list.length + ' with the rule that ruled you out</summary><div style="margin-top:14px">' + list.slice(0, 60).map(resultCard).join('') + '</div></details>';
      else html += list.map(resultCard).join('');
      html += '</section>';
    });

    // --- university-specific, kept separate on purpose ---
    var cTotal = collegeOut.buckets.eligible_now.length + collegeOut.buckets.eligible_if_you_act.length + collegeOut.buckets.competitive_stretch.length;
    html += '<section class="bucket"><div class="bucket-head b2"><div class="spread">' +
      '<h2>University-specific awards</h2><p class="data">' + cTotal + '</p></div>' +
      '<p class="muted small" style="margin-top:6px;max-width:66ch">Held by a named school and usually decided alongside your admission, not applied for separately. ' +
      ((p.target_schools || []).length ? 'Filtered to the ' + p.target_schools.length + ' school' + (p.target_schools.length === 1 ? '' : 's') + ' you named.' : 'Name your target schools in the intake to narrow this.') +
      '</p></div>';
    var cList = collegeOut.buckets.eligible_now.concat(collegeOut.buckets.eligible_if_you_act, collegeOut.buckets.competitive_stretch);
    html += cList.length ? cList.slice(0, 24).map(resultCard).join('') : '<p class="null">Nothing here for your profile and filters.</p>';
    html += '<div class="row" style="margin-top:14px"><a class="btn btn-sm" href="#/schools">Browse all university awards</a></div></section>';

    html += ctaBlock(p);
    return html + '</div>';
  }

  function profileChips(p) {
    var bits = [];
    if (p.nationality) bits.push(cname(p.nationality));
    if (p.study_level) bits.push(levelLabel(p.study_level));
    if ((p.course_groups || []).length) {
      var g = V.COURSE_GROUPS.filter(function (x) { return x.key === p.course_groups[0]; })[0];
      bits.push(g ? g.label : p.course_groups[0]);
    }
    if ((p.destinations || []).length) bits.push('→ ' + p.destinations.slice(0, 2).map(cname).join(', '));
    if (p.application_year) bits.push(p.application_year + ' cycle');
    if (p.age != null) bits.push('age ' + p.age);
    return bits.map(function (b) { return '<span class="badge">' + esc(b) + '</span>'; }).join('');
  }

  function resultCard(r) {
    var s = r.scholarship, f = r.factors || {};
    var pct = Math.max(2, Math.min(100, Math.round((r.fit_score || 0) * 100)));
    var why = '';
    if (r.bucket === 'not_eligible' && r.failing_rules && r.failing_rules.length) {
      why = '<div class="snippet"><strong>Ruled out by:</strong> ' + esc(humanize(r.failing_rules[0].explanation) || ruleText(r.failing_rules[0].criterion)) + '</div>';
    } else if (r.bucket === 'eligible_if_you_act' && r.blocking_actions && r.blocking_actions.length) {
      why = '<div class="snippet"><strong>To become eligible:</strong> ' + r.blocking_actions.map(function (a) { return esc(humanize(a.label || a.description || a.kind)); }).join(' · ') + '</div>';
    } else if (r.reason) {
      why = '<div class="snippet">' + esc(humanize(r.reason)) + '</div>';
    }
    var need = needBasedRules(s).length;
    return '<article class="card">' +
      '<div class="spread"><div style="min-width:0"><p class="label">' + esc(s.funder_name || '') + (s.school_name ? ' · ' + esc(s.school_name) : '') + '</p>' +
      '<h3 style="margin-top:5px"><a href="#/scholarships/' + esc(s.slug) + '">' + esc(s.name) + '</a></h3></div>' +
      '<div class="row" style="justify-content:flex-end">' + statusBadge(s) + '</div></div>' +
      '<div class="row" style="margin-top:12px"><span class="badge">' + esc(s.coverage_type ? titleCase(s.coverage_type) : 'COVERAGE NOT PUBLISHED') + '</span>' +
        (s.study_levels || []).slice(0, 3).map(function (l) { return '<span class="badge">' + esc(levelLabel(l)) + '</span>'; }).join('') +
        (need ? '<span class="badge badge-steel">NEED-BASED</span>' : '') +
        (isCollegeSpecific(s) ? '<span class="badge">UNIVERSITY AWARD</span>' : '') +
      '</div>' +
      '<p style="margin-top:12px">' + (s.value_verbatim ? esc(s.value_verbatim) : nullState('award value', s.source_url)) + '</p>' +
      '<p class="small dim" style="margin-top:8px">Deadline: ' + (s.deadline_date ? esc(fmtDate(s.deadline_date)) : 'not published') +
        ((s.destination_countries || []).length ? ' · Study in ' + esc(s.destination_countries.slice(0, 3).map(cname).join(', ')) : '') + '</p>' +
      why +
      '<div style="margin-top:14px"><div class="bar"><span style="width:' + pct + '%"></span></div>' +
      '<p class="label" style="margin-top:7px">' + esc(rankReason(r)) + '</p></div>' +
      '<div class="row" style="margin-top:14px"><a class="btn btn-sm" href="#/scholarships/' + esc(s.slug) + '">Open record</a>' +
      '<button class="btn btn-sm" data-save="' + esc(s.slug) + '">' + (loadShortlist().indexOf(s.slug) >= 0 ? 'Saved ✓' : 'Save') + '</button></div>' +
      '</article>';
  }
  function fmtF(n) { return n == null ? '—' : (Math.round(n * 100) / 100); }

  /**
   * Why a record sits where it does, in words a applicant can act on.
   * The engine's four ranking factors are still what decides the order — this
   * just says what they mean instead of printing the arithmetic.
   */
  function rankReason(r) {
    var f = r.factors || {}, s = r.scholarship, bits = [];
    if (f.value_score >= 0.85) bits.push('covers the most');
    else if (f.value_score <= 0.4) bits.push('partial support');
    if (f.fit >= 0.85) bits.push('close match to your profile');
    else if (f.fit <= 0.45) bits.push('loose match');
    if (f.competition_factor >= 2.5) bits.push('few awards, very competitive');
    else if (f.competition_factor <= 1.3) bits.push('many awards given');
    var d = s.deadline_date ? daysUntil(s.deadline_date) : null;
    if (s.status === 'open' && d !== null && d >= 0 && d <= 30) bits.push('closing soon');
    else if (s.status === 'cycle_closed') bits.push('waiting on the next round');
    return bits.length ? 'RANKED HERE BECAUSE: ' + bits.join(' · ') : 'RANKED ON VALUE, FIT, COMPETITION AND DEADLINE';
  }
  function ruleText(c) {
    if (!c) return '';
    var v = Array.isArray(c.value) ? c.value.map(function (x) { return V.COUNTRY_NAME[x] || x; }).join(', ')
      : (V.COUNTRY_NAME[c.value] || c.value);
    return humanize(titleCase(c.attribute) + ' ' + String(c.operator).replace(/_/g, ' ') + ' ' + v);
  }

  // ------------------------------------------------------------ record page
  function recordPage(slug) {
    var s = BY_SLUG[decodeURIComponent(slug)];
    if (!s) return notFoundPage('/scholarships/' + slug);

    var p = loadProfile();
    var mine = null;
    if (p && p.nationality && p.study_level) {
      var ev = CORE.matchScholarships(p, [s], NOW);
      mine = ev.buckets.eligible_now[0] || ev.buckets.eligible_if_you_act[0] ||
             ev.buckets.competitive_stretch[0] || ev.buckets.not_eligible[0];
    }
    var byRule = {};
    if (mine && mine.evaluations) mine.evaluations.forEach(function (e) { byRule[ruleKey(e.criterion)] = e; });

    var saved = loadShortlist().indexOf(s.slug) >= 0;
    var need = needBasedRules(s), numericNeed = numericIncomeRules(s);

    return '' +
    '<div class="wrap section">' +
      '<p class="small"><a href="#/explore">Register</a> <span class="dim">/</span> ' +
        esc(cname((s.destination_countries || [])[0]) || 'Global') +
        (s.school_name ? ' <span class="dim">/</span> <a href="#/schools">' + esc(s.school_name) + '</a>' : '') + '</p>' +

      '<div style="margin-top:18px"><p class="label">' + esc(s.funder_name || '') + '</p>' +
      '<h1 style="margin-top:8px">' + esc(s.name) + '</h1></div>' +

      '<div class="row" style="margin-top:16px">' + statusBadge(s) + freshnessBadge(s) +
        '<span class="badge">' + esc(s.coverage_type ? titleCase(s.coverage_type) : 'COVERAGE NOT PUBLISHED') + '</span>' +
        (s.study_levels || []).map(function (l) { return '<span class="badge">' + esc(levelLabel(l)) + '</span>'; }).join('') +
        (isCollegeSpecific(s) ? '<span class="badge badge-steel">UNIVERSITY-SPECIFIC</span>' : '') +
      '</div>' +

      '<div class="row" style="margin-top:20px">' +
        (s.application_url ? '<a class="btn btn-primary" href="' + esc(s.application_url) + '" target="_blank" rel="noreferrer">Apply on the official page</a>' : '') +
        '<button class="btn" data-save="' + esc(s.slug) + '">' + (saved ? 'Saved ✓' : 'Save to my calendar') + '</button></div>' +

      (mine ? verdictBlock(mine) : '<div class="banner" style="margin-top:26px"><p class="label">NO PROFILE YET</p><p class="muted" style="margin-top:8px">Fill in the intake and every rule below is ticked against you. <a href="#intake">Start the intake</a>.</p></div>') +

      (need.length ? '<div class="banner" style="margin-top:16px;border-color:var(--steel)"><p class="label" style="color:var(--steel)">NEED-BASED AWARD</p>' +
        '<p class="muted small" style="margin-top:8px;max-width:66ch">This funder assesses financial need in prose, not against a number, so no engine can tell you whether you qualify. What they published:</p>' +
        need.map(function (c) { return '<p class="snippet">“' + esc(c.source_snippet || c.value) + '”</p>'; }).join('') +
        (p && p.declares_financial_need ? '<p class="small" style="margin-top:10px">You said you will apply as a need-based candidate — expect to evidence it with documents.</p>' : '') +
        '</div>' : '') +

      (numericNeed.length ? '<div class="banner" style="margin-top:16px"><p class="label">PUBLISHED INCOME CAP</p>' +
        numericNeed.map(function (c) {
          var mineAmt = p && p.household_income_amount;
          return '<p style="margin-top:8px">Cap: <strong>' + esc(c.value.toLocaleString('en')) + '</strong>' +
            (mineAmt != null ? ' · you entered <strong>' + esc(fmtMoney(mineAmt, p.household_income_currency)) + '</strong>' : ' · you have not entered an income') +
            '</p><p class="small dim" style="margin-top:4px">The funder does not state the currency of this cap on the page we read — confirm on the official page before relying on this comparison.</p>' +
            '<p class="snippet">“' + esc(c.source_snippet || '') + '”</p>';
        }).join('') + '</div>' : '') +

      '<hr class="rule">' +
      '<h2>What it is worth</h2>' +
      '<div class="grid grid-2" style="margin-top:16px">' +
        kv('Award value (funder wording)', s.value_verbatim, s.source_url) +
        kv('Duration', s.duration_note, s.source_url) +
        kv('Number of awards', s.number_of_awards != null ? String(s.number_of_awards) : s.award_count_note, s.source_url) +
        kv('Renewable', s.renewable == null ? null : (s.renewable ? 'Yes — ' + (s.renewal_conditions || 'conditions on the official page') : 'No'), s.source_url) +
        kv('Where you can study', (s.destination_countries || []).length ? s.destination_countries.map(cname).join(', ') : null, s.source_url) +
        kv('Who can apply (nationality)', (s.eligible_nationalities || []).length ? s.eligible_nationalities.map(cname).join(', ') : null, s.source_url) +
      '</div>' +

      '<hr class="rule">' + timelineBlock(s) +
      '<hr class="rule">' + eligibilityBlock(s, byRule, !!mine) +
      '<hr class="rule">' + checklistBlock(s) +
      '<hr class="rule">' + procedureBlock(s) +
      '<hr class="rule">' + catchesBlock(s) +
      '<hr class="rule">' + provenanceBlock(s) +
      ctaBlock(p) +
    '</div>' +
    // The closing tag is escaped so this file can also be inlined into a page.
    '<script type="application/ld+json">' + jsonLd(s) + '<\/script>';
  }

  function ruleKey(c) { return c.attribute + '|' + c.operator + '|' + JSON.stringify(c.value); }

  function timelineBlock(s) {
    var items = [];
    if (s.application_opens) items.push({ d: s.application_opens, t: 'Applications open', k: 'open' });
    (s.rounds || []).forEach(function (r) { if (r.deadline) items.push({ d: r.deadline, t: r.round || 'Round deadline', k: 'round' }); });
    if (s.deadline_date) items.push({ d: s.deadline_date, t: 'Application deadline' + (s.deadline_type ? ' (' + titleCase(s.deadline_type) + ')' : ''), k: 'deadline' });
    items.sort(function (a, b) { return a.d < b.d ? -1 : 1; });

    return '<h2>Timeline</h2>' +
      '<p class="muted small" style="margin-top:8px;max-width:64ch">Only dates the funder published. Nothing here is estimated.</p>' +
      '<div class="card" style="margin-top:16px">' +
        (!items.length ? '<p class="null">NOT PUBLISHED — no dates for this award</p>' :
          items.map(function (i) {
            var d = daysUntil(i.d);
            return '<div class="step"><span class="stepno">' + (i.k === 'deadline' ? '!' : '·') + '</span><div style="min-width:0">' +
              '<p><strong>' + esc(fmtDate(i.d)) + '</strong> — ' + esc(i.t) + '</p>' +
              '<p class="small dim" style="margin-top:4px">' + (d < 0 ? 'passed ' + Math.abs(d) + ' days ago' : 'in ' + d + ' days') + '</p></div></div>';
          }).join('')) +
        (s.decision_timeline_note ? '<p class="small muted" style="margin-top:14px"><strong>Decision:</strong> ' + esc(s.decision_timeline_note) + '</p>' : '<p class="null" style="margin-top:14px">NOT PUBLISHED — decision timeline</p>') +
        (s.status === 'cycle_closed' ? '<p class="null" style="margin-top:12px">This cycle has closed. The historic dates are kept so you can plan the next round — no next-cycle date is asserted unless the funder published one.</p>' : '') +
      '</div>';
  }

  function eligibilityBlock(s, byRule, hasProfile) {
    return '<h2>Eligibility rules</h2>' +
      '<p class="muted small" style="margin-top:8px;max-width:66ch">Each rule is quoted from the official page. ' +
        (hasProfile ? 'Ticks are computed against your profile — a dashed box means the funder published a rule we cannot check because you have not given us that detail.' : 'Fill in the intake to have these ticked against you.') + '</p>' +
      '<div class="card" style="margin-top:16px">' +
      (!(s.criteria || []).length ? '<p class="null">NOT PUBLISHED — eligibility rules</p>' :
        s.criteria.map(function (c) {
          var ev = byRule[ruleKey(c)], st = ev ? ev.status : null;
          var cls = st === 'satisfied' ? 'ok' : st === 'failed' ? 'no' : 'unk';
          var mark = st === 'satisfied' ? '✓' : st === 'failed' ? '✕' : '?';
          return '<div class="crit"><span class="tick ' + cls + '" aria-hidden="true">' + mark + '</span><div style="min-width:0">' +
            '<p><strong>' + esc(ruleText(c)) + '</strong> ' + (c.is_hard ? '<span class="badge badge-warn">HARD</span>' : '<span class="badge">PREFERRED</span>') + '</p>' +
            (ev ? '<p class="small dim" style="margin-top:5px">' + esc(humanize(ev.explanation)) + '</p>' : '') +
            (c.source_snippet ? '<p class="snippet">“' + esc(c.source_snippet) + '”</p>' : '<p class="small dim" style="margin-top:5px">No verbatim snippet recorded for this rule.</p>') +
          '</div></div>';
        }).join('')) + '</div>';
  }

  /** Requirements are tagged with the Involve service that actually helps. */
  function checklistBlock(s) {
    var reqs = s.requirements || [];
    var svcCount = { resume: 0, consulting: 0 };
    var rows = reqs.map(function (q, i) {
      var svc = V.helpFor(q.item + ' ' + (q.spec || '') + ' ' + (q.prompt_text || ''));
      if (svc) svcCount[svc]++;
      var help = svc ? '<p class="small" style="margin-top:7px"><a href="' + esc(V.HELP_COPY[svc].url) + '" target="_blank" rel="noreferrer">' +
        esc(V.HELP_COPY[svc].name) + ' helps with this</a> <span class="dim">— ' + esc(V.HELP_COPY[svc].line) + '</span></p>' : '';
      return '<div class="crit"><span class="tick" aria-hidden="true">' + (i + 1) + '</span><div style="min-width:0">' +
        '<p><strong>' + esc(q.item) + '</strong> ' + (q.mandatory ? '<span class="badge badge-warn">REQUIRED</span>' : '<span class="badge">OPTIONAL</span>') +
        (svc ? ' <span class="badge badge-steel">' + (svc === 'resume' ? 'CV WORK' : 'WRITTEN WORK') + '</span>' : '') + '</p>' +
        (q.spec ? '<p class="small muted" style="margin-top:5px">' + esc(q.spec) + '</p>' : '') +
        (q.prompt_text ? '<p class="snippet">Prompt: “' + esc(q.prompt_text) + '”</p>' : '') + help +
      '</div></div>';
    }).join('');

    var summary = '';
    if (svcCount.resume || svcCount.consulting) {
      summary = '<div class="banner" style="margin-top:16px"><p class="label">WHERE INVOLVE HELPS ON THIS ONE</p>' +
        (svcCount.resume ? '<p class="small" style="margin-top:8px">' + svcCount.resume + ' item' + (svcCount.resume === 1 ? '' : 's') +
          ' need a CV in academic format — <a href="' + esc(V.HELP_COPY.resume.url) + '" target="_blank" rel="noreferrer">Involve Resume</a>.</p>' : '') +
        (svcCount.consulting ? '<p class="small" style="margin-top:6px">' + svcCount.consulting + ' item' + (svcCount.consulting === 1 ? '' : 's') +
          ' are essays, statements, references or interviews — <a href="' + esc(V.HELP_COPY.consulting.url) + '" target="_blank" rel="noreferrer">Involve Consulting</a>.</p>' : '') +
        '</div>';
    }

    return '<h2>Document checklist</h2>' +
      '<div class="card" style="margin-top:16px">' + (reqs.length ? rows : '<p class="null">NOT PUBLISHED — document checklist</p>') + '</div>' + summary;
  }

  function procedureBlock(s) {
    var steps = (s.procedure_steps || []).slice().sort(function (a, b) { return (a.step_no || 0) - (b.step_no || 0); });
    return '<h2>How to apply</h2>' +
      '<div class="card" style="margin-top:16px">' +
      (!steps.length ? '<p class="null">NOT PUBLISHED — application procedure</p>' :
        steps.map(function (st) {
          return '<div class="step"><span class="stepno">' + esc(st.step_no) + '</span><div style="min-width:0">' +
            '<p><strong>' + esc(st.title) + '</strong> <span class="badge">' + esc(titleCase(st.owner || 'unspecified')) + ' does this</span></p>' +
            (st.detail ? '<p class="small muted" style="margin-top:5px">' + esc(st.detail) + '</p>' : '') +
            (st.url ? '<p class="small" style="margin-top:5px"><a href="' + esc(st.url) + '" target="_blank" rel="noreferrer">' + esc(st.url) + '</a></p>' : '') +
          '</div></div>';
        }).join('')) +
      (s.requires_nomination === true ? '<p class="null" style="margin-top:14px">Requires nomination — you cannot apply directly. ' + esc(s.nomination_note || '') + '</p>' : '') +
      (s.requires_university_admission_first === true ? '<p class="null" style="margin-top:10px">You must hold university admission before applying.</p>' : '') +
      (s.requires_university_admission_first == null ? '<p class="null" style="margin-top:10px">Whether admission is needed first is NOT PUBLISHED — check the official page.</p>' : '') +
      '</div>';
  }

  function catchesBlock(s) {
    var rows = [['Bond or return clause', s.bond_or_return_clause], ['Work restrictions during the award', s.work_restrictions],
      ['Tax treatment', s.taxable_note], ['Combinable with other awards', s.combinable_with_other_awards]];
    return '<h2>Catches</h2><p class="muted small" style="margin-top:8px;max-width:64ch">The conditions that are easy to miss. A blank here means the funder did not publish it — not that there is no catch.</p>' +
      '<div class="grid grid-2" style="margin-top:16px">' + rows.map(function (c) { return kv(c[0], c[1], s.source_url); }).join('') + '</div>';
  }

  function provenanceBlock(s) {
    return '<h2>Where this came from</h2><div class="card" style="margin-top:16px">' +
      '<div class="row">' + freshnessBadge(s) + (s.verification_status === 'official_page_verified' ? '<span class="badge">CHECKED ON THE FUNDER\u2019S OWN PAGE</span>' : '') + '</div>' +
      '<p class="snippet" style="margin-top:14px">“' + esc(s.source_snippet) + '”</p>' +
      '<p class="small" style="margin-top:14px"><a href="' + esc(s.source_url) + '" target="_blank" rel="noreferrer">' + esc(s.source_url) + '</a></p>' +
      '<p class="small dim" style="margin-top:10px">Last verified ' + esc(fmtDate(s.last_verified_at) || 'date not recorded') +
      '. Funders change their pages without notice — always confirm on the official page before you rely on anything here.</p></div>';
  }

  function verdictBlock(r) {
    var meta = BUCKET_META[r.bucket], body = '';
    if (r.bucket === 'not_eligible' && r.failing_rules && r.failing_rules.length) {
      body = '<ul style="margin:10px 0 0;padding-left:18px">' + r.failing_rules.map(function (fr) {
        return '<li class="small">' + esc(humanize(fr.explanation) || ruleText(fr.criterion)) +
          (fr.criterion && fr.criterion.source_snippet ? '<span class="snippet">“' + esc(fr.criterion.source_snippet) + '”</span>' : '') + '</li>';
      }).join('') + '</ul>';
    } else if (r.blocking_actions && r.blocking_actions.length) {
      body = '<ul style="margin:10px 0 0;padding-left:18px">' + r.blocking_actions.map(function (a) {
        return '<li class="small">' + esc(humanize(a.label || a.description || a.kind)) + '</li>';
      }).join('') + '</ul>';
    } else if (r.reason) body = '<p class="small muted" style="margin-top:10px">' + esc(humanize(r.reason)) + '</p>';
    return '<div class="banner" style="margin-top:26px"><p class="label">YOUR VERDICT</p>' +
      '<p style="margin-top:8px"><strong>' + esc(meta.title) + '</strong> — ' + esc(meta.blurb) + '</p>' + body + '</div>';
  }

  function kv(label, value, url) {
    return '<div class="card card-tight"><p class="label">' + esc(label) + '</p>' +
      '<p style="margin-top:7px">' + (value ? esc(value) : nullState(label.toLowerCase(), url)) + '</p></div>';
  }

  function jsonLd(s) {
    var o = { '@context': 'https://schema.org', '@type': 'Grant', name: s.name, url: s.source_url,
      description: s.value_verbatim || s.deadline_note || s.name,
      funder: { '@type': 'Organization', name: s.funder_name }, identifier: s.slug };
    if (s.deadline_date) o.applicationDeadline = s.deadline_date;
    if (s.application_url) o.mainEntityOfPage = s.application_url;
    return JSON.stringify(o, null, 2).replace(/</g, '\\u003c');
  }

  // ------------------------------------------------------------ college page
  function schoolsPage() {
    if (!universitiesLoaded) {
      ensureUniversities();
      return '<div class="wrap section"><p class="eyebrow">UNIVERSITY-RUN AWARDS</p>' +
        '<h1 style="margin-top:10px">Loading university awards…</h1>' +
        '<p class="muted" style="margin-top:14px">These load separately so the main list stays fast on mobile.</p></div>';
    }
    var byName = {};
    COLLEGE.forEach(function (r) { (byName[r.school_name || 'Unnamed institution'] = byName[r.school_name || 'Unnamed institution'] || []).push(r); });
    var names = Object.keys(byName).sort();
    return '<div class="wrap section">' +
      '<p class="eyebrow">UNIVERSITY-RUN AWARDS</p>' +
      '<h1 style="margin-top:10px">Funding held by a named university</h1>' +
      '<p class="muted" style="margin-top:14px;max-width:64ch">These are listed separately because they work differently: most are decided alongside your admission rather than applied for separately, and you can only hold one if that school admits you. ' +
      COLLEGE.length + ' records across ' + names.length + ' institutions.</p>' +
      names.map(function (n) {
        var meta = SCHOOL_META[n] || {};
        return '<section style="margin-top:34px"><div class="bucket-head b2"><div class="spread">' +
          '<h2>' + esc(n) + '</h2><p class="data">' + byName[n].length + '</p></div>' +
          '<p class="small dim" style="margin-top:6px">' + esc([meta.city, cname(meta.country_code)].filter(Boolean).join(', ')) +
          (meta.scholarships_page_url ? ' · <a href="' + esc(meta.scholarships_page_url) + '" target="_blank" rel="noreferrer">official scholarships page</a>' : '') + '</p></div>' +
          byName[n].map(simpleCard).join('') + '</section>';
      }).join('') + '</div>';
  }

  // -------------------------------------------------------------- directory
  /**
   * Official directories publish far more awards than we can fully verify. We
   * carry those at listing depth and say so plainly, rather than either hiding
   * them or dressing them up as checked records.
   */
  /** Shared by both directory views, so the wording is stated once. */
  function directoryCaveat() {
    return '<p class="muted" style="margin-top:14px;max-width:64ch">These come from official ' +
      'government, agency and university scholarship databases. We list what each one publishes — ' +
      'the name, who runs it, a short description and the closing date — and link you to the ' +
      'official page. <strong>We have not yet gone through their eligibility rules one by one</strong>, ' +
      'which is what separates these from the matched results elsewhere on this site.</p>';
  }

  function directoryCard(l) {
    var d = l.deadline_date ? daysUntil(l.deadline_date) : null;
    return '<article class="card"><div class="spread"><div style="min-width:0">' +
      (l.funder_name ? '<p class="label">' + esc(l.funder_name) + '</p>' : '') +
      '<h3 style="margin-top:5px">' + (l.detail_url ? '<a href="' + esc(l.detail_url) + '" target="_blank" rel="noreferrer">' + esc(l.name) + '</a>' : esc(l.name)) + '</h3>' +
      '</div><span class="badge badge-warn">DIRECTORY LISTING</span></div>' +
      (l.summary ? '<p class="small muted" style="margin-top:10px">' + esc(String(l.summary).slice(0, 260)) + '</p>' : '') +
      '<div class="row" style="margin-top:10px">' +
        (l.study_levels || []).map(function (x) { return '<span class="badge">' + esc(levelLabel(x)) + '</span>'; }).join('') +
        (l.deadline_verbatim && !l.deadline_date ? '<span class="badge badge-ember">' + esc(l.deadline_verbatim) + '</span>' : '') +
        (l.deadline_date ? '<span class="badge' + (d >= 0 ? ' badge-ember' : ' badge-warn') + '">' + esc(fmtDate(l.deadline_date)) + (d >= 0 ? '' : ' \u00b7 passed') + '</span>' : '') +
      '</div>' +
      '<p class="small dim" style="margin-top:10px">Listed by ' + esc(l.source_name || 'an official directory') +
      '. We have not yet checked the eligibility rules for this one — open the official page for the full conditions.</p>' +
      '</article>';
  }

  /** #/directory — destinations only. Never renders 30,000 cards. */
  function directoryPage() {
    if (!listingsLoaded || !LISTING_INDEX) {
      ensureListings();
      return '<div class="wrap section"><p class="eyebrow">FUNDING DIRECTORY</p>' +
        '<h1 style="margin-top:10px">Loading the directory…</h1></div>';
    }
    var idx = LISTING_INDEX;
    var shards = idx.shards.slice().sort(function (a, b) { return b.count - a.count; });
    return '<div class="wrap section">' +
      '<p class="eyebrow">FUNDING DIRECTORY</p>' +
      '<h1 style="margin-top:10px">' + Number(idx.total).toLocaleString() + ' awards from official directories</h1>' +
      directoryCaveat() +
      '<div class="grid grid-3" style="margin-top:24px">' +
        statTile(Number(idx.total).toLocaleString(), 'listings in the directory') +
        statTile(idx.countries, 'study destinations') +
        statTile(idx.sources, 'source databases') +
      '</div>' +
      '<p class="muted small" style="margin-top:22px;max-width:64ch">Pick a destination. Each one loads on its own, so you never download the whole set.</p>' +
      '<div style="overflow-x:auto;margin-top:14px"><table><thead><tr><th>Destination</th><th class="num">Listings</th></tr></thead><tbody>' +
      shards.map(function (s) {
        return '<tr><td><a href="#/directory/' + esc(s.country) + '">' +
          esc(s.country === 'XX' ? 'Not tied to one country' : cname(s.country)) + '</a></td>' +
          '<td class="num">' + Number(s.count).toLocaleString() + '</td></tr>';
      }).join('') +
      '</tbody></table></div>' +
      '<p class="small dim" style="margin-top:18px">Prefer a plain list? <a href="/d/">Browse every listing as pages</a> — that version is also what search engines read.</p>' +
      '</div>';
  }

  /** #/directory/<CC> — searchable, paginated, bounded DOM. */
  var dirState = { cc: null, q: '', level: '', page: 0, per: 50 };

  function directoryCountryPage(cc) {
    cc = decodeURIComponent(cc);
    if (!listingsLoaded || !LISTING_INDEX) {
      ensureListings();
      return '<div class="wrap section"><p class="eyebrow">FUNDING DIRECTORY</p>' +
        '<h1 style="margin-top:10px">Loading the directory…</h1></div>';
    }
    var meta = shardMeta(cc);
    if (!meta) return notFoundPage('/directory/' + cc);
    var label = cc === 'XX' ? 'awards not tied to one country' : cname(cc);
    if (dirState.cc !== cc) { dirState = { cc: cc, q: '', level: '', page: 0, per: 50 }; }

    function draw(rows) {
      var q = dirState.q.toLowerCase();
      var list = rows.filter(function (l) {
        if (dirState.level && (l.study_levels || []).indexOf(dirState.level) < 0) return false;
        if (!q) return true;
        return ((l.name || '') + ' ' + (l.funder_name || '') + ' ' + (l.summary || '')).toLowerCase().indexOf(q) >= 0;
      });
      var pages = Math.max(1, Math.ceil(list.length / dirState.per));
      if (dirState.page >= pages) dirState.page = pages - 1;
      var slice = list.slice(dirState.page * dirState.per, (dirState.page + 1) * dirState.per);
      var host = el('dirList');
      if (!host) return;
      host.innerHTML =
        '<p class="small dim" style="margin-top:16px">' + list.length.toLocaleString() + ' listing' +
        (list.length === 1 ? '' : 's') +
        (list.length !== rows.length ? ' of ' + rows.length.toLocaleString() : '') +
        ' \u00b7 page ' + (dirState.page + 1) + ' of ' + pages +
        (rows._complete ? '' : ' \u00b7 still loading ' + (rows._total - rows.length).toLocaleString() + ' more') +
        '</p>' +
        slice.map(directoryCard).join('') +
        (pages > 1 ? '<div class="row" style="margin-top:18px">' +
          '<button class="btn btn-sm" id="dirPrev"' + (dirState.page === 0 ? ' disabled' : '') + '>Previous</button>' +
          '<button class="btn btn-sm" id="dirNext"' + (dirState.page >= pages - 1 ? ' disabled' : '') + '>Next</button></div>' : '');
      var pv = el('dirPrev'), nx = el('dirNext');
      if (pv) pv.onclick = function () { dirState.page--; draw(rows); };
      if (nx) nx.onclick = function () { dirState.page++; draw(rows); window.scrollTo(0, 0); };
    }

    function mount(rows) {
      var levels = {};
      rows.forEach(function (l) { (l.study_levels || []).forEach(function (x) { levels[x] = (levels[x] || 0) + 1; }); });
      var ctr = el('dirControls');
      if (ctr && !ctr.getAttribute('data-ready')) {
        ctr.setAttribute('data-ready', '1');
        ctr.innerHTML =
          '<input id="dirQ" class="data" placeholder="Search name, funder or description" style="min-width:280px">' +
          '<select id="dirL" class="data"><option value="">Any level</option>' +
          Object.keys(levels).sort().map(function (k) {
            return '<option value="' + esc(k) + '">' + esc(levelLabel(k)) + '</option>';
          }).join('') + '</select>';
        var qi = el('dirQ'), li = el('dirL'), t;
        qi.value = dirState.q;
        qi.oninput = function () {
          clearTimeout(t);
          t = setTimeout(function () { dirState.q = qi.value; dirState.page = 0; draw(rows); }, 160);
        };
        li.onchange = function () { dirState.level = li.value; dirState.page = 0; draw(rows); };
      }
      draw(rows);
    }

    ensureCountry(cc, mount, function (rows) { mount(rows); });

    return '<div class="wrap section">' +
      '<p class="small"><a href="#/directory">Funding directory</a> <span class="dim">/</span> ' + esc(label) + '</p>' +
      '<h1 style="margin-top:14px">' + esc(cc === 'XX' ? 'Awards not tied to one country' : 'Scholarships in ' + label) + '</h1>' +
      '<p class="muted" style="margin-top:10px">' + Number(meta.count).toLocaleString() + ' listings from official sources.</p>' +
      directoryCaveat() +
      '<div class="row" id="dirControls" style="margin-top:20px"></div>' +
      '<div id="dirList"><p class="muted" style="margin-top:16px">Loading…</p></div>' +
      '</div>';
  }

  // ---------------------------------------------------------------- explore
  function explorePage() {
    var byCountry = {};
    GENERAL.forEach(function (r) {
      (r.destination_countries && r.destination_countries.length ? r.destination_countries : ['any']).forEach(function (c) {
        var b = byCountry[c] = byCountry[c] || { total: 0, levels: {}, coverage: {}, open: 0 };
        b.total++; if (r.status === 'open') b.open++;
        (r.study_levels || []).forEach(function (l) { b.levels[l] = (b.levels[l] || 0) + 1; });
        if (r.coverage_type) b.coverage[r.coverage_type] = (b.coverage[r.coverage_type] || 0) + 1;
      });
    });
    var countries = Object.keys(byCountry).sort(function (a, b) { return byCountry[b].total - byCountry[a].total; });
    return '<div class="wrap section"><p class="eyebrow">BROWSE ALL FUNDING</p>' +
      '<h1 style="margin-top:10px">Destination × level × funding type</h1>' +
      '<p class="muted" style="margin-top:14px;max-width:62ch">Counts update automatically as new awards are added. University-run awards are listed separately on their own page.</p>' +
      '<div class="row" style="margin-top:20px"><a class="btn btn-sm" href="#/explore/deadlines">Deadlines by month</a>' +
      '<a class="btn btn-sm" href="#/schools">University awards</a><a class="btn btn-sm" href="#/calendar">My calendar</a></div>' +
      '<div style="overflow-x:auto;margin-top:26px"><table><thead><tr><th>Destination</th><th class="num">Records</th><th class="num">Open</th>' +
      V.STUDY_LEVELS.map(function (l) { return '<th class="num">' + esc(l.label) + '</th>'; }).join('') + '<th class="num">Full ride</th></tr></thead><tbody>' +
      countries.map(function (c) {
        var b = byCountry[c];
        return '<tr><td><a href="#/explore/' + esc(c) + '">' + esc(cname(c)) + '</a></td><td class="num">' + b.total + '</td><td class="num">' + b.open + '</td>' +
          V.STUDY_LEVELS.map(function (l) { return '<td class="num dim">' + (b.levels[l.key] || '·') + '</td>'; }).join('') +
          '<td class="num dim">' + (b.coverage.full_ride || '·') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="small dim" style="margin-top:14px">A record counts once per destination it lists, so column totals exceed ' + GENERAL.length + '.</p></div>';
  }

  function exploreCountryPage(code) {
    code = decodeURIComponent(code);
    var list = ALL.filter(function (r) { return (r.destination_countries || []).indexOf(code) >= 0; });
    if (!list.length) return notFoundPage('/explore/' + code);
    return '<div class="wrap section"><p class="small"><a href="#/explore">Explore</a> <span class="dim">/</span> ' + esc(cname(code)) + '</p>' +
      '<h1 style="margin-top:14px">Funding to study in ' + esc(cname(code)) + '</h1>' +
      '<p class="muted" style="margin-top:12px">' + list.length + ' records · ' + list.filter(function (r) { return r.status === 'open'; }).length + ' currently open</p>' +
      '<div style="margin-top:24px">' + list.map(simpleCard).join('') + '</div></div>';
  }

  function simpleCard(s) {
    return '<article class="card"><div class="spread"><div style="min-width:0">' +
      '<p class="label">' + esc(s.funder_name || '') + '</p>' +
      '<h3 style="margin-top:5px"><a href="#/scholarships/' + esc(s.slug) + '">' + esc(s.name) + '</a></h3></div>' + statusBadge(s) + '</div>' +
      '<p style="margin-top:10px">' + (s.value_verbatim ? esc(s.value_verbatim) : nullState('award value', s.source_url)) + '</p>' +
      '<div class="row" style="margin-top:10px"><span class="badge">' + esc(s.coverage_type ? titleCase(s.coverage_type) : 'COVERAGE NOT PUBLISHED') + '</span>' +
      (s.deadline_date ? '<span class="badge">' + esc(fmtDate(s.deadline_date)) + '</span>' : '<span class="badge badge-warn">DEADLINE NOT PUBLISHED</span>') +
      (needBasedRules(s).length ? '<span class="badge badge-steel">NEED-BASED</span>' : '') + '</div></article>';
  }

  function deadlinesPage() {
    var withDl = ALL.filter(function (r) { return r.deadline_date && r.status !== 'discontinued'; });
    var byMonth = {};
    withDl.forEach(function (r) { (byMonth[String(r.deadline_date).slice(0, 7)] = byMonth[String(r.deadline_date).slice(0, 7)] || []).push(r); });
    var months = Object.keys(byMonth).sort();
    var missing = ALL.length - withDl.length;
    return '<div class="wrap section"><p class="small"><a href="#/explore">Explore</a> <span class="dim">/</span> deadlines</p>' +
      '<h1 style="margin-top:14px">Deadlines by month</h1>' +
      '<p class="muted" style="margin-top:12px;max-width:62ch">Only dates a funder actually published. <strong>' + missing + ' of ' + ALL.length + '</strong> records have no published deadline and are listed at the bottom rather than given an invented date.</p>' +
      months.map(function (m) {
        var list = byMonth[m].slice().sort(function (a, b) { return a.deadline_date < b.deadline_date ? -1 : 1; });
        var past = new Date(m + '-01') < new Date(NOW.getFullYear(), NOW.getMonth(), 1);
        return '<section style="margin-top:34px"><div class="bucket-head ' + (past ? 'b4' : 'b1') + '"><div class="spread">' +
          '<h2>' + esc(new Date(m + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })) + '</h2>' +
          '<p class="data">' + list.length + (past ? ' · past' : '') + '</p></div></div><table><tbody>' +
          list.map(function (r) {
            return '<tr><td class="mono small" style="width:110px">' + esc(fmtDate(r.deadline_date)) + '</td>' +
              '<td><a href="#/scholarships/' + esc(r.slug) + '">' + esc(r.name) + '</a><p class="small dim">' + esc(r.funder_name || '') + '</p></td>' +
              '<td style="width:150px">' + statusBadge(r) + '</td></tr>';
          }).join('') + '</tbody></table></section>';
      }).join('') +
      '<section style="margin-top:40px"><div class="bucket-head b4"><div class="spread"><h2>No published deadline</h2><p class="data">' + missing + '</p></div></div>' +
      '<table><tbody>' + ALL.filter(function (r) { return !r.deadline_date; }).map(function (r) {
        return '<tr><td><a href="#/scholarships/' + esc(r.slug) + '">' + esc(r.name) + '</a></td><td class="small dim">' + esc(r.deadline_note || 'no note recorded') + '</td></tr>';
      }).join('') + '</tbody></table></section></div>';
  }

  function calendarPage() {
    var slugs = loadShortlist();
    if (!slugs.length) {
      return '<div class="wrap section"><p class="eyebrow">MY CALENDAR</p><h1>Nothing saved yet</h1>' +
        '<p class="muted" style="margin-top:14px;max-width:58ch">Save awards from your results or any record page, and their deadlines collect here as a downloadable calendar.</p>' +
        '<div class="row" style="margin-top:22px"><a class="btn btn-primary" href="#/results">See my matches</a><a class="btn" href="#/explore/deadlines">Browse deadlines</a></div></div>';
    }
    var picked = slugs.map(function (s) { return BY_SLUG[s]; }).filter(Boolean);
    var entries = CORE.buildCalendar(picked);
    var noDate = picked.filter(function (r) { return !r.deadline_date; });
    return '<div class="wrap section"><p class="eyebrow">MY CALENDAR</p>' +
      '<h1 style="margin-top:10px">' + picked.length + ' saved · ' + entries.length + ' dated event' + (entries.length === 1 ? '' : 's') + '</h1>' +
      '<div class="row noprint" style="margin-top:20px"><button class="btn btn-primary" id="ics">Download .ics</button>' +
      '<button class="btn" onclick="window.print()">Print / save as PDF</button></div>' +
      '<div style="margin-top:26px">' + (!entries.length ? '<p class="null">None of your saved awards has a published deadline.</p>' :
        '<table><thead><tr><th>Date</th><th>Event</th><th>In</th></tr></thead><tbody>' +
        entries.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).map(function (e) {
          var d = daysUntil(e.date);
          return '<tr><td class="mono small" style="width:120px">' + esc(fmtDate(e.date)) + '</td>' +
            '<td><a href="#/scholarships/' + esc(e.slug) + '">' + esc(e.title) + '</a></td>' +
            '<td class="num small ' + (d < 0 ? 'dim' : '') + '">' + (d < 0 ? 'passed' : d + ' days') + '</td></tr>';
        }).join('') + '</tbody></table>') + '</div>' +
      (noDate.length ? '<div class="card" style="margin-top:24px"><p class="label">SAVED, NO PUBLISHED DEADLINE (' + noDate.length + ')</p>' +
        '<p class="small muted" style="margin-top:8px">These stay on your list but cannot be given a calendar date without inventing one.</p><ul style="margin:10px 0 0;padding-left:18px">' +
        noDate.map(function (r) { return '<li class="small"><a href="#/scholarships/' + esc(r.slug) + '">' + esc(r.name) + '</a></li>'; }).join('') + '</ul></div>' : '') +
      '<div class="row noprint" style="margin-top:24px"><button class="btn btn-sm" id="clearList">Clear saved list</button></div></div>';
  }

  function methodologyPage() {
    var open = ALL.filter(function (r) { return r.status === 'open'; }).length;
    var withDl = ALL.filter(function (r) { return !!r.deadline_date; }).length;
    var stale = ALL.filter(function (r) { var d = r.last_verified_at ? daysSince(r.last_verified_at) : null; return d !== null && d > STALE_DAYS; }).length;
    return '<div class="wrap-narrow section"><p class="eyebrow">METHODOLOGY</p><h1 style="margin-top:10px">How we check every award</h1>' +
      '<div class="stack" style="margin-top:22px">' +
        '<p class="muted">Every entry is read from an official funder, government or university page. We never copy from scholarship listing sites — if we cannot find the funder\u2019s own page, the award does not go in.</p>' +
        '<p class="muted">Every entry shows you the page it came from, quotes the funder\u2019s own wording for each rule, and tells you when we last checked it. Anything we cannot show a source for does not go in.</p>' +
        '<p class="muted">Where a funder has not published something, the field is null and the page says <em>NOT PUBLISHED</em>. Nulls are never filled from general knowledge, and amounts keep the funder’s original currency and wording.</p>' +
        '<p class="muted">Financial need is the clearest case. Where a funder publishes an income cap as a figure, we compare it with yours. Where they simply ask you to demonstrate need, we mark the award need-based and quote what they said, rather than deciding on your behalf.</p>' +
      '</div>' +
      '<h2 style="margin-top:36px">Coverage, stated honestly</h2>' +
      '<div class="grid grid-2" style="margin-top:16px">' + statTile(ALL.length, 'records') + statTile(open, 'currently open') +
      statTile(withDl, 'with a published deadline') + statTile(stale, 'not re-verified in 90 days') + '</div>' +
      '<p class="small dim" style="margin-top:14px">Counted from the live database each time this page loads.</p>' +
      '<h2 style="margin-top:36px">The four buckets</h2><div style="margin-top:14px">' +
      Object.keys(BUCKET_META).map(function (k) {
        return '<div class="card card-tight" style="margin-top:10px"><p class="label">' + esc(BUCKET_META[k].title) + '</p>' +
          '<p class="small muted" style="margin-top:6px">' + esc(BUCKET_META[k].blurb) + '</p></div>';
      }).join('') + '</div>' +
      '<h2 style="margin-top:36px">Ranking</h2>' +
      '<p class="muted" style="margin-top:12px">Within each group, awards are ordered by how much they cover, how closely they match your profile, how competitive they are, and how soon they close. Every result card says in plain words why it sits where it does.</p></div>';
  }

  // --------------------------------------------------------------------- CTA
  function ctaBlock(p) {
    var has = !!(p && p.nationality);
    return '<section class="card noprint" style="margin-top:46px;border-color:var(--hairline-strong)">' +
      '<p class="eyebrow">INVOLVE</p>' +
      '<h2 style="margin-top:10px;max-width:24ch">A shortlist is not an application.</h2>' +
      '<p class="muted" style="margin-top:12px;max-width:62ch">The buckets tell you what you qualify for. They do not tell you whether your CV, essays and references will survive a selection panel — and that is where funded places are won and lost.</p>' +
      '<div class="grid grid-2" style="margin-top:18px">' +
        '<div class="card card-tight"><p class="label">CV AND RESUME</p><p class="small muted" style="margin-top:6px">' + esc(V.HELP_COPY.resume.line) + '</p>' +
          '<p class="small" style="margin-top:8px"><a href="' + esc(V.HELP_COPY.resume.url) + '" target="_blank" rel="noreferrer">involveresume.com</a></p></div>' +
        '<div class="card card-tight"><p class="label">ESSAYS, LETTERS AND INTERVIEWS</p><p class="small muted" style="margin-top:6px">' + esc(V.HELP_COPY.consulting.line) + '</p>' +
          '<p class="small" style="margin-top:8px"><a href="' + esc(V.HELP_COPY.consulting.url) + '" target="_blank" rel="noreferrer">involve-consulting.com</a></p></div>' +
      '</div>' +
      (has ? '<label class="row" style="margin-top:18px;align-items:flex-start;gap:10px">' +
        '<input type="checkbox" id="consent" style="width:auto;margin-top:4px">' +
        '<span class="small">Send my intake profile — including anything I wrote in “any other status” — to Involve Consulting so the review starts from real detail. Unticked, the link opens with nothing attached.</span></label>' : '') +
      '<div class="row" style="margin-top:16px"><button class="btn btn-primary" id="cta">Get a free profile review</button></div>' +
      '<p class="small dim" style="margin-top:12px">Browsing, matching and every record on this site are free and always will be — this is public information.</p></section>';
  }

  // -------------------------------------------------------------------- bind
  function bind() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-save]'), function (b) {
      b.addEventListener('click', function () { b.textContent = toggleShortlist(b.getAttribute('data-save')) ? 'Saved ✓' : 'Save'; });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-chip]'), function (b) {
      // Picker chips are removed by their own handler, not toggled.
      if (b.getAttribute('data-picker-chip')) return;
      b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); });
    });
    bindPickers();
    Array.prototype.forEach.call(document.querySelectorAll('[data-radio]'), function (b) {
      b.addEventListener('click', function () {
        var g = b.getAttribute('data-radio'), turnOn = b.getAttribute('aria-pressed') !== 'true';
        Array.prototype.forEach.call(document.querySelectorAll('[data-radio="' + g + '"]'), function (o) {
          o.setAttribute('aria-pressed', String(o === b && turnOn));
        });
      });
    });
    var form = el('intake-form'); if (form) form.addEventListener('submit', onSubmit);
    var ics = el('ics'); if (ics) ics.addEventListener('click', downloadIcs);
    var cl = el('clearList'); if (cl) cl.addEventListener('click', function () { saveShortlist([]); render(); });
    var ca = el('clearAll'); if (ca) ca.addEventListener('click', function () {
      try { window.localStorage.removeItem(PROFILE_KEY); window.localStorage.removeItem(SHORTLIST_KEY); } catch (e) {}
      go('/');
    });
    var cta = el('cta'); if (cta) cta.addEventListener('click', function () {
      var consent = el('consent'), base = V.HELP_COPY.consulting.url + '/contact';
      if (consent && consent.checked) {
        var p = loadProfile() || {}, q = ['source=scholarships'];
        if (p.nationality) q.push('nationality=' + encodeURIComponent(cname(p.nationality)));
        if (p.study_level) q.push('level=' + encodeURIComponent(p.study_level));
        if ((p.course_groups || []).length) q.push('course=' + encodeURIComponent(p.course_groups.join(',')));
        if ((p.destinations || []).length) q.push('destinations=' + encodeURIComponent(p.destinations.map(cname).join(',')));
        if ((p.target_schools || []).length) q.push('schools=' + encodeURIComponent(p.target_schools.join(',')));
        if (p.application_year) q.push('year=' + p.application_year);
        if (p.other_status_note) q.push('notes=' + encodeURIComponent(p.other_status_note));
        window.open(base + '?' + q.join('&'), '_blank', 'noopener');
      } else window.open(base, '_blank', 'noopener');
    });
  }

  var RANGES = { ielts: [0, 9], toefl: [0, 120], gre: [260, 340], gmat: [205, 805] };

  function chosen(group) {
    return Array.prototype.slice.call(document.querySelectorAll('[data-chip="' + group + '"][aria-pressed="true"]'))
      .map(function (b) { return b.getAttribute('data-value'); });
  }
  function triValue(group) {
    var on = document.querySelector('[data-radio="' + group + '"][aria-pressed="true"]');
    return on ? on.getAttribute('data-value') === 'yes' : null;
  }

  function onSubmit(e) {
    e.preventDefault();
    var bad = false;
    var nat = el('f-nat').value, lvl = el('f-level').value;
    el('e-nat').hidden = !!nat; if (!nat) bad = true;
    el('e-level').hidden = !!lvl; if (!lvl) bad = true;

    function reads(id, key) {
      var raw = el(id).value.trim();
      if (raw === '') { var e0 = el('e-' + key); if (e0) e0.hidden = true; return null; }
      var n = Number(raw), r = RANGES[key], errEl = el('e-' + key);
      var ok = isFinite(n) && (!r || (n >= r[0] && n <= r[1]));
      if (errEl) errEl.hidden = ok;
      if (!ok) { bad = true; return null; }
      return n;
    }
    var ts = {};
    ['ielts', 'toefl', 'gre', 'gmat'].forEach(function (k) { var v = reads('f-' + k, k); if (v !== null) ts[k] = v; });

    var ageRaw = el('f-age').value.trim();
    var age = ageRaw === '' ? null : Number(ageRaw);
    var ageOk = age === null || (isFinite(age) && age >= 14 && age <= 99);
    el('e-age').hidden = ageOk; if (!ageOk) { bad = true; age = null; }

    var gv = el('f-gpa').value.trim(), gs = el('f-gpascale').value.trim();
    var gpa = null, gpaOk = true;
    if (gv !== '' && gs !== '') {
      var a = Number(gv), b = Number(gs);
      gpaOk = isFinite(a) && isFinite(b) && b > 0 && a <= b && a >= 0;
      if (gpaOk) gpa = { value: a, scale: b };
    }
    el('e-gpa').hidden = gpaOk; if (!gpaOk) bad = true;

    if (bad) { el('e-nat').scrollIntoView({ block: 'center' }); return; }

    var course = el('f-course').value.trim();
    var incomeRaw = el('f-income').value.trim();
    var workRaw = el('f-work').value.trim();
    var yearRaw = el('f-year').value;

    saveProfile(sanitizeProfile({
      nationality: nat, study_level: lvl, residence: el('f-res').value || nat,
      age: age, gender: el('f-gender').value || null,
      fields: course ? course.split(',').map(function (x) { return x.trim(); }).filter(Boolean) : [],
      course_groups: chosen('course_groups'),
      destinations: chosen('destinations'),
      target_schools: chosen('target_schools'),
      certified_languages: chosen('certified_languages'),
      special_status: chosen('special_status'),
      application_year: yearRaw ? Number(yearRaw) : null,
      intake_term: el('f-term').value || null,
      highest_degree: el('f-degree').value || null,
      prior_degree_class: el('f-class').value || null,
      prior_degree_field: el('f-priorfield').value.trim() || null,
      gpa: gpa,
      test_scores: Object.keys(ts).length ? ts : null,
      work_experience_years: workRaw === '' ? null : Number(workRaw),
      employment_status: el('f-employ').value || null,
      household_income_amount: incomeRaw === '' ? null : Number(incomeRaw),
      household_income_currency: el('f-cur').value || null,
      declares_financial_need: triValue('declares_financial_need'),
      enrolled_full_time: triValue('enrolled_full_time'),
      has_admission: triValue('has_admission'),
      holds_other_award: triValue('holds_other_award'),
      willing_to_return_home: triValue('willing_to_return_home'),
      other_status_note: el('f-other').value.trim() || null
    }));
    go('/results');
  }

  function downloadIcs() {
    var picked = loadShortlist().map(function (s) { return BY_SLUG[s]; }).filter(Boolean);
    var text = CORE.toICS(CORE.buildCalendar(picked), new Date());
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'involve-scholarships.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  // ------------------------------------------------------------------ routes
  route(/^\/$/, homePage);
  route(/^\/results$/, resultsPage);
  route(/^\/schools$/, schoolsPage);
  route(/^\/directory$/, directoryPage);
  route(/^\/directory\/([^/]+)$/, directoryCountryPage);
  route(/^\/scholarships\/([^/]+)$/, recordPage);
  route(/^\/explore$/, explorePage);
  route(/^\/explore\/deadlines$/, deadlinesPage);
  route(/^\/explore\/([^/]+)$/, exploreCountryPage);
  route(/^\/calendar$/, calendarPage);
  route(/^\/methodology$/, methodologyPage);

  window.addEventListener('hashchange', function () {
    if (window.location.hash === '#intake') {
      if (currentPath() !== '/') { window.location.hash = '#/'; setTimeout(function () { window.location.hash = '#intake'; }, 0); return; }
      var t = el('intake'); if (t) t.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    render();
  });

  if (window.location.hash === '#intake') window.location.hash = '#/';

  // ------------------------------------------------------------------- boot
  function start() {
    render();
    // Warm the university file straight after first paint so the Universities
    // page and school filters are ready by the time anyone reaches them.
    if (window.requestIdleCallback) window.requestIdleCallback(function () { ensureUniversities(); ensureListings(); });
    else window.setTimeout(function () { ensureUniversities(); ensureListings(); }, 1200);
  }

  if (window.INVOLVE_CATALOGUE) {           // single-file build
    hydrate(window.INVOLVE_CATALOGUE);
    universitiesLoaded = true;
    start();
  } else {                                   // split build
    window.fetch('data-core.json' + DATA_V)
      .then(function (r) { return r.json(); })
      .then(function (pack) { hydrate(pack); start(); })
      .catch(function (e) {
        console.error('[involve] could not load the register', e);
        document.getElementById('view').innerHTML =
          '<div class="wrap section"><p class="eyebrow">SORRY</p><h1>We couldn\u2019t load the scholarships</h1>' +
          '<p class="muted" style="margin-top:14px">Please refresh the page. If it keeps happening, your connection may be blocking part of the site.</p></div>';
      });
  }
})();
