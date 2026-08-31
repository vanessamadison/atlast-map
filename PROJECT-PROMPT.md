# ATLAST — project prompt

Paste everything below into a new chat. It is self-contained.

---

You are working on **ATLAST**, a 3D travel-coverage map. **ATLAS** + at last; the header renders
`ATLAS` in green and the trailing `T` in gold.

Repo: `~/dd/travel` on local disk. **Never inside Google Drive** — a `.git` there corrupts because
Drive rewrites files mid-write. The Drive copy at `My Drive/dd/travel` is retired; if you find
edits there, they are stale, and the local repo is the only source of truth.

**Whose it is:** Vanessa Madison, Datadog SE in Denver. The map tracks what she has verified in
person. Her goal is coverage: **63 US national parks, 58 Colorado fourteeners, 144 Colorado towns,
51 states, 195 countries, 7 continents.** Currently 6 parks, 1 fourteener, 54 towns, 16 states,
8 countries, 4 continents.

## FILES

| File | Role |
|---|---|
| `index.html` | shell, styles, card look. No logic. |
| `app.js` | scene, views, drill-down, interaction |
| `region.js` | slab + terrain geometry for any state or country — the one implementation |
| `card.js` | state and country cards |
| `travel.json` | **her data. The only file she edits.** |
| `parks.js` | all 63 parks, `name` must match exactly |
| `states.js` | state high points (sourced) + landmarks (names only) |
| `dem.js` | real elevation tiles |
| `terrain.js` | procedural elevation — the fallback, not the source |
| `geo.js` | TopoJSON decode, Albers, point-in-polygon |
| `style.js` | **the scale budget. Obey it.** |
| `store.js` | editable-field persistence |
| `serve.sh` | no-cache server + `POST /__save` |
| `verify.mjs` | pre-flight checks — run it |

## TWO OVERVIEWS, ONE DRILL-DOWN

- **USA** — fixed top-down camera, pan and zoom, rotation locked. Extruded state slabs with real
  DEM terrain on top of each, clipped per state. Alaska and Hawaii as insets.
- **Globe** — every border lit. Visited countries are **not filled**; what lights up is her
  footprint — halos at logged cities, her real routes on the sphere, a bright border. Subtle
  real relief on the sphere itself.
- **Region** — click a state or a lit country and drop into it. Slab + DEM terrain + her markers
  + the card. Colorado is just the region that also has towns and fourteeners. Back chip / Escape.

Every region gets its own Lambert azimuthal equal-area projection. Albers is correct for the
contiguous US and wrong everywhere else.

**No permanent labels.** Only the thing under the cursor is named. This was a deliberate reversal.

**Colour language:** green = visited · gold = suggested next · dim grey = not yet · white =
summited · blue = towns and rail · amber = drives · steel blue = rivers.

## HARD-WON LESSONS — do not relearn these

**1. Obey `style.js`. Scale is what has gone wrong most.** USA view: 100 units ≈ 4,500 km, so
1 unit ≈ 45 km. Colorado view: 100 units ≈ 610 km, so 1 unit ≈ 6.1 km. An early build shipped
4-unit glow discs (180 km) and 5.5-unit beacons (248 km) and looked like mushrooms on a continent.
`verify.mjs` prints every visual in kilometres. **Add anything new to that table.**

**2. The map was mirrored north-for-south and nobody caught it for six builds.** Albers here
returns y increasing *northward*. Shapes build in (X,Y) and rotate −90° about X, sending shape-Y
to world −Z. So `flat()` must **not** negate y — north then lands at −Z, furthest from a camera on
+Z, which reads as up. The old build negated. Because polygons *and* markers both used the same
wrong convention, parks stayed glued to the right states and every relative check passed. Only an
absolute check catches this. `verify.mjs` asserts Seattle top-left, Miami bottom-right, and
asserts that the old convention **fails** — a test that cannot fail is decoration.

**3. Version every local module import** — `./geo.js?v=7`. Static ES imports cache by URL and a
hard reload does not evict them; this produced a phantom "does not provide an export named
'inside'" when the export was right there. Bump every local import together. `verify.mjs` fails on
a mixed set.

**4. Keep the `BUILD` pill and bump it every change, and tell her the value.** Without it,
stale-versus-broken is undiagnosable. `verify.mjs` checks the pill matches `BUILD` in `app.js`.

**5. Albers equal-area conic for the US.** Equirectangular makes the country look stretched.

**6. Almost no additive blending.** Overlapping additive surfaces sum to white blowout. The globe
aura that used it is gone; filled countries replaced it.

**7. Colorado is not a rectangle in projected space.** Rectangular in lat/lon, but Albers
converges the meridians. Use the real polygon and clip terrain with point-in-polygon.

**8. Fog kills everything.** `FogExp2` at 0.055 with the camera 46 units out leaves 0.17% of the
colour — a fully rendered scene fogged to black. There is no fog now. If the screen goes dark,
check that first.

**9. −90° about X keeps the surface normal up. +90° flips it and `FrontSide` culling deletes the
whole terrain with no error.** `DoubleSide` is insurance and is on.

**10. Natural Earth and travel.json disagree on country names, silently.** travel.json says
"United States", the polygon says "United States of America", the visited-set lookup misses, and
the country she has covered most renders "not yet" on its card and unlit on the globe, with no
error anywhere. Every name goes through `canonCountry()` and polygon names are canonicalised at
decode. `warnUnmatchedCountries()` logs anything in `countriesVisited` with no polygon — read the
console before trusting the globe.

**11. Clip terrain with the scanline span fill, not point-in-polygon per cell.** Same even-odd
result, work drops from cells×edges to rows×edges, and that is what pays for the resolution.
`verify.mjs` diffs the two implementations cell-for-cell over a concave shape, a shape with a
hole, and disjoint blobs. If you change one, that test fails.

**12. Never claim DEM fidelity for procedural output.** `dem.js` reports how many tiles it got and
the header pill turns amber and says "procedural" when the real thing did not load.

## WHAT IS STILL OPEN

- **Itineraries as glowing routes** — `travel.json → suggestions` has 8 next parks with reasons.
  Render proposed trips as pulsing gold paths.
- **DEM for the USA view too.** It is extruded polygons today; real relief across the country
  would cost a lot of tiles but would look extraordinary.
- **Fourteener planning overlay** — see `Daily OS/06 — Record/Career/Fourteeners — The Lineup.md`.
  Sherman summited, Quandary planned. Grays + Torreys is two in a day; DeCaLiBron is four.
- Antarctica: cruises $6–15k, entry under $8k, repositioning 30–40% below. Marathon entry is $275
  — **the cruise is the cost.**

## RULES

- **Never commit or push without her say-so.** Hand her the command.
- **Never invent a visit, a distance, an elevation, a price or a road closure.** Unsure? Say so.
- `travel.json` is the source of truth. Park names must match `parks.js` exactly.
- Verify before shipping: `node verify.mjs`, then **load it and look at it**. Four builds shipped
  broken because nobody looked.
- **`node --check foo.js` does not catch ES module syntax errors.** It parses the file as an
  ambiguous CommonJS script and skips the module-level early errors. A duplicate `const` in the
  same scope passes `--check` cleanly and then throws "Identifier has already been declared" the
  moment a browser loads it — that shipped once. The working form is
  `node --check --input-type=module < foo.js`, which only reads stdin. `verify.mjs` now runs it
  over every file as its first check, so just run `verify.mjs` and never trust bare `--check`.
