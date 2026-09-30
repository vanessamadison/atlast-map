// Researched places — the editorial layer, gathered by reading what people actually wrote.
//
// HOW THIS FILE IS MADE: parallel research agents, one per region, reading Reddit, Summitpost,
// Mountain Project, WTA, CMC, NPS / USFS / BLM / state pages, and local outdoor press. Each
// agent returns entries against the schema in RESEARCH.md and every entry carries the URLs it
// came from. See RESEARCH.md to run another pass.
//
// THE RULE THAT KEEPS THIS HONEST: no mileage, no elevation gain, no elevation, no prices, no
// closure dates. Ever. Those are the numbers that get someone hurt when they are wrong, and
// prose on the internet is not a survey. Coordinates and elevations come from OpenStreetMap;
// class and mileage for the fourteeners come from travel.json, which Vanessa verified herself.
// What research contributes is the part no dataset has: whether a place is worth your Saturday.
//
// FIELDS
//   cls        YDS class 1–5, only where widely published. null otherwise.
//   grade      the original string where it was more specific than a class ("5.4").
//   exposure   0 sheltered · 1 mild · 2 serious · 3 lethal. From the source's own language.
//   permit     true where a source states one is required. `permitKind` where it says how.
//   season     free text window, only where a source states it. Not a promise — roads open
//              when they open, and this file does not know what the snowpack did this year.
//   inferred   which of the above were read out of prose rather than stated as a field. The UI
//              shows these differently, because "a blog implied it" is not "the park said so".
//   hidden     true = locals-know-it. false = famous must-do. Both are useful, differently.
//
// Park names are the long official ones as written by the sources; places.js maps them onto
// the short names in parks.js, because "Zion National Park" must resolve to "Zion" or the
// whole card falls apart.

export const BATCHES = [
  { id: "2026-08-24-west", date: "2026-08-24", regions: ["CO", "UT", "AZ", "NM", "WA", "OR", "ID", "MT", "WY", "CA", "NV"],
    note: "First pass. Four parallel agents, western US. 95 entries." },
];

