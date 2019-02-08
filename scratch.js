const informal = require('./src/index')

//Intl.DateTimeFormat().resolvedOptions().timeZone

console.log(informal.find('est'))




let found = informal.display('Europe/Lisbon', {
  dst: true
})
console.log(found)
