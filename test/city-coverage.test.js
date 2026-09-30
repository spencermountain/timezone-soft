import test from 'tape'
import soft from './_lib.js'

test('large-city spellings from the GeoNames audit', t => {
  const examples = [
    ['Xi’an', 'Asia/Shanghai'],
    ["Xi'an", 'Asia/Shanghai'],
    ['Ho Chi Minh City', 'Asia/Ho_Chi_Minh'],
    ['New York City', 'America/New_York'],
    ['Dar es Salaam', 'Africa/Nairobi'],
    ['Addis Ababa', 'Africa/Nairobi'],
    ['Zhongshan', 'Asia/Shanghai'],
    ['Hamburg', 'Europe/Berlin'],
    ['Hyderābād', 'Asia/Kolkata']
  ]
  examples.forEach(([input, expected]) => {
    t.equal(soft(input)[0]?.iana, expected, input)
  })
  t.ok(soft('Hyderabad').some(zone => zone.iana === 'Asia/Karachi'), 'Pakistani Hyderabad remains a candidate')
  t.deepEqual(soft('Hyderabad, Pakistan').map(zone => zone.iana), ['Asia/Karachi'], 'country qualifier selects Pakistan')
  t.deepEqual(soft('Hyderabad, India').map(zone => zone.iana), ['Asia/Kolkata'], 'country qualifier selects India')
  t.deepEqual(soft('New York City time'), soft('New York City'), 'city spelling composes with phrase cleanup')
  t.equal(soft('Mexico City')[0]?.iana, 'America/Mexico_City', 'existing full city name stays authoritative')
  t.deepEqual(soft('Unknown City'), [], 'suffix removal does not invent a match')
  t.deepEqual(soft('America/New York'), [], 'explicit IANA IDs are not repaired')
  t.end()
})
