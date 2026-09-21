# Timezone data

## Source of truth

Edit `zones/*.js`, `metas.js`, `dst-patterns.js`, and `aliases.js`. `index.js`
aggregates the regional records for build and maintenance scripts. Running
`npm run build` validates these sources and writes `src/generated/zones.js`,
`src/generated/version.js`, and the distributable bundles.

This is a curated dataset inherited from earlier timezone-soft/spacetime work.
It is not currently a reproducible import of a specific IANA or CLDR release.
The original release/date of every record is not recorded. Do not describe it as
an up-to-date copy of tzdb. For future changes, record the upstream URL and version
or access date in the change description and, where useful, beside the record.
The [IANA database](https://www.iana.org/time-zones) is the reference for zone IDs
and transition history. Informal aliases and result preferences are project policy.

## Zone records

| Field | Meaning |
| --- | --- |
| Object key | Preferred IANA identifier returned by lookup |
| `names` | Nonempty array of informal spellings and historical ID aliases |
| `meta` | Key into `metas.js` |
| `hem` | `n` or `s`; retained hemisphere metadata |
| `dst` | Optional key into `dst-patterns.js` |
| `offset` | Legacy snapshot offset in hours; not a runtime standard-offset source |
| `hours` | Optional legacy DST adjustment metadata; not used by the formatter |

Legacy `offset` values include seasonal offsets and must not be assumed to equal
the metazone's standard offset. They are retained for historical audits and are
omitted from packed runtime records. The runtime `standard.offset` and
`daylight.offset` come exclusively from metazone tuples. A future removal of the
legacy fields should be separate from a timezone correctness update.

The packed tuple is `[packedNames, meta, hem, optionalDstPattern]`. Its field order
is part of the generator/runtime contract, not a public API.

## Metazones and aliases

Metazones use `std: [abbr, offset, optionalName]` and optionally the same tuple for
`dst`. Offsets are hours east of UTC. `name` and `long` customize display text.
Some inherited metadata fields are informational and are not read by the formatter.

`aliases.js` maps special strings directly to arrays of zone IDs. All targets
must exist. Cross-zone alias collisions are expected and preserved. Lookup
candidates are deduplicated, then ranked by packed alias count, with insertion
order breaking ties. Aliases from this special table do not contribute to that
count. Exact supported IANA IDs bypass alias ranking. Returned candidates are mapped
through `iana-identifiers.js` and deduplicated after ranking.

`iana-identifiers.js` is an imported IANA 2026d Zone/Link catalog (main source
files plus `backward`, excluding `backzone`). It versions identifier relationships
only, not offsets or DST metadata. To refresh it, download a reviewed IANA release
archive and run `node scripts/import-iana-identifiers.js /path/to/tzdata2026d.tar.gz`.
The importer reads the archive version, resolves link chains, and rejects cycles
or missing targets. Review canonical-ID changes and run the full check suite.
Every editable zone must have a bundled record for its canonical target.

## DST rule strings

Patterns contain two rules separated by `|`, exposed as `start` and `end`:

```text
2nd-sun-mar-2h|1st-sun-nov-2h
```

Each rule describes an ordinal weekday (`1st` through `5th`, or `last`), a
three-letter weekday, month, and hour. The example describes the second Sunday of
March at 02:00 and first Sunday of November at 02:00. These are legacy descriptive
heuristics: they have no effective years, cannot represent all minute-level or
one-off transitions, and do not consistently encode chronological/DST-start order
for southern-hemisphere zones. The API retains their existing ordering.

Use a maintained, date-aware timezone implementation for actual transitions,
historical dates, or future scheduling. Validation checks references and shapes;
it does not prove the political or historical accuracy of these patterns.

## Validation and refresh

`npm run validate:data` checks zone shapes, metazone tuples, DST pattern syntax,
and special-alias targets. The build runs it before packing.

For a refresh, identify the upstream version, review affected zone IDs and aliases,
update display metadata and patterns together, and add representative tests.
Review ranking changes and remove resolved entries from the runtime Intl known-gap
list. Regenerate and commit the outputs. `test/fixtures/README.md` describes the
older snapshots used for compatibility testing.

`node scripts/check-dst.js` compares legacy offsets with standard metadata;
differences are diagnostic and can be legitimate seasonal differences.
`node scripts/fix-offset.js` only prints differences against the 2022 snapshot;
despite its historical name, it does not fix or update records.

## Dublin display convention

For API compatibility, `standard` represents winter GMT and `daylight` represents
summer IST for Dublin. Its standard tuple explicitly names Greenwich Mean Time;
the summer tuple names Irish Standard Time. These display categories do not match
IANA's native negative-DST flags for Ireland. Use offsets and the documented
convention when integrating another library's seasonal classification.
