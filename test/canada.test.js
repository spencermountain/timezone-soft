import test from 'tape'
import soft from './_lib.js'

test('Canadian permanent offsets follow IANA 2026e', t => {
  const cases = [
    ['America/Vancouver', -7, 'MST', ['vancouver', 'Canada/Pacific']],
    ['America/Edmonton', -6, 'CST', ['edmonton', 'Canada/Mountain', 'America/Yellowknife']],
    ['America/Inuvik', -6, 'CST', ['inuvik']],
    ['America/Winnipeg', -5, 'EST', ['winnipeg', 'Canada/Central', 'America/Rainy_River']]
  ]
  for (const [id, offset, abbr, aliases] of cases) {
    const expected = soft(id)[0]
    t.equal(expected?.standard.offset, offset, `${id} permanent offset`)
    t.equal(expected?.standard.abbr, abbr, `${id} IANA abbreviation`)
    t.equal(expected?.daylight, null, `${id} no DST`)
    const prefix = `(UTC-${String(-offset).padStart(2, '0')}:00)`
    t.ok(expected?.long.startsWith(prefix), `${id} description uses permanent offset`)
    for (const alias of aliases) t.deepEqual(soft(alias)[0], expected, alias)
  }
  t.end()
})

test('Canadian updates preserve US seasonal metadata', t => {
  for (const [id, standard, daylight] of [
    ['America/Los_Angeles', -8, -7],
    ['America/Denver', -7, -6],
    ['America/Chicago', -6, -5]
  ]) {
    const zone = soft(id)[0]
    t.equal(zone?.standard.offset, standard, `${id} standard`)
    t.equal(zone?.daylight?.offset, daylight, `${id} daylight`)
    t.equal(zone?.daylight?.start, '2nd-sun-mar-2h', `${id} retains seasonal rules`)
  }
  t.end()
})
