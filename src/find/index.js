import unpack from 'efrt/unpack'
import pckd from './_data.js'
import misc from './misc.js'
import parseOffset from './parseOffset.js'

let lexicon = unpack(pckd)
lexicon = Object.assign(lexicon, misc)
// console.log(lexicon.ist)

// add some redundant data to our lexicon
Object.keys(lexicon).filter((k) => {
  let val = lexicon[k]
  if (typeof val === 'string') {
    val = val.toLowerCase()
    if (lexicon[val] === undefined) {
      lexicon[val] = lexicon[k]
    }
  }
})

//try to match these against iana form
const normalizeOne = (tz) => {
  tz = tz.replace(/^in /g, '')
  tz = tz.replace(/ time/g, '')
  tz = tz.replace(/ (standard|daylight|summer)/g, '')
  tz = tz.replace(/ - .*/g, '') //`Eastern Time - US & Canada`
  tz = tz.replace(/, .*/g, '') //`mumbai, india`
  return tz.trim()
}

//some more aggressive transformations
const normalizeTwo = function (tz) {
  tz = tz.replace(/\b(east|west|north|south)ern/g, '$1')
  tz = tz.replace(/\b(africa|america|australia)n/g, '$1')
  tz = tz.replace(/\beuropean/g, 'europe')
  tz = tz.replace(/\islands/g, 'island')
  tz = tz.replace(/.*\//g, '')
  return tz.trim()
}
// even-more agressive
const normalizeThree = function (tz) {
  tz = tz.replace(/\(.*\)/, '')
  return tz.trim()
}
//
const find = function (str) {
  if (!str) {
    return null
  }
  str = str.toLowerCase().trim()
  // lookup known abbreviations
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }

  // -8hrs
  if (/[0-9]/.test(str)) {
    let etc = parseOffset(str)
    if (etc) {
      return [etc]
    }
  }

  // start fuzzy-match against iana timezones
  str = normalizeOne(str)
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  // 'eastern daylight'
  let tmp = str + ' time'
  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp]
  }
  // 'pacific'
  tmp = str + ' standard time'
  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp]
  }

  // -- harder normalizations --
  str = normalizeTwo(str)
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  // -- HARDER normalizations --
  str = normalizeThree(str)
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  // 'eastern daylight'
  tmp = str + ' time'
  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp]
  }
  // 'pacific'
  tmp = str + ' standard time'
  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp]
  }

  return null
}
export default find
