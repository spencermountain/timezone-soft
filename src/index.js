import find from './find/index.js'
import display from './display/index.js'
import version from './generated/version.js'
import { canonicalize, zones } from './data/index.js'

const soft = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('timezone-soft expects a string')
  }
  let ids = find(str) || []
  if (typeof ids === 'string') {
    ids = [ids]
  }
  ids = [...new Set(ids.map(canonicalize))].filter(id => Object.hasOwn(zones, id))
  ids = ids.map(id => display(id))
  return ids
}
soft.version = version
soft.prototype.version = version // retain compatibility with earlier releases

export default soft
