import zones, { countries, metas } from '../../data/index.js'
import { normalizeAlias } from '../../src/find/_lib/normalize.js'
const regions = new Set(Object.keys(zones).map((id) => id.split('/')[0].toLowerCase()))
const expanded = {}
const regionCountries = {}

Object.entries(zones).forEach(([id, zone]) => {
  const { names, meta, country } = zone
  let words = new Set(names)
  const countryNames = (countries[country] || []).map(normalizeAlias)

  // Country aliases and meta names belong to every zone that uses them.
  if (country) {
    words.add(country)
    countryNames.forEach((name) => words.add(name))
  }
  // add info from meta file
  const ignoredMetas = new Set(['Krasnoyarsk'])
  if (meta && !ignoredMetas.has(meta)) {
    words.add(normalizeAlias(meta))
    let std = metas[meta].std
    if (std) {
      std.forEach((code) => {
        if (typeof code === 'string' && !/^[+-0-9]/.test(code)) {
          if (words.has(normalizeAlias(code))) {
            console.log(normalizeAlias(code))
          }
          words.add(normalizeAlias(code))
        }
      })
    }
    let dst = metas[meta].dst
    if (dst) {
      dst.forEach((code) => {
        if (typeof code === 'string' && !/^[+-0-9]/.test(code)) {
          words.add(normalizeAlias(code))
        }
      })
    }
    if (metas[meta].alt) {
      metas[meta].alt.forEach((code) => {
        words.add(normalizeAlias(code))
      })
    }
  }
  words = [...words].filter(Boolean)
  expanded[id] = { ...zone, names: words }

  // A country may include zones outside its namesake IANA region.
  countryNames.forEach((region) => {
    if (regions.has(region) && id.split('/')[0].toLowerCase() !== region) {
      regionCountries[region] = regionCountries[region] || []
      regionCountries[region].push(id)
    }
  })
})

export { regionCountries }
export default expanded
