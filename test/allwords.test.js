import test from 'tape'
import spacetime from 'spacetime'
import soft from './_lib.js'
let zones = spacetime().timezones
import data from '../data/index.js'
// import current from './_current.js'

let list = Object.keys(data)
test('all words produce valid iana', (t) => {
  list.forEach((str) => {
    let found = soft(str)[0] || { iana: '' }
    let id = found.iana.toLowerCase()
    t.ok(found && zones[id], str + ' -> ' + JSON.stringify(found, null, 2))
    // if (found.offset !== zones[id].offset) {
    //   console.log(str)
    //   console.log(found)
    //   console.log(zones[id])
    // }
    // t.equal(found.offset, zones[id].offset, '[offset] ' + str + `  (${id})`)
  })
  t.end()
})
