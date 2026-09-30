import { readFile } from 'node:fs/promises'
import { columns, csvPath, byPopulation } from './_lib.js'

// GeoNames fields cannot contain newlines; quoted commas and quotes are preserved.
const parseRow = line => {
  const fields = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        field += '"'
        i += 1
      } else {
        quoted = !quoted
      }
    } else if (char === ',' && !quoted) {
      fields.push(field)
      field = ''
    } else {
      field += char
    }
  }
  if (quoted) {
    throw new Error('Unclosed CSV quote')
  }
  fields.push(field)
  return fields
}

const load = async () => {
  const text = await readFile(csvPath, 'utf8')
  const lines = text.trimEnd().split(/\r?\n/)
  const header = parseRow(lines.shift())
  if (header.join('\t') !== columns.join('\t')) {
    throw new Error('Unexpected CSV header; run pnpm update:cities')
  }
  return lines.map(line => {
    const fields = parseRow(line)
    if (fields.length !== columns.length) {
      throw new Error('Unexpected CSV column count')
    }
    return Object.fromEntries(columns.map((column, i) => [column, fields[i]]))
  }).sort(byPopulation)
}

export default load
