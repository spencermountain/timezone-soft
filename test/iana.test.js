import test from 'tape'
import soft from './_lib.js'

test('explicit IANA identifiers bypass informal aliases', t => {
  const cases = [
    ['Asia/Urumqi', 'Asia/Urumqi', 6],
    [' asia/urumqi ', 'Asia/Urumqi', 6],
    ['Asia/Kashgar', 'Asia/Urumqi', 6],
    ['Asia/Shanghai', 'Asia/Shanghai', 8],
    ['Europe/Berlin', 'Europe/Berlin', 1],
    ['Europe/Simferopol', 'Europe/Simferopol', 3],
    ['Antarctica/Palmer', 'Antarctica/Palmer', -3],
    ['Europe/Kiev', 'Europe/Kyiv', 2],
    ['Europe/Kyiv', 'Europe/Kyiv', 2],
    ['Europe/Uzhgorod', 'Europe/Kyiv', 2],
    ['Asia/Calcutta', 'Asia/Kolkata', 5.5],
    ['Europe/Oslo', 'Europe/Berlin', 1]
  ]
  for (const [input, id, offset] of cases) {
    const matches = soft(input)
    t.equal(matches.length, 1, input)
    t.equal(matches[0]?.iana, id, `${input} canonical ID`)
    t.equal(matches[0]?.standard.offset, offset, `${input} offset`)
  }
  for (const input of ['Fake/London', 'Asia/Coyhaique', 'America/Coyhaique']) {
    t.deepEqual(soft(input), [], `${input} does not guess from the final component`)
  }
  t.equal(soft('kyiv')[0].iana, 'Europe/Kyiv', 'informal results also use canonical spelling')
  t.end()
})

test('UTC and valid fixed-offset boundaries', t => {
  for (const input of ['UTC', 'utc', ' UTC ', 'Etc/UTC', 'Etc/UCT', 'Etc/Zulu']) {
    t.deepEqual(soft(input).map(z => z.iana), ['Etc/UTC'], input)
  }
  for (const input of ['Etc/GMT+13', 'Etc/GMT+14', 'etc/gmt+14', 'GMT+14', 'UTC-13', 'UTC-14']) {
    t.deepEqual(soft(input), [], `${input} is outside IANA fixed offsets`)
  }
  for (const [id, offset] of [['Etc/GMT+12', -12], ['Etc/GMT-13', 13], ['Etc/GMT-14', 14]]) {
    t.equal(soft(id)[0].standard.offset, offset, id)
  }
  t.end()
})

test('Dublin uses the documented winter/summer display convention', t => {
  const zone = soft('Europe/Dublin')[0]
  t.deepEqual(zone.standard, { abbr: 'GMT', offset: 0, name: 'Greenwich Mean Time' }, 'winter GMT')
  t.equal(zone.daylight.abbr, 'IST', 'summer IST')
  t.equal(zone.daylight.name, 'Irish Standard Time', 'correct summer name')
  t.equal(zone.daylight.offset, 1, 'summer UTC+1')
  t.equal(zone.daylight.start, 'last-sun-mar-1h', 'start of summer display period')
  t.equal(zone.daylight.end, 'last-sun-oct-2h', 'end of summer display period')
  t.end()
})
