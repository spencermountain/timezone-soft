const informal = require('./src/index')

// http://cldr.unicode.org/

// let str = `utc+5` //Etc/GMT-5

// console.log(informal.display('manaus'))
// console.log(informal.find('south africa'))

const spacetime = require('/Users/spencer/mountain/spacetime')

let display = informal.find('NZST')
console.log(display)
