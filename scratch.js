const informal = require('./src/index')

// http://cldr.unicode.org/

// let str = `utc+5`
// let str = `5hs`
// let str = -5

// let str = `Eastern Time - US & Canada`
// let str = `Central - NU (Resolute)`
// let str = `the South Sandwich Islands`
let str = 'indian'

console.log(informal.find(str))
// console.log(informal.find('Europe/London'))
// console.log(informal.find('south africa'))
