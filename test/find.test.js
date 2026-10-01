import test from 'tape'
import soft from './_lib.js'

test('whitespace is normalized before phrase matching', t => {
  for (const input of [
    ' in toronto ',
    '\tIN\tToronto\n',
    'Toronto\tTime',
    ' in   toronto  standard  time ',
    'Toronto\u00a0Time',
    'Toronto\nDaylight\tTime'
  ]) {
    t.deepEqual(soft(input), soft('toronto'), JSON.stringify(input))
  }
  t.deepEqual(soft(' \t\n '), [], 'whitespace alone has no match')
  t.deepEqual(soft(' in unknown city time '), [], 'unknown phrase has no match')
  t.end()
})

test('informal timezones', (t) => {
  const arr = [
    ['Toronto', 'America/Toronto'],
    ['toronto', 'America/Toronto'],
    ['toronto time', 'America/Toronto'],
    ['toronto standard time', 'America/Toronto'],

    ['eastern standard', 'America/New_York'],
    ['eastern standard time', 'America/New_York'],
    ['eastern daylight', 'America/New_York'],
    ['eastern daylight time', 'America/New_York'],
    ['eastern time', 'America/New_York'],
    ['est', 'America/New_York'],
    ['edt', 'America/New_York'],

    ['Jamaica', 'America/Jamaica'],
    ['PST', 'America/Los_Angeles'],
    ['pdt', 'America/Los_Angeles'],
    ['pacific', 'Pacific/Apia'],
    ['pacific standard', 'America/Los_Angeles'],
    ['pacific daylight', 'America/Los_Angeles'],
    ['GMT+8', 'Etc/GMT+8'],
    ['-3h', 'Etc/GMT+3'],
    ['bst', 'Europe/London'],
    ['east african', 'Africa/Nairobi'],
    ['eastern africa', 'Africa/Nairobi'],
    ['eat', 'Africa/Nairobi'],
    ['shenzhen', 'Asia/Shanghai'],
    ['south east asia', 'Asia/Bangkok'],
    ['indochina', 'Asia/Bangkok'],
    [`Europe/London`, `Europe/London`],
    ['cet', 'Europe/Madrid'],
    ['cest', 'Europe/Madrid'],
    ['india', 'Asia/Kolkata'],
    ['indian', 'Indian/Chagos'],
    ['Japan', 'Asia/Tokyo'],
    ['JP', 'Asia/Tokyo'],
    ['CA', 'America/Toronto'],
    ['venezuela', 'America/Caracas'],
    ['venezuela time', 'America/Caracas'],
    ['venezuelan', 'America/Caracas'],
    ['calcutta', 'Asia/Kolkata'],
    ['5hs', 'Etc/GMT-5'],
    ['+5hs', 'Etc/GMT-5'],
    ['-5hs', 'Etc/GMT+5'],
    ['Etc/GMT+5', 'Etc/GMT+5'],
    ['Etc/gmt-5', 'Etc/GMT-5'],
    ['-3', 'Etc/GMT+3'],
    ['3', 'Etc/GMT-3'],
    [`Eastern Time - US & Canada`, 'America/New_York'],
    ['kandahar', 'Asia/Kabul'],
    ['yorkshire', 'Europe/London']
  ]
  arr.forEach((a) => {
    const found = soft(a[0])
    found[0] = found[0] || {}
    t.equal(found[0].iana, a[1], a[0])
  })
  t.end()
})

test('false-positive timezones', (t) => {
  const arr = [
    'sf5hasdf',
    '827219',
    'foo',
    '5h5h5h',
  ]
  arr.forEach((str) => {
    const found = soft(str)
    t.equal(found.length, 0, str)
  })
  t.end()
})
