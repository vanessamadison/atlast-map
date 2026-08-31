// TopoJSON decode + Albers projection. No dependencies.
// The old build drew a rectangular heightfield with procedural bumps — a chart, not a map.
// This draws the real boundaries.

export function decodeTopo(topo, objName) {
  const { arcs, transform } = topo;
  const [sx, sy] = transform ? transform.scale : [1, 1];
  const [tx, ty] = transform ? transform.translate : [0, 0];
  const arcCache = new Map();
  const arc = i => {
    if (!arcCache.has(i)) {
      let x = 0, y = 0;
      arcCache.set(i, arcs[i].map(d => {
        x += d[0]; y += d[1];
        return transform ? [x * sx + tx, y * sy + ty] : [d[0], d[1]];
      }));
    }
    return arcCache.get(i);
  };
  const ring = idx => idx >= 0 ? arc(idx) : arc(~idx).slice().reverse();
  const out = [];
  for (const g of topo.objects[objName].geometries) {
    const polys = g.type === "Polygon" ? [g.arcs] : g.type === "MultiPolygon" ? g.arcs : null;
    if (!polys) continue;
    const rings = [];
    for (const poly of polys) {
      for (const lr of poly) {
        const pts = [];
        for (const ai of lr) {
          const seg = ring(ai);
          for (let k = pts.length ? 1 : 0; k < seg.length; k++) pts.push(seg[k]);
        }
        if (pts.length > 2) rings.push(pts);
      }
    }
    if (rings.length) out.push({ name: (g.properties && g.properties.name) || "", id: g.id, rings });
  }
  return out;
}

// Albers equal-area conic — the standard projection for the contiguous US. Without it the
// country looks stretched and wrong, which is most of why the old view read as a rectangle.
export function albers(lon, lat) {
  const R = Math.PI / 180, p1 = 29.5 * R, p2 = 45.5 * R, p0 = 37.5 * R, l0 = -96 * R;
  const n = (Math.sin(p1) + Math.sin(p2)) / 2;
  const C = Math.cos(p1) ** 2 + 2 * n * Math.sin(p1);
  const rho = p => Math.sqrt(C - 2 * n * Math.sin(p)) / n;
  const th = n * (lon * R - l0);
  return [rho(lat * R) * Math.sin(th), rho(p0) - rho(lat * R) * Math.cos(th)];
}

// Lambert azimuthal equal-area, centred wherever you like. Albers conic is right for the
// contiguous US and wrong for Peru, Japan or Alaska — it degenerates near the equator and
// distorts badly far from its standard parallels. LAEA is equal-area everywhere and needs
// only a centre, so every drilled-in region gets a projection built for that region.
// y increases northward, same convention as albers() above.
export function laea(lon0, lat0) {
  const R = Math.PI / 180, p0 = lat0 * R, l0 = lon0 * R;
  const sp0 = Math.sin(p0), cp0 = Math.cos(p0);
  return (lon, lat) => {
    const p = lat * R, dl = (lon - lon0) * R;
    const sp = Math.sin(p), cp = Math.cos(p), cd = Math.cos(dl);
    const denom = 1 + sp0 * sp + cp0 * cp * cd;
    const k = Math.sqrt(2 / (denom < 1e-9 ? 1e-9 : denom));
    return [k * cp * Math.sin(dl), k * (cp0 * sp - sp0 * cp * cd)];
  };
}

export function lonLatToSphere(lon, lat, r) {
  const p = (90 - lat) * Math.PI / 180, t = (lon + 180) * Math.PI / 180;
  return [-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)];
}

export function bboxOf(feats, project = albers) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const f of feats) for (const r of f.rings) for (const [lon, lat] of r) {
    const [x, y] = project(lon, lat);
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}

// Lon/lat bounding box of a feature's rings, for fetching DEM tiles that cover it.
export function lonLatBBox(rings) {
  let w = 1e9, s = 1e9, e = -1e9, n = -1e9;
  for (const r of rings) for (const [lo, la] of r) {
    if (lo < w) w = lo; if (lo > e) e = lo;
    if (la < s) s = la; if (la > n) n = la;
  }
  return [s, n, w, e];
}

// Rings that straddle the antimeridian (Alaska's Aleutians, Russia, Fiji) have a raw lon range
// of nearly 360°, which would ask the tile loader for the entire planet. Shifting the negative
// side by +360 turns that into the narrow span it actually is.
// The decision has to be made for the WHOLE feature, not ring by ring. Alaska's mainland ring
// sits at -168..-130 and never trips a per-ring test, while the Aleutian ring straddles 180.
// Unwrap them independently and the feature spans -168..190 — worse than before. So: if the
// feature's total span exceeds 180°, shift every negative longitude in every ring.
export function unwrapFeature(rings) {
  let lo = 1e9, hi = -1e9;
  for (const r of rings) for (const [x] of r) { if (x < lo) lo = x; if (x > hi) hi = x; }
  if (hi - lo <= 180) return rings;
  return rings.map(r => r.map(([x, y]) => [x < 0 ? x + 360 : x, y]));
}

// Bounding box with the antimeridian handled. west may come back > 180; tile x wraps.
export function lonLatBBoxUnwrapped(rings) {
  return lonLatBBox(unwrapFeature(rings));
}

// Cheap ring decimation for the terrain clip mask. A one-cell error at a coastline is
// invisible; testing every vertex of states-10m against every grid cell is not affordable.
export function decimate(rings, maxPts = 260) {
  return rings.map(r => {
    if (r.length <= maxPts) return r;
    const step = Math.ceil(r.length / maxPts), out = [];
    for (let i = 0; i < r.length; i += step) out.push(r[i]);
    if (out[out.length - 1] !== r[r.length - 1]) out.push(r[r.length - 1]);
    return out;
  });
}

// Area-weighted centroid of the largest ring — used to anchor a country's globe label.
export function biggestRing(rings) {
  let best = null, bestA = -1;
  for (const r of rings) {
    let a = 0;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1];
    a = Math.abs(a / 2);
    if (a > bestA) { bestA = a; best = r; }
  }
  return best;
}

// Point-in-polygon, so terrain can be clipped to a real state border instead of faked
// with a rectangle. Ray casting, even-odd rule.
export function inside(lon, lat, rings) {
  let n = 0;
  for (const r of rings) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j];
      if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) n++;
    }
  }
  return n % 2 === 1;
}
