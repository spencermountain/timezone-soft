import matchRegion from './00-match-region.js'
import matchWhole from './01-match-whole.js'
import { matchAlternativeSpellings, matchSeparatedParts, matchWordPairs } from './02-match-parts.js'

const longName = /^\s*\(utc(?:[+-]\d{2}:\d{2})?\)\s*([^()]+?)(?:\s*\([^()]*\))?\s*$/i

const find = (input) => {
  // "(UTC-06:00) Central Time (US & Canada)" → "Central Time".
  input = input.replace(longName, '$1').trim()

  // Region names must include every supported zone, not just curated aliases.
  const region = matchRegion(input)
  if (region) {
    return region
  }

  // Try complete spelling variants before normalization drops punctuation.
  // Keep explicit identifier and qualifier handling separate.
  if (input.includes('&') && !/[\/,()]/.test(input)) {
    const alternative = matchAlternativeSpellings(input, false)
    if (alternative) {
      return alternative
    }
  }

  // Whole input, including normalization and accent folding.
  const whole = matchWhole(input)
  if (whole) {
    return whole
  }

  // Unknown identifiers cannot fall back to partial matches.
  if (input.includes('/')) {
    return null
  }

  const alternative = matchAlternativeSpellings(input, false)
  if (alternative) {
    return alternative
  }

  // Explicit separators take precedence over word-pair guesses.
  if (/[,()]/.test(input)) {
    return matchSeparatedParts(input)
  }

  // Preserve qualifier intersections before trying individual words.
  const pair = matchWordPairs(input)
  if (pair) {
    return pair
  }
  // Don't turn arbitrary unknown phrases into matches for one familiar word.
  if (/&|\b(?:and|st|saint|democratic|republic|of|the|peoples|federal|federated|islamic|plurinational|bolivarian|kingdom)\b/i.test(input)) {
    return matchAlternativeSpellings(input)
  }
  return null
}

export default find
