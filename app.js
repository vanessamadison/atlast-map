// ATLAST — coverage map. Scene, three views, interaction.
//
// BUILD at-r7.0
//
// Orientation note, because this bit was wrong and mirroring is invisible until you check it:
// Albers here returns y increasing NORTHWARD. Shapes are built in (X,Y) and rotated -90° about
// X, which sends shape-Y to world -Z. So to put north at the top of the screen for a camera
// sitting on +Z, flat() must NOT negate y — north then lands on -Z, furthest from the camera,
// which reads as "up". The previous build negated, which kept parks glued to the right states
// (both were mirrored together, so relative checks passed) while flipping the whole country
// north-for-south. verify.mjs asserts Seattle top-left and Miami bottom-right in screen space.

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PARKS } from "./parks.js?v=7";
import { elev } from "./terrain.js?v=7";
import { decodeTopo, albers, lonLatToSphere, bboxOf, inside, lonLatBBox } from "./geo.js?v=7";
import { S, C, ramp } from "./style.js?v=7";
import { STATE, ABBR, CONTINENT } from "./states.js?v=7";
import { store } from "./store.js?v=7";
import { loadDEM, M_TO_FT, DEM_SOURCE_NOTE } from "./dem.js?v=7";
import { mountCard, openState, openCountry, closeCard } from "./card.js?v=7";

export const BUILD = "at-r7.0";

/* ── boot ─────────────────────────────────────────────────────────────── */
const errEl = document.getElementById("err");
const subEl = document.getElementById("sub");
const fail = m => { errEl.textContent = String(m?.stack || m); console.error(m); };
addEventListener("error", e => fail("ERROR " + e.message));
addEventListener("unhandledrejection", e => fail("PROMISE " + (e.reason?.message || e.reason)));

const cv = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.background = new THREE.Color(C.bg);
// No fog. FogExp2 at 0.055 with the camera 46 units out leaves 0.17% of the colour and the
// screen goes black with nothing actually broken. If it ever goes dark, look here first.
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 6000);
const controls = new OrbitControls(camera, cv);
controls.enableDamping = true;
controls.dampingFactor = 0.075;

scene.add(new THREE.AmbientLight(0xffffff, 0.66));
const sun = new THREE.DirectionalLight(0xfff4e2, 1.45);
sun.position.set(-70, 120, 60);
scene.add(sun);
scene.add(new THREE.HemisphereLight(0x93bcdd, 0x141a12, 0.55));
const rim = new THREE.DirectionalLight(0x9fd0ff, 0.35);
rim.position.set(80, 40, -70);
scene.add(rim);

let DATA, STATES, WORLD, mode = "us", buildToken = 0;
const group = new THREE.Group();
scene.add(group);
let hoverables = [], pulses = [];

function clear() {
  hoverables = []; pulses = []; group.rotation.y = 0;
  while (group.children.length) {
    const o = group.children.pop();
    o.traverse?.(n => {
      n.geometry?.dispose?.();
      const m = n.material;
      if (Array.isArray(m)) m.forEach(x => { x.map?.dispose?.(); x.dispose?.(); });
      else if (m) { m.map?.dispose?.(); m.dispose?.(); }
    });
  }
}

const resize = () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
addEventListener("resize", resize);

/* ── projection ───────────────────────────────────────────────────────────
   One projector, used by every view, so polygons and markers can never disagree. */
function projector(box, span = S.MAP) {
  const [x0, y0, x1, y1] = box;
  const k = span / Math.max(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  // flat: the (X,Y) a THREE.Shape is built in. Y northward.
  const flat = (lon, lat) => { const [x, y] = albers(lon, lat); return [(x - cx) * k, (y - cy) * k]; };
  // world: the (X,Z) a marker sits at, after the -90° rotation sends shape-Y to world -Z.
  const world = (lon, lat) => { const [X, Y] = flat(lon, lat); return [X, -Y]; };
  return { flat, world, k, box };
}

/* ── geometry helpers ─────────────────────────────────────────────────── */
const SPH = new THREE.SphereGeometry(1, 14, 12);
const RINGG = new THREE.RingGeometry(0.72, 1, 28);

function marker(colour, on, opts = {}) {
  const g = new THREE.Group();
  const r = (on ? S.DOT_ON : S.DOT) * (opts.scale || 1);
  const h = (on ? S.STEM_ON : S.STEM) * (opts.scale || 1);
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.14, r * 0.14, h, 5),
    new THREE.MeshBasicMaterial({ color: colour, transparent: true, opacity: 0.4 }));
  stem.position.y = h / 2; g.add(stem);
  const dot = new THREE.Mesh(SPH, new THREE.MeshBasicMaterial({ color: colour }));
  dot.scale.setScalar(r); dot.position.y = h; g.add(dot);
  const ring = new THREE.Mesh(RINGG, new THREE.MeshBasicMaterial({
    color: colour, transparent: true, opacity: on ? 0.32 : 0.14,
    side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.scale.setScalar((on ? S.RING : S.RING * 0.7) * (opts.scale || 1));
  ring.position.y = 0.02; g.add(ring);
  if (on) { g.userData.ring = ring; pulses.push(g); }
  return { g, hit: dot, top: h };
}

function tube(pts, colour, r, op) {
  if (pts.length < 2) return null;
  return new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(40, pts.length * 8), r, 6, false),
    new THREE.MeshBasicMaterial({ color: colour, transparent: true, opacity: op ?? 0.7 }));
}

