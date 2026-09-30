import { zones, lexicon, foldedLexicon, canonicalIds } from '../data/index.js'
import { normalizeCase, getAliasCandidates, foldDiacritics } from './_lib/normalize.js'
import parseOffset from './_lib/parse-offset.js'

const utcNames = ['utc', 'uct', 'universal', 'zulu', 'coordinated universal', 'coordinated universal time']

const matchReservedName = (input) => {
  if (utcNames.includes(input)) {
    return 'Etc/UTC'
  }
  if (input === 'gmt') {
    return 'Etc/GMT'
  }
  return null
}

const matchAlias = (input) => (Object.hasOwn(lexicon, input) ? lexicon[input] : null)

const matchNormalizedAlias = (input) => matchReservedName(input) || matchAlias(input)

// Complete-input matching only; compound fallbacks run afterward.
const matchWhole = (input) => {
  const normalized = normalizeCase(input)

  // 1. Reserved UTC/GMT names take precedence over geographic aliases.
  const reserved = matchReservedName(normalized)
  if (reserved) {
    return reserved
  }

  // 2. Slash inputs require a known IANA ID or exact curated alias.
  if (normalized.includes('/')) {
    const id = canonicalIds[normalized]
    if (id) {
      return Object.hasOwn(zones, id) ? id : null
    }
    return matchAlias(normalized)
  }

  // 3. Preserve an exact alias before changing its spelling.
  const exact = matchAlias(input)
  if (exact) {
    return exact
  }

  // 4. Parse whole-hour offsets, such as UTC+5, GMT-5, or +5hrs.
  if (/[0-9]/.test(input)) {
    const offset = parseOffset(input)
    if (offset) {
      return [offset]
    }
  }

  // 5. Try phrase cleanup, geographic word cleanup, then final spacing cleanup.
  const candidates = getAliasCandidates(input)
  for (let i = 0; i < candidates.length; i += 1) {
    const match = matchNormalizedAlias(candidates[i])
    if (match) {
      return match
    }
  }

  // 6. Fold accents after exact spellings, including the case-only candidate.
  const foldCandidates = [normalized, ...candidates]
  for (let i = 0; i < foldCandidates.length; i += 1) {
    const folded = foldDiacritics(foldCandidates[i])
    const match = matchNormalizedAlias(folded)
    if (match) {
      return match
    }
    if (Object.hasOwn(foldedLexicon, folded)) {
      return foldedLexicon[folded]
    }
  }
  return null
}

export default matchWhole
