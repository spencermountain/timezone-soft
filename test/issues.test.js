import test from 'tape'
import soft from './_lib.js'

test('#29 Cairo includes Egypt DST without changing standard time', t => {
  for (const input of ['Africa/Cairo', 'cairo', 'egypt']) {
    const zone = soft(input).find(z => z.iana === 'Africa/Cairo')
    t.deepEqual(zone?.standard, { abbr: 'EET', offset: 2, name: 'Eastern European Standard Time' }, input)
    t.deepEqual(zone?.daylight, {
      abbr: 'EEST', offset: 3, name: 'Eastern European Summer Time',
      start: 'last-fri-apr-0h', end: 'last-thu-oct-24h'
    }, `${input} daylight`)
  }
  t.end()
})

test('#23 UTC has its own display metadata and aliases', t => {
  for (const input of ['UTC', ' utc ', 'Etc/UTC', 'Etc/UCT', 'Etc/Zulu', 'universal', 'zulu', 'coordinated universal time']) {
    const matches = soft(input)
    t.equal(matches.length, 1, `${input} resolves unambiguously`)
    t.equal(matches[0]?.iana, 'Etc/UTC', input)
    t.equal(matches[0]?.name, 'Coordinated Universal Time', `${input} name`)
    t.deepEqual(matches[0]?.standard, { abbr: 'UTC', offset: 0, name: 'Coordinated Universal Time' }, `${input} standard`)
    t.equal(matches[0]?.daylight, null, `${input} no DST`)
    t.equal(matches[0]?.long, '(UTC+00:00) Coordinated Universal Time', `${input} description`)
  }
  for (const input of ['GMT', 'Etc/GMT']) {
    t.equal(soft(input)[0]?.iana, 'Etc/GMT', input)
    t.equal(soft(input)[0]?.standard.abbr, 'GMT', `${input} retains GMT`)
  }
  t.ok(soft('greenwich mean time').every(zone => zone.standard.abbr === 'GMT'), 'geographic GMT matches retain GMT labels')
  t.end()
})

test('#17 Ciudad Juarez is a dedicated Mountain timezone', t => {
  for (const input of ['America/Ciudad_Juarez', ' america/ciudad_juarez ', 'ciudad juarez', 'ciudad juárez', 'juarez']) {
    const zone = soft(input)[0]
    t.equal(zone?.iana, 'America/Ciudad_Juarez', input)
    t.deepEqual(zone?.standard, { abbr: 'MST', offset: -7, name: 'Mountain Standard Time' }, `${input} standard`)
    t.deepEqual(zone?.daylight, {
      abbr: 'MDT', offset: -6, name: 'Mountain Daylight Time',
      start: '2nd-sun-mar-2h', end: '1st-sun-nov-2h'
    }, `${input} daylight`)
  }
  t.equal(soft('America/Ojinaga')[0]?.iana, 'America/Ojinaga', 'Ojinaga retains its own ID')
  t.end()
})

test('Coyhaique has permanent UTC-3 display metadata', t => {
  for (const input of ['America/Coyhaique', ' america/coyhaique ', 'coyhaique', 'coihaique', 'aysen', 'aysén']) {
    const zone = soft(input)[0]
    t.equal(zone?.iana, 'America/Coyhaique', input)
    t.deepEqual(zone?.standard, { abbr: '-03', offset: -3, name: 'Aysen Time' }, `${input} standard`)
    t.equal(zone?.daylight, null, `${input} no DST`)
    t.equal(zone?.long, '(UTC-03:00) Coyhaique', `${input} description`)
  }
  t.deepEqual(soft('Asia/Coyhaique'), [], 'wrong region is not guessed')
  t.end()
})
