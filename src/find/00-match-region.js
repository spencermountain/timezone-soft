import { zones, canonicalize } from '../data/index.js'
import { normalizeCase } from './_lib/normalize.js'
import countryZones from '../_generated/region-countries.js'

const regions = {}
const ids = [...new Set(Object.keys(zones).map(canonicalize))].sort()
ids.forEach(id => {
  if (!Object.hasOwn(zones, id)) {
    return
  }
  const region = id.split('/')[0].toLowerCase()
  regions[region] = regions[region] || []
  regions[region].push(id)
})
Object.entries(countryZones).forEach(([region, extra]) => {
  regions[region] = [...new Set([...(regions[region] || []), ...extra.map(canonicalize)])]
    .filter(id => Object.hasOwn(zones, id)).sort()
})

const matchRegion = input => {
  const region = normalizeCase(input)
  return Object.hasOwn(regions, region) ? regions[region] : null
}

export default matchRegion
