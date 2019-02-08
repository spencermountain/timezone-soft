const lookup = require('./lookup')
const display = require('./display')
const version = require('../_version')

module.exports = {
  find: lookup,
  display: display,
  version: version
}
