#!/usr/bin/env python3
"""Monthly data refresh. Runs in CI on the first of the month.

WHAT THIS DOES, and just as importantly what it does not.

It does the part that can be done from the repo alone, with no network and no
secrets:

  * rolls every deadline forward. An award whose published date has passed
    moves from open to cycle_closed, and one whose next round has been
    published moves back to open. This is the change that actually matters
    month to month: without it the site tells people an award is open when it
    shut three weeks ago.
  * drops directory listings whose own title names a finished cycle and whose
    deadline has passed. A "2025 Excellence Scholarship" that closed is not
    coming back under that name.
  * recomputes every count so the stat tiles, the index and the hub agree.
  * stamps the refresh date into data-refresh.json, which the app reads and
    shows on the hub, and bumps the cache-busting version so browsers pick
    the new data up instead of serving yesterday's from cache.

It does NOT re-read funder pages, and it does not discover new awards. Both
need the web and a Firecrawl key, so they belong to the separate assisted pass
rather than to an unattended job. Nothing here invents a date: an award with
no published deadline is left exactly as it is.

Exit code is always 0. A month with nothing to change is a normal month.
"""
import json, os, re, glob, sys
from datetime import date, datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = date.today().isoformat()
TITLE_YEAR = re.compile(r'\b(20[0-3]\d)\b')


def load(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def save(p, obj):
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))


def dead_cycle(name, deadline):
    """Same rule the build uses. Reads the TITLE only.

    An earlier version read summaries too and killed 1,109 valid awards on
    phrases like "established in 2003". The title is the only place a funder
    names the cycle.
    """
    years = [int(y) for y in TITLE_YEAR.findall(name or '')]
    if not years:
        return False
    newest = max(years)
    if newest <= int(TODAY[:4]) - 1:
        return True
    return bool(deadline and deadline < TODAY and newest <= int(TODAY[:4]))


def refresh_register():
    p = os.path.join(ROOT, 'data-core.json')
    core = load(p)
    opened = closed = 0
    for s in core.get('scholarships', []):
        d = s.get('deadline_date')
        if not d or s.get('status') == 'discontinued':
            continue
        want = 'open' if d >= TODAY else 'cycle_closed'
        if s.get('status') != want:
            s['status'] = want
            if want == 'open':
                opened += 1
            else:
                closed += 1
    core['counts']['scholarships'] = len(core.get('scholarships', []))
    core['generated_at'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    save(p, core)
    return len(core['scholarships']), opened, closed


def refresh_listings():
    files = sorted(f for f in glob.glob(os.path.join(ROOT, 'data-listings-*.json'))
                   if 'index' not in f)
    dropped = total = 0
    per_country = {}
    for f in files:
        pack = load(f)
        keep = [l for l in pack['listings']
                if not dead_cycle(l.get('name'), l.get('deadline_date'))]
        dropped += len(pack['listings']) - len(keep)
        pack['listings'] = keep
        save(f, pack)
        total += len(keep)
        cc = os.path.basename(f).split('-')[2]
        per_country[cc] = per_country.get(cc, 0) + len(keep)

    # the index carries the counts the hub and the loader both trust
    ip = os.path.join(ROOT, 'data-listings-index.json')
    idx = load(ip)
    import gzip
    for shard in idx['shards']:
        n = 0
        for part in shard['parts']:
            pp = os.path.join(ROOT, part['file'])
            if not os.path.exists(pp):
                part['count'] = 0
                continue
            part['count'] = len(load(pp)['listings'])
            with open(pp, 'rb') as fh:
                part['gzip'] = len(gzip.compress(fh.read()))
            n += part['count']
        shard['count'] = n
        shard['gzip'] = sum(p.get('gzip', 0) for p in shard['parts'])
    idx['shards'] = [s for s in idx['shards'] if s['count'] > 0]
    idx['shards'].sort(key=lambda s: -s['count'])
    idx['total'] = sum(s['count'] for s in idx['shards'])
    idx['countries'] = len(idx['shards'])
    idx['generated_at'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    save(ip, idx)
    return idx['total'], idx['countries'], dropped


def write_stamp(register, listings, countries, opened, closed, dropped):
    """What the hub shows. Kept as its own tiny file so the app can read the
    refresh date without parsing a 2 MB payload first."""
    p = os.path.join(ROOT, 'data-refresh.json')
    prev = load(p) if os.path.exists(p) else {}
    stamp = {
        'refreshed_at': TODAY,
        'cadence': 'monthly',
        'register': register,
        'listings': listings,
        'countries': countries,
        'last_change': {
            'reopened': opened,
            'closed': closed,
            'retired': dropped,
        },
        'history': ([{'date': prev['refreshed_at'],
                      'register': prev.get('register'),
                      'listings': prev.get('listings')}]
                    + prev.get('history', []))[:12] if prev.get('refreshed_at') else [],
    }
    save(p, stamp)
    return stamp


def bump_cache_version(register, listings):
    """Browsers cache the data files hard. Without a new query string a
    refreshed deadline would not reach anyone for weeks."""
    p = os.path.join(ROOT, 'index.html')
    with open(p, encoding='utf-8') as f:
        html = f.read()
    new = f'{register}-318-{listings}-{TODAY.replace("-", "")}'
    out = re.sub(r'window\.INVOLVE_DATA_V="[^"]*"',
                 f'window.INVOLVE_DATA_V="{new}"', html)
    if out != html:
        with open(p, 'w', encoding='utf-8') as f:
            f.write(out)
    return new


def main():
    register, opened, closed = refresh_register()
    listings, countries, dropped = refresh_listings()
    stamp = write_stamp(register, listings, countries, opened, closed, dropped)
    version = bump_cache_version(register, listings)

    print(f'refresh date        : {TODAY}')
    print(f'verified register   : {register:,}')
    print(f'directory listings  : {listings:,} across {countries} destinations')
    print(f'moved to open       : {opened}')
    print(f'moved to closed     : {closed}')
    print(f'retired dead cycles : {dropped}')
    print(f'cache version       : {version}')
    if not (opened or closed or dropped):
        print('nothing changed this month beyond the refresh stamp')
    return 0


if __name__ == '__main__':
    sys.exit(main())
