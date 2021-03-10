const longNames = require('./longNames')
const metazones = require('./metazones')
const shortNames = require('./shortnames')

const spacetime = require('spacetime')
let zones = spacetime.timezones()

let result = Object.keys(metazones).map((k) => {
  let std = {}
  let dst = {}
  let aliases = []
  let name = null
  let abbr = null
  if (longNames[k]) {
    name = longNames[k].Generic || name
    std.name = longNames[k].Standard || undefined
    dst.name = longNames[k].Daylight || undefined
  }
  if (shortNames[k]) {
    abbr = shortNames[k].Generic
    std.abbr = shortNames[k].Standard || undefined
    dst.abbr = shortNames[k].Daylight || undefined
  }
  let id = metazones[k][0].toLowerCase()
  if (id === 'america/argentina/la_rioja') {
    id = 'america/argentina'
  }
  let found = zones[id]
  std.offset = found.offset
  if (found.dst) {
    // dst.date = found.dst
    dst.offset = found.offset + 1
  }
  // else if (Object.keys(dst).length > 0) {
  //   if (dst.abbr) {
  //     aliases.push(dst.abbr)
  //   }
  //   dst = null
  // }
  if (dst && Object.keys(dst).length === 0) {
    dst = null
  }
  aliases.push(k.replace(/_/, ' '))
  if (!name) {
    name = std.name
  }
  return {
    name: name,
    abbr: abbr,
    aliases: aliases,
    ids: metazones[k],
    std: std,
    dst: dst
  }
})
console.log(JSON.stringify(result, null, 2))