export const DISCOVERED = [
  /* ═══ COLORADO ═══════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Ice Lake Basin and Island Lake", kind: "lake", region: "CO", park: null,
    interests: ["trail", "water", "view", "camp"], cls: null, exposure: 1, hidden: false,
    why: "A staircase of hanging basins above Silverton where glacial rock flour turns the water an improbable neon turquoise, ringed by wildflower meadows and a wall of jagged San Juan peaks. It is steep and it is busy, and people still call it the best alpine lake day in Colorado.",
    links: [{ label: "San Juan Mountains Association", url: "https://sjma.org/ice-lake-trip-planning/" }, { label: "Colorado Lakes", url: "https://www.coloradolakes.org/lakes/san-juan-county/ice-lake" }], inferred: ["exposure"] },

  { batch: "2026-08-24-west", name: "Lone Eagle Peak and Mirror Lake", kind: "peak", region: "CO", park: null,
    interests: ["view", "trail", "camp", "water"], cls: null, exposure: 2, hidden: true,
    why: "Photographers routinely call this the most photogenic mountain in the state: a blade of rock rising straight out of the Indian Peaks backcountry and reflecting in Mirror Lake on a calm morning. The long walk in from Monarch Lake filters out almost everyone.",
    links: [{ label: "SummitPost", url: "https://www.summitpost.org/lone-eagle-peak/154100" }, { label: "Colorado Mountain Club", url: "https://www.cmc.org/education-adventure/trips/routes-places/bpx-routes-places/bpx-2-day-monarch-lake-to-crater-lake" }], inferred: ["exposure"] },

  { batch: "2026-08-24-west", name: "Wham Ridge, Vestal Peak", kind: "route", region: "CO", park: null,
    interests: ["climb", "summit", "scramble", "camp"], cls: 5, grade: "5.4", exposure: 3, hidden: true,
    why: "The great sweeping north face of Vestal in the Grenadiers is the Colorado alpine rock climb everyone eventually wants: clean quartzite slabs, position that never lets up, and an approach through the Weminuche that makes the summit feel earned. Guides and the Colorado Mountain Club both treat it as a state classic.",
    links: [{ label: "SummitPost", url: "https://www.summitpost.org/wham-ridge/654539" }, { label: "The Mountaineers", url: "https://www.mountaineers.org/activities/routes-places/vestal-peak-wham-ridge-colorado" }], inferred: [] },

  { batch: "2026-08-24-west", name: "The Sawtooth · Bierstadt to Mount Blue Sky", kind: "ridge", region: "CO", park: null,
    interests: ["scramble", "summit", "view"], cls: 3, exposure: 3, hidden: false,
    why: "The classic Front Range apprenticeship in ridge travel: blocky ribs, narrow ledges, a gendarme to solve and real air under your boots, all within sight of the highway. Wander off the line and it stiffens fast, so route-finding matters more than fitness here.",
    links: [{ label: "14ers.com", url: "https://www.14ers.com/route.php?route=bier4" }, { label: "Colorado Mountain Club", url: "https://www.cmc.org/education-adventure/trips/routes-places/mt-bierstadt" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Devil's Causeway, Flat Tops Wilderness", kind: "ridge", region: "CO", park: null,
    interests: ["trail", "view", "geology", "camp"], cls: 2, exposure: 3, hidden: true,
    why: "A land bridge of volcanic rock pinches down to barely shoulder width with sheer drops on both sides, and there is no cable or rail to hold. The Flat Tops around it are rolling green plateau and trout lakes rather than spiky peaks, which is exactly why locals love this corner of the state.",
    links: [{ label: "Colorado.com", url: "https://www.colorado.com/articles/hidden-colorado-gem-devils-causeway" }, { label: "SummitPost", url: "https://www.summitpost.org/devils-causeway-peak/783473" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Phantom Terrace · Venable–Comanche Loop", kind: "loop", region: "CO", park: null,
    interests: ["trail", "scramble", "view", "water"], cls: 2, exposure: 3, hidden: true,
    why: "A ledge cut across the flank of Venable Peak links two Sangre de Cristo drainages in a loop that feels far more committing than a trail has any right to. Add lakes, a pass crossing and huge aspen stands, and it is the Wet Mountain Valley's best-kept long day.",
    links: [{ label: "Colorado.com", url: "https://www.colorado.com/articles/hidden-colorado-gem-venable-comanche-trails-loop" }, { label: "Colorado Mountain Club", url: "https://www.cmc.org/education-adventure/trips/routes-places/bpx-routes-places/bpx-3-day-greater-comanche-venables-loop" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Willow Lake and Willow Lake Falls", kind: "lake", region: "CO", park: null,
    interests: ["water", "camp", "trail", "view"], cls: 1, exposure: 1, hidden: true,
    why: "A waterfall pours straight into an alpine lake pinned against the Crestone group's walls, which is about as good as a campsite gets in Colorado. The climb out of the San Luis Valley is relentless and the payoff is immediate.",
    links: [{ label: "Colorado Mountain Club", url: "https://www.cmc.org/education-adventure/trips/routes-places/backpack-section-willow-lake-mount-adams-fall-colors-3day-out-back" }, { label: "Climb13ers", url: "https://www.climb13ers.com/colorado-13ers/approach/willow-lake-trail-865-2" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Sky Pond via Glacier Gorge", kind: "lake", region: "CO", park: "Rocky Mountain National Park",
    interests: ["trail", "water", "scramble", "view"], cls: 2, exposure: 2, hidden: false,
    why: "The trail stacks The Loch, a waterfall you climb beside, and finally a pond hemmed in by the Cathedral Spires, which is why it is the hike most people name as the park's best. The wet scramble up alongside Timberline Falls is where the accidents happen, so treat footwear seriously.",
    links: [{ label: "Rocky Mountain Hiking Trails", url: "https://www.rockymountainhikingtrails.com/sky-pond.htm" }, { label: "Earth Trekkers", url: "https://www.earthtrekkers.com/sky-pond-hike-rocky-mountain/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Bridal Veil Falls, Telluride", kind: "waterfall", region: "CO", park: null,
    interests: ["water", "trail", "climb", "history", "view"], cls: 1, exposure: 1, hidden: false,
    why: "Colorado's tallest free-falling waterfall drops out of the box canyon at the head of Telluride, with a historic hydroelectric plant perched improbably on the lip above it. In deep winter the whole thing freezes into one of the region's premier ice climbs.",
    links: [{ label: "Visit Telluride", url: "https://www.telluride.com/activity/bridal-veil-falls/" }, { label: "World of Waterfalls", url: "https://www.world-of-waterfalls.com/waterfalls/american-southwest-bridal-veil-falls-telluride/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Conundrum Hot Springs", kind: "hot_spring", region: "CO", park: null,
    interests: ["water", "camp", "trail", "view"], cls: 1, exposure: 0, hidden: false,
    permit: true, permitKind: "quota", season: "year-round permit requirement",
    why: "Rock pools at the head of a long Elk Mountains valley, soaking distance from the Maroon Bells–Snowmass high country, reached only on foot. Overnight permits are required year-round and bear canisters are mandatory, which has helped the place recover from being loved to death.",
    links: [{ label: "USFS trailhead", url: "https://www.fs.usda.gov/r02/whiteriver/recreation/trails/conundrum-creek-trailhead-1981" }, { label: "USFS permits", url: "https://www.fs.usda.gov/r02/whiteriver/newsroom/releases/reminder-overnight-camping-permits-conundrum-hot-springs-0" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Rainbow Hot Springs, Weminuche Wilderness", kind: "hot_spring", region: "CO", park: null,
    interests: ["water", "camp", "trail"], cls: 1, exposure: 1, hidden: true,
    why: "Rock-lined pools on the bank of the West Fork of the San Juan, deep inside the Weminuche and reachable only by walking, which is the whole point. Backpacker has pitched it for years as the soak you get to yourself once the day hikers turn around.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/r02/sanjuan/recreation/rainbow-hot-springs" }, { label: "Backpacker", url: "https://www.backpacker.com/trips/denver-co-soak-in-solitude-weminuche-wilderness/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Wheeler Geologic Area", kind: "geology", region: "CO", park: null,
    interests: ["geology", "trail", "camp", "history", "dark"], cls: 1, exposure: 0, hidden: true,
    why: "Hoodoos and banded volcanic tuff eroded out of the La Garita caldera's ash, hidden in the far corner of a wilderness above Creede. It was once Colorado's first national monument and lost the title largely because getting there is still genuinely hard.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/r02/riogrande/recreation/wheeler-geologic-area" }, { label: "Colorado Encyclopedia", url: "https://coloradoencyclopedia.org/article/wheeler-geologic-area" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Black Canyon inner canyon routes and the Gunnison Gorge", kind: "route", region: "CO", park: "Black Canyon of the Gunnison National Park",
    interests: ["scramble", "fish", "geology", "dark", "water"], cls: 3, exposure: 3, hidden: true,
    permit: true, permitKind: "self-issue",
    why: "Unmaintained routes drop off the rims into a black schist slot canyon, one of them with a chain on the steepest pitch, to reach Gold Medal trout water almost nobody fishes. A free wilderness permit, an early start and honest fitness are the price of admission, and the park's dark-sky designation makes staying late worth it.",
    links: [{ label: "NPS dark sky", url: "https://www.nps.gov/blca/learn/news/ida_designation.htm" }, { label: "DIY Fly Fishing", url: "https://diyflyfishing.com/black-canyon-gunnison-national-park-colorado/" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Night sky at Great Sand Dunes", kind: "viewpoint", region: "CO", park: "Great Sand Dunes National Park and Preserve",
    interests: ["dark", "view", "water", "geology"], cls: 1, exposure: 0, hidden: false,
    why: "Certified as an International Dark Sky Park and among the quietest units in the park system, with dry high-desert air and no nearby light domes. When Medano Creek is running you can lie at the base of the dunes and watch the Milky Way reflected in an inch of water.",
    links: [{ label: "DarkSky International", url: "https://darksky.org/places/great-sand-dunes-national-park-dark-sky-park/" }, { label: "NPS", url: "https://www.nps.gov/grsa/index.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Westcliffe and Silver Cliff", kind: "town", region: "CO", park: null,
    interests: ["dark", "town", "trail", "view"], cls: null, exposure: null, hidden: true,
    why: "Colorado's first International Dark Sky Community sits in the Wet Mountain Valley with the Sangre de Cristos rising straight off the ranchland, shielded from Front Range skyglow. A volunteer-run observatory in town holds free public star parties through the warm months.",
    links: [{ label: "DarkSky International", url: "https://darksky.org/places/westcliffe-and-silver-cliff-dark-sky-community/" }, { label: "Dark Skies of the Wet Mountain Valley", url: "https://www.darkskiescolorado.org/" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Fryingpan River tailwater", kind: "fishing", region: "CO", park: null,
    interests: ["fish", "water"], cls: null, exposure: null, hidden: false,
    why: "A cold, consistent Gold Medal tailwater below Ruedi Dam with famously fussy trout and a mysis shrimp habit that draws anglers from across the country. Fish it for the technical challenge, not for solitude.",
    links: [{ label: "Flylords", url: "https://flylordsmag.com/tailwater-tales-your-guide-to-exploring-the-frying-pan-river/" }, { label: "Aspen Journalism", url: "https://aspenjournalism.org/cpw-proposes-increase-to-fryingpan-river-fish-harvest/" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Kebler Pass dispersed camping", kind: "camp", region: "CO", park: null,
    interests: ["camp", "bike", "view", "trail"], cls: null, exposure: null, hidden: false,
    why: "A gravel pass west of Crested Butte runs through what is reputed to be the largest aspen grove in Colorado, with pullouts and spur roads leading to easy dispersed sites on both sides. Autumn turns it into a zoo, so the trick locals use is going in midsummer when you can have a grove to yourself.",
    links: [{ label: "Gunnison–Crested Butte", url: "https://gunnisoncrestedbutte.com/blog/kebler-pass/" }, { label: "Uncover Colorado", url: "https://www.uncovercolorado.com/kebler-pass-aspen-grove/" }], inferred: [] },

  { batch: "2026-08-24-west", name: "10th Mountain Division Huts", kind: "camp", region: "CO", park: null,
    interests: ["camp", "snow", "bike", "trail", "history"], cls: null, exposure: null, hidden: false,
    permit: true, permitKind: "lottery",
    why: "A nonprofit network of backcountry cabins strung across the high country between Breckenridge, Aspen and Crested Butte, descended from the division that trained at Camp Hale. Winter dates go through a member lottery and vanish immediately; summer booking is far easier and the wildflower access is superb.",
    links: [{ label: "Hut Association", url: "https://huts.org/" }, { label: "Outside", url: "https://www.outsideonline.com/adventure-travel/destinations/10th-mountain-division-huts-colorado/" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Ouray", kind: "town", region: "CO", park: null,
    interests: ["town", "climb", "trail", "water", "view"], cls: null, exposure: null, hidden: false,
    why: "A Victorian mining town wedged into a box canyon with peaks on nearly every side, a hiking loop that circles above the rooftops, hot springs downtown and the world's first dedicated ice park within walking distance. Outside has called it the state's most adventurous small town and the storefronts are still all locally owned.",
    links: [{ label: "Outside", url: "https://www.outsideonline.com/adventure-travel/destinations/north-america/ouray-colorado/" }, { label: "Ouray Ice Park", url: "https://www.uncovercolorado.com/ice-climbing/ouray-ice-park/" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Salida and Poncha Springs", kind: "town", region: "CO", park: null,
    interests: ["town", "food", "water", "fish", "bike", "paddle"], cls: null, exposure: null, hidden: true,
    why: "An unpretentious river town of rafters, artists and ranchers with the densest brewery cluster in the Arkansas Valley, a whitewater park in the middle of downtown and Gold Medal trout water at the doorstep. Elevation Beer Co. just up the road in Poncha Springs is the one people plan around.",
    links: [{ label: "Westword", url: "https://www.westword.com/food-drink/breweries-salida-buena-vista-poncha-springs-upper-arkansas-river-valley-14841574/" }, { label: "Salida Chamber", url: "https://salidachamber.org/business/food-drink-brewery-distillery-winery/elevation-beer-company/" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Secret Stash, Crested Butte", kind: "food", region: "CO", park: null,
    interests: ["food", "town"], cls: null, exposure: null, hidden: false,
    why: "The pizza place Crested Butte votes best in town year after year, a rambling bohemian room where the fig-and-prosciutto pie has its own cult following and the taps skew Colorado. It is the standard post-wildflower-hike destination in the state's wildflower capital.",
    links: [{ label: "5280", url: "https://5280.com/road-trip-restaurant-crested-buttes-secret-stash/" }, { label: "Colorado.com", url: "https://www.colorado.com/crested-butte/secret-stash" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Dolores River Brewery", kind: "food", region: "CO", park: null,
    interests: ["food", "town"], cls: null, exposure: null, hidden: true,
    why: "A wood-fired pizza and beer garden that functions as the social centre of the Four Corners, with a hard cap on pies each night and only on weekends, so people time their Dolores River and Mesa Verde trips around it. Food trucks and house beer carry the rest of the week.",
    links: [{ label: "Dolores River Brewery", url: "https://www.doloresriverbrewery.com/" }, { label: "Colorado.com", url: "https://www.colorado.com/dolores/restaurants-culinary/casual-dining/dolores-river-brewery" }], inferred: [] },

  /* ═══ UTAH ═══════════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Angels Landing", kind: "route", region: "UT", park: "Zion National Park",
    interests: ["summit", "scramble", "view"], cls: 1, exposure: 3, hidden: false,
    permit: true, permitKind: "lottery",
    why: "The chain-assisted fin above Scout Lookout is the single most talked-about hike in the Southwest, and the drop-offs are as serious as the reputation suggests. A permit won through the park's seasonal or day-before lottery is mandatory to go past Scout Lookout, so plan the trip around the lottery, not the other way round.",
    links: [{ label: "NPS permits", url: "https://www.nps.gov/zion/planyourvisit/angels-landing-hiking-permits.htm" }, { label: "Recreation.gov", url: "https://www.recreation.gov/permits/4675310" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "The Narrows, bottom-up", kind: "trail", region: "UT", park: "Zion National Park",
    interests: ["water", "view", "geology"], cls: 1, exposure: 1, hidden: false,
    why: "Wading upstream between thousand-foot walls is the rare marquee hike that needs no permit going bottom-up, which is why it is the one everybody recommends to first-timers. The top-down through-hike is a different animal and does require a permit, and flash-flood risk closes the river without warning.",
    links: [{ label: "NPS", url: "https://www.nps.gov/zion/planyourvisit/thenarrows.htm" }, { label: "NPS permits", url: "https://www.nps.gov/zion/planyourvisit/narrowspermits.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Queen's Garden & Navajo Loop", kind: "loop", region: "UT", park: "Bryce Canyon National Park",
    interests: ["trail", "view", "geology"], cls: 1, exposure: 1, hidden: false,
    why: "The Park Service itself calls this the hike to do if you only do one at Bryce, dropping off the rim into the hoodoo amphitheatre and climbing back out through Wall Street's switchbacks.",
    links: [{ label: "NPS", url: "https://www.nps.gov/brca/planyourvisit/qgnavajocombo.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Delicate Arch Trail", kind: "trail", region: "UT", park: "Arches National Park",
    interests: ["trail", "view", "geology"], cls: 1, exposure: 2, hidden: false,
    why: "The state's postcard, earned by a shadeless slickrock climb and a narrow ledge traverse right before the arch appears all at once. The Wolfe Ranch lot fills early and the park has used timed-entry ticketing in some seasons, so check current entry rules.",
    links: [{ label: "NPS", url: "https://www.nps.gov/arch/planyourvisit/delicate-arch.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Chesler Park & Joint Trail Loop", kind: "loop", region: "UT", park: "Canyonlands National Park",
    interests: ["trail", "scramble", "view", "geology"], cls: 2, exposure: 1, hidden: false,
    why: "Widely argued to be the best day hike in Canyonlands, threading a meadow ringed by banded sandstone spires and then squeezing through the Joint Trail's deep rock fractures. The Elephant Hill approach road is graded dirt.",
    links: [{ label: "NPS", url: "https://www.nps.gov/places/chesler-park-loop-joint-trail.htm" }, { label: "American Southwest", url: "https://www.americansouthwest.net/utah/canyonlands/chesler_park.html" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Cassidy Arch", kind: "trail", region: "UT", park: "Capitol Reef National Park",
    interests: ["trail", "view", "geology", "history"], cls: 2, exposure: 2, hidden: false,
    why: "Repeatedly named the best hike in Capitol Reef because you end up standing on top of the arch rather than looking at it, after a climb out of Grand Wash onto open slickrock. Named for the outlaw who reportedly used these canyons.",
    links: [{ label: "Earth Trekkers", url: "https://www.earthtrekkers.com/cassidy-arch-hike-capitol-reef/" }, { label: "Capitol Reef Country", url: "https://capitolreef.travel/listing/experiences/cassidy-arch" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Peek-a-Boo and Spooky Gulch", kind: "geology", region: "UT", park: null,
    interests: ["scramble", "geology", "view"], cls: 3, exposure: 1, hidden: true,
    why: "The Utah Geological Survey calls linking these two Hole-in-the-Rock Road slots a day hike of a lifetime, one climbed through on carved potholes, the other so narrow you turn sideways and leave the pack behind. The access road is dirt and impassable when wet, and it is a poor choice for anyone claustrophobic or larger-framed.",
    links: [{ label: "Utah Geological Survey", url: "https://geology.utah.gov/explore-two-enchanting-slot-canyons-one-utah-day-hike-of-a-lifetime-peek-a-boo-to-spooky-gulch/" }, { label: "BLM", url: "https://www.blm.gov/visit/escalante-interagency-visitor-center" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Buckskin Gulch via Wire Pass", kind: "geology", region: "UT", park: null,
    interests: ["geology", "water", "camp"], cls: 2, exposure: 2, hidden: true,
    permit: true, permitKind: "fee permit · overnight quota",
    why: "The longest continuous slot canyon in the country, a corridor of dark undulating sandstone that canyon people treat as a pilgrimage. BLM requires a fee permit even for day hiking, overnight travel is capped at a tiny daily quota, and flash floods here are notoriously unsurvivable.",
    links: [{ label: "BLM Buckskin Gulch", url: "https://www.blm.gov/visit/buckskin-gulch" }, { label: "BLM Paria permits", url: "https://www.blm.gov/programs/recreation/permits-and-passes/lotteries-and-permit-systems/arizona/paria-canyon" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Fifth Water (Diamond Fork) Hot Springs", kind: "hot_spring", region: "UT", park: null,
    interests: ["water", "trail", "camp"], cls: 1, exposure: 0, hidden: true,
    why: "The Wasatch Front's worst-kept secret: turquoise soaking pools stacked below small waterfalls in a Forest Service canyon an easy drive from Salt Lake and Provo. It has been closed for extended restoration work in the past and the access road shuts in bad weather, so call the ranger district before committing.",
    links: [{ label: "Visit Utah", url: "https://www.visitutah.com/places-to-go/cities-and-towns/provo-utah-valley/fifth-water-hot-springs" }, { label: "FOX 13", url: "https://www.fox13now.com/news/local-news/after-more-than-a-year-fifth-water-hot-springs-in-utah-county-will-reopen" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Hell's Backbone Grill & Farm, Boulder", kind: "food", region: "UT", park: null,
    interests: ["food", "town"], cls: null, exposure: null, hidden: false,
    why: "A farm-sourced dining room in one of the emptiest towns in the lower forty-eight that people genuinely reroute a Highway 12 trip around, serving a Four Corners menu of cowboy, Mormon and Southwestern cooking. It closes for the winter and books out.",
    links: [{ label: "Visit Utah", url: "https://www.visitutah.com/articles/hells-backbone-grill" }, { label: "Salt Lake Tribune", url: "https://www.sltrib.com/artsliving/food/2024/05/16/is-hells-backbone-grill-worth/" }], inferred: [] },

  /* ═══ ARIZONA ════════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Grand Canyon Rim-to-Rim", kind: "route", region: "AZ", park: "Grand Canyon National Park",
    interests: ["trail", "view", "camp", "geology"], cls: 1, exposure: 2, hidden: false,
    permit: true, permitKind: "backcountry lottery",
    why: "The defining long hike of the Southwest, dropping through the whole geologic column to the Colorado and back out the far side, and the one trip canyon regulars say changes how you see the place. Overnight backcountry permits are notoriously hard to win, and the North Rim facilities and water sources are seasonal.",
    links: [{ label: "NPS permits", url: "https://www.nps.gov/grca/planyourvisit/backcountry-permit.htm" }, { label: "National Park Foundation", url: "https://www.nationalparks.org/connect/blog/grand-canyon-rim-rim-hike" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "The Wave, Coyote Buttes North", kind: "geology", region: "AZ", park: null,
    interests: ["geology", "view"], cls: 2, exposure: 1, hidden: false,
    permit: true, permitKind: "lottery",
    why: "The striped sandstone bowl that launched a thousand desktop wallpapers, and the hardest permit in the region to get: BLM issues every entry through an advance monthly lottery plus a small daily lottery, with a strict head count per day. There is no marked trail and no water, and the approach road demands real clearance.",
    links: [{ label: "BLM lottery", url: "https://www.blm.gov/visit/coyote-buttes-north-advanced-lottery-the-wave" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Havasu Falls and Havasupai Canyon", kind: "waterfall", region: "AZ", park: null,
    interests: ["water", "trail", "camp", "view"], cls: 1, exposure: 1, hidden: false,
    permit: true, permitKind: "tribal reservation · multi-night minimum",
    why: "Travertine-blue water pouring over red rock on Havasupai tribal land, and the reason people set phone alarms for permit release day. Reservations are sold only through the tribe's own site, day hiking is prohibited, and the minimum stay is multiple nights, so this is a trip you build a whole vacation around or skip.",
    links: [{ label: "Havasupai Reservations", url: "https://havasupaireservations.com/" }, { label: "Havasupai Tribe", url: "https://theofficialhavasupaitribe.com/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Toroweap (Tuweep) Overlook", kind: "viewpoint", region: "AZ", park: "Grand Canyon National Park",
    interests: ["view", "camp", "dark", "geology"], cls: 1, exposure: 3, hidden: true,
    permit: true, permitKind: "camping permit · day-use reservation pilot",
    why: "The only place in the park where you stand at an unfenced rim with the Colorado directly below you, reached by a long unmaintained dirt road that eats rental cars and has no services of any kind. Monsoon rain can make the route impassable.",
    links: [{ label: "Recreation.gov day use", url: "https://recreation.gov/timed-entry/10089462" }, { label: "Overview", url: "https://en.wikipedia.org/wiki/Toroweap_Overlook" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Wasson Peak via Hugh Norris Trail", kind: "peak", region: "AZ", park: "Saguaro National Park",
    interests: ["summit", "trail", "view"], cls: 1, exposure: 1, hidden: false,
    season: "cool season only",
    why: "The consensus best hike in Saguaro's Tucson Mountain District, climbing a ridgeline through dense saguaro forest to a full circle view over the Sonoran Desert. No shade, no water and no dogs.",
    links: [{ label: "American Southwest", url: "https://www.americansouthwest.net/arizona/saguaro/hugh-norris-trail.html" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Blue Mesa and the Historic Blue Forest route", kind: "trail", region: "AZ", park: "Petrified Forest National Park",
    interests: ["geology", "trail", "view", "history"], cls: 1, exposure: 0, hidden: false,
    why: "Blue Mesa is the park's signature walk, a paved descent into banded blue-grey badlands littered with petrified logs, and it can be linked to the Historic Blue Forest route for a longer, far emptier version. Rangers hand out a set of Off the Beaten Path guides for cross-country routes almost nobody walks.",
    links: [{ label: "NPS Blue Mesa", url: "http://home.nps.gov/places/blue-mesa.htm" }, { label: "NPS off the beaten path", url: "https://www.nps.gov/pefo/off-the-beaten-path.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "The Flatiron via Siphon Draw", kind: "route", region: "AZ", park: null,
    interests: ["scramble", "summit", "view"], cls: 3, exposure: 3, hidden: true,
    season: "cool season, pre-dawn start",
    why: "Phoenix hikers call this the hardest thing in the valley: a relentless gully of loose rock and slickrock chutes that turns into genuine hands-on scrambling on a headwall before the plateau opens over the Valley of the Sun. Widely rated class 3 with short class 4 moves, and it kills people in summer heat.",
    links: [{ label: "Modern Hiker", url: "https://modernhiker.com/hike/siphon-draw-flat-iron/" }], inferred: [] },

  { batch: "2026-08-24-west", name: "El Güero Canelo, Tucson", kind: "food", region: "AZ", park: null,
    interests: ["food", "town"], cls: null, exposure: null, hidden: false,
    why: "The James Beard America's Classics winner for the Sonoran hot dog, bacon-wrapped and buried in pinto beans, chiles and crema on a bun baked in Sonora. Cheap, open late, and the standard post-hike stop coming off the Santa Catalinas or Saguaro West.",
    links: [{ label: "El Güero Canelo", url: "https://elguerocanelo.com/" }, { label: "This is Tucson", url: "https://thisistucson.com/eat/el-guero-canelo-just-won-a-james-beard-award/article_44fe4014-fc82-11e7-bd22-3b9b8d0beac3.html" }], inferred: [] },

  /* ═══ NEW MEXICO ═════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Natural Entrance Route into Carlsbad Cavern", kind: "geology", region: "NM", park: "Carlsbad Caverns National Park",
    interests: ["geology", "trail", "history"], cls: 1, exposure: 0, hidden: false,
    permit: true, permitKind: "timed reservation",
    why: "Walking in through the mouth of the cave instead of taking the elevator is the whole point here, a switchbacking paved descent into the dark that delivers you to the Big Room. Entry to the natural entrance cuts off in the early afternoon, and the specialty ranger-led caves are separate tickets.",
    links: [{ label: "Recreation.gov", url: "https://www.recreation.gov/ticket/facility/234637" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Alkali Flat Trail", kind: "trail", region: "NM", park: "White Sands National Park",
    interests: ["trail", "view", "geology"], cls: 2, exposure: 1, hidden: false,
    why: "The longest marked route at White Sands, following red posts over the heart of the gypsum dunefield to the dry lakebed edge, and the only way to get properly away from the road and into silence. No shade, no water and no toilets; the park closes for missile range testing.",
    links: [{ label: "NPS", url: "https://www.nps.gov/places/alkali-flat-trail.htm" }, { label: "American Southwest", url: "https://www.americansouthwest.net/new_mexico/white_sands/alkali-flat-trail.html" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Chaco Culture night sky", kind: "camp", region: "NM", park: null,
    interests: ["dark", "history", "camp"], cls: 1, exposure: 0, hidden: true,
    why: "A certified International Dark Sky Park with its own observatory and a ranger astronomy programme, set among great houses whose builders aligned walls and openings to the sky. The washboard dirt approach road is the gatekeeper and the small campground books out.",
    links: [{ label: "NPS night sky", url: "https://www.nps.gov/chcu/planyourvisit/nightsky.htm" }, { label: "DarkSky International", url: "https://darksky.org/places/chaco-culture-national-historic-park-dark-sky-park/" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Bisti / De-Na-Zin Wilderness", kind: "geology", region: "NM", park: null,
    interests: ["geology", "dark", "camp", "view"], cls: 2, exposure: 1, hidden: true,
    why: "BLM badlands of hoodoos, cracked eggshell mounds and fossil-bearing shale that photographers treat as the region's best-kept surreal landscape, with named oddities like the Alien Egg Hatchery found only by wandering. There are no trails, no signs and no water, navigation is entirely on you, and the clay turns to grease after rain.",
    links: [{ label: "BLM", url: "https://www.blm.gov/visit/bisti-de-na-zin-wilderness" }, { label: "New Mexico True", url: "https://www.newmexico.org/listing/bisti-de-na-zin-(blm)/1556/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Lightfeather Hot Spring, Middle Fork Gila", kind: "hot_spring", region: "NM", park: null,
    interests: ["water", "trail", "history"], cls: 1, exposure: 0, hidden: true,
    why: "A short walk up the Middle Fork from the Gila Visitor Center to rock-stacked pools where scalding spring water meets a cold river, the gentlest introduction to the Gila's hot spring country. The source is hot enough to burn, so mixing matters.",
    links: [{ label: "NPS", url: "https://www.nps.gov/gicl/learn/nature/hotsprings.htm" }, { label: "USFS", url: "https://www.fs.usda.gov/r03/gila/recreation/trails/middle-fork-trail-157" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Silver City", kind: "town", region: "NM", park: null,
    interests: ["town", "food", "bike", "history"], cls: null, exposure: null, hidden: true,
    why: "An old mining town turned gallery-and-mural district that sits where the Continental Divide Trail, the Gila Wilderness and the road to the cliff dwellings all converge, making it the obvious cheap basecamp for southwest New Mexico. Locals use it for hot spring runs, canyoneering and a genuinely strong road and gravel cycling scene.",
    links: [{ label: "Visit Silver City", url: "https://visitsilvercity.org/plan/lodging/" }, { label: "New Mexico True", url: "https://www.newmexico.org/the-gila/" }], inferred: [] },

  /* ═══ WASHINGTON ═════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Skyline Trail Loop at Paradise", kind: "loop", region: "WA", park: "Mount Rainier National Park",
    interests: ["trail", "view", "summit", "water", "snow"], cls: 1, exposure: 1, hidden: false,
    season: "snow lingers on the upper loop into summer",
    why: "The consensus best day loop in the park: paved meadow walk past Myrtle Falls, then a climb into the alpine to Panorama Point where Rainier fills the sky and the Tatoosh, Adams, St. Helens and Hood line up behind you. The meadows are fragile so staying on tread matters, and Paradise lots fill early.",
    links: [{ label: "NPS trails map", url: "https://www.nps.gov/mora/planyourvisit/upload/2019-Paradise-Area-Trails_508.pdf" }, { label: "Visit Rainier", url: "https://visitrainier.com/skyline-trail-panorama-point/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Spray Park and Spray Falls", kind: "trail", region: "WA", park: "Mount Rainier National Park",
    interests: ["trail", "water", "view", "camp"], cls: 1, exposure: 1, hidden: false,
    season: "peak bloom is a short midsummer window",
    why: "Rainier's northwest corner rewards the long drive up the rough Mowich Lake road with a single-drop cascade side trip and wildflower meadows the Park Service itself says rival any in the park. The access road is rough gravel and unplowed early season.",
    links: [{ label: "NPS", url: "https://home.nps.gov/mora/planyourvisit/spray-park.htm" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "The Enchantments Core Zone", kind: "route", region: "WA", park: null,
    interests: ["trail", "scramble", "view", "water", "camp", "snow"], cls: 3, exposure: 2, hidden: false,
    permit: true, permitKind: "lottery",
    why: "Granite basins, larch, turquoise tarns and goats above Leavenworth — the single most coveted permit in Washington. Overnight use is capped in summer and awarded through a February advanced lottery plus a daily walk-up lottery, so the odds for the Core Zone are brutal; the Aasgard Pass climb from Colchuck holds snow and is the crux either direction.",
    links: [{ label: "Recreation.gov", url: "https://recreation.gov/permits/233273" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Cascade Pass and Sahale Arm", kind: "ridge", region: "WA", park: "North Cascades National Park",
    interests: ["trail", "scramble", "view", "summit", "snow", "camp"], cls: 2, exposure: 2, hidden: false,
    permit: true, permitKind: "backcountry permit for Sahale Glacier Camp",
    why: "Repeatedly called the best day hike in the North Cascades: switchbacks to a pass ringed by hanging glaciers, then a ridge walk up flower meadows to a camp on moraine at the glacier's edge. The long unpaved Cascade River Road can hold snow into midsummer.",
    links: [{ label: "NPS", url: "https://www.nps.gov/noca/planyourvisit/cascade-pass-trail.htm" }, { label: "Earth Trekkers", url: "https://www.earthtrekkers.com/cascade-pass-and-sahale-arm-hike/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Hoh Rain Forest and the Hall of Mosses", kind: "trail", region: "WA", park: "Olympic National Park",
    interests: ["trail", "water", "history", "view"], cls: 1, exposure: 0, hidden: false,
    why: "One of the few temperate rainforests in the country and the reason many people come to Olympic at all — bigleaf maple and Sitka spruce hung with moss, Roosevelt elk in the understory, and the Hoh River trail running deep into the wilderness behind it. The Upper Hoh Road has a history of storm damage, so check status before driving out.",
    links: [{ label: "NPS", url: "https://www.nps.gov/olym/planyourvisit/visiting-the-hoh.htm" }, { label: "WTA", url: "https://www.wta.org/go-hiking/hikes/hall-of-mosses" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Shi Shi Beach and Point of the Arches", kind: "camp", region: "WA", park: "Olympic National Park",
    interests: ["trail", "water", "camp", "view", "history"], cls: 2, exposure: 2, hidden: true,
    permit: true, permitKind: "Makah Recreation Pass + Olympic wilderness permit",
    why: "Sea stacks and arches in a row at the far northwest corner of the lower forty-eight, with tide pools locals rate above anything else on the coast. Logistics are the filter, and the headland crossings are tide-dependent.",
    links: [{ label: "NPS", url: "https://home.nps.gov/olym/planyourvisit/shi-shi-beach-olympic-wilderness.htm" }, { label: "WTA", url: "https://www.wta.org/go-hiking/hikes/shi-shi-beach-and-point-of-arches" }], inferred: ["cls", "exposure"] },

  /* ═══ OREGON ═════════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Rim Drive and the Watchman Peak Trail", kind: "viewpoint", region: "OR", park: "Crater Lake National Park",
    interests: ["trail", "view", "geology", "summit", "dark"], cls: 1, exposure: 1, hidden: false,
    season: "summer and fall; Rim Drive is snowbound much of the year",
    why: "The caldera loop road strings together overlook after overlook, and the short climb to the Watchman fire lookout gives the best cheap-for-the-effort view of Wizard Island and the whole caldera. The Cleetwood Cove trail and boat dock — the only legal route to the water — are shut for a multi-year rehabilitation.",
    links: [{ label: "NPS Rim Drive", url: "https://www.nps.gov/crla/planyourvisit/scenic-rim-drive.htm" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Green Lakes and South Sister", kind: "trail", region: "OR", park: null,
    interests: ["trail", "summit", "view", "water", "snow"], cls: 2, exposure: 1, hidden: false,
    permit: true, permitKind: "Central Cascades Wilderness Permit, advance reservation",
    why: "The headline hikes of the Three Sisters Wilderness — glacial lakes under Broken Top, and a walk-up volcano summit with a crater lake on top. Both sit inside a permit programme that caps day and overnight use in summer and early fall, so this is not a spontaneous trip.",
    links: [{ label: "Recreation.gov", url: "https://www.recreation.gov/ticket/facility/300009" }, { label: "USFS trailhead", url: "https://fs.usda.gov/r06/deschutes/recreation/devils-lake-south-sister-trailhead" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Smith Rock · Misery Ridge and Monkey Face", kind: "route", region: "OR", park: null,
    interests: ["climb", "trail", "scramble", "view"], cls: 2, exposure: 2, hidden: false,
    season: "shoulder seasons; summer bakes",
    why: "The birthplace of American sport climbing, and the hiking is nearly as good as the routes — Misery Ridge switchbacks up to a Cascade panorama and drops you beside the tuff spire of Monkey Face. Watch for seasonal raptor closures on some walls.",
    links: [{ label: "SummitPost", url: "https://www.summitpost.org/smith-monkey-face/151478" }, { label: "Oregon Hikers", url: "https://www.oregonhikers.org/field_guide/Misery_Ridge_Loop_Hike" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Painted Hills and Blue Basin", kind: "geology", region: "OR", park: null,
    interests: ["geology", "trail", "view", "history", "dark"], cls: 1, exposure: 0, hidden: true,
    why: "Banded claystone hills and a blue-green badlands amphitheatre full of fossil beds, in a corner of eastern Oregon most visitors drive past entirely. Late-day light is when the colour turns on; the units are widely separated so treat it as a driving day, and check status because the Blue Basin overlook loop has been closed by slides.",
    links: [{ label: "NPS Painted Hills", url: "https://www.nps.gov/joda/planyourvisit/ptd-hills-unit.htm" }, { label: "NPS Blue Basin", url: "https://home.nps.gov/thingstodo/blue-basin-overlook-trail.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Ice Lake and the Eagle Cap Wilderness", kind: "lake", region: "OR", park: null,
    interests: ["trail", "water", "view", "camp", "summit", "fish"], cls: 2, exposure: 1, hidden: true,
    permit: true, permitKind: "free self-issue",
    why: "Oregon's biggest wilderness is granite, U-shaped glacial valleys and dozens of alpine lakes, and Ice Lake in its basin above Wallowa Lake is the one people come back for — plus a springboard for the Matterhorn and Eagle Cap itself. The high trails are snowbound into midsummer.",
    links: [{ label: "USFS Eagle Cap", url: "https://www.fs.usda.gov/r06/wallowa-whitman/recreation/eagle-cap-wilderness" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Joseph and Wallowa Lake", kind: "town", region: "OR", park: null,
    interests: ["town", "food", "view", "water", "history"], cls: null, exposure: null, hidden: true,
    why: "A bronze-foundry ranch town at the foot of peaks locals call the Switzerland of America, and the natural base for anything in the Wallowas — with Terminal Gravity's shaded beer garden in neighbouring Enterprise as the standard post-hike stop. It is a genuinely long drive from anywhere, which is exactly why it stays quiet.",
    links: [{ label: "Travel Oregon", url: "https://traveloregon.com/things-to-do/destinations/lakes-reservoirs/road-trip-enterprise-and-joseph/" }, { label: "Terminal Gravity", url: "https://terminalgravitybrewing.com/eagle-cap" }], inferred: [] },

  /* ═══ IDAHO ══════════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Alice Lake and Sawtooth Lake", kind: "lake", region: "ID", park: null,
    interests: ["trail", "water", "camp", "view", "fish", "dark"], cls: 2, exposure: 1, hidden: true,
    permit: true, permitKind: "free self-registered",
    why: "The two signature basins of the Sawtooth Wilderness: Alice under the spire of El Capitan, reached from Pettit Lake, and the big shelf lake above Iron Creek that stays frozen into early summer. Campsites near the shorelines are regulated, and snow sticks on the passes late.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/r04/sawtooth/recreation/sawtooth-wilderness" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Goldbug Hot Springs", kind: "hot_spring", region: "ID", park: null,
    interests: ["water", "trail", "view", "camp"], cls: 2, exposure: 1, hidden: true,
    why: "A tiered set of waterfall-fed soaking pools up Warm Spring Creek south of Salmon, reached by a steep, sun-exposed climb that keeps the crowds honest. BLM-managed with no facilities, the lower pools run scalding where the source enters, and the trailhead crosses private land so staying on the route matters.",
    links: [{ label: "BLM", url: "https://www.blm.gov/visit/goldbug-hot-springs" }, { label: "Idaho Hot Springs", url: "http://www.idahohotsprings.com/destinations/goldbug/index.htm" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Middle Fork of the Salmon River", kind: "route", region: "ID", park: null,
    interests: ["paddle", "water", "fish", "camp", "history", "dark"], cls: null, exposure: 2, hidden: true,
    permit: true, permitKind: "Four Rivers Lottery",
    why: "A free-flowing wilderness float through the Frank Church with whitewater, riverside hot springs, cutthroat on dry flies, pictographs and no roads — widely treated as the best multi-day river trip in the country. Private launches in the high-use season are allocated by lottery each winter and the odds are long, so most people go with an outfitter.",
    links: [{ label: "USFS", url: "https://www.fs.usda.gov/r04/salmon-challis/recreation/epic-adventures/middle-fork-salmon-river" }, { label: "Recreation.gov", url: "https://www.recreation.gov/permits/234623" }], inferred: ["exposure"] },

  { batch: "2026-08-24-west", name: "Stanley and the Central Idaho Dark Sky Reserve", kind: "town", region: "ID", park: null,
    interests: ["town", "dark", "view", "fish", "food", "camp"], cls: null, exposure: null, hidden: true,
    season: "most businesses mid-May to October",
    why: "A dirt-street town of barely a hundred people with the Sawtooths standing straight up behind it, the Salmon River through the middle, and the first gold-tier International Dark Sky Reserve in the United States overhead. Lodging is scarce and books out, and winter nights here are among the coldest in the country.",
    links: [{ label: "DarkSky International", url: "https://darksky.org/places/central-idaho-dark-sky-reserve/" }, { label: "Stanley Chamber", url: "https://stanleycc.org/eat/" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Stanley Baking Company & Cafe", kind: "food", region: "ID", park: null,
    interests: ["food", "town"], cls: null, exposure: null, hidden: true,
    season: "seasonal, mornings only",
    why: "A one-storey log cabin with a wraparound porch aimed straight at the Sawtooths, and the breakfast every Stanley trip report mentions — the line out the door is treated locally as part of the experience. Build your trailhead start around it rather than the reverse.",
    links: [{ label: "Stanley Baking Co.", url: "https://stanleybakingco.com/about/" }, { label: "Sun Valley Magazine", url: "https://sunvalleymag.com/articles/baking-the-dream/" }], inferred: [] },

  /* ═══ MONTANA ════════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Highline Trail from Logan Pass", kind: "trail", region: "MT", park: "Glacier National Park",
    interests: ["trail", "view", "snow", "camp"], cls: 1, exposure: 3, hidden: false,
    permit: true, permitKind: "shuttle ticket for longer hikes from Logan Pass",
    season: "after Going-to-the-Sun Road fully opens",
    why: "The Garden Wall traverse along the Continental Divide is the hike people fly to Montana for, with a chalet at the far end and a spur climbing to a glacier overlook. Sustained cliff-edge walking with a cable handline on the opening section.",
    links: [{ label: "NPS trailhead", url: "https://www.nps.gov/places/highline-trailhead.htm" }, { label: "NPS advisory", url: "https://www.nps.gov/glac/learn/news/news11-58.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Grinnell Glacier, Many Glacier", kind: "trail", region: "MT", park: "Glacier National Park",
    interests: ["trail", "water", "view", "snow"], cls: 1, exposure: 2, hidden: false,
    season: "upper section opens late once snow and ice clear",
    why: "A ledge trail above two turquoise lakes to a meltwater pool at the toe of a shrinking glacier — the other hike everyone ranks alongside the Highline, and the best grizzly and bighorn corridor in the park. The boat shuttles across the lower lakes cut the walk considerably if you can get seats.",
    links: [{ label: "NPS", url: "https://www.nps.gov/glac/planyourvisit/hikingmanyglacier.htm" }, { label: "Earth Trekkers", url: "https://www.earthtrekkers.com/hike-grinnell-glacier-national-park/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "The Beaten Path, Absaroka-Beartooth Wilderness", kind: "route", region: "MT", park: null,
    interests: ["trail", "camp", "water", "view", "fish", "snow"], cls: 2, exposure: 1, hidden: true,
    season: "high passes hold snow into midsummer",
    why: "A point-to-point traverse of the Beartooth plateau from East Rosebud to Cooke City, stringing together more than a dozen alpine lakes and waterfalls mostly above the trees. No permit needed, which is rare for something this good — the shuttle logistics and the car swap are what keep it uncrowded; serious grizzly country.",
    links: [{ label: "Hiking Project", url: "https://www.hikingproject.com/trail/7004180/the-beaten-path" }, { label: "TrailGroove", url: "https://www.trailgroove.com/blogs/entry/388-hiking-the-beaten-path-absaroka-beartooth-wilderness/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Madison River · Three Dollar Bridge and Bear Trap Canyon", kind: "fishing", region: "MT", park: null,
    interests: ["fish", "water", "trail", "view"], cls: null, exposure: null, hidden: false,
    why: "The long continuous riffle below Quake Lake is routinely called the best trout stream in Montana, and the state access at Three Dollar Bridge is wade-only water with a strong brown population; downstream, Bear Trap Canyon runs through designated wilderness. Walk-wade-only regulations apply and hoot-owl closures can shut afternoon fishing in hot, low-water summers.",
    links: [{ label: "Montana FWP", url: "https://myfwp.mt.gov/fishMT/fas/39754533" }, { label: "Western Rivers Conservancy", url: "https://www.westernrivers.org/discover/river-of-the-month/madison-river" }], inferred: [] },

  /* ═══ WYOMING ════════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Paintbrush Canyon – Cascade Canyon Loop", kind: "loop", region: "WY", park: "Grand Teton National Park",
    interests: ["trail", "view", "snow", "camp", "scramble"], cls: 2, exposure: 2, hidden: false,
    permit: true, permitKind: "backcountry permit, January early-access window",
    season: "divide holds snow into midsummer — axe and traction",
    why: "The park's marquee big day or overnight: up one canyon past Holly Lake, over a high divide facing Mount Moran, then down the other side under the Grand itself. The Park Service is explicit that the divide can be dangerous early season, so stop at the Jenny Lake ranger station first.",
    links: [{ label: "NPS", url: "https://www.nps.gov/thingstodo/paintbrushcascade.htm" }, { label: "Teton Hiking Trails", url: "https://www.tetonhikingtrails.com/paintbrush-cascade-canyon-loop.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Lamar Valley", kind: "viewpoint", region: "WY", park: "Yellowstone National Park",
    interests: ["view", "history", "dark", "camp"], cls: 1, exposure: 0, hidden: false,
    why: "The broad glacial valley in Yellowstone's northeast corner is the most reliable large-mammal watching in the lower forty-eight — bison herds, pronghorn, grizzlies and the park's best odds on wolves, often in one morning. Go at first light or dusk with a spotting scope; the northeast road corridor is the one that stays plowed year-round.",
    links: [{ label: "NPS", url: "https://www.nps.gov/places/000/lamar-valley-wildlife-watching.htm" }, { label: "Yellowstone Park", url: "https://www.yellowstonepark.com/things-to-do/wildlife/lamar-hayden-valley/" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Grand Prismatic Overlook via Fairy Falls", kind: "viewpoint", region: "WY", park: "Yellowstone National Park",
    interests: ["trail", "view", "geology", "water"], cls: 1, exposure: 0, hidden: false,
    why: "The only legal on-foot aerial view of Grand Prismatic's colour bands, on a short climb from the Fairy Falls trailhead, with a tall plunge waterfall further along the same flat trail. Mid-morning on a cool day means steam blots out the whole spring, so aim for warm afternoon light.",
    links: [{ label: "NPS", url: "https://www.nps.gov/places/000/fairy-falls-trailhead-ok5.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Cirque of the Towers, Wind River Range", kind: "camp", region: "WY", park: null,
    interests: ["climb", "scramble", "trail", "camp", "view", "fish"], cls: 3, exposure: 2, hidden: true,
    season: "late season to dodge mosquitoes and snow",
    why: "A ring of granite spires around Lonesome Lake reached over Jackass Pass from Big Sandy — the destination that made the Winds a climbers' pilgrimage, with Pingora as the trophy. No quota permit, but overuse has brought real camping restrictions including a wide no-camping buffer around Lonesome Lake, and the approach road is long dirt.",
    links: [{ label: "USFS Popo Agie", url: "https://www.fs.usda.gov/r02/shoshone/recreation/popo-agie-wilderness" }], inferred: ["cls", "exposure"] },

  /* ═══ CALIFORNIA ═════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Half Dome via the Cables", kind: "peak", region: "CA", park: "Yosemite National Park",
    interests: ["summit", "scramble", "view", "trail"], cls: 1, exposure: 3, hidden: false,
    permit: true, permitKind: "lottery",
    season: "cables up in the snow-free season only",
    why: "The signature Yosemite objective, finishing on a bolted cable ladder up bare granite above the valley floor. Access is strictly rationed: a preseason spring lottery plus a daily lottery entered two days ahead, so plan the permit before you plan the trip.",
    links: [{ label: "Recreation.gov", url: "https://www.recreation.gov/permits/234652" }, { label: "The Big Outside", url: "https://thebigoutside.com/hiking-half-dome-how-to-do-it-right-and-get-a-permit/" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Mount Whitney Trail from Whitney Portal", kind: "route", region: "CA", park: "Sequoia National Park",
    interests: ["summit", "trail", "view", "snow"], cls: 1, exposure: 2, hidden: false,
    permit: true, permitKind: "lottery with daily quota",
    season: "snow-free window in summer and early fall",
    why: "The highest summit in the lower forty-eight by its walk-up trail, starting in Inyo National Forest and topping out inside the park. Both day-use and overnight permits come through a winter-spring lottery with a hard daily quota.",
    links: [{ label: "Inyo National Forest", url: "https://www.fs.usda.gov/r05/inyo/wilderness/mount-whitney" }, { label: "Recreation.gov", url: "https://www.recreation.gov/permits/445860" }], inferred: ["exposure"] },

  { batch: "2026-08-24-west", name: "Giant Forest and Moro Rock", kind: "viewpoint", region: "CA", park: "Sequoia National Park",
    interests: ["view", "trail", "geology", "history"], cls: 1, exposure: 2, hidden: false,
    why: "The densest concentration of giant sequoias anywhere, stitched together by the Congress Trail and Crescent Meadow, with a staircase up a granite dome that delivers the best view-for-effort ratio in either park. Winter brings chain controls and periodic road restrictions on the approach.",
    links: [{ label: "National Park Foundation", url: "https://www.nationalparks.org/connect/blog/7-cant-miss-activities-sequoia-and-kings-canyon-national-parks" }, { label: "Outside", url: "https://www.outsideonline.com/adventure-travel/national-parks/sequoia-kings-canyon-national-park-guide/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Mist Falls and the Rae Lakes Loop", kind: "loop", region: "CA", park: "Kings Canyon National Park",
    interests: ["water", "trail", "camp", "view"], cls: 1, exposure: 1, hidden: false,
    permit: true, permitKind: "wilderness permit with quota",
    season: "Cedar Grove road is seasonal",
    why: "From Road's End in Cedar Grove, a day hike to one of the park's biggest cascades doubles as the first leg of what many regard as the finest week-long loop in the Sierra. Bear canisters are required.",
    links: [{ label: "NPS travel blog", url: "https://www.nps.gov/articles/000/travel-blog-sequoia-kings-canyon-national-parks.htm" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Zabriskie Point and Badwater Basin", kind: "viewpoint", region: "CA", park: "Death Valley National Park",
    interests: ["view", "geology", "dark", "history"], cls: 1, exposure: 0, hidden: false,
    season: "cool months only",
    why: "If you only make one stop in Death Valley, the eroded badlands overlook at sunrise is the one everybody names, and the salt flats below it are the lowest ground in North America. Summer heat here is genuinely dangerous and rangers discourage hiking at low elevation.",
    links: [{ label: "Earth Trekkers", url: "https://www.earthtrekkers.com/best-things-to-do-in-death-valley-national-park/" }, { label: "National Geographic", url: "https://www.nationalgeographic.com/travel/national-parks/article/death-valley-activities" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Ryan Mountain", kind: "peak", region: "CA", park: "Joshua Tree National Park",
    interests: ["summit", "view", "trail", "climb"], cls: 1, exposure: 1, hidden: false,
    season: "cool season",
    why: "A short, steep staircase of a trail to the best all-around panorama in the park, with the big San Bernardino and San Jacinto summits floating beyond the Joshua tree basins. No shade and no water on the climb.",
    links: [{ label: "Outside", url: "https://www.outsideonline.com/adventure-travel/destinations/north-america/best-hikes-joshua-tree/" }, { label: "HikingGuy", url: "https://hikingguy.com/hike/hiking-trails/joshua-tree-hikes/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Bumpass Hell", kind: "geology", region: "CA", park: "Lassen Volcanic National Park",
    interests: ["geology", "trail", "view", "water"], cls: 1, exposure: 0, hidden: false,
    season: "typically mid-summer through fall",
    why: "The park's largest hydrothermal basin, a boardwalk through boiling pools, mudpots and sulphur vents set in an alpine bowl. The trail is buried by snow much of the year, so confirm status before driving the park highway.",
    links: [{ label: "NPS", url: "https://www.nps.gov/thingstodo/hikebumpasshell.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "High Peaks and Condor Gulch Loop", kind: "loop", region: "CA", park: "Pinnacles National Park",
    interests: ["scramble", "view", "trail", "climb"], cls: 2, exposure: 2, hidden: false,
    season: "best in the cool, green months",
    why: "Railings and steps carved into volcanic spires, with a real chance of California condors overhead, closed out by the talus caves and reservoir near Bear Gulch. The caves shut periodically for bat maternity season or high water.",
    links: [{ label: "NPS", url: "https://www.nps.gov/thingstodo/pinnacles-hike-condor-gulch-trail-high-peaks-trail.htm" }, { label: "Earth Trekkers", url: "https://www.earthtrekkers.com/high-peaks-trail-loop-pinnacles/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Santa Cruz Island sea caves and Potato Harbor", kind: "route", region: "CA", park: "Channel Islands National Park",
    interests: ["paddle", "water", "view", "camp"], cls: null, exposure: 1, hidden: false,
    why: "Paddle a honeycomb of sea caves out of Scorpion Anchorage, then walk the bluff to a turquoise cove full of seals and sea lions. Everything hinges on the concessionaire boat and the swell, so book the crossing early and expect trips to be cancelled in rough conditions.",
    links: [{ label: "Channel Islands Kayaking", url: "https://www.islandkayaking.com/kayaking/" }, { label: "Earth Trekkers", url: "https://www.earthtrekkers.com/one-day-in-channel-islands/" }], inferred: ["exposure"] },

  { batch: "2026-08-24-west", name: "Fern Canyon and Tall Trees Grove", kind: "trail", region: "CA", park: "Redwood National Park",
    interests: ["water", "trail", "view", "history"], cls: 1, exposure: 0, hidden: false,
    permit: true, permitKind: "free day-use permits, advance reservation",
    why: "A fern-draped slot canyon on the Gold Bluffs coast and, inland, a hushed grove of the tallest trees on earth reached through a locked gate. The Gold Bluffs permit is required through the busy season and the grove permit year-round.",
    links: [{ label: "NPS permits", url: "https://home.nps.gov/redw/planyourvisit/permits.htm" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Travertine Hot Springs", kind: "hot_spring", region: "CA", park: null,
    interests: ["water", "view", "geology"], cls: 1, exposure: 0, hidden: true,
    why: "Mineral pools perched on a travertine ridge outside Bridgeport with a straight-on view of the Sierra crest, reached by a short dirt road. BLM land with no facilities and clothing-optional norms, and the access road gets rough and snowy off-season.",
    links: [{ label: "Mono County", url: "https://www.monocounty.org/places-to-go/hot-springs/" }, { label: "Sunset", url: "https://sunset.com/travel/california/california-eastern-sierra-hot-springs" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Wild Willy's Hot Springs", kind: "hot_spring", region: "CA", park: null,
    interests: ["water", "view", "dark"], cls: 1, exposure: 0, hidden: true,
    why: "The Long Valley classic: a boardwalk across sagebrush meadow to soaking pools with the Sierra on one side and open desert on the other, magic after dark. Dirt access roads, no services, and a fragile meadow that land managers ask soakers to stay on the boardwalk to protect.",
    links: [{ label: "Mono County", url: "https://www.monocounty.org/places-to-go/hot-springs/" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Alabama Hills and Mobius Arch", kind: "geology", region: "CA", park: null,
    interests: ["geology", "view", "camp", "dark", "history"], cls: 1, exposure: 0, hidden: false,
    why: "A maze of weathered granite boulders and natural arches west of Lone Pine, with Mount Whitney framed dead-centre through the most photographed of them, and a graded dirt loop past a century of Western film locations. Now a National Scenic Area, so dispersed camping is regulated.",
    links: [{ label: "BLM", url: "https://www.blm.gov/visit/mobius-arch-loop-trail" }, { label: "Visit Bishop", url: "https://bishopvisitor.com/the-alabama-hills-a-quick-guide/" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Mono Lake South Tufa", kind: "geology", region: "CA", park: null,
    interests: ["geology", "view", "water", "dark", "history"], cls: 1, exposure: 0, hidden: false,
    why: "Limestone spires rising out of an ancient alkaline lake, walkable on a short interpretive trail that explains the water-diversion fight that nearly drained it. Free ranger-led tufa walks in summer, and sunrise light that photographers plan whole trips around.",
    links: [{ label: "CA State Parks", url: "https://www.parks.ca.gov/?page_id=514" }, { label: "CalWild", url: "https://www.calwild.org/exploring-the-mono-basin-national-forest-scenic-area/" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Lost Coast Trail, King Range Wilderness", kind: "trail", region: "CA", park: null,
    interests: ["water", "camp", "trail", "view"], cls: 2, exposure: 2, hidden: false,
    permit: true, permitKind: "quota, released months ahead",
    why: "Black-sand beach walking below mountains that rise straight out of the surf, on the stretch of California too rugged for a highway. Bear canisters are mandatory, and several sections are only passable in a low-tide window that some dates never provide.",
    links: [{ label: "BLM", url: "https://www.blm.gov/visit/lost-coast-trail" }, { label: "Recreation.gov", url: "https://www.recreation.gov/permits/445864" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Canyon Creek Lakes, Trinity Alps", kind: "lake", region: "CA", park: null,
    interests: ["water", "camp", "trail", "fish", "view"], cls: 2, exposure: 1, hidden: true,
    permit: true, permitKind: "free self-issue",
    why: "Granite basins, waterfall-strung creeks and rock-ringed lakes that read like the High Sierra with a fraction of the traffic, which is why Northern California backpackers guard it. Campfires are banned near the lakes, and snow lingers into early summer.",
    links: [{ label: "Northern California Hiking Trails", url: "https://northerncaliforniahikingtrails.com/blog/2014/06/26/canyon-creek-lakes-trinity-alps-boulder-creek/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Bishop", kind: "town", region: "CA", park: null,
    interests: ["town", "climb", "fish", "food", "camp"], cls: null, exposure: null, hidden: false,
    why: "The Eastern Sierra's practical basecamp: the largest supply town on the highway, with world-class bouldering in the Buttermilks and volcanic tablelands minutes out of downtown and wild-trout water on the lower Owens open year-round. Cell service dies fast once you leave pavement, so download maps in town.",
    links: [{ label: "Visit Bishop", url: "https://bishopvisitor.com/rock-climbing-bouldering/" }, { label: "Mountain Project", url: "https://www.mountainproject.com/area/105876411/buttermilk-country" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Whoa Nellie Deli, Tioga Gas Mart", kind: "food", region: "CA", park: null,
    interests: ["food", "town"], cls: null, exposure: null, hidden: false,
    season: "seasonal, tied to Tioga Pass",
    why: "The most famous gas-station kitchen in California, sitting at the junction below Tioga Pass and Mono Lake, known for fish tacos, lobster taquitos and buffalo meatloaf eaten at picnic tables with a Sierra backdrop.",
    links: [{ label: "Whoa Nellie Deli", url: "https://www.whoanelliedeli.com/" }, { label: "SFGATE", url: "https://www.sfgate.com/travel/article/eastern-sierra-gas-station-ahi-17478154.php" }], inferred: [] },

  { batch: "2026-08-24-west", name: "Erick Schat's Bakkery, Bishop", kind: "food", region: "CA", park: null,
    interests: ["food", "town", "history"], cls: null, exposure: null, hidden: false,
    why: "The mandatory highway stop in Bishop, baking its Basque-rooted original sheepherder bread in stone hearth ovens and moving an absurd volume of loaves to hikers and skiers heading either direction. Expect a line, and go early for the pastries.",
    links: [{ label: "Schat's", url: "https://schatsbakery.com/" }, { label: "Atlas Obscura", url: "https://www.atlasobscura.com/places/erick-schat-s-bakkery" }], inferred: [] },

  /* ═══ NEVADA ═════════════════════════════════════════════════════════════ */
  { batch: "2026-08-24-west", name: "Wheeler Peak and the Bristlecone Grove", kind: "peak", region: "NV", park: "Great Basin National Park",
    interests: ["summit", "trail", "dark", "geology", "view"], cls: 2, exposure: 1, hidden: false,
    season: "upper road snowbound much of the year",
    why: "Nevada's quiet alpine crown: a scenic road climbing through life zones to a grove of bristlecone pines among the oldest living things on the planet, a remnant rock glacier below, and Lehman Caves tours down at the base. An International Dark Sky Park with a fall astronomy festival; cave tours sell out.",
    links: [{ label: "NPS", url: "https://www.nps.gov/grba/" }, { label: "Travel Nevada", url: "https://travelnevada.com/parks-recreational-areas/great-basin-national-park/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Calico Tanks, Red Rock Canyon", kind: "trail", region: "NV", park: null,
    interests: ["scramble", "view", "geology", "climb", "water"], cls: 2, exposure: 1, hidden: false,
    permit: true, permitKind: "timed-entry for the scenic drive in cool season",
    why: "A scramble up a red-and-white sandstone wash to a natural rock catchment, ending on a lip with the Las Vegas Strip laid out below. Nearby Ice Box Canyon holds shade and a seasonal waterfall when the rest of the desert bakes.",
    links: [{ label: "BLM", url: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon" }, { label: "HikingGuy", url: "https://hikingguy.com/hiking-trails/las-vegas-hikes/calico-tanks-trail-red-rock-canyon/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Fire Wave and White Domes, Valley of Fire", kind: "geology", region: "NV", park: null,
    interests: ["geology", "view", "trail", "history"], cls: 1, exposure: 0, hidden: false,
    season: "Fire Wave route closes through the hottest months",
    why: "Nevada's oldest state park: candy-striped sandstone, a short slot canyon on the White Domes loop, and Basketmaker and Pueblo petroglyph panels at Atlatl Rock. Low sun is the only light that does the colour justice.",
    links: [{ label: "Nevada State Parks", url: "https://parks.nv.gov/parks/valley-of-fire" }, { label: "Travel Nevada", url: "https://travelnevada.com/parks-recreational-areas/valley-of-fire-state-park/" }], inferred: ["cls"] },

  { batch: "2026-08-24-west", name: "Ruby Crest Trail and Lamoille Canyon", kind: "ridge", region: "NV", park: null,
    interests: ["summit", "trail", "camp", "fish", "view"], cls: 2, exposure: 1, hidden: true,
    season: "high country holds snow late; byway closes in winter",
    why: "Locals call the glacier-carved canyon above Elko the Yosemite of Nevada, and the crest trail running the spine of the Rubies strings together alpine lakes and native trout water with almost nobody on it.",
    links: [{ label: "Travel Nevada", url: "https://travelnevada.com/outdoor-recreation/ruby-crest-national-recreation-trail/" }, { label: "Halfway Anywhere", url: "https://www.halfwayanywhere.com/united-states/nevada/ruby-crest-trail-backpacking-guide/" }], inferred: ["cls", "exposure"] },

  { batch: "2026-08-24-west", name: "Baker, Nevada", kind: "town", region: "NV", park: null,
    interests: ["town", "dark", "food", "camp"], cls: null, exposure: null, hidden: true,
    why: "A tiny, funky outpost at the gate of Great Basin National Park and the natural basecamp for its caves, bristlecones and famously dark skies, with a retro motel, general store and an adjoining pizza-and-burger spot. Services are minimal and seasonal, so fuel up and check hours before rolling in.",
    links: [{ label: "Travel Nevada", url: "https://travelnevada.com/cities/baker/" }, { label: "Stargazer Inn", url: "https://stargazernevada.com/" }], inferred: [] },
];
