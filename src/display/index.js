const informal = require('../data').informal
const data = require('./data')

//England is BST/GMT, for some reason
const handleSpecial = function(tz, offset) {
  if (data.british.hasOwnProperty(tz)) {
    if (offset === '1') {
      return 'BST'
    }
    return 'GMT'
  }
  return null
}

//is it EST or EDT ?
const chooseAbbrev = function(arr, obj) {
  if (arr[1] && obj.dst === true) {
    return arr[1].toUpperCase()
  }
  if (arr[0]) {
    return arr[0].toUpperCase()
  }
  return null
}


const display = function(tz, obj = {}) {
  //try a straight-up match
  if (informal.hasOwnProperty(tz)) {
    let abbr = chooseAbbrev(informal[tz], obj)
    if (abbr !== null) {
      return abbr
    }
  }
  let offset = String(obj.default_offset)
  let special = handleSpecial(tz, offset)
  if (special) {
    return special
  }

  if (obj.hemisphere === 'North' && data.greedy_north.hasOwnProperty(offset)) {
    let useTz = data.greedy_north[offset]
    return chooseAbbrev(informal[useTz], obj) || ''
  }
  if (obj.hemisphere === 'South' && data.greedy_south.hasOwnProperty(offset)) {
    let useTz = data.greedy_south[offset]
    return chooseAbbrev(informal[useTz], obj) || ''
  }
  return ''
}
module.exports = display
