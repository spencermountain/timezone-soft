module.exports = [
  {
    name: 'Greenwich Mean Time',
    abbr: null,
    aliases: ['GMT', 'Zulu'],
    ids: [
      'Etc/GMT',
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
      'Etc/UTC'
    ],
    std: {
      name: 'Greenwich Mean Time',
      abbr: 'GMT',
      offset: 0
    },
    dst: {}
  },
  {
    name: 'British Time',
    abbr: null,
    aliases: ['GMT'],
    ids: [
      'Europe/London',
      'Europe/Dublin',
      'Europe/Guernsey',
      'Europe/Isle_of_Man',
      'Europe/Jersey'
    ],
    std: {
      name: 'British Time',
      abbr: 'BT',
      offset: 0
    },
    dst: {
      name: 'British Summer Time',
      abbr: 'BST',
      offset: 1
    }
  },
  {
    name: 'East Africa Time',
    abbr: null,
    aliases: ['Africa Eastern'],
    ids: [
      'Africa/Addis_Ababa',
      'Africa/Asmera',
      'Africa/Dar_es_Salaam',
      'Africa/Djibouti',
      'Africa/Kampala',
      'Africa/Mogadishu',
      'Africa/Nairobi',
      'Indian/Antananarivo',
      'Indian/Comoro',
      'Indian/Mayotte'
    ],
    std: {
      name: 'East Africa Time',
      abbr: 'EAT',
      offset: 3
    },
    dst: {}
  },
  {
    name: 'Central European Time',
    abbr: null,
    aliases: ['Europe Central'],
    ids: [
      'Europe/Paris',
      'Africa/Ceuta',
      'Arctic/Longyearbyen',
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
      // 'Africa/Algiers',
      // 'Africa/Tunis',
    ],
    std: {
      name: 'Central European Standard Time',
      offset: 1
    },
    dst: {
      name: 'Central European Summer Time',
      offset: 2
    }
  },
  {
    name: 'West Africa Time',
    abbr: 'WAT',
    aliases: ['Africa Western', 'WAST', 'Western Africa'],
    ids: [
      'Africa/Lagos',
      'Africa/Bangui',
      'Africa/Brazzaville',
      'Africa/Douala',
      'Africa/Kinshasa',
      'Africa/Libreville',
      'Africa/Luanda',
      'Africa/Malabo',
      'Africa/Ndjamena',
      'Africa/Niamey',
      'Africa/Porto-Novo'
    ],
    std: {
      name: 'West Africa Standard Time',
      abbr: 'WAT',
      offset: 1
    }
  },
  {
    name: 'Central Africa Time',
    abbr: null,
    aliases: ['Africa Central'],
    ids: [
      'Africa/Windhoek',
      'Africa/Blantyre',
      'Africa/Bujumbura',
      'Africa/Gaborone',
      'Africa/Harare',
      'Africa/Juba',
      'Africa/Khartoum',
      'Africa/Kigali',
      'Africa/Lubumbashi',
      'Africa/Lusaka',
      'Africa/Maputo'
    ],
    std: {
      name: 'Central Africa Time',
      abbr: 'CAT',
      offset: 2
    },
    dst: {}
  },
  {
    name: 'Eastern European Time',
    abbr: null,
    aliases: ['Europe Eastern'],
    ids: [
      'Asia/Beirut',
      'Africa/Cairo',
      'Africa/Tripoli',
      'Asia/Amman',
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
    ],
    std: {
      name: 'Eastern European Standard Time',
      offset: 2
    },
    dst: {
      name: 'Eastern European Summer Time',
      offset: 3
    }
  },
  {
    name: 'Western European Time',
    abbr: null,
    aliases: ['Europe Western'],
    ids: [
      'Europe/Lisbon',
      'Africa/Casablanca',
      'Africa/El_Aaiun',
      'Atlantic/Canary',
      'Atlantic/Faeroe',
      'Atlantic/Madeira'
    ],
    std: {
      name: 'Western European Standard Time',
      offset: 0
    },
    dst: {
      name: 'Western European Summer Time',
      offset: 1
    }
  },
  {
    name: 'South Africa Time',
    abbr: null,
    aliases: ['Africa Southern'],
    ids: ['Africa/Johannesburg', 'Africa/Maseru', 'Africa/Mbabane'],
    std: {
      name: 'South Africa Standard Time',
      abbr: 'SAST',
      offset: 2
    },
    dst: {}
  },
  {
    name: 'Hawaii-Aleutian Time',
    abbr: 'HAT',
    aliases: ['Hawaii Aleutian'],
    ids: ['America/Adak', 'Pacific/Honolulu', 'Pacific/Johnston'],
    std: {
      name: 'Hawaii-Aleutian Standard Time',
      abbr: 'HAST',
      offset: -9
    },
    dst: {
      name: 'Hawaii-Aleutian Daylight Time',
      abbr: 'HADT',
      offset: -8
    }
  },
  {
    name: 'Alaska Time',
    abbr: 'AKT',
    aliases: ['Alaska'],
    ids: [
      'America/Anchorage',
      'America/Juneau',
      'America/Metlakatla',
      'America/Nome',
      'America/Sitka',
      'America/Yakutat'
    ],
    std: {
      name: 'Alaska Standard Time',
      abbr: 'AKST',
      offset: -8
    },
    dst: {
      name: 'Alaska Daylight Time',
      abbr: 'AKDT',
      offset: -7
    }
  },
  {
    name: 'Atlantic Time',
    abbr: 'AT',
    aliases: ['Atlantic'],
    ids: [
      'America/Halifax',
      'America/Anguilla',
      'America/Antigua',
      'America/Aruba',
      'America/Barbados',
      'America/Blanc-Sablon',
      'America/Curacao',
      'America/Dominica',
      'America/Glace_Bay',
      'America/Goose_Bay',
      'America/Grenada',
      'America/Guadeloupe',
      'America/Kralendijk',
      'America/Lower_Princes',
      'America/Marigot',
      'America/Martinique',
      'America/Moncton',
      'America/Montserrat',
      'America/Port_of_Spain',
      'America/Puerto_Rico',
      'America/Santo_Domingo',
      'America/St_Barthelemy',
      'America/St_Kitts',
      'America/St_Lucia',
      'America/St_Thomas',
      'America/St_Vincent',
      'America/Thule',
      'America/Tortola',
      'Atlantic/Bermuda'
    ],
    std: {
      name: 'Atlantic Standard Time',
      abbr: 'AST',
      offset: -4
    },
    dst: {
      name: 'Atlantic Daylight Time',
      abbr: 'ADT',
      offset: -3
    }
  },
  {
    name: 'Brasilia Time',
    abbr: null,
    aliases: ['Brasilia'],
    ids: [
      'America/Sao_Paulo',
      'America/Araguaina',
      'America/Bahia',
      'America/Belem',
      'America/Fortaleza',
      'America/Maceio',
      'America/Recife',
      'America/Santarem'
    ],
    std: {
      name: 'Brasilia Standard Time',
      offset: -3
    },
    dst: {}
  },
  {
    name: 'Argentina Time',
    abbr: 'ART',
    aliases: ['Argentina', 'ARST'],
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
      'America/Mendoza',
      'Antarctica/Rothera',
      'America/Argentina'
    ],
    std: {
      name: 'Argentina Standard Time',
      abbr: 'ART',
      offset: -3
    },
    dst: {}
  },
  {
    name: 'Paraguay Time',
    abbr: null,
    aliases: ['Paraguay'],
    ids: ['America/Asuncion'],
    std: {
      name: 'Paraguay Standard Time',
      offset: -4
    },
    dst: {
      name: 'Paraguay Summer Time',
      offset: -3
    }
  },
  {
    name: 'Central Time',
    abbr: 'CT',
    aliases: ['America Central'],
    ids: [
      'America/Chicago',
      'America/Bahia_Banderas',
      'America/Belize',
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
      'America/Indiana',
      'America/North_Dakota'
    ],
    std: {
      name: 'Central Standard Time',
      abbr: 'CST',
      offset: -5
    },
    dst: {
      name: 'Central Daylight Time',
      abbr: 'CDT',
      offset: -4
    }
  },
  {
    name: 'Amazon Time',
    abbr: null,
    aliases: ['Amazon'],
    ids: [
      'America/Boa_Vista',
      'America/Campo_Grande',
      'America/Cuiaba',
      'America/Manaus',
      'America/Porto_Velho'
    ],
    std: {
      name: 'Amazon Standard Time',
      offset: -4
    },
    dst: {}
  },
  {
    name: 'Colombia Time',
    abbr: 'COT',
    aliases: ['Colombia', 'COST'],
    ids: ['America/Bogota', 'Pacific/Galapagos'],
    std: {
      name: 'Colombia Standard Time',
      abbr: 'COT',
      offset: -5
    },
    dst: {}
  },
  {
    name: 'Mountain Time',
    abbr: 'MT',
    aliases: ['America Mountain'],
    ids: [
      'America/Phoenix',
      'America/Boise',
      'America/Cambridge_Bay',
      'America/Creston',
      'America/Dawson',
      'America/Dawson_Creek',
      'America/Denver',
      'America/Edmonton',
      'America/Fort_Nelson',
      'America/Inuvik',
      'America/Ojinaga',
      'America/Whitehorse',
      'America/Yellowknife'
    ],
    std: {
      name: 'Mountain Standard Time',
      abbr: 'MST',
      offset: -6
    },
    dst: {
      name: 'Mountain Daylight Time',
      abbr: 'MDT',
      offset: -5
    }
  },
  {
    name: 'Eastern Time',
    abbr: 'ET',
    aliases: ['America Eastern'],
    ids: [
      'America/New_York',
      // 'America/Cancun',
      // 'America/Cayman',
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
      // 'America/Jamaica',
      'America/Kentucky/Monticello',
      'America/Louisville',
      'America/Nassau',
      'America/Nipigon',
      // 'America/Panama',
      'America/Pangnirtung',
      'America/Port-au-Prince',
      'America/Thunder_Bay',
      'America/Toronto',
      'America/Montreal',
      'America/Kentucky'
    ],
    std: {
      name: 'Eastern Standard Time',
      abbr: 'EST',
      offset: -5
    },
    dst: {
      name: 'Eastern Daylight Time',
      abbr: 'EDT',
      offset: -4
    }
  },
  {
    name: 'Venezuela Time',
    abbr: null,
    aliases: ['Venezuela'],
    ids: ['America/Caracas'],
    std: {
      name: 'Venezuela Time',
      abbr: 'VET',
      offset: -4
    },
    dst: {}
  },
  {
    name: 'French Guiana Time',
    abbr: null,
    aliases: ['French Guiana'],
    ids: ['America/Cayenne'],
    std: {
      name: 'French Guiana Time',
      abbr: 'GFT',
      offset: -3
    },
    dst: {}
  },
  {
    name: 'Mexican Pacific Time',
    abbr: 'HPMX',
    aliases: ['Mexico Pacific'],
    ids: ['America/Chihuahua', 'America/Hermosillo', 'America/Mazatlan'],
    std: {
      name: 'Mexican Pacific Standard Time',
      abbr: 'HNPMX',
      offset: -6
    },
    dst: {
      name: 'Mexican Pacific Daylight Time',
      abbr: 'HEPMX',
      offset: -5
    }
  },
  {
    name: 'Acre Time',
    abbr: null,
    aliases: ['Acre'],
    ids: ['America/Eirunepe', 'America/Rio_Branco'],
    std: {
      name: 'Acre Standard Time',
      offset: -5
    },
    dst: {}
  },
  {
    name: 'West Greenland Time',
    abbr: 'HOG',
    aliases: ['Greenland Western'],
    ids: ['America/Godthab'],
    std: {
      name: 'West Greenland Standard Time',
      abbr: 'HNOG',
      offset: -2
    },
    dst: {
      name: 'West Greenland Summer Time',
      abbr: 'HEOG',
      offset: -1
    }
  },
  {
    name: 'Ecuador Time',
    abbr: null,
    aliases: ['Ecuador'],
    ids: ['America/Guayaquil'],
    std: {
      name: 'Ecuador Time',
      abbr: 'ECT',
      offset: -5
    },
    dst: {}
  },
  {
    name: 'Guyana Time',
    abbr: null,
    aliases: ['Guyana'],
    ids: ['America/Guyana'],
    std: {
      name: 'Guyana Time',
      abbr: 'GYT',
      offset: -4
    },
    dst: {}
  },
  {
    name: 'Cuba Time',
    abbr: 'HCU',
    aliases: ['Cuba'],
    ids: ['America/Havana'],
    std: {
      name: 'Cuba Standard Time',
      abbr: 'HNCU',
      offset: -4
    },
    dst: {
      name: 'Cuba Daylight Time',
      abbr: 'HECU',
      offset: -3
    }
  },
  {
    name: 'Bolivia Time',
    abbr: null,
    aliases: ['Bolivia'],
    ids: ['America/La_Paz'],
    std: {
      name: 'Bolivia Time',
      abbr: 'BOT',
      offset: -4
    },
    dst: {}
  },
  {
    name: 'Peru Time',
    abbr: null,
    aliases: ['Peru'],
    ids: ['America/Lima'],
    std: {
      name: 'Peru Standard Time',
      offset: -5
    },
    dst: {}
  },
  {
    name: 'Pacific Time',
    abbr: 'PT',
    aliases: ['America Pacific'],
    ids: ['America/Los_Angeles', 'America/Tijuana', 'America/Vancouver'],
    std: {
      name: 'Pacific Standard Time',
      abbr: 'PST',
      offset: -7
    },
    dst: {
      name: 'Pacific Daylight Time',
      abbr: 'PDT',
      offset: -6
    }
  },
  {
    name: 'St. Pierre & Miquelon Time',
    abbr: 'HPM',
    aliases: ['Pierre Miquelon'],
    ids: ['America/Miquelon'],
    std: {
      name: 'St. Pierre & Miquelon Standard Time',
      abbr: 'HNPM',
      offset: -2
    },
    dst: {
      name: 'St. Pierre & Miquelon Daylight Time',
      abbr: 'HEPM',
      offset: -1
    }
  },
  {
    name: 'Uruguay Time',
    abbr: 'UYT',
    aliases: ['Uruguay', 'UYST'],
    ids: ['America/Montevideo'],
    std: {
      name: 'Uruguay Standard Time',
      abbr: 'UYT',
      offset: -3
    },
    dst: {}
  },
  {
    name: 'Fernando de Noronha Time',
    abbr: null,
    aliases: ['Noronha'],
    ids: ['America/Noronha'],
    std: {
      name: 'Fernando de Noronha Standard Time',
      offset: -2
    },
    dst: {}
  },
  {
    name: 'Suriname Time',
    abbr: null,
    aliases: ['Suriname'],
    ids: ['America/Paramaribo'],
    std: {
      name: 'Suriname Time',
      abbr: 'SRT',
      offset: -3
    },
    dst: {}
  },
  {
    name: 'Chile Time',
    abbr: 'CLT',
    aliases: ['Chile'],
    ids: ['America/Santiago', 'America/Punta_Arenas', 'Antarctica/Palmer'],
    std: {
      name: 'Chile Standard Time',
      abbr: 'CLT',
      offset: -3
    },
    dst: {
      name: 'Chile Summer Time',
      abbr: 'CLST',
      offset: -4
    }
  },
  {
    name: 'Northwest Mexico Time',
    abbr: 'HNOMX',
    aliases: ['Mexico Northwest'],
    ids: ['America/Santa_Isabel'],
    std: {
      name: 'Northwest Mexico Standard Time',
      abbr: 'HNNOMX',
      offset: -7
    },
    dst: {
      name: 'Northwest Mexico Daylight Time',
      abbr: 'HENOMX',
      offset: -6
    }
  },
  {
    name: 'East Greenland Time',
    abbr: 'HEG',
    aliases: ['Greenland Eastern'],
    ids: ['America/Scoresbysund'],
    std: {
      name: 'East Greenland Standard Time',
      abbr: 'HNEG',
      offset: 0
    },
    dst: {
      name: 'East Greenland Summer Time',
      abbr: 'HEEG',
      offset: 1
    }
  },
  {
    name: 'Newfoundland Time',
    abbr: 'HTN',
    aliases: ['Newfoundland'],
    ids: ['America/St_Johns'],
    std: {
      name: 'Newfoundland Standard Time',
      abbr: 'HNTN',
      offset: -2.5
    },
    dst: {
      name: 'Newfoundland Daylight Time',
      abbr: 'HETN',
      offset: -1.5
    }
  },
  {
    name: 'Casey Time',
    abbr: 'CAST',
    aliases: ['Casey'],
    ids: ['Antarctica/Casey'],
    std: {
      name: 'Casey Time',
      offset: 11
    },
    dst: {
      name: 'Casey Summer Time',
      offset: 8
    }
  },
  {
    name: 'Davis Time',
    abbr: null,
    aliases: ['Davis'],
    ids: ['Antarctica/Davis'],
    std: {
      name: 'Davis Time',
      offset: 7
    },
    dst: {}
  },
  {
    name: 'Dumont-d’Urville Time',
    abbr: null,
    aliases: ['DumontDUrville'],
    ids: ['Antarctica/DumontDUrville'],
    std: {
      name: 'Dumont-d’Urville Time',
      offset: 10
    },
    dst: {}
  },
  {
    name: 'Eastern Australia Time',
    abbr: 'AET',
    aliases: ['Australia Eastern'],
    ids: [
      'Australia/Sydney',
      'Antarctica/Macquarie',
      'Australia/Brisbane',
      'Australia/Currie',
      'Australia/Hobart',
      'Australia/Lindeman',
      'Australia/Melbourne'
    ],
    std: {
      name: 'Australian Eastern Standard Time',
      abbr: 'AEST',
      offset: 11
    },
    dst: {
      name: 'Australian Eastern Daylight Time',
      abbr: 'AEDT',
      offset: 12
    }
  },
  {
    name: 'Mawson Time',
    abbr: null,
    aliases: ['Mawson'],
    ids: ['Antarctica/Mawson'],
    std: {
      name: 'Mawson Time',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'New Zealand Time',
    abbr: 'NZT',
    aliases: ['New Zealand'],
    ids: ['Pacific/Auckland', 'Antarctica/McMurdo'],
    std: {
      name: 'New Zealand Standard Time',
      abbr: 'NZST',
      offset: 12
    },
    dst: {
      name: 'New Zealand Daylight Time',
      abbr: 'NZDT',
      offset: 13
    }
  },
  // {
  //   name: 'Rothera Time',
  //   abbr: null,
  //   aliases: ['Rothera'],
  //   ids: ['Antarctica/Rothera'],
  //   std: {
  //     name: 'Rothera Time',
  //     offset: -3
  //   },
  //   dst: {}
  // },
  {
    name: 'Syowa Time',
    abbr: null,
    aliases: ['Syowa'],
    ids: ['Antarctica/Syowa'],
    std: {
      name: 'Syowa Time',
      offset: 3
    },
    dst: {}
  },
  {
    name: 'Vostok Time',
    abbr: null,
    aliases: ['Vostok'],
    ids: ['Antarctica/Vostok'],
    std: {
      name: 'Vostok Time',
      offset: 6
    },
    dst: {}
  },
  {
    name: 'Arabian Time',
    abbr: null,
    aliases: ['Arabian'],
    ids: ['Asia/Baghdad', 'Asia/Aden', 'Asia/Bahrain', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Riyadh'],
    std: {
      name: 'Arabian Standard Time',
      offset: 3
    },
    dst: {}
  },
  {
    name: 'East Kazakhstan Time',
    abbr: null,
    aliases: ['Kazakhstan Eastern'],
    ids: ['Asia/Almaty', 'Asia/Qostanay'],
    std: {
      name: 'East Kazakhstan Time',
      offset: 6
    },
    dst: {}
  },
  {
    name: 'Anadyr Time',
    abbr: null,
    aliases: ['Anadyr'],
    ids: ['Asia/Anadyr'],
    std: {
      name: 'Anadyr Standard Time',
      offset: 12
    },
    dst: {}
  },
  {
    name: 'West Kazakhstan Time',
    abbr: null,
    aliases: ['Kazakhstan Western'],
    ids: ['Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Qyzylorda'],
    std: {
      name: 'West Kazakhstan Time',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'Turkmenistan Time',
    abbr: 'TMT',
    aliases: ['Turkmenistan', 'TMST'],
    ids: ['Asia/Ashgabat'],
    std: {
      name: 'Turkmenistan Standard Time',
      abbr: 'TMT',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'Azerbaijan Time',
    abbr: null,
    aliases: ['Azerbaijan'],
    ids: ['Asia/Baku'],
    std: {
      name: 'Azerbaijan Standard Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Indochina Time',
    abbr: null,
    aliases: ['Indochina'],
    ids: ['Asia/Bangkok', 'Asia/Phnom_Penh', 'Asia/Saigon', 'Asia/Vientiane'],
    std: {
      name: 'Indochina Time',
      offset: 7
    },
    dst: {}
  },
  {
    name: 'Kyrgyzstan Time',
    abbr: null,
    aliases: ['Kyrgystan'],
    ids: ['Asia/Bishkek'],
    std: {
      name: 'Kyrgyzstan Time',
      offset: 6
    },
    dst: {}
  },
  {
    name: 'Brunei Darussalam Time',
    abbr: null,
    aliases: ['Brunei'],
    ids: ['Asia/Brunei'],
    std: {
      name: 'Brunei Darussalam Time',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'India Time',
    abbr: null,
    aliases: ['India'],
    ids: ['Asia/Calcutta', 'Asia/Colombo'],
    std: {
      name: 'India Standard Time',
      abbr: 'IST',
      offset: 5.5
    },
    dst: {}
  },
  {
    name: 'Yakutsk Time',
    abbr: null,
    aliases: ['Yakutsk'],
    ids: ['Asia/Yakutsk', 'Asia/Chita', 'Asia/Khandyga'],
    std: {
      name: 'Yakutsk Standard Time',
      offset: 9
    },
    dst: {}
  },
  {
    name: 'Ulaanbaatar Time',
    abbr: null,
    aliases: ['Mongolia'],
    ids: ['Asia/Ulaanbaatar', 'Asia/Choibalsan'],
    std: {
      name: 'Ulaanbaatar Standard Time',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Bangladesh Time',
    abbr: 'BST',
    aliases: ['Bangladesh'],
    ids: ['Asia/Dhaka'],
    std: {
      name: 'Bangladesh Standard Time',
      offset: 6
    },
    dst: {}
  },
  {
    name: 'East Timor Time',
    abbr: 'TLT',
    aliases: ['East Timor'],
    ids: ['Asia/Dili'],
    std: {
      name: 'East Timor Time',
      offset: 9
    },
    dst: {}
  },
  {
    name: 'Gulf Time',
    abbr: null,
    aliases: ['Gulf'],
    ids: ['Asia/Dubai', 'Asia/Muscat'],
    std: {
      name: 'Gulf Standard Time',
      abbr: 'GST',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Tajikistan Time',
    abbr: null,
    aliases: ['Tajikistan'],
    ids: ['Asia/Dushanbe'],
    std: {
      name: 'Tajikistan Time',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'Hong Kong Time',
    abbr: 'HKT',
    aliases: ['Hong Kong', 'HKST'],
    ids: ['Asia/Hong_Kong'],
    std: {
      name: 'Hong Kong Standard Time',
      abbr: 'HKT',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Hovd Time',
    abbr: null,
    aliases: ['Hovd'],
    ids: ['Asia/Hovd'],
    std: {
      name: 'Hovd Standard Time',
      offset: 7
    },
    dst: {}
  },
  {
    name: 'Irkutsk Time',
    abbr: null,
    aliases: ['Irkutsk'],
    ids: ['Asia/Irkutsk'],
    std: {
      name: 'Irkutsk Standard Time',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Western Indonesia Time',
    abbr: null,
    aliases: ['Indonesia Western'],
    ids: ['Asia/Jakarta', 'Asia/Pontianak'],
    std: {
      name: 'Western Indonesia Time',
      abbr: 'WIB',
      offset: 7
    },
    dst: {}
  },
  {
    name: 'Eastern Indonesia Time',
    abbr: null,
    aliases: ['Indonesia Eastern'],
    ids: ['Asia/Jayapura'],
    std: {
      name: 'Eastern Indonesia Time',
      abbr: 'WIT',
      offset: 9
    },
    dst: {}
  },
  {
    name: 'Israel Time',
    abbr: null,
    aliases: ['Israel'],
    ids: ['Asia/Jerusalem'],
    std: {
      name: 'Israel Standard Time',
      offset: 3
    },
    dst: {
      name: 'Israel Daylight Time',
      offset: 4
    }
  },
  {
    name: 'Afghanistan Time',
    abbr: null,
    aliases: ['Afghanistan'],
    ids: ['Asia/Kabul'],
    std: {
      name: 'Afghanistan Time',
      offset: 4.5
    },
    dst: {}
  },
  {
    name: 'Petropavlovsk-Kamchatski Time',
    abbr: null,
    aliases: ['Kamchatka'],
    ids: ['Asia/Kamchatka'],
    std: {
      name: 'Petropavlovsk-Kamchatski Standard Time',
      offset: 12
    },
    dst: {}
  },
  {
    name: 'Pakistan Time',
    abbr: null,
    aliases: ['Pakistan'],
    ids: ['Asia/Karachi'],
    std: {
      name: 'Pakistan Standard Time',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'Nepal Time',
    abbr: null,
    aliases: ['Nepal'],
    ids: ['Asia/Katmandu'],
    std: {
      name: 'Nepal Time',
      offset: 5.75
    },
    dst: {}
  },
  {
    name: 'Krasnoyarsk Time',
    abbr: null,
    aliases: ['Krasnoyarsk'],
    ids: ['Asia/Krasnoyarsk', 'Asia/Novokuznetsk', 'Asia/Barnaul'],
    std: {
      name: 'Krasnoyarsk Standard Time',
      offset: 7
    },
    dst: {}
  },
  {
    name: 'Malaysia Time',
    abbr: null,
    aliases: ['Malaysia'],
    ids: ['Asia/Kuala_Lumpur', 'Asia/Kuching'],
    std: {
      name: 'Malaysia Time',
      abbr: 'MYT',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'China Time',
    abbr: null,
    aliases: ['China'],
    ids: ['Asia/Shanghai', 'Asia/Macau', 'Asia/Urumqi'],
    std: {
      name: 'China Standard Time',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Magadan Time',
    abbr: null,
    aliases: ['Magadan'],
    ids: ['Asia/Magadan'],
    std: {
      name: 'Magadan Standard Time',
      offset: 11
    },
    dst: {}
  },
  {
    name: 'Central Indonesia Time',
    abbr: null,
    aliases: ['Indonesia Central'],
    ids: ['Asia/Makassar'],
    std: {
      name: 'Central Indonesia Time',
      abbr: 'WITA',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Philippine Time',
    abbr: null,
    aliases: ['Philippines'],
    ids: ['Asia/Manila'],
    std: {
      name: 'Philippine Standard Time',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Novosibirsk Time',
    abbr: null,
    aliases: ['Novosibirsk'],
    ids: ['Asia/Novosibirsk'],
    std: {
      name: 'Novosibirsk Standard Time',
      offset: 7
    },
    dst: {}
  },
  {
    name: 'Omsk Time',
    abbr: null,
    aliases: ['Omsk'],
    ids: ['Asia/Omsk', 'Asia/Tomsk'],
    std: {
      name: 'Omsk Standard Time',
      offset: 6
    },
    dst: {}
  },
  {
    name: 'Korean Time',
    abbr: null,
    aliases: ['Korea'],
    ids: ['Asia/Seoul', 'Asia/Pyongyang'],
    std: {
      name: 'Korean Standard Time',
      offset: 9
    },
    dst: {}
  },
  {
    name: 'Myanmar Time',
    abbr: null,
    aliases: ['Myanmar'],
    ids: ['Asia/Rangoon'],
    std: {
      name: 'Myanmar Time',
      offset: 6.5
    },
    dst: {}
  },
  {
    name: 'Sakhalin Time',
    abbr: null,
    aliases: ['Sakhalin'],
    ids: ['Asia/Sakhalin'],
    std: {
      name: 'Sakhalin Standard Time',
      offset: 11
    },
    dst: {}
  },
  {
    name: 'Uzbekistan Time',
    abbr: null,
    aliases: ['Uzbekistan'],
    ids: ['Asia/Samarkand', 'Asia/Tashkent'],
    std: {
      name: 'Uzbekistan Standard Time',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'Singapore Time',
    abbr: null,
    aliases: ['Singapore'],
    ids: ['Asia/Singapore'],
    std: {
      name: 'Singapore Standard Time',
      abbr: 'SGT',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Srednekolymsk Time',
    abbr: 'SRET',
    aliases: ['Srednekolymsk'],
    ids: ['Asia/Srednekolymsk'],
    std: {
      name: 'Srednekolymsk Standard Time',
      offset: 12
    },
    dst: {}
  },
  {
    name: 'Taipei Time',
    abbr: null,
    aliases: ['Taipei'],
    ids: ['Asia/Taipei'],
    std: {
      name: 'Taipei Standard Time',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Georgia Time',
    abbr: 'GET',
    aliases: ['Georgia'],
    ids: ['Asia/Tbilisi'],
    std: {
      name: 'Georgia Standard Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Iran Time',
    abbr: null,
    aliases: ['Iran'],
    ids: ['Asia/Tehran'],
    std: {
      name: 'Iran Standard Time',
      offset: 3.5
    },
    dst: {
      name: 'Iran Daylight Time',
      offset: 4.5
    }
  },
  {
    name: 'Bhutan Time',
    abbr: null,
    aliases: ['Bhutan'],
    ids: ['Asia/Thimphu'],
    std: {
      name: 'Bhutan Time',
      abbr: 'BT',
      offset: 6
    },
    dst: {}
  },
  {
    name: 'Japan Time',
    abbr: null,
    aliases: ['Japan', 'JDT'],
    ids: ['Asia/Tokyo'],
    std: {
      name: 'Japan Standard Time',
      abbr: 'JST',
      offset: 9
    },
    dst: {}
  },
  {
    name: 'Vladivostok Time',
    abbr: null,
    aliases: ['Vladivostok'],
    ids: ['Asia/Vladivostok', 'Asia/Ust-Nera'],
    std: {
      name: 'Vladivostok Standard Time',
      offset: 10
    },
    dst: {}
  },
  {
    name: 'Yekaterinburg Time',
    abbr: 'YEKT',
    aliases: ['Yekaterinburg'],
    ids: ['Asia/Yekaterinburg'],
    std: {
      name: 'Yekaterinburg Standard Time',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'Armenia Time',
    abbr: 'AMT',
    aliases: ['Armenia'],
    ids: ['Asia/Yerevan'],
    std: {
      name: 'Armenia Standard Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Azores Time',
    abbr: 'AZOT',
    aliases: ['Azores'],
    ids: ['Atlantic/Azores'],
    std: {
      name: 'Azores Standard Time',
      offset: -1
    },
    dst: {
      name: 'Azores Summer Time',
      abbr: 'AZOST',
      offset: 0
    }
  },
  {
    name: 'Cape Verde Time',
    abbr: null,
    aliases: ['Cape Verde'],
    ids: ['Atlantic/Cape_Verde'],
    std: {
      name: 'Cape Verde Standard Time',
      offset: -1
    },
    dst: {}
  },
  {
    name: 'South Georgia Time',
    abbr: null,
    aliases: ['South Georgia'],
    ids: ['Atlantic/South_Georgia'],
    std: {
      name: 'South Georgia Time',
      offset: -2
    },
    dst: {}
  },
  {
    name: 'Falkland Islands Time',
    abbr: 'FKT',
    aliases: ['Falkland'],
    ids: ['Atlantic/Stanley'],
    std: {
      abbr: 'FKST',
      name: 'Falkland Islands Summer Time',
      offset: -3
    },
    dst: {}
  },
  {
    name: 'Central Australia Time',
    abbr: 'ACT',
    aliases: ['Australia Central'],
    ids: ['Australia/Adelaide', 'Australia/Broken_Hill', 'Australia/Darwin'],
    std: {
      name: 'Australian Central Standard Time',
      abbr: 'ACST',
      offset: 9.5
    },
    dst: {
      name: 'Australian Central Daylight Time',
      abbr: 'ACDT',
      offset: 10.5
    }
  },
  {
    name: 'Australian Central Western Time',
    abbr: 'ACWT',
    aliases: ['Australia CentralWestern', 'ACWDT'],
    ids: ['Australia/Eucla'],
    std: {
      name: 'Australian Central Western Standard Time',
      abbr: 'ACWST',
      offset: 8.75
    },
    dst: {}
  },
  {
    name: 'Lord Howe Time',
    abbr: 'LHT',
    aliases: ['Lord Howe'],
    ids: ['Australia/Lord_Howe'],
    std: {
      name: 'Lord Howe Standard Time',
      abbr: 'LHST',
      offset: 10.5
    },
    dst: {
      name: 'Lord Howe Daylight Time',
      abbr: 'LHDT',
      offset: 11.5
    }
  },
  {
    name: 'Western Australia Time',
    abbr: 'AWT',
    aliases: ['Australia Western', 'AWDT'],
    ids: ['Australia/Perth'],
    std: {
      name: 'Australian Western Standard Time',
      abbr: 'AWST',
      offset: 8
    },
    dst: {}
  },
  {
    name: 'Moscow Time',
    abbr: null,
    aliases: ['Moscow'],
    ids: [
      'Europe/Moscow',
      'Europe/Astrakhan',
      'Europe/Minsk',
      'Europe/Simferopol',
      'Europe/Ulyanovsk',
      'Europe/Kirov'
    ],
    std: {
      name: 'Moscow Standard Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Turkey Time',
    abbr: 'TRT',
    aliases: ['Turkey'],
    ids: ['Europe/Istanbul'],
    std: {
      offset: 3
    },
    dst: {}
  },
  {
    name: 'Samara Time',
    abbr: null,
    aliases: ['Samara'],
    ids: ['Europe/Samara', 'Europe/Saratov'],
    std: {
      name: 'Samara Standard Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Volgograd Time',
    abbr: null,
    aliases: ['Volgograd'],
    ids: ['Europe/Volgograd', 'Asia/Volgograd'],
    std: {
      name: 'Volgograd Standard Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Indian Ocean Time',
    abbr: null,
    aliases: ['Indian Ocean'],
    ids: ['Indian/Chagos'],
    std: {
      name: 'Indian Ocean Time',
      offset: 6
    },
    dst: {}
  },
  {
    name: 'Christmas Island Time',
    abbr: null,
    aliases: ['Christmas'],
    ids: ['Indian/Christmas'],
    std: {
      name: 'Christmas Island Time',
      offset: 7
    },
    dst: {}
  },
  {
    name: 'Cocos Islands Time',
    abbr: null,
    aliases: ['Cocos'],
    ids: ['Indian/Cocos'],
    std: {
      name: 'Cocos Islands Time',
      offset: 6.5
    },
    dst: {}
  },
  {
    name: 'French Southern & Antarctic Time',
    abbr: null,
    aliases: ['French Southern'],
    ids: ['Indian/Kerguelen'],
    std: {
      name: 'French Southern & Antarctic Time',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'Seychelles Time',
    abbr: null,
    aliases: ['Seychelles'],
    ids: ['Indian/Mahe'],
    std: {
      name: 'Seychelles Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Maldives Time',
    abbr: null,
    aliases: ['Maldives'],
    ids: ['Indian/Maldives'],
    std: {
      name: 'Maldives Time',
      offset: 5
    },
    dst: {}
  },
  {
    name: 'Mauritius Time',
    abbr: null,
    aliases: ['Mauritius'],
    ids: ['Indian/Mauritius'],
    std: {
      name: 'Mauritius Standard Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'Réunion Time',
    abbr: null,
    aliases: ['Reunion'],
    ids: ['Indian/Reunion'],
    std: {
      name: 'Réunion Time',
      offset: 4
    },
    dst: {}
  },
  {
    name: 'West Samoa Time',
    abbr: 'WST',
    aliases: ['Apia'],
    ids: ['Pacific/Apia'],
    std: {
      name: 'West Samoa Time',
      offset: 13
    },
    dst: {
      name: 'West Samoa Summer Time',
      offset: 14
    }
  },
  {
    name: 'Papua New Guinea Time',
    abbr: null,
    aliases: ['Papua New_Guinea'],
    ids: ['Pacific/Bougainville', 'Pacific/Port_Moresby'],
    std: {
      name: 'Papua New Guinea Time',
      offset: 11
    },
    dst: {}
  },
  {
    name: 'Chatham Time',
    abbr: 'CHAT',
    aliases: ['Chatham'],
    ids: ['Pacific/Chatham'],
    std: {
      name: 'Chatham Standard Time',
      abbr: 'CHAST',
      offset: 12.75
    },
    dst: {
      name: 'Chatham Daylight Time',
      abbr: 'CHADT',
      offset: 13.75
    }
  },
  {
    name: 'Easter Island Time',
    abbr: null,
    aliases: ['Easter'],
    ids: ['Pacific/Easter'],
    std: {
      name: 'Easter Island Standard Time',
      abbr: 'EAST',
      offset: -6
    },
    dst: {
      name: 'Easter Island Summer Time',
      abbr: 'EASST',
      offset: -5
    }
  },
  {
    name: 'Vanuatu Time',
    abbr: null,
    aliases: ['Vanuatu'],
    ids: ['Pacific/Efate'],
    std: {
      name: 'Vanuatu Standard Time',
      offset: 11
    },
    dst: {}
  },
  {
    name: 'Phoenix Islands Time',
    abbr: null,
    aliases: ['Phoenix Islands'],
    ids: ['Pacific/Enderbury'],
    std: {
      name: 'Phoenix Islands Time',
      offset: 13
    },
    dst: {}
  },
  {
    name: 'Tokelau Time',
    abbr: null,
    aliases: ['Tokelau'],
    ids: ['Pacific/Fakaofo'],
    std: {
      name: 'Tokelau Time',
      offset: 13
    },
    dst: {}
  },
  {
    name: 'Fiji Time',
    abbr: 'FJT',
    aliases: ['Fiji'],
    ids: ['Pacific/Fiji'],
    std: {
      name: 'Fiji Standard Time',
      offset: 12
    },
    dst: {
      name: 'Fiji Summer Time',
      offset: 13
    }
  },
  {
    name: 'Tuvalu Time',
    abbr: 'TVT',
    aliases: ['Tuvalu'],
    ids: ['Pacific/Funafuti'],
    std: {
      name: 'Tuvalu Time',
      offset: 12
    },
    dst: {}
  },
  {
    name: 'Gambier Time',
    abbr: null,
    aliases: ['Gambier'],
    ids: ['Pacific/Gambier'],
    std: {
      name: 'Gambier Time',
      offset: -9
    },
    dst: {}
  },
  {
    name: 'Solomon Islands Time',
    abbr: null,
    aliases: ['Solomon'],
    ids: ['Pacific/Guadalcanal'],
    std: {
      name: 'Solomon Islands Time',
      offset: 11
    },
    dst: {}
  },
  {
    name: 'Chamorro Time',
    abbr: null,
    aliases: ['Chamorro'],
    ids: ['Pacific/Guam', 'Pacific/Saipan'],
    std: {
      name: 'Chamorro Standard Time',
      abbr: 'ChST',
      offset: 10
    },
    dst: {}
  },
  {
    name: 'Line Islands Time',
    abbr: null,
    aliases: ['Line Islands'],
    ids: ['Pacific/Kiritimati'],
    std: {
      name: 'Line Islands Time',
      offset: 14
    },
    dst: {}
  },
  {
    name: 'Kosrae Time',
    abbr: null,
    aliases: ['Kosrae'],
    ids: ['Pacific/Kosrae'],
    std: {
      name: 'Kosrae Time',
      offset: 11
    },
    dst: {}
  },
  {
    name: 'Marshall Islands Time',
    abbr: null,
    aliases: ['Marshall Islands'],
    ids: ['Pacific/Kwajalein', 'Pacific/Majuro'],
    std: {
      name: 'Marshall Islands Time',
      offset: 12
    },
    dst: {}
  },
  {
    name: 'Marquesas Time',
    abbr: null,
    aliases: ['Marquesas'],
    ids: ['Pacific/Marquesas'],
    std: {
      name: 'Marquesas Time',
      offset: -9.5
    },
    dst: {}
  },
  {
    name: 'Samoa Time',
    abbr: 'SST',
    aliases: ['Samoa'],
    ids: ['Pacific/Midway', 'Pacific/Pago_Pago'],
    std: {
      name: 'Samoa Standard Time',
      offset: -11
    },
    dst: {}
  },
  {
    name: 'Nauru Time',
    abbr: null,
    aliases: ['Nauru'],
    ids: ['Pacific/Nauru'],
    std: {
      name: 'Nauru Time',
      offset: 12
    },
    dst: {}
  },
  {
    name: 'Niue Time',
    abbr: null,
    aliases: ['Niue'],
    ids: ['Pacific/Niue'],
    std: {
      name: 'Niue Time',
      offset: -11
    },
    dst: {}
  },
  {
    name: 'Norfolk Island Time',
    abbr: null,
    aliases: ['Norfolk'],
    ids: ['Pacific/Norfolk'],
    std: {
      abbr: 'NFT',
      name: 'Norfolk Island Standard Time',
      offset: 11.5
    },
    dst: {
      abbr: 'NFDT',
      name: 'Norfolk Island Daylight Time',
      offset: 12.5
    }
  },
  {
    name: 'New Caledonia Time',
    abbr: null,
    aliases: ['New Caledonia'],
    ids: ['Pacific/Noumea'],
    std: {
      name: 'New Caledonia Standard Time',
      offset: 11
    },
    dst: {
      name: 'New Caledonia Summer Time'
    }
  },
  {
    name: 'Palau Time',
    abbr: null,
    aliases: ['Palau'],
    ids: ['Pacific/Palau'],
    std: {
      name: 'Palau Time',
      offset: 9
    },
    dst: {}
  },
  {
    name: 'Pitcairn Time',
    abbr: null,
    aliases: ['Pitcairn'],
    ids: ['Pacific/Pitcairn'],
    std: {
      name: 'Pitcairn Time',
      offset: -8
    },
    dst: {}
  },
  {
    name: 'Ponape Time',
    abbr: null,
    aliases: ['Ponape'],
    ids: ['Pacific/Ponape'],
    std: {
      name: 'Ponape Time',
      offset: 11
    },
    dst: {}
  },
  {
    name: 'Cook Islands Time',
    abbr: 'CKT',
    aliases: ['Cook'],
    ids: ['Pacific/Rarotonga'],
    std: {
      name: 'Cook Islands Standard Time',
      offset: -10
    },
    dst: {}
  },
  {
    name: 'Tahiti Time',
    abbr: null,
    aliases: ['Tahiti'],
    ids: ['Pacific/Tahiti'],
    std: {
      name: 'Tahiti Time',
      offset: -10
    },
    dst: {}
  },
  {
    name: 'Gilbert Islands Time',
    abbr: null,
    aliases: ['Gilbert Islands'],
    ids: ['Pacific/Tarawa'],
    std: {
      name: 'Gilbert Islands Time',
      offset: 12
    },
    dst: {}
  },
  {
    name: 'Tonga Time',
    abbr: null,
    aliases: ['Tonga'],
    ids: ['Pacific/Tongatapu'],
    std: {
      name: 'Tonga Standard Time',
      offset: 13
    },
    dst: {
      name: 'Tonga Summer Time',
      offset: 14
    }
  },
  {
    name: 'Chuuk Time',
    abbr: null,
    aliases: ['Truk'],
    ids: ['Pacific/Truk'],
    std: {
      name: 'Chuuk Time',
      offset: 10
    },
    dst: {}
  },
  {
    name: 'Wake Island Time',
    abbr: null,
    aliases: ['Wake'],
    ids: ['Pacific/Wake'],
    std: {
      name: 'Wake Island Time',
      offset: 12
    },
    dst: {}
  },
  {
    name: 'Wallis & Futuna Time',
    abbr: null,
    aliases: ['Wallis'],
    ids: ['Pacific/Wallis'],
    std: {
      name: 'Wallis & Futuna Time',
      offset: 12
    },
    dst: {}
  }
]
