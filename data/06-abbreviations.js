// this is a very rough list of informal and abbreviated timezones
// i am not an expert, or even half-knowledgeable in this subject.
// please help.
// partially from: https://En.wikipedia.org/Wiki/List_Of_Time_Zone_Abbreviations

//Format:  'best/Iana': [standard, daylight, alias...]
const informal = {
  //North america
  'America/Halifax': ['ast', 'adt', 'atlantic'], //Or 'arabia standard time'
  'America/New_York': ['est', 'edt', 'eastern'], //Or 'Ecuador Time'
  'America/Chicago': ['cst', 'cdt', 'central'],
  'America/Denver': ['mst', 'mdt', 'mountain'],
  'America/Los_Angeles': ['pst', 'pdt', 'pacific'],
  'America/Anchorage': ['ahst', 'ahdt', 'akst', 'akdt', 'alaska'], //Alaska Standard Time
  'America/St_Johns': ['nst', 'ndt', 'nt', 'newfoundland', 'nddt'],

  // awt: 'America/Blanc-sablon',
  // addt: 'America/Pangnirtung',
  // apt: 'America/Blanc-sablon',
  // cddt: 'America/Rankin_Inlet',
  // cwt: 'America/Mexico_City',
  // cpt: 'America/Atikokan',
  // eddt: 'America/Iqaluit',
  // ept: 'America/Detroit',
  // ewt: 'America/Detroit',
  // ect: 'America/Anguilla', //Eastern caribbean time (does not recognise dst)
  // 'eastern caribbean': 'America/Anguilla',
  // ffmt: 'America/Martinique',
  // kmt: 'America/Grand_Turk',
  // mddt: 'America/Cambridge_Bay',
  // mpt: 'America/Boise',
  // mwt: 'America/Phoenix',
  // nwt: 'America/Adak',
  // // npt: 'America/Goose_Bay',
  // pddt: 'America/Inuvik',
  // ppmt: 'America/Port-au-prince',
  // ppt: 'America/Dawson_Creek',
  // pwt: 'America/Dawson_Creek',
  // qmt: 'America/Guayaquil',
  // sdmt: 'America/Santo_Domingo',
  // sjmt: 'America/Costa_Rica',
  // ydt: 'America/Dawson', //Yukon
  // ypt: 'America/Dawson',
  // yddt: 'America/Dawson',
  // ywt: 'America/Dawson',
  // yst: 'America/Whitehorse',

  //South america
  'America/Caracas': ['vet', null, 'venezuela'],
  'America/Bogota': ['cot', null, 'colombia'],
  'America/Cayenne': ['gft', null, 'french guiana'],
  'America/Paramaribo': ['srt', null, 'suriname'],
  'America/Guyana': ['gyt'],
  'America/Buenos_Aires': ['art', null, 'argentina'],
  'America/La_Paz': ['bot', null, 'bolivia'],
  'America/Asuncion': ['pyt', 'pyst', 'paraguay'],
  'America/Santiago': ['clt', 'clst', 'chile'],
  'America/Lima': ['pet', null, 'peru'],
  'America/Montevideo': ['uyt', null, 'uruguay'],
  'Atlantic/Stanley': ['fkst', null, 'falkland island'],
  //Brazil
  'America/Manaus': ['amt'],
  'America/Sao_Paulo': ['brt', 'brst'],
  'Brazil/Acre': ['act'],
  // amst: -3, //Amazon summer time (brazil)
  // fnt: -2, //Fernando de noronha time
  // pmdt: -2, //Saint pierre and miquelon daylight time
  // pmst: -3, //Saint pierre and miquelon standard time
  // rott: -3, //Rothera research station time

  //Europe
  'Europe/London': ['gmt', 'bst', 'british'], //Britain is different
  'ETC/GMT': ['gmt', null, 'greenwich'],
  'Europe/Lisbon': ['wet', 'west', 'west europe'], //Western europe
  'Europe/Berlin': ['cet', 'cest', 'central europe', 'middle european', 'met', 'mest'], //Central europe
  'Europe/Riga': ['eet', 'eest', 'east europe', 'kalt'], //Eastern europe
  // -- these are old european ones, before the EU, i think:
  // 'Europe/Minsk': ['feet', 'feest', 'eastern europe'], //Further eastern europe (discontinued)
  // ace: 'Europe/Dublin',
  // amt: 'Europe/Amsterdam',
  // bdst: 'Europe/Gibraltar',
  // bmt: 'Europe/Brussels',
  // bst: 'Europe/Gibraltar', //British summer time
  // 'british summer': 1,
  // dmt: 'Europe/Dublin',
  // dft: 1, //Aix-specific equivalent of central european time
  // cmt: 'Europe/Copenhagen',
  // // ist: 'Europe/Dublin',
  // imt: 'Europe/Sofia',
  // lst: 'Europe/Riga',
  // pmt: 'Europe/Prague',
  // rmt: 'Europe/Rome',
  // set: 'Europe/Stockholm',
  // wemt: 'Europe/Madrid',
  // tse: 'Europe/Dublin',
  // utc: 'etc/Utc', //Coordinated universal time
  // 'coordinated universal': 'etc/Utc',

  //Russia
  'Europe/Moscow': ['msk', null, 'fet', 'mdst', 'msd'], //'further eastern europe'
  'Europe/Samara': ['samt'],
  'Asia/Yekaterinburg': ['yekt'],
  'Asia/Omsk': ['omst'],
  'Asia/Krasnoyarsk': ['krat'],
  'Asia/Novosibirsk': ['novt'],
  'Asia/Irkutsk': ['irkt'],
  'Asia/Yakutsk': ['yakt'],
  'Asia/Cladivostok': ['vlat'],
  'Asia/Magadan': ['magt'],
  'Asia/Sakhalin': ['sakt'],
  'Asia/Srednekolymsk': ['sret'],
  'Asia/Anadyr': ['anat'],
  'Asia/Kamchatka': ['pett'],

  //Near-russia
  'Asia/Tashkent': ['uzt', 'uzbekistan'], //Uzbekistan time
  'Asia/Bishkek': ['kgt', 'kyrgyzstan'], //Kyrgyzstan time
  'Antarctica/Vostok': ['vost'],
  'Asia/Hovd': ['hovt'],
  'Asia/Ashgabat': ['tmt', null, 'turkmenistan'],
  // wmt: 'Europe/Warsaw',
  // 'Europe/Volgograd':['volt']

  //Africa
  'Africa/Lagos': ['wat', 'wast', 'west africa'], //West african
  'Africa/Khartoum': ['cat', null, 'central africa'],
  'Africa/Nairobi': ['eat', null, 'east africa'],
  'Atlantic/Cape_Verde': ['cvt'],
  'Indian/Mauritius': ['mut'],
  'Indian/Reunion': ['ret'],
  'Africa/Johannesburg': ['sast', null, 'south africa'],

  //Atlantic
  'Atlantic/Azores': ['azot', 'azost', 'hmt'],
  'America/Godthab': ['wgt', 'wgst', 'west greenland'],
  'America/Scoresbysund': ['egt', 'egst', 'east greenland'],

  //Middle-east
  'Europe/Istanbul': ['trt', null, 'turkey'],
  'Asia/Tbilisi': ['get', null, 'georgia'],
  // 'Asia/Yerevan': ['amt', null, 'armenia'], //(sorry!)
  'Asia/Baku': ['azt', null, 'azerbaijan'],
  'Asia/Jerusalem': [null, 'idt', 'israel', 'jmt', 'iddt'], //Using ist for india
  'Asia/Tehran': ['irst', 'irdt', 'iran'],
  'Asia/Karachi': ['pkt', null, 'pakistan'],
  'Asia/Kabul': ['aft', null, 'afghanistan'],
  'Asia/Dushanbe': ['tjt', null, 'tajikistan'],
  'Asia/Almaty': ['almt', null, 'alma ata'],
  'Asia/Dubai': ['gst', null, 'gulf'],

  //India
  'Asia/Kolkata': ['ist', null, 'india', 'slst'],
  // 'Asia/Dhaka': ['bst', null, 'bangladesh'], //(sorry)
  'Asia/Thimbu': ['btt', null, 'bhutan'],
  'Indian/Maldives': ['mvt'],
  'Asia/Kathmandu': ['npt', null, 'nepal'],
  'Indian/Cocos': ['cct', null, 'cocos island'],
  'Indian/Chagos': ['iot', null, 'indian chagos'],
  'Indian/Kerguelen': ['tft', null, 'french southern and antarctic'],
  // biot: 6, //British indian ocean time
  // iot: 3, //Indian ocean time

  //Asia
  'Asia/Shanghai': ['ct', null, 'china', 'hkt'],
  'Asia/Ulaanbaatar': ['ulat'],
  'Asia/Seoul': ['kst', null, 'korea'],
  'Asia/Tokyo': ['jst', null, 'japan'],
  'Asia/Phnom_Penh': ['ict', null],
  'Asia/Manila': ['pht', null, 'philippines'],
  'Asia/Singapore': ['sgt'],
  // mmt: 'Asia/Colombo',

  //Australia
  'Australia/Brisbane': ['aest', 'aedt', 'australian east'], //Australian eastern standard time
  'Australia/Adelaide': ['acst', 'acdt', 'australian central'], //Australian central daylight savings time
  'Australia/Eucla': ['acwst', null, 'cwst', 'australian central western'], //Australian central western standard time (unofficial)
  'Australia/Perth': ['awst', 'awdt', 'australian west'], //Australian western standard time
  'Pacific/Auckland': ['nzst', 'nzdt', 'nzmt'],
  'Australia/Lord_Howe': ['lhst', 'lhdt'],

  //Pacific
  'Pacific/Guam': ['chst'],
  'Pacific/Chatham': ['chast', 'chadt'],
  'Pacific/Honolulu': ['hst'],
  'Asia/Brunei': ['bnt', null, 'bdt'],
  'Pacific/Midway': ['sst', null, 'samoa', 'sdt'],
  'Pacific/Niue': ['nut'],
  'Pacific/Fakaofo': ['tkt'],
  'Pacific/Rarotonga': ['ckt', null, 'cook islands'],
  'Chile/EasterIsland': ['east', 'easst', 'easter island', 'emt'],
  'Asia/Jayapura': ['wit', null, 'east indonesia'],
  'Asia/Jakarta': ['wib', null, 'west indonesia'],
  'Asia/Makassar': ['wita', null, 'central indonesia'],
  'Pacific/Galapagos': ['galt'],
  'Pacific/Fiji': ['fjt', 'fjst'],
  'Asia/Dili': ['tlt', null, 'east timor'],
  'Indian/Christmas': ['cxt']
  // sbt: 11, //Solomon islands time
  // mht: 12, //Marshall islands time
  // bit: -12, //Baker island time
  // cist: -8, //Clipperton island standard time
  // chut: 10, //Chuuk time
  // ddut: 10, //Dumont durville time
  // gst: 'Pacific/Guam',
  // gamt: -9, //Gambier islands time
  // git: -9, //Gambier island time
  // gilt: 12, //Gilbert island time
  // idlw: -12, //International day line west time zone
  // 'international day line west': -12,
  // kost: 11, //Kosrae time
  // lint: 14, //Line islands time
  // magt: 12, //Magadan time
  // mist: 11, //Macquarie island station time
  // nct: 11, //New caledonia time
  // nft: 11, //Norfolk island time
  // phot: 13, //Phoenix island time
  // pont: 11, //Pohnpei standard time
  // pett: 12, //Kamchatka time
  // mart: -9.5, //Marquesas islands time
  // mit: -9.5, //Marquesas islands time
  // myt: 8, //Malaysia time
  // nut: -11, //Niue time
  // pht: 8, //Philippine time
  // pgt: 10, //Papua new guinea time
  // pmmt: 'Pacific/Bougainville',
  // // smt: 'Asia/Singapore',
  // sakt: 11, //Sakhalin island time
  // sret: 11, //Srednekolymsk time
  // sst: 'Pacific/Pago_Pago',
  // taht: -10, //Tahiti time
  // tvt: 12, //Tuvalu time
  // tkt: 13, //Tokelau time
  // tot: 13, //Tonga time
  // vut: 11, //Vanuatu time
  // wakt: 12, //Wake island time

  //I forget (sorry!)
  // haec: 2, //Heure avancée deurope centrale french-language name for cest
  // syot: 3, //Showa station time
  // yekt: 5, //Yekaterinburg time
  // sct: 4, //Seychelles time
  // orat: 5, //Oral time
  // mawt: 5, //Mawson station time
  // hovt: 7, //Khovd standard time
  // hovst: 8, //Khovd summer time
  // davt: 7, //Davis time
  // chost: 9, //Choibalsan summer time
  // chot: 8, //Choibalsan standard time
  // wst: 8, //Western standard time
}

//Use each abbreviation as a key
// const lookup = Object.keys(informal).reduce((h, k) => {
//   let arr = informal[k]
//   for (let i = 0; i < 5; i += 1) {
//     if (arr[i]) {
//       h[arr[i]] = k
//     }
//   }
//   return h
// }, {})

module.exports = informal
