import test from 'tape'
import { readFileSync } from 'node:fs'
import soft from './_lib.js'

test('public input contract and version', t => {
  for (const value of [null, undefined, 5, {}, [], true]) {
    t.throws(() => soft(value), { name: 'TypeError', message: 'timezone-soft expects a string' }, 'clear invalid-input error')
  }
  t.deepEqual(soft(''), [], 'empty string has no match')
  t.deepEqual(soft('not a timezone'), [], 'unknown string has no match')
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  t.equal(soft.version, pkg.version, 'public version matches manifest')
  t.equal(soft.prototype.version, soft.version, 'legacy version remains available')
  t.end()
})

test('ambiguous match ranking remains stable', t => {
  const expected = JSON.parse(readFileSync(new URL('./fixtures/ambiguous-ranking.json', import.meta.url), 'utf8'))
  for (const [input, ids] of Object.entries(expected)) {
    t.deepEqual(soft(input).map(z => z.iana), ids, input)
    t.deepEqual(soft(input.toLowerCase()).map(z => z.iana), ids, `${input} case-insensitive`)
  }
  t.end()
})
