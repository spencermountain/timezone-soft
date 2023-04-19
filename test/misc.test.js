import test from 'tape'
import soft from './_lib.js'

test('shared meta, different dst', (t) => {
  let res = soft('whitehorse')
  res[0] = res[0] || {}
  t.equal(res[0].iana, 'America/Whitehorse', 'found iana')
  t.equal(res[0].standard.abbr, 'MST', 'mountain std')
  t.ok(!res[0].daylight, 'no mountain dst')

  res = soft('Yellowknife')
  res[0] = res[0] || {}
  t.equal(res[0].iana, 'America/Yellowknife', 'found iana')
  t.equal(res[0].standard.abbr, 'MST', 'mountain std')
  t.ok(res[0].daylight, 'found mountain dst')

  t.end()
})

test('gmt zones are inverted', (t) => {
  let ids = soft('Etc/GMT+4')
  t.equal(ids[0].standard.offset, -4, '+4')
  ids = soft('Etc/GMT-4')
  t.equal(ids[0].standard.offset, 4, '-4')
  ids = soft('Etc/GMT+14')
  t.equal(ids[0].standard.offset, -14, '+14')
  ids = soft('Etc/GMT-14')
  t.equal(ids[0].standard.offset, 14, '-14')
  t.end()
})
