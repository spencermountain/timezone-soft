// const informal = require('./src/index')

// https://github.com/tzinfo/tzinfo/blob/50839800a09aa51b29895c3e6b1869c5fced8be7/test/tzinfo-data1/tzinfo/data/indexes/countries.rb
const fs = require('fs')
let countries = {}
const tmp = require('./tmp')
Object.keys(tmp).forEach(k => {
  let obj = tmp[k]
  // countries[]
  let c = tmp[k].country
  if (!c) {
    console.log(tmp[k])
  }
})
console.log(JSON.stringify(countries, null, 2))
// fs.writeFileSync('./countries.js', JSON.stringify(countries, null, 2))

// const fs = require('fs')
// let obj = {}
// const tmp = require('./tmp')
// Object.keys(tmp).forEach(k => {
//   if (tmp[k].zones.length === 1) {
//     let id = tmp[k].zones[0][0]
//     obj[id] = {
//       countryCode: k,
//       country: tmp[k].name
//     }
//     if (tmp[k].zones[0][5]) {
//       obj[id].desc = [tmp[k].zones[0][5]]
//     }
//   } else {
//     tmp[k].zones.forEach(arr => {
//       let id = arr[0]
//       // console.log(arr[5])
//       obj[id] = {
//         desc: [arr[5]]
//       }
//     })
//   }
// })

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
