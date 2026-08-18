# Monthly refresh

The site tells people on the hub that it is refreshed once a month. Two jobs
keep that true, and they are deliberately split by what each one can be
trusted to do unattended.

## 1. `monthly_refresh.py`, run by CI on the 1st

`.github/workflows/monthly-refresh.yml`, 06:00 UTC on the 1st of each month.
No secrets, no network beyond the checkout. It changes only things that follow
from dates having passed:

* deadlines roll over, so an award whose date has gone moves to `cycle_closed`
  and one with a newly published round moves back to `open`
* directory listings whose own title names a finished cycle drop out
* every count is recomputed so the tiles, the index and the hub agree
* `data-refresh.json` is restamped, and the cache-busting version in
  `index.html` is bumped so browsers actually see the new data

Run it by hand any time with `python tools/monthly_refresh.py`, or from the
Actions tab with "Run workflow".

It deliberately does **not** re-read funder pages or look for new awards.
Both need the web and judgement about wording, and an unattended job that
rewrites eligibility text unsupervised is how a database quietly fills with
plausible nonsense.

## 2. The assisted pass, on the 2nd

A scheduled Claude task picks up the part CI cannot do: re-verifying the
soonest deadlines against the funder's own page, spot-checking outbound links
for rot, and looking for new awards for Indian nationals studying in Europe.
It reports what changed and pushes through the desktop bridge, since this
container has no push credentials.

## What the hub shows

`data-refresh.json` is read by `app.js` at boot and drives the line on the
home page, the directory hub, every destination page and the footer. The
static `/d/` pages carry the same sentence, baked in at generation time by
`seo.py`, so a crawler sees the freshness signal too.
