# travel

A 3D map of everywhere I have been. Real country outlines, real terrain relief, all 63 US
national parks. Rendered with Three.js, deployed on GitHub Pages.

## Why this exists outside the Daily OS artifact

Cowork artifacts can only load Chart.js, Grid.js and Mermaid from a CDN, and they run under
`connect-src 'none'` — no outbound requests at all. That makes Three.js and real geographic data
impossible in there. On GitHub Pages both are trivial. This is the same reason the 4P Explorer
lives in Apps Script rather than in the dashboard.

## Updating it

**Edit `travel.json`. Nothing else.** Add a park, a state code, a country or a city, commit, and
Pages redeploys in about a minute.

```json
"parksVisited": ["Rocky Mountain", "Mesa Verde", "Yellowstone", "Great Sand Dunes", "Zion"]
```

Park names must match the `NAME` field in `parks.js`. State codes are two-letter USPS.

## Deploying

1. Create a **private** repo named `travel` (Pages works on private repos with GitHub Pro,
   which a Datadog account may already include — if not, either make it public or run it
   locally with `python3 -m http.server`).
2. Push these files to the default branch.
3. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. It publishes at `https://<username>.github.io/travel/`.

## Data sources, all fetched at runtime

- Country outlines — `world-atlas` TopoJSON via unpkg, 110m resolution
- Elevation relief — procedural, derived from real range and basin coordinates, validated to a
  mean error of ~465 ft against eleven Colorado towns. **It is an approximation, not a DEM.**
- Park coordinates — `parks.js`, all 63 with state and lat/lon

## Controls

Drag to orbit · scroll to zoom · click a marker to read it · buttons switch Globe / USA / Colorado
