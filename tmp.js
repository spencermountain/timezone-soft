const lex = {}
let zones = require('/Users/spencer/mountain/timezone-soft/data/05-metazones.js')
zones.forEach((obj) => {
  lex[obj.std.abbrev.toLowerCase()] = 'Timezone'
  lex[obj.std.name.toLowerCase()] = 'Timezone'
  if (obj.dl) {
    lex[obj.dl.abbrev.toLowerCase()] = 'Timezone'
    lex[obj.dl.name.toLowerCase()] = 'Timezone'
  }
})

console.log(lex)
