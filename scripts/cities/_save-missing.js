import { readFile, writeFile } from 'node:fs/promises'
import zones, { aliases } from '../../data/index.js'
import normalizeName from '../upkeep/_lib.js'

const directory = new URL('../../data/zones/', import.meta.url)

const saveMissing = async cities => {
  const regions = new Map()
  const skipped = []
  let added = 0

  cities.forEach(({ name, timezone }) => {
    const normalized = normalizeName(name)
    if (!Object.hasOwn(zones, timezone) || !normalized) {
      skipped.push(`${name}: missing zone record or empty normalized name (${timezone})`)
      return
    }
    // Upkeep keeps these spellings in misc rather than in the zone's names.
    if (aliases[name]?.includes(timezone) || aliases[normalized]?.includes(timezone) || normalized === timezone.toLowerCase()) {
      return
    }
    const region = timezone.split('/')[0]
    if (!regions.has(region)) {
      regions.set(region, [])
    }
    regions.get(region).push({ name: normalized, timezone })
  })

  for (const [region, names] of regions) {
    const path = new URL(`${region}.json`, directory)
    const data = JSON.parse(await readFile(path, 'utf8'))
    let changed = false
    names.forEach(({ name, timezone }) => {
      const zone = data[timezone]
      if (!zone) {
        skipped.push(`${name}: missing ${timezone} in ${region}.json`)
        return
      }
      if (!zone.names.includes(name)) {
        zone.names = [...new Set([...zone.names, name])].sort()
        added += 1
        changed = true
      }
    })
    if (changed) {
      await writeFile(path, JSON.stringify(data, null, 2) + '\n')
    }
  }
  return { added, skipped }
}

export default saveMissing
