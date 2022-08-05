import byCities from '../data/02-byCity.js'
let byCity = Object.entries(byCities).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

import three from '../data/three-code.js'

import byCountries from '../data/03-byCountry.js'
let byCountry = Object.entries(byCountries).reduce((h, a) => {
  let [name, obj] = a
  let id = obj.choice
  h[id] = [name, obj.code, three[obj.code.toUpperCase()].toLowerCase()]
  return h
}, {})

import byStates from '../data/04-byState.js'
let byState = Object.entries(byStates).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

import oldZones from '../data/05-oldZones.js'
let oldZone = Object.entries(oldZones).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})


export { byCity, byCountry, byState, oldZone }