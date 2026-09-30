import test from 'tape'
import soft from './_lib.js'

test('western Canadian zones have their own permanent offsets', (t) => {
  let res = soft('whitehorse')
  res[0] = res[0] || {}
  t.equal(res[0].iana, 'America/Whitehorse', 'found iana')
  t.equal(res[0].standard.abbr, 'MST', 'mountain std')
  t.ok(!res[0].daylight, 'no mountain dst')

  res = soft('Yellowknife')
  res[0] = res[0] || {}
  t.equal(res[0].iana, 'America/Edmonton', 'canonical IANA link target')
  t.equal(res[0].standard.abbr, 'CST', 'permanent UTC-6 abbreviation')
  t.equal(res[0].standard.offset, -6, 'permanent UTC-6 offset')
  t.equal(res[0].daylight, null, 'no seasonal fallback')

  t.end()
})

test('gmt zones are inverted', (t) => {
  let ids = soft('Etc/GMT+4')
  t.equal(ids[0].standard.offset, -4, '+4')
  ids = soft('Etc/GMT-4')
  t.equal(ids[0].standard.offset, 4, '-4')
  ids = soft('Etc/GMT+14')
  t.deepEqual(ids, [], '+14 is not an IANA ID')
  ids = soft('Etc/GMT-14')
  t.equal(ids[0].standard.offset, 14, '-14')
  t.end()
})
