import test from 'tape'
import soft from './_lib.js'

const ids = name => soft(name).map(zone => zone.iana)

test('saint vincent and the grenadines resolves like saint vincent', t => {
  const expected = ids('Saint Vincent')
  t.ok(expected.length > 0, 'short name resolves')
  const spellings = [
    'Saint Vincent and the Grenadines',
    'saint vincent and the grenadines',
    'St Vincent and the Grenadines',
    'St. Vincent & the Grenadines',
    'st vincent grenadines'
  ]
  spellings.forEach(name => t.deepEqual(ids(name), expected, name))
  t.end()
})
