import test from 'tape'
import soft from './_lib.js'
import { zones } from '../src/data/index.js'

test('top-level IANA regions return all supported canonical timezones', t => {
  const supported = [...new Set(Object.keys(zones).flatMap(id => soft(id).map(zone => zone.iana)))].sort()
  const regions = ['Africa', 'America', 'Antarctica', 'Asia', 'Atlantic', 'Australia', 'Europe', 'Indian', 'Pacific', 'Etc']
  regions.forEach(region => {
    const expected = supported.filter(id => id.startsWith(`${region}/`))
    const found = soft(region).map(zone => zone.iana)
    t.ok(expected.length > 0, `${region} has supported zones`)
    t.deepEqual(found, expected, `${region} is complete, sorted, and unique`)
    t.deepEqual(soft(`  ${region.toUpperCase()}  `).map(zone => zone.iana), expected, `${region} ignores case and surrounding whitespace`)
  })
  t.end()
})

test('region matching requires the entire input', t => {
  t.equal(soft('Europe/Berlin')[0]?.iana, 'Europe/Berlin', 'explicit identifiers still work')
  t.deepEqual(soft('Europe/Not_A_Zone'), [], 'unknown identifiers do not expand to regions')
  t.deepEqual(soft('Europ'), [], 'partial region names do not match')
  t.end()
})
