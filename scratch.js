const informal = require('./src/index')
const spacetime = require('/Users/spencer/mountain/spacetime')
// let zones = spacetime().timezones

let iana = informal.find('5gmt')
const show = informal.display(iana)
console.log(show)

// const tzCodes = informal.display('Canada/Eastern')
// console.log(tzCodes)
