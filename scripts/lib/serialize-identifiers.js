// Each row starts with its canonical ID, followed by aliases. A leading slash
// abbreviates the canonical ID's directory; bare names (UTC, Japan) stay literal.
export const serializeIdentifiers = identifiers => {
  const groups = new Map()
  for (const target of [...new Set(Object.values(identifiers))].sort()) {
    if (identifiers[target] !== target) throw new Error(`Missing canonical identifier: ${target}`)
    groups.set(target, [])
  }
  for (const id of Object.keys(identifiers).sort()) {
    const target = identifiers[id]
    if (id !== target) groups.get(target).push(id)
  }
  const rows = [...groups].map(([target, aliases]) => {
    const prefix = target.slice(0, target.lastIndexOf('/') + 1)
    return [target, ...aliases.map(id => prefix && id.startsWith(prefix) ? id.slice(prefix.length - 1) : id)].join(' ')
  })
  return `// Rows contain a canonical ID followed by aliases; /aliases share its directory.
const rows = ${JSON.stringify(rows, null, 2)}
const identifiers = {}
for (const row of rows) {
  const [target, ...aliases] = row.split(' ')
  const directory = target.slice(0, target.lastIndexOf('/'))
  identifiers[target] = target
  for (const alias of aliases) {
    identifiers[alias.startsWith('/') ? directory + alias : alias] = target
  }
}
export default identifiers
`
}
