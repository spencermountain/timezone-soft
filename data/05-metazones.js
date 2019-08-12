//From https://Github.com/Mj1856/Timezonenames
// and from  https://Github.com/Nodatime/Nodatime/Blob/Master/Data/Cldr/Windowszones-35.xml

module.exports = [
  //gmt-0, with daylight savings
  {
    standard: { name: 'Greenwich Standard Time', abbrev: 'gmt' },
    daylight: { name: 'british Summer Time', abbrev: 'bst' },
    alias: ['british', 'britain'],
    pick: 'Europe/London',
    zones: ['Europe/Guernsey', 'Europe/Isle_Of_Man', 'Europe/Jersey', 'Europe/London']
  },
  {
    standard: { name: 'Greenwich Standard Time', abbrev: 'gmt' },
    daylight: { name: 'irish Summer Time', abbrev: 'ist' },
    alias: ['ireland'],
    zones: ['Europe/Dublin']
  },

  //gmt-0, no daylight savings
  {
    standard: { name: 'Greenwich Standard Time', abbrev: 'gmt' },
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
    standard: { name: 'Central Standard Time', abbrev: 'cst' },
    daylight: { name: 'Central Daylight Time', abbrev: 'cdt' },
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
    standard: { name: 'Mountain Standard Time', abbrev: 'mst' },
    daylight: { name: 'Mountain Daylight Time', abbrev: 'mdt' },
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
    standard: { name: 'Atlantic Standard Time', abbrev: 'ast' },
    daylight: { name: 'Atlantic Daylight Time', abbrev: 'adt' },
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
    standard: { name: 'Eastern Standard Time', abbrev: 'est' },
    daylight: { name: 'Eastern Daylight Time', abbrev: 'edt' },
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
    standard: { name: 'Pacific Standard Time', abbrev: 'pst' },
    daylight: { name: 'Pacific Daylight Time', abbrev: 'pdt' },
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
    standard: { name: 'Alaskan Standard Time', abbrev: 'ahst' },
    daylight: { name: 'Alaskan Daylight Time', abbrev: 'ahdt' },
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
    standard: { name: 'Hawaiian Standard Time', abbrev: 'hst' },
    alias: ['aleutian', 'hawaii'],
    pick: 'Pacific/Honolulu',
    zones: ['America/Adak', 'Pacific/Honolulu', 'Pacific/Johnston']
  },
  {
    standard: { name: 'Newfoundland Standard Time', abbrev: 'nst' },
    daylight: { name: 'Newfoundland Daylight Time', abbrev: 'ndt' },
    pick: 'America/St_Johns',
    zones: ['America/St_Johns']
  },

  ///Europe
  {
    standard: { name: 'Central European Time', abbrev: 'cet' },
    daylight: { name: 'Central European Summer Time', abbrev: 'cest' },
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
    standard: { name: 'Eastern European Time', abbrev: 'eet' },
    daylight: { name: 'Eastern European Summer Time', abbrev: 'eest' },
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
    standard: { name: 'Western European Time', abbrev: 'wet' },
    daylight: { name: 'Western European Summer Time', abbrev: 'west' },
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
    standard: { name: 'Turkey Standard Time', abbrev: 'trt' },
    alias: ['turkish'],
    pick: 'Europe/Istanbul',
    zones: ['Europe/Istanbul']
  },
  // samara: ['Europe/Samara', 'Europe/Saratov'],

  //Africa
  {
    standard: { name: 'East Africa Time', abbrev: 'eat' },
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
    standard: { name: 'Central Africa Time', abbrev: 'cat' },
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
    standard: { name: 'South Africa Standard Time', abbrev: 'sast' },
    alias: ['southern africa', 'south african'],
    pick: 'Africa/Johannesburg',
    zones: ['Africa/Johannesburg', 'Africa/Maseru', 'Africa/Mbabane']
  },
  {
    standard: { name: 'West Africa Standard Time', abbrev: 'wat' },
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
    standard: { name: 'Australian Central Standard Time', abbrev: 'acst' },
    daylight: { name: 'Australian Central Daylight Time', abbrev: 'acdt' },
    alias: ['australia central'],
    pick: 'Australia/Adelaide',
    zones: ['Australia/Adelaide', 'Australia/Broken_Hill', 'Australia/Darwin']
  },
  {
    standard: { name: 'Australian Eastern Standard Time', abbrev: 'aest' },
    daylight: { name: 'Australian Eastern Daylight Time', abbrev: 'aedt' },
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
    standard: { name: 'Australian Western Standard Time', abbrev: 'awst' },
    daylight: { name: 'Australian Western Daylight Time', abbrev: 'awdt' },
    alias: ['australia west'],
    pick: 'Australia/Perth',
    zones: ['Antarctica/Casey', 'Australia/Perth']
  },
  {
    standard: { name: 'Australian Central Western Standard Time', abbrev: 'acwst' },
    alias: ['australia central west'],
    pick: 'Australia/Eucla',
    zones: ['Australia/Eucla']
  },
  {
    standard: { name: 'Lord Howe Standard Time', abbrev: 'lhst' },
    daylight: { name: 'Lord Howe Daylight Time', abbrev: 'lhdt' },
    pick: 'Australia/Lord_Howe',
    zones: ['Australia/Lord_Howe']
  },
  // new_Zealand: ['Antarctica/Mcmurdo', 'Pacific/Auckland'],

  //Russia
  {
    standard: { name: 'Russian Standard Time', abbrev: 'msk' },
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
    standard: { name: 'Brazil Time', abbrev: 'brt' },
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
    standard: { name: 'Argentina Time', abbrev: 'art' },
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
    standard: { name: 'Amazon Time', abbrev: 'amst' },
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
    standard: { name: 'Venezuelan Standard Time', abbrev: 'vet' },
    alias: ['venezuela'],
    zones: ['America/Caracas']
  },
  {
    standard: { name: 'Paraguay Time', abbrev: 'PYT' },
    daylight: { name: 'Paraguay Summer Time', abbrev: 'PYST' },
    zones: ['America/Asuncion']
  },
  {
    standard: { name: 'Cuba Standard Time', abbrev: 'cst' },
    daylight: { name: 'Cuba Daylight Time', abbrev: 'cdt' },
    alias: ['cuban'],
    zones: ['America/Havana']
  },
  {
    standard: { name: 'Bolivia Time', abbrev: 'bot' },
    alias: ['bolivian'],
    zones: ['America/La_Paz']
  },
  {
    standard: { name: 'Colombia Time', abbrev: 'cot' },
    alias: ['colombian'],
    zones: ['America/Bogota']
  },
  {
    standard: { name: 'Acre Time', abbrev: 'act' },
    pick: null,
    zones: ['America/Eirunepe', 'America/Rio_Branco']
  },
  {
    standard: { name: 'Peru Time', abbrev: 'pet' },
    zones: ['America/Lima']
  },
  {
    standard: { name: 'Chile Standard Time', abbrev: 'clst' },
    daylight: { name: 'Chile Summer Time', abbrev: 'cldt' },
    pick: null,
    zones: ['America/Punta_Arenas', 'America/Santiago', 'Antarctica/Palmer']
  },
  {
    standard: { name: 'Uruguay Time', abbrev: 'uyt' },
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
    standard: { name: 'Arabic Standard Time', abbrev: 'ast' },
    pick: 'Asia/Baghdad',
    alias: ['arabic', 'arab'],
    zones: ['Asia/Aden', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Riyadh']
  },
  {
    standard: { name: 'Iran Standard Time', abbrev: 'irst' },
    daylight: { name: 'Iran Daylight Time', abbrev: 'irdt' },
    alias: ['iranian'],
    pick: 'Asia/Tehran',
    zones: ['Asia/Tehran']
  },
  {
    standard: { name: 'Pakistan Standard Time', abbrev: 'pkt' },
    pick: 'Asia/Karachi',
    zones: ['Asia/Karachi']
  },
  {
    standard: { name: 'India Standard Time', abbrev: 'ist' },
    alias: ['indian'],
    pick: 'Asia/Kolkata',
    zones: ['Asia/Kolkata', 'Asia/Colombo']
  },
  {
    standard: { name: 'Indochina Time', abbrev: 'ict' },
    alias: ['South East Asia'],
    pick: 'Asia/Bangkok',
    zones: ['Asia/Bangkok', 'Asia/Phnom_Penh', 'Asia/Saigon', 'Asia/Vientiane']
  },
  {
    standard: { name: 'China Standard Time', abbrev: 'ct' },
    alias: ['chinese'],
    pick: 'Asia/Shanghai',
    zones: ['Asia/Macau', 'Asia/Shanghai']
  },

  {
    standard: { name: 'Alma-Ata Time', abbrev: 'almt' },
    pick: 'Asia/Almaty',
    zones: ['Asia/Almaty', 'Asia/Qostanay']
  },
  {
    standard: { name: 'Oral Time', abbrev: 'orat' },
    pick: 'Asia/Oral',
    zones: ['Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Qyzylorda']
  },
  {
    standard: { name: 'Yakutsk Time', abbrev: 'yakt' },
    pick: 'Asia/Yakutsk',
    zones: ['Asia/Chita', 'Asia/Khandyga', 'Asia/Yakutsk']
  },
  {
    standard: { name: 'Gulf Standard Time', abbrev: 'gst' },
    pick: 'Asia/Dubai',
    alias: ['uae'],
    zones: ['Asia/Dubai', 'Asia/Muscat']
  },
  {
    standard: { name: 'Hong Kong Time', abbrev: 'hkt' },
    zones: ['Asia/Hong_Kong']
  },
  {
    standard: { name: 'Western Indonesian Time', abbrev: 'wib' },
    alias: ['indonesia'],
    zones: ['Asia/Jakarta', 'Asia/Pontianak', 'Asia/Jayapura']
  },
  {
    standard: { name: 'Israel Daylight Time', abbrev: 'idt' },
    daylight: { name: 'Israel Standard Time', abbrev: 'ist' },
    alias: ['israeli'],
    zones: ['Asia/Jerusalem']
  },
  {
    standard: { name: 'Krasnoyarsk Time', abbrev: 'krat' },
    zones: ['Asia/Krasnoyarsk', 'Asia/Novokuznetsk', 'Asia/Barnaul']
  },
  {
    standard: { name: 'Malaysia Time', abbrev: 'myt' },
    zones: ['Asia/Kuala_Lumpur', 'Asia/Kuching']
  },
  {
    standard: { name: 'Singapore Time', abbrev: 'sgt' },
    zones: ['Asia/Singapore']
  },
  {
    standard: { name: 'Korea Standard Time', abbrev: 'kst' },
    pick: 'Asia/Seoul',
    alias: ['korean'],
    zones: ['Asia/Pyongyang', 'Asia/Seoul']
  },
  {
    standard: { name: 'Uzbekistan Time', abbrev: 'uzt' },
    zones: ['Asia/Samarkand', 'Asia/Tashkent']
  },
  {
    standard: { name: 'Vladivostok Time', abbrev: 'vlat' },
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
  // indonesia_Central: ['Asia/Makassar'],
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
    standard: { name: 'Maldives Time', abbrev: 'mvt' },
    zones: ['Indian/Maldives']
  },
  {
    standard: { name: 'Mauritius Time', abbrev: 'mut' },
    zones: ['Indian/Mauritius']
  },
  {
    standard: { name: 'Marshall Islands Time', abbrev: 'mht' },
    zones: ['Pacific/Kwajalein', 'Pacific/Majuro']
  },
  {
    standard: { name: 'Samoa Standard Time', abbrev: 'sst' },
    alias: ['somoan'],
    zones: ['Pacific/Midway', 'Pacific/Pago_Pago']
  },
  {
    standard: { name: 'Chamorro Standard Time', abbrev: 'chst' },
    zones: ['Pacific/Guam', 'Pacific/Saipan']
  },
  {
    standard: { name: 'Papua New Guinea Time', abbrev: 'pgt' },
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
