//From https://Github.com/Mj1856/Timezonenames
// and from  https://Github.com/Nodatime/Nodatime/Blob/Master/Data/Cldr/Windowszones-35.xml

module.exports = [
  //gmt-0, with daylight savings
  {
    standard: { name: 'Greenwich Standard Time', abbrev: 'GMT' },
    daylight: { name: 'British Summer Time', abbrev: 'BST' },
    alias: ['british', 'britain'],
    pick: 'Europe/London',
    zones: ['Europe/Guernsey', 'Europe/Isle_Of_Man', 'Europe/Jersey', 'Europe/London']
  },
  {
    standard: { name: 'Greenwich Standard Time', abbrev: 'GMT' },
    daylight: { name: 'Irish Summer Time', abbrev: 'IST' },
    alias: ['ireland'],
    zones: ['Europe/Dublin']
  },

  //gmt-0, no daylight savings
  {
    standard: { name: 'Greenwich Standard Time', abbrev: 'GMT' },
    pick: 'Africa/Freetown',
    alias: ['etc', 'utc'],
    zones: [
      'Africa/Abidjan',
      'Africa/Accra',
      'Africa/Bamako',
      'Africa/Banjul',
      'Africa/Bissau',
      'Africa/Conakry',
      'Africa/Dakar',
      'Africa/Freetown',
      'Africa/Lome',
      'Africa/Monrovia',
      'Africa/Nouakchott',
      'Africa/Ouagadougou',
      'Africa/Sao_Tome',
      'America/Danmarkshavn',
      'Antarctica/Troll',
      'Atlantic/Reykjavik',
      'Atlantic/St_Helena',
      'ETC/GMT'
    ]
  },

  //North america
  {
    standard: { name: 'Central Standard Time', abbrev: 'CST' },
    daylight: { name: 'Central Daylight Time', abbrev: 'CDT' },
    pick: 'America/Chicago',
    zones: [
      'America/Bahia_Banderas',
      'America/Belize',
      'America/Chicago',
      'America/Costa_Rica',
      'America/El_Salvador',
      'America/Guatemala',
      'America/Indiana/Knox',
      'America/Indiana/Tell_City',
      'America/Managua',
      'America/Matamoros',
      'America/Menominee',
      'America/Merida',
      'America/Mexico_City',
      'America/Monterrey',
      'America/North_Dakota/Beulah',
      'America/North_Dakota/Center',
      'America/North_Dakota/New_Salem',
      'America/Rainy_River',
      'America/Rankin_Inlet',
      'America/Regina',
      'America/Resolute',
      'America/Swift_Current',
      'America/Tegucigalpa',
      'America/Winnipeg'
    ]
  },
  {
    standard: { name: 'Mountain Standard Time', abbrev: 'MST' },
    daylight: { name: 'Mountain Daylight Time', abbrev: 'MDT' },
    pick: 'America/Denver',
    zones: [
      'America/Boise',
      'America/Cambridge_Bay',
      'America/Creston',
      'America/Dawson_Creek',
      'America/Denver',
      'America/Edmonton',
      'America/Fort_Nelson',
      'America/Inuvik',
      'America/Ojinaga',
      'America/Phoenix',
      'America/Yellowknife',
      'mst7mdt',
      // add mexico
      'America/Chihuahua',
      'America/Hermosillo',
      'America/Mazatlan'
    ]
  },
  {
    standard: { name: 'Atlantic Standard Time', abbrev: 'AST' },
    daylight: { name: 'Atlantic Daylight Time', abbrev: 'ADT' },
    pick: 'America/Halifax',
    zones: [
      'America/Anguilla',
      'America/Antigua',
      'America/Aruba',
      'America/Barbados',
      'America/Blanc-sablon',
      'America/Curacao',
      'America/Dominica',
      'America/Glace_Bay',
      'America/Goose_Bay',
      'America/Grenada',
      'America/Guadeloupe',
      'America/Halifax',
      'America/Kralendijk',
      'America/Lower_Princes',
      'America/Marigot',
      'America/Martinique',
      'America/Moncton',
      'America/Montserrat',
      'America/Port_Of_Spain',
      'America/Puerto_Rico',
      'America/Santo_Domingo',
      'America/St_Barthelemy',
      'America/St_Kitts',
      'America/St_Lucia',
      'America/St_Thomas',
      'America/St_Vincent',
      'America/Thule',
      'America/Tortola',
      'atlantic/Bermuda'
    ]
  },
  {
    standard: { name: 'Eastern Standard Time', abbrev: 'EST' },
    daylight: { name: 'Eastern Daylight Time', abbrev: 'EDT' },
    pick: 'America/New_York',
    zones: [
      'America/Cancun',
      'America/Cayman',
      'America/Coral_Harbour',
      'America/Detroit',
      'America/Grand_Turk',
      'America/Indiana/Marengo',
      'America/Indiana/Petersburg',
      'America/Indiana/Vevay',
      'America/Indiana/Vincennes',
      'America/Indiana/Winamac',
      'America/Indianapolis',
      'America/Iqaluit',
      'America/Jamaica',
      'America/Kentucky/Monticello',
      'America/Louisville',
      'America/Nassau',
      'America/New_York',
      'America/Nipigon',
      'America/Panama',
      'America/Pangnirtung',
      'America/Port-au-prince',
      'America/Thunder_Bay',
      'America/Toronto',
      'est5edt',
      'America/Montreal'
    ]
  },
  {
    standard: { name: 'Pacific Standard Time', abbrev: 'PST' },
    daylight: { name: 'Pacific Daylight Time', abbrev: 'PDT' },
    pick: 'America/Los_Angeles',
    zones: [
      'America/Dawson',
      'America/Los_Angeles',
      'America/Tijuana',
      'America/Vancouver',
      'America/Whitehorse',
      'pst8pdt'
    ]
  },
  {
    standard: { name: 'Alaskan Standard Time', abbrev: 'AHST' },
    daylight: { name: 'Alaskan Daylight Time', abbrev: 'AHDT' },
    pick: 'America/Anchorage',
    zones: [
      'America/Anchorage',
      'America/Juneau',
      'America/Metlakatla',
      'America/Nome',
      'America/Sitka',
      'America/Yakutat'
    ]
  },
  {
    standard: { name: 'Hawaiian Standard Time', abbrev: 'HST' },
    alias: ['aleutian', 'hawaii'],
    pick: 'Pacific/Honolulu',
    zones: ['America/Adak', 'Pacific/Honolulu', 'Pacific/Johnston']
  },
  {
    standard: { name: 'Newfoundland Standard Time', abbrev: 'NST' },
    daylight: { name: 'Newfoundland Daylight Time', abbrev: 'NDT' },
    pick: 'America/St_Johns',
    zones: ['America/St_Johns']
  },

  ///Europe
  {
    standard: { name: 'Central European Time', abbrev: 'CET' },
    daylight: { name: 'Central European Summer Time', abbrev: 'CEST' },
    alias: ['romance', 'central europe'],
    pick: 'Europe/Berlin',
    zones: [
      'Africa/Algiers',
      'Africa/Ceuta',
      'Africa/Tunis',
      'arctic/Longyearbyen',
      'Europe/Amsterdam',
      'Europe/Andorra',
      'Europe/Belgrade',
      'Europe/Berlin',
      'Europe/Bratislava',
      'Europe/Brussels',
      'Europe/Budapest',
      'Europe/Busingen',
      'Europe/Copenhagen',
      'Europe/Gibraltar',
      'Europe/Ljubljana',
      'Europe/Luxembourg',
      'Europe/Madrid',
      'Europe/Malta',
      'Europe/Monaco',
      'Europe/Oslo',
      'Europe/Paris',
      'Europe/Podgorica',
      'Europe/Prague',
      'Europe/Rome',
      'Europe/San_Marino',
      'Europe/Sarajevo',
      'Europe/Skopje',
      'Europe/Stockholm',
      'Europe/Tirane',
      'Europe/Vaduz',
      'Europe/Vatican',
      'Europe/Vienna',
      'Europe/Warsaw',
      'Europe/Zagreb',
      'Europe/Zurich'
    ]
  },
  {
    standard: { name: 'Eastern European Time', abbrev: 'EET' },
    daylight: { name: 'Eastern European Summer Time', abbrev: 'EEST' },
    alias: ['eastern europe'],
    pick: 'Europe/Riga',
    zones: [
      'Africa/Cairo',
      'Africa/Tripoli',
      'Asia/Amman',
      'Asia/Beirut',
      'Asia/Damascus',
      'Asia/Famagusta',
      'Asia/Gaza',
      'Asia/Hebron',
      'Asia/Nicosia',
      'Europe/Athens',
      'Europe/Bucharest',
      'Europe/Chisinau',
      'Europe/Helsinki',
      'Europe/Kaliningrad',
      'Europe/Kiev',
      'Europe/Mariehamn',
      'Europe/Riga',
      'Europe/Sofia',
      'Europe/Tallinn',
      'Europe/Uzhgorod',
      'Europe/Vilnius',
      'Europe/Zaporozhye'
    ]
  },
  {
    standard: { name: 'Western European Time', abbrev: 'WET' },
    daylight: { name: 'Western European Summer Time', abbrev: 'WEST' },
    alias: ['western europe'],
    pick: 'Europe/Lisbon',
    zones: [
      'Africa/Casablanca',
      'Africa/El_Aaiun',
      'atlantic/Canary',
      'atlantic/Faeroe',
      'atlantic/Madeira',
      'Europe/Lisbon'
    ]
  },
  {
    standard: { name: 'Turkey Standard Time', abbrev: 'TRT' },
    alias: ['turkish'],
    pick: 'Europe/Istanbul',
    zones: ['Europe/Istanbul']
  },
  // samara: ['Europe/Samara', 'Europe/Saratov'],

  //Africa
  {
    standard: { name: 'East Africa Time', abbrev: 'EAT' },
    alias: ['east african', 'eastern africa'],
    pick: 'Africa/Nairobi',
    zones: [
      'Africa/Addis_Ababa',
      'Africa/Asmera',
      'Africa/Dar_Es_Salaam',
      'Africa/Djibouti',
      'Africa/Juba',
      'Africa/Kampala',
      'Africa/Mogadishu',
      'Africa/Nairobi',
      'Indian/Antananarivo',
      'Indian/Comoro',
      'Indian/Mayotte'
    ]
  },
  {
    standard: { name: 'Central Africa Time', abbrev: 'CAT' },
    pick: 'Africa/Khartoum',
    alias: ['central africa'],
    zones: [
      'Africa/Blantyre',
      'Africa/Bujumbura',
      'Africa/Gaborone',
      'Africa/Harare',
      'Africa/Khartoum',
      'Africa/Kigali',
      'Africa/Lubumbashi',
      'Africa/Lusaka',
      'Africa/Maputo',
      'Africa/Windhoek'
    ]
  },
  {
    standard: { name: 'South Africa Standard Time', abbrev: 'SAST' },
    alias: ['southern africa', 'south african'],
    pick: 'Africa/Johannesburg',
    zones: ['Africa/Johannesburg', 'Africa/Maseru', 'Africa/Mbabane']
  },
  {
    standard: { name: 'West Africa Standard Time', abbrev: 'WAT' },
    alias: ['western africa', 'west african'],
    pick: 'Africa/Lagos',
    zones: [
      'Africa/Bangui',
      'Africa/Brazzaville',
      'Africa/Douala',
      'Africa/Kinshasa',
      'Africa/Lagos',
      'Africa/Libreville',
      'Africa/Luanda',
      'Africa/Malabo',
      'Africa/Ndjamena',
      'Africa/Niamey',
      'Africa/Porto-novo'
    ]
  },

  //Australia
  {
    standard: { name: 'Australian Central Standard Time', abbrev: 'ACST' },
    daylight: { name: 'Australian Central Daylight Time', abbrev: 'ACDT' },
    alias: ['australia central'],
    pick: 'Australia/Adelaide',
    zones: ['Australia/Adelaide', 'Australia/Broken_Hill', 'Australia/Darwin']
  },
  {
    standard: { name: 'Australian Eastern Standard Time', abbrev: 'AEST' },
    daylight: { name: 'Australian Eastern Daylight Time', abbrev: 'AEDT' },
    alias: ['australia east'],
    pick: 'Australia/Brisbane',
    zones: [
      'Australia/Brisbane',
      'Australia/Currie',
      'Australia/Hobart',
      'Australia/Lindeman',
      'Australia/Melbourne',
      'Australia/Sydney'
    ]
  },
  {
    standard: { name: 'Australian Western Standard Time', abbrev: 'AWST' },
    daylight: { name: 'Australian Western Daylight Time', abbrev: 'AWDT' },
    alias: ['australia west'],
    pick: 'Australia/Perth',
    zones: ['Antarctica/Casey', 'Australia/Perth']
  },
  {
    standard: { name: 'Australian Central Western Standard Time', abbrev: 'ACWST' },
    alias: ['australia central west'],
    pick: 'Australia/Eucla',
    zones: ['Australia/Eucla']
  },
  {
    standard: { name: 'Lord Howe Standard Time', abbrev: 'LHST' },
    daylight: { name: 'Lord Howe Daylight Time', abbrev: 'LHDT' },
    pick: 'Australia/Lord_Howe',
    zones: ['Australia/Lord_Howe']
  },
  // new_Zealand: ['Antarctica/Mcmurdo', 'Pacific/Auckland'],

  //Russia
  {
    standard: { name: 'Russian Standard Time', abbrev: 'MSK' },
    alias: ['russian'],
    pick: 'Europe/Moscow',
    zones: [
      'Europe/Astrakhan',
      'Europe/Minsk',
      'Europe/Moscow',
      'Europe/Simferopol',
      'Europe/Ulyanovsk',
      'Europe/Kirov'
    ]
  },
  // volgograd: ['Europe/Volgograd'],

  //South america
  {
    standard: { name: 'Brazil Time', abbrev: 'BRT' },
    alias: ['brasília', 'brasilia', 'brazilian'],
    pick: 'America/Sao_Paulo',
    zones: [
      'America/Araguaina',
      'America/Bahia',
      'America/Belem',
      'America/Fortaleza',
      'America/Maceio',
      'America/Recife',
      'America/Santarem',
      'America/Sao_Paulo'
    ]
  },
  {
    standard: { name: 'Argentina Time', abbrev: 'ART' },
    alias: ['argentinian'],
    pick: 'America/Buenos_Aires',
    zones: [
      'America/Argentina/La_Rioja',
      'America/Argentina/Rio_Gallegos',
      'America/Argentina/Salta',
      'America/Argentina/San_Juan',
      'America/Argentina/Tucuman',
      'America/Argentina/Ushuaia',
      'America/Buenos_Aires',
      'America/Catamarca',
      'America/Cordoba',
      'America/Jujuy',
      'America/Mendoza'
    ]
  },
  {
    standard: { name: 'Amazon Time', abbrev: 'AMT' },
    alias: ['amazonian'],
    pick: 'America/Manaus',
    zones: [
      'America/Boa_Vista',
      'America/Campo_Grande',
      'America/Cuiaba', //Has dst?
      'America/Manaus',
      'America/Porto_Velho'
    ]
  },

  {
    standard: { name: 'Easter Island Standard Time', abbrev: 'EAST' },
    daylight: { name: 'Easter Island Summer Time', abbrev: 'EASST' },
    zones: ['Chile/Easterisland']
  },
  {
    standard: { name: 'Venezuelan Standard Time', abbrev: 'VET' },
    alias: ['venezuela'],
    zones: ['America/Caracas']
  },
  {
    standard: { name: 'Paraguay Time', abbrev: 'PYT' },
    daylight: { name: 'Paraguay Summer Time', abbrev: 'PYST' },
    zones: ['America/Asuncion']
  },
  {
    standard: { name: 'Cuba Standard Time', abbrev: 'CST' },
    daylight: { name: 'Cuba Daylight Time', abbrev: 'CDT' },
    alias: ['cuban'],
    zones: ['America/Havana']
  },
  {
    standard: { name: 'Bolivia Time', abbrev: 'BOT' },
    alias: ['bolivian'],
    zones: ['America/La_Paz']
  },
  {
    standard: { name: 'Colombia Time', abbrev: 'COT' },
    alias: ['colombian'],
    zones: ['America/Bogota']
  },
  {
    standard: { name: 'Acre Time', abbrev: 'ACT' },
    pick: null,
    zones: ['America/Eirunepe', 'America/Rio_Branco']
  },
  {
    standard: { name: 'Peru Time', abbrev: 'PET' },
    zones: ['America/Lima']
  },
  {
    standard: { name: 'Chile Standard Time', abbrev: 'CLST' },
    daylight: { name: 'Chile Summer Time', abbrev: 'CLDT' },
    pick: null,
    zones: ['America/Punta_Arenas', 'America/Santiago', 'Antarctica/Palmer']
  },
  {
    standard: { name: 'Uruguay Time', abbrev: 'UYT' },
    zones: ['America/Montevideo']
  },
  // argentina_Western: ['America/Argentina/San_Luis'],
  // french_Guiana: ['America/Cayenne'],
  // greenland_Western: ['America/Godthab'],
  // ecuador: ['America/Guayaquil'],
  // guyana: ['America/Guyana'],
  // pierre_Miquelon: ['America/Miquelon'],
  // noronha: ['America/Noronha'],
  // suriname: ['America/Paramaribo'],
  // mexico_Northwest: ['America/Santa_Isabel'],

  //Middle-east
  {
    standard: { name: 'Arabic Standard Time', abbrev: 'AST' },
    pick: 'Asia/Baghdad',
    alias: ['arabic', 'arab'],
    zones: ['Asia/Aden', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Riyadh']
  },
  {
    standard: { name: 'Iran Standard Time', abbrev: 'IRST' },
    daylight: { name: 'Iran Daylight Time', abbrev: 'IRDT' },
    alias: ['iranian'],
    pick: 'Asia/Tehran',
    zones: ['Asia/Tehran']
  },
  {
    standard: { name: 'Pakistan Standard Time', abbrev: 'PKT' },
    pick: 'Asia/Karachi',
    zones: ['Asia/Karachi']
  },
  {
    standard: { name: 'India Standard Time', abbrev: 'IST' },
    alias: ['indian'],
    pick: 'Asia/Kolkata',
    zones: ['Asia/Kolkata', 'Asia/Colombo']
  },
  {
    standard: { name: 'Indochina Time', abbrev: 'ICT' },
    alias: ['South East Asia'],
    pick: 'Asia/Bangkok',
    zones: ['Asia/Bangkok', 'Asia/Phnom_Penh', 'Asia/Saigon', 'Asia/Vientiane']
  },
  {
    standard: { name: 'China Standard Time', abbrev: 'CT' },
    alias: ['chinese'],
    pick: 'Asia/Shanghai',
    zones: ['Asia/Macau', 'Asia/Shanghai']
  },

  {
    standard: { name: 'Alma-Ata Time', abbrev: 'ALMT' },
    pick: 'Asia/Almaty',
    zones: ['Asia/Almaty', 'Asia/Qostanay']
  },
  {
    standard: { name: 'Oral Time', abbrev: 'ORAT' },
    pick: 'Asia/Oral',
    zones: ['Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Qyzylorda']
  },
  {
    standard: { name: 'Yakutsk Time', abbrev: 'YAKT' },
    pick: 'Asia/Yakutsk',
    zones: ['Asia/Chita', 'Asia/Khandyga', 'Asia/Yakutsk']
  },
  {
    standard: { name: 'Gulf Standard Time', abbrev: 'GST' },
    pick: 'Asia/Dubai',
    alias: ['uae'],
    zones: ['Asia/Dubai', 'Asia/Muscat']
  },
  {
    standard: { name: 'Hong Kong Time', abbrev: 'HKT' },
    zones: ['Asia/Hong_Kong']
  },
  {
    standard: { name: 'Western Indonesian Time', abbrev: 'WIB' },
    alias: ['indonesia'], //most of it
    zones: ['Asia/Jakarta', 'Asia/Pontianak', 'Asia/Jayapura']
  },
  {
    standard: { name: 'Central Indonesian Time', abbrev: 'WITA' },
    zones: ['Asia/Makassar']
  },
  {
    standard: { name: 'Israel Daylight Time', abbrev: 'IDT' },
    daylight: { name: 'Israel Standard Time', abbrev: 'IST' },
    alias: ['israeli'],
    zones: ['Asia/Jerusalem']
  },
  {
    standard: { name: 'Krasnoyarsk Time', abbrev: 'KRAT' },
    zones: ['Asia/Krasnoyarsk', 'Asia/Novokuznetsk', 'Asia/Barnaul']
  },
  {
    standard: { name: 'Malaysia Time', abbrev: 'MYT' },
    zones: ['Asia/Kuala_Lumpur', 'Asia/Kuching']
  },
  {
    standard: { name: 'Singapore Time', abbrev: 'SGT' },
    zones: ['Asia/Singapore']
  },
  {
    standard: { name: 'Korea Standard Time', abbrev: 'KST' },
    pick: 'Asia/Seoul',
    alias: ['korean'],
    zones: ['Asia/Pyongyang', 'Asia/Seoul']
  },
  {
    standard: { name: 'Uzbekistan Time', abbrev: 'UZT' },
    zones: ['Asia/Samarkand', 'Asia/Tashkent']
  },
  {
    standard: { name: 'Vladivostok Time', abbrev: 'VLAT' },
    pick: 'Asia/Vladivostok',
    zones: ['Asia/Ust-nera', 'Asia/Vladivostok']
  },

  // anadyr: ['Asia/Anadyr'],
  // turkmenistan: ['Asia/Ashgabat'],
  // azerbaijan: ['Asia/Baku'],
  // kyrgystan: ['Asia/Bishkek'],
  // brunei: ['Asia/Brunei'],
  // choibalsan: ['Asia/Choibalsan'],
  // bangladesh: ['Asia/Dhaka'],
  // east_Timor: ['Asia/Dili'],
  // tajikistan: ['Asia/Dushanbe'],
  // hovd: ['Asia/Hovd'],
  // irkutsk: ['Asia/Irkutsk'],
  // afghanistan: ['Asia/Kabul'],
  // kamchatka: ['Asia/Kamchatka'],
  // nepal: ['Asia/Katmandu'],
  // magadan: ['Asia/Magadan'],
  // philippines: ['Asia/Manila'],
  // novosibirsk: ['Asia/Novosibirsk'],
  // omsk: ['Asia/Omsk'],
  // myanmar: ['Asia/Rangoon'],
  // sakhalin: ['Asia/Sakhalin'],
  // srednekolymsk: ['Asia/Srednekolymsk'],
  // taipei: ['Asia/Taipei'],
  // georgia: ['Asia/Tbilisi'],
  // bhutan: ['Asia/Thimphu'],
  // japan: ['Asia/Tokyo'],
  // mongolia: ['Asia/Ulaanbaatar'],
  // urumqi: ['Asia/Urumqi'],
  // yekaterinburg: ['Asia/Yekaterinburg'],
  // armenia: ['Asia/Yerevan'],
  // azores: ['atlantic/Azores'],
  // cape_Verde: ['atlantic/Cape_Verde'],
  // south_Georgia: ['atlantic/South_Georgia'],
  // falkland: ['atlantic/Stanley'],

  //India
  {
    standard: { name: 'Maldives Time', abbrev: 'MVT' },
    zones: ['Indian/Maldives']
  },
  {
    standard: { name: 'Mauritius Time', abbrev: 'MUT' },
    zones: ['Indian/Mauritius']
  },
  {
    standard: { name: 'Marshall Islands Time', abbrev: 'MHT' },
    zones: ['Pacific/Kwajalein', 'Pacific/Majuro']
  },
  {
    standard: { name: 'Samoa Standard Time', abbrev: 'SST' },
    alias: ['somoan'],
    zones: ['Pacific/Midway', 'Pacific/Pago_Pago']
  },
  {
    standard: { name: 'Chamorro Standard Time', abbrev: 'CHST' },
    zones: ['Pacific/Guam', 'Pacific/Saipan']
  },
  {
    standard: { name: 'Papua New Guinea Time', abbrev: 'PGT' },
    zones: ['Pacific/Bougainville', 'Pacific/Port_Moresby']
  }

  // indian_Ocean: ['Indian/Chagos'],
  // christmas: ['Indian/Christmas'],
  // cocos: ['Indian/Cocos'],
  // french_Southern: ['Indian/Kerguelen'],
  // seychelles: ['Indian/Mahe'],
  // reunion: ['Indian/Reunion'],

  //Pacific
  // apia: ['Pacific/Apia'],
  // chatham: ['Pacific/Chatham'],
  // easter: ['Pacific/Easter'],
  // vanuatu: ['Pacific/Efate'],
  // phoenix_Islands: ['Pacific/Enderbury'],
  // tokelau: ['Pacific/Fakaofo'],
  // fiji: ['Pacific/Fiji'],
  // tuvalu: ['Pacific/Funafuti'],
  // galapagos: ['Pacific/Galapagos'],
  // gambier: ['Pacific/Gambier'],
  // solomon: ['Pacific/Guadalcanal'],
  // line_Islands: ['Pacific/Kiritimati'],
  // kosrae: ['Pacific/Kosrae'],
  // marquesas: ['Pacific/Marquesas'],
  // nauru: ['Pacific/Nauru'],
  // niue: ['Pacific/Niue'],
  // norfolk: ['Pacific/Norfolk'],
  // new_Caledonia: ['Pacific/Noumea'],
  // palau: ['Pacific/Palau'],
  // pitcairn: ['Pacific/Pitcairn'],
  // ponape: ['Pacific/Ponape'],
  // cook: ['Pacific/Rarotonga'],
  // tahiti: ['Pacific/Tahiti'],
  // gilbert_Islands: ['Pacific/Tarawa'],
  // tonga: ['Pacific/Tongatapu'],
  // truk: ['Pacific/Truk'],
  // wake: ['Pacific/Wake'],
  // wallis: ['Pacific/Wallis'],
  // tomsk: ['Asia/Tomsk']

  // antarctic
  // greenland_Eastern: ['America/Scoresbysund'],
  // davis: ['Antarctica/Davis'],
  // dumontdurville: ['Antarctica/Dumontdurville'],
  // macquarie: ['Antarctica/Macquarie'],
  // mawson: ['Antarctica/Mawson'],
  // rothera: ['Antarctica/Rothera'],
  // syowa: ['Antarctica/Syowa'],
  // vostok: ['Antarctica/Vostok'],
]