function hoverable(obj, title, sub, click) {
  obj.userData.hover = { title, sub };
  if (click) obj.userData.click = click;
  hoverables.push(obj);
  return obj;
}

/* ── derived indexes ──────────────────────────────────────────────────────
   Which state a city is in, which states a route crossed, which country a city is in.
   All computed from the real polygons, so none of it is typed in by hand. */
let stateRings = new Map(), cityState = new Map(), cityCountry = new Map(), routeStates = [];

function buildIndexes() {
  stateRings = new Map();
  for (const f of STATES) { const c = ABBR[f.name]; if (c) stateRings.set(c, f.rings); }

  cityState = new Map();
  for (const city of DATA.cities) {
    for (const [code, rings] of stateRings) {
      if (inside(city.lon, city.lat, rings)) { cityState.set(city.name, code); break; }
    }
  }
  cityCountry = new Map();
  for (const city of DATA.cities) {
    for (const f of WORLD) {
      if (inside(city.lon, city.lat, f.rings)) { cityCountry.set(city.name, f.name); break; }
    }
  }
  routeStates = (DATA.routes || []).map(rt => {
    const set = new Set();
    for (const [la, lo] of rt.pts) {
      for (const [code, rings] of stateRings) {
        if (inside(lo, la, rings)) { set.add(code); break; }
      }
    }
    return set;
  });
}

const cardCtx = () => ({
  DATA, PARKS,
  citiesIn: code => DATA.cities.filter(c => cityState.get(c.name) === code),
  citiesInCountry: name => DATA.cities.filter(c => cityCountry.get(c.name) === name),
  routesIn: code => (DATA.routes || []).filter((_, i) => routeStates[i]?.has(code)),
  coTownsIn: () => ({ all: DATA.coTowns || [], been: (DATA.coTowns || []).filter(t => t.been) }),
  continentOf: name => CONTINENT[name] || "",
  continentCount: () => new Set(DATA.countriesVisited.map(n => CONTINENT[n]).filter(Boolean)).size,
});

/* ── USA ──────────────────────────────────────────────────────────────── */
const SKIP_CONUS = new Set(["Alaska", "Hawaii", "Puerto Rico", "Virgin Islands",
  "Guam", "American Samoa", "Commonwealth of the Northern Mariana Islands"]);

function slab(feats, P, been, into, depthOn, depthOff) {
  for (const f of feats) {
    const code = ABBR[f.name];
    const on = code ? been.has(code) : false;
    const d = on ? depthOn : depthOff;
    const holder = new THREE.Group();
    for (const ring of f.rings) {
      const sh = new THREE.Shape();
      ring.forEach(([lo, la], i) => { const [X, Y] = P.flat(lo, la); i ? sh.lineTo(X, Y) : sh.moveTo(X, Y); });
      const capMat = new THREE.MeshStandardMaterial({
        color: on ? C.landOn : C.landOff, roughness: 0.92, metalness: 0.03,
        side: THREE.DoubleSide });
      const sideMat = new THREE.MeshStandardMaterial({
        color: on ? C.slabSideOn : C.slabSide, roughness: 1, metalness: 0,
        side: THREE.DoubleSide });
      const m = new THREE.Mesh(
        new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }), [capMat, sideMat]);
      m.rotation.x = -Math.PI / 2;
      m.userData.baseColour = on ? C.landOn : C.landOff;
      m.userData.stateCode = code;
      holder.add(m);
      if (code) {
        hoverable(m, STATE[code]?.name || f.name,
          on ? "verified · click for the card" : "not yet · click for the card",
          () => openState(code, cardCtx()));
      }
      const e = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.ShapeGeometry(sh)),
        new THREE.LineBasicMaterial({ color: on ? C.edgeOn : C.edgeOff,
          transparent: true, opacity: on ? 0.85 : 0.5 }));
      e.rotation.x = -Math.PI / 2;
      e.position.y = d + 0.012;
      holder.add(e);
    }
    into.add(holder);
  }
}

