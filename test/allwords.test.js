import test from 'tape'
import spacetime from 'spacetime'
import soft from './_lib.js'
let zones = spacetime().timezones
import data from '../data/index.js'
import current from './_current.js'

let list = Object.keys(data)
test('all words produce valid iana', (t) => {
  let olds = new Set()
  list.forEach((str) => {
    let found = soft(str)[0] || { iana: '' }
    let id = found.iana.toLowerCase()
    t.ok(found && zones[id], str + ' -> ' + JSON.stringify(found, null, 2))

    if (!current[found.iana]) {
      olds.add(found.iana)
    }
    // ensure we have returned a contemporary iana code
    t.equal(current[found.iana], true, 'old-tz -' + found.iana)
  })
  console.log(olds)
  t.end()
})
