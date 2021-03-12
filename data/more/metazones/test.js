const meta = require('./meta') //149
const aliases = require('../aliases') //149
// const cldr = require('./cldr') //138
const zones = require('spacetime').timezones()

meta.forEach((obj) => {
  let hem = zones[obj.ids[0].toLowerCase()].hem
  let arr = obj.ids.map((id) => {
    return (zones[id.toLowerCase()] || {}).hem
  })
  if (arr.every((s) => s === 'n' || s === undefined)) {
    obj.hemisphere = 'n'
  } else if (arr.every((s) => s === 's' || s === undefined)) {
    obj.hemisphere = 's'
  } else {
    console.log(obj.name, arr)
  }
  // console.log(arr)
})
