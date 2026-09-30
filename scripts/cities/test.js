import { readFileSync } from 'node:fs'
import test from 'tape'
import soft from '../../src/index.js'
import identifiers from '../../data/iana-identifiers.js'
import { columns, csvPath, byPopulation, parseRow } from './_lib.js'

// Usage: node scripts/cities/test.js 1000
const limit = Number(process.argv[2] || 100)
if (!Number.isSafeInteger(limit) || limit < 1) {
  throw new Error('Row limit must be a positive integer')
}
const lines = readFileSync(csvPath, 'utf8').trimEnd().split(/\r?\n/)
const header = parseRow(lines.shift())
if (header.join('\t') !== columns.join('\t')) {
  throw new Error('Unexpected CSV header; run node scripts/cities/_update.js')
}
const rows = lines.map(line => {
  const fields = parseRow(line)
  if (fields.length !== columns.length) {
    throw new Error('Unexpected CSV column count')
  }
  return Object.fromEntries(columns.map((column, i) => [column, fields[i]]))
}).sort(byPopulation)

test(`city coverage: largest ${limit} cities`, t => {
  const count = Math.min(limit, rows.length)
  let correct = 0
  t.ok(count > 0, 'city dataset is non-empty')
  for (let i = 0; i < count; i += 1) {
    const city = rows[i]
    const expected = identifiers[city.timezone] || city.timezone
    const found = soft(city.name).map(zone => zone.iana)
    const matches = found.includes(expected)
    if (matches) {
      correct += 1
    }
    t.ok(matches, `#${i + 1} ${city.name} (${city.country_code}, ${city.population}) — expected ${expected}; returned ${found.join(', ') || 'no match'}`)
  }
  t.comment(`${correct}/${count} correct (${(100 * correct / count).toFixed(2)}%); ${rows.length} cities available`)
  t.end()
})
