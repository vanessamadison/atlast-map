// ATLAST — one scale budget, obeyed everywhere.
//
// SCALE, IN KILOMETRES. Compute this for anything new before shipping it.
//   USA view : MAP 100 units spans the CONUS bbox, ~4,500 km  →  1 unit ≈ 45 km
//   CO  view : MAP 100 units spans Colorado's long axis, ~610 km  →  1 unit ≈ 6.1 km
// A previous build shipped 4-unit glow discs (180 km) and 5.5-unit beacons (248 km) and read
// as mushrooms on a continent. Every number below has its kilometre cost written next to it.
export const S = {
  MAP: 100,

  // ── slabs ──────────────────────────────────────────────────────────────
  SLAB_US: 0.55,       // 25 km thick plinth for an unvisited state
  SLAB_US_ON: 0.95,    // 43 km — visited states stand proud of the rest
  SLAB_CO: 2.20,       // 13 km thick plinth under the Colorado terrain
  INSET_SLAB: 0.45,    // 20 km — Alaska / Hawaii insets

  // ── relief ─────────────────────────────────────────────────────────────
  RELIEF_CO: 6.00,     // 37 km of vertical for 11,000 ft of real range → ~11x exaggerated
  RELIEF_US: 2.00,     // reserved; the USA view is extruded polygons, not a heightfield

  // ── markers ────────────────────────────────────────────────────────────
  DOT: 0.20,           // 9 km radius on the USA view, 1.2 km on Colorado
  DOT_ON: 0.30,        // 13.5 km / 1.8 km
  STEM: 0.85,          // 38 km / 5.2 km
  STEM_ON: 1.30,
  RING: 0.42,
  TOWN: 0.17,
  TOWN_OFF: 0.10,
  PEAK: 1.90,          // 14er shaft base, plus elevation scaling — 12 km on the CO view

  // ── lines ──────────────────────────────────────────────────────────────
  RIVER: 0.10,         // 4.5 km wide at national scale
  ROAD: 0.13,          // 5.9 km
  GLOBE_R: 34,         // globe radius in units
};

// Colour language. green = been · gold = next · dim = not yet · white = summited
// blue = towns and rail · amber = drives · steel = rivers
export const C = {
  bg: 0x070907,
  landOff: 0x1e2620, landOn: 0x3d5a3c, landHover: 0x50704a,
  slabSide: 0x121814, slabSideOn: 0x1d2a1c,
  edgeOff: 0x46524a, edgeOn: 0x9dc07c,
  park: 0xa8cc70, next: 0xe3c765, town: 0x86a8c4, miss: 0x6b7568,
  summit: 0xf2f6ee, river: 0x4f93b5, road: 0xd9963f, rail: 0x86a8c4,
  // globe
  globeSea: 0x0a1620,
  borderOff: 0x69796b,     // every border is lit now, not just the visited ones
  borderState: 0x4a5750,
  borderOn: 0xcaeb96,
  fillLow: 0x2c4a2e, fillHigh: 0x8fc766,
};

// Terrain palette, sampled by normalised elevation. Kept out of the view code so the
// Colorado ramp can be retuned without touching geometry.
export function ramp(t) {
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const stops = [
    [0.00, 0.16, 0.22, 0.14],
    [0.18, 0.24, 0.34, 0.19],
    [0.36, 0.38, 0.42, 0.26],
    [0.54, 0.52, 0.48, 0.35],
    [0.70, 0.60, 0.55, 0.47],
    [0.84, 0.74, 0.73, 0.68],
    [1.00, 0.96, 0.98, 1.00],
  ];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const a = stops[i - 1], b = stops[i];
      const u = (t - a[0]) / (b[0] - a[0]);
      return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u];
    }
  }
  return [0.96, 0.98, 1.0];
}
