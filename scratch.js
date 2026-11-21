import soft from './src/index.js'

// import spacetime from 'spacetime'
// let zones = spacetime.timezones()
// const arr = require('/Users/spencer/mountain/timezone-soft/data/05-metazones.js')

// const result = soft('south sandwich')
const result = soft('Melbourne')
console.log(result)

// southern zones disagree on what 'start' means
const cities = ['Melbourne', 'Auckland', 'Santiago', 'Lord Howe']
cities.forEach((city) => {
  const { iana, daylight } = soft(city)[0]
  console.log(iana.padEnd(20), 'start:', daylight.start.padEnd(16), 'end:', daylight.end)
})
