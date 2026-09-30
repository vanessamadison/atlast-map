# Where ATLAST stands

Researched 24 Aug 2026 across three parallel passes: travel-coverage apps, outdoor route apps,
and the academic and product literature on how coverage gamification actually works. Every claim
below traces to a source the research actually read.

---

## The short version

ATLAST is already sitting on **four of the five gaps the market has not filled**, and is missing
**three things the market considers table stakes**. That is a good position — the gaps are
architectural and hard to copy, the missing pieces are known engineering.

---

## The gaps nobody has filled — and we already occupy

**1. Route logging and a completion model, together.**
> "The trackers have routes but no list completion, and the collectors have completion but no GPS."

Polarsteps and FindPenguins log routes beautifully and have no concept of finishing anything.
NomadMania and Visited have the richest completion models in the market and no route data at all.
ATLAST has both: 63 parks / 58 fourteeners / 144 towns / 51 states / 195 countries as coverage,
plus 55 real routes with waypoints. **Nobody else does both.**

**2. 3D terrain over a lifetime of travel.**
> "No one gives you your whole life's travel on a 3D globe."

FATMAP — the best 3D terrain product ever built — was switched off on 1 Oct 2024. Strava rebuilt
3D rendering in March 2025 but never restored waypoints, personal guidebooks or area offline
downloads. Polarsteps put 3D behind Plus in 2025 and got punished for it in reviews. ATLAST is
real DEM terrain at a stated 14× exaggeration across every view, free, with no account.

**3. One record spanning every granularity.**
> "Nothing unifies countries, states, cities, parks, trails and specific viewpoints under one
> verified visit record."

This is `travel.json`. Country → state → county → town → park → route → waypoint, one schema.

**4. History you own and can carry away.**
> "No one offers open export/import, local-first storage and a guarantee your decade of travel
> survives a migration or a shutdown."

This is the sharpest wedge, because the market's worst injuries are here. Google's Dec 2024
Timeline migration wiped years of user history. Chimani users lose check-ins. Been loses sync.
Gaia doubled its price to ~$59.90/yr and locks paid maps behind a login you cannot complete with
no signal. ATLAST is a JSON file on her own disk with export and import. That is a feature, not
a limitation, and it should be said out loud in the product.

**5. Permit *availability* — still open, for everyone.**
> "No product integrates Recreation.gov quotas, lottery dates or live reservation inventory, so
> at best you learn a permit exists, never whether you can get one."

HiiKER is the only product with a structured permit dataset at all (PAD-US 4.1 enriched with
NPS / Recreation.gov / USFS / BLM). ATLAST already has `permitTier` ranked 0–6 from none to
tribal booking, which is more useful than anything else in the category *except* HiiKER. The
open prize is pulling live Recreation.gov availability — nobody has done it.

---

## What we are missing that the market treats as table stakes

**1. Passive capture.** Universal in travel trackers: battery-sane GPS logging that keeps working
offline. ATLAST is 100% manual. Google Timeline's effortless recording is the bar, and it is why
people tolerate its bugs.

**2. Offline.** All 16 outdoor products ship offline maps, and the ones that ship it *badly* get
destroyed in reviews for it. ATLAST needs a network connection for elevation tiles and geometry.
A service worker caching tiles and datasets closes this.

**3. Photos.** Every travel tracker is photo-led. ATLAST has none.

**4. Retroactive backfill by search.** Entering decades of past travel without GPS is a named
must-have. Right now she edits JSON by hand.

Two more worth noting: there is no mobile app (a PWA covers this), and no cloud sync — though
local-first is a deliberate trade, not an oversight.

---

## What the gamification research actually says

The useful findings are mostly counter-intuitive, and several contradict how a coverage app
would naively be built.

**Endow progress rather than starting at zero.** A car-wash field experiment: a 10-space card
with 2 stamps pre-filled produced **34% completion versus 19%** for an 8-space empty card — for
identical real effort. A new ATLAST profile should never show a row of zeroes.

**Decouple the daily minimum from the ambitious goal.** Duolingo found users with *intense* daily
goals were the **least** likely to hold a streak. Letting one lesson extend it produced +3.3%
D14 retention and took 7-day streak holders from a third to over half of daily learners. The
lesson for a 63-park goal: the small unit of progress must be genuinely small.

**Log failures, not just completions.** Peakbagger records three ascent types — summits,
**turn-back points on failed attempts**, and non-summit destinations — with checkbox bulk entry
so a decade of backlog can go in without dates. ATLAST has `summited` and `planned` on the
fourteeners and no way to say "went, got weathered off Quandary at 13,400". That is a real hole,
and it is the single easiest high-value addition.

**Ship intermediate finish lines.** The Highpointers Club recognises **25** state highpoints, and
separates "48 Finishers" from "50 Completers" — two legitimate finish lines for a goal only a few
hundred people ever complete. 63 parks needs milestones at 10, 25, 40.

**Depth beats breadth, and say so numerically.** NomadMania computes **DEEP** = regions visited ÷
countries visited, rewarding depth over passport-stamping, and **YES** = years since last visit,
penalising a stale 195-country claim. For someone with 8 countries and 16 states, DEEP is a far
more interesting number than the raw count.

**Participation, not performance.** Strava's Local Legend goes to whoever does a segment *most
often* in a rolling 90 days, "regardless of pace or speed" — winnable by showing up, re-contested
quarterly. Contrast KOM, which one fast person owns forever and which forces permanent
anti-cheating policing.

