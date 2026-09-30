// ROUTES — the thing ATLAST needed to become a route creator, finder and logger.
//
// A route is not a point with extra fields. It has direction, a shape (loop / point-to-point /
// out-and-back), an ordered sequence of waypoints, a night count, and logistics that decide
// whether a trip is even possible — which permit system, which season, which shuttle. Those are
// the facts that actually kill or green-light a plan, so they are structured fields, not prose.
//
// THREE JOBS THIS DATA SERVES
//   FIND   filter by interest, class, exposure, nights, permit type and season. "What can I do
//          in October, no permit, two nights, class 2 or under" is the real planning question.
//   CREATE her own routes: pick waypoints in order on the map, name it, save. Same shape as
//          these, with src:"user". travel.json's existing `routes` (the drives) migrate in as
//          kind:"drive" — they were already a name plus an ordered point list.
//   LOG    mark done with a date, which nights, what actually happened. A logged route is
//          coverage, the same way a summited fourteener is.
//
// THE RULE, AGAIN: no mileage, no gain, no elevation, no inter-camp distances, no prices, no
// closure dates. Waypoints are NAMES ONLY — coordinates resolve from OSM at load, because a
// trailhead coordinate I typed from memory is how someone ends up at the wrong side of a range.
// `nights` is a trip-shape fact multiple sources agreed on, not a measurement.
//
// exposure  0 sheltered · 1 mild · 2 serious · 3 lethal
// cls       YDS 1–5 where widely published, else null
// inferred  which fields were read between the lines rather than stated

export const ROUTE_BATCHES = [
  { id: "2026-08-24-routes", date: "2026-08-24",
    regions: ["CO", "WA", "OR", "ID", "MT", "WY", "CA", "NV", "UT", "AZ", "NM"],
    note: "First routes pass. Three parallel agents. 55 routes." },
];

// Permit systems, ranked by how badly they can end a plan. The UI sorts by this, because
// "lottery" and "walk up and sign the box" are not the same kind of obstacle at all.
export const PERMIT_TIERS = {
  none: { rank: 0, label: "No permit", note: "go when you like" },
  "self-issue": { rank: 1, label: "Self-issue", note: "sign the box at the trailhead" },
  registration: { rank: 2, label: "Free registration", note: "mandatory but not rationed" },
  reservation: { rank: 3, label: "Reservation", note: "book ahead, first come" },
  quota: { rank: 4, label: "Quota", note: "capped daily, book the moment it opens" },
  lottery: { rank: 5, label: "Lottery", note: "plan the year around the draw" },
  tribal: { rank: 6, label: "Tribal booking", note: "sovereign land, their rules, one on-sale morning" },
};

