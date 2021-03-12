const meta = require('./meta') //149
const aliases = require('../aliases') //149
// const cldr = require('./cldr') //138
const zones = require('spacetime').timezones()
const unique = function (arr) {
  let obj = {}
  for (let i = 0; i < arr.length; i += 1) {
    obj[arr[i]] = true
  }
  return Object.keys(obj)
}

// 14 need to be split
let problems = [
  // 'Western European Time',
  // 'Central European Time',
  // 'Central Africa Time',
  // 'Eastern European Time',
  // 'Central Australia Time',
  // 'Eastern Australia Time',
  // 'Hawaii-Aleutian Time',
  // 'Mountain Time',
  // 'Mexican Pacific Time',
  // 'Eastern Time',
  // 'Atlantic Time',
  // 'Amazon Time',
  // 'Chile Time',
  // 'Central Time'
]
// const topk = function (arr) {
//   let obj = {}
//   arr.forEach((a) => {
//     obj[a] = obj[a] || 0
//     obj[a] += 1
//   })
//   let res = Object.keys(obj).map((k) => [k, obj[k]])
//   return res.sort((a, b) => (a[1] > b[1] ? -1 : 0))
// }
// let prob = problems.shift()
// let obj = meta.find((o) => o.name === prob)
// let arr = []
// console.log(obj.name, '\n')
// obj.ids.forEach((id) => {
//   let dst = (zones[id.toLowerCase()] || {}).dst
//   arr.push(dst)
//   console.log(id, dst)
// })
// console.log(topk(arr))
// console.log('')

let arrs = []
meta.forEach((obj) => {
  let arr = obj.ids.map((id) => {
    return (zones[id.toLowerCase()] || {}).dst
  })
  arr = unique(arr)
  if (arr.length > 1) {
    arrs.push(obj.name)
    // console.log(arr)
  }
})
console.log(arrs)
