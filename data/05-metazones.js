//From https://Github.com/Mj1856/Timezonenames
// and from  https://Github.com/Nodatime/Nodatime/Blob/Master/Data/Cldr/Windowszones-35.xml

module.exports = [
  //This one needs work
  {
    standard: { name: 'greenwich standard time', abbrev: 'gmt' },
    daylight: { name: 'british summer time', abbrev: 'bst' },
    alias: ['utc', 'british', 'britain'],
    pick: 'Europe/London',
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
      'atlantic/Reykjavik',
      'atlantic/St_Helena',
      'etc/Gmt',
      'Europe/Dublin', //?
      'Europe/Guernsey',
      'Europe/Isle_Of_Man',
      'Europe/Jersey',
      'Europe/London'
    ]
  },

  //North america
  {
    standard: { name: 'central standard time', abbrev: 'cst' },
    daylight: { name: 'central daylight time', abbrev: 'cdt' },
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
      'America/Winnipeg',
      'cst6cdt'
    ]
  },
  {
    standard: { name: 'mountain standard time', abbrev: 'mst' },
    daylight: { name: 'mountain daylight time', abbrev: 'mdt' },
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
    standard: { name: 'atlantic standard time', abbrev: 'ast' },
    daylight: { name: 'atlantic daylight time', abbrev: 'adt' },
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
    standard: { name: 'eastern standard time', abbrev: 'est' },
    daylight: { name: 'eastern daylight time', abbrev: 'edt' },
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
    standard: { name: 'pacific standard time', abbrev: 'pst' },
    daylight: { name: 'pacific daylight time', abbrev: 'pdt' },
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
    standard: { name: 'alaskan standard time', abbrev: 'ahst' },
    daylight: { name: 'alaskan daylight time', abbrev: 'ahdt' },
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
    standard: { name: 'hawaiian standard time', abbrev: 'hst' },
    alias: ['aleutian standard time'],
    pick: 'Pacific/Honolulu',
    zones: ['America/Adak', 'Pacific/Honolulu', 'Pacific/Johnston']
  },
  {
    standard: { name: 'newfoundland standard time', abbrev: 'nst' },
    daylight: { name: 'newfoundland standard time', abbrev: 'ndt' },
    pick: 'America/St_Johns',
    zones: ['America/St_Johns']
  },

  ///Europe
  {
    standard: { name: 'central european time', abbrev: 'cet' },
    daylight: { name: 'central european summer time', abbrev: 'cest' },
    alias: ['romance standard time'],
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
    standard: { name: 'eastern european time', abbrev: 'eet' },
    daylight: { name: 'eastern european summer time', abbrev: 'eest' },
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
    standard: { name: 'western european time', abbrev: 'wet' },
    daylight: { name: 'western european summer time', abbrev: 'west' },
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
    standard: { name: 'turkey standard time', abbrev: 'trt' },
    pick: 'Europe/Istanbul',
    zones: ['Europe/Istanbul']
  },
  // samara: ['Europe/Samara', 'Europe/Saratov'],
  // volgograd: ['Europe/Volgograd'],

  //Africa
  {
    standard: { name: 'east africa time', abbrev: 'eat' },
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
      'indian/Antananarivo',
      'indian/Comoro',
      'indian/Mayotte'
    ]
  },
  {
    standard: { name: 'central africa time', abbrev: 'cat' },
    pick: 'Africa/Khartoum',
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
    standard: { name: 'south africa standard time', abbrev: 'sast' },
    pick: 'Africa/Johannesburg',
    zones: ['Africa/Johannesburg', 'Africa/Maseru', 'Africa/Mbabane']
  },
  {
    standard: { name: 'west africa standard time', abbrev: 'wat' },
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
    standard: { name: 'australian central standard time', abbrev: 'acst' },
    daylight: { name: 'australian central daylight time', abbrev: 'acdt' },
    pick: 'australia/Adelaide',
    zones: ['australia/Adelaide', 'australia/Broken_Hill', 'australia/Darwin']
  },
  {
    standard: { name: 'australian eastern standard time', abbrev: 'aest' },
    daylight: { name: 'australian eastern daylight time', abbrev: 'aedt' },
    pick: 'australia/Brisbane',
    zones: [
      'australia/Brisbane',
      'australia/Currie',
      'australia/Hobart',
      'australia/Lindeman',
      'australia/Melbourne',
      'australia/Sydney'
    ]
  },
  {
    standard: { name: 'australian western standard time', abbrev: 'awst' },
    daylight: { name: 'australian western daylight time', abbrev: 'awdt' },
    pick: 'australia/Perth',
    zones: ['Antarctica/Casey', 'australia/Perth']
  },
  {
    standard: { name: 'australian central western standard time', abbrev: 'acwst' },
    pick: 'australia/Eucla',
    zones: ['australia/Eucla']
  },
  {
    standard: { name: 'lord howe standard time', abbrev: 'lhst' },
    daylight: { name: 'lord howe daylight time', abbrev: 'lhdt' },
    pick: 'australia/Lord_Howe',
    zones: ['australia/Lord_Howe']
  },

  //Russia
  {
    standard: { name: 'russian standard time', abbrev: 'msk' },
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

  //South america
  {
    standard: { name: 'brazil time', abbrev: 'brt' },
    alias: ['brasília'],
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
    standard: { name: 'argentina time', abbrev: 'art' },
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
    standard: { name: 'amazon time', abbrev: 'amst' },
    pick: 'America/Manaus',
    zones: [
      'America/Boa_Vista',
      'America/Campo_Grande',
      'America/Cuiaba', //Has dst?
      'America/Manaus',
      'America/Porto_Velho'
    ]
  },
  // argentina_Western: ['America/Argentina/San_Luis'],
  // paraguay: ['America/Asuncion'],
  // colombia: ['America/Bogota'],
  // venezuela: ['America/Caracas'],
  // french_Guiana: ['America/Cayenne'],
  // acre: ['America/Eirunepe', 'America/Rio_Branco'],
  // greenland_Western: ['America/Godthab'],
  // ecuador: ['America/Guayaquil'],
  // guyana: ['America/Guyana'],
  // cuba: ['America/Havana'],
  // bolivia: ['America/La_Paz'],
  // peru: ['America/Lima'],
  // pierre_Miquelon: ['America/Miquelon'],
  // uruguay: ['America/Montevideo'],
  // noronha: ['America/Noronha'],
  // suriname: ['America/Paramaribo'],
  // chile: ['America/Punta_Arenas', 'America/Santiago', 'Antarctica/Palmer'],
  // mexico_Northwest: ['America/Santa_Isabel'],
  // greenland_Eastern: ['America/Scoresbysund'],
  // davis: ['Antarctica/Davis'],
  // dumontdurville: ['Antarctica/Dumontdurville'],
  // macquarie: ['Antarctica/Macquarie'],
  // mawson: ['Antarctica/Mawson'],
  // new_Zealand: ['Antarctica/Mcmurdo', 'Pacific/Auckland'],
  // rothera: ['Antarctica/Rothera'],
  // syowa: ['Antarctica/Syowa'],
  // vostok: ['Antarctica/Vostok'],

  //Middle-east
  {
    standard: { name: 'arabic standard time', abbrev: 'ast' },
    pick: 'Asia/Baghdad',
    zones: ['Asia/Aden', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Riyadh']
  },
  {
    standard: { name: 'iran standard time', abbrev: 'irst' },
    daylight: { name: 'iran daylight time', abbrev: 'irdt' },
    pick: 'Asia/Tehran',
    zones: ['Asia/Tehran']
  },
  {
    standard: { name: 'pakistan standard time', abbrev: 'pkt' },
    pick: 'Asia/Karachi',
    zones: ['Asia/Karachi']
  },
  {
    standard: { name: 'india standard time', abbrev: 'ist' },
    pick: 'Asia/Calcutta',
    zones: ['Asia/Calcutta', 'Asia/Colombo']
  },
  {
    standard: { name: 'south east asia standard time', abbrev: 'ict' },
    alias: ['indochina'],
    pick: 'Asia/Bangkok',
    zones: ['Asia/Bangkok', 'Asia/Phnom_Penh', 'Asia/Saigon', 'Asia/Vientiane']
  },
  {
    standard: { name: 'china standard time', abbrev: 'ct' },
    pick: 'Asia/Shanghai',
    zones: ['Asia/Macau', 'Asia/Shanghai']
  }

  // kazakhstan_Eastern: ['Asia/Almaty', 'Asia/Qostanay'],
  // anadyr: ['Asia/Anadyr'],
  // kazakhstan_Western: ['Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Qyzylorda'],
  // turkmenistan: ['Asia/Ashgabat'],
  // azerbaijan: ['Asia/Baku'],
  // kyrgystan: ['Asia/Bishkek'],
  // brunei: ['Asia/Brunei'],
  // yakutsk: ['Asia/Chita', 'Asia/Khandyga', 'Asia/Yakutsk'],
  // choibalsan: ['Asia/Choibalsan'],
  // bangladesh: ['Asia/Dhaka'],
  // east_Timor: ['Asia/Dili'],
  // gulf: ['Asia/Dubai', 'Asia/Muscat'],
  // tajikistan: ['Asia/Dushanbe'],
  // hong_Kong: ['Asia/Hong_Kong'],
  // hovd: ['Asia/Hovd'],
  // irkutsk: ['Asia/Irkutsk'],
  // indonesia_Western: ['Asia/Jakarta', 'Asia/Pontianak'],
  // indonesia_Eastern: ['Asia/Jayapura'],
  // israel: ['Asia/Jerusalem'],
  // afghanistan: ['Asia/Kabul'],
  // kamchatka: ['Asia/Kamchatka'],
  // nepal: ['Asia/Katmandu'],
  // krasnoyarsk: ['Asia/Krasnoyarsk', 'Asia/Novokuznetsk', 'Asia/Barnaul'],
  // malaysia: ['Asia/Kuala_Lumpur', 'Asia/Kuching'],
  // magadan: ['Asia/Magadan'],
  // indonesia_Central: ['Asia/Makassar'],
  // philippines: ['Asia/Manila'],
  // novosibirsk: ['Asia/Novosibirsk'],
  // omsk: ['Asia/Omsk'],
  // korea: ['Asia/Pyongyang', 'Asia/Seoul'],
  // myanmar: ['Asia/Rangoon'],
  // sakhalin: ['Asia/Sakhalin'],
  // uzbekistan: ['Asia/Samarkand', 'Asia/Tashkent'],
  // singapore: ['Asia/Singapore'],
  // srednekolymsk: ['Asia/Srednekolymsk'],
  // taipei: ['Asia/Taipei'],
  // georgia: ['Asia/Tbilisi'],

  // bhutan: ['Asia/Thimphu'],
  // japan: ['Asia/Tokyo'],
  // mongolia: ['Asia/Ulaanbaatar'],
  // urumqi: ['Asia/Urumqi'],
  // vladivostok: ['Asia/Ust-nera', 'Asia/Vladivostok'],
  // yekaterinburg: ['Asia/Yekaterinburg'],
  // armenia: ['Asia/Yerevan'],
  // azores: ['atlantic/Azores'],
  // cape_Verde: ['atlantic/Cape_Verde'],
  // south_Georgia: ['atlantic/South_Georgia'],
  // falkland: ['atlantic/Stanley'],

  //India
  // indian_Ocean: ['indian/Chagos'],
  // christmas: ['indian/Christmas'],
  // cocos: ['indian/Cocos'],
  // french_Southern: ['indian/Kerguelen'],
  // seychelles: ['indian/Mahe'],
  // maldives: ['indian/Maldives'],
  // mauritius: ['indian/Mauritius'],
  // reunion: ['indian/Reunion'],

  //Pacific
  // apia: ['Pacific/Apia'],
  // papua_New_Guinea: ['Pacific/Bougainville', 'Pacific/Port_Moresby'],
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
  // chamorro: ['Pacific/Guam', 'Pacific/Saipan'],
  // line_Islands: ['Pacific/Kiritimati'],
  // kosrae: ['Pacific/Kosrae'],
  // marshall_Islands: ['Pacific/Kwajalein', 'Pacific/Majuro'],
  // marquesas: ['Pacific/Marquesas'],
  // samoa: ['Pacific/Midway', 'Pacific/Pago_Pago'],
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
]
