import { unpack } from 'efrt'
import dstPatterns from '../_generated/dst-patterns.js'
import pcked from '../_generated/zones.js'
import addUTC from './add-utc.js'
import identifiers from '../_generated/iana-identifiers.js'
import { foldDiacritics, normalizeAlias } from '../find/_lib/normalize.js'

// unpack our lexicon of words
const zones = {}
const lexicon = {}
Object.keys(pcked).forEach((top) => {
  Object.keys(pcked[top]).forEach((name) => {
    const [words, meta, dst] = pcked[top][name]
    const id = `${top}/${name}`
    zones[id] = { meta }
    const keys = Object.keys(unpack(words))
    keys.forEach((k) => {
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
const canonicalize = (id) => canonicalIds[id.toLowerCase()] || id

// Derive city spellings from IANA IDs instead of storing IDs in zone names.
Object.entries(identifiers).forEach(([id, target]) => {
  if (!id.includes('/') || id.startsWith('Etc/') || !Object.hasOwn(zones, target)) {
    return
  }
  const name = id.split('/').pop().toLowerCase()
  const names = new Set([name, normalizeAlias(name)])
  names.forEach(alias => {
    if (alias) {
      lexicon[alias] = lexicon[alias] || []
      lexicon[alias].push(target)
    }
  })
})

const unique = function (arr) {
  const obj = {}
  for (let i = 0; i < arr.length; i += 1) {
    obj[arr[i]] = true
  }
  return Object.keys(obj)
}

// sort by num of aliases
Object.keys(lexicon).forEach((k) => {
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
// Add accent-free spellings without replacing existing aliases or their ranking.
Object.entries(lexicon).forEach(([alias, ids]) => {
  const folded = foldDiacritics(alias)
  if (!Object.hasOwn(lexicon, folded)) {
    lexicon[folded] = [...ids]
  }
})
export { zones, lexicon, canonicalIds, canonicalize }
