const tzdb = require('./tzdb') //149
const cldr = require('./cldr') //138
const zones = require('spacetime').timezones()
const aliases = require('../aliases')

// tzdb.forEach((obj) => {
//   // let offset = zones[obj.ids[0].toLowerCase()].offset
//   let offset = obj.std.offset
//   console.log(obj.name)
//   obj.ids.forEach((id) => {
//     if (zones[id.toLowerCase()]) {
//       let have = zones[id.toLowerCase()].offset
//       if (offset !== have) {
//         console.log('  ', offset, id, have)
//       }
//     }
//   })
// })

let ids = 0
tzdb.forEach((obj) => {
  ids += obj.ids.length
})
console.log(ids)
