//  a list of judgement-calls for country → timezone mappings
//  with 'new zealand' we usually want 'pacific/auckland'.
//  based on population, country-capital, and geographical center
//  often some guesswork!

module.exports = {
  //first, these countries only have one timezone.
  andorra: {
    code: 'ad',
    choice: 'europe/andorra'
  },
  oman: {
    code: 'om',
    choice: 'asia/dubai'
  },
  afghanistan: {
    code: 'af',
    choice: 'asia/kabul'
  },
  'virgin islands': {
    code: 'vi',
    choice: 'america/port_of_spain'
  },
  albania: {
    code: 'al',
    choice: 'europe/tirane'
  },
  armenia: {
    code: 'am',
    choice: 'asia/yerevan'
  },
  nigeria: {
    code: 'ng',
    choice: 'africa/lagos'
  },
  austria: {
    code: 'at',
    choice: 'europe/vienna'
  },
  'st maarten': {
    code: 'sx',
    choice: 'america/curacao'
  },
  finland: {
    code: 'fi',
    choice: 'europe/helsinki'
  },
  azerbaijan: {
    code: 'az',
    choice: 'asia/baku'
  },
  slovenia: {
    code: 'si',
    choice: 'europe/belgrade'
  },
  barbados: {
    code: 'bb',
    choice: 'america/barbados'
  },
  bangladesh: {
    code: 'bd',
    choice: 'asia/dhaka'
  },
  belgium: {
    code: 'be',
    choice: 'europe/brussels'
  },
  togo: {
    code: 'tg',
    choice: 'africa/abidjan'
  },
  bulgaria: {
    code: 'bg',
    choice: 'europe/sofia'
  },
  qatar: {
    code: 'qa',
    choice: 'asia/qatar'
  },
  zimbabwe: {
    code: 'zw',
    choice: 'africa/maputo'
  },
  bermuda: {
    code: 'bm',
    choice: 'atlantic/bermuda'
  },
  brunei: {
    code: 'bn',
    choice: 'asia/brunei'
  },
  bolivia: {
    code: 'bo',
    choice: 'america/la_paz'
  },
  bahamas: {
    code: 'bs',
    choice: 'america/nassau'
  },
  bhutan: {
    code: 'bt',
    choice: 'asia/thimphu'
  },
  belarus: {
    code: 'by',
    choice: 'europe/minsk'
  },
  belize: {
    code: 'bz',
    choice: 'america/belize'
  },
  'cocos islands': {
    code: 'cc',
    choice: 'indian/cocos'
  },
  liechtenstein: {
    code: 'li',
    choice: 'europe/zurich'
  },
  'cook islands': {
    code: 'ck',
    choice: 'pacific/rarotonga'
  },
  colombia: {
    code: 'co',
    choice: 'america/bogota'
  },
  'costa rica': {
    code: 'cr',
    choice: 'america/costa_rica'
  },
  cuba: {
    code: 'cu',
    choice: 'america/havana'
  },
  'cape verde': {
    code: 'cv',
    choice: 'atlantic/cape_verde'
  },
  'christmas island': {
    code: 'cx',
    choice: 'indian/christmas'
  },
  slovakia: {
    code: 'sk',
    choice: 'europe/prague'
  },
  mayotte: {
    code: 'yt',
    choice: 'africa/nairobi'
  },
  denmark: {
    code: 'dk',
    choice: 'europe/copenhagen'
  },
  'dominican republic': {
    code: 'do',
    choice: 'america/santo_domingo'
  },
  algeria: {
    code: 'dz',
    choice: 'africa/algiers'
  },
  estonia: {
    code: 'ee',
    choice: 'europe/tallinn'
  },
  egypt: {
    code: 'eg',
    choice: 'africa/cairo'
  },
  'western sahara': {
    code: 'eh',
    choice: 'africa/el_aaiun'
  },
  fiji: {
    code: 'fj',
    choice: 'pacific/fiji'
  },
  'falkland islands': {
    code: 'fk',
    choice: 'atlantic/stanley'
  },
  'faroe islands': {
    code: 'fo',
    choice: 'atlantic/faroe'
  },
  france: {
    code: 'fr',
    choice: 'europe/paris'
  },
  jersey: {
    code: 'je',
    choice: 'europe/london'
  },
  georgia: {
    code: 'ge',
    choice: 'asia/tbilisi'
  },
  'french guiana': {
    code: 'gf',
    choice: 'america/cayenne'
  },
  ghana: {
    code: 'gh',
    choice: 'africa/accra'
  },
  gibraltar: {
    code: 'gi',
    choice: 'europe/gibraltar'
  },
  greece: {
    code: 'gr',
    choice: 'europe/athens'
  },
  'south georgia': {
    code: 'gs',
    choice: 'atlantic/south_georgia'
  },
  guatemala: {
    code: 'gt',
    choice: 'america/guatemala'
  },
  'northern mariana islands': {
    code: 'mp',
    choice: 'pacific/guam'
  },
  'guinea bissau': {
    code: 'gw',
    choice: 'africa/bissau'
  },
  guyana: {
    code: 'gy',
    choice: 'america/guyana'
  },
  'hong kong': {
    code: 'hk',
    choice: 'asia/hong_kong'
  },
  honduras: {
    code: 'hn',
    choice: 'america/tegucigalpa'
  },
  haiti: {
    code: 'ht',
    choice: 'america/port-au-prince'
  },
  hungary: {
    code: 'hu',
    choice: 'europe/budapest'
  },
  ireland: {
    code: 'ie',
    choice: 'europe/dublin'
  },
  israel: {
    code: 'il',
    choice: 'asia/jerusalem'
  },
  india: {
    code: 'in',
    choice: 'asia/kolkata'
  },
  'british indian ocean territory': {
    code: 'io',
    choice: 'indian/chagos'
  },
  iraq: {
    code: 'iq',
    choice: 'asia/baghdad'
  },
  iran: {
    code: 'ir',
    choice: 'asia/tehran'
  },
  iceland: {
    code: 'is',
    choice: 'atlantic/reykjavik'
  },
  'vatican city': {
    code: 'va',
    choice: 'europe/rome'
  },
  jamaica: {
    code: 'jm',
    choice: 'america/jamaica'
  },
  jordan: {
    code: 'jo',
    choice: 'asia/amman'
  },
  japan: {
    code: 'jp',
    choice: 'asia/tokyo'
  },
  kyrgyzstan: {
    code: 'kg',
    choice: 'asia/bishkek'
  },
  'north korea': {
    code: 'kp',
    choice: 'asia/pyongyang'
  },
  'south korea': {
    code: 'kr',
    choice: 'asia/seoul'
  },
  yemen: {
    code: 'ye',
    choice: 'asia/riyadh'
  },
  panama: {
    code: 'pa',
    choice: 'america/panama'
  },
  lebanon: {
    code: 'lb',
    choice: 'asia/beirut'
  },
  'sri lanka': {
    code: 'lk',
    choice: 'asia/colombo'
  },
  liberia: {
    code: 'lr',
    choice: 'africa/monrovia'
  },
  'south africa': {
    code: 'za',
    choice: 'africa/johannesburg'
  },
  lithuania: {
    code: 'lt',
    choice: 'europe/vilnius'
  },
  luxembourg: {
    code: 'lu',
    choice: 'europe/luxembourg'
  },
  latvia: {
    code: 'lv',
    choice: 'europe/riga'
  },
  libya: {
    code: 'ly',
    choice: 'africa/tripoli'
  },
  morocco: {
    code: 'ma',
    choice: 'africa/casablanca'
  },
  monaco: {
    code: 'mc',
    choice: 'europe/monaco'
  },
  moldova: {
    code: 'md',
    choice: 'europe/chisinau'
  },
  myanmar: {
    code: 'mm',
    choice: 'asia/yangon'
  },
  //(alias for myanmar)
  burma: {
    code: 'mm',
    choice: 'asia/yangon'
  },
  macau: {
    code: 'mo',
    choice: 'asia/macau'
  },
  martinique: {
    code: 'mq',
    choice: 'america/martinique'
  },
  malta: {
    code: 'mt',
    choice: 'europe/malta'
  },
  mauritius: {
    code: 'mu',
    choice: 'indian/mauritius'
  },
  maldives: {
    code: 'mv',
    choice: 'indian/maldives'
  },
  namibia: {
    code: 'na',
    choice: 'africa/windhoek'
  },
  'new caledonia': {
    code: 'nc',
    choice: 'pacific/noumea'
  },
  'norfolk island': {
    code: 'nf',
    choice: 'pacific/norfolk'
  },
  nicaragua: {
    code: 'ni',
    choice: 'america/managua'
  },
  netherlands: {
    code: 'nl',
    choice: 'europe/amsterdam'
  },
  'svalbard and jan mayen': {
    code: 'sj',
    choice: 'europe/oslo'
  },
  nepal: {
    code: 'np',
    choice: 'asia/kathmandu'
  },
  nauru: {
    code: 'nr',
    choice: 'pacific/nauru'
  },
  niue: {
    code: 'nu',
    choice: 'pacific/niue'
  },
  peru: {
    code: 'pe',
    choice: 'america/lima'
  },
  philippines: {
    code: 'ph',
    choice: 'asia/manila'
  },
  pakistan: {
    code: 'pk',
    choice: 'asia/karachi'
  },
  poland: {
    code: 'pl',
    choice: 'europe/warsaw'
  },
  'st pierre and miquelon': {
    code: 'pm',
    choice: 'america/miquelon'
  },
  pitcairn: {
    code: 'pn',
    choice: 'pacific/pitcairn'
  },
  'puerto rico': {
    code: 'pr',
    choice: 'america/puerto_rico'
  },
  palau: {
    code: 'pw',
    choice: 'pacific/palau'
  },
  paraguay: {
    code: 'py',
    choice: 'america/asuncion'
  },
  romania: {
    code: 'ro',
    choice: 'europe/bucharest'
  },
  'solomon islands': {
    code: 'sb',
    choice: 'pacific/guadalcanal'
  },
  seychelles: {
    code: 'sc',
    choice: 'indian/mahe'
  },
  sudan: {
    code: 'sd',
    choice: 'africa/khartoum'
  },
  sweden: {
    code: 'se',
    choice: 'europe/stockholm'
  },
  singapore: {
    code: 'sg',
    choice: 'asia/singapore'
  },
  suriname: {
    code: 'sr',
    choice: 'america/paramaribo'
  },
  'south sudan': {
    code: 'ss',
    choice: 'africa/juba'
  },
  'sao tome': {
    code: 'st',
    choice: 'africa/sao_tome'
  },
  'el salvador': {
    code: 'sv',
    choice: 'america/el_salvador'
  },
  syria: {
    code: 'sy',
    choice: 'asia/damascus'
  },
  'turks and caicos': {
    code: 'tc',
    choice: 'america/grand_turk'
  },
  chad: {
    code: 'td',
    choice: 'africa/ndjamena'
  },
  tajikistan: {
    code: 'tj',
    choice: 'asia/dushanbe'
  },
  tokelau: {
    code: 'tk',
    choice: 'pacific/fakaofo'
  },
  'east timor': {
    code: 'tl',
    choice: 'asia/dili'
  },
  turkmenistan: {
    code: 'tm',
    choice: 'asia/ashgabat'
  },
  tunisia: {
    code: 'tn',
    choice: 'africa/tunis'
  },
  tonga: {
    code: 'to',
    choice: 'pacific/tongatapu'
  },
  turkey: {
    code: 'tr',
    choice: 'europe/istanbul'
  },
  tuvalu: {
    code: 'tv',
    choice: 'pacific/funafuti'
  },
  taiwan: {
    code: 'tw',
    choice: 'asia/taipei'
  },
  uruguay: {
    code: 'uy',
    choice: 'america/montevideo'
  },
  venezuela: {
    code: 've',
    choice: 'america/caracas'
  },
  vanuatu: {
    code: 'vu',
    choice: 'pacific/efate'
  },
  'wallis and futuna': {
    code: 'wf',
    choice: 'pacific/wallis'
  },
  'western samoa': {
    code: 'ws',
    choice: 'pacific/apia'
  },
  samoa: {
    code: 'ws',
    choice: 'pacific/apia'
  },

  ////////////
  /// these countries have more than one timezone
  /// and i picked one.
  // (i tried to do my best.)

  antarctica: {
    code: 'aq',
    choice: 'antarctica/davis'
  },
  argentina: {
    code: 'ar',
    choice: 'america/argentina/cordoba'
  },
  australia: {
    code: 'au',
    choice: 'australia/sydney'
  },
  brazil: {
    code: 'br',
    choice: 'america/sao_paulo'
  },
  canada: {
    code: 'ca',
    choice: 'america/toronto'
  },
  congo: {
    code: 'cd',
    choice: 'africa/kinshasa' //'africa/lagos'?
  },
  chile: {
    code: 'cl',
    choice: 'america/santiago'
  },
  china: {
    code: 'cn',
    choice: 'asia/shanghai'
  },
  cyprus: {
    code: 'cy',
    choice: 'asia/nicosia'
  },
  germany: {
    code: 'de',
    choice: 'europe/berlin'
  },
  ecuador: {
    code: 'ec',
    choice: 'america/guayaquil'
  },
  spain: {
    code: 'es',
    choice: 'europe/madrid'
  },
  micronesia: {
    code: 'fm',
    choice: 'pacific/pohnpei'
  },
  greenland: {
    code: 'gl',
    choice: 'america/godthab'
  },
  indonesia: {
    code: 'id',
    choice: 'asia/jakarta'
  },
  kiribati: {
    code: 'ki',
    choice: 'pacific/kiritimati'
  },
  kazakhstan: {
    code: 'kz',
    choice: 'asia/almaty'
  },
  'marshall islands': {
    code: 'mh',
    choice: 'pacific/majuro'
  },
  mongolia: {
    code: 'mn',
    choice: 'asia/ulaanbaatar'
  },
  mexico: {
    code: 'mx',
    choice: 'america/mexico_city' // 'america/monterrey'?
  },
  malaysia: {
    code: 'my',
    choice: 'asia/kuala_lumpur'
  },
  'new zealand': {
    code: 'nz',
    choice: 'pacific/auckland'
  },
  'french polynesia': {
    code: 'pf',
    choice: 'pacific/pohnpei'
  },
  'papua new guinea': {
    code: 'pg',
    choice: 'pacific/port_moresby'
  },
  palestine: {
    code: 'ps',
    choice: 'asia/gaza'
  },
  portugal: {
    code: 'pt',
    choice: 'europe/lisbon'
  },
  russia: {
    code: 'ru',
    choice: 'europe/moscow' // 'europe/kaliningrad'?
  },
  'french southern and antarctic lands': {
    code: 'tf',
    choice: 'indian/kerguelen'
  },
  ukraine: {
    code: 'ua',
    choice: 'europe/kiev'
  },
  'us minor outlying islands': {
    code: 'um',
    choice: 'pacific/wake'
  },
  'united states': {
    code: 'us',
    choice: 'america/new_york'
  },
  uzbekistan: {
    code: 'uz',
    choice: 'asia/tashkent' //'asia/samarkand'
  },
  vietnam: {
    code: 'vn',
    choice: 'asia/ho_chi_minh'
  }
}
