/* eslint-disable no-console */
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { columns, csvPath, byPopulation, csvRow } from './_lib.js'

// GeoNames, CC BY 4.0: https://download.geonames.org/export/dump/readme.txt
const source = 'https://download.geonames.org/export/dump/cities1000.zip'
const maxBuffer = 128 * 1024 * 1024

console.log(`Downloading ${source}`)
const response = await fetch(source)
if (!response.ok) {
  throw new Error(`Download failed: HTTP ${response.status}`)
}
const directory = await mkdtemp(join(tmpdir(), 'timezone-cities-'))
try {
  const archive = join(directory, 'cities1000.zip')
  await writeFile(archive, Buffer.from(await response.arrayBuffer()))
  // Extract only the expected member. Requires the system unzip command.
  const text = execFileSync('unzip', ['-p', archive, 'cities1000.txt'], { encoding: 'utf8', maxBuffer })
  const rows = text.trimEnd().split(/\r?\n/).map((line, index) => {
    const fields = line.split('\t')
    if (fields.length !== columns.length) {
      throw new Error(`Unexpected column count on row ${index + 1}`)
    }
    const row = Object.fromEntries(columns.map((column, i) => [column, fields[i]]))
    if (!row.name || !row.timezone || !/^\d+$/.test(row.population)) {
      throw new Error(`Missing or invalid city data on row ${index + 1}`)
    }
    return row
  })
  rows.sort(byPopulation)
  const csv = [csvRow(columns), ...rows.map(row => csvRow(columns.map(column => row[column])))].join('\n')
  await writeFile(csvPath, csv + '\n')
  console.log(`Wrote ${rows.length.toLocaleString('en-US')} cities to ${csvPath.pathname}, largest population first.`)
} finally {
  await rm(directory, { recursive: true, force: true })
}
