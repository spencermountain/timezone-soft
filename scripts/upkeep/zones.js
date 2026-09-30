/* eslint-disable no-console */
import { readdir, writeFile } from 'node:fs/promises'

const directory = new URL('../../data/zones/', import.meta.url)
const files = (await readdir(directory)).filter(file => file.endsWith('.js')).sort()

for (const file of files) {
  const path = new URL(file, directory)
  const { default: zones } = await import(path.href)
  Object.values(zones).forEach(zone => {
    zone.names = [...new Set(zone.names)].sort()
  })
  await writeFile(path, `export default ${JSON.stringify(zones, null, 2)}\n`)
  console.log(`Updated ${file}`)
}
