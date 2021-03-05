const soft = require('./src/index')
const spacetime = require('/Users/spencer/mountain/spacetime')
// let zones = spacetime().timezones

let id = soft.find('milwaukee')
console.log(id)

// let iana = soft.find('ist')
const show = soft.display(id)
console.log(show)

// const tzCodes = informal.display('Canada/Eastern')
// console.log(tzCodes)
