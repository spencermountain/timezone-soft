import test from 'tape'
import soft from './_lib.js'

test('Canadian permanent offsets follow IANA 2026e', t => {
  const cases = [
    ['America/Vancouver', -7, 'PCT', ['vancouver', 'Canada/Pacific']],
    ['America/Edmonton', -6, 'ABT', ['edmonton', 'Canada/Mountain', 'America/Yellowknife']],
    ['America/Inuvik', -6, 'CST', ['inuvik']],
    ['America/Winnipeg', -5, 'MBT', ['winnipeg', 'Canada/Central', 'America/Rainy_River']]
  ]
  for (const [id, offset, abbr, aliases] of cases) {
    const expected = soft(id)[0]
    t.equal(expected?.standard.offset, offset, `${id} permanent offset`)
    t.equal(expected?.standard.abbr, abbr, `${id} abbreviation`)
    t.equal(expected?.daylight, null, `${id} no DST`)
    const prefix = `(UTC-${String(-offset).padStart(2, '0')}:00)`
    t.ok(expected?.long.startsWith(prefix), `${id} description uses permanent offset`)
    for (const alias of aliases) {t.deepEqual(soft(alias)[0], expected, alias)}
  }
  t.end()
})

test('BC, Alberta and Manitoba use their provincial year-round labels', t => {
  for (const [id, abbr, name, previous] of [
    ['America/Vancouver', 'PCT', 'Pacific Time', 'MST'],
    ['America/Edmonton', 'ABT', 'Alberta Time', 'CST'],
    ['America/Winnipeg', 'MBT', 'Manitoba Standard Time', 'EST']
  ]) {
    const zone = soft(id)[0]
    t.equal(zone?.standard.abbr, abbr, `${id} abbreviation`)
    t.equal(zone?.standard.name, name, `${id} standard name`)
    t.equal(soft(abbr)[0]?.iana, id, `${abbr} finds ${id}`)
    t.ok(soft(previous).some(z => z.iana === id), `${previous} still finds ${id}`)
  }
  t.equal(soft('America/Inuvik')[0]?.standard.abbr, 'CST', 'Inuvik is not on Alberta Time')
  for (const id of ['America/Dawson_Creek', 'America/Fort_Nelson']) {
    t.equal(soft(id)[0]?.standard.abbr, 'MST', `${id} keeps mountain time`)
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
