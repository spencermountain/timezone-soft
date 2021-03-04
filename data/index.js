const iana = require('./01-iana')
const byCity = require('./02-byCity')
const byCountry = require('./03-byCountry')
const byState = require('./04-byState')
const oldZones = require('./04-oldZones')
const metazones = require('./05-metazones')
const abbreviations = require('./06-abbreviations')
const parentheses = require('./07-parentheses')
let all = Object.assign({}, iana, byCity, byState, oldZones, parentheses)

//Add country info
Object.keys(byCountry).forEach((key) => {
  //Add country name
  all[key] = byCountry[key].choice
  //Add 2-letter country code
  all[byCountry[key].code] = byCountry[key].choice
})

//Add metazone info
metazones.forEach((obj) => {
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
    obj.alias.forEach((str) => (all[str.toLowerCase()] = zone))
  }
})

// add even-more abbreviations
Object.keys(abbreviations).forEach((k) => {
  let arr = (abbreviations[k] || []).filter((a) => a)
  arr.forEach((abbr) => {
    if (all.hasOwnProperty(abbr) === false) {
      all[abbr] = k
    }
  })
})
// console.log(all['canada/vancouver'])
// console.log(Object.keys(all).length)

// console.log(Object.keys(all).filter((k) => typeof all[k] !== 'string'))
// console.log(all.canberra)

module.exports = all
