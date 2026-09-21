import test from 'tape'
import spacetime from 'spacetime'
import soft from './_lib.js'
let zones = spacetime().timezones
zones['pacific/kanton'] = true

import { lexicon } from '../src/data/index.js'
import legacy from './fixtures/legacy-zone-records.js'

// A historical fixture must not prevent adding a newly supported IANA zone.
const recognized = new Set([...Object.keys(zones), ...Intl.supportedValuesOf('timeZone').map(id => id.toLowerCase())])

let list = Object.keys(lexicon)
test('all words produce valid iana', (t) => {
  list.forEach((str) => {
    let found = soft(str)[0] || { iana: '' }
    let id = found.iana.toLowerCase()
    t.ok(found && recognized.has(id), str + ' -> ' + JSON.stringify(found, null, 2))

    t.ok(soft(str).every(zone => zone && recognized.has(zone.iana.toLowerCase())), 'all candidates valid: ' + str)
  })
  t.end()
})

test('historical preferred IDs remain accepted', t => {
  for (const id of Object.keys(legacy)) {
    t.ok(soft(id).length > 0, id)
  }
  t.end()
})
