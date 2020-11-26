const informal = require('./src/index')
const spacetime = require('/Users/spencer/mountain/spacetime')
let zones = spacetime().timezones

// let display = informal.find('baoding')
// console.log(display)

// const tzCodes = informal.display('Pacific/Auckland')
// console.log(tzCodes)
// const data = require('/Users/spencer/mountain/spacetime-informal/data/01-iana')
// const data = require('/Users/spencer/mountain/spacetime-informal/data/02-byCity')
// const data = require('/Users/spencer/mountain/spacetime-informal/data/03-byCountry')
const data = require('/Users/spencer/mountain/spacetime-informal/data/04-oldZones')
let list = Object.keys(data)
// console.log(list)
list.forEach((str) => {
  let found = informal.find(str)
  if (!zones[found.toLowerCase()]) {
    console.log(str, '  -  ', found)
  } else {
    // console.log(informal.find(str))
    // console.log(str)
  }
})
