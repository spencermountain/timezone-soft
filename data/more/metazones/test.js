let meta = require('./meta') //149
const aliases = require('../aliases') //149
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
  if (obj.std.abbr === undefined) {
    count += 1
    console.log(obj.std)
  }
})
console.log(count)
