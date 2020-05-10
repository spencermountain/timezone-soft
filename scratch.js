const informal = require('./src/index')
const spacetime = require('/Users/spencer/mountain/spacetime')

let display = informal.find('NZST')
console.log(display)

const tzCodes = informal.display('Pacific/Auckland')
console.log(tzCodes)
