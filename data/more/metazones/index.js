const tzdb = require('./tzdb') //149
const cldr = require('./cldr') //138
console.log(tzdb.length)
console.log(cldr.length)

let mixed = tzdb.forEach((obj) => {
  let id = obj.ids[0]
  let found = cldr.find((o) => o.ids.find((i) => i === id))
  // if (obj.ids[1]) {
  //   let found2 = cldr.find((o) => o.ids.find((i) => i === obj.ids[1]))
  //   if (found !== found2) {
  //     console.log(found.name, '  |   ', found2.name)
  //   }
  // }
  if (found.offset !== obj.std.offset) {
    console.log(obj.name, '     ', found.name)
  }
  // if (found) {
  // console.log(obj.name, '     ', found.name)
  // } else {
  // console.log('not-found', obj.name)
  // }
  obj.long = found.iso
  obj.aliases = obj.aliases.concat(found.aliases)

  // if (obj.dst && obj.dst.offset) {
  // obj.dst.offset = obj.std.offset - 1
  // }
  return obj
})

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
