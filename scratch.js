const timezoneSoft = require('./src/index')
const spacetime = require('spacetime')
let zones = spacetime.timezones()
const arr = require('/Users/spencer/mountain/timezone-soft/data/05-metazones.js')

let ids = timezoneSoft('belfast')
console.log(ids)
