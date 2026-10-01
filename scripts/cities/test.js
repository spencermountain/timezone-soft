/* eslint-disable no-console */
import soft from '../../src/index.js'
import { identifiers } from '../../data/index.js'
import load from './load.js'
import saveMissing from './_save-missing.js'

const green = str => '\x1b[32m' + str + '\x1b[0m'
const red = str => '\x1b[31m' + str + '\x1b[0m'
const yellow = str => '\x1b[33m' + str + '\x1b[0m'
const dim = str => '\x1b[2m' + str + '\x1b[0m'
const magenta = (str) => '\x1b[35m' + str + '\x1b[0m'

const limit = 250

const ignore = new Set(['Melbourne', 'Hong Kong', 'Berlin'])

const rows = await load()
const cities = rows.slice(0, limit)

console.log(`City coverage: largest ${limit} cities`)
let wrong = 0
let strong = 0
let weak = 0
const missing = []
cities.forEach(city => {
  const expected = identifiers[city.timezone] || city.timezone
  const found = soft(city.name).map((zone) => zone.iana)
  if (found.length === 0 && !ignore.has(city.name)) {
    missing.push({ name: city.name, timezone: expected })
  }
  const strongMatch = found[0] === expected
  const weakMatch = found.includes(expected)
  if (strongMatch || ignore.has(city.name)) {
    strong += 1
    console.log(
      `${green('✓')} - '${green(city.name)}' (${dim(expected)}) ${ignore.has(city.name) ? yellow(found[0]) : ''}`
    )
  }
  else if (weakMatch) {
    weak += 1
    console.log(`${yellow('-')} - '${yellow(city.name)}' (${dim(expected)})  - [${yellow(found[0])}]`)
  } else {
    wrong += 1
    console.log(`${red('✗')} - '${red(city.name)}' (${dim(expected)}) - [${red(found[0])}]`)
  }
})
console.log(`\n  ${green(strong)}/${cities.length} correct (${((100 * strong) / cities.length).toFixed(0)}%)`)
console.log(
  `  ${yellow(strong + weak)}/${cities.length} weak (${((100 * (strong + weak)) / cities.length).toFixed(0)}%)`
)
console.log(`  ${red(wrong)}/${cities.length} wrong (${((100 * wrong) / cities.length).toFixed(0)}%)`)

const { added } = await saveMissing(missing)
if (added) {
  console.log(`\n  ${magenta(added)} names added to data/zones.\n`)
  console.log(JSON.stringify(missing))
}

