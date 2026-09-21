import test from 'tape'
import soft from './_lib.js'

test('zero offsets resolve to a real zone', t => {
  for (const input of ['UTC+0', 'UTC-0', 'utc0', '0', '+0', '-0', '0h', '  UTC+0  ']) {
    const zone = soft(input)[0]
    t.equal(zone?.iana, 'Etc/GMT', input)
    t.equal(zone?.standard.offset, 0, `${input} offset`)
    t.equal(zone?.daylight, null, `${input} has no DST`)
  }
  t.end()
})

test('UTC offset boundaries and display signs', t => {
  for (const offset of [-12, -5, 5, 13, 14]) {
    const signed = offset > 0 ? `+${offset}` : `${offset}`
    const id = `Etc/GMT${offset > 0 ? '-' : '+'}${Math.abs(offset)}`
    for (const input of [`UTC${signed}`, `${signed}h`, ` ${signed} `, id]) {
      const zone = soft(input)[0]
      t.equal(zone?.iana, id, input)
      t.equal(zone?.standard.offset, offset, `${input} offset`)
      t.equal(zone?.long, `(UTC${signed}:00) Coordinated Universal Time`, `${input} display`)
    }
  }
  const gmt = soft('GMT+5')[0]
  t.equal(gmt.standard.offset, -5, 'preserve GMT sign convention')
  t.equal(gmt.long, '(UTC-5:00) Coordinated Universal Time', 'GMT display uses UTC sign')
  t.end()
})

test('unsupported offsets do not return invented zones', t => {
  for (const input of ['UTC+15', 'UTC-13', 'UTC+5:30', 'UTC+5.5', 'abcUTC+5', 'abcGMT+5']) {
    t.deepEqual(soft(input), [], input)
  }
  t.equal(soft('Asia/Kolkata')[0].standard.offset, 5.5, 'named fractional zone works')
  t.end()
})
