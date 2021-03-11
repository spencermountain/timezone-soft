const tzdb = require('./tzdb') //149
const cldr = require('./cldr') //138
const zones = require('spacetime').timezones()
const aliases = require('../aliases')

const titleCase = (str) => {
  str = str[0].toUpperCase() + str.substr(1)
  str = str.replace(/\/gmt/, '/GMT')
  str = str.replace(/[\/_]([a-z])/gi, (s) => {
    return s.toUpperCase()
  })
  return str
}

// Object.keys(zones).forEach((iana) => {
//   let found = tzdb.find((o) => o.ids.find((id) => id.toLowerCase() === iana))
//   if (!found && !aliases[iana]) {
//     iana = titleCase(iana)
//     console.log(iana)
//   }
// })

tzdb.forEach((obj) => {
  // let offset = zones[obj.ids[0].toLowerCase()].offset
  let offset = obj.std.offset
  console.log(obj.name)
  obj.ids.forEach((id) => {
    if (zones[id.toLowerCase()]) {
      let have = zones[id.toLowerCase()].offset
      if (offset !== have) {
        console.log('  ', offset, id, have)
      }
    }
  })
})
/*


*/
