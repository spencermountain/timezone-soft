let tzdb = require('./tzdb') //149
let cldr = require('./cldr') //138
// console.log(tzdb.length)
// console.log(cldr.length)
const matched = require('./pairs')
let alreadyTZ = {}
let alreadyCL = {}
matched.forEach((a) => {
  alreadyTZ[a[1]] = true
  alreadyCL[a[2]] = true
})

let pairs = []
console.log(tzdb.length, 'total')
tzdb = tzdb.filter((o) => !alreadyTZ[o.name])
cldr = cldr.filter((o) => !alreadyCL[o.name]) //.reverse()
console.log(tzdb.length, 'to go')
console.log(
  tzdb.filter((o) => !alreadyTZ[o.name]).map((o) => [o.std.offset, o.name, '', o.ids.length])
)

tzdb.forEach((obj) => {
  let id = obj.ids[3]
  // let word = obj.name.split(' ')[0]
  // let found = cldr.find((o) => word !== 'Time' && o.name.match(word))
  // let found = cldr.find((o) => {
  //   return JSON.stringify(o.ids) === JSON.stringify(obj.ids)
  // })
  // if (found && obj.ids[1]) {

  let found = cldr.find((o) => o.ids.find((i) => i === id))
  if (found) {
    console.log([obj.std.offset, obj.name, found.name, found.offset])
  }
  // }
  // if (found) {
  //   console.log([obj.std.offset, obj.name, found.name, found.offset])
  // }
  return obj
})
// console.log(JSON.stringify(pairs, null, 2))
/*
GMT Standard Time                 |Greenwich Standard Time
Romance Standard Time             |W. Central Africa Standard Time
Namibia Standard Time             |South Africa Standard Time
Middle East Standard Time         |Egypt Standard Time
GMT Standard Time                 |Morocco Standard Time
Aleutian Standard Time            |Hawaiian Standard Time
Atlantic Standard Time            |SA Western Standard Time
Tocantins Standard Time           |Bahia Standard Time
Central Standard Time             |Central Standard Time (Mexico)
SA Western Standard Time          |Central Brazilian Standard Time
US Mountain Standard Time         |Mountain Standard Time
Eastern Standard Time             |Eastern Standard Time (Mexico)
Mountain Standard Time (Mexico)   |US Mountain Standard Time
Pacific Standard Time             |Pacific Standard Time (Mexico)
Pacific SA Standard Time          |Magallanes Standard Time
AUS Eastern Standard Time         |Tasmania Standard Time
Arabic Standard Time              |Arab Standard Time
India Standard Time               |Sri Lanka Standard Time
Transbaikal Standard Time         |Yakutsk Standard Time
Korea Standard Time               |North Korea Standard Time
Russian Standard Time             |Astrakhan Standard Time
Russia Time Zone 3                |Saratov Standard Time
*/