function buildUS() {
  clear();
  const been = new Set(DATA.statesVisited);
  const visP = new Set(DATA.parksVisited);
  const sug = new Map((DATA.suggestions || []).map(x => [x.park, x.why]));

  const conus = STATES.filter(f => !SKIP_CONUS.has(f.name));
  const P = projector(bboxOf(conus));
  slab(conus, P, been, group, S.SLAB_US_ON, S.SLAB_US);

  // Insets, so "all 50 states" is literally true and Alaska and Hawaii have cards.
  // Placed by measuring the mainland rather than by eyeballing coordinates — the last time
  // positions were typed in by hand they came out in kilometres nobody had computed.
  const conusBox = new THREE.Box3().setFromObject(group);
  const insets = [
    { names: ["Alaska"], span: 24 },
    { names: ["Hawaii"], span: 10 },
  ];
  let cursorX = conusBox.min.x;
  for (const ins of insets) {
    const feats = STATES.filter(f => ins.names.includes(f.name));
    if (!feats.length) continue;
    const IP = projector(bboxOf(feats), ins.span);
    const g = new THREE.Group();
    slab(feats, IP, been, g, S.INSET_SLAB * 1.7, S.INSET_SLAB);
    group.add(g);
    // Drop it just south of the mainland (south is +Z), marching left to right.
    const b = new THREE.Box3().setFromObject(g);
    g.position.x += cursorX - b.min.x;
    g.position.z += conusBox.max.z + 5 - b.min.z;
    cursorX += (b.max.x - b.min.x) + 5;
    ins.P = IP; ins.group = g;
  }

  for (const rv of RIVERS) {
    const t = tube(rv.map(([la, lo]) => { const [X, Z] = P.world(lo, la);
      return new THREE.Vector3(X, S.SLAB_US + 0.05, Z); }), C.river, S.RIVER, 0.55);
    if (t) group.add(t);
  }
  (DATA.routes || []).forEach(rt => {
    const p = rt.pts.filter(q => q[0] < 50 && q[0] > 24 && q[1] > -126 && q[1] < -66)
      .map(([la, lo]) => { const [X, Z] = P.world(lo, la);
        return new THREE.Vector3(X, S.SLAB_US_ON + 0.10, Z); });
    const t = tube(p, rt.mode === "rail" ? C.rail : C.road, S.ROAD, 0.8);
    if (t) { group.add(t); hoverable(t, rt.name, rt.year || "year not recorded"); }
  });

  const place = (p, PP, y, host) => {
    const on = visP.has(p.name), s = !on && sug.has(p.name);
    const [X, Z] = PP.world(p.lon, p.lat);
    const { g, hit } = marker(on ? C.park : s ? C.next : C.miss, on || s);
    g.position.set(X, y, Z);
    hoverable(hit, p.name,
      (on ? "visited" : s ? sug.get(p.name) : "not yet") + " · " + p.state,
      () => STATE[p.state] && openState(p.state, cardCtx()));
    host.add(g);
  };
  for (const p of PARKS) {
    if (p.lat > 50 || p.lat < 24 || p.lon < -126 || p.lon > -66) continue;
    place(p, P, been.has(p.state) ? S.SLAB_US_ON : S.SLAB_US, group);
  }
  for (const ins of insets) {
    if (!ins.group) continue;
    const codes = ins.names.map(n => ABBR[n]);
    for (const p of PARKS) {
      if (!codes.includes(p.state)) continue;
      place(p, ins.P, S.INSET_SLAB * 1.7, ins.group);
    }
  }

  controls.enableRotate = false;          // fixed camera: pan and zoom only
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.minDistance = 26;
  controls.maxDistance = 260;
  frame(new THREE.Vector3(0, 0.787, 0.617), 1.12);

  const sc = PARKS.filter(p => !visP.has(p.name) && sug.has(p.name)).length;
  stats([[DATA.parksVisited.length, "of 63 parks"],
    [Math.round((DATA.parksVisited.length / 63) * 100) + "%", "park coverage"],
    [DATA.statesVisited.length, "of 51 states"], [sc, "suggested next"]]);
  legend(["click any state for its card", "#a8cc70 visited", "#e3c765 suggested",
    "#d9963f drives", "#4f93b5 rivers"]);
}

/* ── COLORADO ─────────────────────────────────────────────────────────────
   Extruded slab, same as the USA view, with real DEM terrain stacked on top of it and
   clipped to the true border by point-in-polygon. Colorado is rectangular in lat/lon but
   Albers converges the meridians, so the north edge is genuinely shorter. */
