// The curated layer — editorial judgement, not harvested data.
//
// THE RULE THAT MAKES THIS FILE SAFE: entries carry *what a thing is and how hard it is*, and
// never coordinates, mileage or gain. Those come from sources that actually surveyed them:
//   anchor "ft:Capitol Peak"   → the exact lat/lon already in travel.json's fourteeners
//   anchor "park:Zion"         → the coordinates already in parks.js
//   anchor "osm:Angels Landing" → resolved live from OpenStreetMap, then cached
// So there is no number in here I could have got wrong from memory. The class ratings are the
// standard, widely-published YDS figures, and every entry links to the source that owns the
// real detail — 14ers.com, the NPS, Mountain Project — because those pages change and a copy
// of them in this repo would go stale and start lying.
//
// `verify: true` means "well known, but read the link before you drive to a trailhead at 3am."
//
// Why curated at all, when OSM covers the world? Because OSM knows Kelso Ridge exists and has
// no opinion about whether it is worth your Saturday. This file is the opinion.

export const GEMS = [
  /* ── Colorado · ridge traverses and scrambles ─────────────────────────── */
  { id: "g:kelso", name: "Kelso Ridge", kind: "ridge", region: "CO",
    interests: ["scramble", "summit"], cls: 3, exposure: 2, anchor: "ft:Torreys Peak",
    why: "The classic Front Range ridge scramble, and the standard first step past class 2. Finishes on a knife-edge into the Torreys summit.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/route.php?route=torr2" }], verify: true },

  { id: "g:knifeedge", name: "Capitol Peak · Knife Edge", kind: "ridge", region: "CO",
    interests: ["scramble", "summit"], cls: 4, exposure: 3, anchor: "ft:Capitol Peak",
    why: "The one everyone means when they say knife edge. Class 4 with genuinely lethal exposure on both sides — Capitol is widely called Colorado's hardest standard fourteener route.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_capitol.html" }], verify: true },

  { id: "g:bellstraverse", name: "Maroon Bells Traverse", kind: "ridge", region: "CO",
    interests: ["scramble", "climb", "summit"], cls: 5, exposure: 3, anchor: "ft:Maroon Peak",
    why: "Maroon Peak to North Maroon along the connecting ridge. One of Colorado's four great fourteener traverses and low fifth class on rotten rock.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_maroon.html" }], verify: true },

  { id: "g:crestonetraverse", name: "Crestone Traverse", kind: "ridge", region: "CO",
    interests: ["scramble", "climb", "summit"], cls: 5, exposure: 3, anchor: "ft:Crestone Peak",
    why: "Crestone Peak to Crestone Needle on superb conglomerate — the one traverse people describe as fun rather than survived.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_crestonepk.html" }], verify: true },

  { id: "g:littlebear", name: "Little Bear – Blanca Traverse", kind: "ridge", region: "CO",
    interests: ["scramble", "climb", "summit"], cls: 5, exposure: 3, anchor: "ft:Little Bear Peak",
    why: "Widely regarded as the most dangerous ridge in the state. Loose, exposed, committing, and no easy retreat once you are on it.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_littlebear.html" }], verify: true },

  { id: "g:eldiente", name: "El Diente – Mount Wilson Traverse", kind: "ridge", region: "CO",
    interests: ["scramble", "summit"], cls: 4, exposure: 3, anchor: "ft:El Diente Peak",
    why: "The San Juan entry in the big-four traverses. Sustained class 4 on notoriously loose rock.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_eldiente.html" }], verify: true },

  { id: "g:arapaho", name: "Arapaho Traverse", kind: "ridge", region: "CO",
    interests: ["scramble", "summit"], cls: 4, exposure: 2, anchor: "osm:North Arapaho Peak",
    why: "The classic Indian Peaks scramble — South to North Arapaho, class 3 to 4 with a snowfield crossing, and close enough to Boulder to do before work if you are unwell.",
    links: [{ label: "Summitpost", url: "https://www.summitpost.org/arapaho-peaks-traverse/159881" }], verify: true },

  { id: "g:loneeagle", name: "Lone Eagle Peak", kind: "peak", region: "CO",
    interests: ["scramble", "climb", "view"], cls: 5, exposure: 3, anchor: "osm:Lone Eagle Peak",
    why: "The most photographed rock in the Indian Peaks. The view from Crater Lake is the reason people carry a camera; the knife-edge south ridge is the reason they carry a rope.",
    links: [{ label: "Mountain Project", url: "https://www.mountainproject.com/area/105744966/lone-eagle-peak" }], verify: true },

  { id: "g:decalibron", name: "DeCaLiBron Loop", kind: "loop", region: "CO",
    interests: ["summit", "trail"], cls: 2, exposure: 1, anchor: "ft:Mt. Democrat",
    why: "Democrat, Cameron, Lincoln and Bross — four fourteeners in one loop, the highest count per mile in the state. Check current access; the private-land status has changed more than once.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_democrat.html" }], verify: true },

  { id: "g:graystorreys", name: "Grays & Torreys", kind: "loop", region: "CO",
    interests: ["summit", "trail"], cls: 2, exposure: 1, anchor: "ft:Grays Peak",
    why: "Two fourteeners in a day on a class 2 trail, or one of them by Kelso Ridge if you want hands on rock. The obvious first pair.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_grays.html" }], verify: true },

  { id: "g:longskeyhole", name: "Longs Peak · Keyhole Route", kind: "route", region: "CO",
    interests: ["summit", "scramble"], cls: 3, exposure: 3, anchor: "ft:Longs Peak",
    why: "The Ledges, the Trough, the Narrows, the Homestretch. A long day with an alpine start and the most consequential class 3 in Rocky Mountain National Park.",
    links: [{ label: "NPS", url: "https://www.nps.gov/romo/planyourvisit/longspeak.htm" }], verify: true },

  { id: "g:wetterhorn", name: "Wetterhorn Peak", kind: "peak", region: "CO",
    interests: ["scramble", "summit"], cls: 3, exposure: 2, anchor: "ft:Wetterhorn Peak",
    why: "Often called the best class 3 summit block in Colorado — solid rock, short crux, enormous San Juan views.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_wetterhorn.html" }], verify: true },

  { id: "g:sneffels", name: "Mount Sneffels", kind: "peak", region: "CO",
    interests: ["scramble", "summit", "view"], cls: 3, exposure: 2, anchor: "ft:Mt. Sneffels",
    why: "The peak on the Colorado quarter. Short, steep, and the approach through Yankee Boy Basin is worth the drive on its own in July.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_sneffels.html" }], verify: true },

  /* ── Colorado · water, basins and the non-summit days ─────────────────── */
  { id: "g:iceklakes", name: "Ice Lakes Basin", kind: "trail", region: "CO",
    interests: ["trail", "water", "view"], cls: 1, exposure: 0, anchor: "osm:Ice Lake",
    why: "The bluest water in the state, and not subtly so. Steep, popular, and worth every switchback.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/recarea/sanjuan/recarea/?recid=42849" }], verify: true },

  { id: "g:conundrum", name: "Conundrum Hot Springs", kind: "hot_spring", region: "CO",
    interests: ["water", "camp", "trail"], cls: 1, exposure: 0, anchor: "osm:Conundrum Hot Springs",
    why: "A long walk in to a hot pool at 11,000 ft. Permits are required and limited — plan this one months out.",
    links: [{ label: "USFS permits", url: "https://www.fs.usda.gov/recarea/whiteriver/recarea/?recid=40865" }], verify: true },

  { id: "g:chicagobasin", name: "Chicago Basin", kind: "trail", region: "CO",
    interests: ["summit", "camp", "trail"], cls: 2, exposure: 1, anchor: "ft:Windom Peak",
    why: "Three fourteeners you reach by riding a narrow-gauge steam train and then walking. The most unusual approach in the state.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/14ers_routes_windom.html" }], verify: true },

  { id: "g:skypond", name: "Sky Pond", kind: "trail", region: "CO",
    interests: ["trail", "water", "view"], cls: 2, exposure: 1, anchor: "park:Rocky Mountain",
    why: "You climb a waterfall to get there. Timberline Falls guards the last stretch and turns a hike into a light scramble.",
    links: [{ label: "NPS", url: "https://www.nps.gov/romo/planyourvisit/glacier_gorge_trailhead.htm" }], verify: true },

  { id: "g:hanginglake", name: "Hanging Lake", kind: "trail", region: "CO",
    interests: ["trail", "water", "view"], cls: 1, exposure: 1, anchor: "osm:Hanging Lake",
    why: "A travertine shelf of impossibly green water above Glenwood Canyon. Permit and shuttle required, and numbers are capped.",
    links: [{ label: "Permits", url: "https://www.visitglenwood.com/hanginglake/" }], verify: true },

  /* ── Colorado · fly fishing ───────────────────────────────────────────── */
  { id: "g:deckers", name: "Deckers · South Platte", kind: "fishing", region: "CO",
    interests: ["fish"], anchor: "osm:Deckers",
    why: "The tailwater everyone on the Front Range learns on. Fishes year-round, an hour from Highlands Ranch, and forgiving enough to actually catch something.",
    links: [{ label: "CPW", url: "https://cpw.state.co.us/thingstodo/Pages/Fishing.aspx" }], verify: true },

  { id: "g:dreamstream", name: "Dream Stream", kind: "fishing", region: "CO",
    interests: ["fish"], anchor: "osm:Spinney Mountain Reservoir",
    why: "The stretch between Spinney and Elevenmile. Big fish move up out of the reservoir in spring and autumn; wide open, windy, and technical.",
    links: [{ label: "CPW", url: "https://cpw.state.co.us/placestogo/parks/ElevenMile" }], verify: true },

  { id: "g:fryingpan", name: "Frying Pan River", kind: "fishing", region: "CO",
    interests: ["fish"], anchor: "osm:Fryingpan River",
    why: "Gold Medal tailwater below Ruedi. Famous for outsized rainbows and for being technical enough to humble people.",
    links: [{ label: "CPW", url: "https://cpw.state.co.us/thingstodo/Pages/Fishing.aspx" }], verify: true },

  { id: "g:taylor", name: "Taylor River tailwater", kind: "fishing", region: "CO",
    interests: ["fish"], anchor: "osm:Taylor River",
    why: "The catch-and-release stretch below Taylor Park Reservoir holds notoriously large and notoriously educated trout.",
    links: [{ label: "CPW", url: "https://cpw.state.co.us/thingstodo/Pages/Fishing.aspx" }], verify: true },

  { id: "g:roaringfork", name: "Roaring Fork", kind: "fishing", region: "CO",
    interests: ["fish", "paddle"], anchor: "osm:Roaring Fork River",
    why: "Gold Medal water through Basalt and Carbondale, floatable and wadeable, and it pairs with everything else in the Elks.",
    links: [{ label: "CPW", url: "https://cpw.state.co.us/thingstodo/Pages/Fishing.aspx" }], verify: true },

  /* ── Colorado · towns worth basing out of ─────────────────────────────── */
  { id: "g:crestone", name: "Crestone", kind: "town", region: "CO",
    interests: ["town", "summit", "dark"], anchor: "osm:Crestone",
    why: "A few hundred people at the foot of the Sangres, surrounded by retreat centres and some of the best rock in the state. Dark skies, no crowds, and the Crestones straight out the back.",
    links: [{ label: "Town", url: "https://www.townofcrestone.colorado.gov/" }], verify: true },

  { id: "g:ouray", name: "Ouray", kind: "town", region: "CO",
    interests: ["town", "climb", "water", "snow"], anchor: "osm:Ouray",
    why: "Hot springs in town, the Ice Park in winter, Yankee Boy and Sneffels above it. Hard to beat as a single base for a week.",
    links: [{ label: "Ice Park", url: "https://ourayicepark.com/" }], verify: true },

  { id: "g:salida", name: "Salida", kind: "town", region: "CO",
    interests: ["town", "paddle", "fish", "bike"], anchor: "osm:Salida",
    why: "The Arkansas runs through the middle of it, the Collegiates are twenty minutes away, and it is warmer and cheaper than anywhere with a ski resort.",
    links: [{ label: "Town", url: "https://cityofsalida.com/" }], verify: true },

  { id: "g:lakecity", name: "Lake City", kind: "town", region: "CO",
    interests: ["town", "summit", "history"], anchor: "osm:Lake City",
    why: "The quiet end of the San Juans. Handies, Wetterhorn and Uncompahgre from one small town, plus the Alpine Loop for anything with clearance.",
    links: [{ label: "Alpine Loop", url: "https://www.blm.gov/visit/alpine-loop-back-country-byway" }], verify: true },

  /* ── The national park classics she named, and their neighbours ───────── */
  { id: "g:angels", name: "Angels Landing", kind: "route", region: "UT", park: "Zion",
    interests: ["trail", "view", "scramble"], cls: 1, exposure: 3, anchor: "osm:Angels Landing",
    why: "Chains along a fin with a thousand feet of air either side. Class 1 by the numbers and terrifying in practice. Permit required by lottery.",
    links: [{ label: "NPS permits", url: "https://www.nps.gov/zion/planyourvisit/angels-landing-hiking-permit.htm" }], verify: true },

  { id: "g:narrows", name: "The Narrows", kind: "route", region: "UT", park: "Zion",
    interests: ["trail", "water", "geology"], cls: 1, exposure: 1, anchor: "osm:The Narrows",
    why: "You walk up the river because there is no bank left. Check the flash-flood forecast before anything else.",
    links: [{ label: "NPS", url: "https://www.nps.gov/zion/planyourvisit/thenarrows.htm" }], verify: true },

  { id: "g:halfdome", name: "Half Dome · Cables", kind: "route", region: "CA", park: "Yosemite",
    interests: ["summit", "trail", "view"], cls: 1, exposure: 3, anchor: "osm:Half Dome",
    why: "The last stretch is two steel cables up bare granite. Permit by lottery, and the cables are only up part of the year.",
    links: [{ label: "NPS permits", url: "https://www.nps.gov/yose/planyourvisit/hdpermits.htm" }], verify: true },

  { id: "g:mist", name: "Mist Trail", kind: "trail", region: "CA", park: "Yosemite",
    interests: ["trail", "water", "view"], cls: 1, exposure: 1, anchor: "park:Yosemite",
    why: "Vernal and Nevada Falls by the stairs that get you soaked. The best short day in the valley.",
    links: [{ label: "NPS", url: "https://www.nps.gov/yose/planyourvisit/vernalnevadafalls.htm" }], verify: true },

  { id: "g:cathedrallakes", name: "Cathedral Lakes", kind: "trail", region: "CA", park: "Yosemite",
    interests: ["trail", "water", "view"], cls: 1, exposure: 0, anchor: "park:Yosemite",
    why: "Tuolumne at its best, with Cathedral Peak reflected in the upper lake. Only open once Tioga Road is.",
    links: [{ label: "NPS", url: "https://www.nps.gov/yose/planyourvisit/tuolumnehikes.htm" }], verify: true },

  { id: "g:delicate", name: "Delicate Arch", kind: "trail", region: "UT", park: "Arches",
    interests: ["trail", "geology", "view"], cls: 1, exposure: 1, anchor: "osm:Delicate Arch",
    why: "The one on the licence plate. Go at sunrise unless you enjoy queuing on slickrock.",
    links: [{ label: "NPS", url: "https://www.nps.gov/arch/planyourvisit/delicatearch.htm" }], verify: true },

  { id: "g:druid", name: "Druid Arch", kind: "trail", region: "UT", park: "Canyonlands",
    interests: ["trail", "geology", "view"], cls: 2, exposure: 1, anchor: "park:Canyonlands",
    why: "The Needles district's payoff — a long walk up Elephant Canyon with a ladder near the top and almost nobody there.",
    links: [{ label: "NPS", url: "https://www.nps.gov/cany/planyourvisit/needleshikes.htm" }], verify: true },

  { id: "g:grandteton", name: "Grand Teton · Upper Exum", kind: "route", region: "WY", park: "Grand Teton",
    interests: ["climb", "summit", "scramble"], cls: 5, exposure: 3, anchor: "osm:Grand Teton",
    why: "The most famous moderate alpine rock route in the country. Guided parties do it in a day from the Lower Saddle.",
    links: [{ label: "NPS climbing", url: "https://www.nps.gov/grte/planyourvisit/climbing.htm" }], verify: true },

  { id: "g:highline", name: "Highline Trail", kind: "trail", region: "MT", park: "Glacier",
    interests: ["trail", "view"], cls: 1, exposure: 2, anchor: "park:Glacier",
    why: "A ledge cut into the Garden Wall with a hand cable at the start. Only reachable while Going-to-the-Sun Road is open.",
    links: [{ label: "NPS", url: "https://www.nps.gov/glac/planyourvisit/hiking-logan-pass.htm" }], verify: true },

  { id: "g:kalalau", name: "Kalalau Trail", kind: "trail", region: "HI",
    interests: ["trail", "view", "camp", "water"], cls: 2, exposure: 3, anchor: "osm:Kalalau Trail",
    why: "The Na Pali coast on foot. Permits are scarce, the exposure is real, and there is nothing else like it in the United States.",
    links: [{ label: "Permits", url: "https://camping.ehawaii.gov/camping/welcome.html" }], verify: true },

  { id: "g:harding", name: "Harding Icefield Trail", kind: "trail", region: "AK", park: "Kenai Fjords",
    interests: ["trail", "view", "snow"], cls: 1, exposure: 1, anchor: "park:Kenai Fjords",
    why: "Climbs out of the valley until the horizon is nothing but ice. One of the few places you can walk to a view of an icefield.",
    links: [{ label: "NPS", url: "https://www.nps.gov/kefj/planyourvisit/harding-icefield-trail.htm" }], verify: true },
];

/* Index for the resolver: GEMS reference places that already have coordinates, so nothing in
   this file needs a lat/lon of its own. See resolveAnchor() in places.js. */
export const GEMS_BY_REGION = GEMS.reduce((m, g) => {
  (m[g.region] ||= []).push(g);
  return m;
}, {});
