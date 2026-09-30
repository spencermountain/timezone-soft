/* eslint-disable no-console */
import soft from '../../src/index.js'
import identifiers from '../../data/iana-identifiers.js'
import load from './load.js'

const green = str => '\x1b[32m' + str + '\x1b[0m'
const red = str => '\x1b[31m' + str + '\x1b[0m'
const yellow = str => '\x1b[33m' + str + '\x1b[0m'
const dim = str => '\x1b[2m' + str + '\x1b[0m'

// Usage: pnpm test:cities 1000
const limit = 100
const rows = await load()
const cities = rows.slice(0, limit)

console.log(`City coverage: largest ${limit} cities`)
let wrong = 0
let strong = 0
let weak = 0
cities.forEach((city, i) => {
  const expected = identifiers[city.timezone] || city.timezone
  const found = soft(city.name).map((zone) => zone.iana)
  const strongMatch = found[0] === expected
  const weakMatch = found.includes(expected)
  if (strongMatch) {
    strong += 1
    console.log(`${green('✓')} - '${green(city.name)}' (${dim(expected)})`)
  }
  else if (weakMatch) {
    weak += 1
    console.log(`${yellow('-')} - '${yellow(city.name)}' (${dim(expected)})  - [${yellow(found[0])}]`)
  } else {
    wrong += 1
    console.log(`${red('✗')} - '${red(city.name)}' (${dim(expected)}) - [${red(found[0])}]`)
  }
})
console.log(`${green(strong)}/${cities.length} correct (${((100 * strong) / cities.length).toFixed(0)}%)`)
console.log(`${yellow(strong + weak)}/${cities.length} weak (${((100 * (strong + weak)) / cities.length).toFixed(0)}%)`)
console.log(`${red(wrong)}/${cities.length} wrong (${((100 * wrong) / cities.length).toFixed(0)}%)`)

