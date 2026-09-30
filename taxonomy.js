// What kind of thing is this, how hard is it, and who says so.
//
// Every place in ATLAST — whether it came from OpenStreetMap, the National Park Service, the
// curated file or Vanessa's own log — is normalised into one shape by this module. That matters
// for two reasons:
//
//   1. INTERESTS are how the map gets filtered. "Show me fly fishing" has to work identically
//      over an OSM node tagged `leisure=fishing` and a curated entry for Deckers.
//   2. PROVENANCE is not decoration. A YDS class from `climbing:grade:yds` is a fact someone
//      surveyed; the same number in the curated file is a well-known figure that should still be
//      checked against 14ers.com before anyone drives to a trailhead at 3am. The UI shows which
//      is which, always.
//
// What is deliberately NOT here: popularity. "People love this" is a judgement no open dataset
// carries. Notability is approximated by whether OSM links a Wikipedia article, and that is
// labelled as notability, not love. Real ratings need Google Places and a billed API key.

/* ── interests ─────────────────────────────────────────────────────────────
   The filter vocabulary. Kept deliberately short — a filter list nobody can hold in their head
   is a filter list nobody uses. `icon` is a single glyph so the chips stay compact on a phone. */
export const INTERESTS = {
  summit:   { label: "Summits",       icon: "▲", hint: "peaks and high points" },
  scramble: { label: "Scrambles",     icon: "⋀", hint: "class 3–4 ridges and faces" },
  climb:    { label: "Climbing",      icon: "◤", hint: "roped rock, crags, alpine routes" },
  trail:    { label: "Hikes",         icon: "⋯", hint: "day hikes and backpacking" },
  water:    { label: "Water",         icon: "≈", hint: "waterfalls, alpine lakes, hot springs" },
  fish:     { label: "Fly fishing",   icon: "⌇", hint: "rivers, tailwaters, access points" },
  view:     { label: "Views",         icon: "◠", hint: "overlooks and viewpoints" },
  paddle:   { label: "Paddling",      icon: "⌁", hint: "rivers and lakes worth a boat" },
  snow:     { label: "Snow",          icon: "❋", hint: "skiing, couloirs, winter routes" },
  bike:     { label: "Riding",        icon: "◎", hint: "singletrack and gravel" },
  camp:     { label: "Camping",       icon: "△", hint: "campgrounds, huts, dispersed" },
  geology:  { label: "Geology",       icon: "◇", hint: "arches, hoodoos, volcanic, caves" },
  dark:     { label: "Dark sky",      icon: "✦", hint: "stargazing" },
  food:     { label: "Food & drink",  icon: "◉", hint: "the stop worth the detour" },
  town:     { label: "Towns",         icon: "▣", hint: "places worth basing out of" },
  history:  { label: "History",       icon: "▤", hint: "ruins, sites, ghost towns" },
};

export const INTEREST_KEYS = Object.keys(INTERESTS);

/* ── difficulty ────────────────────────────────────────────────────────────
   Yosemite Decimal System, which is what every US source she uses already speaks — travel.json
   already stores `cls` for the fourteeners, so this is an extension of her own schema rather
   than a new one. `exposure` is tracked separately because class and consequence are not the
   same thing: Capitol's Knife Edge is class 4 with lethal exposure, and plenty of class 4 is
   merely awkward. */
export const CLASSES = {
  1: { label: "Class 1", short: "walk",     note: "trail, no hands" },
  2: { label: "Class 2", short: "off-trail", note: "talus and route-finding, occasional hands" },
  3: { label: "Class 3", short: "scramble", note: "hands required, real exposure, a fall hurts" },
  4: { label: "Class 4", short: "exposed",  score: 4, note: "sustained exposure, a fall is likely fatal, some rope up" },
  5: { label: "Class 5", short: "technical", note: "roped rock climbing, graded 5.x" },
};

export const EXPOSURE = { 0: "sheltered", 1: "mild", 2: "serious", 3: "lethal" };

/**
 * OSM's SAC hiking scale → YDS class. This is the single most useful conversion in the file:
 * it is the only structured, worldwide, freely-licensed difficulty rating for trails that
 * exists, and it is tagged on a large fraction of mountain paths.
 * Reference: OSM key `sac_scale`.
 */
export const SAC_TO_CLASS = {
  hiking: 1,
  mountain_hiking: 1,
  demanding_mountain_hiking: 2,
  alpine_hiking: 2,
  demanding_alpine_hiking: 3,
  difficult_alpine_hiking: 4,
};

/** Parse "5.8", "5.10a", "4", "3+" into a class number, keeping the original string. */
export function parseGrade(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  const m = s.match(/^([1-5])(?:\.(\d+))?/);
  if (!m) return null;
  return { cls: +m[1], grade: s };
}

/* ── OSM tag → ATLAST place ────────────────────────────────────────────────
   Order matters: the first rule that matches wins, so specific beats generic. Anything that
   matches nothing is dropped rather than imported as an untyped dot — a map full of unlabelled
   pins is worse than a map with fewer. */
