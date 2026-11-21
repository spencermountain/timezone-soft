import test from 'tape'
import soft from './_lib.js'
import zones from '../data/index.js'

// Older runtimes carry older rules, and would fail for the wrong reason.
const minTzdb = '2026e'
// Rules have no year, so one-off changes cannot be described.
const skip = new Set([
  'America/Havana' // IANA 2026f: no spring-forward in 2027
])
const year = new Date().getUTCFullYear() + 1

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const pad = num => String(num).padStart(2, '0')

// '2nd-sun-mar-2h' → '03-14T02', the local hour when the clocks change
const toDate = (rule) => {
  const [nth, day, month, hour] = rule.split('-')
  const first = new Temporal.PlainDate(year, months.indexOf(month) + 1, 1)
  const hits = []
  for (let i = 0; i < first.daysInMonth; i += 1) {
    const date = first.add({ days: i })
    if (date.dayOfWeek === days.indexOf(day) + 1) {
      hits.push(date)
    }
  }
  const date = nth === 'last' ? hits.at(-1) : hits[parseInt(nth, 10) - 1]
  // '24h' rolls over to midnight of the next day
  const time = date.toPlainDateTime().add({ hours: parseInt(hour, 10) })
  return `${pad(time.month)}-${pad(time.day)}T${pad(time.hour)}`
}

// the runtime's own changes in this year, as { on, off }
const getTransitions = (id) => {
  const found = {}
  let zdt = Temporal.ZonedDateTime.from(`${year}-01-01T00:00[${id}]`)
  for (let i = 0; i < 4; i += 1) {
    const next = zdt.getTimeZoneTransition('next')
    if (!next || next.year > year) {
      break
    }
    const before = next.subtract({ seconds: 1 })
    const wall = before.toPlainDateTime().add({ seconds: 1 })
    const dir = next.offsetNanoseconds > before.offsetNanoseconds ? 'on' : 'off'
    // rules cannot hold minutes, so compare to the hour
    found[dir] = `${pad(wall.month)}-${pad(wall.day)}T${pad(wall.hour)}`
    zdt = next
  }
  return found
}

test(`DST rules match the runtime's ${year} transitions`, (t) => {
  const tzdb = process.versions.tz || ''
  // older --harmony-temporal builds predate getTimeZoneTransition
  const hasTransitions = typeof globalThis.Temporal?.ZonedDateTime?.prototype.getTimeZoneTransition === 'function'
  if (!hasTransitions || tzdb < minTzdb) {
    t.comment(`skipped: needs Temporal transitions and tzdb ${minTzdb}+ (found ${tzdb || 'none'})`)
    t.end()
    return
  }
  Object.keys(zones).forEach((id) => {
    if (skip.has(id)) {
      return
    }
    const { daylight } = soft(id)[0]
    const real = getTransitions(id)
    if (!daylight) {
      t.deepEqual(real, {}, `${id} has no clock changes`)
      return
    }
    t.equal(toDate(daylight.start), real.on, `${id} start is when DST turns on`)
    t.equal(toDate(daylight.end), real.off, `${id} end is when DST turns off`)
  })
  t.end()
})
