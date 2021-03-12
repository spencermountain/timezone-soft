const iana = require('./01-iana')
const byCity = require('./02-byCity')
const byCountry = require('./03-byCountry')
const byState = require('./04-byState')
const oldZones = require('./05-oldZones')
const metazones = require('./metazone')
// const metazones = require('./05-metazones')
const abbreviations = require('./06-abbreviations')
const parentheses = require('./07-parentheses')

let all = Object.assign({}, iana, byState, parentheses, byCity, oldZones)

// prefer newyork and la iana codes
delete all.eastern
delete all.pacific

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

// support an array of responses, when there's multiple
const combine = (obj, key, val) => {
  if (typeof obj[key] === 'string' && obj[key] !== val) {
    obj[key] = [obj[key], val]
  } else if (obj[key] === undefined) {
    obj[key] = val
  } else if (isArray(obj[key]) && !obj[key].find((a) => a === val)) {
    // don't add a duplicate
    obj[key].push(val)
  }
}

//Add country info
Object.keys(byCountry).forEach((key) => {
  //Add country name
  combine(all, key, byCountry[key].choice)
  //Add 2-letter country code
  all[byCountry[key].code] = byCountry[key].choice
})

//Add metazone info
metazones.forEach((obj) => {
  let zone = obj.pick || obj.ids[0]
  let str = obj.std.name.toLowerCase()
  all[str] = all[str] || zone
  if (obj.std.abbrev) {
    str = obj.std.abbr.toLowerCase()
    all[str] = all[str] || zone
  }
  //do daylight time, too
  if (obj.dl && obj.dl.name) {
    str = obj.dl.name.toLowerCase()
    all[str] = all[str] || zone
  }
  if (obj.dl && obj.dl.abbrev) {
    str = obj.dl.abbr.toLowerCase()
    all[str] = all[str] || zone
  }
  // do aliases
  if (obj.aliases) {
    obj.aliases.forEach((s) => {
      all[s] = all[s] || zone
    })
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
    // console.log(k + '  |  ' + oldZones[k])
    // replace it
    all[k] = oldZones[k]
  }
  // remove any problematic keys
  // if (str.match(/[0-9]/)) {
  // delete str
  // console.log(str)
  // }
})
// console.log(Object.keys(all).length)
// console.log(all['south east asia'])

// console.log(Object.keys(all).filter((k) => typeof all[k] !== 'string'))

module.exports = all