async function buildCO() {
  const token = ++buildToken;
  clear();
  const co = STATES.find(f => f.name === "Colorado");
  if (!co) return fail("Colorado not found in the state topology");

  const P = projector(bboxOf([co]));
  const [south, north, west, east] = lonLatBBox(co.rings);

  // slab first, so the terrain has something to sit on
  const slabG = new THREE.Group();
  slab([co], P, new Set(["CO"]), slabG, S.SLAB_CO, S.SLAB_CO);
  group.add(slabG);

  const zoom = Math.min(9, Math.max(6, +(new URLSearchParams(location.search).get("dem") || 7)));
  subEl.textContent = "colorado · fetching elevation";
  let dem = null;
  try {
    dem = await loadDEM([south, north, west, east], zoom,
      (d, n) => { if (token === buildToken) subEl.textContent = `colorado · elevation ${d}/${n}`; });
  } catch (e) { dem = null; }
  if (token !== buildToken) return;

  const usingDEM = dem && dem.got > 0;
  let demHits = 0, procHits = 0;
  const ftAt = (lon, lat) => {
    if (usingDEM) {
      const m = dem.sample(lon, lat);
      if (m !== null && m > -500) { demHits++; return m * M_TO_FT; }
    }
    procHits++;
    return elev(lat, lon, "co");
  };

  const eMin = 3300, eMax = 14440;
  const relief = ft => ((Math.min(eMax, Math.max(eMin, ft)) - eMin) / (eMax - eMin)) * S.RELIEF_CO;
  const yAt = (lon, lat) => S.SLAB_CO + relief(ftAt(lon, lat));

  const NX = 420, NY = 270;
  const pos = [], col = [], idx = [];
  const gi = (i, j) => j * (NX + 1) + i;
  for (let j = 0; j <= NY; j++) {
    for (let i = 0; i <= NX; i++) {
      const lo = west + (east - west) * (i / NX);
      const la = north - (north - south) * (j / NY);
      const [X, Z] = P.world(lo, la);
      const ft = ftAt(lo, la);
      pos.push(X, S.SLAB_CO + relief(ft), Z);
      col.push(...ramp((ft - eMin) / (eMax - eMin)));
    }
  }
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const lo = west + (east - west) * ((i + 0.5) / NX);
      const la = north - (north - south) * ((j + 0.5) / NY);
      if (!inside(lo, la, co.rings)) continue;
      idx.push(gi(i, j), gi(i + 1, j + 1), gi(i + 1, j), gi(i, j), gi(i, j + 1), gi(i + 1, j + 1));
    }
  }
  const tg = new THREE.BufferGeometry();
  tg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  tg.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  tg.setIndex(idx);
  tg.computeVertexNormals();
  // DoubleSide is insurance: a -90° rotation about X keeps the normal up, +90° flips it and
  // FrontSide culling then deletes the entire terrain with no error.
  group.add(new THREE.Mesh(tg, new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.94, metalness: 0.02, side: THREE.DoubleSide })));

  for (const ring of co.rings) {
    group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ring.map(([lo, la]) => {
        const [X, Z] = P.world(lo, la); return new THREE.Vector3(X, yAt(lo, la) + 0.10, Z); })),
      new THREE.LineBasicMaterial({ color: C.edgeOn, transparent: true, opacity: 0.7 })));
  }
  for (const rv of CO_RIVERS) {
    const t = tube(rv.map(([la, lo]) => { const [X, Z] = P.world(lo, la);
      return new THREE.Vector3(X, yAt(lo, la) + 0.08, Z); }), C.river, S.RIVER * 0.8, 0.65);
    if (t) group.add(t);
  }
  (DATA.routes || []).forEach(rt => {
    const p = rt.pts.filter(q => q[0] > south && q[0] < north && q[1] > west && q[1] < east)
      .map(([la, lo]) => { const [X, Z] = P.world(lo, la);
        return new THREE.Vector3(X, yAt(lo, la) + 0.12, Z); });
    const t = tube(p, C.road, S.ROAD * 0.8, 0.75);
    if (t) { group.add(t); hoverable(t, rt.name, rt.year || "year not recorded"); }
  });

  const visP = new Set(DATA.parksVisited);
  const sug = new Map((DATA.suggestions || []).map(x => [x.park, x.why]));
  for (const p of PARKS.filter(x => x.state === "CO")) {
    const on = visP.has(p.name);
    const [X, Z] = P.world(p.lon, p.lat), y = yAt(p.lon, p.lat);
    const { g, hit } = marker(on ? C.park : C.next, true, { scale: 0.85 });
    g.position.set(X, y, Z);
    hoverable(hit, p.name, on ? "visited" : sug.get(p.name) || "not yet",
      () => openState("CO", cardCtx()));
    group.add(g);
  }

  for (const t of (DATA.coTowns || [])) {
    const [X, Z] = P.world(t.lon, t.lat), y = yAt(t.lon, t.lat);
    const d = new THREE.Mesh(SPH, new THREE.MeshBasicMaterial({
      color: t.been ? C.town : 0x4d5648, transparent: !t.been, opacity: t.been ? 1 : 0.55 }));
    d.scale.setScalar(t.been ? S.TOWN : S.TOWN_OFF);
    d.position.set(X, y + 0.10, Z);
    hoverable(d, t.name, (t.been ? "been" : "not yet") + " · " + t.region.toLowerCase());
    group.add(d);
  }

  for (const f of (DATA.fourteeners || [])) {
    const [X, Z] = P.world(f.lon, f.lat), y = yAt(f.lon, f.lat);
    const up = f.summited, pl = f.planned;
    const h = S.PEAK * (0.55 + ((f.ft - 14000) / 440) * 0.8);
    const colr = up ? C.summit : pl ? C.next : 0x7d8a77;
    const sh = new THREE.Mesh(
      new THREE.CylinderGeometry(up ? 0.075 : pl ? 0.065 : 0.035, 0.012, h, 5),
      new THREE.MeshBasicMaterial({ color: colr, transparent: true,
        opacity: up ? 0.95 : pl ? 0.85 : 0.4 }));
    sh.position.set(X, y + h / 2, Z);
    hoverable(sh, f.name,
      f.ft.toLocaleString() + " ft"
      + (f.cls ? ` · class ${f.cls} · ${f.mi} mi · ${f.gain.toLocaleString()} ft gain` : "")
      + (f.drive ? ` · ${f.drive} from Denver` : "")
      + (up ? " · SUMMITED" : pl ? " · PLANNED" : ""),
      () => openState("CO", cardCtx()));
    group.add(sh);
    if (up || pl) {
      const cap = new THREE.Mesh(SPH, new THREE.MeshBasicMaterial({ color: colr }));
      cap.scale.setScalar(up ? 0.15 : 0.12);
      cap.position.set(X, y + h, Z);
      group.add(cap);
    }
  }

  controls.enableRotate = true;
  controls.enablePan = true;
  controls.minDistance = 22;
  controls.maxDistance = 260;
  controls.maxPolarAngle = 1.36;
  frame(new THREE.Vector3(0, 0.62, 0.78), 1.02);   // lower angle — the terrain is the point

  const tb = (DATA.coTowns || []).filter(t => t.been).length;
  const ft = (DATA.fourteeners || []).filter(f => f.summited).length;
  stats([[PARKS.filter(p => p.state === "CO" && visP.has(p.name)).length, "of 4 CO parks"],
    [tb, "of " + (DATA.coTowns || []).length + " towns"],
    [ft, "of 58 fourteeners"],
    [Math.round((tb / Math.max(1, (DATA.coTowns || []).length)) * 100) + "%", "town coverage"]]);

  const share = demHits + procHits ? Math.round((demHits / (demHits + procHits)) * 100) : 0;
  const srcTxt = usingDEM && share > 98
    ? `real DEM · z${dem.zoom} · ${Math.round(dem.metresPerPixel)} m/px`
    : usingDEM
      ? `DEM ${share}% · procedural fill ${100 - share}%`
      : "procedural relief — DEM tiles did not load";
  setSource(srcTxt, usingDEM && share > 98);
  if (token === buildToken) subEl.textContent = "colorado · 58 fourteeners · " + srcTxt;
  legend(["#f2f6ee summited", "#e3c765 planned", "#86a8c4 towns", "#4f93b5 rivers",
    usingDEM ? DEM_SOURCE_NOTE : "terrain.js procedural fallback"]);
}

