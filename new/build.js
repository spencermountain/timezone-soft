import zonefile from './zonefile.js'
// import fs from 'fs'
// const dir = path.dirname(fileURLToPath(import.meta.url))
// import path from 'path'
// import { fileURLToPath } from 'url'
import aliases from './aliases.js'
import abbreviatons from '../data/06-abbreviations.js'

import { byCity, byCountry, byState, oldZone } from './setups.js'


//try to match these against iana form
const normalize = (w) => {
  w = w.toLowerCase().trim()
  w = w.replace(/_/g, ' ')
  w = w.replace(/^in /g, '')
  w = w.replace(/ time/g, '')
  w = w.replace(/ (standard|daylight|summer)/g, '')
  w = w.replace(/ - .*/g, '') //`Eastern Time - US & Canada`
  w = w.replace(/, .*/g, '') //`mumbai, india`
  return w.trim()
}


let byDir = {}
let total = 0
Object.keys(zonefile).forEach(k => {
  let names = []
  console.log('\n' + k)
  let split = k.split(/\//)

  // add all parts of their iana code
  split.forEach(w => {
    names.push(normalize(w)) //872
  })

  // add notable cities in this zone
  if (byCity[k]) {
    names = names.concat(byCity[k])//3343
  }

  //add country codes, name
  if (byCountry[k]) {
    names = names.concat(byCountry[k])//3457
  }

  //add states, provinces
  if (byState[k]) {
    names = names.concat(byState[k])//3609
  }

  //add deprecated iana codes
  if (oldZone[k]) {
    names = names.concat(oldZone[k])//3719
  }
  //add weird abbreviatons
  if (abbreviatons[k]) {
    names = names.concat(abbreviatons[k].filter(str => str))//3956
  }





  // console.log(' ', names)
  // fs.writeFileSync(dir + `/data/${top}.js`,`export default `+JSON.stringify(zonefile[k], null, 2))
  // fs.promises.mkdir(dir + `/data/${top}.js`, { recursive: true }).catch(console.error);
  total += names.length
})
console.log(total)

console.log(Object.keys(zonefile).length)
