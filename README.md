# ATLAST

**ATLAS** + at last. A coverage map of everywhere I have actually stood, and a planning tool for
everywhere I have not.

63 US national parks · 58 Colorado fourteeners · 144 Colorado towns · 51 states · 195 countries ·
7 continents. Three views, real geography, real elevation, and a card behind every state.

Three.js, no build step, deployed on GitHub Pages.

## Two overviews and one drill-down

**USA** — the primary view. Fixed top-down camera over all 50 states plus DC; pan and zoom, no
free orbit. Real state polygons from `us-atlas@3/states-10m`, extruded into slabs with **real
elevation terrain sitting on top of each one**, clipped to that state's border. Visited states
stand proud and tinted green; unvisited are drained but still fully rendered. Alaska and Hawaii as
insets so "all 50" is literally true.

**Globe** — every country and US state border lit. Visited countries are **not** filled in. What
lights up is the footprint she can actually evidence: a halo at each logged city, her real drive
and rail routes drawn on the sphere, and a bright border. A country she has barely touched looks
barely touched. The sphere itself carries subtle real relief from a low-zoom world DEM.

**Region** — click any state, or any lit country, and you drop into it. Countries with a
verified subdivision dataset route to their sub-regions instead of rendering whole: clicking the
US on the globe lands on the state view, not one continent-sized slab. Only the US qualifies
today — `world-atlas` is country-level at every resolution and there is no province layer in the
stack. `SUBDIVIDED` in `app.js` is where more go once a dataset is verified.

Getting back: a clickable breadcrumb in the header, Escape, or just **zoom out** past the
region's extent and it pops to the parent view. Same treatment
everywhere: extruded slab, real DEM terrain clipped to the real border, her parks, cities and
routes on top, and the card alongside. Colorado is not special-cased any more — it is just the
region that also has 144 towns and 58 fourteeners. Back chip in the header, or Escape.

Every region gets a projection built for that region (Lambert azimuthal equal-area), because
Albers is right for the contiguous US and wrong for Peru, Japan or Alaska.

## Vertical exaggeration is one number

`S.EXAG` is 14, everywhere — Colorado, Texas, the contiguous US, the globe. Relief is derived per
view from that view's kilometres-per-unit, which is the only way the views can be compared to
each other. The header pill states the factor, and `?exag=22` turns it up — the pill always shows
the number actually in use, so more drama is a choice you can see rather than a lie the map tells
you. `verify.mjs` fails the build if any view drifts off whatever the number is.

**Low relief still reads.** A linear ramp keyed to Mount Whitney renders the whole eastern US as
one flat green sheet, so terrain colour is compressed (`t^0.55`) and brightness responds to
**local slope**, which is scale-free. The Appalachians, the Driftless and the Ozarks show up as
ridges without their height being exaggerated past everything else. That is shading, not
geometry — the heights stay honest.

## Labels

There are none, except the one under the cursor. That is deliberate — 144 towns plus 58 peaks plus
63 parks is an unreadable pile, and the previous build's always-on sprite labels dominated the USA
view. Hover anything for a callout; click a state or country for the full card.

## The card

Clicking a state opens the centrepiece:

- verified or not, and when — `first visited` is an editable field, because travel.json does not
  record dates and inventing them is not an option
- national parks in that state, with the ones already visited and the ones on the suggestion list
- landmarks, so an unvisited state reads as an invitation
- the state high point with its real elevation, and for Colorado the full fourteener lineup
- cities and towns she has logged there, worked out geometrically from her own coordinates
- routes that crossed it, likewise
- **priority to visit, 0–5, which she can edit and which persists**
- an embedded Google Street View panorama, if a key is set

### Priority persistence, honestly

A static page cannot write to disk, so there are two tiers and the card always says which one it
is on:

- **`serve.sh` running** → the card POSTs to `/__save` and the edit is written into `travel.json`.
  Commit it and it is permanent.
- **GitHub Pages, or no server** → the edit is cached in that browser's localStorage, and the card
  offers a download of the merged `travel.json`.

It never claims an edit was saved when it was only cached.

### Street View

Uses the Google Maps Embed API, which needs your own key — there is no keyless embed. Paste it
into the card; it is stored in `localStorage` only and never written into the repo. Enable **Maps
Embed API** in Google Cloud and restrict the key by HTTP referrer. A wilderness anchor with no
panorama means Google has no coverage there, not that anything is broken.

## Elevation

Terrain is real: **Tilezen terrarium tiles** from the open AWS `elevation-tiles-prod` bucket,
decoded as `(R × 256 + G + B ÷ 256) − 32768` metres.

