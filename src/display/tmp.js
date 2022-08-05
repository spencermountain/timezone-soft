import metas from './data.js'
import { pack } from 'efrt'

let out = metas.map(o => {
  let name = ''
  if (o.name) {
    name = o.name.replace(/ Time$/, '')
  } else {
    name = o.std.name.replace(/ Standard Time$/, '')
  }
  // if (o.name && !o.name.match(/ Time$/)) {
  //   console.log(o.name)
  // }
  delete o.name
  delete o.aliases
  delete o.abbr
  delete o.hem
  if (o.dst && Object.keys(o.dst).length === 0) {
    delete o.dst
  }
  o.ids = pack(o.ids)
  o.ids = o.ids.replace(/^true/, '1')

  let std = [o.std.abbr, o.std.offset]
  if (o.std.name && o.std.name !== name + ' Standard Time' && o.std.name !== name + ' Time') {
    std.push(o.std.name)
  }
  o.std = std

  let arr = [name, o.ids, o.std]
  if (o.dst) {
    let dst = [o.dst.abbr, o.dst.offset]
    if (o.dst.name && o.dst.name !== name + ' Daylight Time') {
      dst.push(o.dst.name)
    }
    arr.push(dst)
    // console.log(name, '  -= ', o.dst.name)
  }

  return arr
})
console.log(out)