import test from 'tape'
import soft from './_lib.js'

test('reserved UTC and GMT names survive phrase normalization', t => {
  for (const input of ['UTC time', 'Zulu Time', ' in UTC standard time ', 'zulu\ttime',
    'universal daylight time', 'coordinated universal time', 'coordinated universal time (UTC)']) {
    t.deepEqual(soft(input), soft('UTC'), input)
  }
  t.deepEqual(soft('GMT standard time'), soft('GMT'), 'GMT remains GMT')
  t.deepEqual(soft('Fake/UTC time'), [], 'normalization never guesses explicit IDs')
  t.end()
})

test('diacritic fallback preserves exact matches and explicit identifiers', t => {
  for (const [input, plain] of [['são paulo', 'sao paulo'], ['São Paulo time', 'sao paulo'],
    ['Sa\u0303o Paulo', 'sao paulo'], ['Bogotá', 'bogota'], ['Montréal', 'montreal'],
    ['réunion', 'reunion'], ['ciudad juárez', 'ciudad juarez']]) {
    t.deepEqual(soft(input), soft(plain), input)
    t.ok(soft(input).length > 0, `${input} resolves`)
  }
  t.equal(soft('ciudad juárez')[0]?.iana, 'America/Ciudad_Juarez', 'curated accented spelling wins')
  t.deepEqual(soft('America/São_Paulo'), [], 'explicit IANA IDs are not accent-folded')
  t.deepEqual(soft('nót a timezone'), [], 'unknown accented phrase stays unknown')
  t.end()
})
