import test from 'tape'
import soft from './_lib.js'

const ids = name => soft(name).map(zone => zone.iana)

// These countries' zones are merged into a zone from another country.
const names = [
  ['holy see', 'Europe/Rome'],
  ['st martin', 'America/Puerto_Rico'],
  ['st martin french', 'America/Puerto_Rico'],
  ['french saint martin', 'America/Puerto_Rico'],
  ['St Martin (French)', 'America/Puerto_Rico'],
  ['saint helena', 'Africa/Abidjan'],
  ['st helena', 'Africa/Abidjan'],
  ['Saint Helena, Ascension and Tristan da Cunha', 'Africa/Abidjan'],
  ['ascension', 'Africa/Abidjan'],
  ['tristan da cunha', 'Africa/Abidjan'],
  ['mariana', 'Pacific/Guam'],
  ['ghanaian', 'Africa/Abidjan'],
  ['kuwaiti', 'Asia/Riyadh'],
  ['slovenian', 'Europe/Belgrade'],
  ['slovak', 'Europe/Prague'],
  ['zimbabwean', 'Africa/Maputo']
]

test('country names on merged zones resolve to the linked zone', t => {
  names.forEach(([name, id]) => t.deepEqual(ids(name), [id], name))
  t.end()
})
