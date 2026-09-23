/* eslint-disable no-console */
import metas from '../../data/metas.js'
import { zones } from '../data/index.js'

for (let i = 0; i <= 14; i += 1) {
  metas[`gmt-${i}`] = {
    name: `Etc/GMT-${i}`,
    std: [`GMT-${i}`, i],
    long: `(UTC+${i}:00) Coordinated Universal Time`
  }
  if (i <= 12) metas[`gmt+${i}`] = {
    name: `Etc/GMT+${i}`,
    std: [`GMT+${i}`, -i],
    long: `(UTC-${i}:00) Coordinated Universal Time`
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
  const metaName = zones[id].meta
  if (!metas[metaName]) {
    console.error(`missing tz-meta ${metaName}`)
  }
  const meta = metas[metaName] || {}
  let dst = null
  if (zones[id].dst && meta.dst) {
    let [abbr, offset, name] = meta.dst
    name = name || `${metaName} Daylight Time`
    const [start, end] = zones[id].dst || []
    dst = { abbr, offset, name, start, end }
  }

  const [abbr, offset, standardName] = meta.std
  const name = meta.name || `${metaName} Time`
  const long = meta.long || `(UTC+${offset}:00) ${name}`
  return {
    name: name,
    iana: id,
    standard: { abbr, offset, name: standardName || meta.name || `${metaName} Standard Time` },
    daylight: dst || null,
    long: long,
  }
}
export default display
