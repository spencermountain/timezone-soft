import soft from './src/index.js'

// import spacetime from 'spacetime'
// let zones = spacetime.timezones()
// const arr = require('/Users/spencer/mountain/timezone-soft/data/05-metazones.js')

let ids = soft('Yellowknife')
console.log(ids)


// Object.keys(metas).forEach(k => {
//   let ids = soft(metas[k].std[0])
//   if (ids.length === 0) {
//     console.log(k, metas[k].std[0])
//   }
  // if (metas[k].dst) {
  //   ids = soft(metas[k].dst[0])
  //   if (ids.length === 0) {
  //     console.log(k, metas[k].dst[0])
  //   }
  // }

// })

// let out = {
//   iana: 'Australia/Lord_Howe',
//   standard: { name: 'Lord Howe Standard Time', abbr: 'LHST', offset: 10.5 },
//   daylight: { name: 'Lord Howe Daylight Time', abbr: 'LHDT', offset: 11.5 }
// }