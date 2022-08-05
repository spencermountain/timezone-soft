import find from './find/index.js'
import display from './display/index.js'
import version from './_version.js'

const soft = function (str) {
  let ids = find(str) || []
  if (typeof ids === 'string') {
    ids = [ids]
  }
  ids = ids.map((id) => display(id, str))
  return ids
}
soft.prototype.version = version

export default soft
// export { find, display, version }
