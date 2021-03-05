const timezoneSoft = require('./src/index')
const spacetime = require('spacetime')
let zones = spacetime.timezones()
const arr = require('/Users/spencer/mountain/timezone-soft/data/05-metazones.js')

arr.forEach((a) => {
  let found = zones[a.ids[0].toLowerCase()]
  if (found.offset !== a.offset) {
    console.log(found.offset + '     -   ' + a.ids[0])
  }
  // console.log(found)
})

// let ids = timezoneSoft('5h')
// console.log(ids)
