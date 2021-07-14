// CLDR metazones, with aliases
// https://github.com/unicode-org/cldr/blob/master/common/supplemental/windowsZones.xml
export default [
  {
    ids: ['Etc/GMT+12'],
    name: 'Dateline Standard Time',
    offset: -12,
    iso: '(UTC-12:00) International Date Line West',
    aliases: ['international date line', 'dateline']
  },
  {
    ids: ['Etc/GMT+11', 'Pacific/Pago_Pago', 'Pacific/Niue', 'Pacific/Midway'],
    name: 'UTC-11',
    offset: -11,
    iso: '(UTC-11:00) Coordinated Universal Time-11',
    aliases: ['coordinated universal time-11', 'utc-11']
  },
  {
    ids: ['America/Adak'],
    name: 'Aleutian Standard Time',
    offset: -9,
    iso: '(UTC-09:00) Aleutian Islands',
    aliases: ['aleutian']
  },
  {
    ids: [
      'Pacific/Honolulu',
      'Pacific/Rarotonga',
      'Pacific/Tahiti',
      'Pacific/Johnston',
      'Etc/GMT+10'
    ],
    name: 'Hawaiian Standard Time',
    offset: -10,
    iso: '(UTC-10:00) Hawaii',
    aliases: ['hawaii', 'hawaiian']
  },
  {
    ids: ['Pacific/Marquesas'],
    name: 'Marquesas Standard Time',
    offset: -9.5,
    iso: '(UTC-09:30) Marquesas Islands',
    aliases: ['marquesas']
  },
  {
    ids: [
      'America/Anchorage',
      'America/Juneau',
      'America/Metlakatla',
      'America/Nome',
      'America/Sitka',
      'America/Yakutat'
    ],
    name: 'Alaskan Standard Time',
    offset: -9,
    iso: '(UTC-09:00) Alaska',
    aliases: ['alaska', 'alaskan']
  },
  {
    ids: ['Etc/GMT+9', 'Pacific/Gambier'],
    name: 'UTC-09',
    offset: -9,
    iso: '(UTC-09:00) Coordinated Universal Time-09',
    aliases: ['coordinated universal time-09', 'utc-09']
  },
  {
    ids: ['America/Tijuana', 'America/Santa_Isabel'],
    name: 'Pacific Standard Time (Mexico)',
    offset: -8,
    iso: '(UTC-08:00) Baja California',
    aliases: ['baja california', 'pacific mexico']
  },
  {
    ids: ['Etc/GMT+8', 'Pacific/Pitcairn'],
    name: 'UTC-08',
    offset: -8,
    iso: '(UTC-08:00) Coordinated Universal Time-08',
    aliases: ['coordinated universal time-08', 'utc-08']
  },
  {
    ids: ['America/Los_Angeles', 'America/Vancouver'],
    name: 'Pacific Standard Time',
    offset: -8,
    iso: '(UTC-08:00) Pacific Time (US & Canada)',
    aliases: ['pacific']
  },
  {
    ids: [
      'America/Phoenix',
      'America/Creston',
      'America/Dawson_Creek',
      'America/Fort_Nelson',
      'America/Hermosillo',
      'Etc/GMT+7'
    ],
    name: 'US Mountain Standard Time',
    offset: -7,
    iso: '(UTC-07:00) Arizona',
    aliases: ['arizona', 'us mountain']
  },
  {
    ids: ['America/Chihuahua', 'America/Mazatlan'],
    name: 'Mountain Standard Time (Mexico)',
    offset: -7,
    iso: '(UTC-07:00) Chihuahua, La Paz, Mazatlan',
    aliases: ['chihuahua', 'la paz', 'mazatlan', 'mountain mexico']
  },
  {
    ids: [
      'America/Denver',
      'America/Edmonton',
      'America/Cambridge_Bay',
      'America/Inuvik',
      'America/Yellowknife',
      'America/Ojinaga',
      'America/Boise',
      'MST7MDT'
    ],
    name: 'Mountain Standard Time',
    offset: -7,
    iso: '(UTC-07:00) Mountain Time (US & Canada)',
    aliases: ['mountain']
  },
  {
    ids: ['America/Whitehorse', 'America/Dawson'],
    name: 'Yukon Standard Time',
    offset: -7,
    iso: '(UTC-07:00) Yukon',
    aliases: ['yukon']
  },
  {
    ids: [
      'America/Guatemala',
      'America/Belize',
      'America/Costa_Rica',
      'Pacific/Galapagos',
      'America/Tegucigalpa',
      'America/Managua',
      'America/El_Salvador',
      'Etc/GMT+6'
    ],
    name: 'Central America Standard Time',
    offset: -6,
    iso: '(UTC-06:00) Central America',
    aliases: ['central america']
  },
  {
    ids: [
      'America/Chicago',
      'America/Winnipeg',
      'America/Rainy_River',
      'America/Rankin_Inlet',
      'America/Resolute',
      'America/Matamoros',
      'America/Indiana/Knox',
      'America/Indiana/Tell_City',
      'America/Menominee',
      'America/North_Dakota/Beulah',
      'America/North_Dakota/Center',
      'America/North_Dakota/New_Salem',
      'CST6CDT'
    ],
    name: 'Central Standard Time',
    offset: -6,
    iso: '(UTC-06:00) Central Time (US & Canada)',
    aliases: ['central']
  },
  {
    ids: ['Pacific/Easter'],
    name: 'Easter Island Standard Time',
    offset: -6,
    iso: '(UTC-06:00) Easter Island',
    aliases: ['easter island']
  },
  {
    ids: ['America/Mexico_City', 'America/Bahia_Banderas', 'America/Merida', 'America/Monterrey'],
    name: 'Central Standard Time (Mexico)',
    offset: -6,
    iso: '(UTC-06:00) Guadalajara, Mexico City, Monterrey',
    aliases: ['guadalajara', 'mexico city', 'monterrey', 'central mexico']
  },
  {
    ids: ['America/Regina', 'America/Swift_Current'],
    name: 'Canada Central Standard Time',
    offset: -6,
    iso: '(UTC-06:00) Saskatchewan',
    aliases: ['saskatchewan', 'canada central']
  },
  {
    ids: [
      'America/Bogota',
      'America/Rio_Branco',
      'America/Eirunepe',
      'America/Coral_Harbour',
      'America/Guayaquil',
      'America/Jamaica',
      'America/Cayman',
      'America/Panama',
      'America/Lima',
      'Etc/GMT+5'
    ],
    name: 'SA Pacific Standard Time',
    offset: -5,
    iso: '(UTC-05:00) Bogota, Lima, Quito, Rio Branco',
    aliases: ['bogota', 'lima', 'quito', 'rio branco', 'sa pacific']
  },
  {
    ids: ['America/Cancun'],
    name: 'Eastern Standard Time (Mexico)',
    offset: -5,
    iso: '(UTC-05:00) Chetumal',
    aliases: ['chetumal', 'eastern mexico']
  },
  {
    ids: [
      'America/New_York',
      'America/Nassau',
      'America/Toronto',
      'America/Iqaluit',
      'America/Montreal',
      'America/Nipigon',
      'America/Pangnirtung',
      'America/Thunder_Bay',
      'America/Detroit',
      'America/Indiana/Petersburg',
      'America/Indiana/Vincennes',
      'America/Indiana/Winamac',
      'America/Kentucky/Monticello',
      'America/Louisville'
    ],
    name: 'Eastern Standard Time',
    offset: -5,
    iso: '(UTC-05:00) Eastern Time (US & Canada)',
    aliases: ['eastern']
  },
  {
    ids: ['America/Port-au-Prince'],
    name: 'Haiti Standard Time',
    offset: -5,
    iso: '(UTC-05:00) Haiti',
    aliases: ['haiti']
  },
  {
    ids: ['America/Havana'],
    name: 'Cuba Standard Time',
    offset: -5,
    iso: '(UTC-05:00) Havana',
    aliases: ['havana', 'cuba']
  },
  {
    ids: ['America/Indianapolis', 'America/Indiana/Marengo', 'America/Indiana/Vevay'],
    name: 'US Eastern Standard Time',
    offset: -5,
    iso: '(UTC-05:00) Indiana (East)',
    aliases: ['us eastern']
  },
  {
    ids: ['America/Grand_Turk'],
    name: 'Turks And Caicos Standard Time',
    offset: -5,
    iso: '(UTC-05:00) Turks and Caicos',
    aliases: ['turks and caicos']
  },
  {
    ids: ['America/Asuncion'],
    name: 'Paraguay Standard Time',
    offset: -4,
    iso: '(UTC-04:00) Asuncion',
    aliases: ['asuncion', 'paraguay']
  },
  {
    ids: [
      'America/Halifax',
      'Atlantic/Bermuda',
      'America/Glace_Bay',
      'America/Goose_Bay',
      'America/Moncton',
      'America/Thule'
    ],
    name: 'Atlantic Standard Time',
    offset: -4,
    iso: '(UTC-04:00) Atlantic Time (Canada)',
    aliases: ['atlantic']
  },
  {
    ids: ['America/Caracas'],
    name: 'Venezuela Standard Time',
    offset: -4,
    iso: '(UTC-04:00) Caracas',
    aliases: ['caracas', 'venezuela']
  },
  {
    ids: ['America/Cuiaba', 'America/Campo_Grande'],
    name: 'Central Brazilian Standard Time',
    offset: -4,
    iso: '(UTC-04:00) Cuiaba',
    aliases: ['cuiaba', 'central brazilian', 'central brazil']
  },
  {
    ids: [
      'America/La_Paz',
      'America/Antigua',
      'America/Anguilla',
      'America/Aruba',
      'America/Barbados',
      'America/St_Barthelemy',
      'America/Kralendijk',
      'America/Manaus',
      'America/Boa_Vista',
      'America/Porto_Velho',
      'America/Blanc-Sablon',
      'America/Curacao',
      'America/Dominica',
      'America/Santo_Domingo',
      'America/Grenada',
      'America/Guadeloupe',
      'America/Guyana',
      'America/St_Kitts',
      'America/St_Lucia',
      'America/Marigot',
      'America/Martinique',
      'America/Montserrat',
      'America/Puerto_Rico',
      'America/Lower_Princes',
      'America/Port_of_Spain',
      'America/St_Vincent',
      'America/Tortola',
      'America/St_Thomas',
      'Etc/GMT+4'
    ],
    name: 'SA Western Standard Time',
    offset: -4,
    iso: '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan',
    aliases: ['georgetown', 'la paz', 'manaus', 'san juan', 'sa western']
  },
  {
    ids: ['America/Santiago'],
    name: 'Pacific SA Standard Time',
    offset: -4,
    iso: '(UTC-04:00) Santiago',
    aliases: ['santiago', 'pacific sa']
  },
  {
    ids: ['America/St_Johns'],
    name: 'Newfoundland Standard Time',
    offset: -3.5,
    iso: '(UTC-03:30) Newfoundland',
    aliases: ['newfoundland']
  },
  {
    ids: ['America/Araguaina'],
    name: 'Tocantins Standard Time',
    offset: -3,
    iso: '(UTC-03:00) Araguaina',
    aliases: ['araguaina', 'tocantins']
  },
  {
    ids: ['America/Sao_Paulo'],
    name: 'E. South America Standard Time',
    offset: -3,
    iso: '(UTC-03:00) Brasilia',
    aliases: ['brasilia', 'east south america']
  },
  {
    ids: [
      'America/Cayenne',
      'Antarctica/Rothera Antarctica/Palmer',
      'America/Fortaleza',
      'America/Belem',
      'America/Maceio',
      'America/Recife',
      'America/Santarem',
      'Atlantic/Stanley',
      'America/Paramaribo',
      'Etc/GMT+3'
    ],
    name: 'SA Eastern Standard Time',
    offset: -3,
    iso: '(UTC-03:00) Cayenne, Fortaleza',
    aliases: ['cayenne', 'fortaleza', 'sa eastern']
  },
  {
    ids: [
      'America/Buenos_Aires',
      'America/Argentina/La_Rioja',
      'America/Argentina/Rio_Gallegos',
      'America/Argentina/Salta',
      'America/Argentina/San_Juan',
      'America/Argentina/San_Luis',
      'America/Argentina/Tucuman',
      'America/Argentina/Ushuaia',
      'America/Catamarca',
      'America/Cordoba',
      'America/Jujuy',
      'America/Mendoza'
    ],
    name: 'Argentina Standard Time',
    offset: -3,
    iso: '(UTC-03:00) City of Buenos Aires',
    aliases: ['buenos aires', 'argentina']
  },
  {
    ids: ['America/Godthab'],
    name: 'Greenland Standard Time',
    offset: -3,
    iso: '(UTC-03:00) Greenland',
    aliases: ['greenland']
  },
  {
    ids: ['America/Montevideo'],
    name: 'Montevideo Standard Time',
    offset: -3,
    iso: '(UTC-03:00) Montevideo',
    aliases: ['montevideo']
  },
  {
    ids: ['America/Punta_Arenas'],
    name: 'Magallanes Standard Time',
    offset: -3,
    iso: '(UTC-03:00) Punta Arenas',
    aliases: ['punta arenas', 'magallanes']
  },
  {
    ids: ['America/Miquelon'],
    name: 'Saint Pierre Standard Time',
    offset: -3,
    iso: '(UTC-03:00) Saint Pierre and Miquelon',
    aliases: ['saint pierre and miquelon', 'saint pierre']
  },
  {
    ids: ['America/Bahia'],
    name: 'Bahia Standard Time',
    offset: -3,
    iso: '(UTC-03:00) Salvador',
    aliases: ['salvador', 'bahia']
  },
  {
    ids: ['Etc/GMT+2', 'America/Noronha', 'Atlantic/South_Georgia'],
    name: 'UTC-02',
    offset: -2,
    iso: '(UTC-02:00) Coordinated Universal Time-02',
    aliases: ['coordinated universal time-02', 'utc-02']
  },
  {
    ids: ['Atlantic/Azores', 'America/Scoresbysund'],
    name: 'Azores Standard Time',
    offset: -1,
    iso: '(UTC-01:00) Azores',
    aliases: ['azores']
  },
  {
    ids: ['Atlantic/Cape_Verde', 'Etc/GMT+1'],
    name: 'Cape Verde Standard Time',
    offset: -1,
    iso: '(UTC-01:00) Cabo Verde Is.',
    aliases: ['cabo verde', 'cape verde']
  },
  {
    ids: ['Etc/GMT', 'America/Danmarkshavn', 'Etc/UTC'],
    name: 'UTC',
    offset: 0,
    iso: '(UTC) Coordinated Universal Time',
    aliases: ['coordinated universal time', 'utc']
  },
  {
    ids: [
      'Europe/London',
      'Atlantic/Canary',
      'Atlantic/Faeroe',
      'Europe/Guernsey',
      'Europe/Dublin',
      'Europe/Isle_of_Man',
      'Europe/Jersey',
      'Europe/Lisbon',
      'Atlantic/Madeira'
    ],
    name: 'GMT Standard Time',
    offset: 0,
    iso: '(UTC+00:00) Dublin, Edinburgh, Lisbon, London',
    aliases: ['dublin', 'edinburgh', 'lisbon', 'london', 'gmt']
  },
  {
    ids: [
      'Atlantic/Reykjavik',
      'Africa/Ouagadougou',
      'Africa/Abidjan',
      'Africa/Accra',
      'Africa/Banjul',
      'Africa/Conakry',
      'Africa/Bissau',
      'Africa/Monrovia',
      'Africa/Bamako',
      'Africa/Nouakchott',
      'Atlantic/St_Helena',
      'Africa/Freetown',
      'Africa/Dakar',
      'Africa/Lome'
    ],
    name: 'Greenwich Standard Time',
    offset: 0,
    iso: '(UTC+00:00) Monrovia, Reykjavik',
    aliases: ['monrovia', 'reykjavik', 'greenwich']
  },
  {
    ids: ['Africa/Sao_Tome'],
    name: 'Sao Tome Standard Time',
    offset: 0,
    iso: '(UTC+00:00) Sao Tome',
    aliases: ['sao tome']
  },
  {
    ids: ['Africa/Casablanca', 'Africa/El_Aaiun'],
    name: 'Morocco Standard Time',
    offset: 1,
    iso: '(UTC+01:00) Casablanca',
    aliases: ['casablanca', 'morocco']
  },
  {
    ids: [
      'Europe/Berlin',
      'Europe/Andorra',
      'Europe/Vienna',
      'Europe/Zurich',
      'Europe/Busingen',
      'Europe/Gibraltar',
      'Europe/Rome',
      'Europe/Vaduz',
      'Europe/Luxembourg',
      'Europe/Monaco',
      'Europe/Malta',
      'Europe/Amsterdam',
      'Europe/Oslo',
      'Europe/Stockholm',
      'Arctic/Longyearbyen',
      'Europe/San_Marino',
      'Europe/Vatican'
    ],
    name: 'W. Europe Standard Time',
    offset: 1,
    iso: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
    aliases: [
      'amsterdam',
      'berlin',
      'bern',
      'rome',
      'stockholm',
      'vienna',
      'west europe',
      'western europe'
    ]
  },
  {
    ids: [
      'Europe/Budapest',
      'Europe/Tirane',
      'Europe/Prague',
      'Europe/Podgorica',
      'Europe/Belgrade',
      'Europe/Ljubljana',
      'Europe/Bratislava'
    ],
    name: 'Central Europe Standard Time',
    offset: 1,
    iso: '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
    aliases: ['belgrade', 'bratislava', 'budapest', 'ljubljana', 'prague', 'central europe']
  },
  {
    ids: ['Europe/Paris', 'Europe/Brussels', 'Europe/Copenhagen', 'Europe/Madrid', 'Africa/Ceuta'],
    name: 'Romance Standard Time',
    offset: 1,
    iso: '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
    aliases: ['brussels', 'copenhagen', 'madrid', 'paris', 'romance']
  },
  {
    ids: ['Europe/Warsaw', 'Europe/Sarajevo', 'Europe/Zagreb', 'Europe/Skopje'],
    name: 'Central European Standard Time',
    offset: 1,
    iso: '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
    aliases: ['sarajevo', 'skopje', 'warsaw', 'zagreb', 'central european', 'central europe']
  },
  {
    ids: [
      'Africa/Lagos',
      'Africa/Luanda',
      'Africa/Porto-Novo',
      'Africa/Kinshasa',
      'Africa/Bangui',
      'Africa/Brazzaville',
      'Africa/Douala',
      'Africa/Algiers',
      'Africa/Libreville',
      'Africa/Malabo',
      'Africa/Niamey',
      'Africa/Ndjamena',
      'Africa/Tunis',
      'Etc/GMT-1'
    ],
    name: 'W. Central Africa Standard Time',
    offset: 1,
    iso: '(UTC+01:00) West Central Africa',
    aliases: ['west central africa', 'w. central africa']
  },
  {
    ids: ['Asia/Amman'],
    name: 'Jordan Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Amman',
    aliases: ['amman', 'jordan']
  },
  {
    ids: ['Europe/Bucharest', 'Asia/Nicosia', 'Asia/Famagusta', 'Europe/Athens'],
    name: 'GTB Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Athens, Bucharest',
    aliases: ['athens', 'bucharest', 'gtb']
  },
  {
    ids: ['Asia/Beirut'],
    name: 'Middle East Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Beirut',
    aliases: ['beirut', 'middle east']
  },
  {
    ids: ['Africa/Cairo'],
    name: 'Egypt Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Cairo',
    aliases: ['cairo', 'egypt']
  },
  {
    ids: ['Europe/Chisinau'],
    name: 'E. Europe Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Chisinau',
    aliases: ['chisinau', 'east europe']
  },
  {
    ids: ['Asia/Damascus'],
    name: 'Syria Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Damascus',
    aliases: ['damascus', 'syria']
  },
  {
    ids: ['Asia/Hebron', 'Asia/Gaza'],
    name: 'West Bank Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Gaza, Hebron',
    aliases: ['gaza', 'hebron', 'west bank']
  },
  {
    ids: [
      'Africa/Johannesburg',
      'Africa/Bujumbura',
      'Africa/Gaborone',
      'Africa/Lubumbashi',
      'Africa/Maseru',
      'Africa/Blantyre',
      'Africa/Maputo',
      'Africa/Kigali',
      'Africa/Juba',
      'Africa/Mbabane',
      'Africa/Lusaka',
      'Africa/Harare',
      'Etc/GMT-2'
    ],
    name: 'South Africa Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Harare, Pretoria',
    aliases: ['harare', 'pretoria', 'south africa']
  },
  {
    ids: [
      'Europe/Kiev',
      'Europe/Mariehamn',
      'Europe/Sofia',
      'Europe/Tallinn',
      'Europe/Helsinki',
      'Europe/Vilnius',
      'Europe/Riga',
      'Europe/Uzhgorod',
      'Europe/Zaporozhye'
    ],
    name: 'FLE Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
    aliases: ['helsinki', 'kyiv', 'riga', 'sofia', 'tallinn', 'vilnius', 'fle']
  },
  {
    ids: ['Asia/Jerusalem'],
    name: 'Israel Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Jerusalem',
    aliases: ['jerusalem', 'israel']
  },
  {
    ids: ['Europe/Kaliningrad'],
    name: 'Kaliningrad Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Kaliningrad',
    aliases: ['kaliningrad']
  },
  {
    ids: ['Africa/Khartoum'],
    name: 'Sudan Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Khartoum',
    aliases: ['khartoum', 'sudan']
  },
  {
    ids: ['Africa/Tripoli'],
    name: 'Libya Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Tripoli',
    aliases: ['tripoli', 'libya']
  },
  {
    ids: ['Africa/Windhoek'],
    name: 'Namibia Standard Time',
    offset: 2,
    iso: '(UTC+02:00) Windhoek',
    aliases: ['windhoek', 'namibia']
  },
  {
    ids: ['Asia/Baghdad'],
    name: 'Arabic Standard Time',
    offset: 3,
    iso: '(UTC+03:00) Baghdad',
    aliases: ['baghdad', 'arabic']
  },
  {
    ids: ['Europe/Istanbul'],
    name: 'Turkey Standard Time',
    offset: 3,
    iso: '(UTC+03:00) Istanbul',
    aliases: ['istanbul', 'turkey']
  },
  {
    ids: ['Asia/Riyadh', 'Asia/Bahrain', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Aden'],
    name: 'Arab Standard Time',
    offset: 3,
    iso: '(UTC+03:00) Kuwait, Riyadh',
    aliases: ['kuwait', 'riyadh', 'arab', 'arabia', 'arabic']
  },
  {
    ids: ['Europe/Minsk'],
    name: 'Belarus Standard Time',
    offset: 3,
    iso: '(UTC+03:00) Minsk',
    aliases: ['minsk', 'belarus']
  },
  {
    ids: ['Europe/Moscow', 'Europe/Kirov', 'Europe/Simferopol'],
    name: 'Russian Standard Time',
    offset: 3,
    iso: '(UTC+03:00) Moscow, St. Petersburg',
    aliases: ['moscow', 'st. petersburg', 'russian']
  },
  {
    ids: [
      'Africa/Nairobi',
      'Antarctica/Syowa',
      'Africa/Djibouti',
      'Africa/Asmera',
      'Africa/Addis_Ababa',
      'Indian/Comoro',
      'Indian/Antananarivo',
      'Africa/Mogadishu',
      'Africa/Dar_es_Salaam',
      'Africa/Kampala',
      'Indian/Mayotte',
      'Etc/GMT-3'
    ],
    name: 'E. Africa Standard Time',
    offset: 3,
    iso: '(UTC+03:00) Nairobi',
    aliases: ['nairobi', 'east africa', 'eastern africa']
  },
  {
    ids: ['Asia/Tehran'],
    name: 'Iran Standard Time',
    offset: 3.5,
    iso: '(UTC+03:30) Tehran',
    aliases: ['tehran', 'iran']
  },
  {
    ids: ['Asia/Dubai', 'Asia/Muscat', 'Etc/GMT-4'],
    name: 'Arabian Standard Time',
    offset: 4,
    iso: '(UTC+04:00) Abu Dhabi, Muscat',
    aliases: ['abu dhabi', 'muscat', 'arabian']
  },
  {
    ids: ['Europe/Astrakhan', 'Europe/Ulyanovsk'],
    name: 'Astrakhan Standard Time',
    offset: 4,
    iso: '(UTC+04:00) Astrakhan, Ulyanovsk',
    aliases: ['astrakhan', 'ulyanovsk']
  },
  {
    ids: ['Asia/Baku'],
    name: 'Azerbaijan Standard Time',
    offset: 4,
    iso: '(UTC+04:00) Baku',
    aliases: ['baku', 'azerbaijan']
  },
  {
    ids: ['Europe/Samara'],
    name: 'Russia Time Zone 3',
    offset: 4,
    iso: '(UTC+04:00) Izhevsk, Samara',
    aliases: ['izhevsk', 'samara', 'russia time zone 3']
  },
  {
    ids: ['Indian/Mauritius', 'Indian/Reunion', 'Indian/Mahe'],
    name: 'Mauritius Standard Time',
    offset: 4,
    iso: '(UTC+04:00) Port Louis',
    aliases: ['port louis', 'mauritius']
  },
  {
    ids: ['Europe/Saratov'],
    name: 'Saratov Standard Time',
    offset: 4,
    iso: '(UTC+04:00) Saratov',
    aliases: ['saratov']
  },
  {
    ids: ['Asia/Tbilisi'],
    name: 'Georgian Standard Time',
    offset: 4,
    iso: '(UTC+04:00) Tbilisi',
    aliases: ['tbilisi', 'georgian']
  },
  {
    ids: ['Europe/Volgograd'],
    name: 'Volgograd Standard Time',
    offset: 4,
    iso: '(UTC+04:00) Volgograd',
    aliases: ['volgograd']
  },
  {
    ids: ['Asia/Yerevan'],
    name: 'Caucasus Standard Time',
    offset: 4,
    iso: '(UTC+04:00) Yerevan',
    aliases: ['yerevan', 'caucasus']
  },
  {
    ids: ['Asia/Kabul'],
    name: 'Afghanistan Standard Time',
    offset: 4.5,
    iso: '(UTC+04:30) Kabul',
    aliases: ['kabul', 'afghanistan']
  },
  {
    ids: [
      'Asia/Tashkent',
      'Antarctica/Mawson',
      'Asia/Oral',
      'Asia/Aqtau',
      'Asia/Aqtobe',
      'Asia/Atyrau',
      'Indian/Maldives',
      'Indian/Kerguelen',
      'Asia/Dushanbe',
      'Asia/Ashgabat',
      'Asia/Samarkand',
      'Etc/GMT-5'
    ],
    name: 'West Asia Standard Time',
    offset: 5,
    iso: '(UTC+05:00) Ashgabat, Tashkent',
    aliases: ['ashgabat', 'tashkent', 'west asia']
  },
  {
    ids: ['Asia/Yekaterinburg'],
    name: 'Ekaterinburg Standard Time',
    offset: 5,
    iso: '(UTC+05:00) Ekaterinburg',
    aliases: ['ekaterinburg']
  },
  {
    ids: ['Asia/Karachi'],
    name: 'Pakistan Standard Time',
    offset: 5,
    iso: '(UTC+05:00) Islamabad, Karachi',
    aliases: ['islamabad', 'karachi', 'pakistan']
  },
  {
    ids: ['Asia/Qyzylorda'],
    name: 'Qyzylorda Standard Time',
    offset: 5,
    iso: '(UTC+05:00) Qyzylorda',
    aliases: ['qyzylorda']
  },
  {
    ids: ['Asia/Calcutta'],
    name: 'India Standard Time',
    offset: 5.5,
    iso: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    aliases: ['chennai', 'kolkata', 'mumbai', 'new delhi', 'india']
  },
  {
    ids: ['Asia/Colombo'],
    name: 'Sri Lanka Standard Time',
    offset: 5.5,
    iso: '(UTC+05:30) Sri Jayawardenepura',
    aliases: ['sri jayawardenepura', 'sri lanka']
  },
  {
    ids: ['Asia/Katmandu'],
    name: 'Nepal Standard Time',
    offset: 5.75,
    iso: '(UTC+05:45) Kathmandu',
    aliases: ['kathmandu', 'nepal']
  },
  {
    ids: [
      'Asia/Almaty',
      'Antarctica/Vostok',
      'Asia/Urumqi',
      'Indian/Chagos',
      'Asia/Bishkek',
      'Asia/Qostanay',
      'Etc/GMT-6'
    ],
    name: 'Central Asia Standard Time',
    offset: 6,
    iso: '(UTC+06:00) Astana',
    aliases: ['astana', 'central asia']
  },
  {
    ids: ['Asia/Dhaka', 'Asia/Thimphu'],
    name: 'Bangladesh Standard Time',
    offset: 6,
    iso: '(UTC+06:00) Dhaka',
    aliases: ['dhaka', 'bangladesh']
  },
  {
    ids: ['Asia/Omsk'],
    name: 'Omsk Standard Time',
    offset: 6,
    iso: '(UTC+06:00) Omsk',
    aliases: ['omsk']
  },
  {
    ids: ['Asia/Rangoon', 'Indian/Cocos'],
    name: 'Myanmar Standard Time',
    offset: 6.5,
    iso: '(UTC+06:30) Yangon (Rangoon)',
    aliases: ['myanmar']
  },
  {
    ids: [
      'Asia/Bangkok',
      'Antarctica/Davis',
      'Indian/Christmas',
      'Asia/Jakarta',
      'Asia/Pontianak',
      'Asia/Phnom_Penh',
      'Asia/Vientiane',
      'Asia/Saigon',
      'Etc/GMT-7'
    ],
    name: 'SE Asia Standard Time',
    offset: 7,
    iso: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
    aliases: ['bangkok', 'hanoi', 'jakarta', 'se asia', 'south east asia']
  },
  {
    ids: ['Asia/Barnaul'],
    name: 'Altai Standard Time',
    offset: 7,
    iso: '(UTC+07:00) Barnaul, Gorno-Altaysk',
    aliases: ['barnaul', 'gorno altaysk', 'altai']
  },
  {
    ids: ['Asia/Hovd'],
    name: 'W. Mongolia Standard Time',
    offset: 7,
    iso: '(UTC+07:00) Hovd',
    aliases: ['hovd', 'west mongolia', 'western mongolia']
  },
  {
    ids: ['Asia/Krasnoyarsk', 'Asia/Novokuznetsk'],
    name: 'North Asia Standard Time',
    offset: 7,
    iso: '(UTC+07:00) Krasnoyarsk',
    aliases: ['krasnoyarsk', 'north asia']
  },
  {
    ids: ['Asia/Novosibirsk'],
    name: 'N. Central Asia Standard Time',
    offset: 7,
    iso: '(UTC+07:00) Novosibirsk',
    aliases: ['novosibirsk', 'north central asia']
  },
  {
    ids: ['Asia/Tomsk'],
    name: 'Tomsk Standard Time',
    offset: 7,
    iso: '(UTC+07:00) Tomsk',
    aliases: ['tomsk']
  },
  {
    ids: ['Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Macau'],
    name: 'China Standard Time',
    offset: 8,
    iso: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
    aliases: ['beijing', 'chongqing', 'hong kong', 'urumqi', 'china']
  },
  {
    ids: ['Asia/Irkutsk'],
    name: 'North Asia East Standard Time',
    offset: 8,
    iso: '(UTC+08:00) Irkutsk',
    aliases: ['irkutsk', 'north asia east']
  },
  {
    ids: [
      'Asia/Singapore',
      'Asia/Brunei',
      'Asia/Makassar',
      'Asia/Kuala_Lumpur',
      'Asia/Kuching',
      'Asia/Manila',
      'Etc/GMT-8'
    ],
    name: 'Singapore Standard Time',
    offset: 8,
    iso: '(UTC+08:00) Kuala Lumpur, Singapore',
    aliases: ['kuala lumpur', 'singapore']
  },
  {
    ids: ['Australia/Perth'],
    name: 'W. Australia Standard Time',
    offset: 8,
    iso: '(UTC+08:00) Perth',
    aliases: ['perth', 'western australia', 'west australia']
  },
  {
    ids: ['Asia/Taipei'],
    name: 'Taipei Standard Time',
    offset: 8,
    iso: '(UTC+08:00) Taipei',
    aliases: ['taipei']
  },
  {
    ids: ['Asia/Ulaanbaatar', 'Asia/Choibalsan'],
    name: 'Ulaanbaatar Standard Time',
    offset: 8,
    iso: '(UTC+08:00) Ulaanbaatar',
    aliases: ['ulaanbaatar']
  },
  {
    ids: ['Australia/Eucla'],
    name: 'Aus Central W. Standard Time',
    offset: 8.75,
    iso: '(UTC+08:45) Eucla',
    aliases: ['eucla', 'aus central west']
  },
  {
    ids: ['Asia/Chita'],
    name: 'Transbaikal Standard Time',
    offset: 9,
    iso: '(UTC+09:00) Chita',
    aliases: ['chita', 'transbaikal']
  },
  {
    ids: ['Asia/Tokyo', 'Asia/Jayapura', 'Pacific/Palau', 'Asia/Dili', 'Etc/GMT-9'],
    name: 'Tokyo Standard Time',
    offset: 9,
    iso: '(UTC+09:00) Osaka, Sapporo, Tokyo',
    aliases: ['osaka', 'sapporo', 'tokyo']
  },
  {
    ids: ['Asia/Pyongyang'],
    name: 'North Korea Standard Time',
    offset: 9,
    iso: '(UTC+09:00) Pyongyang',
    aliases: ['pyongyang', 'north korea']
  },
  {
    ids: ['Asia/Seoul'],
    name: 'Korea Standard Time',
    offset: 9,
    iso: '(UTC+09:00) Seoul',
    aliases: ['seoul', 'korea']
  },
  {
    ids: ['Asia/Yakutsk', 'Asia/Khandyga'],
    name: 'Yakutsk Standard Time',
    offset: 9,
    iso: '(UTC+09:00) Yakutsk',
    aliases: ['yakutsk']
  },
  {
    ids: ['Australia/Adelaide', 'Australia/Broken_Hill'],
    name: 'Cen. Australia Standard Time',
    offset: 9.5,
    iso: '(UTC+09:30) Adelaide',
    aliases: ['adelaide', 'central australia']
  },
  {
    ids: ['Australia/Darwin'],
    name: 'AUS Central Standard Time',
    offset: 9.5,
    iso: '(UTC+09:30) Darwin',
    aliases: ['darwin', 'aus central']
  },
  {
    ids: ['Australia/Brisbane', 'Australia/Lindeman'],
    name: 'E. Australia Standard Time',
    offset: 10,
    iso: '(UTC+10:00) Brisbane',
    aliases: ['brisbane', 'east australia', 'eastern australia']
  },
  {
    ids: ['Australia/Sydney', 'Australia/Melbourne'],
    name: 'AUS Eastern Standard Time',
    offset: 10,
    iso: '(UTC+10:00) Canberra, Melbourne, Sydney',
    aliases: ['canberra', 'melbourne', 'sydney', 'aus eastern', 'aus east']
  },
  {
    ids: [
      'Pacific/Port_Moresby',
      'Antarctica/DumontDUrville',
      'Pacific/Truk',
      'Pacific/Guam',
      'Pacific/Saipan',
      'Etc/GMT-10'
    ],
    name: 'West Pacific Standard Time',
    offset: 10,
    iso: '(UTC+10:00) Guam, Port Moresby',
    aliases: ['guam', 'port moresby', 'west pacific', 'western pacific']
  },
  {
    ids: ['Australia/Hobart', 'Australia/Currie', 'Antarctica/Macquarie'],
    name: 'Tasmania Standard Time',
    offset: 10,
    iso: '(UTC+10:00) Hobart',
    aliases: ['hobart', 'tasmania']
  },
  {
    ids: ['Asia/Vladivostok', 'Asia/Ust-Nera'],
    name: 'Vladivostok Standard Time',
    offset: 10,
    iso: '(UTC+10:00) Vladivostok',
    aliases: ['vladivostok']
  },
  {
    ids: ['Australia/Lord_Howe'],
    name: 'Lord Howe Standard Time',
    offset: 10.5,
    iso: '(UTC+10:30) Lord Howe Island',
    aliases: ['lord howe']
  },
  {
    ids: ['Pacific/Bougainville'],
    name: 'Bougainville Standard Time',
    offset: 11,
    iso: '(UTC+11:00) Bougainville Island',
    aliases: ['bougainville']
  },
  {
    ids: ['Asia/Srednekolymsk'],
    name: 'Russia Time Zone 10',
    offset: 11,
    iso: '(UTC+11:00) Chokurdakh',
    aliases: ['chokurdakh', 'russia time zone 10']
  },
  {
    ids: ['Asia/Magadan'],
    name: 'Magadan Standard Time',
    offset: 11,
    iso: '(UTC+11:00) Magadan',
    aliases: ['magadan']
  },
  {
    ids: ['Pacific/Norfolk'],
    name: 'Norfolk Standard Time',
    offset: 11,
    iso: '(UTC+11:00) Norfolk Island',
    aliases: ['norfolk island', 'norfolk']
  },
  {
    ids: ['Asia/Sakhalin'],
    name: 'Sakhalin Standard Time',
    offset: 11,
    iso: '(UTC+11:00) Sakhalin',
    aliases: ['sakhalin']
  },
  {
    ids: [
      'Pacific/Guadalcanal',
      'Antarctica/Casey',
      'Pacific/Ponape',
      'Pacific/Kosrae',
      'Pacific/Noumea',
      'Pacific/Efate',
      'Etc/GMT-11'
    ],
    name: 'Central Pacific Standard Time',
    offset: 11,
    iso: '(UTC+11:00) Solomon Is., New Caledonia',
    aliases: ['solomon', 'new caledonia', 'central pacific']
  },
  {
    ids: ['Asia/Kamchatka', 'Asia/Anadyr'],
    name: 'Russia Time Zone 11',
    offset: 12,
    iso: '(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky',
    aliases: ['anadyr', 'petropavlovsk kamchatsky', 'russia time zone 11']
  },
  {
    ids: ['Pacific/Auckland', 'Antarctica/McMurdo'],
    name: 'New Zealand Standard Time',
    offset: 12,
    iso: '(UTC+12:00) Auckland, Wellington',
    aliases: ['auckland', 'wellington', 'new zealand']
  },
  {
    ids: [
      'Etc/GMT-12',
      'Pacific/Tarawa',
      'Pacific/Majuro',
      'Pacific/Kwajalein',
      'Pacific/Nauru',
      'Pacific/Funafuti',
      'Pacific/Wake',
      'Pacific/Wallis'
    ],
    name: 'UTC+12',
    offset: 12,
    iso: '(UTC+12:00) Coordinated Universal Time+12',
    aliases: ['coordinated universal time+12', 'utc+12']
  },
  {
    ids: ['Pacific/Fiji'],
    name: 'Fiji Standard Time',
    offset: 12,
    iso: '(UTC+12:00) Fiji',
    aliases: ['fiji']
  },
  {
    ids: ['Pacific/Chatham'],
    name: 'Chatham Islands Standard Time',
    offset: 12.75,
    iso: '(UTC+12:45) Chatham Islands',
    aliases: ['chatham islands']
  },
  {
    ids: ['Etc/GMT-13', 'Pacific/Enderbury', 'Pacific/Fakaofo'],
    name: 'UTC+13',
    offset: 13,
    iso: '(UTC+13:00) Coordinated Universal Time+13',
    aliases: ['coordinated universal time+13', 'utc+13']
  },
  {
    ids: ['Pacific/Tongatapu'],
    name: 'Tonga Standard Time',
    offset: 13,
    iso: "(UTC+13:00) Nuku'alofa",
    aliases: ["nuku'alofa", 'tonga']
  },
  {
    ids: ['Pacific/Apia'],
    name: 'Samoa Standard Time',
    offset: 13,
    iso: '(UTC+13:00) Samoa',
    aliases: ['samoa']
  },
  {
    ids: ['Pacific/Kiritimati', 'Etc/GMT-14'],
    name: 'Line Islands Standard Time',
    offset: 14,
    iso: '(UTC+14:00) Kiritimati Island',
    aliases: ['kiritimati island', 'line islands']
  }
]
