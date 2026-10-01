import test from 'tape'
import source from '../src/index.js'
import built from '../builds/timezone-soft.js'

const soft = process.env.TESTENV === 'prod' ? built : source
const examples = [
  ['(UTC-06:00) Central Time (US & Canada)', 'Central Time'],
  ['(UTC-05:00) Eastern Time (US & Canada)', 'Eastern Time'],
  ['(UTC-07:00) Mountain Time (US & Canada)', 'Mountain Time'],
  ['(UTC-08:00) Pacific Time (US & Canada)', 'Pacific Time'],
  ['(UTC-04:00) Atlantic Time (Canada)', 'Atlantic Time'],
  ['(UTC) Coordinated Universal Time', 'Coordinated Universal Time'],
  ['(UTC+00:00) Coordinated Universal Time', 'Coordinated Universal Time'],
  ['(UTC+05:45) Kathmandu', 'Kathmandu'],
  ['(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi', 'Chennai, Kolkata, Mumbai, New Delhi'],
  ['  (utc-06:00)   Central Time (US & Canada)  ', 'Central Time']
]

test('long timezone labels', t => {
  examples.forEach(([label, name]) => {
    const expected = soft(name)
    t.ok(expected.length, `${name} resolves`)
    t.deepEqual(soft(label), expected, label)
  })
  t.deepEqual(soft('(UTC-06:00) Unknown Place'), [], 'unknown labels do not resolve using only the offset')
  t.end()
})
