// const informal = require('./src/index')

// http://cldr.unicode.org/

const keyVal = require('./src/display/metazones.js/index.js')
let obj = {}
Object.keys(keyVal).forEach(k => {
  let val = keyVal[k]
  obj[val] = obj[val] || []
  obj[val].push(k)
})
console.log(JSON.stringify(obj, null, 2))

// let str = `Europe/London`
// let str = `cest`
// let str = `cedt`
// let str = `eastern daylight time`
// let str = `utc+5`
// let str = `5hs`
// let str = -5
// let str = `india`
// let str = `indian`
// let str = `Eastern Time - US & Canada`
// let str = `CA`
// let str = `Central - NU (Resolute)`
// let str = `West Africa Time`
// let str = `japan`
// let str = `the South Sandwich Islands`

// console.log(informal.find('cest'))
// console.log(informal.find('Europe/London'))
// console.log(informal.find('south africa'))
