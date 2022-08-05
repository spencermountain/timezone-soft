import iana from './01-iana.js'
import byCity from './02-byCity.js'
import byCountry from './03-byCountry.js'
import byState from './04-byState.js'
import oldZones from './05-oldZones.js'
import metazones from './metazone/index.js'
// const metazones = require('./05-metazones.js')
import abbreviations from './06-abbreviations.js'
import parentheses from './07-parentheses.js'

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
// console.log(all['mexico/bajasur'])
// console.log(Object.keys(all).filter((k) => typeof all[k] !== 'string'))

export default all
console.log(Object.keys(all).length)