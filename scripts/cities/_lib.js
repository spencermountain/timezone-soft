const columns = [
  'geoname_id',
  'name',
  'ascii_name',
  'alternate_names',
  'latitude',
  'longitude',
  'feature_class',
  'feature_code',
  'country_code',
  'alternate_countries',
  'admin1',
  'admin2',
  'admin3',
  'admin4',
  'population',
  'elevation',
  'dem',
  'timezone',
  'modified'
]
const csvPath = new URL('./cities1000.csv', import.meta.url)
const byPopulation = (a, b) =>
  Number(b.population) - Number(a.population) || Number(a.geoname_id) - Number(b.geoname_id)
const csvRow = (row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')

export { columns, csvPath, byPopulation, csvRow }
