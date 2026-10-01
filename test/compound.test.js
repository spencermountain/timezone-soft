import test from 'tape'
import soft from './_lib.js'

const ids = input => soft(input).map(zone => zone.iana)

test('comma and parenthesis fallbacks reuse existing aliases', t => {
  for (const input of ['Springfield, Missouri', 'Springfield,Missouri', 'Springfield (Missouri)',
    '  SPRINGFIELD , missouri  ', 'unknown city, Missouri, unknown district']) {
    t.deepEqual(soft(input), soft('Missouri'), input)
  }
  t.deepEqual(soft('Toronto, unknown district'), soft('Toronto'), 'known first part survives unknown suffix')
  for (const input of ['CST, China', 'CST (China)', 'CST China']) {
    t.deepEqual(ids(input), ['Asia/Shanghai', 'Asia/Macau'], input)
  }
  t.deepEqual(ids('Toronto, Ontario, Canada'), ['America/Toronto'], 'multiple recognized parts narrow candidates')
  t.equal(ids('mumbai,india')[0], 'Asia/Kolkata', 'comma does not need a following space')
  t.deepEqual(ids('Paris, France'), ['Europe/Paris'], 'existing city and country aliases')
  t.deepEqual(soft('Montréal (Canada)'), soft('Montreal, Canada'), 'accent folding in parts')
  t.deepEqual(soft('UTC time (UTC)'), soft('UTC'), 'normalized reserved names')
  t.end()
})

test('compound fallbacks preserve matching boundaries', t => {
  for (const input of ['Toronto, Japan', 'Toronto (Japan)', 'nonsense, unknown', ', () ,',
    'nonsense India', 'Springfield Missouri', 'Fake/UTC, Missouri', 'America/São_Paulo, Brazil']) {
    t.deepEqual(soft(input), [], input)
  }
  t.deepEqual(soft('Eastern Time - US & Canada'), soft('Eastern Time'), 'existing normalization wins')
  t.equal(ids('south east asia')[0], 'Asia/Bangkok', 'known multiword alias wins')
  t.ok(soft('brussels, copenhagen, madrid, paris').length > 0, 'legacy comma-separated label')
  const result = ids('CST, China, China')
  t.deepEqual(result, ids('CST, China'), 'repeated parts do not duplicate or reorder matches')
  t.end()
})
