import { unpack } from 'efrt'
import dstPatterns from '../../data/dst-patterns.js'
import pcked from '../generated/zones.js'
import misc from '../../data/aliases.js'
import addUTC from './add-utc.js'
import identifiers from '../../data/iana-identifiers.js'

// unpack our lexicon of words
const zones = {}
const lexicon = Object.assign({}, misc)
Object.keys(pcked).forEach(top => {
  Object.keys(pcked[top]).forEach(name => {
    const [words, meta, hem, dst] = pcked[top][name]
    const id = `${top}/${name}`
    zones[id] = { meta, hem }
    const keys = Object.keys(unpack(words))
    keys.forEach(k => {
      lexicon[k] = lexicon[k] || []
      lexicon[k].push(id)
      // use iana aliases
      if (/\//.test(k)) {
        const arr = k.split(/\//)
        const last = arr[arr.length - 1].toLowerCase()
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

const canonicalIds = Object.fromEntries(Object.entries(identifiers).map(([id, target]) => [id.toLowerCase(), target]))
const canonicalize = id => canonicalIds[id.toLowerCase()] || id

const unique = function (arr) {
  const obj = {}
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
export { zones, lexicon, canonicalIds, canonicalize }
