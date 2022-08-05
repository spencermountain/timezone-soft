import pcked from './_data.js'
import { unpack } from 'efrt'

let out = pcked.map(a => {
  let zone = {
    name: a[0] + ' Time',
    ids: Object.keys(unpack(a[1])),
    std: {
      abbrev: a[2][0],
      offset: a[2][1],
      name: a[0] + ' Standard Time'
    }
  }
  if (a[2][2]) {
    zone.std.name = a[2][2]
  }
  if (a[3]) {
    zone.dst = {
      abbrev: a[3][0],
      offset: a[3][1],
      name: a[0] + ' Daylight Time'
    }
    if (a[3][2]) {
      zone.dst.name = a[3][2]
    }
  }
  return zone
})
console.log(out)
export default out