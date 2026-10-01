/* eslint-disable no-console */
import zones from '../../data/index.js'

const limit = 15
const names = new Map()

Object.entries(zones).forEach(([id, zone]) => {
  // Count each name once per zone.
  new Set(zone.names).forEach(name => {
    if (!names.has(name)) {
      names.set(name, [])
    }
    names.get(name).push(id)
  })
})

const popular = [...names]
  .sort(([a, aZones], [b, bZones]) => bZones.length - aZones.length || a.localeCompare(b))
  .slice(0, limit)

console.log(`Top ${popular.length} names by number of zones:\n`)
popular.forEach(([name, ids], index) => {
  console.log(`${index + 1}. ${name} (${ids.length} zones)`)
  console.log(`   ${ids.sort().join(', ')}\n`)
})
