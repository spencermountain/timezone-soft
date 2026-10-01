// Only factor aliases present in every zone of a metazone with multiple zones.
const getSharedAliases = zones => {
  const groups = new Map()
  Object.values(zones).forEach(({ meta, names }) => {
    if (!groups.has(meta)) {
      groups.set(meta, [])
    }
    groups.get(meta).push(new Set(names))
  })

  const shared = {}
  groups.forEach((members, meta) => {
    if (members.length < 2) {
      return
    }
    const names = [...members[0]].filter(name => members.every(member => member.has(name)))
    if (names.length > 0) {
      shared[meta] = new Set(names)
    }
  })
  return shared
}

export default getSharedAliases
