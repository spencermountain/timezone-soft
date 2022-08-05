import { unpack } from 'efrt'
import dstPatterns from '../find/dst-patterns.js'
import pcked from './_data.js'
import misc from '../find/misc.js'

// unpack our lexicon of words
let zones = {}
let lexicon = Object.assign({}, misc)
Object.keys(pcked).forEach(top => {
  Object.keys(pcked[top]).forEach(name => {
    let [words, meta, hem, dst] = pcked[top][name]
    let id = `${top}/${name}`
    zones[id] = { meta, hem }
    Object.keys(unpack(words)).forEach(k => {
      lexicon[k] = lexicon[k] || []
      lexicon[k].push(id)
    })
    if (dst) {
      zones[id].dst = dstPatterns[dst].split(/\|/)
    }
  })
})
export { zones, lexicon }