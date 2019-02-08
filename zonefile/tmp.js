const prefixes = require('./_prefixes')
const iana = require('./iana')

let keys = Object.keys(iana).sort()
let result = keys.reduce((h, k) => {
  h[k] = iana[k].map((str) => {
    prefixes.forEach((country, i) => {
      str = str.replace(country, i + 1)
    })
    return str
  })
  return h;
}, {});

console.log(JSON.stringify(result, null, 2))
