//  a list of judgement-calls for country → timezone mappings
//  with 'new zealand' we usually want 'pacific/auckland'.
//  based on population, country-capital, and geographical center
//  often some guesswork!

module.exports = {
  //first, these countries only have one timezone.
  andorra: {
    code: 'AD',
    choice: 'europe/andorra'
  },
  oman: {
    code: 'OM',
    choice: 'asia/dubai'
  },
  afghanistan: {
    code: 'AF',
    choice: 'asia/kabul'
  },
  'virgin islands': {
    code: 'VI',
    choice: 'america/port_of_spain'
  },
  albania: {
    code: 'AL',
    choice: 'europe/tirane'
  },
  armenia: {
    code: 'AM',
    choice: 'asia/yerevan'
  },
  nigeria: {
    code: 'NG',
    choice: 'africa/lagos'
  },
  austria: {
    code: 'AT',
    choice: 'europe/vienna'
  },
  'st maarten': {
    code: 'SX',
    choice: 'america/curacao'
  },
  finland: {
    code: 'FI',
    choice: 'europe/helsinki'
  },
  azerbaijan: {
    code: 'AZ',
    choice: 'asia/baku'
  },
  slovenia: {
    code: 'SI',
    choice: 'europe/belgrade'
  },
  barbados: {
    code: 'BB',
    choice: 'america/barbados'
  },
  bangladesh: {
    code: 'BD',
    choice: 'asia/dhaka'
  },
  belgium: {
    code: 'BE',
    choice: 'europe/brussels'
  },
  togo: {
    code: 'TG',
    choice: 'africa/abidjan'
  },
  bulgaria: {
    code: 'BG',
    choice: 'europe/sofia'
  },
  qatar: {
    code: 'QA',
    choice: 'asia/qatar'
  },
  zimbabwe: {
    code: 'ZW',
    choice: 'africa/maputo'
  },
  bermuda: {
    code: 'BM',
    choice: 'atlantic/bermuda'
  },
  brunei: {
    code: 'BN',
    choice: 'asia/brunei'
  },
  bolivia: {
    code: 'BO',
    choice: 'america/la_paz'
  },
  bahamas: {
    code: 'BS',
    choice: 'america/nassau'
  },
  bhutan: {
    code: 'BT',
    choice: 'asia/thimphu'
  },
  belarus: {
    code: 'BY',
    choice: 'europe/minsk'
  },
  belize: {
    code: 'BZ',
    choice: 'america/belize'
  },
  'cocos islands': {
    code: 'CC',
    choice: 'indian/cocos'
  },
  liechtenstein: {
    code: 'LI',
    choice: 'europe/zurich'
  },
  'cook islands': {
    code: 'CK',
    choice: 'pacific/rarotonga'
  },
  colombia: {
    code: 'CO',
    choice: 'america/bogota'
  },
  'costa rica': {
    code: 'CR',
    choice: 'america/costa_rica'
  },
  cuba: {
    code: 'CU',
    choice: 'america/havana'
  },
  'cape verde': {
    code: 'CV',
    choice: 'atlantic/cape_verde'
  },
  'christmas island': {
    code: 'CX',
    choice: 'indian/christmas'
  },
  slovakia: {
    code: 'SK',
    choice: 'europe/prague'
  },
  mayotte: {
    code: 'YT',
    choice: 'africa/nairobi'
  },
  denmark: {
    code: 'DK',
    choice: 'europe/copenhagen'
  },
  'dominican republic': {
    code: 'DO',
    choice: 'america/santo_domingo'
  },
  algeria: {
    code: 'DZ',
    choice: 'africa/algiers'
  },
  estonia: {
    code: 'EE',
    choice: 'europe/tallinn'
  },
  egypt: {
    code: 'EG',
    choice: 'africa/cairo'
  },
  'western sahara': {
    code: 'EH',
    choice: 'africa/el_aaiun'
  },
  fiji: {
    code: 'FJ',
    choice: 'pacific/fiji'
  },
  'falkland islands': {
    code: 'FK',
    choice: 'atlantic/stanley'
  },
  'faroe islands': {
    code: 'FO',
    choice: 'atlantic/faroe'
  },
  france: {
    code: 'FR',
    choice: 'europe/paris'
  },
  jersey: {
    code: 'JE',
    choice: 'europe/london'
  },
  georgia: {
    code: 'GE',
    choice: 'asia/tbilisi'
  },
  'french guiana': {
    code: 'GF',
    choice: 'america/cayenne'
  },
  ghana: {
    code: 'GH',
    choice: 'africa/accra'
  },
  gibraltar: {
    code: 'GI',
    choice: 'europe/gibraltar'
  },
  greece: {
    code: 'GR',
    choice: 'europe/athens'
  },
  'south georgia': {
    code: 'GS',
    choice: 'atlantic/south_georgia'
  },
  guatemala: {
    code: 'GT',
    choice: 'america/guatemala'
  },
  'northern mariana islands': {
    code: 'MP',
    choice: 'pacific/guam'
  },
  'guinea bissau': {
    code: 'GW',
    choice: 'africa/bissau'
  },
  guyana: {
    code: 'GY',
    choice: 'america/guyana'
  },
  'hong kong': {
    code: 'HK',
    choice: 'asia/hong_kong'
  },
  honduras: {
    code: 'HN',
    choice: 'america/tegucigalpa'
  },
  haiti: {
    code: 'HT',
    choice: 'america/port-au-prince'
  },
  hungary: {
    code: 'HU',
    choice: 'europe/budapest'
  },
  ireland: {
    code: 'IE',
    choice: 'europe/dublin'
  },
  israel: {
    code: 'IL',
    choice: 'asia/jerusalem'
  },
  india: {
    code: 'IN',
    choice: 'asia/kolkata'
  },
  'british indian ocean territory': {
    code: 'IO',
    choice: 'indian/chagos'
  },
  iraq: {
    code: 'IQ',
    choice: 'asia/baghdad'
  },
  iran: {
    code: 'IR',
    choice: 'asia/tehran'
  },
  iceland: {
    code: 'IS',
    choice: 'atlantic/reykjavik'
  },
  'vatican city': {
    code: 'VA',
    choice: 'europe/rome'
  },
  jamaica: {
    code: 'JM',
    choice: 'america/jamaica'
  },
  jordan: {
    code: 'JO',
    choice: 'asia/amman'
  },
  japan: {
    code: 'JP',
    choice: 'asia/tokyo'
  },
  kyrgyzstan: {
    code: 'KG',
    choice: 'asia/bishkek'
  },
  'north korea': {
    code: 'KP',
    choice: 'asia/pyongyang'
  },
  'south korea': {
    code: 'KR',
    choice: 'asia/seoul'
  },
  yemen: {
    code: 'YE',
    choice: 'asia/riyadh'
  },
  panama: {
    code: 'PA',
    choice: 'america/panama'
  },
  lebanon: {
    code: 'LB',
    choice: 'asia/beirut'
  },
  'sri lanka': {
    code: 'LK',
    choice: 'asia/colombo'
  },
  liberia: {
    code: 'LR',
    choice: 'africa/monrovia'
  },
  'south africa': {
    code: 'ZA',
    choice: 'africa/johannesburg'
  },
  lithuania: {
    code: 'LT',
    choice: 'europe/vilnius'
  },
  luxembourg: {
    code: 'LU',
    choice: 'europe/luxembourg'
  },
  latvia: {
    code: 'LV',
    choice: 'europe/riga'
  },
  libya: {
    code: 'LY',
    choice: 'africa/tripoli'
  },
  morocco: {
    code: 'MA',
    choice: 'africa/casablanca'
  },
  monaco: {
    code: 'MC',
    choice: 'europe/monaco'
  },
  moldova: {
    code: 'MD',
    choice: 'europe/chisinau'
  },
  'myanmar (burma)': {
    code: 'MM',
    choice: 'asia/yangon'
  },
  //(alias for myanmar)
  burma: {
    code: 'MM',
    choice: 'asia/yangon'
  },
  macau: {
    code: 'MO',
    choice: 'asia/macau'
  },
  martinique: {
    code: 'MQ',
    choice: 'america/martinique'
  },
  malta: {
    code: 'MT',
    choice: 'europe/malta'
  },
  mauritius: {
    code: 'MU',
    choice: 'indian/mauritius'
  },
  maldives: {
    code: 'MV',
    choice: 'indian/maldives'
  },
  namibia: {
    code: 'NA',
    choice: 'africa/windhoek'
  },
  'new caledonia': {
    code: 'NC',
    choice: 'pacific/noumea'
  },
  'norfolk island': {
    code: 'NF',
    choice: 'pacific/norfolk'
  },
  nicaragua: {
    code: 'NI',
    choice: 'america/managua'
  },
  netherlands: {
    code: 'NL',
    choice: 'europe/amsterdam'
  },
  'svalbard and jan mayen': {
    code: 'SJ',
    choice: 'europe/oslo'
  },
  nepal: {
    code: 'NP',
    choice: 'asia/kathmandu'
  },
  nauru: {
    code: 'NR',
    choice: 'pacific/nauru'
  },
  niue: {
    code: 'NU',
    choice: 'pacific/niue'
  },
  peru: {
    code: 'PE',
    choice: 'america/lima'
  },
  philippines: {
    code: 'PH',
    choice: 'asia/manila'
  },
  pakistan: {
    code: 'PK',
    choice: 'asia/karachi'
  },
  poland: {
    code: 'PL',
    choice: 'europe/warsaw'
  },
  'st pierre and miquelon': {
    code: 'PM',
    choice: 'america/miquelon'
  },
  pitcairn: {
    code: 'PN',
    choice: 'pacific/pitcairn'
  },
  'puerto rico': {
    code: 'PR',
    choice: 'america/puerto_rico'
  },
  palau: {
    code: 'PW',
    choice: 'pacific/palau'
  },
  paraguay: {
    code: 'PY',
    choice: 'america/asuncion'
  },
  romania: {
    code: 'RO',
    choice: 'europe/bucharest'
  },
  'solomon islands': {
    code: 'SB',
    choice: 'pacific/guadalcanal'
  },
  seychelles: {
    code: 'SC',
    choice: 'indian/mahe'
  },
  sudan: {
    code: 'SD',
    choice: 'africa/khartoum'
  },
  sweden: {
    code: 'SE',
    choice: 'europe/stockholm'
  },
  singapore: {
    code: 'SG',
    choice: 'asia/singapore'
  },
  suriname: {
    code: 'SR',
    choice: 'america/paramaribo'
  },
  'south sudan': {
    code: 'SS',
    choice: 'africa/juba'
  },
  'sao tome': {
    code: 'ST',
    choice: 'africa/sao_tome'
  },
  'el salvador': {
    code: 'SV',
    choice: 'america/el_salvador'
  },
  syria: {
    code: 'SY',
    choice: 'asia/damascus'
  },
  'turks and caicos': {
    code: 'TC',
    choice: 'america/grand_turk'
  },
  chad: {
    code: 'TD',
    choice: 'africa/ndjamena'
  },
  tajikistan: {
    code: 'TJ',
    choice: 'asia/dushanbe'
  },
  tokelau: {
    code: 'TK',
    choice: 'pacific/fakaofo'
  },
  'east timor': {
    code: 'TL',
    choice: 'asia/dili'
  },
  turkmenistan: {
    code: 'TM',
    choice: 'asia/ashgabat'
  },
  tunisia: {
    code: 'TN',
    choice: 'africa/tunis'
  },
  tonga: {
    code: 'TO',
    choice: 'pacific/tongatapu'
  },
  turkey: {
    code: 'TR',
    choice: 'europe/istanbul'
  },
  tuvalu: {
    code: 'TV',
    choice: 'pacific/funafuti'
  },
  taiwan: {
    code: 'TW',
    choice: 'asia/taipei'
  },
  uruguay: {
    code: 'UY',
    choice: 'america/montevideo'
  },
  venezuela: {
    code: 'VE',
    choice: 'america/caracas'
  },
  vanuatu: {
    code: 'VU',
    choice: 'pacific/efate'
  },
  'wallis and futuna': {
    code: 'WF',
    choice: 'pacific/wallis'
  },
  'western samoa': {
    code: 'WS',
    choice: 'pacific/apia'
  },
  samoa: {
    code: 'WS',
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
