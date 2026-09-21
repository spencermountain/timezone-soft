import test from 'tape'
import soft from './_lib.js'
import gaps from './fixtures/intl-known-gaps.js'

test('current runtime Intl timezone coverage', t => {
  t.comment(`Node ${process.versions.node}, ICU ${process.versions.icu}, tz ${process.versions.tz}`)
  for (const id of Intl.supportedValuesOf('timeZone')) {
    const found = soft(id)
    if (Object.hasOwn(gaps, id)) {
      t.equal(found.length, 0, `${id}: remove the documented gap once supported`)
      t.comment(`Known gap ${id}: ${gaps[id]}`)
    } else {
      t.ok(found.length > 0 && found.every(zone => zone && zone.iana), id)
    }
  }
  t.end()
})
