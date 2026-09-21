/* eslint-disable no-console */
import tzs from '../test/fixtures/spacetime-zones-2022.js'

import zones from '../data/index.js'

Object.keys(zones).forEach(k => {
  let smol = k.toLowerCase()
  if (!tzs[smol]) {
    console.log(smol)
    return
  }
  if (zones[k].offset !== tzs[smol].offset) {
    console.log(zones[k].offset, tzs[smol].offset)
  }
})

// console.log(JSON.stringify(zones, null, 2))
