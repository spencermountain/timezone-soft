const find = require('./find')
const display = require('./display')
const version = require('../_version')

const soft = function (str) {
  let ids = find(str) || []
  if (typeof ids === 'string') {
    ids = [ids]
  }
  ids = ids.map((id) => display(id, str))
  return ids
}
soft.prototype.version = version

module.exports = soft
