const iana = require('./iana-map')
const zones = require('./cldr-metazones')

const unique = function (arr) {
  let obj = {}
  for (let i = 0; i < arr.length; i += 1) {
    obj[arr[i]] = true
  }
  return Object.keys(obj)
}

let res = Object.keys(iana).map((name) => {
  let iso = zones[name]
  let alias = iso.split(/\(.*\)/)[1].trim()
  let aliases = alias.split(/, /)

  let offset = (iso.match(/UTC([-+]?[0-9:]+)/) || [])[1] || '0'
  offset = offset.replace(/:00/, '')
  offset = offset.replace(/:30/, '.5')
  offset = offset.replace(/:15/, '.25')
  offset = offset.replace(/:45/, '.75')
  let shrt = name.replace(/ standard time/i, '')
  aliases.push(shrt)
  aliases = aliases.map((str) => str.toLowerCase().trim())
  // console.log(offset)
  return {
    ids: unique(iana[name]),
    name: name,
    offset: Number(offset),
    iso: iso,
    aliases: unique(aliases)
  }
})
console.log(JSON.stringify(res, null, 2))
