const normalizeCase = (input) => input.trim().toLowerCase()

const normalizeWhitespace = (input) => input.replace(/\s+/g, ' ').trim()

const simplifyTimezonePhrase = (input) => {
  let phrase = normalizeWhitespace(normalizeCase(input))
  phrase = phrase.replace(/^in /, '') // "in Toronto" → "Toronto"
  phrase = phrase.replace(/ time/g, '')
  phrase = phrase.replace(/ (standard|daylight|summer)/g, '')
  phrase = phrase.replace(/ - .*/g, '') // "Eastern Time - US & Canada"
  phrase = phrase.replace(/\./g, '') // "St. Petersburg" → "St Petersburg"
  return phrase.trim()
}

const simplifyGeographicWords = (input) =>
  input
    .replace(/\b(east|west|north|south)ern/g, '$1')
    .replace(/\b(africa|america|australia)n/g, '$1')
    .replace(/\beuropean/g, 'europe')
    .replace(/islands/g, 'island')
    .trim()

// Lookup checkpoints, ordered from least to most transformed.
const getAliasCandidates = (input) => {
  const phrase = simplifyTimezonePhrase(input)
  const geographic = simplifyGeographicWords(phrase)
  return [phrase, geographic, normalizeWhitespace(geographic)]
}

// Accent folding runs only after all ordinary alias checkpoints have failed.
const foldDiacritics = (input) => input.normalize('NFD').replace(/\p{M}/gu, '')

export { normalizeCase, getAliasCandidates, foldDiacritics }
