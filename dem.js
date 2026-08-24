// Real elevation, not a guess.
//
// Source: Tilezen / Mapzen "terrarium" terrain tiles on the open AWS bucket
// elevation-tiles-prod. Public, keyless, CORS-enabled. Each PNG encodes metres as
//     elevation_m = (R * 256 + G + B / 256) - 32768
// which gives a real DEM at roughly 1 km per pixel at zoom 7 and 0.5 km at zoom 8.
//
// This replaces the procedural model in terrain.js, which was honest about being an
// approximation (~465 ft mean error) but was still a guess. terrain.js stays as the
// fallback, and the UI says which one is actually on screen — never claim DEM fidelity
// for procedural output.
//
// NOTE: the tile endpoint could not be reached from the build sandbox (outbound proxy
// allowlist), only from a browser. Every tile load is therefore individually guarded and
// the loader reports exactly how many tiles it got.

const HOSTS = [
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium",
  "https://elevation-tiles-prod.s3.amazonaws.com/terrarium",
];

export const DEM_SOURCE_NOTE =
  "Tilezen terrarium tiles · AWS elevation-tiles-prod · SRTM/NED derived";

const lon2x = (lon, z) => ((lon + 180) / 360) * 2 ** z;
const lat2y = (lat, z) => {
  const s = Math.sin((lat * Math.PI) / 180);
  return ((0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI))) * 2 ** z;
};

function loadTile(z, x, y) {
  return new Promise(resolve => {
    let hostIdx = 0;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "sync";
    const attempt = () => {
      if (hostIdx >= HOSTS.length) return resolve(null);
      img.src = `${HOSTS[hostIdx++]}/${z}/${x}/${y}.png`;
    };
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        // Throws a SecurityError if the response carried no CORS header.
        const d = g.getImageData(0, 0, c.width, c.height).data;
        const n = c.width * c.height, out = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          out[i] = (d[i * 4] * 256 + d[i * 4 + 1] + d[i * 4 + 2] / 256) - 32768;
        }
        resolve({ w: c.width, h: c.height, d: out });
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = attempt;
    attempt();
  });
}

async function pooled(jobs, limit, onEach) {
  const it = jobs[Symbol.iterator]();
  const workers = Array.from({ length: Math.min(limit, jobs.length) }, async () => {
    for (let n = it.next(); !n.done; n = it.next()) await onEach(n.value);
  });
  await Promise.all(workers);
}

/**
 * Fetch a DEM covering [south, north, west, east] and return a sampler in metres.
 * @returns {{ sample(lon,lat):(number|null), tiles:number, got:number, zoom:number,
 *             metresPerPixel:number, complete:boolean }}
 */
export async function loadDEM(bounds, zoom = 7, onProgress) {
  const [south, north, west, east] = bounds;
  const x0 = Math.floor(lon2x(west, zoom)), x1 = Math.floor(lon2x(east, zoom));
  const y0 = Math.floor(lat2y(north, zoom)), y1 = Math.floor(lat2y(south, zoom));
  const jobs = [];
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) jobs.push([x, y]);

  const grid = new Map();
  let got = 0, done = 0;
  await pooled(jobs, 6, async ([x, y]) => {
    const t = await loadTile(zoom, x, y);
    done++;
    if (t) { grid.set(x + "/" + y, t); got++; }
    onProgress?.(done, jobs.length);
  });

  const midLat = (south + north) / 2;
  const mpp = (156543.03392 * Math.cos((midLat * Math.PI) / 180)) / 2 ** zoom;

  // Bilinear sample across tile seams. Returns null where no tile covers the point,
  // so the caller can fall back rather than draw a hole at sea level.
  const at = (px, py) => {
    const tx = Math.floor(px / 256), ty = Math.floor(py / 256);
    const t = grid.get(tx + "/" + ty);
    if (!t) return null;
    const ix = Math.min(255, Math.max(0, Math.round(px - tx * 256)));
    const iy = Math.min(255, Math.max(0, Math.round(py - ty * 256)));
    return t.d[iy * t.w + ix];
  };

  return {
    tiles: jobs.length, got, zoom, metresPerPixel: mpp, complete: got === jobs.length,
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

export const M_TO_FT = 3.28084;
