/* eslint-disable no-console */
import metas from '../data/metas.js'
// import { zones } from '../src/data/index.js'

import zones from '../data/index.js'
Object.keys(zones).forEach(k => {
  let meta = zones[k].meta
  if (zones[k].offset !== metas[meta].std[1]) {
    console.log(k, meta)
    console.log(zones[k].offset, metas[meta].std[1])
    // console.log(zones[k], metas[meta])
  }
})
