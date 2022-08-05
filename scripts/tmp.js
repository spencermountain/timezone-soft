import metas from '../data/meta-zones.js'


let out = {}
// console.log(metas.length)
metas.forEach(o => {
  if (out[o.name]) {
    // merge ids
    // out[o.name].ids = out[o.name].ids.concat(o.ids)
    out[o.name].dst = out[o.name].dst || o.dst
    out[o.name].long = out[o.name].long || o.long
  } else {
    out[o.name] = o
    delete o.name
    delete o.ids
  }
})

console.log(JSON.stringify(out, null, 2))
// console.log(Object.keys(out).length)