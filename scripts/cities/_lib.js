const columns = [
  'geoname_id', 'name', 'ascii_name', 'alternate_names', 'latitude', 'longitude',
  'feature_class', 'feature_code', 'country_code', 'alternate_countries',
  'admin1', 'admin2', 'admin3', 'admin4', 'population', 'elevation', 'dem',
  'timezone', 'modified'
]
const csvPath = new URL('./cities1000.csv', import.meta.url)
const byPopulation = (a, b) => Number(b.population) - Number(a.population) || Number(a.geoname_id) - Number(b.geoname_id)
const csvRow = row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')

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

export { columns, csvPath, byPopulation, csvRow, parseRow }
