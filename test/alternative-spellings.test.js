import test from 'tape'
import alternativeSpellings from '../src/find/_lib/get-alternatives.js'
import { matchAlternativeSpellings } from '../src/find/02-match-parts.js'
import { lexicon } from '../src/data/index.js'

test('alternative spellings preserve full-name preference', t => {
  const expected = ['trinidad and tobago', 'trinidad tobago', 'trinidad', 'tobago']
  t.deepEqual(alternativeSpellings('trinidad & tobago'), expected, 'requested order')
  t.deepEqual(alternativeSpellings('  Trinidad&Tobago  '), expected, 'case, spacing, and attached ampersand')
  t.deepEqual(alternativeSpellings('trinidad and tobago'), expected.slice(1), 'does not repeat the input')
  t.deepEqual(alternativeSpellings('andorra'), ['orra'], 'literal replacements may produce rough guesses')
  const words = alternativeSpellings('CST China')
  t.ok(words.includes('cst') && words.includes('china'), 'single words are available after literal spelling guesses')
  t.end()
})

test('spelling matching tries complete alternatives before individual parts', t => {
  const aliases = {
    'fixtureleft and fixtureright': ['Europe/London'],
    'fixtureleft fixtureright': ['Asia/Tokyo'],
    fixtureleft: ['America/New_York'],
    fixtureright: ['Europe/Paris']
  }
  const previous = new Map(Object.keys(aliases).map(name => [name, lexicon[name]]))
  Object.assign(lexicon, aliases)
  try {
    t.deepEqual(matchAlternativeSpellings('fixtureleft & fixtureright'), ['Europe/London'], 'and spelling wins')
    delete lexicon['fixtureleft and fixtureright']
    t.deepEqual(matchAlternativeSpellings('fixtureleft & fixtureright'), ['Asia/Tokyo'], 'combined spelling is next')
    delete lexicon['fixtureleft fixtureright']
    t.deepEqual(matchAlternativeSpellings('fixtureleft & fixtureright'), ['America/New_York'], 'left part precedes right')
  } finally {
    previous.forEach((value, name) => {
      if (value === undefined) {
        delete lexicon[name]
      } else {
        lexicon[name] = value
      }
    })
  }
  t.end()
})
