const byState = {
  // America (approximate in some places)
  // https://www.timetemperature.com/tzus/time_zone.shtml
  alaska: 'America/Anchorage',
  // pacific
  'washington state': 'America/Los_Angeles',
  nevada: 'America/Los_Angeles',
  california: 'America/Los_Angeles',
  cali: 'America/Los_Angeles',
  oregon: 'America/Los_Angeles',

  // mountain
  arizona: 'America/Phoenix',
  'new mexico': 'America/Phoenix',
  colorado: 'America/Phoenix',
  utah: 'America/Phoenix',
  wyoming: 'America/Phoenix',
  idaho: 'America/Phoenix',
  montana: 'America/Phoenix',

  // central
  texas: 'America/Chicago',
  tex: 'America/Chicago',
  illinois: 'America/Chicago',
  minnesota: 'America/Chicago',
  'north dakota': 'America/Chicago',
  wisconsin: 'America/Chicago',
  alabama: 'America/Chicago',
  mississippi: 'America/Chicago',
  missouri: 'America/Chicago',
  nebraska: 'America/Chicago',
  oklahoma: 'America/Chicago',
  'south dakota': 'America/Chicago',

  // eastern
  connecticut: 'America/New_York',
  delaware: 'America/New_York',
  florida: 'America/New_York',
  fl: 'America/New_York',
  maine: 'America/New_York',
  maryland: 'America/New_York',
  massachusetts: 'America/New_York',
  'new jersey': 'America/New_York',
  'new york state': 'America/New_York',
  'new york': 'America/New_York',
  ohio: 'America/New_York',
  'washington dc': 'America/New_York',
  washington: 'America/New_York',
  'new hampshire': 'America/New_York',
  'rhode island': 'America/New_York',
  'north carolina': 'America/New_York',
  'south carolina': 'America/New_York',
  michigan: 'America/New_York',
  indiana: 'America/New_York',
  kentucky: 'America/New_York', //split
  pennsylvania: 'America/New_York',
  tennessee: 'America/New_York',
  vermont: 'America/New_York',
  virginia: 'America/New_York',
  'west virginia': 'America/New_York',
  georgia: 'America/New_York',
  arkansas: 'America/Chicago',
  iowa: 'America/Chicago',
  kansas: 'America/Chicago',
  louisiana: 'America/Chicago',

  // pacific
  hawaii: 'Pacific/Honolulu',

  //canada
  alberta: 'America/Edmonton',
  'british columbia': 'America/Vancouver',
  manitoba: 'America/Winnipeg',
  'new brunswick': 'America/Halifax',
  'nova scotia': 'America/Halifax',
  ontario: 'America/Toronto',
  'prince edward island': 'America/Halifax',
  pei: 'America/Halifax',
  quebec: 'America/Toronto',
  saskatchewan: 'America/Regina',
  yukon: 'America/Vancouver',
  // 'nunavut',
  // 'newfoundland',
  // 'newfoundland and labrador',

  //australia
  // 'norfolk',
  queensland: 'Australia/Brisbane',
  tasmania: 'Australia/Hobart',
  // 'victoria',

  //china
  qinghai: 'Asia/Shanghai',
  sichuan: 'Asia/Shanghai',
  gansu: 'Asia/Shanghai',
  hunan: 'Asia/Shanghai',
  guangdong: 'Asia/Shanghai',
  guizhou: 'Asia/Shanghai',
  fujian: 'Asia/Shanghai',
  jiangxi: 'Asia/Shanghai',

  //india
  rajasthan: 'Asia/Kolkata',
  madhya: 'Asia/Kolkata',
  maharashtra: 'Asia/Kolkata',
  'uttar pradesh': 'Asia/Kolkata',
  kashmir: 'Asia/Kolkata',
  gujarat: 'Asia/Kolkata',
  karnataka: 'Asia/Kolkata',
  manipur: 'Asia/Kolkata',
  odisha: 'Asia/Kolkata',

  //mexico
  'baja california': 'America/Los_Angeles',
  // mountain
  chihuahua: 'America/Phoenix',
  nayarit: 'America/Phoenix',
  sinaloa: 'America/Phoenix',
  sonora: 'America/Phoenix',
  // central
  coahuila: 'America/Mexico_City',
  chiapas: 'America/Mexico_City',
  durango: 'America/Mexico_City',
  colima: 'America/Mexico_City',
  hidalgo: 'America/Mexico_City',
  jalisco: 'America/Mexico_City',
  'nuevo leon': 'America/Mexico_City',
  queretaro: 'America/Mexico_City',
  'san luis potosi': 'America/Mexico_City',
  tlaxcala: 'America/Mexico_City',
  yucatan: 'America/Mexico_City',
  aguascalientes: 'America/Mexico_City',
  campeche: 'America/Mexico_City',
  guanajuato: 'America/Mexico_City',
  guerrero: 'America/Mexico_City',
  michoacan: 'America/Mexico_City',
  morelos: 'America/Mexico_City',
  oaxaca: 'America/Mexico_City',
  tabasco: 'America/Mexico_City',
  tamaulipas: 'America/Mexico_City',
  veracruz: 'America/Mexico_City',
  zacatecas: 'America/Mexico_City',
  // eastern
  'quintana roo': 'America/New_York',

  //western-europe
  buckinghamshire: 'Europe/London',
  cambridgeshire: 'Europe/London',
  coventry: 'Europe/London',
  derbyshire: 'Europe/London',
  dorset: 'Europe/London',
  essex: 'Europe/London',
  gloucestershire: 'Europe/London',
  hampshire: 'Europe/London',
  hertfordshire: 'Europe/London',
  lancashire: 'Europe/London',
  leeds: 'Europe/London',
  leicestershire: 'Europe/London',
  lincolnshire: 'Europe/London',
  midlands: 'Europe/London',
  'north yorkshire': 'Europe/London',
  northamptonshire: 'Europe/London',
  nottinghamshire: 'Europe/London',
  oxfordshire: 'Europe/London',
  somerset: 'Europe/London',
  staffordshire: 'Europe/London',
  suffolk: 'Europe/London',
  surrey: 'Europe/London',
  sussex: 'Europe/London',
  warwickshire: 'Europe/London',
  yorkshire: 'Europe/London',
  normandy: 'Europe/Paris',
  saxony: 'Europe/Berlin',
  basque: 'Europe/Madrid',
  bavaria: 'Europe/Berlin',
  bremen: 'Europe/Berlin',
  sicily: 'Europe/Rome',
  corsica: 'Europe/Rome',
  tuscany: 'Europe/Rome',
  // 'cumbria',

  //bangladesh
  rajshahi: 'Asia/Dhaka',
  rangpur: 'Asia/Dhaka',
  khulna: 'Asia/Dhaka',
  sylhet: 'Asia/Dhaka',

  //brazil
  // 'minas gerais',
  // 'bahia',
  // 'parana',
  // 'pernambuco',
  // 'ceara',
  // 'para',
  // 'maranhao',
  // 'santa catarina',

  //misc
  siberia: 'Asia/Novosibirsk'
}
export default byState
