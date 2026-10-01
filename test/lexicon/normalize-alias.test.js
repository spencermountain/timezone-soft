import test from 'tape'
import { normalizeAlias } from '../../src/find/_lib/normalize.js'

test('alias normalization removes redundant words and punctuation', t => {
  const cases = [
    ['  New_York City  ', 'new york'],
    ['Québec city time', 'quebec'],
    ['St. John’s', 'st johns'],
    ['Port-au-Prince', 'port au prince'],
    ['Ho Chi Minh City', 'ho chi minh'],
    ['Electricity', 'electricity'],
    ['Asia/Ust-Nera', 'asia/ust-nera'],
    ['Etc/GMT+5', 'etc/gmt+5'],
    ['UTC-5', 'utc-5'],
    ['time city', '']
  ]
  cases.forEach(([input, expected]) => {
    t.equal(normalizeAlias(input), expected, input)
    t.equal(normalizeAlias(expected), expected, `${input} is stable`)
  })
  t.end()
})
