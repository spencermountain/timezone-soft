//from https://github.com/mj1856/timezonenames
// and from  https://github.com/nodatime/nodatime/blob/master/data/cldr/windowszones-35.xml

module.exports = [
  //this one needs work
  {
    standard: { name: 'greenwich standard time', abbrev: 'gmt' },
    daylight: { name: 'british summer time', abbrev: 'bst' },
    alias: ['utc', 'british', 'britain'],
    pick: 'europe/london',
    zones: [
      'africa/abidjan',
      'africa/accra',
      'africa/bamako',
      'africa/banjul',
      'africa/bissau',
      'africa/conakry',
      'africa/dakar',
      'africa/freetown',
      'africa/lome',
      'africa/monrovia',
      'africa/nouakchott',
      'africa/ouagadougou',
      'africa/sao_tome',
      'america/danmarkshavn',
      'antarctica/troll',
      'atlantic/reykjavik',
      'atlantic/st_helena',
      'etc/gmt',
      'europe/dublin', //?
      'europe/guernsey',
      'europe/isle_of_man',
      'europe/jersey',
      'europe/london'
    ]
  },

  //north america
  {
    standard: { name: 'central standard time', abbrev: 'cst' },
    daylight: { name: 'central daylight time', abbrev: 'cdt' },
    pick: 'america/chicago',
    zones: [
      'america/bahia_banderas',
      'america/belize',
      'america/chicago',
      'america/costa_rica',
      'america/el_salvador',
      'america/guatemala',
      'america/indiana/knox',
      'america/indiana/tell_city',
      'america/managua',
      'america/matamoros',
      'america/menominee',
      'america/merida',
      'america/mexico_city',
      'america/monterrey',
      'america/north_dakota/beulah',
      'america/north_dakota/center',
      'america/north_dakota/new_salem',
      'america/rainy_river',
      'america/rankin_inlet',
      'america/regina',
      'america/resolute',
      'america/swift_current',
      'america/tegucigalpa',
      'america/winnipeg',
      'cst6cdt'
    ]
  },
  {
    standard: { name: 'mountain standard time', abbrev: 'mst' },
    daylight: { name: 'mountain daylight time', abbrev: 'mdt' },
    pick: 'america/denver',
    zones: [
      'america/boise',
      'america/cambridge_bay',
      'america/creston',
      'america/dawson_creek',
      'america/denver',
      'america/edmonton',
      'america/fort_nelson',
      'america/inuvik',
      'america/ojinaga',
      'america/phoenix',
      'america/yellowknife',
      'mst7mdt',
      // add mexico
      'america/chihuahua',
      'america/hermosillo',
      'america/mazatlan'
    ]
  },
  {
    standard: { name: 'atlantic standard time', abbrev: 'ast' },
    daylight: { name: 'atlantic daylight time', abbrev: 'adt' },
    pick: 'america/halifax',
    zones: [
      'america/anguilla',
      'america/antigua',
      'america/aruba',
      'america/barbados',
      'america/blanc-sablon',
      'america/curacao',
      'america/dominica',
      'america/glace_bay',
      'america/goose_bay',
      'america/grenada',
      'america/guadeloupe',
      'america/halifax',
      'america/kralendijk',
      'america/lower_princes',
      'america/marigot',
      'america/martinique',
      'america/moncton',
      'america/montserrat',
      'america/port_of_spain',
      'america/puerto_rico',
      'america/santo_domingo',
      'america/st_barthelemy',
      'america/st_kitts',
      'america/st_lucia',
      'america/st_thomas',
      'america/st_vincent',
      'america/thule',
      'america/tortola',
      'atlantic/bermuda'
    ]
  },
  {
    standard: { name: 'eastern standard time', abbrev: 'est' },
    daylight: { name: 'eastern daylight time', abbrev: 'edt' },
    pick: 'america/new_york',
    zones: [
      'america/cancun',
      'america/cayman',
      'america/coral_harbour',
      'america/detroit',
      'america/grand_turk',
      'america/indiana/marengo',
      'america/indiana/petersburg',
      'america/indiana/vevay',
      'america/indiana/vincennes',
      'america/indiana/winamac',
      'america/indianapolis',
      'america/iqaluit',
      'america/jamaica',
      'america/kentucky/monticello',
      'america/louisville',
      'america/nassau',
      'america/new_york',
      'america/nipigon',
      'america/panama',
      'america/pangnirtung',
      'america/port-au-prince',
      'america/thunder_bay',
      'america/toronto',
      'est5edt',
      'america/montreal'
    ]
  },
  {
    standard: { name: 'pacific standard time', abbrev: 'pst' },
    daylight: { name: 'pacific daylight time', abbrev: 'pdt' },
    pick: 'america/los_angeles',
    zones: [
      'america/dawson',
      'america/los_angeles',
      'america/tijuana',
      'america/vancouver',
      'america/whitehorse',
      'pst8pdt'
    ]
  },
  {
    standard: { name: 'alaskan standard time', abbrev: 'ahst' },
    daylight: { name: 'alaskan daylight time', abbrev: 'ahdt' },
    pick: 'america/anchorage',
    zones: [
      'america/anchorage',
      'america/juneau',
      'america/metlakatla',
      'america/nome',
      'america/sitka',
      'america/yakutat'
    ]
  },
  {
    standard: { name: 'hawaiian standard time', abbrev: 'hst' },
    alias: ['aleutian standard time'],
    pick: 'pacific/honolulu',
    zones: ['america/adak', 'pacific/honolulu', 'pacific/johnston']
  },
  {
    standard: { name: 'newfoundland standard time', abbrev: 'nst' },
    daylight: { name: 'newfoundland standard time', abbrev: 'ndt' },
    pick: 'america/st_johns',
    zones: ['america/st_johns']
  },

  ///europe
  {
    standard: { name: 'central european time', abbrev: 'cet' },
    daylight: { name: 'central european summer time', abbrev: 'cest' },
    alias: ['romance standard time'],
    pick: 'europe/berlin',
    zones: [
      'africa/algiers',
      'africa/ceuta',
      'africa/tunis',
      'arctic/longyearbyen',
      'europe/amsterdam',
      'europe/andorra',
      'europe/belgrade',
      'europe/berlin',
      'europe/bratislava',
      'europe/brussels',
      'europe/budapest',
      'europe/busingen',
      'europe/copenhagen',
      'europe/gibraltar',
      'europe/ljubljana',
      'europe/luxembourg',
      'europe/madrid',
      'europe/malta',
      'europe/monaco',
      'europe/oslo',
      'europe/paris',
      'europe/podgorica',
      'europe/prague',
      'europe/rome',
      'europe/san_marino',
      'europe/sarajevo',
      'europe/skopje',
      'europe/stockholm',
      'europe/tirane',
      'europe/vaduz',
      'europe/vatican',
      'europe/vienna',
      'europe/warsaw',
      'europe/zagreb',
      'europe/zurich'
    ]
  },
  {
    standard: { name: 'eastern european time', abbrev: 'eet' },
    daylight: { name: 'eastern european summer time', abbrev: 'eest' },
    pick: 'europe/riga',
    zones: [
      'africa/cairo',
      'africa/tripoli',
      'asia/amman',
      'asia/beirut',
      'asia/damascus',
      'asia/famagusta',
      'asia/gaza',
      'asia/hebron',
      'asia/nicosia',
      'europe/athens',
      'europe/bucharest',
      'europe/chisinau',
      'europe/helsinki',
      'europe/kaliningrad',
      'europe/kiev',
      'europe/mariehamn',
      'europe/riga',
      'europe/sofia',
      'europe/tallinn',
      'europe/uzhgorod',
      'europe/vilnius',
      'europe/zaporozhye'
    ]
  },
  {
    standard: { name: 'western european time', abbrev: 'wet' },
    daylight: { name: 'western european summer time', abbrev: 'west' },
    pick: 'europe/lisbon',
    zones: [
      'africa/casablanca',
      'africa/el_aaiun',
      'atlantic/canary',
      'atlantic/faeroe',
      'atlantic/madeira',
      'europe/lisbon'
    ]
  },
  {
    standard: { name: 'turkey standard time', abbrev: 'trt' },
    pick: 'europe/istanbul',
    zones: ['europe/istanbul']
  },
  // samara: ['europe/samara', 'europe/saratov'],
  // volgograd: ['europe/volgograd'],

  //africa
  {
    standard: { name: 'east africa time', abbrev: 'eat' },
    pick: 'africa/nairobi',
    zones: [
      'africa/addis_ababa',
      'africa/asmera',
      'africa/dar_es_salaam',
      'africa/djibouti',
      'africa/juba',
      'africa/kampala',
      'africa/mogadishu',
      'africa/nairobi',
      'indian/antananarivo',
      'indian/comoro',
      'indian/mayotte'
    ]
  },
  {
    standard: { name: 'central africa time', abbrev: 'cat' },
    pick: 'africa/khartoum',
    zones: [
      'africa/blantyre',
      'africa/bujumbura',
      'africa/gaborone',
      'africa/harare',
      'africa/khartoum',
      'africa/kigali',
      'africa/lubumbashi',
      'africa/lusaka',
      'africa/maputo',
      'africa/windhoek'
    ]
  },
  {
    standard: { name: 'south africa standard time', abbrev: 'sast' },
    pick: 'africa/johannesburg',
    zones: ['africa/johannesburg', 'africa/maseru', 'africa/mbabane']
  },
  {
    standard: { name: 'west africa standard time', abbrev: 'wat' },
    pick: 'africa/lagos',
    zones: [
      'africa/bangui',
      'africa/brazzaville',
      'africa/douala',
      'africa/kinshasa',
      'africa/lagos',
      'africa/libreville',
      'africa/luanda',
      'africa/malabo',
      'africa/ndjamena',
      'africa/niamey',
      'africa/porto-novo'
    ]
  },

  //australia
  {
    standard: { name: 'australian central standard time', abbrev: 'acst' },
    daylight: { name: 'australian central daylight time', abbrev: 'acdt' },
    pick: 'australia/adelaide',
    zones: ['australia/adelaide', 'australia/broken_hill', 'australia/darwin']
  },
  {
    standard: { name: 'australian eastern standard time', abbrev: 'aest' },
    daylight: { name: 'australian eastern daylight time', abbrev: 'aedt' },
    pick: 'australia/brisbane',
    zones: [
      'australia/brisbane',
      'australia/currie',
      'australia/hobart',
      'australia/lindeman',
      'australia/melbourne',
      'australia/sydney'
    ]
  },
  {
    standard: { name: 'australian western standard time', abbrev: 'awst' },
    daylight: { name: 'australian western daylight time', abbrev: 'awdt' },
    pick: 'australia/perth',
    zones: ['antarctica/casey', 'australia/perth']
  },
  {
    standard: { name: 'australian central western standard time', abbrev: 'acwst' },
    pick: 'australia/eucla',
    zones: ['australia/eucla']
  },
  {
    standard: { name: 'lord howe standard time', abbrev: 'lhst' },
    daylight: { name: 'lord howe daylight time', abbrev: 'lhdt' },
    pick: 'australia/lord_howe',
    zones: ['australia/lord_howe']
  },

  //russia
  {
    standard: { name: 'russian standard time', abbrev: 'msk' },
    pick: 'europe/moscow',
    zones: [
      'europe/astrakhan',
      'europe/minsk',
      'europe/moscow',
      'europe/simferopol',
      'europe/ulyanovsk',
      'europe/kirov'
    ]
  },

  //south america
  {
    standard: { name: 'brazil time', abbrev: 'brt' },
    alias: ['brasília'],
    pick: 'america/sao_paulo',
    zones: [
      'america/araguaina',
      'america/bahia',
      'america/belem',
      'america/fortaleza',
      'america/maceio',
      'america/recife',
      'america/santarem',
      'america/sao_paulo'
    ]
  },
  {
    standard: { name: 'argentina time', abbrev: 'art' },
    pick: 'america/buenos_aires',
    zones: [
      'america/argentina/la_rioja',
      'america/argentina/rio_gallegos',
      'america/argentina/salta',
      'america/argentina/san_juan',
      'america/argentina/tucuman',
      'america/argentina/ushuaia',
      'america/buenos_aires',
      'america/catamarca',
      'america/cordoba',
      'america/jujuy',
      'america/mendoza'
    ]
  },
  {
    standard: { name: 'amazon time', abbrev: 'amst' },
    pick: 'america/manaus',
    zones: [
      'america/boa_vista',
      'america/campo_grande',
      'america/cuiaba', //has dst?
      'america/manaus',
      'america/porto_velho'
    ]
  },
  // argentina_western: ['america/argentina/san_luis'],
  // paraguay: ['america/asuncion'],
  // colombia: ['america/bogota'],
  // venezuela: ['america/caracas'],
  // french_guiana: ['america/cayenne'],
  // acre: ['america/eirunepe', 'america/rio_branco'],
  // greenland_western: ['america/godthab'],
  // ecuador: ['america/guayaquil'],
  // guyana: ['america/guyana'],
  // cuba: ['america/havana'],
  // bolivia: ['america/la_paz'],
  // peru: ['america/lima'],
  // pierre_miquelon: ['america/miquelon'],
  // uruguay: ['america/montevideo'],
  // noronha: ['america/noronha'],
  // suriname: ['america/paramaribo'],
  // chile: ['america/punta_arenas', 'america/santiago', 'antarctica/palmer'],
  // mexico_northwest: ['america/santa_isabel'],
  // greenland_eastern: ['america/scoresbysund'],
  // davis: ['antarctica/davis'],
  // dumontdurville: ['antarctica/dumontdurville'],
  // macquarie: ['antarctica/macquarie'],
  // mawson: ['antarctica/mawson'],
  // new_zealand: ['antarctica/mcmurdo', 'pacific/auckland'],
  // rothera: ['antarctica/rothera'],
  // syowa: ['antarctica/syowa'],
  // vostok: ['antarctica/vostok'],

  //middle-east
  {
    standard: { name: 'arabic standard time', abbrev: 'ast' },
    pick: 'asia/baghdad',
    zones: ['asia/aden', 'asia/baghdad', 'asia/bahrain', 'asia/kuwait', 'asia/qatar', 'asia/riyadh']
  },
  {
    standard: { name: 'iran standard time', abbrev: 'irst' },
    daylight: { name: 'iran daylight time', abbrev: 'irdt' },
    pick: 'asia/tehran',
    zones: ['asia/tehran']
  },
  {
    standard: { name: 'pakistan standard time', abbrev: 'pkt' },
    pick: 'asia/karachi',
    zones: ['asia/karachi']
  },
  {
    standard: { name: 'india standard time', abbrev: 'ist' },
    pick: 'asia/calcutta',
    zones: ['asia/calcutta', 'asia/colombo']
  },
  {
    standard: { name: 'south east asia standard time', abbrev: 'ict' },
    alias: ['indochina'],
    pick: 'asia/bangkok',
    zones: ['asia/bangkok', 'asia/phnom_penh', 'asia/saigon', 'asia/vientiane']
  },
  {
    standard: { name: 'china standard time', abbrev: 'ct' },
    pick: 'asia/shanghai',
    zones: ['asia/macau', 'asia/shanghai']
  }

  // kazakhstan_eastern: ['asia/almaty', 'asia/qostanay'],
  // anadyr: ['asia/anadyr'],
  // kazakhstan_western: ['asia/aqtau', 'asia/aqtobe', 'asia/atyrau', 'asia/oral', 'asia/qyzylorda'],
  // turkmenistan: ['asia/ashgabat'],
  // azerbaijan: ['asia/baku'],
  // kyrgystan: ['asia/bishkek'],
  // brunei: ['asia/brunei'],
  // yakutsk: ['asia/chita', 'asia/khandyga', 'asia/yakutsk'],
  // choibalsan: ['asia/choibalsan'],
  // bangladesh: ['asia/dhaka'],
  // east_timor: ['asia/dili'],
  // gulf: ['asia/dubai', 'asia/muscat'],
  // tajikistan: ['asia/dushanbe'],
  // hong_kong: ['asia/hong_kong'],
  // hovd: ['asia/hovd'],
  // irkutsk: ['asia/irkutsk'],
  // indonesia_western: ['asia/jakarta', 'asia/pontianak'],
  // indonesia_eastern: ['asia/jayapura'],
  // israel: ['asia/jerusalem'],
  // afghanistan: ['asia/kabul'],
  // kamchatka: ['asia/kamchatka'],
  // nepal: ['asia/katmandu'],
  // krasnoyarsk: ['asia/krasnoyarsk', 'asia/novokuznetsk', 'asia/barnaul'],
  // malaysia: ['asia/kuala_lumpur', 'asia/kuching'],
  // magadan: ['asia/magadan'],
  // indonesia_central: ['asia/makassar'],
  // philippines: ['asia/manila'],
  // novosibirsk: ['asia/novosibirsk'],
  // omsk: ['asia/omsk'],
  // korea: ['asia/pyongyang', 'asia/seoul'],
  // myanmar: ['asia/rangoon'],
  // sakhalin: ['asia/sakhalin'],
  // uzbekistan: ['asia/samarkand', 'asia/tashkent'],
  // singapore: ['asia/singapore'],
  // srednekolymsk: ['asia/srednekolymsk'],
  // taipei: ['asia/taipei'],
  // georgia: ['asia/tbilisi'],

  // bhutan: ['asia/thimphu'],
  // japan: ['asia/tokyo'],
  // mongolia: ['asia/ulaanbaatar'],
  // urumqi: ['asia/urumqi'],
  // vladivostok: ['asia/ust-nera', 'asia/vladivostok'],
  // yekaterinburg: ['asia/yekaterinburg'],
  // armenia: ['asia/yerevan'],
  // azores: ['atlantic/azores'],
  // cape_verde: ['atlantic/cape_verde'],
  // south_georgia: ['atlantic/south_georgia'],
  // falkland: ['atlantic/stanley'],

  //india
  // indian_ocean: ['indian/chagos'],
  // christmas: ['indian/christmas'],
  // cocos: ['indian/cocos'],
  // french_southern: ['indian/kerguelen'],
  // seychelles: ['indian/mahe'],
  // maldives: ['indian/maldives'],
  // mauritius: ['indian/mauritius'],
  // reunion: ['indian/reunion'],

  //pacific
  // apia: ['pacific/apia'],
  // papua_new_guinea: ['pacific/bougainville', 'pacific/port_moresby'],
  // chatham: ['pacific/chatham'],
  // easter: ['pacific/easter'],
  // vanuatu: ['pacific/efate'],
  // phoenix_islands: ['pacific/enderbury'],
  // tokelau: ['pacific/fakaofo'],
  // fiji: ['pacific/fiji'],
  // tuvalu: ['pacific/funafuti'],
  // galapagos: ['pacific/galapagos'],
  // gambier: ['pacific/gambier'],
  // solomon: ['pacific/guadalcanal'],
  // chamorro: ['pacific/guam', 'pacific/saipan'],
  // line_islands: ['pacific/kiritimati'],
  // kosrae: ['pacific/kosrae'],
  // marshall_islands: ['pacific/kwajalein', 'pacific/majuro'],
  // marquesas: ['pacific/marquesas'],
  // samoa: ['pacific/midway', 'pacific/pago_pago'],
  // nauru: ['pacific/nauru'],
  // niue: ['pacific/niue'],
  // norfolk: ['pacific/norfolk'],
  // new_caledonia: ['pacific/noumea'],
  // palau: ['pacific/palau'],
  // pitcairn: ['pacific/pitcairn'],
  // ponape: ['pacific/ponape'],
  // cook: ['pacific/rarotonga'],
  // tahiti: ['pacific/tahiti'],
  // gilbert_islands: ['pacific/tarawa'],
  // tonga: ['pacific/tongatapu'],
  // truk: ['pacific/truk'],
  // wake: ['pacific/wake'],
  // wallis: ['pacific/wallis'],
  // tomsk: ['asia/tomsk']
]
