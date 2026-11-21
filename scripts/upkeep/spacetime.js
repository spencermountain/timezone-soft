/* eslint-disable no-console */
// Compare our data against the installed spacetime zonefile.
// Run after updating spacetime: `pnpm run upkeep:spacetime`
import spacetime from 'spacetime'
import soft from '../../src/index.js'
import zones, { patterns } from '../../data/index.js'

// differences we already know about, and accept
const known = {
  unresolved: ['etc/gmt+13', 'etc/gmt+14', 'utc/gmt+13', 'utc/gmt+14'], // not real offsets
  target: ['est', 'mst'], // informal abbreviations win over IANA links
  hem: ['Africa/Casablanca', 'Africa/El_Aaiun', 'Antarctica/Troll'] // ours is geographic
}

const theirs = spacetime().timezones
const year = new Date().getUTCFullYear() + 1
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const pad = num => String(num).padStart(2, '0')
const stamp = date => `${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}:${pad(date.getUTCHours())}`

// '2nd-sun-mar-2h' → '03/14:02'
const fromRule = (rule) => {
  const [nth, day, month, hour] = rule.split('-')
  const m = months.indexOf(month)
  const hits = []
  for (let d = 1; d <= 31; d += 1) {
    const date = new Date(Date.UTC(year, m, d))
    if (date.getUTCMonth() === m && date.getUTCDay() === days.indexOf(day)) {
      hits.push(d)
    }
  }
  const d = nth === 'last' ? hits.at(-1) : hits[parseInt(nth, 10) - 1]
  // '24h' rolls over to midnight of the next day
  return stamp(new Date(Date.UTC(year, m, d, parseInt(hour, 10))))
}

// spacetime's '03/14:02' → the same form, dropping minutes and rolling '24' over
const fromSpacetime = (str) => {
  const [month, day, hour] = str.split(/[/:]/).map(Number)
  return stamp(new Date(Date.UTC(year, month - 1, day, hour)))
}

// spacetime lists changes in calendar order, so compare as sorted pairs
const ourDates = id => (zones[id].dst ? patterns[zones[id].dst].split('|').map(fromRule).sort().join(' ') : '')
const theirDates = zone => (zone.dst ? zone.dst.split('->').filter(Boolean).map(fromSpacetime).sort().join(' ') : '')

// every offset a zone uses through the year
const getOffsets = (id) => {
  const found = new Set()
  for (let m = 0; m < 12; m += 1) {
    found.add(spacetime(Date.UTC(year, m, 15, 12), id).offset() / 60)
  }
  return [...found].sort((a, b) => a - b).join(',')
}

const report = { unresolved: [], target: [], offsets: [], dates: [], legacy: [], hem: [] }

// 1. each of their ids should resolve to a zone that behaves the same
Object.keys(theirs).forEach((id) => {
  const res = soft(id)[0]
  if (!res) {
    if (!known.unresolved.includes(id)) {
      report.unresolved.push(id)
    }
    return
  }
  const found = res.iana.toLowerCase()
  const same = getOffsets(id) === getOffsets(found) && theirDates(theirs[id]) === theirDates(theirs[found] || {})
  if (!same && !known.target.includes(id)) {
    report.target.push(`${id} → ${res.iana}`)
  }
})

// 2. each of our zones should agree with theirs
Object.entries(zones).forEach(([id, zone]) => {
  const their = theirs[id.toLowerCase()]
  if (!their) {
    report.unresolved.push(`${id} (not in spacetime)`)
    return
  }
  const res = soft(id)[0]
  const ours = [res.standard.offset, res.daylight?.offset].filter(Number.isFinite).sort((a, b) => a - b).join(',')
  if (ours !== getOffsets(id)) {
    report.offsets.push(`${id}: ours [${ours}] theirs [${getOffsets(id)}]`)
  }
  if (ourDates(id) !== theirDates(their)) {
    report.dates.push(`${id}: ours ${zone.dst || 'none'} [${ourDates(id)}] theirs [${theirDates(their)}]`)
  }
  // maintenance-only fields
  if (zone.offset !== their.offset) {
    report.legacy.push(`${id}: ours ${zone.offset} theirs ${their.offset}`)
  }
  if (zone.hem !== their.hem && !known.hem.includes(id)) {
    report.hem.push(`${id}: ours ${zone.hem} theirs ${their.hem}`)
  }
})

const titles = {
  unresolved: 'Ids that do not resolve',
  target: 'Ids resolving to a zone that behaves differently',
  offsets: 'Standard/daylight offsets differ',
  dates: `DST dates differ in ${year}`,
  legacy: 'Legacy offset field differs',
  hem: 'Hemisphere differs'
}
console.log(`Comparing ${Object.keys(zones).length} zones with spacetime ${spacetime.version}, for ${year}\n`)
let total = 0
Object.entries(report).forEach(([key, list]) => {
  total += list.length
  console.log(`${list.length ? '✗' : '✓'} ${titles[key]} (${list.length})`)
  list.forEach(line => console.log(`    ${line}`))
})
process.exitCode = total > 0 ? 1 : 0
