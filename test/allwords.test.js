const test = require('tape')
const spacetime = require('spacetime')
const informal = require('../src')
let zones = spacetime().timezones

let list = Object.keys(require('../data'))
test('all words produce valid iana', (t) => {
  list.forEach((str) => {
    let found = informal.find(str)
    t.ok(found && zones[found.toLowerCase()], str)
  })
  t.end()
})
