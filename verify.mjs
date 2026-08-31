// ATLAST — pre-flight. Run: node verify.mjs
//
// Four checks, each for a bug that has actually shipped in this repo before:
//   1. every named import exists in the module it is imported from
//   2. every local module import carries the same ?v= cache-buster
//   3. the map is not mirrored — Seattle top-left, Miami bottom-right, in screen space
//   4. every visual in style.js is printed in kilometres so nothing ships as a 180 km disc
//
// It does not replace loading the page and looking at it. Nothing does.

import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { albers, inside } from "./geo.js";
import { S, reliefUnits } from "./style.js";

let failed = 0;
const ok = m => console.log("  \x1b[32mok\x1b[0m   " + m);
const bad = m => { failed++; console.log("  \x1b[31mFAIL\x1b[0m " + m); };
const head = m => console.log("\n\x1b[1m" + m + "\x1b[0m");

/* ── 0. syntax ────────────────────────────────────────────────────────────
   `node --check foo.js` DOES NOT CATCH ES MODULE SYNTAX ERRORS. It parses the file as an
   ambiguous CommonJS script and skips the module-level early errors — a duplicate `const` in
   the same scope passes --check and then throws "Identifier has already been declared" the
   instant a browser loads it. That shipped. The `--input-type=module` form is the one that
   works, and it only reads stdin, so each file is piped in. */
head("syntax — as modules, not as scripts");
{
  const files = readdirSync(".").filter(f => f.endsWith(".js") || f.endsWith(".mjs"));
  for (const f of files) {
    const r = spawnSync(process.execPath, ["--check", "--input-type=module"],
      { input: readFileSync(f), encoding: "utf8" });
    if (r.status === 0) ok(`${f} parses as a module`);
    else bad(`${f}\n${(r.stderr || "").split("\n").slice(0, 4).map(l => "       " + l).join("\n")}`);
  }
}

/* ── 1 + 2. imports ──────────────────────────────────────────────────── */
head("imports");
const files = readdirSync(".").filter(f => f.endsWith(".js") || f.endsWith(".mjs"));
const src = Object.fromEntries(files.map(f => [f, readFileSync(f, "utf8")]));
const html = readFileSync("index.html", "utf8");

const versions = new Set();
const IMP = /import\s*(?:\{([^}]*)\}|\*\s*as\s+\w+|(\w+))?\s*from\s*["']([^"']+)["']/g;

for (const [file, text] of Object.entries(src)) {
  for (const m of text.matchAll(IMP)) {
    const [, named, , spec] = m;
    if (!spec.startsWith("./")) continue;
    const [path, query] = spec.slice(2).split("?");
    // .mjs here is this script, run by node, which does not cache by URL. Only the modules
    // the browser loads need the cache-buster.
    if (query) versions.add(query);
    else if (!file.endsWith(".mjs")) bad(`${file} imports ${spec} with no ?v= cache-buster`);
    const target = src[path];
    if (!target) { bad(`${file} imports ${path}, which does not exist`); continue; }
    for (const raw of (named || "").split(",")) {
      const name = raw.trim().split(/\s+as\s+/)[0].trim();
      if (!name) continue;
      const has = new RegExp(
        `export\\s+(?:async\\s+)?(?:const|let|var|function|class)\\s+${name}\\b|` +
        `export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`).test(target);
      if (!has) { bad(`${file} imports { ${name} } from ${path}, which does not export it`); continue; }
      // A dead import is how a module ends up loading a file it no longer needs, and how a
      // rename quietly leaves half the codebase pointing at the wrong thing.
      const body = text.slice(m.index + m[0].length);
      new RegExp(`\\b${name}\\b`).test(body)
        ? ok(`${file} → ${path} exports ${name}`)
        : bad(`${file} imports { ${name} } from ${path} and never uses it`);
    }
  }
}
const htmlSrc = html.match(/src="\.\/app\.js\?([^"]+)"/);
if (htmlSrc) versions.add(htmlSrc[1]); else bad("index.html does not load ./app.js with a ?v=");
versions.size === 1
  ? ok(`all local imports pinned to ?${[...versions][0]}`)
  : bad(`mixed cache-busters: ${[...versions].join(", ")} — bump every local import together`);

const build = html.match(/id="build">([^<]+)</)?.[1];
const appBuild = src["app.js"]?.match(/BUILD\s*=\s*"([^"]+)"/)?.[1];
build && appBuild && build === appBuild
  ? ok(`BUILD pill agrees with app.js: ${build}`)
  : bad(`BUILD pill "${build}" does not match app.js "${appBuild}"`);

/* ── 3. orientation ──────────────────────────────────────────────────── */
head("orientation — is the country the right way up?");

