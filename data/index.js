import { readdirSync, readFileSync } from 'node:fs'

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const directory = new URL('./zones/', import.meta.url)
const files = readdirSync(directory).filter(file => file.endsWith('.json')).sort()
const zones = {}

files.forEach(file => {
  const region = read(`./zones/${file}`)
  Object.entries(region).forEach(([id, record]) => {
    if (Object.hasOwn(zones, id)) {
      throw new Error(`Duplicate zone record: ${id}`)
    }
    zones[id] = record
  })
})

const aliases = read('./aliases.json')
const patterns = read('./dst-patterns.json')
const identifiers = read('./iana-identifiers.json')
const metas = read('./metas.json')
const countries = read('./countries.json')

export { aliases, patterns, identifiers, metas, countries }
export default zones
