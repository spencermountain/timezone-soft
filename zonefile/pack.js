//turn our timezone data into a small-as-possible string
const fs = require('fs')
const iana = require('./iana')
const prefixes = require('./_prefixes.js')
let all = {}

//pack iana data into a [o|h] object
Object.keys(iana).forEach((k) => {
  let o = iana[k]
  let key = o.offset
  if (o.dst) {
    key += '|' + o.dst
  }
  all[key] = all[key] || []
  let name = k.replace(/(.*?)\//, function(a, prefix) {
    let index = prefixes.indexOf(prefix)
    if (index !== -1) {
      return index + '/'
    }
    return a
  })
  all[key].push(name)
})

let keys = Object.keys(all)
keys = keys.sort((a, b) => a < b ? 1 : -1)
let result = {}
keys.forEach((k) => {
  result[k] = all[k].join(',')
})

// console.log(result)
fs.writeFileSync('./zonefile/_build.json', JSON.stringify(result, null, 2))
