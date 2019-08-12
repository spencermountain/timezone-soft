const lookup = require('../../data/')
const parseOffset = require('./parseOffset')

//try to match these against iana form
const normalizeOne = tz => {
  tz = tz.replace(/ time/g, '')
  tz = tz.replace(/ (standard|daylight|summer)/g, '')
  tz = tz.replace(/ - .*/g, '') //`Eastern Time - US & Canada`
  return tz.trim()
}

const normalizeTwo = function(tz) {
  tz = tz.replace(/\b(east|west|north|south)ern/g, '$1')
  tz = tz.replace(/\b(africa|america|australia)n/g, '$1')
  tz = tz.replace(/\beuropean/g, 'europe')
  tz = tz.replace(/\islands/g, 'island')
  tz = tz.replace(/.*\//g, '')
  return tz.trim()
}
//
const find = function(str) {
  if (!str) {
    return null
  }
  str = str.toLowerCase().trim()
  // lookup known abbreviations
  if (lookup.hasOwnProperty(str)) {
    return lookup[str]
  }

  // -8hrs
  if (/[0-9]/.test(str)) {
    let etc = parseOffset(str)
    if (etc) {
      return etc
    }
  }

  // start fuzzy-match against iana timezones
  str = normalizeOne(str)
  if (lookup.hasOwnProperty(str)) {
    return lookup[str]
  }
  // 'eastern daylight'
  let tmp = str + ' time'
  if (lookup.hasOwnProperty(tmp)) {
    return lookup[tmp]
  }
  // 'pacific'
  tmp = str + ' standard time'
  if (lookup.hasOwnProperty(tmp)) {
    return lookup[tmp]
  }

  // -- harder normalizations --
  //
  str = normalizeTwo(str)
  if (lookup.hasOwnProperty(str)) {
    return lookup[str]
  }
  // 'eastern daylight'
  tmp = str + ' time'
  if (lookup.hasOwnProperty(tmp)) {
    return lookup[tmp]
  }
  // 'pacific'
  tmp = str + ' standard time'
  if (lookup.hasOwnProperty(tmp)) {
    return lookup[tmp]
  }

  return null
}
module.exports = find
