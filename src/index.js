import find from './find/index.js'
import display from './display/index.js'
import version from './generated/version.js'

const soft = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('timezone-soft expects a string')
  }
  let ids = find(str) || []
  if (typeof ids === 'string') {
    ids = [ids]
  }
  ids = ids.map((id) => display(id, str))
  return ids
}
soft.version = version
soft.prototype.version = version // retain compatibility with earlier releases

export default soft
