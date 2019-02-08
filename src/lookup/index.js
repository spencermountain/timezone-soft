const data = require('../data').lookup
//
const lookup = function(str) {
  if (data.hasOwnProperty(str) === true) {
    return data[str]
  }
  return null
}
module.exports = lookup
