const informal = require('./src/index')

// http://cldr.unicode.org/

// let str = `utc+5` //Etc/GMT-5

// console.log(informal.display('manaus'))
// console.log(informal.find('south africa'))

const spacetime = require('/Users/spencer/mountain/spacetime')

let display = informal.display('montreal, canada')
let s = spacetime.now(display.iana)
let abbrev = s.isDST() ? display.daylight.abbrev : display.standard.abbrev
let time = `${s.time()} ${abbrev}`
// '4:13pm EDT'
