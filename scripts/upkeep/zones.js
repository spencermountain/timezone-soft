/* eslint-disable no-console */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import normalizeName from './_lib.js'
import { aliases as misc } from '../../data/index.js'

const directory = new URL('../../data/zones/', import.meta.url)
const files = (await readdir(directory)).filter(file => file.endsWith('.json')).sort()

for (const file of files) {
  const path = new URL(file, directory)
  const zones = JSON.parse(await readFile(path, 'utf8'))
  Object.entries(zones).forEach(([id, zone]) => {
    // Full IANA identifiers already resolve through the identifier table.
    // Special-case spellings are stored separately and must not be folded here.
    const names = zone.names
      .filter(name => !misc[name]?.includes(id))
      .map(normalizeName)
      .filter(name => name && name !== id.toLowerCase())
    zone.names = [...new Set(names)].sort()
  })
  await writeFile(path, JSON.stringify(zones, null, 2) + '\n')
  console.log(`Updated ${file}`)
}
