import test from 'tape'
import soft from './_lib.js'

test('informal timezones', (t) => {
  let arr = [
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
    ['pacific', 'America/Los_Angeles'],
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
    ['cet', 'Europe/Berlin'],
    ['cest', 'Europe/Berlin'],
    ['india', 'Asia/Kolkata'],
    ['indian', 'Asia/Kolkata'],
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
    let found = soft(a[0])
    found[0] = found[0] || {}
    t.equal(found[0].iana, a[1], a[0])
  })
  t.end()
})
