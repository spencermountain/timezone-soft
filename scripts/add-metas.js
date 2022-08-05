import metas from '../data/meta-zones.js'

import Africa from '../data/Africa.js'
import America from '../data/America.js'
import Antarctica from '../data/Antarctica.js'
import Asia from '../data/Asia.js'
import Atlantic from '../data/Atlantic.js'
import Australia from '../data/Australia.js'
import Etc from '../data/Etc.js'
import Europe from '../data/Europe.js'
import Indian from '../data/Indian.js'
import Pacific from '../data/Pacific.js'

let zones = Object.assign({},
  Africa,
  America,
  Antarctica,
  Asia,
  Atlantic,
  Australia,
  Etc,
  Europe,
  Indian,
  Pacific,
)

let all = {}
metas.forEach(o => {
  o.ids.forEach(id => {
    all[id] = o.name
  })
})

Object.keys(zones).forEach(k => {
  if (!all[k]) {
    console.log(k)
  }
})

// console.log(all)

// let out = {}
// // console.log(metas.length)
// metas.forEach(o => {
//   if (out[o.name]) {
//     // merge ids
//     out[o.name].ids = out[o.name].ids.concat(o.ids)
//     out[o.name].dst = out[o.name].dst || o.dst
//     out[o.name].long = out[o.name].long || o.long
//   }

//   out[o.name] = o
//   delete o.name
//   return o
// })

// console.log(JSON.stringify(out, null, 2))
// console.log(Object.keys(out).length)