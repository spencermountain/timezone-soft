const iana = require('./01-iana')
const byCity = require('./02-byCity')
const byCountry = require('./03-byCountry')
const byState = require('./04-byState')
const oldZones = require('./04-oldZones')
const metazones = require('./05-metazones')
const abbreviations = require('./06-abbreviations')
const parentheses = require('./07-parentheses')
let all = Object.assign({}, iana, byState, parentheses, byCity, oldZones)

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

// clean-up any old timezones we may be using
// console.log(oldZones)
Object.keys(all).forEach((k) => {
  let str = k.toLowerCase()
  if (oldZones[str]) {
    // replace it
    all[k] = oldZones[str]
    // console.log(k, oldZones[str])
  }
  // remove any problematic keys
  if (str.match(/[0-9]/)) {
    // delete str
    // console.log(str)
  }
})
// console.log(all['est'])
// console.log(Object.keys(all).length)

// console.log(Object.keys(all).filter((k) => typeof all[k] !== 'string'))
// console.log(all['america/santo_domingo'])

module.exports = all