/* ── GLOBE ────────────────────────────────────────────────────────────────
   Every border lit, visited countries filled rather than outlined. Fill brightness tracks
   how many places she has actually logged inside that border — it is a record of her own
   coverage, not a claim about what fraction of the country she has seen. */
function unwrap(ring) {
  let lo = 1e9, hi = -1e9;
  for (const [x] of ring) { if (x < lo) lo = x; if (x > hi) hi = x; }
  if (hi - lo <= 180) return ring;
  return ring.map(([x, y]) => [x < 0 ? x + 360 : x, y]);
}

function sphereFill(rings, R, colour, opacity) {
  const verts = [];
  const push = (a, b, c) => {
    const e = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    if (Math.max(e(a, b), e(b, c), e(a, c)) > 4) {
      const m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const ab = m(a, b), bc = m(b, c), ca = m(c, a);
      push(a, ab, ca); push(ab, b, bc); push(ca, bc, c); push(ab, bc, ca);
      return;
    }
    verts.push(...lonLatToSphere(a[0], a[1], R), ...lonLatToSphere(b[0], b[1], R),
      ...lonLatToSphere(c[0], c[1], R));
  };
  for (const raw of rings) {
    const ring = unwrap(raw);
    if (ring.length < 3) continue;
    const contour = ring.map(([x, y]) => new THREE.Vector2(x, y));
    let tris;
    try { tris = THREE.ShapeUtils.triangulateShape(contour, []); } catch { continue; }
    for (const [i, j, k] of tris) {
      push([contour[i].x, contour[i].y], [contour[j].x, contour[j].y], [contour[k].x, contour[k].y]);
    }
  }
  if (!verts.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  g.computeVertexNormals();
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({
    color: colour, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }));
}

