// Per-state card content. Two kinds of thing live here and they are held to different standards.
//
// `hp` — the state high point: name, elevation in feet, and summit coordinates. Sourced from
//        Wikipedia's "List of U.S. states and territories by elevation" table, transcribed, not
//        estimated. If a number here is wrong it is a transcription bug, not an invention.
// `marks` — named landmarks. Names only, deliberately no distances, prices or elevations, so
//        there is nothing in this list that can be silently made up. They exist to make an
//        unvisited state read as an invitation instead of a blank slab.
//
// Parks are NOT listed here. They are derived at runtime from parks.js so the two can never drift.

export const STATE = {
  AL: { name: "Alabama", hp: ["Cheaha Mountain", 2405, 33.4854, -85.8086], marks: ["Gulf Shores", "Little River Canyon", "Cheaha State Park", "Birmingham Civil Rights District"] },
  AK: { name: "Alaska", hp: ["Denali", 20310, 63.0690, -151.0063], marks: ["Denali", "Kenai Fjords", "Glacier Bay", "Inside Passage", "Brooks Range"] },
  AZ: { name: "Arizona", hp: ["Humphreys Peak", 12637, 35.3464, -111.6780], marks: ["Grand Canyon", "Antelope Canyon", "Monument Valley", "Sedona red rocks", "Havasu Falls"] },
  AR: { name: "Arkansas", hp: ["Mount Magazine", 2753, 35.1671, -93.6447], marks: ["Hot Springs", "Buffalo National River", "Ouachita Mountains", "Crater of Diamonds"] },
  CA: { name: "California", hp: ["Mount Whitney", 14505, 36.5786, -118.2924], marks: ["Yosemite Valley", "Big Sur", "Lake Tahoe", "Mono Lake", "Point Reyes", "Alabama Hills"] },
  CO: { name: "Colorado", hp: ["Mount Elbert", 14440, 39.1178, -106.4453], marks: ["Maroon Bells", "Great Sand Dunes", "Black Canyon of the Gunnison", "Independence Pass", "Garden of the Gods", "Trail Ridge Road"] },
  CT: { name: "Connecticut", hp: ["Mount Frissell, south slope", 2386, 42.0496, -73.4828], marks: ["Litchfield Hills", "Mystic Seaport", "Connecticut River valley"] },
  DE: { name: "Delaware", hp: ["Ebright Azimuth", 449, 39.8360, -75.5222], marks: ["Cape Henlopen", "Bombay Hook", "Brandywine Valley"] },
  DC: { name: "District of Columbia", hp: ["Point Reno", 414, 38.9517, -77.0760], marks: ["National Mall", "Tidal Basin", "Rock Creek Park", "Smithsonian museums"] },
  FL: { name: "Florida", hp: ["Britton Hill", 345, 30.9848, -86.2824], marks: ["Everglades", "Florida Keys", "Dry Tortugas", "Crystal River springs"] },
  GA: { name: "Georgia", hp: ["Brasstown Bald", 4784, 34.8744, -83.8111], marks: ["Cumberland Island", "Okefenokee Swamp", "Tallulah Gorge", "Blue Ridge foothills"] },
  HI: { name: "Hawaii", hp: ["Mauna Kea", 13803, 19.8207, -155.4680], marks: ["Kilauea", "Haleakala crater", "Na Pali Coast", "Road to Hana", "Waipio Valley"] },
  ID: { name: "Idaho", hp: ["Borah Peak", 12668, 44.1374, -113.7811], marks: ["Sawtooth Range", "Craters of the Moon", "Hells Canyon", "Sun Valley"] },
  IL: { name: "Illinois", hp: ["Charles Mound", 1235, 42.5041, -90.2398], marks: ["Chicago lakefront", "Shawnee National Forest", "Starved Rock", "Garden of the Gods (Shawnee)"] },
  IN: { name: "Indiana", hp: ["Hoosier Hill", 1257, 40.0012, -84.8487], marks: ["Indiana Dunes", "Brown County hills", "Indianapolis Motor Speedway"] },
  IA: { name: "Iowa", hp: ["Hawkeye Point", 1671, 43.4602, -95.7089], marks: ["Loess Hills", "Effigy Mounds", "Maquoketa Caves"] },
  KS: { name: "Kansas", hp: ["Mount Sunflower", 4041, 39.0220, -102.0371], marks: ["Flint Hills", "Tallgrass Prairie Preserve", "Monument Rocks"] },
  KY: { name: "Kentucky", hp: ["Black Mountain", 4139, 36.9142, -82.8938], marks: ["Mammoth Cave", "Red River Gorge", "Cumberland Gap", "Land Between the Lakes"] },
  LA: { name: "Louisiana", hp: ["Driskill Mountain", 535, 32.4249, -92.8967], marks: ["French Quarter", "Atchafalaya Basin", "Kisatchie Hills", "Avery Island"] },
  ME: { name: "Maine", hp: ["Mount Katahdin", 5270, 45.9044, -68.9214], marks: ["Acadia", "Katahdin and the Hundred-Mile Wilderness", "Portland Head Light", "Baxter State Park"] },
  MD: { name: "Maryland", hp: ["Hoye-Crest", 3370, 39.2374, -79.4855], marks: ["Assateague Island", "Chesapeake Bay", "Antietam", "Deep Creek Lake"] },
  MA: { name: "Massachusetts", hp: ["Mount Greylock", 3489, 42.6373, -73.1659], marks: ["Cape Cod National Seashore", "Freedom Trail", "Berkshires", "Martha's Vineyard"] },
  MI: { name: "Michigan", hp: ["Mount Arvon", 1979, 46.7557, -88.1553], marks: ["Pictured Rocks", "Sleeping Bear Dunes", "Isle Royale", "Mackinac Island", "Porcupine Mountains"] },
  MN: { name: "Minnesota", hp: ["Eagle Mountain", 2302, 47.8974, -90.5606], marks: ["Boundary Waters", "Voyageurs", "North Shore of Lake Superior", "Split Rock Lighthouse"] },
  MS: { name: "Mississippi", hp: ["Woodall Mountain", 807, 34.7877, -88.2416], marks: ["Natchez Trace", "Gulf Islands", "Vicksburg"] },
  MO: { name: "Missouri", hp: ["Taum Sauk Mountain", 1772, 37.5713, -90.7291], marks: ["Gateway Arch", "Ozark National Scenic Riverways", "Elephant Rocks", "Katy Trail"] },
  MT: { name: "Montana", hp: ["Granite Peak", 12807, 45.1635, -109.8076], marks: ["Glacier and Going-to-the-Sun Road", "Beartooth Highway", "Bob Marshall Wilderness", "Missouri Breaks"] },
  NE: { name: "Nebraska", hp: ["Panorama Point", 5432, 41.0077, -104.0314], marks: ["Scotts Bluff", "Chimney Rock", "Sandhills", "Toadstool Geologic Park"] },
  NV: { name: "Nevada", hp: ["Boundary Peak", 13147, 37.8461, -118.3514], marks: ["Great Basin and Wheeler Peak", "Valley of Fire", "Red Rock Canyon", "Extraterrestrial Highway"] },
  NH: { name: "New Hampshire", hp: ["Mount Washington", 6286, 44.2705, -71.3034], marks: ["Presidential Range", "Franconia Notch", "Kancamagus Highway", "White Mountains"] },
  NJ: { name: "New Jersey", hp: ["High Point", 1802, 41.3209, -74.6616], marks: ["Delaware Water Gap", "Pine Barrens", "Cape May", "Sandy Hook"] },
  NM: { name: "New Mexico", hp: ["Wheeler Peak", 13167, 36.5568, -105.4169], marks: ["White Sands", "Carlsbad Caverns", "Bandelier", "Taos and the Rio Grande Gorge", "Bisti Badlands"] },
  NY: { name: "New York", hp: ["Mount Marcy", 5343, 44.1129, -73.9238], marks: ["Adirondack High Peaks", "Niagara Falls", "Letchworth Gorge", "Finger Lakes", "Catskills"] },
  NC: { name: "North Carolina", hp: ["Mount Mitchell", 6684, 35.7649, -82.2651], marks: ["Blue Ridge Parkway", "Great Smoky Mountains", "Outer Banks", "Linville Gorge", "Grandfather Mountain"] },
  ND: { name: "North Dakota", hp: ["White Butte", 3506, 46.3870, -103.3027], marks: ["Theodore Roosevelt National Park", "Little Missouri Badlands", "Maah Daah Hey Trail"] },
  OH: { name: "Ohio", hp: ["Campbell Hill", 1548, 40.3703, -83.7201], marks: ["Cuyahoga Valley", "Hocking Hills", "Lake Erie Islands"] },
  OK: { name: "Oklahoma", hp: ["Black Mesa", 4975, 36.9318, -102.9979], marks: ["Wichita Mountains", "Black Mesa", "Talimena Scenic Drive", "Great Salt Plains"] },
  OR: { name: "Oregon", hp: ["Mount Hood", 11249, 45.3735, -121.6960], marks: ["Crater Lake", "Columbia River Gorge", "Painted Hills", "Smith Rock", "Oregon Coast Highway"] },
  PA: { name: "Pennsylvania", hp: ["Mount Davis", 3213, 39.7860, -79.1768], marks: ["Pine Creek Gorge", "Ohiopyle", "Ricketts Glen", "Gettysburg"] },
  RI: { name: "Rhode Island", hp: ["Jerimoth Hill", 811, 41.8493, -71.7789], marks: ["Newport Cliff Walk", "Block Island", "Narragansett Bay"] },
  SC: { name: "South Carolina", hp: ["Sassafras Mountain", 3554, 35.0651, -82.7773], marks: ["Congaree", "Jocassee Gorges", "Charleston peninsula", "Hunting Island"] },
  SD: { name: "South Dakota", hp: ["Black Elk Peak", 7244, 43.8660, -103.5312], marks: ["Badlands", "Wind Cave", "Black Hills", "Needles Highway", "Custer State Park"] },
  TN: { name: "Tennessee", hp: ["Kuwohi (Clingmans Dome)", 6643, 35.5629, -83.4986], marks: ["Great Smoky Mountains", "Cumberland Plateau gorges", "Roan Highlands", "Nashville"] },
  TX: { name: "Texas", hp: ["Guadalupe Peak", 8751, 31.8915, -104.8607], marks: ["Big Bend", "Guadalupe Mountains", "Palo Duro Canyon", "Hill Country", "Padre Island"] },
  UT: { name: "Utah", hp: ["Kings Peak", 13534, 40.7763, -110.3729], marks: ["The Utah 5", "Monument Valley", "Bonneville Salt Flats", "Uinta Mountains", "Escalante"] },
  VT: { name: "Vermont", hp: ["Mount Mansfield", 4395, 44.5438, -72.8144], marks: ["Green Mountains", "Long Trail", "Lake Champlain", "Smugglers' Notch"] },
  VA: { name: "Virginia", hp: ["Mount Rogers", 5711, 36.6601, -81.5449], marks: ["Shenandoah and Skyline Drive", "Blue Ridge Parkway", "Chincoteague", "Grayson Highlands"] },
  WA: { name: "Washington", hp: ["Mount Rainier", 14400, 46.8529, -121.7604], marks: ["Mount Rainier", "Olympic rainforest and coast", "North Cascades", "San Juan Islands", "Palouse"] },
  WV: { name: "West Virginia", hp: ["Spruce Knob", 4862, 38.6998, -79.5330], marks: ["New River Gorge", "Dolly Sods", "Seneca Rocks", "Blackwater Falls"] },
  WI: { name: "Wisconsin", hp: ["Timms Hill", 1951, 45.4508, -90.1954], marks: ["Apostle Islands", "Door County", "Devil's Lake", "Driftless Area"] },
  WY: { name: "Wyoming", hp: ["Gannett Peak", 13809, 43.1844, -109.6543], marks: ["Yellowstone", "Grand Teton", "Wind River Range", "Devils Tower", "Bighorn Mountains"] },
  // Territories with national parks, so a card exists if she clicks one.
  PR: { name: "Puerto Rico", hp: ["Cerro de Punta", 4390, 18.1722, -66.5917], marks: ["El Yunque", "Old San Juan", "Bioluminescent bays"] },
  VI: { name: "U.S. Virgin Islands", hp: ["Crown Mountain", 1556, 18.3571, -64.9732], marks: ["Virgin Islands National Park", "Trunk Bay", "Buck Island"] },
  AS: { name: "American Samoa", hp: ["Lata Mountain", 3169, -14.2331, -169.4543], marks: ["National Park of American Samoa", "Ofu Beach", "Pola Island"] },
  GU: { name: "Guam", hp: ["Mount Lamlam", 1332, 13.3397, 144.6655], marks: ["Tumon Bay", "War in the Pacific NHP"] },
  MP: { name: "Northern Mariana Islands", hp: ["Mount Agrihan", 3204, 18.7681, 145.6732], marks: ["Managaha", "Marianas Trench Marine Monument"] },
};

// us-atlas full state names → USPS code.
export const ABBR = Object.fromEntries(Object.entries(STATE).map(([k, v]) => [v.name, k]));
// us-atlas spells a few of these differently from the elevation table.
ABBR["District of Columbia"] = "DC";
ABBR["Virgin Islands"] = "VI";
ABBR["Commonwealth of the Northern Mariana Islands"] = "MP";

// Which continent a country sits on, for the globe's continent count. Only the eight she has
// actually been to plus the obvious groupings she is working toward — not a full gazetteer.
export const CONTINENT = {
  "United States": "North America", Canada: "North America", Mexico: "North America",
  Peru: "South America", Japan: "Asia", France: "Europe", Belgium: "Europe",
  Netherlands: "Europe",
};
