import byCities from '../data/02-byCity.js'
let byCity = Object.entries(byCities).reduce((h, a) => {
  h[a[1]] = h[a[1]] || []
  h[a[1]].push(a[0])
  return h
}, {})

export { byCity }