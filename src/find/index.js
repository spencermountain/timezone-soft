import matchWhole from './01-match-whole.js'
import { matchSeparatedParts, matchWordPairs } from './02-match-parts.js'

const find = (input) => {
  // Whole input, including normalization and accent folding.
  const whole = matchWhole(input)
  if (whole) {
    return whole
  }

  // Unknown identifiers cannot fall back to partial matches.
  if (input.includes('/')) {
    return null
  }

  // Explicit separators take precedence over word-pair guesses.
  if (/[,()]/.test(input)) {
    return matchSeparatedParts(input)
  }

  // Last resort: intersect two recognized phrases.
  return matchWordPairs(input)
}

export default find
