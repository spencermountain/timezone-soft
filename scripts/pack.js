import fs from 'fs'
import path from 'path'
import { pack } from 'efrt'

import Africa from '../data/Africa.js'
import America from '../data/America.js'
import Antarctica from '../data/Antarctica.js'
import Asia from '../data/Asia.js'
import Atlantic from '../data/Atlantic.js'
import Australia from '../data/Australia.js'
import Etc from '../data/Etc.js'
import Europe from '../data/Europe.js'
import Indian from '../data/Indian.js'
import Pacific from '../data/Pacific.js'

let zones = Object.assign({},
  Africa,
  America,
  Antarctica,
  Asia,
  Atlantic,
  Australia,
  Etc,
  Europe,
  Indian,
  Pacific,
)

let packed = {}
Object.keys(zones).forEach(k => {
  let arr = k.split(/\//)
  let top = arr[0]
  let name = arr.slice(1).join('/')
  packed[top] = packed[top] || {}
  let { offset, hem, dst, names } = Object.assign({}, zones[k])
  packed[top][name] = [offset, hem, names]
  packed[top][name][2] = pack(packed[top][name][2])
  if (dst) {
    packed[top][name].push(dst)
  }
})
console.log(packed)

//write it to a file in ./src
const outFile = path.join(new URL('./', import.meta.url).pathname, '../src/find/_data.js')
fs.writeFileSync(outFile, 'export default ' + JSON.stringify(packed), 'utf8')

//get filesize
const stats = fs.statSync(outFile)
let size = (stats['size'] / 1000.0).toFixed(1)

console.log('       - packed into  ' + size + 'k\n')
