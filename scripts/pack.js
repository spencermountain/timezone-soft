import fs from 'fs'
import path from 'path'
import { pack } from 'efrt'
// const efrt = require('/Users/spencer/mountain/efrt/builds/efrt.cjs')
// const efrt = require('/Users/spencer/mountain/efrt')
import lexicon from '../data/index.js'

//turn them into a series of flat-arrays
let toArrays = {}
let words = Object.keys(lexicon)
words.forEach((word) => {
  let tags = lexicon[word]
  if (typeof tags === 'string') {
    tags = [tags]
  }
  tags.forEach((tag) => {
    toArrays[tag] = toArrays[tag] || []
    toArrays[tag].push(word)
  })
})
// console.log(toArrays)

console.log('\n 🕑  - packing lexicon..')
let packed = pack(lexicon)
//write it to a file in ./src
const outFile = path.join(new URL('./', import.meta.url).pathname, '../src/find/_data.js')
fs.writeFileSync(outFile, 'export default ' + JSON.stringify(packed, null, 2), 'utf8')

//get filesize
const stats = fs.statSync(outFile)
let size = (stats['size'] / 1000.0).toFixed(1)

console.log('       - packed into  ' + size + 'k\n')
