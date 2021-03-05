const metas = require('../../data/05-metazones')

const display = function (id) {
  if (!id) {
    return null
  }
  let meta = metas.find((obj) => obj.ids.find((tz) => tz === id))
  if (!meta) {
    meta = {
      standard: { name: id, abbrev: id } // 'Etc/GMT+5'
    }
  }
  return {
    iana: id,
    standard: meta.std,
    daylight: meta.dl
  }
}
module.exports = display
