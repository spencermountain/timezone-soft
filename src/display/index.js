import metas from './metas.js'
import { zones } from '../data/index.js'
// const metas = require('../../data/05-metazones')
// import offsets from './offsets.js'

const display = function (id) {
  if (!id) {
    return null
  }
  let metaName = zones[id].meta
  let meta = metas[metaName]
  let dst = null
  if (meta.dst) {
    let [abbr, offset, name] = meta.dst
    name = name || `${metaName} Daylight Time`
    let [start, end] = zones[id].dst
    // let change = { start, end }
    dst = { abbr, offset, name, start, end }

  }

  let [abbr, offset] = meta.std
  return {
    name: `${metaName} Time`,
    iana: id,
    standard: { abbr, offset, name: `${metaName} Standard Time`, },
    daylight: dst || null,
    long: meta.long,
  }
}
export default display
