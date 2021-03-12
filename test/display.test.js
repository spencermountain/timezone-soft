const test = require('tape')
const soft = require('../src')

test('display-test', (t) => {
  let arr = [
    ['new york', 'EST', 'EDT'],
    ['easter island', 'EAST', 'EASST'],
    ['lima', 'PET'],
    ['bermuda', 'AST', 'ADT'],
    ['america/manaus', 'AMT'],
    ['toronto', 'EST', 'EDT'],
    ['vancouver', 'PST', 'PDT'],
    ['europe/paris', 'CET', 'CEST'],
    ['dakar', 'GMT'],
    // ['Punta Arenas', 'CLST'],
    ['prague', 'CET', 'CEST'],
    ['kinshasa', 'WAT'],
    ['chongqing', 'CST'],
    ['makassar', 'WITA'],
    ['acst', 'ACST', 'ACDT'],
    ['Adelaide', 'ACST', 'ACDT'],
    ['darwin', 'ACST']
  ]
  arr.forEach((a) => {
    let display = soft(a[0])[0]
    t.equal(display.standard.abbr, a[1], a[0] + ' standard')
    if (display.daylight) {
      t.equal(display.daylight.abbr, a[2], a[0] + ' daylight')
    } else {
      t.equal(a[2], undefined, 'no-daylight')
    }
  })
  t.end()
})
