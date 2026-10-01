import test from 'tape'
import soft from './_lib.js'
import zones, { countries } from '../data/index.js'

const regions = new Set(Object.keys(zones).map(id => id.split('/')[0].toLowerCase()))

test('country names include every supported timezone in that country', t => {
  Object.entries(countries).forEach(([country, names]) => {
    const ids = Object.keys(zones).filter(id => zones[id].country === country)
    if (!ids.length) {
      return
    }
    const expected = [...new Set(ids.flatMap(id => soft(id).map(zone => zone.iana)))]
    names.forEach(name => {
      // Bare IANA region names take precedence; qualify overlapping country aliases.
      const input = regions.has(name) && name !== names[0] ? `${name} time` : name
      const found = soft(input).map(zone => zone.iana)
      expected.forEach(id => t.ok(found.includes(id), `${input} includes ${id}`))
      t.equal(found.length, new Set(found).size, `${input} has no duplicate results`)
    })
  })
  t.end()
})
