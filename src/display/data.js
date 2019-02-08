//these timezone abbreviations are used aggressively in other places
//if tz doesn't have an abbreviation, and is in the same offset...
//these are pretty subjective. i just made them up.
const greedy_north = {
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
}
const greedy_south = {
  '-3': 'america/Sao_Paulo',
  '0': 'ETC/GMT',
  '1': 'Africa/Lagos',
  // '2': 'africa/khartoum',//central africa
  '2': 'Africa/Johannesburg', //south africa
  '3': 'Africa/Nairobi',
  '10': 'Australia/Brisbane',
  '12': 'Pacific/Auckland'
}

const british = {
  'Europe/Belfast': true,
  'Europe/Dublin': true,
  'Europe/Guernsey': true,
  'Europe/Jersey': true,
}

module.exports = {
  greedy_north: greedy_north,
  greedy_south: greedy_south,
  british: british
}
