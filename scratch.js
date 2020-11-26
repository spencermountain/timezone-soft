const informal = require('./src/index')
const spacetime = require('/Users/spencer/mountain/spacetime')
let zones = spacetime().timezones

let display = informal.find('bermuda')
console.log(display)

// const tzCodes = informal.display('Pacific/Auckland')
// console.log(tzCodes)
