import test from 'tape'
import { lexicon } from '../../src/data/index.js'

// Allow accents, ordinary place-name punctuation, and timezone separators.
const aliasCharacters = /^[\p{L}\p{M}\p{N} .,'’()&/+_\-]+$/u
const identifier = /^[A-Za-z][A-Za-z0-9_+\-]*(?:\/[A-Za-z0-9_+\-]+)+$/

test('lexicon aliases and IDs contain clean, non-empty strings', t => {
  const entries = Object.entries(lexicon)
  t.ok(entries.length > 0, 'lexicon is non-empty')
  entries.forEach(([alias, ids]) => {
    t.ok(alias.trim().length > 0, 'alias is non-empty')
    t.equal(alias, alias.trim(), `${alias} has no surrounding whitespace`)
    t.notOk(/\s{2,}/u.test(alias), `${alias} has no repeated whitespace`)
    t.ok(/[\p{L}\p{N}]/u.test(alias), `${alias} contains letters or numbers`)
    t.ok(aliasCharacters.test(alias), `${alias} contains only place-name punctuation`)
    t.ok(Array.isArray(ids) && ids.length > 0, `${alias} has a non-empty ID array`)
    if (!Array.isArray(ids)) {
      return
    }
    ids.forEach(id => {
      t.equal(typeof id, 'string', `${alias} has a string ID`)
      t.ok(typeof id === 'string' && identifier.test(id), `${alias}: ${id} has IANA ID syntax`)
    })
  })
  t.end()
})
