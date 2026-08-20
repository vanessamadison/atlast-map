// Procedural elevation. Real range and basin coordinates; validated to a mean error of ~465 ft
// against eleven known Colorado towns. An approximation of topography, not a DEM.
export const BOUNDS = { co: [36.85, 41.15, -109.2, -101.9], us: [24.5, 49.5, -125, -66.5] };
export const BASE   = { co: [3600, 5200], us: [300, 1600] };

export const RANGES = {
  co: [[40.4,-105.7,13800,.55],[39.6,-105.6,13500,.5],[38.7,-105.3,13200,.5],
       [39.1,-106.4,14400,.6],[38.6,-106.3,14000,.5],[37.9,-107.6,13800,.75],
       [40.5,-106.7,12000,.6],[39.1,-107.0,13000,.45],[37.6,-105.5,13500,.4],
       [39.0,-108.1,10200,.45],[40.7,-107.3,9000,.5],[37.3,-108.0,8500,.6]],
  us: [[39.5,-106.0,13000,1.5],[45.5,-110.5,11000,1.4],[43.5,-110.8,12000,.9],
       [37.0,-118.5,12500,1.1],[46.8,-121.7,11000,.8],[43.5,-114.5,10000,1.0],
       [36.5,-105.6,12000,.9],[35.2,-111.6,11000,1.0],[35.6,-83.5,5500,1.2],
       [44.2,-72.5,4000,.9],[38.0,-79.5,4200,1.0],[34.0,-116.5,8000,.8],
       [47.0,-91.0,1800,1.2],[36.0,-93.0,2200,1.1],[44.0,-104.0,5000,.8]]
};
export const VALLEYS = {
  co: [[37.65,-105.85,7500,.62],[39.15,-106.32,9900,.20],[37.30,-107.87,6600,.22],
       [38.45,-105.90,7000,.26],[40.48,-106.83,6700,.20],[39.55,-107.33,5800,.22]],
  us: [[37.5,-105.9,7500,.5],[36.5,-118.3,1000,.4],[33.5,-116.0,500,.4]]
};

export function elev(lat, lon, mode) {
  const b = BOUNDS[mode], base = BASE[mode];
  const t = Math.abs(b[3] - lon) / (b[3] - b[2]);
  let h = base[0] + t * (base[1] - base[0]);
  // Ranges blend, they do not stack — summing put Leadville at 17,987 ft.
  let top = 0, rest = 0;
  for (const r of RANGES[mode]) {
    const dy = (lat - r[0]) * 0.8, dx = (lon - r[1]) * (mode === "co" ? 2.8 : 1.5);
    const c = r[2] * Math.exp(-(dy*dy + dx*dx) / (r[3]*r[3]));
    if (c > top) { rest += top; top = c; } else rest += c;
  }
  h += top + rest * 0.16;
  // A positive-only model cannot make the San Luis Valley, a 7,500 ft flat ringed by 14ers.
  for (const v of VALLEYS[mode]) {
    const dy = (lat - v[0]) * 0.9, dx = (lon - v[1]) * 1.9;
    const w = Math.exp(-(dy*dy + dx*dx) / (v[3]*v[3]));
    if (w > 0.02) h = h * (1 - w) + v[2] * w;
  }
  return Math.max(base[0] * 0.95, Math.min(h, mode === "co" ? 14440 : 14505));
}
