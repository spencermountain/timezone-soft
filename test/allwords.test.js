const test = require('tape')
const spacetime = require('spacetime')
const soft = require('../src')
let zones = spacetime().timezones

const skip = {
  'america/fort_wayne': true,
  'asia/ulan_bator': true,
  'america/argentina/buenos_aires': true,
  'asia/tel_aviv': true
}

let list = Object.keys(require('../data'))
test('all words produce valid iana', (t) => {
  list.forEach((str) => {
    let found = soft(str)[0] || { iana: '' }
    let id = found.iana.toLowerCase()
    t.ok((found && zones[id]) || skip[str], str)
  })
  t.end()
})
