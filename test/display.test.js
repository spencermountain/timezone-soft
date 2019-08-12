const test = require('tape')
const informal = require('../src')

test('display-test', t => {
  let arr = [
    ['new york', 'EST', 'EDT'],
    ['easter island', 'EAST', 'EASST'],
    ['lima', 'PET'],
    ['bermuda', 'AST', 'ADT'],
    ['america/manaus', 'AMT'],
    ['toronto', 'EST', 'ADT'],
    ['vancouver', 'PST', 'PDT'],
    ['europe/paris', 'CET', 'CEST'],
    ['dakar', 'GMT'],
    ['Punta Arenas', 'CLST'],
    ['prague', 'CET', 'CEST'],
    ['kinshasa', 'WAT'],
    ['chongqing', 'CT'],
    ['makassar', 'WITA'],
    ['acst', 'ACST', 'ACDT'],
    ['Adelaide', 'ACST', 'ACDT'],
    ['darwin', 'ACST', 'ACDT']
  ]
  arr.forEach(a => {
    let display = informal.display(a[0])
    console.log(a[0], display)
    t.equal(display.standard.abbrev, a[1], a[0] + ' standard')
    if (display.daylight) {
      t.equal(display.daylight.abbrev, a[2], a[0] + ' daylight')
    } else {
      t.equal(a[2], undefined, 'no-daylight')
    }
  })
  t.end()
})
