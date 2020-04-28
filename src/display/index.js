const metas = require('../../data/05-metazones')
const find = require('../find')

const display = function (str) {
  let id = find(str)
  if (!id) {
    return null
  }
  let meta = metas.find((obj) => obj.zones.find((tz) => tz === id))
  meta = meta || {}
  return {
    iana: id,
    standard: meta.standard,
    daylight: meta.daylight
  }
}
module.exports = display
