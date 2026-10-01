import test from 'tape'
import soft from '../_lib.js'
import { lexicon } from '../../src/data/index.js'

test('lexicon returns timezone IDs accepted by Temporal', t => {
  const temporal = globalThis.Temporal
  t.ok(temporal, 'Temporal is available (Node 24 needs --harmony-temporal)')
  if (!temporal) {
    t.end()
    return
  }

  const ids = new Set()
  Object.keys(lexicon).forEach(alias => {
    const results = soft(alias)
    t.ok(results.length > 0, `${alias} resolves`)
    results.forEach(result => {
      t.equal(typeof result.iana, 'string', `${alias} returns a string ID`)
      ids.add(result.iana)
    })
  })

  ids.forEach(id => {
    // Temporal accepts IANA aliases and Etc zones omitted by Intl's timezone list.
    t.doesNotThrow(() => new temporal.ZonedDateTime(0n, id), `${id} exists in Temporal`)
  })
  t.end()
})
