import test from 'tape'
import { pack, unpack } from 'efrt'
import expanded from '../scripts/build/00-expand.js'
import packed, { shared } from '../src/_generated/zones.js'
import { zones } from '../src/data/index.js'

const options = { strict: false, direction: 'auto', dictionary: true }

test('shared alias packing preserves complete zone names and ranking counts', t => {
  t.ok(Object.keys(shared).length > 0, 'shared lists are generated')
  Object.entries(expanded).forEach(([id, zone]) => {
    const [region, ...parts] = id.split('/')
    const [words, meta] = packed[region][parts.join('/')]
    const names = [...Object.keys(unpack(words)), ...Object.keys(unpack(shared[meta] || ''))]
    // Compare with the previous whole-zone packing, including efrt normalization.
    const expected = Object.keys(unpack(pack(zone.names, options))).sort()
    t.deepEqual(names.sort(), expected, `${id}: aliases survive packing without duplicates`)
    t.equal(zones[id].wordCount, expected.length, `${id}: ranking counts include shared aliases`)
  })
  t.end()
})
