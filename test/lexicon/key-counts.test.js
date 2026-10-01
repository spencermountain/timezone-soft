import test from 'tape'
import { lexicon, zones } from '../../src/data/index.js'

const limits = { min: 2, max: 500 }
// Fixed offsets are parsed directly instead of storing aliases.
const offsetLimits = { min: 0, max: 0 }

test('every timezone has a bounded number of lexicon keys', (t) => {
  const counts = Object.fromEntries(Object.keys(zones).map((id) => [id, 0]))
  t.ok(Object.keys(counts).length > 0, 'timezones are non-empty')
  Object.values(lexicon).forEach((ids) => {
    // A key counts once per timezone, even if its ID is repeated.
    new Set(ids).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1
    })
  })

  Object.entries(counts).forEach(([id, count]) => {
    const { min, max } = /^Etc\/GMT[+-]\d+$/.test(id) ? offsetLimits : limits
    t.ok(count >= min, `${id}: ${count} keys (minimum ${min})`)
    t.ok(count <= max, `${id}: ${count} keys (maximum ${max})`)
  })
  t.end()
})
