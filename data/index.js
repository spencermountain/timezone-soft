import Africa from './zones/Africa.js'
import America from './zones/America.js'
import Antarctica from './zones/Antarctica.js'
import Asia from './zones/Asia.js'
import Atlantic from './zones/Atlantic.js'
import Australia from './zones/Australia.js'
import Etc from './zones/Etc.js'
import Europe from './zones/Europe.js'
import Indian from './zones/Indian.js'
import Pacific from './zones/Pacific.js'

const regions = [
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
]
const zones = {}
for (const region of regions) {
  for (const [id, record] of Object.entries(region)) {
    if (Object.hasOwn(zones, id)) throw new Error(`Duplicate zone record: ${id}`)
    zones[id] = record
  }
}
export default zones
