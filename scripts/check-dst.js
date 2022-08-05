import metas from '../src/display/metas.js'
// import { zones } from '../src/data/index.js'

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
Object.keys(zones).forEach(k => {
  let meta = zones[k].meta
  if (zones[k].offset !== metas[meta].std[1]) {
    console.log(k, meta)
    console.log(zones[k].offset, metas[meta].std[1])
    // console.log(zones[k], metas[meta])
  }
})
