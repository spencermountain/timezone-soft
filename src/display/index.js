const metas = require('../../data/05-metazones')
const find = require('../find')

const display = function (str) {
  let id = find(str)
  if (!id) {
    return null
  }
  let meta = metas.find((obj) => obj.zones.find((tz) => tz === id))
  if (!meta) {
    meta = {
      standard: { name: id, abbrev: id } // 'Etc/GMT+5'
    }
  }
  return {
    iana: id,
    standard: meta.standard,
    daylight: meta.daylight
  }
}
module.exports = display