function buildGlobe() {
  clear();
  const R = S.GLOBE_R;
  const been = new Set(DATA.countriesVisited);
  const ctx = cardCtx();

  group.add(new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96),
    new THREE.MeshStandardMaterial({ color: C.globeSea, roughness: 0.95, metalness: 0.06 })));

  const N = 1600, sp = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 500 + Math.random() * 900, t = Math.random() * 6.283,
      p = Math.acos(2 * Math.random() - 1);
    sp[i * 3] = r * Math.sin(p) * Math.cos(t);
    sp[i * 3 + 1] = r * Math.cos(p);
    sp[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  group.add(new THREE.Points(sg, new THREE.PointsMaterial({
    color: 0xeef2ea, size: 1.1, sizeAttenuation: false, transparent: true, opacity: 0.38 })));

  const coverage = name => {
    if (name === "United States") {
      return Math.max(DATA.statesVisited.length / 51, DATA.parksVisited.length / 63, 0.3);
    }
    return Math.min(1, 0.3 + ctx.citiesInCountry(name).length * 0.2);
  };
  const heat = t => new THREE.Color(C.fillLow).lerp(new THREE.Color(C.fillHigh), Math.min(1, t));

  for (const f of WORLD) {
    const on = been.has(f.name);
    if (on) {
      const t = coverage(f.name);
      const fill = sphereFill(f.rings, R * 1.006, heat(t), 0.42 + t * 0.42);
      if (fill) {
        hoverable(fill, f.name,
          `visited · ${ctx.citiesInCountry(f.name).length} places logged · click for the card`,
          () => openCountry(f.name, cardCtx()));
        group.add(fill);
      }
    }
    // Every border is lit, visited or not.
    for (const ring of f.rings) {
      const pts = ring.map(([lo, la]) => new THREE.Vector3(...lonLatToSphere(lo, la, R * 1.011)));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: on ? C.borderOn : C.borderOff,
          transparent: true, opacity: on ? 1 : 0.62 })));
    }
  }

  // US state borders, so the country she has covered most reads as a grid rather than a blob.
  for (const f of STATES) {
    if (SKIP_CONUS.has(f.name) && f.name !== "Alaska" && f.name !== "Hawaii") continue;
    for (const ring of f.rings) {
      const pts = ring.map(([lo, la]) => new THREE.Vector3(...lonLatToSphere(lo, la, R * 1.013)));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: C.borderState, transparent: true, opacity: 0.5 })));
    }
  }

  for (const c of DATA.cities) {
    const m = new THREE.Mesh(SPH, new THREE.MeshBasicMaterial({ color: C.park }));
    m.scale.setScalar(0.22);
    m.position.set(...lonLatToSphere(c.lon, c.lat, R * 1.014));
    const country = cityCountry.get(c.name);
    hoverable(m, c.name, country ? country : "city",
      () => country && openCountry(country, cardCtx()));
    group.add(m);
  }

  controls.enableRotate = true;
  controls.enablePan = false;
  controls.minDistance = 44;
  controls.maxDistance = 200;
  controls.maxPolarAngle = Math.PI;
  ease(new THREE.Vector3(44, 26, 62), new THREE.Vector3(0, 0, 0));

  stats([[DATA.countriesVisited.length, "of 195 countries"],
    [DATA.cities.length, "cities logged"],
    [ctx.continentCount() + "/7", "continents"],
    [Math.round((DATA.countriesVisited.length / 195) * 100) + "%", "of the world"]]);
  setSource("world-atlas 110m · us-atlas 10m", true);
  legend(["click a country for its card", "#caeb96 visited", "fill brightness = places logged",
    "africa · oceania · antarctica remain"]);
}

