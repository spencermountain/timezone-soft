import metas from '../data/meta-zones.js'
import fs from 'fs'
import path from 'path'
import { pack } from 'efrt'


let out = metas.map(o => {
  let name = ''
  if (o.name) {
    name = o.name.replace(/ Time$/, '')
  } else {
    name = o.std.name.replace(/ Standard Time$/, '')
  }
  delete o.name
  delete o.aliases
  delete o.abbr
  delete o.hem
  if (o.dst && Object.keys(o.dst).length === 0) {
    delete o.dst
  }
  let ids = o.ids.reduce((h, str) => {
    h[str] = true
    return h
  }, {})
  o.ids = pack(ids)

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


//write it to a file in ./src
const outFile = path.join(new URL('./', import.meta.url).pathname, '../src/display/_data.js')
fs.writeFileSync(outFile, 'export default ' + JSON.stringify(out), 'utf8')

//get filesize
const stats = fs.statSync(outFile)
let size = (stats['size'] / 1000.0).toFixed(1)

console.log('       - packed into  ' + size + 'k\n')