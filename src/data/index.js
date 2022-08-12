import { unpack } from 'efrt'
import dstPatterns from '../find/dst-patterns.js'
import pcked from './_data.js'
import misc from './misc.js'
import addUTC from './add-utc.js'

// unpack our lexicon of words
let zones = {}
let lexicon = Object.assign({}, misc)
Object.keys(pcked).forEach(top => {
  Object.keys(pcked[top]).forEach(name => {
    let [words, meta, hem, dst] = pcked[top][name]
    let id = `${top}/${name}`
    zones[id] = { meta, hem }
    let keys = Object.keys(unpack(words))
    keys.forEach(k => {
      lexicon[k] = lexicon[k] || []
      lexicon[k].push(id)
      // use iana aliases
      if (k.match(/\//)) {
        let arr = k.split(/\//)
        let last = arr[arr.length - 1].toLowerCase()
        lexicon[last] = lexicon[last] || []
        lexicon[last].push(id)
      }
    })
    zones[id].wordCount = keys.length
    if (dst) {
      zones[id].dst = dstPatterns[dst].split(/\|/)
    }
  })
})

addUTC(zones)

const unique = function (arr) {
  let obj = {}
  for (let i = 0; i < arr.length; i += 1) {
    obj[arr[i]] = true
  }
  return Object.keys(obj)
}

// sort by num of aliases
Object.keys(lexicon).forEach(k => {
  if (lexicon[k].length > 1) {
    lexicon[k] = unique(lexicon[k])
    lexicon[k] = lexicon[k].sort((a, b) => {
      if (zones[a].wordCount > zones[b].wordCount) {
        return -1
      } else if (zones[a].wordCount < zones[b].wordCount) {
        return 1
      }
      return 0
    })
  }
})
export { zones, lexicon }