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
  // Africa,
  // America,
  // Antarctica,
  // Asia,
  // Atlantic,
  // Australia,
  // Etc,
  // Europe,
  // Indian,
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
    process.exit()
  }
  zones[k].meta = all[k]
})

console.log(JSON.stringify(zones, null, 2))
