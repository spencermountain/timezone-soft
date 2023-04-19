import metas from './metas.js'
import { zones } from '../data/index.js'
// const metas = require('../../data/05-metazones')
// import offsets from './offsets.js'

for (let i = 0; i <= 14; i += 1) {
  metas[`gmt-${i}`] = {
    name: `Etc/GMT-${i}`,
    std: [`GMT-${i}`, i],
    long: `(UTC-${i}:00) Coordinated Universal Time`
  }
  metas[`gmt+${i}`] = {
    name: `Etc/GMT+${i}`,
    std: [`GMT+${i}`, -i],
    long: `(UTC+${i}:00) Coordinated Universal Time`
  }
}

const display = function (id) {
  if (!id) {
    return null
  }
  if (!zones[id]) {
    console.error(`missing id ${id}`)
    return null
  }
  let metaName = zones[id].meta
  if (!metas[metaName]) {
    console.error(`missing tz-meta ${metaName}`)
  }
  let meta = metas[metaName] || {}
  let dst = null
  if (zones[id].dst && meta.dst) {
    let [abbr, offset, name] = meta.dst
    name = name || `${metaName} Daylight Time`
    let [start, end] = zones[id].dst || []
    dst = { abbr, offset, name, start, end }
  }

  let [abbr, offset] = meta.std
  let name = meta.name || `${metaName} Time`
  let long = meta.long || `(UTC+${offset}:00) ${name}`
  return {
    name: name,
    iana: id,
    standard: { abbr, offset, name: meta.name || `${metaName} Standard Time`, },
    daylight: dst || null,
    long: long,
  }
}
export default display
