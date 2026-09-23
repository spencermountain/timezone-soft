import test from 'tape'
import soft from './_lib.js'

import list from './fixtures/intl-timezones-2022-08.js'


test('support all results of Intl api', (t) => {
  list.forEach((str) => {
    const found = soft(str)
    t.ok(found.length > 0, str + ' -> ' + JSON.stringify(found, null, 2))
  })
  t.end()
})