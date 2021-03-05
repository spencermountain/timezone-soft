const find = require('./find')
const display = require('./display')
const version = require('../_version')

const soft = function (str) {
  let ids = find(str) || []
  if (typeof ids === 'string') {
    ids = [ids]
  }
  return ids.map(display)
}
soft.prototype.version = version

module.exports = soft