const RULES = [
  // summits and scrambles
  { when: t => t.natural === "peak", kind: "peak", interests: ["summit"] },
  { when: t => t.natural === "saddle", kind: "saddle", interests: ["summit"] },
  { when: t => t.natural === "arete" || t.natural === "ridge", kind: "ridge", interests: ["scramble", "summit"] },
  { when: t => t.natural === "volcano", kind: "volcano", interests: ["summit", "geology"] },

  // climbing
  { when: t => t.sport === "climbing" || t.climbing, kind: "crag", interests: ["climb"] },

  // water
  { when: t => t.waterway === "waterfall", kind: "waterfall", interests: ["water", "view"] },
  { when: t => t.natural === "hot_spring" || t.amenity === "public_bath", kind: "hot_spring", interests: ["water"] },
  { when: t => t.natural === "spring", kind: "spring", interests: ["water"] },
  { when: t => t.natural === "glacier", kind: "glacier", interests: ["snow", "view"] },
  { when: t => t.natural === "water" && t.water === "lake", kind: "lake", interests: ["water", "view"] },

  // fishing and paddling
  { when: t => t.leisure === "fishing" || t.fishing === "yes", kind: "fishing", interests: ["fish"] },
  { when: t => t.leisure === "slipway" || t.canoe === "put_in" || t.whitewater, kind: "put_in", interests: ["paddle"] },

  // views
  { when: t => t.tourism === "viewpoint", kind: "viewpoint", interests: ["view"] },
  { when: t => t.man_made === "tower" && t.tower_type === "observation", kind: "lookout", interests: ["view"] },

  // snow and bikes
  { when: t => t.landuse === "winter_sports" || t.sport === "skiing", kind: "ski", interests: ["snow"] },
  { when: t => t.route === "mtb" || t.mtb_scale !== undefined, kind: "mtb", interests: ["bike"] },

  // camping and shelter
  { when: t => t.tourism === "camp_site", kind: "campground", interests: ["camp"] },
  { when: t => t.tourism === "wilderness_hut" || t.tourism === "alpine_hut", kind: "hut", interests: ["camp"] },

  // geology and history
  { when: t => t.natural === "arch" || t.natural === "rock" || t.natural === "stone", kind: "rock", interests: ["geology", "view"] },
  { when: t => t.natural === "cave_entrance", kind: "cave", interests: ["geology"] },
  { when: t => t.historic === "ruins" || t.historic === "archaeological_site", kind: "ruins", interests: ["history"] },
  { when: t => t.historic === "mine" || t.historic === "mine_shaft", kind: "mine", interests: ["history"] },

  // food — no ratings, so these stay off by default
  { when: t => t.amenity === "restaurant" || t.amenity === "cafe" || t.amenity === "bar"
      || t.amenity === "pub" || t.craft === "brewery" || t.microbrewery === "yes",
    kind: "food", interests: ["food"] },

  // trails last, because a hiking route also matches nothing else
  { when: t => t.route === "hiking" || t.highway === "path" || t.highway === "footway",
    kind: "trail", interests: ["trail"] },
];

/**
 * Normalise one OSM element into a place, or null if it is not something worth a pin.
 * @param el Overpass element: { type, id, lat, lon, center, tags }
 */
export function fromOSM(el) {
  const t = el.tags || {};
  if (!t.name) return null;                       // an unnamed dot is noise
  const rule = RULES.find(r => { try { return r.when(t); } catch { return false; } });
  if (!rule) return null;

  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;

  const interests = new Set(rule.interests);
  // A peak with a climbing grade is a scramble, not just a summit.
  const graded = parseGrade(t["climbing:grade:yds"] || t["climbing:grade:yds:max"]);
  const sac = SAC_TO_CLASS[t.sac_scale];
  const cls = graded?.cls ?? sac ?? null;
  if (cls >= 3) interests.add("scramble");
  if (cls >= 5) interests.add("climb");
  if (t.wikipedia || t.wikidata) interests.add("view");   // notable enough to be written about

  const ft = t.ele ? Math.round(+t.ele * 3.28084) : null;

  return {
    id: `osm:${el.type}/${el.id}`,
    name: t.name,
    kind: rule.kind,
    lat, lon,
    ft: Number.isFinite(ft) ? ft : null,
    cls,
    grade: graded?.grade || t.sac_scale || null,
    interests: [...interests],
    // Notability, NOT popularity. Says "somebody wrote an encyclopedia article", which is the
    // closest thing to a signal an open dataset gives us.
    notable: !!(t.wikipedia || t.wikidata),
    src: "osm",
    links: [
      { label: "OpenStreetMap", url: `https://www.openstreetmap.org/${el.type}/${el.id}` },
      ...(t.wikipedia
        ? [{ label: "Wikipedia", url: `https://en.wikipedia.org/wiki/${encodeURIComponent(t.wikipedia.replace(/^\w+:/, ""))}` }]
        : []),
      ...(t.website ? [{ label: "Website", url: t.website }] : []),
    ],
  };
}

/** Which Overpass tag filters to ask for, per interest. Keeps queries as small as possible. */
export const OVERPASS_FILTERS = {
  summit:   ['["natural"="peak"]', '["natural"="volcano"]'],
  scramble: ['["natural"="arete"]', '["sac_scale"~"alpine_hiking|difficult"]'],
  climb:    ['["sport"="climbing"]'],
  trail:    ['["route"="hiking"]'],
  water:    ['["waterway"="waterfall"]', '["natural"="hot_spring"]', '["natural"="glacier"]'],
  fish:     ['["leisure"="fishing"]'],
  view:     ['["tourism"="viewpoint"]'],
  paddle:   ['["whitewater"]', '["canoe"="put_in"]'],
  snow:     ['["landuse"="winter_sports"]'],
  bike:     ['["route"="mtb"]'],
  camp:     ['["tourism"="camp_site"]', '["tourism"="wilderness_hut"]', '["tourism"="alpine_hut"]'],
  geology:  ['["natural"="arch"]', '["natural"="cave_entrance"]'],
  dark:     [],                                   // no OSM tag for this; curated only
  food:     ['["amenity"="restaurant"]', '["craft"="brewery"]'],
  town:     [],                                   // her own list, not OSM's
  history:  ['["historic"="ruins"]', '["historic"="archaeological_site"]'],
};

/** Defaults: the outdoor stuff on, the noisy stuff off. */
export const DEFAULT_INTERESTS = ["summit", "scramble", "trail", "water", "view", "fish"];
