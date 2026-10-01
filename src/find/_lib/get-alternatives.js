// Earlier replacements are preferred. Empty strings remove whole words.
const replacements = [
  ['&', 'and'],
  ['&', ''],
  ['and', ''],
  ['st.', 'saint'],
  ['st', 'saint'],
  ['saint', 'st'],
  ['saint', ''],
  ['st', ''],
  ['islands', ''],
  ['island', ''],
  ['isl', 'island'],
  // dst name cruft
  ['standard', ''],
  ['daylight', ''],
  // west/east/south/north
  ['west', 'western'],
  ['east', 'eastern'],
  ['south', 'southern'],
  ['north', 'northern'],
  ['western', 'west'],
  ['eastern', 'east'],
  ['southern', 'south'],
  ['northern', 'north'],
  // country-name cruft
  ['democratic', ''],
  ['socialist', ''],
  ['republic', ''],
  ['peoples', ''],
  ["people's", ''],
  ['federal', ''],
  ['federated', ''],
  ['islamic', ''],
  ['united', ''],
  ['kingdom', ''],
  ['of', ''],
  ['the', ''],
  // generic place names
  ['region', ''],
  ['regional', ''],
  ['district', ''],
  ['province', ''],
  ['state', ''],
  ['area', '']
]

const maxCandidates = 96
const clean = (value) => value.toLowerCase().split(' ').filter(Boolean).join(' ')
const ignored = new Set(replacements.filter(([, to]) => !to).map(([from]) => from))

const getAlternatives = (input, includeWords = true) => {
  const name = clean(input)
  const candidates = new Set()
  const add = (value) => {
    const candidate = clean(value)
    if (candidate && candidate !== name && !ignored.has(candidate)) {
      candidates.add(candidate)
    }
  }

  // Try each replacement alone and accumulate replacements in their listed order.
  let combined = name
  replacements.forEach(([from, to]) => {
    add(name.replaceAll(from, ` ${to} `))
    combined = combined.replaceAll(from, ` ${to} `)
    add(combined)
  })
  if (includeWords) {
    const phrases = [name, ...candidates]
    phrases.forEach((phrase) => phrase.split(' ').forEach(add))
  }
  // console.log(candidates)
  return [...candidates].slice(0, maxCandidates)
}

export default getAlternatives
