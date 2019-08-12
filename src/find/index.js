const lookup = require('../../data/')
//
const find = function(str) {
  if (!str) {
    return null
  }
  str = str.toLowerCase().trim()
  //lookup known abbreviations
  if (lookup.hasOwnProperty(str)) {
    return lookup[str]
  }

  //start fuzzy-match against iana timezones
  let tmp = str.replace(/( standard| daylight)? time$/, '')
  if (lookup.hasOwnProperty(tmp)) {
    return lookup[tmp]
  }
  // 'eastern daylight'
  tmp = str + ' time'
  if (lookup.hasOwnProperty(tmp)) {
    return lookup[tmp]
  }
  tmp = str + ' standard time'
  if (lookup.hasOwnProperty(tmp)) {
    return lookup[tmp]
  }

  return null
}
module.exports = find
