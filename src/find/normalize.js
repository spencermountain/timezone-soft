
//try to match these against iana form
const one = (str) => {
  str = str.toLowerCase()
  str = str.replace(/^in /g, '')
  str = str.replace(/ time/g, '')
  str = str.replace(/ (standard|daylight|summer)/g, '')
  str = str.replace(/ - .*/g, '') //`Eastern Time - US & Canada`
  str = str.replace(/, .*/g, '') //`mumbai, india`
  str = str.replace(/\./g, '')//st. petersberg
  return str.trim()
}

//some more aggressive transformations
const two = function (str) {
  str = str.replace(/\b(east|west|north|south)ern/g, '$1')
  str = str.replace(/\b(africa|america|australia)n/g, '$1')
  str = str.replace(/\beuropean/g, 'europe')
  str = str.replace(/\islands/g, 'island')
  str = str.replace(/.*\//g, '')
  return str.trim()
}
// even-more agressive
const three = function (str) {
  str = str.replace(/\(.*\)/, '')//anything in brackets
  str = str.replace(/  +/g, ' ')//extra spaces
  return str.trim()
}

export default { one, two, three }