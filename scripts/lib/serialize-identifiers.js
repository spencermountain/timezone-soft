// Rows are grouped by directory and start with a canonical basename. A leading slash
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
  const directories = {}
  for (const [target, aliases] of groups) {
    const prefix = target.slice(0, target.lastIndexOf('/') + 1)
    const row = [target.slice(prefix.length), ...aliases.map(id => prefix && id.startsWith(prefix) ? id.slice(prefix.length - 1) : id)].join(' ')
    const directory = prefix.slice(0, -1)
    directories[directory] = directories[directory] || []
    directories[directory].push(row)
  }
  return `// Rows contain a canonical basename followed by aliases; /aliases share its directory.
const directories = ${JSON.stringify(directories, null, 2)}
const identifiers = {}
for (const [directory, rows] of Object.entries(directories)) {
  for (const row of rows) {
    const [name, ...aliases] = row.split(' ')
    const target = directory ? directory + '/' + name : name
    identifiers[target] = target
    for (const alias of aliases) {
      identifiers[alias.startsWith('/') ? directory + alias : alias] = target
    }
  }
}
export default identifiers
`
}
