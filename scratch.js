const soft = require('./src/index')
const spacetime = require('/Users/spencer/mountain/spacetime')
// let zones = spacetime().timezones

let iana = soft.find('ist')
const show = soft.display(iana)
console.log(show)

// const tzCodes = informal.display('Canada/Eastern')
// console.log(tzCodes)
