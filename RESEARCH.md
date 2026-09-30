# How ATLAST gets its places

Four layers, four different standards of proof. Keeping them separate is the whole point — a
coordinate from a survey and a recommendation from a Reddit thread are both useful and must
never be mistaken for each other.

| Layer | Source | What it is trusted for |
|---|---|---|
| **OSM** | Overpass API, live, keyless | coordinates, elevations, `sac_scale`, climbing grades — surveyed facts |
| **NPS** | developer.nps.gov, free key | official park activities and places |
| **Research** | `discovered.js` — read out of public writing | *whether a place is worth your Saturday* |
| **Curated** | `gems.js` — editorial, hand-held | the shortlist, with anchors into the above |
| **Yours** | `travel.json` | what you actually stood on |

## Why research rather than scraping

AllTrails, Gaia and Trailforks have no open API and their terms forbid harvesting their
databases. Reddit's API is paid and rate-limited. None of that stops us *reading* public
writing and producing our own editorial entry with a link back — that is what a guidebook is,
and it is the only way to capture the thing no dataset holds: local opinion.

## The rule that keeps it safe

**No numbers from prose. Ever.** No mileage, no elevation gain, no elevation, no prices, no
closure dates. Those are the figures that get someone hurt when they are wrong, and a blog post
is not a survey. Numbers come from OSM, from the NPS, or from `travel.json`.

What research *is* allowed to record: what a thing is, roughly how hard it is in YDS class where
that figure is widely published, how exposed it is, whether a permit exists, and why anyone
should care. Anything read between the lines goes in `inferred` so the UI can show it as softer
than a stated fact.

## Running a pass

Spawn one agent per region — parallel, since they do not need each other. Keep regions small
enough that an agent can be thorough: a state or two, or one country.

```
Research outdoor destinations in <REGION> that enthusiasts repeatedly praise.
Use WebSearch and WebFetch across hiking blogs, Reddit threads, Summitpost, Mountain Project,
NPS / USFS / BLM / state pages, and local outdoor publications.

Cover both the famous must-dos and the hidden gems: summits, ridge scrambles, waterfalls,
alpine lakes, hot springs, fishing water, paddling, dark-sky spots, towns worth basing from,
and food stops people drive out of their way for.

CRITICAL RULES — these exist because fabricated trail data gets people hurt:
- NEVER state a mileage, elevation gain, elevation, price, or road-closure date. Omit entirely.
- Every entry MUST have at least one real URL you actually saw in search results or fetched.
- Only include something praised across MULTIPLE independent sources, or by an authoritative one.
- Put permits, lotteries, quotas and seasonal access in the structured fields AND the prose.
- YDS class only if widely published. Otherwise null.

Return ONLY a JSON array, no prose, max 24 entries, each shaped exactly:
{"name":"","kind":"trail|ridge|peak|route|loop|waterfall|hot_spring|lake|fishing|town|food|viewpoint|geology|camp",
 "region":"<USPS code or ISO country>","park":"exact park name or null",
 "interests":["summit,scramble,climb,trail,water,fish,view,paddle,snow,bike,camp,geology,dark,food,town,history"],
 "cls":null,"grade":null,"exposure":null,
 "permit":false,"permitKind":null,"season":null,
 "why":"one or two sentences, editorial, no numbers",
 "links":[{"label":"","url":""}],"hidden":true,"inferred":[]}
```

`exposure` is 0 sheltered · 1 mild · 2 serious · 3 lethal — and it is deliberately separate from
class, because Capitol's Knife Edge is class 4 with lethal exposure while plenty of class 4 is
merely awkward.

`inferred` lists which of `cls`, `exposure`, `permit` or `season` were read between the lines
rather than stated outright.

## Merging

Append a new `BATCHES` entry in `discovered.js` with a date and the regions covered, then append
the entries with that `batch` id. Never rewrite an existing batch — if a pass was wrong, add a
better one and let the dates tell the story.

`node verify.mjs` checks the shape: every entry needs a name, a region, at least one link with a
real URL, and interests drawn only from the fixed vocabulary. Entries carrying a mileage or
elevation field fail the build outright.

## Coverage so far

- **2026-08-24-west** — CO, UT, AZ, NM, WA, OR, ID, MT, WY, CA, NV. 95 entries.
- Still to do: the East, the South, the Midwest, Alaska, Hawaii, then per-country passes
  starting with the eight she has already been to.
