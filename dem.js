// Real elevation, not a guess.
//
// Source: Tilezen / Mapzen "terrarium" terrain tiles on the open AWS bucket
// elevation-tiles-prod. Public, keyless, CORS-enabled. Each PNG encodes metres as
//     elevation_m = (R * 256 + G + B / 256) - 32768
//
// Three things make this usable for a map you drill in and out of all day:
//
//   CACHE    every tile is kept for the life of the page, so going Texas → globe → Texas
//            costs nothing the second time. Failures are cached too, so a dead tile is not
//            retried on every view.
//   BUDGET   zoom is chosen from the region's size against a tile budget, not fixed. Colorado
//            gets z8; Alaska gets z5. Both cost about the same number of requests.
//   TWO-PASS coarse first so the view never stalls, fine second, swapped in when it lands.
//
// terrain.js stays as the fallback and the UI says which one is on screen. Never claim DEM
// fidelity for procedural output.
//
// NOTE: the tile endpoint is not reachable from the build sandbox (outbound proxy allowlist),
// only from a browser. Every load is individually guarded and the loader reports what it got.

const HOSTS = [
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium",
  "https://elevation-tiles-prod.s3.amazonaws.com/terrarium",
];

export const DEM_SOURCE_NOTE =
  "Tilezen terrarium tiles · AWS elevation-tiles-prod · SRTM/NED derived";

export const M_TO_FT = 3.28084;

const cache = new Map();          // "z/x/y" → {w,h,d} | null
const inflight = new Map();
export const demStats = { requested: 0, hits: 0, failed: 0 };

const lon2x = (lon, z) => ((lon + 180) / 360) * 2 ** z;
const lat2y = (lat, z) => {
  const s = Math.sin((Math.max(-85.05, Math.min(85.05, lat)) * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 2 ** z;
};

function fetchTile(z, x, y) {
  const n = 2 ** z;
  x = ((x % n) + n) % n;                     // wrap the antimeridian
  const key = `${z}/${x}/${y}`;
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  if (inflight.has(key)) return inflight.get(key);
  if (y < 0 || y >= n) { cache.set(key, null); return Promise.resolve(null); }

  const p = new Promise(resolve => {
    let hostIdx = 0;
    const img = new Image();
    img.crossOrigin = "anonymous";
    const attempt = () => {
      if (hostIdx >= HOSTS.length) { demStats.failed++; resolve(null); return; }
      img.src = `${HOSTS[hostIdx++]}/${z}/${x}/${y}.png`;
    };
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        // Throws SecurityError if the response carried no CORS header.
        const d = g.getImageData(0, 0, c.width, c.height).data;
        const count = c.width * c.height, out = new Float32Array(count);
        for (let i = 0; i < count; i++) {
          out[i] = d[i * 4] * 256 + d[i * 4 + 1] + d[i * 4 + 2] / 256 - 32768;
        }
        demStats.hits++;
        resolve({ w: c.width, h: c.height, d: out });
      } catch { demStats.failed++; resolve(null); }
    };
    img.onerror = attempt;
    demStats.requested++;
    attempt();
  }).then(v => { cache.set(key, v); inflight.delete(key); return v; });

  inflight.set(key, p);
  return p;
}

async function pooled(jobs, limit, onEach) {
  const it = jobs[Symbol.iterator]();
  await Promise.all(Array.from({ length: Math.min(limit, jobs.length) }, async () => {
    for (let n = it.next(); !n.done; n = it.next()) await onEach(n.value);
  }));
}

function tileSpan(bounds, zoom) {
  const [south, north, west, east] = bounds;
  const x0 = Math.floor(lon2x(west, zoom)), x1 = Math.floor(lon2x(east, zoom));
  const y0 = Math.floor(lat2y(north, zoom)), y1 = Math.floor(lat2y(south, zoom));
  return { x0, x1, y0, y1, count: (x1 - x0 + 1) * (y1 - y0 + 1) };
}

/** Largest zoom whose tile count fits the budget. Colorado lands on 8, Alaska on 5. */
export function pickZoom(bounds, budget = 48, min = 2, max = 9) {
  let best = min;
  for (let z = min; z <= max; z++) {
    if (tileSpan(bounds, z).count <= budget) best = z; else break;
  }
  return best;
}

/**
 * @param bounds [south, north, west, east] — west may exceed east's numeric value after
 *               antimeridian unwrapping; tile x is wrapped, so that is fine.
 * @returns {{sample(lon,lat):(number|null), tiles, got, zoom, metresPerPixel, complete}}
 */
export async function loadDEM(bounds, zoom, onProgress) {
  const { x0, x1, y0, y1, count } = tileSpan(bounds, zoom);
  const jobs = [];
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) jobs.push([x, y]);

  const grid = new Map();
  let got = 0, done = 0;
  await pooled(jobs, 8, async ([x, y]) => {
    const t = await fetchTile(zoom, x, y);
    done++;
    if (t) { grid.set(x + "/" + y, t); got++; }
    onProgress?.(done, jobs.length);
  });

  const n = 2 ** zoom;
  const midLat = (bounds[0] + bounds[1]) / 2;
  const mpp = (156543.03392 * Math.cos((midLat * Math.PI) / 180)) / n;

  const at = (px, py) => {
    let tx = Math.floor(px / 256);
    const ty = Math.floor(py / 256);
    const t = grid.get(tx + "/" + ty) || grid.get((((tx % n) + n) % n) + "/" + ty);
    if (!t) return null;
    const ix = Math.min(255, Math.max(0, Math.round(px - tx * 256)));
    const iy = Math.min(255, Math.max(0, Math.round(py - ty * 256)));
    return t.d[iy * t.w + ix];
  };

  return {
    tiles: count, got, zoom, metresPerPixel: mpp, complete: got === count,
    sample(lon, lat) {
      const px = lon2x(lon, zoom) * 256, py = lat2y(lat, zoom) * 256;
      const fx = Math.floor(px), fy = Math.floor(py);
      const a = at(fx, fy); if (a === null) return null;
      const b = at(fx + 1, fy), c = at(fx, fy + 1), d = at(fx + 1, fy + 1);
      if (b === null || c === null || d === null) return a;
      const u = px - fx, v = py - fy;
      return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
    },
  };
}

/**
 * Coarse now, fine next. `onPass(dem, isFinal)` fires once immediately with whatever a small
 * tile count can give, then again with the full-resolution version. The caller rebuilds its
 * geometry on the second call. If coarse and fine resolve to the same zoom, it fires once.
 */
export async function loadDEMProgressive(bounds, { budget = 48, coarseBudget = 6, onPass, onProgress, alive } = {}) {
  const fine = pickZoom(bounds, budget);
  const coarse = Math.min(fine, pickZoom(bounds, coarseBudget));
  if (coarse < fine) {
    const c = await loadDEM(bounds, coarse);
    if (alive && !alive()) return null;
    onPass?.(c, false);
  }
  const f = await loadDEM(bounds, fine, onProgress);
  if (alive && !alive()) return null;
  onPass?.(f, true);
  return f;
}
