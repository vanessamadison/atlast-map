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
import { albers } from "./geo.js";
import { S } from "./style.js";

let failed = 0;
const ok = m => console.log("  \x1b[32mok\x1b[0m   " + m);
const bad = m => { failed++; console.log("  \x1b[31mFAIL\x1b[0m " + m); };
const head = m => console.log("\n\x1b[1m" + m + "\x1b[0m");

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
      has ? ok(`${file} → ${path} exports ${name}`)
          : bad(`${file} imports { ${name} } from ${path}, which does not export it`);
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
head("scale budget — every visual in kilometres");
const KM_US = 4500 / S.MAP, KM_CO = 610 / S.MAP;
const row = (label, units, kmPerUnit, ceiling) => {
  const km = units * kmPerUnit;
  const line = `${label.padEnd(22)} ${String(units).padStart(6)} u  =  ${km.toFixed(1).padStart(7)} km`;
  km <= ceiling ? ok(line) : bad(line + `  — over the ${ceiling} km ceiling`);
};
row("USA park dot r", S.DOT, KM_US, 20);
row("USA park dot r (on)", S.DOT_ON, KM_US, 20);
row("USA marker stem", S.STEM_ON, KM_US, 70);
row("USA state slab", S.SLAB_US_ON, KM_US, 60);
row("USA river width", S.RIVER, KM_US, 10);
row("USA road width", S.ROAD, KM_US, 10);
row("CO town dot r", S.TOWN, KM_CO, 3);
row("CO slab thickness", S.SLAB_CO, KM_CO, 20);
row("CO relief (full range)", S.RELIEF_CO, KM_CO, 45);
row("CO peak shaft", S.PEAK * 1.35, KM_CO, 20);

console.log(
  `\n  Colorado relief exaggeration: ${(S.RELIEF_CO * KM_CO / ((14440 - 3300) * 0.0003048)).toFixed(1)}x`);

head(failed ? `\x1b[31m${failed} problem(s)\x1b[0m` : "\x1b[32mall checks passed\x1b[0m");
console.log("  Now run ./serve.sh and actually look at it. Four builds shipped broken because nobody did.\n");
process.exit(failed ? 1 : 0);
