const iana = require('./01-iana')
const byCity = require('./02-byCity')
const byCountry = require('./03-byCountry')
const oldZones = require('./04-oldZones')

let all = Object.assign({}, iana, byCity, oldZones)

//add country info
Object.keys(byCountry).forEach(key => {
  //add country name
  all[key] = byCountry[key].choice
  //add 2-letter country code
  all[byCountry[key].code] = byCountry[key].choice
})

console.log(all)
console.log(Object.keys(all).length)

module.exports = all
