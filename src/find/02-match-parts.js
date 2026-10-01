import { canonicalize, lexicon } from '../data/index.js'
import matchWhole from './01-match-whole.js'
import alternativeSpellings from './_lib/alternative-spellings.js'

const matchPart = (input) => {
  const found = matchWhole(input)
  const ids = typeof found === 'string' ? [found] : found || []
  return [...new Set(ids.map(canonicalize))]
}

const matchAlternativeSpellings = (input, includeWords = true) => {
  const candidates = alternativeSpellings(input, includeWords)
  if (!candidates.length) {
    return null
  }
  // Keep curated exact aliases ahead of spelling guesses.
  const exact = input.trim().toLowerCase()
  if (Object.hasOwn(lexicon, exact)) {
    return [...new Set(lexicon[exact].map(canonicalize))]
  }
  for (let i = 0; i < candidates.length; i += 1) {
    const found = matchPart(candidates[i])
    if (found.length) {
      return found
    }
  }
  return null
}

// Preserve the first part's ranking while removing candidates absent elsewhere.
const intersect = (lists) => lists[0].filter((id) => lists.every((list) => list.includes(id)))

const matchSeparatedParts = (input) => {
  const parts = input
    .split(/[,()]/)
    .map((part) => part.trim())
    .filter(Boolean)
  const matches = parts.map(matchPart).filter((ids) => ids.length)
  // Ignore unknown parts; conflicting known parts keep an empty intersection.
  return matches.length ? intersect(matches) : null
}

const matchWordPairs = (input) => {
  const words = input.trim().split(/\s+/)
  // Try splits left to right. Both sides must resolve: "CST China".
  for (let boundary = 1; boundary < words.length; boundary += 1) {
    const left = matchPart(words.slice(0, boundary).join(' '))
    if (!left.length) {
      continue
    }
    const right = matchPart(words.slice(boundary).join(' '))
    if (!right.length) {
      continue
    }
    const shared = intersect([left, right])
    if (shared.length) {
      return shared
    }
  }
  return null
}

export { matchAlternativeSpellings, matchSeparatedParts, matchWordPairs }
