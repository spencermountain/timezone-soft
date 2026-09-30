/* eslint-disable no-console */
import test from 'tape'
import soft from './_lib.js'

test('display offsets use signed hours and minutes', t => {
  for (const [input, expected] of [
    ['America/Bogota', '(UTC-05:00) Colombia Time'],
    ['Australia/Darwin', '(UTC+09:30) Australian Central Time'],
    ['Asia/Kathmandu', '(UTC+05:45) Kathmandu'],
    ['UTC+0', '(UTC) Coordinated Universal Time'],
    ['UTC+5', '(UTC+05:00) Coordinated Universal Time'],
    ['UTC-5', '(UTC-05:00) Coordinated Universal Time']
  ]) {
    t.equal(soft(input)[0]?.long, expected, input)
  }
  t.end()
})

test('display-test', (t) => {
  const arr = [
    ['new york', 'EST', 'EDT'],
    ['easter island', 'EAST', 'EASST'],
    ['lima', 'PET'],
    ['bermuda', 'AST', 'ADT'],
    ['america/manaus', 'AMT'],
    ['toronto', 'EST', 'EDT'],
    ['vancouver', 'MST'],
    ['europe/paris', 'CET', 'CEST'],
    ['dakar', 'GMT'],
    // ['Punta Arenas', 'CLST'],
    ['prague', 'CET', 'CEST'],
    ['kinshasa', 'WAT'],
    ['chongqing', 'CST'],
    ['makassar', 'WITA'],
    ['acst', 'ACST', 'ACDT'],
    ['Adelaide', 'ACST', 'ACDT'],
    ['darwin', 'ACST'],
    ['Etc/GMT+8', 'GMT+8']
    // ['Etc/UTC+8', 'GMT+8'],
    // ['UTC+8', 'GMT+8'],
    // ['8h', 'GMT-8']
  ]
  arr.forEach((a) => {
    const display = soft(a[0])[0]
    if (!display) {
      console.log(a)
    }
    t.equal(display.standard.abbr, a[1], a[0] + ' standard')
    if (display.daylight) {
      t.equal(display.daylight.abbr, a[2], a[0] + ' daylight')
    } else {
      t.equal(a[2], undefined, 'no-daylight')
    }
  })
  t.end()
})