- **Zoom is chosen from a tile budget**, not fixed. Colorado lands on z8, Alaska on z5, and both
  cost about the same number of requests. `?tiles=96` raises the budget; `?tiles=16` lowers it.
- **Tiles are cached for the life of the page**, so USA → Texas → globe → Texas is free the
  second time. Failures are cached too, so a dead tile is not retried on every view.
- **Coarse first, fine second.** A low-resolution pass paints immediately so a view never stalls,
  then the full-resolution terrain swaps in underneath the markers.

`terrain.js` — the old procedural model, honest about being an approximation — stays as the
fallback. **The header pill says which one is actually on screen.** If the tiles do not load you
get procedural relief and the pill turns amber and says so. Outside the US there is no procedural
model, so a country with no tiles renders flat rather than inventing mountains.

## On a phone

Same map, different furniture. Below 820px the card becomes a bottom sheet, the mode switch
moves to the bottom where a thumb actually is, and everything respects the notch. One finger
pans the map and spins the globe; two fingers zoom and tilt. There is no hover on a phone, so
tapping something with no card behind it shows its label for a couple of seconds instead.

Terrain resolution, elevation tile count and globe sphere density all drop together on a small
screen — a 480k-cell mesh and 64 elevation tiles would drop a phone to single-figure frames and
eat someone's data plan doing it. `?tiles=48` overrides that if you are on wifi and impatient.

## Publishing

```bash
gh repo edit vanessamadison/map --visibility public --accept-visibility-change-consequences
gh repo rename atlast --repo vanessamadison/map
git remote set-url origin git@github.com:vanessamadison/atlast.git
gh api -X POST repos/vanessamadison/atlast/pages -f "source[branch]=master" -f "source[path]=/"
```

Live at `https://vanessamadison.github.io/atlast/` a minute or so later. Every path in the app is
relative, so the subdirectory is fine. `.nojekyll` keeps Pages from running Jekyll over it.

## Updating the data

**Edit `travel.json`. Nothing else.** Park names must match the `name` field in `parks.js`
exactly — "Smoky Mountains" will not match "Great Smoky Mtns". State codes are two-letter USPS.

```json
"parksVisited": ["Rocky Mountain", "Mesa Verde", "Yellowstone", "Great Sand Dunes", "Arches", "Canyonlands"]
```

## Running it

```bash
cd ~/dd/travel
node verify.mjs     # module syntax, imports, cache-busters, mirror test, clip, scale budget
./serve.sh          # http://localhost:8080 — no-cache, and travel.json is writable
```

Note: **`node --check foo.js` does not catch ES module syntax errors** — it parses the file as an
ambiguous CommonJS script and skips the module-level early errors, so a duplicate `const` passes
cleanly and then throws in the browser. `verify.mjs` runs the form that works
(`--check --input-type=module`) over every file. Use it instead.

`verify.mjs` does not replace looking at it. Nothing does.

## Files

| File | Role |
|---|---|
| `index.html` | shell, styles, the card's look |
| `app.js` | scene, views, drill-down, interaction |
| `region.js` | slab + terrain geometry for any state or country |
| `card.js` | the state and country cards |
| `travel.json` | **her data. The only file she edits.** |
| `parks.js` | all 63 parks — name, state, lat/lon |
| `states.js` | per-state high points (sourced) and landmarks (names only) |
| `dem.js` | real elevation tiles |
| `terrain.js` | procedural elevation, the fallback |
| `geo.js` | TopoJSON decode, Albers, point-in-polygon |
| `style.js` | **the scale budget, in kilometres. Obey it.** |
| `store.js` | editable-field persistence |
| `serve.sh` | local server: no-cache headers, and `POST /__save` |
| `verify.mjs` | pre-flight checks |

## Why this lives outside the Daily OS artifact

Cowork artifacts can only load Chart.js, Grid.js and Mermaid from a CDN and run under
`connect-src 'none'` — no outbound requests at all. That rules out Three.js, TopoJSON and DEM
tiles. On GitHub Pages all three are trivial. Same reason the 4P Explorer lives in Apps Script.

## Data sources, all fetched at runtime

- State outlines — `us-atlas@3/states-10m` via unpkg
- Country outlines — `world-atlas@2/countries-110m` via unpkg
- Elevation — Tilezen terrarium tiles, AWS `elevation-tiles-prod`, SRTM/NED derived
- State high points — transcribed from Wikipedia's *List of U.S. states and territories by
  elevation*. Numbers here are transcription, not estimation.
