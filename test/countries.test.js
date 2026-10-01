import test from 'tape'
import soft from './_lib.js'
import zones, { countries } from '../data/index.js'

test('country names include every supported timezone in that country', t => {
  Object.entries(countries).forEach(([country, names]) => {
    const ids = Object.keys(zones).filter(id => zones[id].country === country)
    if (!ids.length) {
      return
    }
    const expected = [...new Set(ids.flatMap(id => soft(id).map(zone => zone.iana)))]
    names.forEach(name => {
      const found = soft(name).map(zone => zone.iana)
      expected.forEach(id => t.ok(found.includes(id), `${name} includes ${id}`))
      t.equal(found.length, new Set(found).size, `${name} has no duplicate results`)
    })
  })
  t.end()
})
