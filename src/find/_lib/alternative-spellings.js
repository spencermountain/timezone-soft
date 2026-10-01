import { normalizeAlias } from './normalize.js'

const maxPhrases = 48
const maxCandidates = 96
const descriptions = /\b(?:democratic|republic|of|the|peoples|people's|federal|federated|islamic|plurinational|bolivarian|kingdom)\b/g
const clean = input => input.replace(/\s+/g, ' ').trim().toLowerCase()
const meaningful = input => clean(input.replace(descriptions, '').replace(/\b(?:and|st|saint)\b|&/g, ''))

const alternativeSpellings = (input, includeWords = true) => {
  const name = clean(input)
  const phrases = [name]
  const seen = new Set(phrases)
  const add = value => {
    const candidate = clean(value)
    if (candidate && meaningful(candidate) && !seen.has(candidate) && phrases.length < maxPhrases) {
      seen.add(candidate)
      phrases.push(candidate)
    }
  }

  // Expand each phrase once, stopping at a fixed budget rather than all permutations.
  for (let i = 0; i < phrases.length && i < maxPhrases; i += 1) {
    const phrase = phrases[i]
    add(phrase.replace(/&/g, ' and '))
    add(phrase.replace(/&|\band\b/g, ' '))
    add(phrase.replace(/\bst\b\.?/g, 'saint'))
    add(phrase.replace(/\bsaint\b/g, 'st'))
    add(phrase.replace(descriptions, ' '))
    const terms = new Set(phrase.match(descriptions) || [])
    terms.forEach(term => add(phrase.replace(new RegExp(`\\b${term}\\b`, 'g'), ' ')))
    add(normalizeAlias(phrase))
  }

  const candidates = phrases.slice(1)
    .sort((a, b) => Number(b.includes(' ')) - Number(a.includes(' ')))
  if (!includeWords) {
    return candidates
  }
  const addPart = value => {
    const part = clean(value)
    if (part && meaningful(part) && !seen.has(part) && candidates.length < maxCandidates) {
      seen.add(part)
      candidates.push(part)
    }
  }
  // Complete alternatives precede separated phrases, which precede single words.
  phrases.forEach(phrase => phrase.split(/&|\band\b|[,()]/).forEach(addPart))
  phrases.forEach(phrase => normalizeAlias(phrase).split(/\s+/).forEach(addPart))
  return candidates
}

export default alternativeSpellings
