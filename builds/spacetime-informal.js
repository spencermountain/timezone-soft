/* spacetime v0.0.1
   github.com/spencermountain/spacetime-informal
   MIT
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.spacetimeInformal = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
"use strict";

module.exports = '0.0.1';

},{}],2:[function(_dereq_,module,exports){
"use strict";

// this is a very rough list of informal and abbreviated timezones
// i am not an expert, or even half-knowledgeable in this subject.
// please help.
// partially from: https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations
//format:  'best/iana': [standard, daylight, alias...]
var informal = {
  //North america
  'America/Halifax': ['ast', 'adt', 'atlantic'],
  //or 'arabia standard time'
  'America/New_York': ['est', 'edt', 'eastern'],
  //or 'Ecuador Time'
  'America/Chicago': ['cst', 'cdt', 'central'],
  'America/Denver': ['mst', 'mdt', 'mountain'],
  'America/Los_Angeles': ['pst', 'pdt', 'Pacific'],
  'America/Anchorage': ['ahst', 'ahdt', 'akst', 'akdt', 'alaska'],
  //Alaska Standard Time
  'America/St_Johns': ['nst', 'ndt', 'nt', 'newfoundland', 'nddt'],
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
  // fnt: -2, //fernando de noronha time
  // pmdt: -2, //Saint pierre and miquelon daylight time
  // pmst: -3, //Saint pierre and miquelon standard time
  // rott: -3, //rothera research station time
  // awt: 'America/Blanc-sablon',
  // addt: 'America/pangnirtung',
  // apt: 'America/Blanc-sablon',
  // cddt: 'America/rankin_inlet',
  // cwt: 'America/Mexico_city',
  // cpt: 'America/Atikokan',
  // eddt: 'America/iqaluit',
  // ept: 'America/Detroit',
  // ewt: 'America/Detroit',
  // ect: 'America/Anguilla', //eastern caribbean time (does not recognise dst)
  // 'eastern caribbean': 'America/Anguilla',
  // ffmt: 'America/Martinique',
  // kmt: 'America/grand_turk',
  // mddt: 'America/Cambridge_bay',
  // mpt: 'America/Boise',
  // mwt: 'America/phoenix',
  // nwt: 'America/Adak',
  // // npt: 'America/goose_bay',
  // pddt: 'America/inuvik',
  // ppmt: 'America/port-au-prince',
  // ppt: 'America/Dawson_creek',
  // pwt: 'America/Dawson_creek',
  // qmt: 'America/guayaquil',
  // sdmt: 'America/Santo_domingo',
  // sjmt: 'America/Costa_rica',
  // ydt: 'America/Dawson', //yukon
  // ypt: 'America/Dawson',
  // yddt: 'America/Dawson',
  // ywt: 'America/Dawson',
  // yst: 'America/whitehorse',
  //europe
  'Europe/London': ['gmt', 'bst', 'british'],
  //Britain is different
  'ETC/GMT': ['gmt', null, 'greenwich'],
  'Europe/Lisbon': ['wet', 'west', 'west europe'],
  //western europe
  'Europe/Berlin': ['cet', 'cest', 'central europe', 'middle european', 'met', 'mest'],
  //Central europe
  'Europe/Riga': ['eet', 'eest', 'east europe', 'kalt'],
  //eastern europe
  // -- these are old european ones, before the EU, i think:
  // 'europe/Minsk': ['feet', 'feest', 'eastern europe'], //further eastern europe (discontinued)
  // ace: 'europe/Dublin',
  // amt: 'europe/Amsterdam',
  // bdst: 'europe/gibraltar',
  // bmt: 'europe/Brussels',
  // bst: 'europe/gibraltar', //British summer time
  // 'british summer': 1,
  // dmt: 'europe/Dublin',
  // dft: 1, //Aix-specific equivalent of central european time
  // cmt: 'europe/Copenhagen',
  // // ist: 'europe/Dublin',
  // imt: 'europe/Sofia',
  // lst: 'europe/riga',
  // pmt: 'europe/prague',
  // rmt: 'europe/rome',
  // set: 'europe/Stockholm',
  // wemt: 'europe/Madrid',
  // tse: 'europe/Dublin',
  // utc: 'etc/utc', //Coordinated universal time
  // 'coordinated universal': 'etc/utc',
  //russia
  'Europe/Moscow': ['msk', null, 'fet', 'mdst', 'msd'],
  //'further eastern europe'
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
  'Asia/Tashkent': ['uzt', 'uzbekistan'],
  //uzbekistan time
  'Asia/Bishkek': ['kgt', 'kyrgyzstan'],
  //kyrgyzstan time
  'Antarctica/Vostok': ['vost'],
  'Asia/Hovd': ['hovt'],
  'Asia/Ashgabat': ['tmt', null, 'turkmenistan'],
  // wmt: 'europe/warsaw',
  // 'europe/volgograd':['volt']
  //Africa
  'Africa/Lagos': ['wat', 'wast', 'west africa'],
  //west african
  'Africa/Khartoum': ['cat', null, 'central africa'],
  'vfrica/Nairobi': ['eat', null, 'east africa'],
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
  // 'Asia/yerevan': ['amt', null, 'armenia'], //(sorry!)
  'Asia/Baku': ['azt', null, 'azerbaijan'],
  'Asia/Jerusalem': [null, 'idt', 'israel', 'jmt', 'iddt'],
  //using ist for india
  'Asia/Tehran': ['irst', 'irdt', 'iran'],
  'Asia/Karachi': ['pkt', null, 'pakistan'],
  'Asia/Kabul': ['aft', null, 'afghanistan'],
  'Asia/Dushanbe': ['tjt', null, 'tajikistan'],
  'Asia/Almaty': ['almt', null, 'alma ata'],
  'Asia/Dubai': ['gst', null, 'gulf'],
  //india
  'Asia/Kolkata': ['ist', null, 'india', 'slst'],
  // 'Asia/Dhaka': ['bst', null, 'bangladesh'], //(sorry)
  'Asia/Thimbu': ['btt', null, 'bhutan'],
  'Indian/Maldives': ['mvt'],
  'Asia/Kathmandu': ['npt', null, 'nepal'],
  'Indian/Cocos': ['cct', null, 'cocos island'],
  'Indian/Chagos': ['iot', null, 'indian chagos'],
  'Indian/Kerguelen': ['tft', null, 'french southern and antarctic'],
  // biot: 6, //British indian ocean time
  // iot: 3, //indian ocean time
  //Asia
  'Asia/Shanghai': ['ct', null, 'china', 'hkt'],
  'Asia/Ulaanbaatar': ['ulat'],
  'Asia/Seoul': ['kst', null, 'korea'],
  'Asia/Tokyo': ['jst', null, 'japan'],
  'Asia/Phnom_Penh': ['ict', null, 'indochina'],
  'Asia/Manila': ['pht', null, 'philippines'],
  'Asia/Singapore': ['sgt'],
  // mmt: 'Asia/Colombo',
  //Australia
  'Australia/Brisbane': ['aest', 'aedt', 'Australian east'],
  //Australian eastern standard time
  'Australia/Adelaide': ['acst', 'acdt', 'Australian central'],
  //Australian central daylight savings time
  'Australia/Eucla': ['acwst', null, 'cwst', 'Australian central western'],
  //Australian central western standard time (unofficial)
  'Australia/Perth': ['awst', 'awdt', 'Australian west'],
  //Australian western standard time
  'Pacific/Auckland': ['nzst', 'nzdt', 'nzmt'],
  'Australia/Lord_Howe': ['lhst', 'lhdt'],
  //pacific
  'Pacific/Guam': ['chst'],
  'Pacific/Chatham': ['chast', 'chadt'],
  'Pacific/Honolulu': ['hst'],
  'Asia/Brunei': ['bnt', null, 'bdt'],
  'Pacific/Midway': ['sst', null, 'samoa', 'sdt'],
  'Pacific/Niue': ['nut'],
  'Pacific/Fakaofo': ['tkt'],
  'Pacific/Rarotonga': ['ckt', null, 'cook islands'],
  'Chile/Easterisland': ['east', 'easst', 'easter island', 'emt'],
  'Asia/Jayapura': ['wit', null, 'east indonesia'],
  'Asia/Jakarta': ['wib', null, 'west indonesia'],
  'Asia/Makassar': ['wita', null, 'central indonesia'],
  'Pacific/Galapagos': ['galt'],
  'Pacific/Fiji': ['fjt', 'fjst'],
  'Asia/Dili': ['tlt', null, 'east timor'],
  'Indian/Christmas': ['cxt'] // sbt: 11, //Solomon islands time
  // mht: 12, //Marshall islands time
  // bit: -12, //Baker island time
  // cist: -8, //Clipperton island standard time
  // chut: 10, //Chuuk time
  // ddut: 10, //Dumont durville time
  // gst: 'Pacific/guam',
  // gamt: -9, //gambier islands time
  // git: -9, //gambier island time
  // gilt: 12, //gilbert island time
  // idlw: -12, //international day line west time zone
  // 'international day line west': -12,
  // kost: 11, //kosrae time
  // lint: 14, //Line islands time
  // magt: 12, //Magadan time
  // mist: 11, //Macquarie island station time
  // nct: 11, //New caledonia time
  // nft: 11, //Norfolk island time
  // phot: 13, //phoenix island time
  // pont: 11, //pohnpei standard time
  // pett: 12, //kamchatka time
  // mart: -9.5, //Marquesas islands time
  // mit: -9.5, //Marquesas islands time
  // myt: 8, //Malaysia time
  // nut: -11, //Niue time
  // pht: 8, //philippine time
  // pgt: 10, //papua new guinea time
  // pmmt: 'Pacific/Bougainville',
  // // smt: 'Asia/Singapore',
  // sakt: 11, //Sakhalin island time
  // sret: 11, //Srednekolymsk time
  // sst: 'Pacific/pago_pago',
  // taht: -10, //tahiti time
  // tvt: 12, //tuvalu time
  // tkt: 13, //tokelau time
  // tot: 13, //tonga time
  // vut: 11, //vanuatu time
  // wakt: 12, //wake island time
  //i forget (sorry!)
  // haec: 2, //Heure avancée deurope centrale french-language name for cest
  // syot: 3, //Showa station time
  // yekt: 5, //yekaterinburg time
  // sct: 4, //Seychelles time
  // orat: 5, //oral time
  // mawt: 5, //Mawson station time
  // hovt: 7, //khovd standard time
  // hovst: 8, //khovd summer time
  // davt: 7, //Davis time
  // chost: 9, //Choibalsan summer time
  // chot: 8, //Choibalsan standard time
  // wst: 8, //western standard time
  //use each abbreviation as a key

};
var lookup = Object.keys(informal).reduce(function (h, k) {
  var arr = informal[k];

  for (var i = 0; i < 5; i += 1) {
    if (arr[i]) {
      h[arr[i]] = k;
    }
  }

  return h;
}, {});
module.exports = {
  informal: informal,
  lookup: lookup
};

},{}],3:[function(_dereq_,module,exports){
"use strict";

//these timezone abbreviations are used aggressively in other places
//if tz doesn't have an abbreviation, and is in the same offset...
//these are pretty subjective. i just made them up.
var greedy_north = {
  '-8': 'America/Anchorage',
  '-7': 'America/Los_Angeles',
  '-6': 'America/Denver',
  '-5': 'America/Chicago',
  '-4': 'America/New_York',
  '-3': 'America/Halifax',
  '0': 'ETC/GMT',
  '1': 'Europe/Lisbon',
  '2': 'Europe/Berlin',
  // '3': 'europe/riga',
  // '3': 'europe/moscow',
  '8': 'Asia/Shanghai'
};
var greedy_south = {
  '-3': 'america/Sao_Paulo',
  '0': 'ETC/GMT',
  '1': 'Africa/Lagos',
  // '2': 'africa/khartoum',//central africa
  '2': 'Africa/Johannesburg',
  //south africa
  '3': 'Africa/Nairobi',
  '10': 'Australia/Brisbane',
  '12': 'Pacific/Auckland'
};
var british = {
  'Europe/Belfast': true,
  'Europe/Dublin': true,
  'Europe/Guernsey': true,
  'Europe/Jersey': true
};
module.exports = {
  greedy_north: greedy_north,
  greedy_south: greedy_south,
  british: british
};

},{}],4:[function(_dereq_,module,exports){
"use strict";

var informal = _dereq_('../data').informal;

var data = _dereq_('./data'); //England is BST/GMT, for some reason


var handleSpecial = function handleSpecial(tz, offset) {
  if (data.british.hasOwnProperty(tz)) {
    if (offset === '1') {
      return 'BST';
    }

    return 'GMT';
  }

  return null;
}; //is it EST or EDT ?


var chooseAbbrev = function chooseAbbrev(arr, obj) {
  if (arr[1] && obj.dst === true) {
    return arr[1].toUpperCase();
  }

  if (arr[0]) {
    return arr[0].toUpperCase();
  }

  return null;
};

var display = function display(tz) {
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  //try a straight-up match
  if (informal.hasOwnProperty(tz)) {
    var abbr = chooseAbbrev(informal[tz], obj);

    if (abbr !== null) {
      return abbr;
    }
  }

  var offset = String(obj.default_offset);
  var special = handleSpecial(tz, offset);

  if (special) {
    return special;
  }

  if (obj.hemisphere === 'North' && data.greedy_north.hasOwnProperty(offset)) {
    var useTz = data.greedy_north[offset];
    return chooseAbbrev(informal[useTz], obj) || '';
  }

  if (obj.hemisphere === 'South' && data.greedy_south.hasOwnProperty(offset)) {
    var _useTz = data.greedy_south[offset];
    return chooseAbbrev(informal[_useTz], obj) || '';
  }

  return '';
};

module.exports = display;

},{"../data":2,"./data":3}],5:[function(_dereq_,module,exports){
"use strict";

var lookup = _dereq_('./lookup');

var display = _dereq_('./display');

var version = _dereq_('../_version');

module.exports = {
  find: lookup,
  display: display,
  version: version
};

},{"../_version":1,"./display":4,"./lookup":6}],6:[function(_dereq_,module,exports){
"use strict";

var data = _dereq_('../data').lookup; //


var lookup = function lookup(str) {
  if (data.hasOwnProperty(str) === true) {
    return data[str];
  }

  return null;
};

module.exports = lookup;

},{"../data":2}]},{},[5])(5)
});
