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

const normalizeApostrophes = input => input.replace(/[‘’ʼ＇]/g, "'")

const removeApostrophes = input => input.replace(/'/g, '')

const useIdentifierSpacing = input => input.replace(/ /g, '_')

// Lookup checkpoints, ordered from least to most transformed.
const getAliasCandidates = (input) => {
  const phrase = simplifyTimezonePhrase(input)
  const geographic = simplifyGeographicWords(phrase)
  const spaced = normalizeWhitespace(geographic)
  const apostrophes = normalizeApostrophes(spaced)
  const city = removeApostrophes(apostrophes)
  return [phrase, geographic, spaced, apostrophes, city, useIdentifierSpacing(city)]
}

// Accent folding runs only after all ordinary alias checkpoints have failed.
const foldDiacritics = (input) => input.normalize('NFD').replace(/\p{M}/gu, '')

// Keep identifier separators and signed offsets meaningful.
const normalizeAlias = input => {
  let name = normalizeWhitespace(foldDiacritics(normalizeCase(input)))
  if (name.includes('/') || /(?:gmt|utc|msk)?[+-]\d/i.test(name)) {
    return name
  }
  name = normalizeApostrophes(name)
    .replace(/['.]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\b(?:time|city)\b/g, '')
  return normalizeWhitespace(name)
}

export { normalizeCase, getAliasCandidates, foldDiacritics, normalizeAlias }