// Mirrors projector() in app.js exactly. If you change one, change both.
function projector(pts, span = S.MAP) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [lon, lat] of pts) {
    const [x, y] = albers(lon, lat);
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const k = span / Math.max(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const flat = (lon, lat) => { const [x, y] = albers(lon, lat); return [(x - cx) * k, (y - cy) * k]; };
  const world = (lon, lat) => { const [X, Y] = flat(lon, lat); return [X, -Y]; };
  return { flat, world };
}

const CORNERS = [[-124.7, 48.4], [-66.9, 44.8], [-80.2, 25.8], [-117.1, 32.5]];
const P = projector(CORNERS);

// three.js lookAt, then a perspective divide. Screen +y is up, +x is right.
function screen(pos, eye, target) {
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  const norm = a => { const l = Math.hypot(...a); return [a[0]/l, a[1]/l, a[2]/l]; };
  const z = norm(sub(eye, target));
  const x = norm(cross([0, 1, 0], z));
  const y = cross(z, x);
  const d = sub(pos, eye);
  const v = [dot(d, x), dot(d, y), dot(d, z)];
  return [v[0] / -v[2], v[1] / -v[2]];
}

// Direction must match buildUS()'s frame() call. Only the direction matters here: sliding the
// camera along it, or moving the target, cannot flip which of two points renders higher.
const EYE = [0, 78.7, 61.7], TGT = [0, 0, 0];
const at = (lon, lat) => { const [X, Z] = P.world(lon, lat); return screen([X, 0.6, Z], EYE, TGT); };
const seattle = at(-122.33, 47.61), miami = at(-80.19, 25.76);
const boston  = at(-71.06, 42.36), denver = at(-104.99, 39.74);

seattle[1] > miami[1]  ? ok("Seattle renders above Miami")        : bad("Seattle renders BELOW Miami — the map is mirrored north-south");
seattle[0] < miami[0]  ? ok("Seattle renders left of Miami")      : bad("Seattle renders RIGHT of Miami — mirrored east-west");
boston[0]  > denver[0] ? ok("Boston renders right of Denver")     : bad("Boston renders LEFT of Denver — mirrored east-west");
boston[1]  > miami[1]  ? ok("Boston renders above Miami")         : bad("Boston renders BELOW Miami — mirrored north-south");
denver[1]  > miami[1]  ? ok("Denver renders above Miami")         : bad("Denver renders BELOW Miami — mirrored north-south");

// The check has to be able to fail, or it is decoration. This is the OLD convention —
// flat() negating y, which is what shipped in gt-r6.1 — and it must come out upside down.
{
  const old = (lon, lat) => {
    const [X, Y] = P.flat(lon, lat);
    return screen([X, 0.6, -(-Y)], EYE, TGT);   // old world() → north at +Z
  };
  old(-122.33, 47.61)[1] < old(-80.19, 25.76)[1]
    ? ok("the mirror test rejects the previous convention, so it is a real test")
    : bad("the mirror test passes BOTH conventions — it proves nothing, fix the test");
}

/* ── 4. scale budget ─────────────────────────────────────────────────── */
/* ── 3b. the terrain clip ────────────────────────────────────────────────
   terrainMesh switched from point-in-polygon per cell to scanline span filling for speed.
   Same even-odd rule, so it must produce byte-identical coverage. This mirrors the span code
   in region.js and diffs it against inside() over awkward shapes: a concave C, a polygon with
   a hole, and a Colorado-like quadrilateral with converging meridians. */
head("terrain clip — scanline must equal point-in-polygon");

function spanFill(rings, bounds, NX, NY) {
  const [south, north, west, east] = bounds;
  const hit = new Set();
  const xs = [];
  for (let j = 0; j < NY; j++) {
    const la = north - (north - south) * ((j + 0.5) / NY);
    xs.length = 0;
    for (const r of rings) {
      for (let a = 0, b = r.length - 1; a < r.length; b = a++) {
        const yi = r[a][1], yj = r[b][1];
        if ((yi > la) !== (yj > la)) xs.push(r[a][0] + ((la - yi) / (yj - yi)) * (r[b][0] - r[a][0]));
      }
    }
    if (xs.length < 2) continue;
    xs.sort((p, q) => p - q);
    for (let s = 0; s + 1 < xs.length; s += 2) {
      const i0 = Math.max(0, Math.ceil(((xs[s] - west) / (east - west)) * NX - 0.5));
      const i1 = Math.min(NX - 1, Math.floor(((xs[s + 1] - west) / (east - west)) * NX - 0.5));
      for (let i = i0; i <= i1; i++) hit.add(j * NX + i);
    }
  }
  return hit;
}

const SHAPES = {
  "concave C": [[[0, 0], [10, 0], [10, 3], [3, 3], [3, 7], [10, 7], [10, 10], [0, 10]]],
  "square with a hole": [
    [[0, 0], [10, 0], [10, 10], [0, 10]],
    [[3, 3], [3, 7], [7, 7], [7, 3]],
  ],
  "converging quad": [[[-109, 37], [-102, 37], [-102.4, 41], [-108.6, 41]]],
  "two disjoint blobs": [
    [[0, 0], [3, 0], [3, 4], [0, 4]],
    [[6, 5], [10, 5], [10, 9], [6, 9]],
  ],
};

for (const [label, rings] of Object.entries(SHAPES)) {
  let s = 1e9, n = -1e9, w = 1e9, e = -1e9;
  for (const r of rings) for (const [x, y] of r) {
    if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y;
  }
  const pad = (e - w) * 0.08;
  const bounds = [s - pad, n + pad, w - pad, e + pad];
  const NX = 97, NY = 61;                       // deliberately not round numbers
  const fast = spanFill(rings, bounds, NX, NY);
  let diff = 0, covered = 0;
  for (let j = 0; j < NY; j++) {
    const la = bounds[1] - (bounds[1] - bounds[0]) * ((j + 0.5) / NY);
    for (let i = 0; i < NX; i++) {
      const lo = bounds[2] + (bounds[3] - bounds[2]) * ((i + 0.5) / NX);
      const slow = inside(lo, la, rings);
      if (slow) covered++;
      if (slow !== fast.has(j * NX + i)) diff++;
    }
  }
  if (diff === 0 && covered > 0) ok(`${label.padEnd(20)} ${covered} cells, identical`);
  else if (covered === 0) bad(`${label} covered no cells — the test shape is wrong`);
  else bad(`${label} differs in ${diff} of ${NX * NY} cells`);
}

head("scale budget — every visual in kilometres");
const KM_US = 4500 / S.MAP, KM_CO = 610 / S.MAP;
const row = (label, units, kmPerUnit, ceiling) => {
  const km = units * kmPerUnit;
  const line = `${label.padEnd(22)} ${String(units).padStart(6)} u  =  ${km.toFixed(1).padStart(7)} km`;
  km <= ceiling ? ok(line) : bad(line + `  — over the ${ceiling} km ceiling`);
};
const KM_TX = 1300 / S.MAP, KM_GLOBE = 6371 / S.GLOBE_R;
row("USA park dot r", S.DOT, KM_US, 20);
row("USA park dot r (on)", S.DOT_ON, KM_US, 20);
row("USA marker stem", S.STEM_ON, KM_US, 70);
row("USA state slab", S.SLAB_US_ON, KM_US, 60);
row("USA river width", S.RIVER, KM_US, 10);
row("USA road width", S.ROAD, KM_US, 10);
row("CO town dot r", S.TOWN, KM_CO, 3);
row("region slab (Colorado)", S.SLAB_REGION, KM_CO, 20);
row("region slab (Texas)", S.SLAB_REGION, KM_TX, 40);
row("CO peak shaft", S.PEAK * 1.35, KM_CO, 20);
row("globe city halo r", S.GLOBE_HALO, KM_GLOBE, 200);
row("globe city dot r", S.GLOBE_DOT, KM_GLOBE, 30);
row("USA relief (0–14,505 ft)", reliefUnits(14505, KM_US), KM_US, 80);
row("CO relief (3,300–14,440)", reliefUnits(11140, KM_CO), KM_CO, 60);
row("globe relief (Everest)", reliefUnits(29032, KM_GLOBE), KM_GLOBE, 200);

head("exaggeration is one number, applied everywhere");
const exagOf = (rangeFt, kmPerUnit) =>
  (reliefUnits(rangeFt, kmPerUnit) * kmPerUnit) / (rangeFt * 0.0003048);
for (const [label, rangeFt, kpu] of [
  ["Colorado", 11140, KM_CO], ["contiguous US", 14505, KM_US],
  ["Texas", 8751, KM_TX], ["globe", 29032, KM_GLOBE],
]) {
  const x = exagOf(rangeFt, kpu);
  Math.abs(x - S.EXAG) < 0.01
    ? ok(`${label.padEnd(15)} ${x.toFixed(1)}×`)
    : bad(`${label} exaggerates ${x.toFixed(1)}× but S.EXAG says ${S.EXAG}× — views cannot be compared`);
}

head(failed ? `\x1b[31m${failed} problem(s)\x1b[0m` : "\x1b[32mall checks passed\x1b[0m");
console.log("  Now run ./serve.sh and actually look at it. Four builds shipped broken because nobody did.\n");
process.exit(failed ? 1 : 0);
