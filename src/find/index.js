const abbreviations = require('../data/abbreviations')
const iana = require('../data/iana')
//
const lookup = function(str) {
  if (!str) {
    return null
  }
  str = str.toLowerCase().trim()
  //lookup known abbreviations
  if (abbreviations.hasOwnProperty(str)) {
    return abbreviations[str]
  }

  //start fuzzy-match against iana timezones
  str = str.replace(/( standard| daylight)? time$/, '')
  if (iana.hasOwnProperty(str)) {
    return iana[str]
  }

  return null
}
module.exports = lookup
