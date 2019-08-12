const iana = require('./01-iana')
const byCity = require('./02-byCity')
const byCountry = require('./03-byCountry')
const oldZones = require('./04-oldZones')
const metazones = require('./05-metazones')

let all = Object.assign({}, iana, byCity, oldZones)

//Add country info
Object.keys(byCountry).forEach(key => {
  //Add country name
  all[key] = byCountry[key].choice
  //Add 2-letter country code
  all[byCountry[key].code] = byCountry[key].choice
})

//Add metazone info
metazones.forEach(obj => {
  let zone = obj.pick || obj.zones[0]
  all[obj.standard.name.toLowerCase()] = zone

  if (obj.standard.abbrev) {
    all[obj.standard.abbrev.toLowerCase()] = zone
  }
  if (obj.daylight) {
    if (obj.daylight.name) {
      all[obj.daylight.name.toLowerCase()] = zone
    }
    if (obj.daylight.abbrev) {
      all[obj.daylight.abbrev.toLowerCase()] = zone
    }
  }
  if (obj.alias) {
    obj.alias.forEach(str => (all[str.toLowerCase()] = zone))
  }
})
// console.log(all.toronto)
// console.log(Object.keys(all).length)

module.exports = all