export const ROUTES = [
  /* ═══ COLORADO ═══════════════════════════════════════════════════════════ */
  { id: "r:chicago-basin", name: "Chicago Basin via Needleton", region: "CO", kind: "backpack", shape: "out-and-back",
    wilderness: "Weminuche", interests: ["summit", "scramble", "camp", "water", "view", "history", "town"],
    cls: 2, exposure: 1, nights: 2, permit: false, permitTier: "none", season: "summer to early fall",
    waypoints: [{ name: "Needleton", type: "trailhead" }, { name: "Animas River suspension bridge", type: "junction" }, { name: "Chicago Basin", type: "camp" }, { name: "Twin Lakes", type: "lake" }, { name: "Windom Peak", type: "summit" }],
    why: "Reached by riding the Durango & Silverton narrow gauge train to a flag stop, then walking up Needle Creek into a basin ringed by three fourteeners. The most logistically unusual approach in Colorado, and one of the busiest basins in the Weminuche.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/route.php?route=chib1" }, { label: "San Juan Mountains Association", url: "https://sjma.org/chicago-basin-trip-planning/" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:grenadiers", name: "Grenadiers · Elk Park to Vestal Basin", region: "CO", kind: "scramble", shape: "out-and-back",
    wilderness: "Weminuche", interests: ["scramble", "climb", "summit", "camp", "geology", "view"],
    cls: 3, exposure: 2, nights: 2, permit: false, permitTier: "none", season: "summer to early fall",
    waypoints: [{ name: "Elk Park", type: "trailhead" }, { name: "Elk Creek beaver ponds", type: "junction" }, { name: "Vestal Basin", type: "camp" }, { name: "Wham Ridge", type: "summit" }, { name: "Arrow Peak", type: "summit" }],
    why: "Access is by train or a steep Colorado Trail descent to Elk Park, then an unmaintained social trail up Vestal Creek into a basin of hard quartzite slabs. Everything past the beaver ponds is off-trail route-finding.",
    links: [{ label: "SummitPost", url: "https://www.summitpost.org/grenadier-range/751236" }, { label: "Backcountry Post", url: "https://backcountrypost.com/threads/weminuche-off-trail-from-elk-park-to-needleton-2023-via-vestal-balsam-noname-and-ruby.11044/" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:highland-mary", name: "Highland Mary Lakes – CDT Loop", region: "CO", kind: "backpack", shape: "loop",
    wilderness: "Weminuche", interests: ["water", "fish", "view", "camp", "trail"],
    cls: 1, exposure: 1, nights: 1, permit: false, permitTier: "none", season: "summer to early fall",
    waypoints: [{ name: "Highland Mary Lakes Trailhead", type: "trailhead" }, { name: "Highland Mary Lakes", type: "lake" }, { name: "Verde Lakes", type: "lake" }, { name: "Continental Divide Trail junction", type: "junction" }, { name: "Cunningham Gulch Trail", type: "junction" }],
    why: "A treeless subalpine bench above Cunningham Gulch that puts you in high Weminuche tundra almost immediately, with a loop closed by the CDT. The Forest Service is blunt that it is heavily used and not a place for solitude.",
    links: [{ label: "USFS San Juan NF", url: "https://www.fs.usda.gov/r02/sanjuan/recreation/trails/highland-mary-lakes-trail" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:missouri-fancy", name: "Missouri Lakes – Fancy Pass Loop", region: "CO", kind: "backpack", shape: "loop",
    wilderness: "Holy Cross", interests: ["water", "view", "camp", "trail", "fish"],
    cls: 2, exposure: 2, nights: 2, permit: true, permitTier: "self-issue", season: "summer to early fall",
    waypoints: [{ name: "Missouri Lakes Trailhead", type: "trailhead" }, { name: "Missouri Lakes", type: "lake" }, { name: "Missouri Pass", type: "pass" }, { name: "Treasure Vault Lake", type: "lake" }, { name: "Fancy Pass", type: "pass" }, { name: "Fancy Lake", type: "lake" }],
    why: "Two above-treeline passes link the Missouri Creek and Fancy Creek basins past a chain of lakes and tarns — the signature Holy Cross backpack. Both passes are high enough that you want to be over them before afternoon storms build.",
    links: [{ label: "Colorado Mountain Club", url: "https://www.cmc.org/education-adventure/trips/routes-places/bpx-routes-places/bpx-3-day-loop-fancy-treasure-vault-missouri-lakes-holy-cross-wilderness" }, { label: "ProTrails", url: "http://www.protrails.com/trail/719/summit-county-eagle-county-clear-creek-county-missouri-pass-fancy-pass-loop" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:halo-ridge", name: "Mount of the Holy Cross via Halo Ridge", region: "CO", kind: "traverse", shape: "loop",
    wilderness: "Holy Cross", interests: ["summit", "scramble", "view", "history", "camp"],
    cls: 2, exposure: 2, nights: 1, permit: true, permitTier: "self-issue", season: "summer to early fall",
    waypoints: [{ name: "Half Moon Trailhead", type: "trailhead" }, { name: "Notch Mountain Shelter", type: "junction" }, { name: "Bowl of Tears", type: "lake" }, { name: "Mount of the Holy Cross", type: "summit" }, { name: "Halfmoon Pass", type: "pass" }, { name: "East Cross Creek", type: "camp" }],
    why: "Instead of the standard north ridge, Halo Ridge arcs around the Bowl of Tears over several thirteeners, passing the stone shelter where pilgrims came to view the Cross Couloir. Sustained above-treeline class 2 with a long committing ridge and no quick bail.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/route.php?route=holy3" }],
    hidden: true, inferred: ["exposure", "nights", "season"] },

  { id: "r:seven-sisters", name: "Seven Sisters Lakes via Fall Creek Pass", region: "CO", kind: "backpack", shape: "point-to-point",
    wilderness: "Holy Cross", interests: ["water", "view", "camp", "fish", "trail"],
    cls: 1, exposure: 2, nights: 2, permit: true, permitTier: "self-issue", season: "summer to early fall",
    waypoints: [{ name: "Fall Creek Trailhead", type: "trailhead" }, { name: "Lake Constantine", type: "lake" }, { name: "Fall Creek Pass", type: "pass" }, { name: "Seven Sisters Lakes", type: "lake" }, { name: "Hunky Dory Lake", type: "lake" }, { name: "Holy Cross City", type: "junction" }],
    why: "Climbs past Lake Constantine to a high pass, then drops onto a staircase of small rocky lakes tucked between Whitney Peak and Holy Cross. The quiet alternative to the Halo Ridge crowds on the same massif.",
    links: [{ label: "Backpacker", url: "https://www.backpacker.com/stories/colorado-s-heavenly-holy-cross-wilderness/" }, { label: "USFS White River NF", url: "https://www.fs.usda.gov/r02/whiteriver/recreation/fall-creek-th-2001" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:four-pass", name: "Four Pass Loop", region: "CO", kind: "backpack", shape: "loop",
    wilderness: "Maroon Bells-Snowmass", interests: ["view", "water", "camp", "trail", "summit"],
    cls: 2, exposure: 2, nights: 3, permit: true, permitTier: "quota", season: "midsummer to early fall",
    waypoints: [{ name: "Maroon Lake Trailhead", type: "trailhead" }, { name: "Crater Lake", type: "camp" }, { name: "West Maroon Pass", type: "pass" }, { name: "Frigid Air Pass", type: "pass" }, { name: "Trail Rider Pass", type: "pass" }, { name: "Snowmass Lake", type: "lake" }, { name: "Buckskin Pass", type: "pass" }],
    why: "Four passes above twelve thousand feet circle the Maroon Bells and Snowmass Mountain — the best-known multi-day loop in the state. Zone reservations fix your itinerary, and bear canisters plus WAG bags are mandatory.",
    links: [{ label: "USFS White River NF", url: "https://www.fs.usda.gov/r02/whiteriver/recreation/four-pass-loop-west-maroon-buckskin" }, { label: "Treeline Review", url: "https://www.treelinereview.com/where-to-go/four-pass-loop-backpacking-guide" }],
    hidden: false, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:ptarmigan-co", name: "Ptarmigan Peak Ridge from Silverthorne", region: "CO", kind: "traverse", shape: "out-and-back",
    wilderness: "Ptarmigan Peak", interests: ["summit", "view", "trail", "camp"],
    cls: 1, exposure: 1, nights: 1, permit: false, permitTier: "none", season: "summer to fall",
    waypoints: [{ name: "Ptarmigan Trailhead", type: "trailhead" }, { name: "Ptarmigan Peak", type: "summit" }, { name: "Ptarmigan Pass", type: "pass" }],
    why: "A steady climb out of the Blue River valley onto a broad open grassy ridge with sightlines to the Gore, Tenmile and Williams Fork ranges. Walkable rather than technical, which makes it an easy wilderness overnight straight from town.",
    links: [{ label: "ProTrails", url: "http://www.protrails.com/trail/399/summit-county-eagle-county-clear-creek-county-ptarmigan-peak" }, { label: "USFS White River NF", url: "https://www.fs.usda.gov/r02/whiteriver/recreation/ptarmigan-peak-th-35" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:pawnee-buchanan", name: "Pawnee–Buchanan Loop", region: "CO", kind: "backpack", shape: "loop",
    wilderness: "Indian Peaks", interests: ["view", "water", "camp", "trail", "fish"],
    cls: 2, exposure: 2, nights: 3, permit: true, permitTier: "quota", season: "midsummer to early fall",
    waypoints: [{ name: "Long Lake Trailhead", type: "trailhead" }, { name: "Lake Isabelle", type: "lake" }, { name: "Pawnee Pass", type: "pass" }, { name: "Crater Lake", type: "camp" }, { name: "Gourd Lake", type: "lake" }, { name: "Buchanan Pass", type: "pass" }, { name: "Red Deer Lake", type: "lake" }],
    why: "Two divide crossings string together the most scenic lake basins in the Indian Peaks — the standard multi-night circuit for Front Range backpackers. Zone quotas mean your permit dictates where you sleep each night.",
    links: [{ label: "Colorado Mountain Club", url: "https://www.cmc.org/education-adventure/trips/routes-places/bpx-4-day-pawnee-buchanan-loop-from-long-lake-th" }, { label: "Recreation.gov", url: "https://recreation.gov/permits/4675318" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:collegiate-loop", name: "Collegiate Loop", region: "CO", kind: "thru", shape: "loop",
    wilderness: "Collegiate Peaks", interests: ["view", "trail", "town", "food", "camp", "water", "summit"],
    cls: 1, exposure: 2, nights: null, permit: false, permitTier: "none", season: "midsummer to early fall",
    waypoints: [{ name: "Twin Lakes", type: "trailhead" }, { name: "Hope Pass", type: "pass" }, { name: "Cottonwood Pass", type: "pass" }, { name: "Tincup Pass", type: "pass" }, { name: "Mount Princeton Hot Springs", type: "junction" }, { name: "Monarch Pass", type: "junction" }],
    why: "Collegiate East and Collegiate West close a full circuit around the Sawatch, the west half largely above treeline and the east half lower and gentler. No advance permits, and resupply towns sit right on the route.",
    links: [{ label: "CleverHiker", url: "https://www.cleverhiker.com/backpacking/collegiate-peaks-loop-guide/" }, { label: "Colorado Trail Foundation", url: "https://coloradotrail.org/traveling-the-ct/collegiate-east-west/" }],
    hidden: true, inferred: ["cls", "exposure", "season"] },

  { id: "r:music-pass", name: "Music Pass to Sand Creek Lakes", region: "CO", kind: "backpack", shape: "out-and-back",
    park: "Great Sand Dunes National Park and Preserve", wilderness: "Sangre de Cristo",
    interests: ["water", "fish", "view", "camp", "summit", "dark"],
    cls: 1, exposure: 1, nights: 1, permit: false, permitTier: "none", season: "summer to fall",
    waypoints: [{ name: "Music Pass Trailhead", type: "trailhead" }, { name: "Music Pass", type: "pass" }, { name: "Lower Sand Creek Lake", type: "lake" }, { name: "Upper Sand Creek Lake", type: "lake" }, { name: "Marble Mountain", type: "summit" }],
    why: "A short steep climb to Music Pass opens onto the Upper Sand Creek basin, then two alpine lakes under Milwaukee Peak and the Crestones. The lakes sit inside the National Preserve where no camping reservation is needed; 2WD drivers start from the Rainbow Trail crossing.",
    links: [{ label: "NPS", url: "https://www.nps.gov/thingstodo/hike-sand-creek-lakes.htm" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:lost-creek", name: "Lost Creek Wilderness Loop", region: "CO", kind: "backpack", shape: "loop",
    wilderness: "Lost Creek", interests: ["geology", "camp", "water", "view", "trail", "dark"],
    cls: 1, exposure: 1, nights: 2, permit: false, permitTier: "none", season: "late spring to fall",
    waypoints: [{ name: "Goose Creek Trailhead", type: "trailhead" }, { name: "Hankins Pass", type: "pass" }, { name: "Lake Park", type: "camp" }, { name: "McCurdy Park", type: "camp" }, { name: "Bison Pass", type: "pass" }, { name: "Refrigerator Gulch", type: "junction" }, { name: "Wigwam Trailhead", type: "trailhead" }],
    why: "Granite domes, hoodoos and a creek that disappears underground make this the strangest-looking wilderness on the Front Range, with loops of several sizes available. Water is reliable along Lost Creek but scarce on the Goose Creek leg.",
    links: [{ label: "The Trek", url: "https://thetrek.co/lost-creek-wilderness-loop-trail-37-miles-of-secluded-colorado-backpacking/" }, { label: "USFS PSICC", url: "https://fs.usda.gov/r02/psicc/recreation/wigwam-trailhead" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:causeway-loop", name: "Devil's Causeway – Chinese Wall Loop", region: "CO", kind: "traverse", shape: "loop",
    wilderness: "Flat Tops", interests: ["view", "water", "camp", "geology", "fish", "trail"],
    cls: 2, exposure: 3, nights: 3, permit: false, permitTier: "none", season: "summer to early fall",
    waypoints: [{ name: "Stillwater Reservoir", type: "trailhead" }, { name: "Devil's Causeway", type: "pass" }, { name: "Lost Lakes", type: "lake" }, { name: "Chinese Wall", type: "junction" }],
    why: "The Causeway narrows to a few feet wide with cliffs and long talus falling away both sides, then the loop runs the Chinese Wall escarpment past the Lost Lakes. Much of it is open tundra with faint or unmarked tread.",
    links: [{ label: "Colorado Mountain Club", url: "https://www.cmc.org/education-adventure/trips/routes-places/bpx-routes-places/bpx-4-day-chinese-wall-devils-causeway-loop-from-stillwater-reservoir" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:zirkel-circle", name: "Mount Zirkel Circle", region: "CO", kind: "backpack", shape: "loop",
    wilderness: "Mount Zirkel", interests: ["water", "view", "camp", "fish", "trail", "summit"],
    cls: 1, exposure: 1, nights: 1, permit: false, permitTier: "none", season: "summer to early fall",
    waypoints: [{ name: "Slavonia Trailhead", type: "trailhead" }, { name: "Gilpin Lake", type: "lake" }, { name: "Gilpin Lake saddle", type: "pass" }, { name: "Gold Creek Lake", type: "lake" }, { name: "Mount Zirkel", type: "summit" }],
    why: "Gilpin Lake and Gold Creek Lake trails join into a compact loop from Slavonia with wildflower meadows and two lakes below the Divide north of Steamboat. Direction changes the climb profile considerably, and Zirkel itself can be added from the high saddle.",
    links: [{ label: "Colorado Mountain Club", url: "https://www.cmc.org/education-adventure/trips/find-trips/backpack-2013-zirkel-circle-via-slavonia-trailhead" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  { id: "r:ct-seg24", name: "Colorado Trail Segment 24 · Molas to Stony Pass", region: "CO", kind: "thru", shape: "point-to-point",
    wilderness: "Weminuche", interests: ["view", "trail", "camp", "water", "town"],
    cls: 1, exposure: 2, nights: 1, permit: false, permitTier: "none", season: "midsummer to early fall",
    waypoints: [{ name: "Molas Trail Trailhead", type: "trailhead" }, { name: "Animas River", type: "junction" }, { name: "Elk Park", type: "junction" }, { name: "Elk Creek", type: "junction" }, { name: "Stony Pass", type: "pass" }],
    why: "Widely called the best standalone segment of the Colorado Trail, sharing tread with the CDT up Elk Creek canyon and running mostly above treeline along the divide. Stony Pass needs a 4x4 for a shuttle, and avalanche debris has obstructed parts of the corridor.",
    links: [{ label: "Colorado Trail Foundation", url: "https://coloradotrail.org/avalanche-debris-segment-24/" }],
    hidden: true, inferred: ["cls", "exposure", "nights", "season"] },

  /* ═══ WASHINGTON / OREGON ════════════════════════════════════════════════ */
  { id: "r:ptarmigan-traverse", name: "Ptarmigan Traverse", region: "WA", kind: "traverse", shape: "point-to-point",
    park: "North Cascades National Park", wilderness: "Glacier Peak",
    interests: ["summit", "scramble", "climb", "snow", "view", "camp", "geology"],
    cls: null, exposure: 3, nights: 4, permit: true, permitTier: "reservation", season: "late July through September",
    waypoints: [{ name: "Cascade Pass Trailhead", type: "trailhead" }, { name: "Cache Col", type: "pass" }, { name: "Kool-Aid Lake", type: "camp" }, { name: "Spider-Formidable Col", type: "pass" }, { name: "Yang Yang Lakes", type: "lake" }, { name: "White Rock Lakes", type: "lake" }, { name: "Dome Peak", type: "summit" }, { name: "Downey Creek Trailhead", type: "trailhead" }],
    why: "This is the route people mean when they just say \"Ptarmigan\" — the benchmark North Cascades high route, Cascade Pass south over a chain of cols toward Dome Peak. It is mountaineering, not hiking: it crosses four glaciers and needs rope, crampons, axe and real crevasse-rescue competence.",
    links: [{ label: "SummitPost", url: "https://www.summitpost.org/ptarmigan-traverse/154644" }, { label: "Mountaineers", url: "https://www.mountaineers.org/activities/trip-reports/intermediate-alpine-climb-ptarmigan-traverse" }],
    hidden: true, inferred: ["nights", "exposure", "season", "permitTier"] },

  { id: "r:ptarmigan-ridge-baker", name: "Ptarmigan Ridge (Mount Baker)", region: "WA", kind: "backpack", shape: "out-and-back",
    wilderness: "Mount Baker", interests: ["trail", "view", "snow", "camp", "geology", "summit"],
    cls: null, exposure: 2, nights: 1, permit: false, permitTier: "none", season: "late July through early October",
    waypoints: [{ name: "Artist Point", type: "trailhead" }, { name: "Coleman Pinnacle", type: "summit" }, { name: "Camp Kiser", type: "camp" }, { name: "Sholes Glacier", type: "junction" }],
    why: "The third common \"Ptarmigan\" in this corner of the map, and the one most likely to cause confusion at a trailhead: a ridge walk off Artist Point with Baker one side and Shuksan the other. It reads as a hike, but the far end runs onto permanent snowfields and the Sholes Glacier, which is where hikers should stop.",
    links: [{ label: "WTA", url: "https://www.wta.org/go-hiking/hikes/ptarmigan-ridge" }, { label: "North Cascades Institute", url: "https://blog.ncascades.org/field-excursions/trail-guide-to-ptarmigan-ridge/" }],
    hidden: true, inferred: ["nights", "exposure", "season"] },

  { id: "r:wonderland", name: "Wonderland Trail", region: "WA", kind: "backpack", shape: "loop",
    park: "Mount Rainier National Park", wilderness: "Mount Rainier",
    interests: ["trail", "view", "water", "camp", "snow", "geology", "food"],
    cls: null, exposure: 1, nights: null, permit: true, permitTier: "lottery", season: "midsummer through September",
    waypoints: [{ name: "Longmire", type: "trailhead" }, { name: "Indian Bar", type: "camp" }, { name: "Summerland", type: "camp" }, { name: "Sunrise", type: "junction" }, { name: "Mystic Lake", type: "lake" }, { name: "Spray Park", type: "junction" }, { name: "Mowich Lake", type: "camp" }, { name: "Klapatche Park", type: "camp" }, { name: "Indian Henry's Hunting Ground", type: "camp" }],
    why: "The full circumnavigation of Rainier and the template every other volcano loop is measured against. The obstacle is not the terrain, it is the permit: a named camp for every night, demand vastly outstripping supply, so build several itinerary variants. Food caches at Longmire, Sunrise and Mowich are what make a low-weight trip possible.",
    links: [{ label: "Hiking Tahoma", url: "https://hikingtahoma.com/Wonderland/How.html" }, { label: "The Big Outside", url: "https://thebigoutside.com/how-to-get-a-permit-to-backpack-rainiers-wonderland-trail/" }],
    hidden: false, inferred: ["exposure", "season", "nights"] },

  { id: "r:copper-ridge", name: "Copper Ridge / Whatcom Pass Loop", region: "WA", kind: "backpack", shape: "loop",
    park: "North Cascades National Park", wilderness: "Stephen Mather",
    interests: ["trail", "view", "water", "camp", "fish", "summit"],
    cls: null, exposure: 2, nights: null, permit: true, permitTier: "reservation", season: "late July through September",
    waypoints: [{ name: "Hannegan Pass Trailhead", type: "trailhead" }, { name: "Hannegan Pass", type: "pass" }, { name: "Copper Ridge Lookout", type: "summit" }, { name: "Egg Lake", type: "lake" }, { name: "Silesia Camp", type: "camp" }, { name: "Chilliwack River cable car", type: "junction" }, { name: "Whatcom Pass", type: "pass" }, { name: "Boundary Camp", type: "camp" }],
    why: "The best all-trail backpack in North Cascades National Park: a high open ridge past a fire lookout, then a plunge into old-growth Chilliwack rainforest and a hand-hauled cable car river crossing. Camps are assigned by permit and fires are banned along the ridge.",
    links: [{ label: "WTA", url: "https://www.wta.org/go-hiking/hikes/copper-ridge-loop" }, { label: "NPS", url: "https://www.nps.gov/noca/planyourvisit/copper-ridge-trail.htm" }],
    hidden: true, inferred: ["exposure", "season", "nights"] },

  { id: "r:enchantments-thru", name: "Enchantments Thru-Hike", region: "WA", kind: "thru", shape: "point-to-point",
    wilderness: "Alpine Lakes", interests: ["trail", "view", "water", "snow", "camp", "geology", "scramble"],
    cls: null, exposure: 2, nights: 2, permit: true, permitTier: "lottery", season: "late July through early October",
    waypoints: [{ name: "Stuart Lake Trailhead", type: "trailhead" }, { name: "Colchuck Lake", type: "lake" }, { name: "Aasgard Pass", type: "pass" }, { name: "Isolation Lake", type: "lake" }, { name: "Lake Viviane", type: "lake" }, { name: "Snow Lakes", type: "lake" }, { name: "Snow Lakes Trailhead", type: "trailhead" }],
    why: "The point-to-point over Aasgard Pass through the Core Zone and down the Snow Lakes side is the way to see all of it, and why the overnight lottery is one of the hardest tickets in Washington. A day thru-hike needs no overnight permit, which is exactly why so many people grind it out in one push.",
    links: [{ label: "Northwest Portal", url: "https://www.northwestportal.com/blog/what-you-need-to-know-before-visiting-the-enchantments" }],
    hidden: false, inferred: ["nights", "exposure", "season"] },

  { id: "r:bailey-range", name: "Bailey Range Traverse", region: "WA", kind: "traverse", shape: "point-to-point",
    park: "Olympic National Park", wilderness: "Olympic",
    interests: ["scramble", "climb", "snow", "view", "summit", "camp", "water"],
    cls: null, exposure: 3, nights: 7, permit: true, permitTier: "reservation", season: "late July through early September",
    waypoints: [{ name: "Sol Duc Trailhead", type: "trailhead" }, { name: "High Divide", type: "pass" }, { name: "Cat Basin", type: "camp" }, { name: "Catwalk", type: "junction" }, { name: "Bear Pass", type: "pass" }, { name: "Dodwell-Rixon Pass", type: "pass" }, { name: "Mount Olympus", type: "summit" }, { name: "Whiskey Bend Trailhead", type: "trailhead" }],
    why: "Olympic's answer to the Ptarmigan: once you leave the High Divide the route becomes a faint boot path that repeatedly disappears, linking meadow benches, scree and the Catwalk. Most parties extend it over the Blue and Humes glaciers, which makes it roped glacier travel and a genuine mountaineering commitment.",
    links: [{ label: "WTA", url: "https://www.wta.org/go-hiking/hikes/bailey-range" }, { label: "TrailGroove", url: "https://www.trailgroove.com/blogs/entry/498-a-bailey-range-traverse-hiking-in-olympic-national-park/" }],
    hidden: true, inferred: ["nights", "exposure", "season"] },

  { id: "r:olympic-coast", name: "Olympic Wilderness Coast · South Coast Route", region: "WA", kind: "backpack", shape: "point-to-point",
    park: "Olympic National Park", wilderness: "Olympic",
    interests: ["water", "camp", "view", "geology", "history", "dark"],
    cls: null, exposure: 2, nights: null, permit: true, permitTier: "reservation", season: "year-round, best in summer",
    waypoints: [{ name: "Third Beach Trailhead", type: "trailhead" }, { name: "Toleak Point", type: "camp" }, { name: "Scott Creek", type: "camp" }, { name: "Mosquito Creek", type: "camp" }, { name: "Oil City Trailhead", type: "trailhead" }],
    why: "Wilderness beach walking where the schedule is set by the tide table rather than your legs — several headlands are impassable above low tide and the alternative is muddy rope-and-ladder overland trails. A park-approved canister is mandatory coast-wide, and the tide chart is the most important piece of gear.",
    links: [{ label: "NPS", url: "https://www.nps.gov/olym/planyourvisit/south-coast-route.htm" }, { label: "CleverHiker", url: "https://www.cleverhiker.com/backpacking/olympic-coast-backpacking-guide-olympic-national-park/" }],
    hidden: true, inferred: ["exposure", "season", "nights"] },

  { id: "r:timberline", name: "Timberline Trail", region: "OR", kind: "backpack", shape: "loop",
    wilderness: "Mount Hood", interests: ["trail", "view", "water", "camp", "geology", "snow", "town"],
    cls: null, exposure: 2, nights: 3, permit: true, permitTier: "self-issue", season: "mid-July through September",
    waypoints: [{ name: "Timberline Lodge", type: "trailhead" }, { name: "Gnarl Ridge", type: "junction" }, { name: "Cloud Cap", type: "camp" }, { name: "Eliot Branch crossing", type: "junction" }, { name: "Elk Cove", type: "camp" }, { name: "Ramona Falls", type: "junction" }, { name: "Paradise Park", type: "camp" }],
    why: "Hood's circumnavigation is the friendliest of the big volcano loops — you can start and finish at a lodge with a bar — but the glacial fords are the story. The Eliot Branch is the notorious one: no bridge, shifting banks, and water that rises through the afternoon, so cross early.",
    links: [{ label: "Halfway Anywhere", url: "https://www.halfwayanywhere.com/trails/timberline-trail/timberline-trail-hiking-guide/" }, { label: "Oregon Hikers", url: "https://www.oregonhikers.org/field_guide/timberline_trail_around_mount_hood_hike" }],
    hidden: false, inferred: ["nights", "exposure", "season"] },

  { id: "r:three-sisters", name: "Three Sisters Loop", region: "OR", kind: "backpack", shape: "loop",
    wilderness: "Three Sisters", interests: ["trail", "view", "water", "camp", "geology", "snow"],
    cls: null, exposure: 1, nights: 3, permit: true, permitTier: "reservation", season: "July through early October",
    waypoints: [{ name: "Pole Creek Trailhead", type: "trailhead" }, { name: "Green Lakes", type: "lake" }, { name: "Moraine Lake", type: "lake" }, { name: "Obsidian Falls", type: "junction" }, { name: "Chambers Lakes", type: "lake" }, { name: "Lava Camp Lake Trailhead", type: "trailhead" }],
    why: "A full circuit of North, Middle and South Sister mixing PCT tread, obsidian flows, lava fields and lake basins — the Oregon loop that best shows off Cascade volcanic geology. Permits are tied to a specific entry trailhead, and water is thin across the lava on the north side.",
    links: [{ label: "CleverHiker", url: "https://www.cleverhiker.com/backpacking/three-sisters-loop-backpacking-guide/" }, { label: "Recreation.gov", url: "https://www.recreation.gov/ticket/facility/300009" }],
    hidden: true, inferred: ["nights", "exposure", "season"] },

  { id: "r:eagle-cap", name: "Eagle Cap · Aneroid and Lakes Basin Loop", region: "OR", kind: "backpack", shape: "loop",
    wilderness: "Eagle Cap", interests: ["trail", "view", "water", "fish", "camp", "summit", "geology"],
    cls: null, exposure: 2, nights: null, permit: true, permitTier: "self-issue", season: "July through September",
    waypoints: [{ name: "Wallowa Lake Trailhead", type: "trailhead" }, { name: "Ice Lake", type: "lake" }, { name: "Aneroid Lake", type: "lake" }, { name: "Tenderfoot Pass", type: "pass" }, { name: "Glacier Lake", type: "lake" }, { name: "Mirror Lake", type: "camp" }, { name: "Eagle Cap", type: "summit" }, { name: "Horton Pass", type: "pass" }],
    why: "The Wallowas are granite and marble with a Sierra feel dropped into eastern Oregon, and this is the region's signature trip. Permits are free and self-issued, making it a rare uncrowded-by-quota option — but campfires are banned near several lakes and the basin camps are heavily impacted.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/r06/wallowa-whitman/recreation/eagle-cap-wilderness" }, { label: "CleverHiker", url: "https://www.cleverhiker.com/backpacking/wallowa-river-loop-backpacking-guide/" }],
    hidden: true, inferred: ["exposure", "season", "nights"] },

  /* ═══ IDAHO / MONTANA / WYOMING ══════════════════════════════════════════ */
  { id: "r:alice-toxaway", name: "Alice–Toxaway Loop", region: "ID", kind: "backpack", shape: "loop",
    wilderness: "Sawtooth", interests: ["trail", "view", "water", "fish", "camp", "geology"],
    cls: null, exposure: 1, nights: 2, permit: true, permitTier: "self-issue", season: "late June through September",
    waypoints: [{ name: "Tin Cup Trailhead", type: "trailhead" }, { name: "Pettit Lake", type: "lake" }, { name: "Alice Lake", type: "lake" }, { name: "Twin Lakes", type: "lake" }, { name: "Snowyside Pass", type: "pass" }, { name: "Toxaway Lake", type: "lake" }, { name: "Farley Lake", type: "lake" }],
    why: "The best short introduction to the Sawtooths, stringing Alice, Twin, Toxaway and Farley Lakes together over Snowyside Pass under classic granite spires. The free self-issue permit makes it an easy last-minute trip in a region where the big names need lotteries.",
    links: [{ label: "Two Outliers", url: "https://twooutliers.com/alice-toxaway-loop-idaho-backpacking/" }],
    hidden: true, inferred: ["nights", "exposure", "season"] },

  { id: "r:selway-bitterroot", name: "Selway–Bitterroot Divide Traverse", region: "ID", kind: "backpack", shape: "point-to-point",
    wilderness: "Selway-Bitterroot", interests: ["trail", "view", "water", "fish", "camp", "dark", "geology"],
    cls: null, exposure: 2, nights: 4, permit: false, permitTier: "none", season: "July through September",
    waypoints: [{ name: "Blodgett Canyon Trailhead", type: "trailhead" }, { name: "Blodgett Pass", type: "pass" }, { name: "Canyon Creek", type: "junction" }, { name: "Bitterroot Divide", type: "pass" }, { name: "Selway River Trail", type: "junction" }],
    why: "One of the largest wildernesses in the lower forty-eight and one of the least visited. That solitude is the hazard: many trails are in poor condition, burn scars have erased tread over large areas and deadfall is constant, so carry map, compass and GPS and plan conservative days.",
    links: [{ label: "USFS Bitterroot NF", url: "https://www.fs.usda.gov/r01/bitterroot/wilderness/selway-bitterroot-wilderness" }, { label: "TrailGroove", url: "https://www.trailgroove.com/blogs/entry/391-hiking-backpacking-the-selway-bitterroot-wilderness/" }],
    hidden: true, inferred: ["nights", "exposure", "season"] },

  { id: "r:ptarmigan-tunnel", name: "Ptarmigan Tunnel (Many Glacier)", region: "MT", kind: "backpack", shape: "out-and-back",
    park: "Glacier National Park", interests: ["trail", "view", "history", "geology", "water"],
    cls: null, exposure: 2, nights: null, permit: false, permitTier: "none", season: "mid-summer through September",
    waypoints: [{ name: "Iceberg-Ptarmigan Trailhead", type: "trailhead" }, { name: "Ptarmigan Falls", type: "junction" }, { name: "Ptarmigan Lake", type: "lake" }, { name: "Ptarmigan Tunnel", type: "pass" }, { name: "Elizabeth Lake", type: "lake" }],
    why: "Completely different animal from the Cascades traverse of the same name: a day hike out of Many Glacier to a CCC-blasted tunnel bored straight through the Ptarmigan Wall, where the view flips to the Belly River country. Steel doors are shut through the snow season, so confirm they are open.",
    links: [{ label: "NPS", url: "https://www.nps.gov/glac/planyourvisit/hikingmanyglacier.htm" }, { label: "Glacier Guides", url: "https://glacierguides.com/blog/hiking-ptarmigan-tunnel-glacier-park/" }],
    hidden: true, inferred: ["exposure", "season"] },

  { id: "r:glacier-northern", name: "Glacier Northern Traverse · Kintla to Goat Haunt", region: "MT", kind: "traverse", shape: "point-to-point",
    park: "Glacier National Park", interests: ["trail", "view", "water", "camp", "geology", "history"],
    cls: null, exposure: 3, nights: null, permit: true, permitTier: "reservation", season: "mid-summer through September",
    waypoints: [{ name: "Kintla Lake Trailhead", type: "trailhead" }, { name: "Upper Kintla Lake", type: "lake" }, { name: "Boulder Pass", type: "pass" }, { name: "Hole-in-the-Wall", type: "camp" }, { name: "Brown Pass", type: "pass" }, { name: "Goat Haunt", type: "trailhead" }],
    why: "The wildest long route in Glacier: up the Kintla lakes, over Boulder Pass to the hanging cirque camp at Hole-in-the-Wall, then down the Waterton Valley. Every night needs a named campground on a permit that cannot be changed once you start walking, and the exit involves boat logistics plus border documents.",
    links: [{ label: "NPS", url: "https://www.nps.gov/glac/planyourvisit/hikingnorthfork.htm" }, { label: "Backpacker", url: "https://www.backpacker.com/trips/glacier-national-park-kintla-lake-to-goat-haunt/" }],
    hidden: true, inferred: ["exposure", "season", "nights"] },

  { id: "r:highline-thru", name: "Highline Trail · Logan Pass to Goat Haunt", region: "MT", kind: "thru", shape: "point-to-point",
    park: "Glacier National Park", interests: ["trail", "view", "camp", "geology", "history"],
    cls: null, exposure: 3, nights: null, permit: true, permitTier: "reservation", season: "mid-summer through September",
    waypoints: [{ name: "Logan Pass", type: "trailhead" }, { name: "Garden Wall", type: "junction" }, { name: "Granite Park", type: "camp" }, { name: "Ahern Pass", type: "pass" }, { name: "Fifty Mountain", type: "camp" }, { name: "Kootenai Lake", type: "camp" }, { name: "Goat Haunt", type: "trailhead" }],
    why: "The day-hiker's Highline is the cliff-ledge traverse below the Garden Wall; the backpacker's Highline keeps going north past Ahern Pass and Fifty Mountain to Goat Haunt. Very few campgrounds across that northern stretch makes it one of the most competitive permits in the park and forces long committed days.",
    links: [{ label: "NPS", url: "https://www.nps.gov/glac/planyourvisit/hikingnorthfork.htm" }, { label: "Glacier Guides", url: "https://glacierguides.com/blog/the-highline-trail-glacier-national-park/" }],
    hidden: true, inferred: ["exposure", "season", "nights"] },

  { id: "r:beaten-path", name: "The Beaten Path · East Rosebud to Clarks Fork", region: "MT", kind: "thru", shape: "point-to-point",
    wilderness: "Absaroka-Beartooth", interests: ["trail", "view", "water", "fish", "camp", "geology", "dark"],
    cls: null, exposure: 2, nights: null, permit: false, permitTier: "none", season: "mid-July through September",
    waypoints: [{ name: "East Rosebud Trailhead", type: "trailhead" }, { name: "Elk Lake", type: "lake" }, { name: "Rainbow Lake", type: "lake" }, { name: "Dewey Lake", type: "lake" }, { name: "Fossil Lake", type: "lake" }, { name: "Russell Lake", type: "lake" }, { name: "Clarks Fork Trailhead", type: "trailhead" }],
    why: "Montana's signature thru-hike, a granite-and-water corridor across the Beartooth plateau chaining a long series of lakes under huge cliff walls. Critically, flooding destroyed large sections on the East Rosebud side and access has been unreliable since — check current Custer Gallatin status before planning anything.",
    links: [{ label: "Absaroka Beartooth Wilderness Foundation", url: "https://www.abwilderness.org/blog/alternatives-to-the-beaten-path" }, { label: "Outdoor Project", url: "https://www.outdoorproject.com/united-states/montana/beaten-path" }],
    hidden: true, inferred: ["exposure", "season", "nights"] },

  { id: "r:teton-crest", name: "Teton Crest Trail", region: "WY", kind: "thru", shape: "point-to-point",
    park: "Grand Teton National Park", wilderness: "Jedediah Smith",
    interests: ["trail", "view", "water", "camp", "snow", "geology", "summit"],
    cls: null, exposure: 2, nights: 4, permit: true, permitTier: "reservation", season: "mid-July through September",
    waypoints: [{ name: "Granite Canyon Trailhead", type: "trailhead" }, { name: "Marion Lake", type: "lake" }, { name: "Fox Creek Pass", type: "pass" }, { name: "Death Canyon Shelf", type: "camp" }, { name: "Alaska Basin", type: "camp" }, { name: "Hurricane Pass", type: "pass" }, { name: "Lake Solitude", type: "lake" }, { name: "Paintbrush Divide", type: "pass" }, { name: "String Lake Trailhead", type: "trailhead" }],
    why: "A high ridge-and-shelf traverse of the Tetons, with the Death Canyon Shelf, Hurricane Pass under the Grand and the drop from Paintbrush Divide as the set pieces. Permits release on a single winter date and the Granite-Canyon four-night itinerary is the first to sell out; Paintbrush Divide commonly holds a steep snow slope into midsummer.",
    links: [{ label: "Recreation.gov", url: "https://www.recreation.gov/permits/4675342" }, { label: "The Big Outside", url: "https://thebigoutside.com/how-to-get-a-permit-to-backpack-the-teton-crest-trail/" }],
    hidden: false, inferred: ["nights", "exposure", "season"] },

  { id: "r:wind-river-high", name: "Wind River High Route", region: "WY", kind: "traverse", shape: "point-to-point",
    wilderness: "Bridger", interests: ["scramble", "snow", "view", "water", "camp", "geology", "summit"],
    cls: 3, exposure: 3, nights: null, permit: false, permitTier: "none", season: "August through mid-September",
    waypoints: [{ name: "Green River Lakes Trailhead", type: "trailhead" }, { name: "Knapsack Col", type: "pass" }, { name: "Titcomb Basin", type: "camp" }, { name: "Indian Pass", type: "pass" }, { name: "Alpine Lakes Basin", type: "camp" }, { name: "Hay Pass", type: "pass" }, { name: "Cirque of the Towers", type: "camp" }, { name: "Big Sandy Trailhead", type: "trailhead" }],
    why: "Skurka's line is the hardest thing here that is still nominally hiking: mostly off-trail, boulder-hopping and talus-wading for days, crossing high cols and skirting small glaciers near the Divide. A gentler Dixon-Wilson variant exists, and the route touches the Wind River Indian Reservation where a separate tribal permit is required.",
    links: [{ label: "Andrew Skurka", url: "https://andrewskurka.com/adventures/wind-river-high-route/" }, { label: "Adventure Alan", url: "https://www.adventurealan.com/wind-river-high-route-guide/" }],
    hidden: true, inferred: ["cls", "exposure", "season", "nights"] },

  { id: "r:titcomb", name: "Titcomb Basin from Elkhart Park", region: "WY", kind: "backpack", shape: "out-and-back",
    wilderness: "Bridger", interests: ["trail", "view", "water", "fish", "camp", "geology", "dark", "summit"],
    cls: null, exposure: 2, nights: null, permit: false, permitTier: "none", season: "mid-July through September",
    waypoints: [{ name: "Elkhart Park Trailhead", type: "trailhead" }, { name: "Seneca Lake", type: "lake" }, { name: "Island Lake", type: "camp" }, { name: "Titcomb Lakes", type: "lake" }, { name: "Indian Pass", type: "pass" }, { name: "Knapsack Col", type: "pass" }],
    why: "The most photographed basin in the Wind Rivers and the easiest way to stand under the range's biggest walls without going off-trail. No permit or fee for small groups in the Bridger, which makes it the antidote to lottery-gated trips — and a base for Indian Pass, Knapsack Col or a Gannett attempt.",
    links: [{ label: "American Southwest", url: "https://www.americansouthwest.net/wyoming/wind-river-range/titcomb-basin.html" }],
    hidden: true, inferred: ["exposure", "season", "nights"] },

  { id: "r:cirque-towers", name: "Cirque of the Towers Loop", region: "WY", kind: "backpack", shape: "loop",
    wilderness: "Bridger", interests: ["climb", "scramble", "view", "water", "fish", "camp", "geology", "summit"],
    cls: 3, exposure: 3, nights: 2, permit: false, permitTier: "none", season: "mid-July through September",
    waypoints: [{ name: "Big Sandy Trailhead", type: "trailhead" }, { name: "Big Sandy Lake", type: "lake" }, { name: "Jackass Pass", type: "pass" }, { name: "Lonesome Lake", type: "lake" }, { name: "Pingora Peak", type: "summit" }, { name: "Texas Pass", type: "pass" }, { name: "Shadow Lake", type: "lake" }],
    why: "The most famous rock amphitheatre in Wyoming and a pilgrimage for climbers heading to Pingora and the Warbonnet. The full loop adds Texas Pass, which is off-trail talus and snow rather than a trail and should be treated as a scramble; camping pressure at Lonesome Lake means strict setbacks and food storage.",
    links: [{ label: "CleverHiker", url: "https://www.cleverhiker.com/backpacking/cirque-of-the-towers-3-day-backpacking-loop-wind-river-wy/" }],
    hidden: true, inferred: ["cls", "exposure", "season"] },

  /* ═══ CALIFORNIA / NEVADA ════════════════════════════════════════════════ */
  { id: "r:rae-lakes", name: "Rae Lakes Loop", region: "CA", kind: "backpack", shape: "loop",
    park: "Kings Canyon National Park", wilderness: "Sequoia-Kings Canyon",
    interests: ["trail", "water", "view", "fish", "camp", "geology"],
    cls: 1, exposure: 1, nights: 4, permit: true, permitTier: "quota", season: "mid-summer to early fall",
    waypoints: [{ name: "Road's End Permit Station", type: "trailhead" }, { name: "Paradise Valley", type: "camp" }, { name: "Woods Creek suspension bridge", type: "junction" }, { name: "Rae Lakes", type: "lake" }, { name: "Glen Pass", type: "pass" }, { name: "Vidette Meadow", type: "camp" }, { name: "Bubbs Creek junction", type: "junction" }],
    why: "The most efficient introduction to the granite heart of the Sierra: a closed loop that climbs a river canyon, tops a single serious pass, and drops into a chain of alpine lakes. No shuttle needed, which is a large part of why the quota is so hard to crack. Hard-sided canisters are mandatory and checked.",
    links: [{ label: "NPS", url: "https://www.nps.gov/seki/planyourvisit/wilderness_permits.htm" }, { label: "Recreation.gov", url: "https://www.recreation.gov/permits/445857" }],
    hidden: false, inferred: ["cls", "exposure", "nights"] },

  { id: "r:jmt", name: "John Muir Trail", region: "CA", kind: "thru", shape: "point-to-point",
    park: "Yosemite National Park", wilderness: "Yosemite, Ansel Adams, John Muir, Sequoia-Kings Canyon",
    interests: ["trail", "summit", "view", "water", "camp", "town", "history", "fish"],
    cls: 1, exposure: 1, nights: null, permit: true, permitTier: "lottery", season: "mid-summer through early fall",
    waypoints: [{ name: "Happy Isles", type: "trailhead" }, { name: "Donohue Pass", type: "pass" }, { name: "Reds Meadow", type: "junction" }, { name: "Muir Trail Ranch", type: "junction" }, { name: "Muir Pass", type: "pass" }, { name: "Mather Pass", type: "pass" }, { name: "Forester Pass", type: "pass" }, { name: "Guitar Lake", type: "lake" }, { name: "Mount Whitney", type: "summit" }, { name: "Whitney Portal", type: "trailhead" }],
    why: "The benchmark American thru-hike, and the one whose permit system defeats more people than its terrain does. Plan around the permit first and the itinerary second; exiting over Whitney is covered by the JMT permit rather than the separate Whitney lottery.",
    links: [{ label: "NPS Yosemite", url: "https://home.nps.gov/yose/planyourvisit/jmt.htm" }, { label: "The Big Outside", url: "https://thebigoutside.com/how-to-get-a-john-muir-trail-wilderness-permit/" }],
    hidden: false, inferred: ["cls", "exposure"] },

  { id: "r:hst", name: "High Sierra Trail", region: "CA", kind: "traverse", shape: "point-to-point",
    park: "Sequoia National Park", wilderness: "Sequoia-Kings Canyon",
    interests: ["trail", "summit", "view", "water", "camp", "geology", "fish"],
    cls: 1, exposure: 1, nights: 6, permit: true, permitTier: "quota", season: "mid-summer through early fall",
    waypoints: [{ name: "Crescent Meadow", type: "trailhead" }, { name: "Bearpaw Meadow", type: "camp" }, { name: "Hamilton Lake", type: "lake" }, { name: "Kaweah Gap", type: "pass" }, { name: "Kern Hot Spring", type: "camp" }, { name: "Crabtree Meadow", type: "camp" }, { name: "Trail Crest", type: "pass" }, { name: "Mount Whitney", type: "summit" }, { name: "Whitney Portal", type: "trailhead" }],
    why: "A west-to-east crossing that starts in the sequoias, vaults the Great Western Divide at Kaweah Gap, then drops into the Kern trench before rejoining the Muir Trail for the Whitney finish. The pacing is unusually satisfying because you gain the crest gradually, and the hot spring on the Kern is a trail institution.",
    links: [{ label: "High Sierra Trails", url: "https://www.highsierratrails.com/high_sierra_trail/hst_overview.html" }, { label: "NPS", url: "https://www.nps.gov/seki/planyourvisit/wilderness_permits.htm" }],
    hidden: true, inferred: ["cls", "exposure", "nights"] },

  { id: "r:shr", name: "Sierra High Route (Roper)", region: "CA", kind: "scramble", shape: "point-to-point",
    park: "Kings Canyon National Park", wilderness: "Sequoia-Kings Canyon, John Muir, Ansel Adams, Yosemite",
    interests: ["scramble", "view", "water", "camp", "geology", "snow", "summit"],
    cls: 3, exposure: 3, nights: null, permit: true, permitTier: "quota", season: "high summer, hiked northbound",
    waypoints: [{ name: "Road's End, Cedar Grove", type: "trailhead" }, { name: "Frozen Lake Pass", type: "pass" }, { name: "Snow-Tongue Pass", type: "pass" }, { name: "Puppet Pass", type: "pass" }, { name: "Twin Lakes, Bridgeport", type: "trailhead" }],
    why: "Roper's line deliberately refuses the trail, staying at timberline and crossing basin after basin by whatever talus, slab and snow will connect them. A large fraction is cross-country and several passes go at hard scrambling with a pack — this is for people who already navigate confidently off-trail, not a harder Muir Trail.",
    links: [{ label: "Andrew Skurka", url: "https://andrewskurka.com/adventures/sierra-high-route/" }, { label: "The Hiking Life", url: "https://thehikinglife.com/2018/03/a-quick-dirty-guide-to-the-sierra-high-route/" }],
    hidden: true, inferred: ["cls", "exposure"] },

  { id: "r:mineral-king", name: "Mineral King Loop", region: "CA", kind: "backpack", shape: "loop",
    park: "Sequoia National Park", wilderness: "Sequoia-Kings Canyon",
    interests: ["trail", "scramble", "view", "water", "fish", "camp", "geology"],
    cls: 2, exposure: 2, nights: 4, permit: true, permitTier: "quota", season: "mid-summer to early fall",
    waypoints: [{ name: "Sawtooth Pass Trailhead", type: "trailhead" }, { name: "Timber Gap", type: "pass" }, { name: "Franklin Lakes", type: "lake" }, { name: "Franklin Pass", type: "pass" }, { name: "Big Five Lakes", type: "lake" }, { name: "Black Rock Pass", type: "pass" }, { name: "Pinto Lake", type: "camp" }, { name: "Sawtooth Pass", type: "pass" }],
    why: "A dense, pass-heavy loop out of a dead-end valley that feels remote out of all proportion to how little driving it takes. Quota differs sharply by entry trailhead — Franklin carries the largest allocation and Sawtooth the smallest, so most parties enter on Franklin and exit over Sawtooth.",
    links: [{ label: "Exploring Wild", url: "https://exploringwild.com/mineral-king-loop-variations/" }, { label: "Recreation.gov", url: "https://www.recreation.gov/permits/445857" }],
    hidden: true, inferred: ["cls", "exposure", "nights"] },

  { id: "r:tuolumne-canyon", name: "Grand Canyon of the Tuolumne Traverse", region: "CA", kind: "traverse", shape: "point-to-point",
    park: "Yosemite National Park", wilderness: "Yosemite",
    interests: ["trail", "water", "view", "camp", "geology", "history"],
    cls: 1, exposure: 1, nights: 3, permit: true, permitTier: "quota", season: "early summer for falls, late summer for low water",
    waypoints: [{ name: "Tuolumne Meadows", type: "trailhead" }, { name: "Glen Aulin", type: "camp" }, { name: "Waterwheel Falls", type: "junction" }, { name: "Pate Valley", type: "camp" }, { name: "Rancheria Falls", type: "camp" }, { name: "Hetch Hetchy", type: "trailhead" }],
    why: "The grand traverse of Yosemite's other canyon, following the Tuolumne from subalpine meadow down through a gorge of cascades and polished granite into river bottom. The exit choice — climbing out to White Wolf or continuing to Hetch Hetchy — changes the last day completely.",
    links: [{ label: "NPS", url: "https://home.nps.gov/yose/planyourvisit/backpacking.htm" }, { label: "Bearfoot Theory", url: "https://bearfoottheory.com/trail-guide-backpacking-yosemite-grand-canyon-of-the-tuolumne/" }],
    hidden: true, inferred: ["cls", "exposure", "nights"] },

  { id: "r:clouds-rest", name: "Clouds Rest to Happy Isles", region: "CA", kind: "backpack", shape: "point-to-point",
    park: "Yosemite National Park", wilderness: "Yosemite",
    interests: ["summit", "view", "trail", "camp", "water", "geology"],
    cls: 1, exposure: 2, nights: 2, permit: true, permitTier: "quota", season: "summer into early fall",
    waypoints: [{ name: "Sunrise Lakes Trailhead", type: "trailhead" }, { name: "Sunrise Lakes", type: "lake" }, { name: "Clouds Rest", type: "summit" }, { name: "Half Dome Trail junction", type: "junction" }, { name: "Little Yosemite Valley", type: "camp" }, { name: "Happy Isles", type: "trailhead" }],
    why: "The best view-to-effort trade in Yosemite and a better summit than the crowded dome across the valley — the final ridge is a narrowing granite fin with the whole range behind it. Run downhill from Tioga Road and it becomes a short, high-reward overnight; Half Dome can be added when the wilderness permit is collected.",
    links: [{ label: "Recreation.gov", url: "https://www.recreation.gov/permits/445859" }, { label: "NPS", url: "https://home.nps.gov/yose/planyourvisit/backpacking.htm" }],
    hidden: true, inferred: ["cls", "exposure", "nights"] },

  { id: "r:lost-coast", name: "Lost Coast Trail (King Range)", region: "CA", kind: "backpack", shape: "point-to-point",
    wilderness: "King Range", interests: ["water", "view", "camp", "geology", "history", "dark"],
    cls: null, exposure: 2, nights: 3, permit: true, permitTier: "reservation", season: "governed by the tide window, not the calendar",
    waypoints: [{ name: "Mattole Beach", type: "trailhead" }, { name: "Punta Gorda Lighthouse", type: "junction" }, { name: "Sea Lion Gulch", type: "junction" }, { name: "Randall Creek", type: "junction" }, { name: "Big Flat", type: "camp" }, { name: "Gitchell Creek", type: "junction" }, { name: "Black Sands Beach", type: "trailhead" }],
    why: "Mountains drop straight into surf here because the terrain defeated the highway engineers, and you walk the result on sand, cobble and shelf rock. The constraint is tide, not distance: Sea Lion Gulch to Randall Creek and Miller Flat to Gitchell Creek go impassable at high water, and the permit does not guarantee a passable beach.",
    links: [{ label: "BLM", url: "https://www.blm.gov/visit/lost-coast-trail" }, { label: "BLM tide guide", url: "https://www.blm.gov/sites/blm.gov/files/docs/2021-02/TIDE%20GUIDE%20WEB_Active%20Links%20(1).pdf" }],
    hidden: false, inferred: ["exposure", "nights"] },

  { id: "r:trans-catalina", name: "Trans-Catalina Trail", region: "CA", kind: "thru", shape: "point-to-point",
    interests: ["trail", "view", "water", "camp", "town", "history"],
    cls: null, exposure: 2, nights: 4, permit: true, permitTier: "reservation", season: "fall through spring",
    waypoints: [{ name: "Hermit Gulch, Avalon", type: "camp" }, { name: "Black Jack Campground", type: "camp" }, { name: "Little Harbor Campground", type: "camp" }, { name: "Two Harbors Campground", type: "camp" }, { name: "Parsons Landing", type: "camp" }, { name: "Starlight Beach", type: "junction" }],
    why: "An island thru-hike with ferry logistics, a pub at the halfway point and free-roaming bison on the ridgelines. Water is the planning problem: nothing between Two Harbors and Parsons Landing, and Parsons has no running water at all — you pre-buy jugs stashed in a locker whose key you collect in Two Harbors.",
    links: [{ label: "Catalina Island Conservancy", url: "https://catalinaconservancy.org/recreation/trans-catalina-trail/" }, { label: "Halfway Anywhere", url: "https://www.halfwayanywhere.com/trails/trans-catalina-trail/trans-catalina-trail-backpacking-guide/" }],
    hidden: true, inferred: ["exposure", "nights"] },

  { id: "r:ruby-crest", name: "Ruby Crest National Recreation Trail", region: "NV", kind: "traverse", shape: "point-to-point",
    wilderness: "Ruby Mountains", interests: ["trail", "view", "summit", "water", "fish", "camp", "geology"],
    cls: null, exposure: 2, nights: 3, permit: false, permitTier: "none", season: "mid-summer to early fall",
    waypoints: [{ name: "Road's End Trailhead, Lamoille Canyon", type: "trailhead" }, { name: "Liberty Pass", type: "pass" }, { name: "Liberty Lake", type: "lake" }, { name: "Favre Lake", type: "lake" }, { name: "Overland Lake", type: "lake" }, { name: "Kleckner Creek", type: "camp" }, { name: "Harrison Pass", type: "pass" }],
    why: "A glacially carved alpine island rising straight out of Nevada basin-and-range, walkable end to end on a permit-free National Recreation Trail. The catch is water: a long middle section runs above treeline with no reliable source, and neither trailhead has water.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/r04/humboldt-toiyabe/recreation/trails/ruby-crest-national-recreation-trail" }, { label: "Halfway Anywhere", url: "https://www.halfwayanywhere.com/united-states/nevada/ruby-crest-trail-backpacking-guide/" }],
    hidden: true, inferred: ["exposure", "nights"] },

  { id: "r:baker-johnson", name: "Baker–Johnson Lakes High Loop", region: "NV", kind: "backpack", shape: "loop",
    park: "Great Basin National Park", interests: ["trail", "view", "summit", "water", "camp", "history", "dark", "geology"],
    cls: 2, exposure: 2, nights: 2, permit: true, permitTier: "registration", season: "mid-summer to early fall",
    waypoints: [{ name: "Baker Creek Trailhead", type: "trailhead" }, { name: "Baker Lake", type: "lake" }, { name: "Johnson Lake", type: "lake" }, { name: "Johnson Lake Mine", type: "junction" }, { name: "Pyramid Peak", type: "summit" }, { name: "Snake Creek", type: "junction" }],
    why: "The park's signature backcountry loop, linking two high cirque lakes over a steep loose-shale pass, with a remarkably intact early-twentieth-century mining camp above Johnson Lake and bristlecone on the ridges. Registration is mandatory on this corridor specifically, and fires are prohibited at both lakes.",
    links: [{ label: "NPS", url: "https://www.nps.gov/grba/planyourvisit/backcountry-camping.htm" }],
    hidden: true, inferred: ["cls", "exposure", "nights"] },

  /* ═══ UTAH / ARIZONA / NEW MEXICO ════════════════════════════════════════ */
  { id: "r:zion-traverse", name: "Zion Traverse (Trans-Zion Trek)", region: "UT", kind: "traverse", shape: "point-to-point",
    park: "Zion National Park", wilderness: "Zion",
    interests: ["trail", "view", "geology", "camp", "water", "history"],
    cls: null, exposure: 3, nights: 3, permit: true, permitTier: "reservation", season: "spring and fall",
    waypoints: [{ name: "Lee Pass Trailhead, Kolob Canyons", type: "trailhead" }, { name: "La Verkin Creek", type: "camp" }, { name: "Beatty Spring", type: "junction" }, { name: "Hop Valley", type: "camp" }, { name: "Wildcat Spring", type: "junction" }, { name: "Cabin Spring", type: "junction" }, { name: "The Grotto", type: "trailhead" }, { name: "East Entrance", type: "trailhead" }],
    why: "One route strings the whole park together, from the red fins of Kolob through Hop Valley and out along the West Rim's cliff-edge slickrock. It is also the driest serious backpack in Utah's park system — a long dry stretch between Beatty and Wildcat Spring, with Cabin Spring the linchpin for the high section, so ask rangers about flows.",
    links: [{ label: "NPS", url: "https://www.nps.gov/zion/planyourvisit/backpackinginfo.htm" }, { label: "Joe's Guide to Zion", url: "https://www.citrusmilo.com/zionguide/transziontrek.php" }],
    hidden: true, inferred: ["exposure", "nights"] },

  { id: "r:paria", name: "Paria Canyon and Buckskin Gulch", region: "AZ", kind: "backpack", shape: "point-to-point",
    wilderness: "Paria Canyon-Vermilion Cliffs", interests: ["water", "geology", "view", "camp", "history", "dark"],
    cls: null, exposure: 3, nights: 3, permit: true, permitTier: "quota", season: "spring and fall",
    waypoints: [{ name: "Wire Pass Trailhead", type: "trailhead" }, { name: "Buckskin Gulch", type: "junction" }, { name: "White House Trailhead", type: "trailhead" }, { name: "The Confluence", type: "camp" }, { name: "Big Spring", type: "junction" }, { name: "Lees Ferry", type: "trailhead" }],
    why: "The longest and deepest slot-canyon walk in the Southwest, and the most flash-flood-exposed route on this list — in Buckskin there is often nowhere to climb out, so a storm anywhere upstream is the hazard, not the weather overhead. Overnight permits are advance-only with no walk-up and no date changes; Big Spring is the only reliable water.",
    links: [{ label: "BLM", url: "https://www.blm.gov/programs/recreation/permits-and-passes/lotteries-and-permit-systems/arizona/paria-canyon" }, { label: "Recreation.gov", url: "https://www.recreation.gov/permits/74984" }],
    hidden: true, inferred: ["exposure", "nights"] },

  { id: "r:coyote-gulch", name: "Coyote Gulch", region: "UT", kind: "backpack", shape: "point-to-point",
    park: "Glen Canyon National Recreation Area", wilderness: "Grand Staircase-Escalante",
    interests: ["water", "geology", "view", "camp", "dark"],
    cls: null, exposure: 2, nights: 2, permit: true, permitTier: "self-issue", season: "spring and late fall",
    waypoints: [{ name: "Hurricane Wash Trailhead", type: "trailhead" }, { name: "Crack-in-the-Wall", type: "junction" }, { name: "Jacob Hamblin Arch", type: "junction" }, { name: "Coyote Natural Bridge", type: "junction" }, { name: "Cliff Arch", type: "junction" }, { name: "Escalante River confluence", type: "junction" }],
    why: "A shallow creek running through a corridor of arches, alcoves and desert-varnished sandstone — the most photographed canyon in the Escalante and still worth the queue. The Crack-in-the-Wall entry is a genuine squeeze requiring packs lowered on a rope, and waste must be packed out.",
    links: [{ label: "NPS", url: "https://www.nps.gov/glca/planyourvisit/coyote-gulch.htm" }, { label: "Road Trip Ryan", url: "https://www.roadtripryan.com/go/t/utah/escalante/coyote-gulch" }],
    hidden: true, inferred: ["exposure", "nights"] },

  { id: "r:death-hollow", name: "Death Hollow via the Boulder Mail Trail", region: "UT", kind: "backpack", shape: "point-to-point",
    wilderness: "Grand Staircase-Escalante", interests: ["water", "geology", "view", "camp", "history", "scramble", "dark"],
    cls: null, exposure: 3, nights: 2, permit: true, permitTier: "self-issue", season: "spring and fall",
    waypoints: [{ name: "Boulder Mail Trail Trailhead", type: "trailhead" }, { name: "Sand Creek", type: "camp" }, { name: "Death Hollow", type: "camp" }, { name: "Mamie Creek", type: "junction" }, { name: "Escalante River Trailhead", type: "trailhead" }],
    why: "An overland slickrock route following the old mail and telegraph line between Boulder and Escalante, dropping into and out of deep spring-fed canyons whose walls hold ponderosas. Death Hollow is the payoff and the obstacle — wading, swimming-depth pools, scrambling, and poison ivy thick enough that long sleeves are standard advice.",
    links: [{ label: "Road Trip Ryan", url: "https://www.roadtripryan.com/go/t/utah/escalante/boulder-mail-trail" }, { label: "Visit Utah", url: "https://www.visitutah.com/places-to-go/parks-outdoors/grand-staircase-escalante/hiking/boulder-mail-death-hollow" }],
    hidden: true, inferred: ["exposure", "nights"] },

  { id: "r:gc-corridor", name: "Grand Canyon Corridor Rim-to-Rim", region: "AZ", kind: "traverse", shape: "point-to-point",
    park: "Grand Canyon National Park", interests: ["trail", "view", "geology", "camp", "water", "history"],
    cls: null, exposure: 2, nights: 2, permit: true, permitTier: "lottery", season: "spring and fall",
    waypoints: [{ name: "South Kaibab Trailhead", type: "trailhead" }, { name: "The Tipoff", type: "junction" }, { name: "Bright Angel Campground", type: "camp" }, { name: "Phantom Ranch", type: "camp" }, { name: "Ribbon Falls", type: "junction" }, { name: "Cottonwood Campground", type: "camp" }, { name: "North Kaibab Trailhead", type: "trailhead" }],
    why: "The classic descent-and-ascent on the two maintained corridor trails, with designated campgrounds and piped water — which is exactly why it is the most oversubscribed backcountry permit in the Southwest. CHECK STATUS FIRST: flash flooding in Bright Angel Canyon closed North Kaibab through Cottonwood to Phantom Ranch, which breaks the standard itinerary.",
    links: [{ label: "NPS permits", url: "https://www.nps.gov/grca/planyourvisit/backcountry-permit.htm" }, { label: "The Big Outside", url: "https://thebigoutside.com/how-to-get-a-permit-to-backpack-in-the-grand-canyon/" }],
    hidden: false, inferred: ["exposure", "nights"] },

  { id: "r:gc-escalante", name: "Grand Canyon Escalante Route", region: "AZ", kind: "scramble", shape: "point-to-point",
    park: "Grand Canyon National Park", interests: ["scramble", "view", "geology", "water", "camp", "dark", "history"],
    cls: 3, exposure: 3, nights: 2, permit: true, permitTier: "lottery", season: "spring and fall only",
    waypoints: [{ name: "Tanner Trailhead, Lipan Point", type: "trailhead" }, { name: "Tanner Beach", type: "camp" }, { name: "Cardenas Creek", type: "camp" }, { name: "Unkar Delta", type: "junction" }, { name: "Papago Wall", type: "junction" }, { name: "Hance Rapid", type: "junction" }, { name: "Grandview Trailhead", type: "trailhead" }],
    why: "The eastern canyon's answer to the corridor: an unmaintained wilderness traverse along the river with the Papago Wall and slide as the crux — genuine exposed scrambling, sometimes with packs hauled separately. The Tanner descent is long, steep and entirely waterless, so the river is effectively your only source and heat is the principal hazard.",
    links: [{ label: "NPS route planner", url: "https://www.nps.gov/grca/planyourvisit/upload/Escalante_Route.pdf" }, { label: "Grand Canyon Trust", url: "https://www.grandcanyontrust.org/hikes/cpe-escalante-route/" }],
    hidden: true, inferred: ["cls", "exposure", "nights"] },

  { id: "r:havasu", name: "Havasu Canyon (Havasupai)", region: "AZ", kind: "backpack", shape: "out-and-back",
    wilderness: "Havasupai Indian Reservation", interests: ["water", "view", "geology", "camp", "food", "history"],
    cls: null, exposure: 2, nights: 3, permit: true, permitTier: "tribal", season: "spring and fall",
    waypoints: [{ name: "Hualapai Hilltop", type: "trailhead" }, { name: "Supai Village", type: "junction" }, { name: "Havasu Falls", type: "junction" }, { name: "Havasupai Campground", type: "camp" }, { name: "Mooney Falls", type: "junction" }, { name: "Beaver Falls", type: "junction" }],
    why: "Travertine-blue water on sovereign Havasupai land where the tribe sets the rules and the booking system is the whole game — the one trip here where missing the on-sale minute ends the plan for a year. The descent past Mooney involves chains, ladders and wet rock, and flash flooding has repeatedly forced evacuations.",
    links: [{ label: "Havasupai Reservations", url: "https://havasupaireservations.com/" }, { label: "Permit FAQ", url: "https://havasupaireservations.com/faqs/" }],
    hidden: false, inferred: ["exposure"] },

  { id: "r:gila-loop", name: "Gila Middle Fork and West Fork Loop", region: "NM", kind: "backpack", shape: "loop",
    park: "Gila Cliff Dwellings National Monument", wilderness: "Gila",
    interests: ["water", "camp", "history", "view", "geology", "fish", "dark"],
    cls: null, exposure: 1, nights: 3, permit: false, permitTier: "none", season: "late spring, early summer, early fall",
    waypoints: [{ name: "Middle Fork Trailhead", type: "trailhead" }, { name: "Lightfeather Hot Spring", type: "junction" }, { name: "Jordan Hot Springs", type: "camp" }, { name: "Little Bear Canyon", type: "junction" }, { name: "West Fork Trailhead", type: "trailhead" }],
    why: "The world's first designated wilderness, and a loop that spends most of its time walking in the river rather than beside it — continuous fords and wet feet are the baseline, not an inconvenience. Two hot springs, cliff dwellings at the trailhead and no permit hassle at all make it disproportionately rewarding.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/r03/gila/recreation/trails/middle-fork-trail-157" }, { label: "NPS", url: "https://home.nps.gov/gicl/planyourvisit/backpacking-in-the-gila.htm" }],
    hidden: true, inferred: ["exposure", "nights"] },

  { id: "r:pecos-truchas", name: "Pecos Wilderness Truchas Loop", region: "NM", kind: "backpack", shape: "loop",
    wilderness: "Pecos", interests: ["summit", "view", "trail", "water", "fish", "camp", "snow"],
    cls: 2, exposure: 2, nights: 4, permit: false, permitTier: "none", season: "summer into early fall",
    waypoints: [{ name: "Jacks Creek Trailhead", type: "trailhead" }, { name: "Pecos Baldy Lake", type: "lake" }, { name: "Truchas Lakes", type: "lake" }, { name: "North Truchas Peak", type: "summit" }, { name: "Santa Barbara Divide", type: "pass" }, { name: "Pecos Falls", type: "junction" }, { name: "Iron Gate Trailhead", type: "trailhead" }],
    why: "New Mexico's most alpine backpacking, with a walkable skyline along the Santa Barbara Divide connecting lake basins under the Truchas peaks — and no permit lottery in the way. Solitude is available if you move away from Pecos Baldy Lake, which absorbs most of the summer traffic; the ridge is fully exposed to daily storms.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/r03/santafe/recreation/pecos-wilderness-trails" }, { label: "Backpacker", url: "https://www.backpacker.com/trips/pecos-wilderness-nm-truchas-traverse-triple-header/" }],
    hidden: true, inferred: ["cls", "exposure", "nights"] },
];

/* ── finder ───────────────────────────────────────────────────────────────
   The query that matters is not "show me everything" but "what can I actually do, this month,
   with the permits I can still get, at a difficulty I am willing to accept". */
export function findRoutes(all, q = {}) {
  const { region, interests, maxClass, maxExposure, maxNights, maxPermitTier, kind, hidden } = q;
  return all.filter(r => {
    if (region && r.region !== region) return false;
    if (kind && r.kind !== kind) return false;
    if (hidden !== undefined && r.hidden !== hidden) return false;
    if (maxClass != null && r.cls != null && r.cls > maxClass) return false;
    if (maxExposure != null && r.exposure != null && r.exposure > maxExposure) return false;
    if (maxNights != null && r.nights != null && r.nights > maxNights) return false;
    if (maxPermitTier != null) {
      const tier = PERMIT_TIERS[r.permitTier || "none"];
      if (tier && tier.rank > maxPermitTier) return false;
    }
    if (interests?.length && !interests.some(i => r.interests.includes(i))) return false;
    return true;
  });
}

/** A route she made or walked. Same shape, src:"user", logged separately in travel.json. */
export function newUserRoute(name, region, waypoints) {
  return {
    id: "r:user:" + Date.now().toString(36),
    name, region, kind: "backpack", shape: "point-to-point",
    interests: [], cls: null, exposure: null, nights: null,
    permit: false, permitTier: "none", season: null,
    waypoints, why: "", links: [], hidden: true, inferred: [], src: "user",
  };
}