/* ── chrome ───────────────────────────────────────────────────────────── */
const stats = r => document.getElementById("stats").innerHTML =
  r.map(x => `<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");

const legend = r => document.getElementById("hint").innerHTML =
  r.map(s => {
    const [c, ...t] = s.split(" ");
    return c.startsWith("#") ? `<span style="color:${c}">${t.join(" ")}</span>` : `<span>${s}</span>`;
  }).join("<br>");

function setSource(text, good) {
  const el = document.getElementById("src");
  el.textContent = text;
  el.className = "pill" + (good ? " on" : " warn");
}

// Fit whatever is currently in `group` into the frame, from a fixed viewing direction.
// The alternative is hand-typed camera coordinates that stop being right the moment the
// contents change — which is how Alaska ended up sitting on top of Texas.
function frame(dirIn, pad = 1.06) {
  const box = new THREE.Box3().setFromObject(group);
  if (box.isEmpty()) return;
  const centre = box.getCenter(new THREE.Vector3());
  const dir = dirIn.clone().normalize();

  // three.js lookAt basis for a camera sitting along `dir` from `centre`.
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(up, dir).normalize();
  const camUp = new THREE.Vector3().crossVectors(dir, right);

  const tv = Math.tan((camera.fov * Math.PI) / 180 / 2);
  const th = tv * camera.aspect;

  // Fit the actual corners, not a bounding sphere — a sphere around a flat, wide map
  // over-pads badly and pushes the camera into the next county.
  let dist = 0;
  const q = new THREE.Vector3();
  for (let i = 0; i < 8; i++) {
    q.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y,
      i & 4 ? box.max.z : box.min.z).sub(centre);
    const along = q.dot(dir);
    dist = Math.max(dist,
      along + Math.abs(q.dot(right)) / th,
      along + Math.abs(q.dot(camUp)) / tv);
  }
  ease(centre.clone().add(dir.multiplyScalar(dist * pad)), centre);
}

let tw = null;
function ease(pos, tgt) {
  const p0 = camera.position.clone(), t0 = controls.target.clone(), st = { v: 0 };
  if (tw) cancelAnimationFrame(tw);
  (function step() {
    st.v = Math.min(1, st.v + 0.045);
    const e = 1 - (1 - st.v) ** 3;
    camera.position.lerpVectors(p0, pos, e);
    controls.target.lerpVectors(t0, tgt, e);
    if (st.v < 1) tw = requestAnimationFrame(step);
  })();
}

/* ── hover: the only label on screen is the one under the cursor ──────── */
const ray = new THREE.Raycaster(), mv = new THREE.Vector2();
const tip = document.getElementById("tip");
let hot = null, downAt = null;

function setHot(obj) {
  if (hot === obj) return;
  if (hot?.userData.baseColour !== undefined && Array.isArray(hot.material)) {
    hot.material[0].color.setHex(hot.userData.baseColour);
  }
  hot = obj;
  if (hot?.userData.baseColour !== undefined && Array.isArray(hot.material)) {
    hot.material[0].color.setHex(C.landHover);
  }
}

function pick(e) {
  mv.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(mv, camera);
  const h = ray.intersectObjects(hoverables, false).find(o => o.object.userData?.hover);
  return h ? h.object : null;
}

addEventListener("pointermove", e => {
  if (e.target.closest && e.target.closest("#cardhost, #modes")) { tip.style.opacity = 0; return; }
  const o = pick(e);
  setHot(o);
  if (o) {
    const { title, sub } = o.userData.hover;
    tip.innerHTML = `<b>${title}</b>${sub ? `<span>${sub}</span>` : ""}`;
    const w = tip.offsetWidth || 200, h2 = tip.offsetHeight || 40;
    tip.style.left = Math.min(innerWidth - w - 12, e.clientX + 16) + "px";
    tip.style.top = Math.min(innerHeight - h2 - 12, e.clientY + 14) + "px";
    tip.style.opacity = 1;
    cv.style.cursor = o.userData.click ? "pointer" : "crosshair";
  } else {
    tip.style.opacity = 0;
    cv.style.cursor = "grab";
  }
});

cv.addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY, performance.now()]; });
cv.addEventListener("pointerup", e => {
  if (!downAt) return;
  const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]);
  const quick = performance.now() - downAt[2] < 500;
  downAt = null;
  if (moved > 5 || !quick) return;          // a drag is not a click
  const o = pick(e);
  if (o?.userData.click) o.userData.click();
});

addEventListener("keydown", e => {
  if (e.key === "Escape") closeCard();
  if (e.key === "1") go("co");
  if (e.key === "2") go("us");
  if (e.key === "3") go("globe");
});

function go(m) {
  mode = m;
  errEl.textContent = "";
  closeCard();
  document.querySelectorAll("#modes button").forEach(b => b.classList.toggle("on", b.dataset.m === m));
  subEl.textContent = m === "co" ? "colorado · 58 fourteeners"
    : m === "us" ? "united states · 63 parks · 51 states" : "the world · 195 countries";
  if (m !== "co") setSource("us-atlas 10m · world-atlas 110m", true);
  try {
    if (m === "co") buildCO().catch(fail);
    else if (m === "us") buildUS();
    else buildGlobe();
  } catch (e) { fail(e); }
}

let held = false;
cv.addEventListener("pointerdown", () => held = true);
addEventListener("pointerup", () => setTimeout(() => held = false, 2400));

const t0 = performance.now();
(function loop() {
  requestAnimationFrame(loop);
  const t = (performance.now() - t0) / 1000;
  if (mode === "globe" && !held) group.rotation.y += 0.00026;
  for (const g of pulses) {
    const r = g.userData.ring;
    if (r) r.material.opacity = 0.2 + 0.13 * (1 + Math.sin(t * 1.5 + g.position.x * 0.25));
  }
  controls.update();
  renderer.render(scene, camera);
})();

/* ── static geography ─────────────────────────────────────────────────── */
const CO_RIVERS = [
  [[40.45, -105.9], [40.20, -106.35], [39.90, -106.42], [39.60, -106.85], [39.50, -107.32], [39.20, -108.05], [39.06, -108.55], [39.02, -109.03]],
  [[39.15, -106.30], [38.90, -106.10], [38.70, -105.90], [38.45, -105.20], [38.26, -104.61], [38.10, -103.60], [38.05, -102.10]],
  [[37.85, -106.35], [37.60, -105.95], [37.35, -105.75], [37.05, -105.70]],
  [[40.60, -105.55], [40.45, -105.00], [40.40, -104.30], [40.55, -103.60], [40.68, -102.10]],
  [[37.70, -107.60], [37.40, -107.75], [37.15, -107.88], [36.99, -108.00]],
  [[40.55, -106.85], [40.35, -107.30], [40.20, -107.80], [40.05, -108.40]],
];
const RIVERS = [
  [[47.9, -95.0], [45.0, -93.2], [43.5, -91.2], [41.5, -90.6], [38.6, -90.2], [36.5, -89.5], [35.1, -90.1], [32.3, -90.9], [31.0, -91.4], [29.9, -90.1], [29.2, -89.3]],
  [[43.0, -110.0], [41.5, -109.5], [40.0, -110.2], [38.4, -109.6], [37.9, -111.0], [36.9, -111.5], [36.1, -112.1], [36.0, -114.0], [34.7, -114.5], [32.7, -114.6]],
  [[47.7, -115.5], [46.7, -117.0], [46.2, -119.0], [45.7, -120.7], [45.6, -121.9], [46.2, -123.9]],
  [[47.5, -111.3], [46.5, -104.0], [44.4, -100.4], [42.9, -97.4], [40.7, -95.9], [39.1, -94.6], [38.6, -90.2]],
  [[39.1, -106.3], [38.5, -105.2], [38.2, -104.6], [38.0, -102.2], [37.7, -99.0], [36.1, -95.9], [35.0, -91.2], [33.9, -91.1]],
  [[44.5, -74.0], [43.3, -73.8], [42.7, -73.7], [41.5, -73.9], [40.7, -74.0]],
];

/* ── init ─────────────────────────────────────────────────────────────── */
document.getElementById("build").textContent = BUILD;
mountCard(document.getElementById("cardhost"));
document.querySelectorAll("#modes button")
  .forEach(b => b.addEventListener("click", () => go(b.dataset.m)));

(async function init() {
  resize();
  try {
    const [d, us, w] = await Promise.all([
      fetch("./travel.json?" + Date.now()).then(r => r.json()),
      fetch("https://unpkg.com/us-atlas@3/states-10m.json").then(r => r.json()),
      fetch("https://unpkg.com/world-atlas@2/countries-110m.json").then(r => r.json()),
    ]);
    DATA = d;
    STATES = decodeTopo(us, "states");
    WORLD = decodeTopo(w, "countries");
    store.init(DATA);
    buildIndexes();
    console.log("[atlast]", BUILD, "states", STATES.length, "countries", WORLD.length,
      "cities placed", cityState.size);
    go("us");
    document.getElementById("load").remove();
  } catch (e) {
    fail("data load failed — " + (e.message || e));
    document.getElementById("load")?.remove();
  }
})();
