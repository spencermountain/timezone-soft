const meta = require('./meta') //149
const aliases = require('../aliases') //149
// const cldr = require('./cldr') //138
const zones = require('spacetime').timezones()

console.log(zones.length)
Object.keys(zones).forEach((k) => {
  let found = meta.find((obj) => obj.ids.find((id) => id.toLowerCase() === k))
  if (!found && !/[0-9]/.test(k) && !aliases[k]) {
    console.log(k)
  }
  // let id=titlecase(k)
})
