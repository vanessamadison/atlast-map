# The map — redesign brief

**Paste this whole file as the first message in a new chat.** The working code is in `~/dd/travel`.

---

You are rebuilding Vanessa Madison's travel-coverage map. It currently works but feels like a
data viz. **She wants a game.** Her words: *"think call of duty x maps — each state/territory
should bring up a card with all this information related to how my character has interacted with
it. Really gamify and make it a beautiful tool to track my coverage."*

She is a Datadog SE in Denver. The map tracks what she has **verified in person**. Her stated life
goal is coverage: **63 US national parks · 58 Colorado fourteeners · 144 Colorado towns · 51
states · 195 countries · 7 continents.** Currently 6 parks, 54 towns, 1 fourteener, 16 states,
8 countries, 4 continents.

## FIRST: RENAME IT

`groundtruth` was my suggestion and she wants better. It should feel like a game map, not a
GIS term. Offer 3–5 and let her choose. Consider **BASECAMP** (where expeditions launch from,
fits parks and 14ers, gamey without being cute) or **ATLAS**. Rename repo, title, header pill.

## WHAT IS WRONG NOW

1. **Labels are far too large and always on.** They dominate the US view.
   **Fix: labels ONLY on hover.** Nothing permanent except a hovered item.
2. **Colorado has terrain but no base.** It floats. It needs **the same extruded 3D slab the USA
   view uses, with terrain stacked on top of it.**
3. **Colorado's relief is procedural** and therefore approximate. **Replace with real elevation
   data.** Fetch works here (GitHub Pages / localhost), unlike the Cowork artifact — so a real
   DEM or terrain-RGB raster source is viable. This is the single biggest fidelity win.
4. **The globe is too dim.** Every border should be lit, and **visited countries filled**, not
   just outlined — a coverage heat map rather than a wireframe.

## WHAT TO BUILD

### USA — the primary view
- **Fixed top-down camera looking at all 50 states. Pannable, zoomable, not free-orbit.**
- **Click a state → a card opens.** This is the centrepiece. It must show:
  - Visited or not, and when
  - **Key landmarks and national parks in that state** — for unvisited states too, so it reads as
    an invitation rather than a blank
  - Her fourteeners / peaks where relevant, with **elevations**
  - **A priority-to-visit field SHE CAN EDIT** and that persists to `travel.json`
  - Anything from her routes that crossed it
- Non-visited states must still be interesting. That is what makes it a planning tool.

### Colorado — the detail view
- Same extruded slab as USA, **real terrain stacked on it**
- **Named peaks with real elevations.** All 58 fourteeners are already in `travel.json` with
  `ft`, `cls`, `mi`, `gain`. Mt. Sherman is summited, Quandary planned.
- Towns, rivers, her drive routes

### Globe
- **All country and state borders lit.** Visited countries **filled**, not outlined.
- Heat-map feel: intensity by how much she has covered.

### Ambitious, only if it does not break the rest
- **A first-person / street-level mode**, possibly via Google Maps API, to walk a place she has
  been. She flagged this as a "would be cool", not a requirement. **Do not let it destabilise the
  core three views.**

## THE DATA — already correct, do not re-derive

`travel.json` is the only file she edits. It holds `parksVisited`, `statesVisited`,
`countriesVisited`, `cities`, `coTowns` (144, with `been`), `fourteeners` (58, with elevation,
class, mileage, gain, `summited`, `planned`), `routes` (5 real drives plus the Coast Starlight),
and `suggestions` (8 next parks with reasons). `parks.js` has all 63 parks. **Park names must
match `parks.js` exactly.**

## HARD-WON LESSONS — do not relearn these

**1. Obey `style.js`. Scale is what has gone wrong most.** The map is 100 units ≈ 4,500 km, so
**1 unit ≈ 45 km.** An earlier build shipped 4-unit glow discs (**180 km wide**) and 5.5-unit
markers (**248 km tall**) and looked like mushrooms on a continent. **Compute what any new visual
is in kilometres before shipping it.**

**2. Version every local module import** — `./geo.js?v=7`. Static ES imports cache **by URL** and
a hard reload does not evict them. This produced a phantom "does not provide an export named
'inside'" when the export existed. Bump on every change. `serve.sh` also sends no-cache headers.

**3. Keep the `BUILD` pill in the header.** Bump it every change and tell her the value, or
stale-versus-broken is undiagnosable.

**4. Shapes build in (X,Y) then rotate −90° about X, sending shape-Y to world −Z.** Polygons use
`flat()`, markers use `world()` which negates. Mixing them **mirrors every marker against the
map** — that bug split the country from its parks.

**5. Albers equal-area conic for the US.** Verified correct for Seattle, Boston, Miami, Denver.

**6. Almost no additive blending.** Overlapping additive surfaces sum to white blowout.

**7. Fog kills everything.** `FogExp2` at 0.055 with the camera 46 units out leaves **0.17%** of
the colour — a fully rendered scene fogged to black. If the screen goes dark, check fog first.

**8. Colorado is NOT a rectangle in projected space.** Rectangular in lat/lon, but Albers
converges the meridians. Use the real polygon and clip terrain to it with point-in-polygon.

**9. Rotation −90° about X keeps the surface normal UP.** `+90` flips it and `FrontSide` culling
deletes the whole terrain. `DoubleSide` is insurance.

## VERIFY BEFORE SHIPPING

- `node --check` the extracted module
- Confirm every named import exists in its module — a missing export looks like a broken app
- Load it and look at it. Four separate builds shipped broken because nobody looked.

## RULES

- **Never commit or push without her say-so.** Hand her the command.
- **Never invent a distance, elevation, price or road closure.** Unsure? Say so.
- Repo lives at `~/dd/travel` on local disk. **Never inside Google Drive** — a `.git` there
  corrupts because Drive rewrites files mid-operation.
