import { zones, lexicon, foldedLexicon, canonicalIds } from '../data/index.js'
import normalize from './normalize.js'
import parseOffset from './parseOffset.js'

const reserved = input => {
  if (['utc', 'uct', 'universal', 'zulu', 'coordinated universal', 'coordinated universal time'].includes(input)) return 'Etc/UTC'
  if (input === 'gmt') return 'Etc/GMT'
  return null
}

// match some text to an iana code
const find = function (str) {
  const input = str.trim().toLowerCase()
  const special = reserved(input)
  if (special) return special
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
  const candidates = [input]
  for (const step of [normalize.one, normalize.two, normalize.three]) {
    str = step(str)
    candidates.push(str)
    const id = reserved(str)
    if (id) return id
    if (Object.hasOwn(lexicon, str)) return lexicon[str]
  }
  // Exact spellings at every normalization stage take precedence over folding.
  for (const candidate of candidates) {
    const folded = normalize.fold(candidate)
    const id = reserved(folded)
    if (id) return id
    if (Object.hasOwn(lexicon, folded)) return lexicon[folded]
    if (Object.hasOwn(foldedLexicon, folded)) return foldedLexicon[folded]
  }
  return null
}

export default find
