import tzs from '../test/zonefile.2022.js'

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
  America,
  // Antarctica,
  // Asia,
  // Atlantic,
  // Australia,
  // Etc,
  // Europe,
  // Indian,
  // Pacific,
)

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
