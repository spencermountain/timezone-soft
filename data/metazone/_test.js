import meta from '.' //149
import aliases from '../more/aliases' //149
// const cldr = require('./cldr') //138
const zones = require('spacetime').timezones()

let count = 0
meta = meta.sort((a, b) => {
  if (a.ids.length > b.ids.length) {
    return -1
  } else if (a.ids.length < b.ids.length) {
    return 1
  }
  return 0
})

meta.forEach((obj) => {
  obj.hem = zones[obj.ids[0].toLowerCase()].hem
})
console.log(JSON.stringify(meta, null, 2))
