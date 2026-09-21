import test from 'tape'
import { validateData } from '../scripts/lib/validate-data.js'

const fixture = () => ({
  zones: { 'Test/Zone': { meta: 'Test', hem: 'n', offset: 0, names: ['test'], dst: 'test' } },
  metas: { Test: { std: ['TST', 0] } },
  patterns: { test: 'last-sun-mar-1h|last-sun-oct-2h' },
  aliases: { example: ['Test/Zone'] }
})

test('data validation rejects broken references and malformed records', t => {
  t.equal(validateData(fixture()), 1, 'valid fixture')
  const cases = [
    [d => { d.zones['Test/Zone'].meta = 'Missing' }, /unknown metazone/],
    [d => { d.zones['Test/Zone'].dst = 'Missing' }, /unknown DST/],
    [d => { d.aliases.example = ['Test/Missing'] }, /unknown zone/],
    [d => { d.zones['Test/Zone'].names = [''] }, /names must/],
    [d => { d.metas.Test.std[1] = '0' }, /expected \[abbreviation/],
    [d => { d.patterns.test = 'tomorrow' }, /transition rules/],
    [d => { d.zones['Test/Zone'].hem = 'x' }, /hemisphere/]
  ]
  for (const [mutate, expected] of cases) {
    const data = fixture()
    mutate(data)
    t.throws(() => validateData(data), expected)
  }
  t.end()
})
