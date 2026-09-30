import test from 'tape'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import identifiers from '../data/iana-identifiers.js'
import { serializeIdentifiers } from './_lib/serialize-identifiers.js'

test('compact IANA catalog preserves the pinned 2026d mappings', t => {
  const entries = Object.keys(identifiers).sort().map(id => [id, identifiers[id]])
  t.equal(entries.length, 597, 'all canonical IDs and aliases are retained')
  // Digest of the original uncompressed catalog, independent of insertion order.
  t.equal(createHash('sha256').update(JSON.stringify(entries)).digest('hex'), '304de5348c5f1666d1684b7a760c36ec24e2d50207dca44e24546173710ec2b7', 'every mapping matches the original catalog')
  const generated = readFileSync(new URL('../data/iana-identifiers.js', import.meta.url), 'utf8')
  t.ok(generated.endsWith(serializeIdentifiers(identifiers)), 'importer output is reproducible')
  t.end()
})

test('identifier serialization preserves alias directories and bare names', async t => {
  const expected = {
    'America/Argentina/Buenos_Aires': 'America/Argentina/Buenos_Aires',
    'America/Argentina/Example': 'America/Argentina/Buenos_Aires',
    'America/Buenos_Aires': 'America/Argentina/Buenos_Aires',
    'Etc/UTC': 'Etc/UTC',
    'Etc/Universal': 'Etc/UTC',
    UTC: 'Etc/UTC',
    'Other/Universal': 'Etc/UTC',
    Bare: 'Bare',
    Alias: 'Bare'
  }
  const source = serializeIdentifiers(expected)
  const { default: actual } = await import(`data:text/javascript,${encodeURIComponent(source)}`)
  t.deepEqual(actual, expected, 'same-directory, cross-directory, nested, and bare aliases round-trip')
  t.equal(serializeIdentifiers(Object.fromEntries(Object.entries(expected).reverse())), source, 'input order does not affect generated output')
  t.throws(() => serializeIdentifiers({ Alias: 'Missing' }), /Missing canonical identifier/, 'reject missing canonical IDs')
  t.end()
})
