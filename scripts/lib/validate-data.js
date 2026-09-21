import zones from '../../data/index.js'
import metas from '../../data/metas.js'
import patterns from '../../data/dst-patterns.js'
import aliases from '../../data/aliases.js'
import identifiers from '../../data/iana-identifiers.js'

const text = value => typeof value === 'string' && value.trim().length > 0
const offset = value => Number.isFinite(value) && value >= -14 && value <= 14
const rule = /^(?:[1-5](?:st|nd|rd|th)|last)-(?:sun|mon|tue|wed|thu|fri|sat)-(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-\d{1,2}h$/

export const validateData = (data = { zones, metas, patterns, aliases, identifiers }) => {
  const errors = []
  const check = (condition, message) => { if (!condition) errors.push(message) }
  for (const [name, pattern] of Object.entries(data.patterns)) {
    check(typeof pattern === 'string' && pattern.split('|').length === 2 && pattern.split('|').every(p => rule.test(p)), `DST pattern ${name}: expected two transition rules`)
  }
  for (const [name, meta] of Object.entries(data.metas)) {
    for (const field of ['std', 'dst']) {
      if (field === 'dst' && meta.dst === undefined) continue
      const tuple = meta[field]
      check(Array.isArray(tuple) && tuple.length >= 2 && tuple.length <= 3 && text(tuple[0]) && offset(tuple[1]) && (tuple[2] === undefined || text(tuple[2])), `Metazone ${name}.${field}: expected [abbreviation, offset, optional name]`)
    }
    for (const field of ['name', 'long']) {
      check(meta[field] === undefined || text(meta[field]), `Metazone ${name}.${field}: expected a nonempty string`)
    }
  }
  for (const [id, zone] of Object.entries(data.zones)) {
    if (data.identifiers) {
      check(Object.hasOwn(data.identifiers, id), `Zone ${id}: not in the pinned IANA catalog`)
      check(Object.hasOwn(data.zones, data.identifiers[id]), `Zone ${id}: missing canonical record ${data.identifiers[id]}`)
    }
    check(/^[A-Za-z_]+\/[A-Za-z0-9_+\-/]+$/.test(id), `Zone ${id}: invalid identifier`)
    check(Object.hasOwn(data.metas, zone.meta), `Zone ${id}: unknown metazone ${zone.meta}`)
    check(zone.dst === undefined || Object.hasOwn(data.patterns, zone.dst), `Zone ${id}: unknown DST pattern ${zone.dst}`)
    check(['n', 's'].includes(zone.hem), `Zone ${id}: hemisphere must be n or s`)
    check(offset(zone.offset), `Zone ${id}: invalid legacy offset`)
    check(zone.hours === undefined || Number.isFinite(zone.hours), `Zone ${id}: invalid legacy DST hours`)
    check(Array.isArray(zone.names) && zone.names.length > 0 && zone.names.every(text), `Zone ${id}: names must be nonempty strings`)
  }
  for (const [alias, ids] of Object.entries(data.aliases)) {
    check(text(alias) && Array.isArray(ids) && ids.length > 0, `Alias ${alias}: expected zone IDs`)
    if (Array.isArray(ids)) {
      for (const id of ids) check(Object.hasOwn(data.zones, id), `Alias ${alias}: unknown zone ${id}`)
    }
  }
  if (errors.length) throw new Error(`Invalid timezone data:\n${errors.join('\n')}`)
  return Object.keys(data.zones).length
}
