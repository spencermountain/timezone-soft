import { zones, lexicon } from '../data/index.js'
import normalize from './normalize.js'
import parseOffset from './parseOffset.js'

// match some text to an iana code
const find = function (str) {
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
    let etc = parseOffset(str)
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

