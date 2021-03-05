const metas = require('../../data/05-metazones')

const display = function (id) {
  if (!id) {
    return null
  }
  let meta = metas.find((obj) => {
    return obj.ids.find((tz) => {
      return tz === id
    })
  })
  if (!meta) {
    meta = {
      std: { name: id, abbrev: id }, // 'Etc/GMT+5'
      offset: null
    }
  }
  return {
    iana: id,
    standard: meta.std || null,
    daylight: meta.dl || null
    // offset: meta.offset - 1 || null
  }
}
module.exports = display
