'use strict'
const test = require('tape')
const soft = require('../src')

test('informal timezones', (t) => {
  let arr = [
    ['Toronto', 'America/Toronto'],
    ['toronto', 'America/Toronto'],
    ['toronto time', 'America/Toronto'],
    ['toronto standard time', 'America/Toronto'],

    ['eastern standard', 'Canada/Eastern'],
    ['eastern standard time', 'Canada/Eastern'],
    ['eastern daylight', 'Canada/Eastern'],
    ['eastern daylight time', 'Canada/Eastern'],
    ['eastern time', 'Canada/Eastern'],
    ['est', 'Canada/Eastern'],
    ['edt', 'Canada/Eastern'],

    ['Jamaica', 'America/Jamaica'],
    ['PST', 'Canada/Pacific'],
    ['pdt', 'Canada/Pacific'],
    ['pacific', 'Canada/Pacific'],
    ['pacific standard', 'Canada/Pacific'],
    ['pacific daylight', 'Canada/Pacific'],
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
    [`Eastern Time - US & Canada`, 'Canada/Eastern'],
    ['kandahar', 'Asia/Kabul'],
    ['yorkshire', 'Europe/London']
  ]
  arr.forEach((a) => {
    let found = soft(a[0])
    t.equal(found[0].iana, a[1], a[0])
  })
  t.end()
})
