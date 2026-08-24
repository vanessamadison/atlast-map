# ATLAST

**ATLAS** + at last. A coverage map of everywhere I have actually stood, and a planning tool for
everywhere I have not.

63 US national parks · 58 Colorado fourteeners · 144 Colorado towns · 51 states · 195 countries ·
7 continents. Three views, real geography, real elevation, and a card behind every state.

Three.js, no build step, deployed on GitHub Pages.

## The three views

**USA** — the primary view. Fixed top-down camera over all 50 states plus DC; pan and zoom, no
free orbit. Real state polygons from `us-atlas@3/states-10m`, extruded into slabs — visited states
stand proud and tinted. Alaska and Hawaii as insets so "all 50" is literally true. **Click any
state to open its card.** Unvisited states are the point, not the leftovers: every card carries
that state's parks, landmarks, high point and an editable priority.

**Colorado** — the real state polygon extruded into the same slab, with **real elevation** stacked
on top of it and clipped to the true border by point-in-polygon. 58 fourteeners as
elevation-scaled shafts, 144 towns, rivers, and her drive routes.

**Globe** — every country and state border lit. Visited countries **filled**, not outlined, with
fill brightness tracking how many places she has logged inside that border. Click a country for
its card.

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

Colorado's terrain is real: **Tilezen terrarium tiles** from the open AWS `elevation-tiles-prod`
bucket, decoded as `(R × 256 + G + B ÷ 256) − 32768` metres. Default zoom 7, roughly 1 km per
pixel; `?dem=8` doubles it at the cost of about four times the tiles.

`terrain.js` — the old procedural model, honest about being an approximation — stays as the
fallback. **The header pill says which one is actually on screen.** If the tiles do not load you
get procedural relief and the pill turns amber and says so.

## Updating the data

**Edit `travel.json`. Nothing else.** Park names must match the `name` field in `parks.js`
exactly — "Smoky Mountains" will not match "Great Smoky Mtns". State codes are two-letter USPS.

```json
"parksVisited": ["Rocky Mountain", "Mesa Verde", "Yellowstone", "Great Sand Dunes", "Arches", "Canyonlands"]
```

## Running it

```bash
cd ~/dd/travel
node verify.mjs     # imports, cache-busters, mirror test, scale budget in km
./serve.sh          # http://localhost:8080 — no-cache, and travel.json is writable
```

`verify.mjs` does not replace looking at it. Nothing does.

## Files

| File | Role |
|---|---|
| `index.html` | shell, styles, the card's look |
| `app.js` | scene, the three views, interaction |
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
