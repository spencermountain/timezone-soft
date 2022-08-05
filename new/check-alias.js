import data from '../data/04-byState.js'
import zones from './zonefile.js'
import links from './aliases.js'


let out = {}
Object.entries(data).forEach(a => {
  let [w, val] = a
  if (!zones[val]) {
    console.log(val)
    let alias = links[val]
    if (!alias) {
      console.log(val)
    }

  } else {
    out[w] = val
  }
})

// console.log(JSON.stringify(out, null, 2))