const soft = require('./src/index')
const spacetime = require('spacetime')
let zones = spacetime.timezones()
// const arr = require('/Users/spencer/mountain/timezone-soft/data/05-metazones.js')

let ids = soft('indian')
console.log(ids)

// let res = {}
// Object.keys(zones).map((k) => {
//   let num = zones[k].offset
//   if (num > 0) {
//     num = '+' + num
//   } else {
//     num = String(num)
//   }
//   if (zones[k].dst) {
//     let num2 = zones[k].offset - 1
//     if (num2 > 0) {
//       num2 = '+' + num2
//     } else {
//       num2 = String(num2)
//     }
//     num += '/' + num2
//   }
//   res[k] = num
// })

// // console.log(Object.keys(res).length)
// arr.forEach((obj) => {
//   obj.ids.forEach((id) => {
//     delete res[id.toLowerCase()]
//   })
// })
// console.log(Object.keys(res).length)
// console.log(arr)
// console.log(res)
