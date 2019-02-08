'use strict';
const test = require('tape');
const informal = require('../src');

test('informal timezones', t => {
  let arr = [
    ['Toronto', 'America/Toronto'],
    ['toronto', 'America/Toronto'],
    ['toronto time', 'America/Toronto'],
    ['toronto standard time', 'America/Toronto'],
    ['eastern daylight', 'Canada/Eastern'],
    ['Jamaica', 'America/Jamaica'],
    ['PST', 'America/Los_Angeles'],
    ['pdt', 'America/Los_Angeles'],
    ['pacific', 'America/Los_Angeles'],
    ['pacific standard', 'America/Los_Angeles'],
    ['pacific daylight', 'America/Los_Angeles'],
    ['GMT+8', '-8h'],
    ['bst', 'Europe/London'],
    ['east african', 'eastern africa'],
  ]
  arr.forEach((a) => {
    let found = informal.find(a[0])
    t.equal(found, a[1], a[0])
  })
  t.end()
})