**Size the unit by effort-parity, not by political boundary.** NomadMania splits the world into
1,381 regions weighted geography 35% / culture 35% / history 20% / popularity 10%, so Russia and
Vatican City are not one tick each. Mid-hundreds is the sweet spot for a lifetime list: 214
Wainwrights and the Munros have thousands of registered finishers, while the 50 US state
highpoints add roughly ten completers a year.

**Codify what counts as visited, or the unit dissolves into argument.** NomadMania polled ~1,000
travellers to write minimal-visit rules: airport transits rejected by 85–95%, staying in the port
area rejected by 57%, consciousness required.

**Support definitional forks rather than picking a side.** Colorado has **53 ranked** fourteeners
under a 300-ft prominence rule and **58** on the traditional Colorado Mountain Club list. Both
coexist with their own finisher cultures. `travel.json` already carries a `ranked` flag — the UI
should show both counts.

### What to avoid

- **Pure counts get optimised, not pursued.** Goodreads publishes "Very Short Books to Finish
  Your Reading Challenge Strong" — the distortion admitting itself.
- **Badges that reward volume of the behaviour.** A 2020→2025 longitudinal ethics analysis of
  Untappd found badges incentivising high-frequency drinking, largely unfixed.
- **Speed leaderboards.** Strava now needs ML plus community flagging to strip digital doping,
  and catches legitimate users in the net.
- **Novelty alone.** Pokémon GO produced ~955 extra daily steps in week one, fully decayed to
  baseline **by week six**, with no moderation by age, sex, weight or walkability.
- **Rigid streaks.** Duolingo's Streak Freeze raised relative DAU; forgiveness beats rigidity.

The durable pattern across everything that worked: **the reward is framed as self-referential
discovery, not ranking.** Wandrer's entire premise is "the outdoor game where you win by going
places you've never been."

---

## What this changes about the build

| Priority | Change | Why |
|---|---|---|
| 1 | `attempted` / turn-back logging alongside summited and planned | Peakbagger's three-state model; easiest high-value gap |
| 2 | Milestone tiers on every goal, not just a total | Highpointers 25 / 48 / 50 |
| 3 | DEEP and recency scores next to raw counts | NomadMania; makes 8 countries interesting |
| 4 | Counties as the coverage unit, effort-weighted where possible | 3,143 units, mid-hundreds per state is the sweet spot |
| 5 | Show both 53 ranked and 58 traditional fourteeners | Definitional forks are real communities |
| 6 | A written "what counts as visited" rule she can edit | Or the unit dissolves into argument |
| 7 | Service-worker offline for tiles and datasets | Table stakes in the outdoor category |
| 8 | Photos per place, local-first | Table stakes in travel trackers |
| 9 | Search-to-add backfill instead of hand-editing JSON | Named must-have |
| 10 | Recreation.gov availability, if the API allows | The one gap nobody has filled |

**Explicitly not building:** speed leaderboards, badge ladders keyed to volume, or rigid streaks.
The research is clear that all three either decay or actively distort behaviour.

---

## Sources

Travel tracking: [Polarsteps Plus](https://www.polarsteps.com/plus) ·
[FindPenguins](https://findpenguins.com/why-choose-findpenguins) ·
[NomadMania rankings](https://nomadmania.com/rankings/) ·
[NomadMania minimal visit](https://nomadmania.com/minimal-visit/) ·
[Visited](https://visitedapp.com/premium-features/) ·
[Google Timeline data loss](https://9to5google.com/2025/03/07/google-maps-timeline-missing/) ·
[NPS app](https://www.nps.gov/subjects/digital/nps-apps.htm) · [Chimani](https://chimani.com/)

Outdoor: [AllTrails premium](https://support.alltrails.com/hc/en-us/articles/37200882853140-The-benefits-of-AllTrails-premium-membership) ·
[Gaia price backlash](https://help.gaiagps.com/hc/en-us/community/posts/26053121241239-Exorbitant-Subscription-Increase) ·
[onX pricing](https://www.onxmaps.com/backcountry/app/pricing) ·
[Komoot paywalls](https://www.dcrainmaker.com/2025/03/komoots-expanded-paywalls-trying-to-make-sense-of-it.html) ·
[FATMAP shutdown](https://www.powder.com/gear/strava-is-turning-off-fatmap-what-that-means-for-skiers-) ·
[HiiKER](https://hiiker.app/pricing) · [14ers.com app FAQ](https://www.14ers.com/mobileapp-faq) ·
[Peakbagger ascent types](https://www.peakbagger.com/help/helpascentedit.aspx)

Gamification: [Duolingo streak](https://blog.duolingo.com/improving-the-streak/) ·
[Strava Local Legend](https://support.strava.com/en-us/articles/15401751-what-is-the-local-legend-achievement-on-strava) ·
[endowed progress](https://loyaltyrewardco.com/loyalty-psychology-series-endowed-progress-effect/) ·
[Highpointers](https://highpointers.org/highpointing/) ·
[Pokémon GO step decay](https://pubmed.ncbi.nlm.nih.gov/27965211/) ·
[Untappd ethics](https://arxiv.org/abs/2601.04841) · [Wandrer](https://wandrer.earth/) ·
[Geocaching favourite points](https://www.geocaching.com/blog/2019/04/everything-you-always-wanted-to-know-about-favorite-points/)
