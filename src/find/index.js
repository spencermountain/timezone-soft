import { zones, lexicon, canonicalIds } from '../data/index.js'
import normalize from './normalize.js'
import parseOffset from './parseOffset.js'

// match some text to an iana code
const find = function (str) {
  const input = str.trim().toLowerCase()
  if (input === 'utc') return 'Etc/UTC'
  if (input === 'gmt') return 'Etc/GMT'
  // Explicit identifiers use IANA links, never informal alias ranking.
  if (input.includes('/')) {
    const id = canonicalIds[input]
    if (id) return Object.hasOwn(zones, id) ? id : null
    // Some curated informal phrases contain a slash but are not IANA IDs.
    return Object.hasOwn(lexicon, input) ? lexicon[input] : null
  }
  // perfect id match
  if (zones.hasOwnProperty(str)) {
    return str
  }
  // lookup known word
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  // -8hrs
  if (/[0-9]/.test(str)) {
    const etc = parseOffset(str)
    if (etc) {
      return [etc]
    }
  }
  // try a sequence of normalization steps
  str = normalize.one(str)
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  str = normalize.two(str)
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  str = normalize.three(str)
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  return null
}

export default find
