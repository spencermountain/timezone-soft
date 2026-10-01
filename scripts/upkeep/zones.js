/* eslint-disable no-console */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import normalizeName from './_lib.js'
import { aliases as misc, identifiers } from '../../data/index.js'

const directory = new URL('../../data/zones/', import.meta.url)
const files = (await readdir(directory)).filter(file => file.endsWith('.json')).sort()
// Slash IDs resolve directly; bare aliases such as "Cuba" still need names.
const timezoneIds = new Set(Object.keys(identifiers).filter(id => id.includes('/')).map(id => id.toLowerCase()))

for (const file of files) {
  const path = new URL(file, directory)
  const zones = JSON.parse(await readFile(path, 'utf8'))
  Object.entries(zones).forEach(([id, zone]) => {
    const basename = normalizeName(id.split('/').pop())
    // Full IANA identifiers already resolve through the identifier table.
    // Special-case spellings are stored separately and must not be folded here.
    const names = zone.names
      .filter(name => !misc[name]?.includes(id))
      .map(normalizeName)
      .filter(name => name && !timezoneIds.has(name) && name !== basename)
    zone.names = [...new Set(names)].sort()
  })
  await writeFile(path, JSON.stringify(zones, null, 2) + '\n')
  console.log(`Updated ${file}`)
}
