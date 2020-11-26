const test = require('tape')
const spacetime = require('spacetime')
const informal = require('../src')
let zones = spacetime().timezones

let list = []
list = list.concat(Object.keys(require('../data/01-iana')))
list = list.concat(Object.keys(require('../data/02-byCity')))
list = list.concat(Object.keys(require('../data/03-byCountry')))
list = list.concat(Object.keys(require('../data/04-oldZones')))
list = list.concat(Object.keys(require('../data/07-parentheses')))

test('all words produce valid iana', (t) => {
  list.forEach((str) => {
    let found = informal.find(str)
    t.ok(found && zones[found.toLowerCase()], str)
  })
  t.equal()
})
