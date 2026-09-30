import zones from '../../data/index.js'
import metas from '../../data/metas.js'
import patterns from '../../data/dst-patterns.js'
import aliases from '../../data/aliases.js'
import identifiers from '../../data/iana-identifiers.js'

const text = value => typeof value === 'string' && value.trim().length > 0
const offset = value => Number.isFinite(value) && value >= -14 && value <= 14
const displayFields = ['name', 'long']
// Stored transitions look like last-sun-mar-1h; each pattern has a start and end.
const rule = /^(?:[1-5](?:st|nd|rd|th)|last)-(?:sun|mon|tue|wed|thu|fri|sat)-(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-\d{1,2}h$/
const validTuple = tuple => Array.isArray(tuple) && tuple.length >= 2 && tuple.length <= 3 &&
  text(tuple[0]) && offset(tuple[1]) && (tuple[2] === undefined || text(tuple[2]))

// Check source records before packing. Tests can supply small, independent fixtures.
const validateData = (data = { zones, metas, patterns, aliases, identifiers }) => {
  const errors = []
  const check = (condition, message) => {
    if (!condition) {
      errors.push(message)
    }
  }

  Object.entries(data.patterns).forEach(([name, pattern]) => {
    const transitions = typeof pattern === 'string' ? pattern.split('|') : []
    check(transitions.length === 2 && transitions.every(value => rule.test(value)),
      `DST pattern ${name}: expected two transition rules`)
  })

  // Metazones supply display abbreviations and offsets; daylight data is optional.
  Object.entries(data.metas).forEach(([name, meta]) => {
    check(validTuple(meta.std), `Metazone ${name}.std: expected [abbreviation, offset, optional name]`)
    if (meta.dst !== undefined) {
      check(validTuple(meta.dst), `Metazone ${name}.dst: expected [abbreviation, offset, optional name]`)
    }
    displayFields.forEach(field => {
      check(meta[field] === undefined || text(meta[field]), `Metazone ${name}.${field}: expected a nonempty string`)
    })
  })

  // Every alias target and metadata reference must survive packing into runtime data.
  Object.entries(data.zones).forEach(([id, zone]) => {
    if (data.identifiers) {
      check(Object.hasOwn(data.identifiers, id), `Zone ${id}: not in the pinned IANA catalog`)
      check(Object.hasOwn(data.zones, data.identifiers[id]), `Zone ${id}: missing canonical record ${data.identifiers[id]}`)
    }
    check(/^[A-Za-z_]+\/[A-Za-z0-9_+\-/]+$/.test(id), `Zone ${id}: invalid identifier`)
    check(Object.hasOwn(data.metas, zone.meta), `Zone ${id}: unknown metazone ${zone.meta}`)
    check(zone.dst === undefined || Object.hasOwn(data.patterns, zone.dst), `Zone ${id}: unknown DST pattern ${zone.dst}`)
    check(['n', 's'].includes(zone.hem), `Zone ${id}: hemisphere must be n or s`)
    // Legacy offset fields are checked for shape, not against current timezone rules.
    check(offset(zone.offset), `Zone ${id}: invalid legacy offset`)
    check(zone.hours === undefined || Number.isFinite(zone.hours), `Zone ${id}: invalid legacy DST hours`)
    check(Array.isArray(zone.names) && zone.names.length > 0 && zone.names.every(text), `Zone ${id}: names must be nonempty strings`)
  })

  Object.entries(data.aliases).forEach(([alias, ids]) => {
    check(text(alias) && Array.isArray(ids) && ids.length > 0, `Alias ${alias}: expected zone IDs`)
    if (Array.isArray(ids)) {
      ids.forEach(id => {
        check(Object.hasOwn(data.zones, id), `Alias ${alias}: unknown zone ${id}`)
      })
    }
  })

  // Report all broken records together so a data edit can be fixed in one pass.
  if (errors.length > 0) {
    throw new Error(`Invalid timezone data:\n${errors.join('\n')}`)
  }
  return Object.keys(data.zones).length
}

export { validateData }
