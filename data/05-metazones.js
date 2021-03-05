//From https://Github.com/Mj1856/Timezonenames
// and from  https://Github.com/Nodatime/Nodatime/Blob/Master/Data/Cldr/Windowszones-35.xml

// do some ad-hoc compression
const eu = 'Europe/'
const af = 'Africa/'
const am = 'America/'
const au = 'Australia/'
const as = 'Asia/'
const pa = 'Pacific/'

module.exports = [
  //gmt-0, with daylight savings
  {
    std: { name: 'Greenwich Standard Time', abbrev: 'GMT' },
    dl: { name: 'British Summer Time', abbrev: 'BST' },
    alias: ['british', 'britain'],
    pick: eu + 'London',
    offset: 1,
    ids: [eu + 'Guernsey', eu + 'Isle_Of_Man', eu + 'Jersey', eu + 'London']
  },
  {
    std: { name: 'Greenwich Standard Time', abbrev: 'GMT' },
    dl: { name: 'Irish Summer Time', abbrev: 'IST' },
    alias: ['ireland'],
    offset: 1,
    ids: [eu + 'Dublin']
  },

  //gmt-0, no daylight savings
  {
    std: { name: 'Greenwich Standard Time', abbrev: 'GMT' },
    pick: af + 'Freetown',
    alias: ['etc', 'utc'],
    offset: 0,
    ids: [
      af + 'Abidjan',
      af + 'Accra',
      af + 'Bamako',
      af + 'Banjul',
      af + 'Bissau',
      af + 'Conakry',
      af + 'Dakar',
      af + 'Freetown',
      af + 'Lome',
      af + 'Monrovia',
      af + 'Nouakchott',
      af + 'Ouagadougou',
      af + 'Sao_Tome',
      am + 'Danmarkshavn',
      'Antarctica/Troll',
      'Atlantic/Reykjavik',
      'Atlantic/St_Helena',
      'ETC/GMT'
    ]
  },

  //North america
  {
    std: { name: 'Central Standard Time', abbrev: 'CST' },
    dl: { name: 'Central Daylight Time', abbrev: 'CDT' },
    pick: 'Canada/Central',
    offset: -5,
    ids: [
      am + 'Bahia_Banderas',
      am + 'Belize',
      am + 'Chicago',
      am + 'Costa_Rica',
      am + 'El_Salvador',
      am + 'Guatemala',
      am + 'Indiana',
      am + 'Managua',
      am + 'Matamoros',
      am + 'Menominee',
      am + 'Merida',
      am + 'Mexico_City',
      am + 'Monterrey',
      am + 'North_Dakota',
      am + 'North_Dakota',
      am + 'North_Dakota',
      am + 'Rainy_River',
      am + 'Rankin_Inlet',
      am + 'Regina',
      am + 'Resolute',
      am + 'Swift_Current',
      am + 'Tegucigalpa',
      am + 'Winnipeg',
      'Canada/Central'
    ]
  },
  {
    std: { name: 'Mountain Standard Time', abbrev: 'MST' },
    dl: { name: 'Mountain Daylight Time', abbrev: 'MDT' },
    pick: 'Canada/Mountain',
    offset: -6,
    ids: [
      am + 'Boise',
      am + 'Cambridge_Bay',
      am + 'Creston',
      am + 'Dawson_Creek',
      am + 'Denver',
      am + 'Edmonton',
      am + 'Fort_Nelson',
      am + 'Inuvik',
      am + 'Ojinaga',
      am + 'Phoenix',
      am + 'Yellowknife',
      // add mexico
      am + 'Chihuahua',
      am + 'Hermosillo',
      am + 'Mazatlan',
      'Canada/Mountain'
    ]
  },
  {
    std: { name: 'Atlantic Standard Time', abbrev: 'AST' },
    dl: { name: 'Atlantic Daylight Time', abbrev: 'ADT' },
    pick: 'Canada/Atlantic',
    offset: -4,
    ids: [
      am + 'Anguilla',
      am + 'Antigua',
      am + 'Aruba',
      am + 'Barbados',
      am + 'Blanc-sablon',
      am + 'Curacao',
      am + 'Dominica',
      am + 'Glace_Bay',
      am + 'Goose_Bay',
      am + 'Grenada',
      am + 'Guadeloupe',
      am + 'Halifax',
      am + 'Kralendijk',
      am + 'Lower_Princes',
      am + 'Marigot',
      am + 'Martinique',
      am + 'Moncton',
      am + 'Montserrat',
      am + 'Port_Of_Spain',
      am + 'Puerto_Rico',
      am + 'Santo_Domingo',
      am + 'St_Barthelemy',
      am + 'St_Kitts',
      am + 'St_Lucia',
      am + 'St_Thomas',
      am + 'St_Vincent',
      am + 'Thule',
      am + 'Tortola',
      'Atlantic/Bermuda',
      'Canada/Atlantic'
    ]
  },
  {
    std: { name: 'Eastern Standard Time', abbrev: 'EST' },
    dl: { name: 'Eastern Daylight Time', abbrev: 'EDT' },
    pick: 'Canada/Eastern',
    alias: ['eastern', 'east'],
    offset: -5,
    ids: [
      am + 'Cancun',
      am + 'Cayman',
      am + 'Coral_Harbour',
      am + 'Detroit',
      am + 'Grand_Turk',
      am + 'Indiana',
      am + 'Indianapolis',
      am + 'Iqaluit',
      am + 'Jamaica',
      am + 'Kentucky',
      am + 'Louisville',
      am + 'Nassau',
      am + 'New_York',
      am + 'Nipigon',
      am + 'Panama',
      am + 'Pangnirtung',
      am + 'Port-au-prince',
      am + 'Thunder_Bay',
      am + 'Toronto',
      am + 'Montreal',
      'Canada/Eastern'
    ]
  },
  {
    std: { name: 'Pacific Standard Time', abbrev: 'PST' },
    dl: { name: 'Pacific Daylight Time', abbrev: 'PDT' },
    pick: 'Canada/Pacific',
    offset: -7,
    ids: [
      am + 'Dawson',
      am + 'Los_Angeles',
      am + 'Tijuana',
      am + 'Vancouver',
      am + 'Whitehorse',
      'Canada/Pacific'
    ]
  },
  {
    std: { name: 'Alaskan Standard Time', abbrev: 'AHST' },
    dl: { name: 'Alaskan Daylight Time', abbrev: 'AHDT' },
    pick: am + 'Anchorage',
    offset: -8,
    ids: [
      am + 'Anchorage',
      am + 'Juneau',
      am + 'Metlakatla',
      am + 'Nome',
      am + 'Sitka',
      am + 'Yakutat'
    ]
  },
  {
    std: { name: 'Hawaiian Standard Time', abbrev: 'HST' },
    alias: ['aleutian', 'hawaii'],
    pick: pa + 'Honolulu',
    offset: -9,
    ids: [am + 'Adak', pa + 'Honolulu', pa + 'Johnston']
  },
  {
    std: { name: 'Newfoundland Standard Time', abbrev: 'NST' },
    dl: { name: 'Newfoundland Daylight Time', abbrev: 'NDT' },
    pick: am + 'St_Johns',
    offset: -2.5,
    ids: [am + 'St_Johns']
  },

  ///Europe
  {
    std: { name: 'Central European Time', abbrev: 'CET' },
    dl: { name: 'Central European Summer Time', abbrev: 'CEST' },
    alias: ['romance', 'central europe'],
    pick: eu + 'Berlin',
    offset: 1,
    ids: [
      af + 'Algiers',
      af + 'Ceuta',
      af + 'Tunis',
      'arctic/Longyearbyen',
      eu + 'Amsterdam',
      eu + 'Andorra',
      eu + 'Belgrade',
      eu + 'Berlin',
      eu + 'Bratislava',
      eu + 'Brussels',
      eu + 'Budapest',
      eu + 'Busingen',
      eu + 'Copenhagen',
      eu + 'Gibraltar',
      eu + 'Ljubljana',
      eu + 'Luxembourg',
      eu + 'Madrid',
      eu + 'Malta',
      eu + 'Monaco',
      eu + 'Oslo',
      eu + 'Paris',
      eu + 'Podgorica',
      eu + 'Prague',
      eu + 'Rome',
      eu + 'San_Marino',
      eu + 'Sarajevo',
      eu + 'Skopje',
      eu + 'Stockholm',
      eu + 'Tirane',
      eu + 'Vaduz',
      eu + 'Vatican',
      eu + 'Vienna',
      eu + 'Warsaw',
      eu + 'Zagreb',
      eu + 'Zurich'
    ]
  },
  {
    std: { name: 'Eastern European Time', abbrev: 'EET' },
    dl: { name: 'Eastern European Summer Time', abbrev: 'EEST' },
    alias: ['eastern europe'],
    pick: eu + 'Riga',
    offset: 2,
    ids: [
      af + 'Cairo',
      af + 'Tripoli',
      as + 'Amman',
      as + 'Beirut',
      as + 'Damascus',
      as + 'Famagusta',
      as + 'Gaza',
      as + 'Hebron',
      as + 'Nicosia',
      eu + 'Athens',
      eu + 'Bucharest',
      eu + 'Chisinau',
      eu + 'Helsinki',
      eu + 'Kaliningrad',
      eu + 'Kiev',
      eu + 'Mariehamn',
      eu + 'Riga',
      eu + 'Sofia',
      eu + 'Tallinn',
      eu + 'Uzhgorod',
      eu + 'Vilnius',
      eu + 'Zaporozhye'
    ]
  },
  {
    std: { name: 'Western European Time', abbrev: 'WET' },
    dl: { name: 'Western European Summer Time', abbrev: 'WEST' },
    alias: ['western europe'],
    pick: eu + 'Lisbon',
    offset: 1,
    ids: [
      af + 'Casablanca',
      af + 'El_Aaiun',
      'Atlantic/Canary',
      'Atlantic/Faeroe',
      'Atlantic/Madeira',
      eu + 'Lisbon'
    ]
  },
  {
    std: { name: 'Turkey Standard Time', abbrev: 'TRT' },
    alias: ['turkish'],
    pick: eu + 'Istanbul',
    offset: 3,
    ids: [eu + 'Istanbul']
  },
  // samara: [eu + 'Samara', eu + 'Saratov'],

  //Africa
  {
    std: { name: 'East Africa Time', abbrev: 'EAT' },
    alias: ['east african', 'eastern africa'],
    pick: af + 'Nairobi',
    offset: 3,
    ids: [
      af + 'Addis_Ababa',
      af + 'Asmera',
      af + 'Dar_Es_Salaam',
      af + 'Djibouti',
      af + 'Juba',
      af + 'Kampala',
      af + 'Mogadishu',
      af + 'Nairobi',
      'Indian/Antananarivo',
      'Indian/Comoro',
      'Indian/Mayotte'
    ]
  },
  {
    std: { name: 'Central Africa Time', abbrev: 'CAT' },
    pick: af + 'Khartoum',
    alias: ['central africa'],
    offset: 2,
    ids: [
      af + 'Blantyre',
      af + 'Bujumbura',
      af + 'Gaborone',
      af + 'Harare',
      af + 'Khartoum',
      af + 'Kigali',
      af + 'Lubumbashi',
      af + 'Lusaka',
      af + 'Maputo',
      af + 'Windhoek'
    ]
  },
  {
    std: { name: 'South Africa Standard Time', abbrev: 'SAST' },
    alias: ['southern africa', 'south african'],
    pick: af + 'Johannesburg',
    offset: 2,
    ids: [af + 'Johannesburg', af + 'Maseru', af + 'Mbabane']
  },
  {
    std: { name: 'West Africa Standard Time', abbrev: 'WAT' },
    alias: ['western africa', 'west african'],
    pick: af + 'Lagos',
    offset: 1,
    ids: [
      af + 'Bangui',
      af + 'Brazzaville',
      af + 'Douala',
      af + 'Kinshasa',
      af + 'Lagos',
      af + 'Libreville',
      af + 'Luanda',
      af + 'Malabo',
      af + 'Ndjamena',
      af + 'Niamey',
      af + 'Porto-novo'
    ]
  },

  //Australia
  {
    std: { name: 'Australian Central Standard Time', abbrev: 'ACST' },
    dl: { name: 'Australian Central Daylight Time', abbrev: 'ACDT' },
    alias: ['australia central'],
    pick: au + 'Adelaide',
    offset: 9.5,
    ids: [au + 'Adelaide', au + 'Broken_Hill', au + 'Darwin']
  },
  {
    std: { name: 'Australian Eastern Standard Time', abbrev: 'AEST' },
    dl: { name: 'Australian Eastern Daylight Time', abbrev: 'AEDT' },
    alias: ['australia east'],
    pick: au + 'Brisbane',
    offset: 10,
    ids: [
      au + 'Brisbane',
      au + 'Currie',
      au + 'Hobart',
      au + 'Lindeman',
      au + 'Melbourne',
      au + 'Sydney'
    ]
  },
  {
    std: { name: 'Australian Western Standard Time', abbrev: 'AWST' },
    dl: { name: 'Australian Western Daylight Time', abbrev: 'AWDT' },
    alias: ['australia west'],
    pick: au + 'Perth',
    offset: 8,
    ids: ['Antarctica/Casey', au + 'Perth']
  },
  {
    std: { name: 'Australian Central Western Standard Time', abbrev: 'ACWST' },
    alias: ['australia central west'],
    pick: au + 'Eucla',
    offset: 8.75,
    ids: [au + 'Eucla']
  },
  {
    std: { name: 'Lord Howe Standard Time', abbrev: 'LHST' },
    dl: { name: 'Lord Howe Daylight Time', abbrev: 'LHDT' },
    pick: au + 'Lord_Howe',
    offset: 10.5,
    ids: [au + 'Lord_Howe']
  },
  {
    std: { name: 'New Zealand Standard Time', abbrev: 'NZST' },
    dl: { name: 'New Zealand Daylight Time', abbrev: 'NZDT' },
    pick: pa + 'Auckland',
    offset: 12,
    ids: ['Antarctica/Mcmurdo', pa + 'Auckland']
  },
  {
    std: { name: 'Chatham Island Standard Time', abbrev: 'CHAST' },
    dl: { name: 'Chatham Island Daylight Time', abbrev: 'CHADT' },
    pick: pa + 'Chatham',
    offset: 12.75,
    ids: [pa + 'Chatham']
  },

  //Russia
  {
    std: { name: 'Russian Standard Time', abbrev: 'MSK' },
    alias: ['russian'],
    pick: eu + 'Moscow',
    offset: 4,
    ids: [
      eu + 'Astrakhan',
      eu + 'Minsk',
      eu + 'Moscow',
      eu + 'Simferopol',
      eu + 'Ulyanovsk',
      eu + 'Kirov'
    ]
  },
  {
    std: { name: 'Volgograd Time', abbrev: 'VOLT' },
    offset: 4,
    ids: [eu + 'Volgograd']
  },

  //South america
  {
    std: { name: 'Brazil Time', abbrev: 'BRT' },
    alias: ['brasília', 'brasilia', 'brazilian'],
    pick: am + 'Sao_Paulo',
    offset: -3,
    ids: [
      am + 'Araguaina',
      am + 'Bahia',
      am + 'Belem',
      am + 'Fortaleza',
      am + 'Maceio',
      am + 'Recife',
      am + 'Santarem',
      am + 'Sao_Paulo',
      'Brazil/Acre',
      'Brazil/Denoronha',
      'Brazil/East',
      'Brazil/West'
    ]
  },
  {
    std: { name: 'Argentina Time', abbrev: 'ART' },
    alias: ['argentinian'],
    pick: am + 'Buenos_Aires',
    offset: -3,
    ids: [
      am + 'Argentina',
      am + 'Buenos_Aires',
      am + 'Catamarca',
      am + 'Cordoba',
      am + 'Jujuy',
      am + 'Mendoza'
    ]
  },
  {
    std: { name: 'Amazon Time', abbrev: 'AMT' },
    alias: ['amazonian'],
    pick: am + 'Manaus',
    offset: -4,
    ids: [
      am + 'Boa_Vista',
      am + 'Campo_Grande',
      am + 'Cuiaba', //Has dst?
      am + 'Manaus',
      am + 'Porto_Velho'
    ]
  },

  {
    std: { name: 'Easter Island Standard Time', abbrev: 'EAST' },
    dl: { name: 'Easter Island Summer Time', abbrev: 'EASST' },
    offset: -6,
    ids: ['Chile/EasterIsland']
  },
  {
    std: { name: 'Venezuelan Standard Time', abbrev: 'VET' },
    alias: ['venezuela'],
    offset: -4,
    ids: [am + 'Caracas']
  },
  {
    std: { name: 'Paraguay Time', abbrev: 'PYT' },
    dl: { name: 'Paraguay Summer Time', abbrev: 'PYST' },
    offset: -4,
    ids: [am + 'Asuncion']
  },
  {
    std: { name: 'Cuba Standard Time', abbrev: 'CST' },
    dl: { name: 'Cuba Daylight Time', abbrev: 'CDT' },
    alias: ['cuban'],
    offset: -4,
    ids: [am + 'Havana']
  },
  {
    std: { name: 'Bolivia Time', abbrev: 'BOT' },
    alias: ['bolivian'],
    offset: -4,
    ids: [am + 'La_Paz']
  },
  {
    std: { name: 'Colombia Time', abbrev: 'COT' },
    alias: ['colombian'],
    offset: -5,
    ids: [am + 'Bogota']
  },
  {
    std: { name: 'Acre Time', abbrev: 'ACT' },
    pick: null,
    offset: -5,
    ids: [am + 'Eirunepe', am + 'Rio_Branco']
  },
  {
    std: { name: 'Peru Time', abbrev: 'PET' },
    offset: -5,
    ids: [am + 'Lima']
  },
  {
    std: { name: 'Chile Standard Time', abbrev: 'CLST' },
    dl: { name: 'Chile Summer Time', abbrev: 'CLDT' },
    pick: null,
    offset: -3,
    ids: [am + 'Punta_Arenas', am + 'Santiago', 'Antarctica/Palmer']
  },
  {
    std: { name: 'Uruguay Time', abbrev: 'UYT' },
    offset: -3,
    ids: [am + 'Montevideo']
  },
  // argentina_Western: [am + 'Argentina/San_Luis'],
  // french_Guiana: [am + 'Cayenne'],
  // greenland_Western: [am + 'Godthab'],
  // ecuador: [am + 'Guayaquil'],
  // guyana: [am + 'Guyana'],
  // pierre_Miquelon: [am + 'Miquelon'],
  // noronha: [am + 'Noronha'],
  // suriname: [am + 'Paramaribo'],
  // mexico_Northwest: [am + 'Santa_Isabel'],

  //Middle-east
  {
    std: { name: 'Arabic Standard Time', abbrev: 'AST' },
    pick: as + 'Baghdad',
    alias: ['arabic', 'arab'],
    offset: 3,
    ids: [as + 'Aden', as + 'Baghdad', as + 'Bahrain', as + 'Kuwait', as + 'Qatar', as + 'Riyadh']
  },
  {
    std: { name: 'Iran Standard Time', abbrev: 'IRST' },
    dl: { name: 'Iran Daylight Time', abbrev: 'IRDT' },
    alias: ['iranian'],
    pick: as + 'Tehran',
    offset: 4.5,
    ids: [as + 'Tehran']
  },
  {
    std: { name: 'Pakistan Standard Time', abbrev: 'PKT' },
    pick: as + 'Karachi',
    offset: 5,
    ids: [as + 'Karachi']
  },
  {
    std: { name: 'India Standard Time', abbrev: 'IST' },
    alias: ['indian'],
    pick: as + 'Kolkata',
    offset: 5.5,
    ids: [as + 'Kolkata', as + 'Colombo']
  },
  {
    std: { name: 'Indochina Time', abbrev: 'ICT' },
    alias: ['South East Asia'],
    pick: as + 'Bangkok',
    offset: 7,
    ids: [as + 'Bangkok', as + 'Phnom_Penh', as + 'Saigon', as + 'Vientiane']
  },
  {
    std: { name: 'China Standard Time', abbrev: 'CT' }, //cst?
    alias: ['chinese'],
    pick: as + 'Shanghai',
    offset: 8,
    ids: [as + 'Macau', as + 'Shanghai', as + 'Taipei']
  },

  {
    std: { name: 'Alma-Ata Time', abbrev: 'ALMT' },
    pick: as + 'Almaty',
    offset: 6,
    ids: [as + 'Almaty', as + 'Qostanay']
  },
  {
    std: { name: 'Oral Time', abbrev: 'ORAT' },
    pick: as + 'Oral',
    offset: 5,
    ids: [as + 'Aqtau', as + 'Aqtobe', as + 'Atyrau', as + 'Oral', as + 'Qyzylorda']
  },
  {
    std: { name: 'Yakutsk Time', abbrev: 'YAKT' },
    pick: as + 'Yakutsk',
    offset: 9,
    ids: [as + 'Chita', as + 'Khandyga', as + 'Yakutsk']
  },
  {
    std: { name: 'Gulf Standard Time', abbrev: 'GST' },
    pick: as + 'Dubai',
    alias: ['uae'],
    offset: 4,
    ids: [as + 'Dubai', as + 'Muscat']
  },
  {
    std: { name: 'Hong Kong Time', abbrev: 'HKT' },
    offset: 8,
    ids: [as + 'Hong_Kong']
  },
  {
    std: { name: 'Western Indonesian Time', abbrev: 'WIB' },
    alias: ['indonesia'], //most of it
    offset: 7,
    ids: [as + 'Jakarta', as + 'Pontianak', as + 'Jayapura']
  },
  {
    std: { name: 'Central Indonesian Time', abbrev: 'WITA' },
    offset: 8,
    ids: [as + 'Makassar']
  },
  {
    std: { name: 'Israel Daylight Time', abbrev: 'IDT' },
    dl: { name: 'Israel Standard Time', abbrev: 'IST' },
    alias: ['israeli'],
    offset: 3,
    ids: [as + 'Jerusalem']
  },
  {
    std: { name: 'Krasnoyarsk Time', abbrev: 'KRAT' },
    offset: 7,
    ids: [as + 'Krasnoyarsk', as + 'Novokuznetsk', as + 'Barnaul']
  },
  {
    std: { name: 'Malaysia Time', abbrev: 'MYT' },
    offset: 8,
    ids: [as + 'Kuala_Lumpur', as + 'Kuching']
  },
  {
    std: { name: 'Singapore Time', abbrev: 'SGT' },
    offset: 8,
    ids: [as + 'Singapore']
  },
  {
    std: { name: 'Korea Standard Time', abbrev: 'KST' },
    pick: as + 'Seoul',
    alias: ['korean'],
    offset: 9,
    ids: [as + 'Pyongyang', as + 'Seoul']
  },
  {
    std: { name: 'Uzbekistan Time', abbrev: 'UZT' },
    offset: 5,
    ids: [as + 'Samarkand', as + 'Tashkent']
  },
  {
    std: { name: 'Vladivostok Time', abbrev: 'VLAT' },
    pick: as + 'Vladivostok',
    offset: 10,
    ids: [as + 'Ust-nera', as + 'Vladivostok']
  },

  { std: { name: 'Anadyr Time', abbrev: 'ANAT' }, offset: 12, ids: [as + 'Anadyr'] },
  { std: { name: 'Turkmenistan Time', abbrev: 'TMT' }, offset: 5, ids: [as + 'Ashgabat'] },
  { std: { name: 'Azerbaijan Time', abbrev: 'AZT' }, offset: 5, ids: [as + 'Baku'] },
  { std: { name: 'Kyrgyzstan Time', abbrev: 'KGT' }, offset: 6, ids: [as + 'Bishkek'] },
  { std: { name: 'Brunei Darussalam Time', abbrev: 'BNT' }, offset: 8, ids: [as + 'Brunei'] },
  // choibalsan: [as+ 'Choibalsan'],
  // east_Timor: [as+ 'Dili'],
  // tajikistan: [as+ 'Dushanbe'],
  // hovd: [as+ 'Hovd'],
  // irkutsk: [as+ 'Irkutsk'],
  { std: { name: 'Afghanistan Time', abbrev: 'AFT' }, offset: 4.5, ids: [as + 'Kabul'] },
  { std: { name: 'Kamchatka Time', abbrev: 'PETT' }, offset: 12, ids: [as + 'Kamchatka'] },
  { std: { name: 'Nepal Time', abbrev: 'NPT' }, offset: 5.75, ids: [as + 'Katmandu'] },
  // magadan: [as+ 'Magadan'],
  { std: { name: 'Philippine Time', abbrev: 'PHT' }, offset: 8, ids: [as + 'Manila'] },
  // novosibirsk: [as+ 'Novosibirsk'],
  // omsk: [as+ 'Omsk'],
  { std: { name: 'Myanmar Time', abbrev: 'MMT' }, offset: 6.5, ids: [as + 'Rangoon'] },
  // sakhalin: [as+ 'Sakhalin'],
  // srednekolymsk: [as+ 'Srednekolymsk'],
  { std: { name: 'Georgia Standard Time', abbrev: 'GET' }, offset: 4, ids: [as + 'Tbilisi'] },
  // bhutan: [as+ 'Thimphu'],
  {
    std: { name: 'Japan Standard Time', abbrev: 'JST' },
    offset: 9,
    ids: [as + 'Tokyo']
  },
  { std: { name: 'Ulaanbaatar Time', abbrev: 'ULAT' }, offset: 8, ids: [as + 'Ulaanbaatar'] },
  // urumqi: [as+ 'Urumqi'],
  // yekaterinburg: [as+ 'Yekaterinburg'],
  // armenia: [as+ 'Yerevan'],
  // azores: ['Atlantic/Azores'],
  // cape_Verde: ['Atlantic/Cape_Verde'],
  // south_Georgia: ['Atlantic/South_Georgia'],
  // falkland: ['Atlantic/Stanley'],

  //India
  {
    std: { name: 'Maldives Time', abbrev: 'MVT' },
    offset: 5,
    ids: ['Indian/Maldives']
  },
  {
    std: { name: 'Mauritius Time', abbrev: 'MUT' },
    offset: 4,
    ids: ['Indian/Mauritius']
  },
  {
    std: { name: 'Marshall Islands Time', abbrev: 'MHT' },
    offset: 12,
    ids: [pa + 'Kwajalein', pa + 'Majuro']
  },
  {
    std: { name: 'Samoa Standard Time', abbrev: 'SST' },
    alias: ['somoan'],
    offset: -11,
    ids: [pa + 'Midway', pa + 'Pago_Pago']
  },
  {
    std: { name: 'Chamorro Standard Time', abbrev: 'CHST' },
    offset: 10,
    ids: [pa + 'Guam', pa + 'Saipan']
  },
  {
    std: { name: 'Papua New Guinea Time', abbrev: 'PGT' },
    offset: 11,
    ids: [pa + 'Bougainville', pa + 'Port_Moresby']
  }

  // ambiguous abbrevs
  // { std: { name: 'Bangladesh Standard Time', abbrev: 'BST' },  offset: 0, ids: [as + 'Dhaka'] }

  // indian_Ocean: ['Indian/Chagos'],
  // christmas: ['Indian/Christmas'],
  // cocos: ['Indian/Cocos'],
  // french_Southern: ['Indian/Kerguelen'],
  // seychelles: ['Indian/Mahe'],
  // reunion: ['Indian/Reunion'],

  //Pacific
  // apia: [pa+ 'Apia'],
  // easter: [pa+ 'Easter'],
  // vanuatu: [pa+ 'Efate'],
  // phoenix_Islands: [pa+ 'Enderbury'],
  // tokelau: [pa+ 'Fakaofo'],
  // fiji: [pa+ 'Fiji'],
  // tuvalu: [pa+ 'Funafuti'],
  // galapagos: [pa+ 'Galapagos'],
  // gambier: [pa+ 'Gambier'],
  // solomon: [pa+ 'Guadalcanal'],
  // line_Islands: [pa+ 'Kiritimati'],
  // kosrae: [pa+ 'Kosrae'],
  // marquesas: [pa+ 'Marquesas'],
  // nauru: [pa+ 'Nauru'],
  // niue: [pa+ 'Niue'],
  // norfolk: [pa+ 'Norfolk'],
  // new_Caledonia: [pa+ 'Noumea'],
  // palau: [pa+ 'Palau'],
  // pitcairn: [pa+ 'Pitcairn'],
  // ponape: [pa+ 'Ponape'],
  // cook: [pa+ 'Rarotonga'],
  // tahiti: [pa+ 'Tahiti'],
  // gilbert_Islands: [pa+ 'Tarawa'],
  // tonga: [pa+ 'Tongatapu'],
  // truk: [pa+ 'Truk'],
  // wake: [pa+ 'Wake'],
  // wallis: [pa+ 'Wallis'],
  // tomsk: [as+ 'Tomsk']

  // antarctic
  // greenland_Eastern: [am + 'Scoresbysund'],
  // davis: ['Antarctica/Davis'],
  // dumontdurville: ['Antarctica/Dumontdurville'],
  // macquarie: ['Antarctica/Macquarie'],
  // mawson: ['Antarctica/Mawson'],
  // rothera: ['Antarctica/Rothera'],
  // syowa: ['Antarctica/Syowa'],
  // vostok: ['Antarctica/Vostok'],
]
