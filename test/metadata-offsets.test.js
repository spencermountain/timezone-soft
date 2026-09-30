import test from 'tape'
import { readFileSync } from 'node:fs'
import soft from './_lib.js'

const fixture = JSON.parse(readFileSync(new URL('./fixtures/offsets-2026e.json', import.meta.url), 'utf8'))

test(`display offsets match IANA ${fixture.tzdbVersion} across ${fixture.year}`, t => {
  for (const [id, expected] of Object.entries(fixture.zones)) {
    const zone = soft(id)[0]
    t.equal(zone?.iana, id, `${id} resolves independently`)
    t.equal(zone?.standard.offset, expected.standard, `${id} standard offset`)
    if (expected.daylight === null) {
      t.equal(zone?.daylight, null, `${id} does not invent DST`)
    } else {
      t.equal(zone?.daylight?.offset, expected.daylight, `${id} daylight offset`)
    }
    for (const [index, [offset, field]] of expected.samples.entries()) {
      t.equal(zone?.[field]?.offset, offset, `${id} ${fixture.dates[index]} ${field}`)
    }
  }
  t.end()
})
