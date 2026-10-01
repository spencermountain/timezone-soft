import test from 'tape'
import zones from '../data/index.js'

test('zones sharing a meta agree on daylight saving status', t => {
  const groups = new Map()
  Object.entries(zones).forEach(([id, zone]) => {
    if (!zone.meta) {
      return
    }
    if (!groups.has(zone.meta)) {
      groups.set(zone.meta, { daylight: [], fixed: [] })
    }
    const group = groups.get(zone.meta)
    if (zone.dst) {
      group.daylight.push(id)
    } else {
      group.fixed.push(id)
    }
  })

  t.ok(groups.size > 0, 'checks metazone groups')
  groups.forEach(({ daylight, fixed }, meta) => {
    t.ok(daylight.length === 0 || fixed.length === 0,
      `${meta}: DST [${daylight.join(', ')}]; no DST [${fixed.join(', ')}]`)
  })

  t.end()
})
