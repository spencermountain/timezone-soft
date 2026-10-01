import test from 'tape'
import alternativeSpellings from '../src/find/_lib/get-alternatives.js'
import soft from './_lib.js'

test('formal names expand into bounded, ordered spelling alternatives', t => {
  t.ok(alternativeSpellings('st. lucia').includes('saint lucia'), 'st expands to saint')
  t.ok(alternativeSpellings('saint lucia').includes('st lucia'), 'saint contracts to st')
  const candidates = alternativeSpellings('democratic republic of the congo')
  t.ok(candidates.includes('republic of the congo'), 'individual descriptive words can be removed')
  t.ok(candidates.includes('congo'), 'all descriptive words can be removed')
  t.notOk(candidates.includes('of'), 'filler words are not standalone candidates')
  t.equal(candidates.length, new Set(candidates).size, 'candidates are unique')
  t.ok(alternativeSpellings('st democratic republic of the federal kingdom of saint example & place').length <= 96, 'expansion is bounded')
  t.deepEqual(soft('st. lucia').map(zone => zone.iana), soft('saint lucia').map(zone => zone.iana), 'public spelling variants agree')
  const narrowed = soft('CST China').map(zone => zone.iana)
  t.equal(narrowed[0], 'Asia/Shanghai', 'qualifiers preserve the preferred result')
  t.ok(narrowed.length < soft('CST').length, 'qualifiers still narrow before single-word guesses')
  t.end()
})
