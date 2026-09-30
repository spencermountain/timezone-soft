/* eslint-disable no-console */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import soft from '../src/index.js'
import identifiers from '../data/iana-identifiers.js'

const input = resolve(process.argv[2] || 'tmp/geonames-all-cities-with-a-population-1000.json')
const output = resolve(process.argv[3] || 'tmp/city-coverage')
const source = readFileSync(input)
const cities = JSON.parse(source).sort((a, b) => Number(b.population) - Number(a.population) || String(a.geoname_id).localeCompare(String(b.geoname_id)))
const cache = new Map()
const lookup = name => {
  if (!name || typeof name !== 'string') {return []}
  if (!cache.has(name)) {cache.set(name, soft(name).map(zone => zone.iana))}
  return cache.get(name)
}
const results = cities.map((city, index) => {
  const expected = identifiers[city.timezone]
  const found = lookup(city.name)
  let status = 'unrecognized'
  if (!expected) {status = 'unknown-reference'}
  else if (found[0] === expected) {status = 'preferred'}
  else if (found.includes(expected)) {status = 'candidate'}
  else if (found.length) {status = 'wrong-zone'}
  const ascii = lookup(city.ascii_name)
  // Alternate names are diagnostic only: some are broad labels or abbreviations.
  let alternateMatch = ''
  if (expected && !found.includes(expected)) {
    alternateMatch = (city.alternate_names || []).find(name => lookup(name).includes(expected)) || ''
  }
  return {
    rank: index + 1,
    geoname_id: city.geoname_id,
    name: city.name,
    country: city.country_code,
    population: Number(city.population),
    feature_code: city.feature_code,
    reference_timezone: city.timezone,
    canonical_timezone: expected || '',
    status,
    candidates: found.join('|'),
    ascii_name: city.ascii_name,
    ascii_correct: Boolean(expected && ascii.includes(expected)),
    alternate_match: alternateMatch
  }
})

const summarize = rows => {
  const counts = { total: rows.length, preferred: 0, candidate: 0, 'wrong-zone': 0, unrecognized: 0, 'unknown-reference': 0 }
  for (const row of rows) {counts[row.status] += 1}
  counts.correct = counts.preferred + counts.candidate
  counts.correct_percent = rows.length ? Number((100 * counts.correct / rows.length).toFixed(2)) : 0
  counts.primary_or_ascii_correct = rows.filter(row => ['preferred', 'candidate'].includes(row.status) || row.ascii_correct).length
  counts.primary_ascii_or_alternate_correct = rows.filter(row => ['preferred', 'candidate'].includes(row.status) || row.ascii_correct || row.alternate_match).length
  return counts
}
const missed = results.filter(row => !['preferred', 'candidate'].includes(row.status))
const bands = [[10000000, Infinity], [5000000, 10000000], [1000000, 5000000], [500000, 1000000],
  [300000, 500000], [200000, 300000], [150000, 200000], [100000, 150000],
  [50000, 100000], [10000, 50000], [1000, 10000], [0, 1000]]
const report = {
  library_version: soft.version,
  input,
  sha256: createHash('sha256').update(source).digest('hex'),
  method: 'Query each primary city name independently; compare every returned zone with the canonicalized GeoNames timezone. ASCII and alternate-name recovery are reported separately. Rows are not deduplicated or restricted by feature code.',
  total: summarize(results),
  top: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000].map(limit => ({ limit, ...summarize(results.slice(0, limit)) })),
  population_bands: bands.map(([minimum, maximum]) => ({ minimum, maximum: maximum === Infinity ? null : maximum,
    ...summarize(results.filter(row => row.population >= minimum && row.population < maximum)) })),
  largest_misses: missed.slice(0, 50),
  largest_wrong_zones: results.filter(row => row.status === 'wrong-zone').slice(0, 25),
  first_nonpreferred: results.find(row => row.status !== 'preferred'),
  first_miss: missed[0]
}
mkdirSync(output, { recursive: true })
const csv = rows => {
  const fields = Object.keys(results[0])
  const quote = value => '"' + String(value ?? '').replace(/"/g, '""') + '"'
  return [fields.join(','), ...rows.map(row => fields.map(field => quote(row[field])).join(','))].join('\n') + '\n'
}
writeFileSync(join(output, 'all-cities.csv'), csv(results))
writeFileSync(join(output, 'unsupported-cities.csv'), csv(missed))
writeFileSync(join(output, 'summary.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ output, total: report.total, top: report.top, population_bands: report.population_bands, largest_misses: missed.slice(0, 15), largest_wrong_zones: report.largest_wrong_zones.slice(0, 5) }, null, 2))
