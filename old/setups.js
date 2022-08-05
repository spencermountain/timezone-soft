import byCities from './02-byCity.js'
let byCity = Object.entries(byCities).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

import three from './three-code.js'

import byCountries from './03-byCountry.js'
let byCountry = Object.entries(byCountries).reduce((h, a) => {
  let [name, obj] = a
  let id = obj.choice
  h[id] = [name, obj.code, three[obj.code.toUpperCase()].toLowerCase()]
  return h
}, {})

import byStates from './04-byState.js'
let byState = Object.entries(byStates).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

import oldZones from './05-oldZones.js'
let oldZone = Object.entries(oldZones).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

import parentheses from './07-parentheses.js'
let parenthesis = Object.entries(parentheses).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

import links from './links.js'
let link = Object.entries(links).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

import aliases from './aliases.js'
let alias = Object.entries(aliases).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

import metas from './metazone/index.js'
let meta = metas.reduce((h, o) => {
  o.ids.forEach(id => {
    h[id] = h[id] || []
    h[id].push(o.name)
    h[id].push(o.abbr)
    h[id] = h[id].concat(o.aliases)
    if (o.std) {
      h[id].push(o.std.name)
      h[id].push(o.std.abbr)
    }
    if (o.long) {
      h[id].push(o.long.replace(/\(.*\)/, ''))
    }
  })
  return h
}, {})
console.log(meta)

export { byCity, byCountry, byState, oldZone, parenthesis, link, alias, meta }