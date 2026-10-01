# Timezone data

## Source of truth

Edit `zones/*.js`, `metas.js`, `dst-patterns.js`, and `aliases.js`. `index.js`
aggregates the regional records for build and maintenance scripts. Running
`pnpm run build` validates these sources and writes `src/_generated/zones.js`,
`src/_generated/metas.js`, `src/_generated/version.js`, and the distributable bundles.

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
| `hem` | `n` or `s`; maintenance metadata omitted from runtime records |
| `dst` | Optional key into `dst-patterns.js` |
| `offset` | Legacy snapshot offset in hours; not a runtime standard-offset source |
| `hours` | Optional legacy DST adjustment metadata; not used by the formatter |

Legacy `offset` values include seasonal offsets and must not be assumed to equal
the metazone's standard offset. They are retained for historical audits and are
omitted from packed runtime records. The runtime `standard.offset` and
`daylight.offset` come exclusively from metazone tuples. A future removal of the
legacy fields should be separate from a timezone correctness update.

The packed tuple is `[packedNames, meta, optionalDstPattern]`. Its field order
is part of the generator/runtime contract, not a public API.

## Metazones and aliases

The build includes only metazones referenced by zone records and their `std`,
`dst`, `name`, and `long` fields. The complete editable metadata remains in
`data/metas.js`.

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

The generated catalog groups canonical basenames by directory, then lists aliases
after each basename. Each directory and canonical name is stored once. A leading
`/` on an alias reuses the canonical ID's directory; bare and
cross-directory aliases remain literal. The module reconstructs the same full
lookup object at import time. The importer uses `scripts/lib/serialize-identifiers.js`
to keep this representation reproducible. `test/identifiers.test.js` pins the
complete catalog with a count and SHA-256 digest of sorted `[ID, target]` pairs;
update those only after reviewing mappings when upgrading the IANA release.

## DST rule strings

Patterns contain two rules separated by `|`, exposed as `start` and `end`:

```text
2nd-sun-mar-2h|1st-sun-nov-2h
```

`24h` means midnight at the end of the named day; Egypt's
`last-thu-oct-24h` ends DST at the end of October's last Thursday.

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

`pnpm run validate:data` checks zone shapes, metazone tuples, DST pattern syntax,
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

## Versioned display-offset checks

`test/fixtures/offsets-2026e.json` records twelve monthly UTC instants in 2027
for 48 reviewed zones. It is generated independently from the IANA 2026e archive
and records the source URL and archive SHA-256. The tests compare both display
categories and every sampled offset, including absence of DST. They run without
network access or dependence on the host Node/ICU timezone version.

To regenerate, install Python 3.9+ and `zic`, then run:

```sh
python3 scripts/import-offset-fixtures.py /path/to/tzdata2026e.tar.gz
```

The generator rejects a different release until its version and sampling year
are explicitly reviewed. When updating, inspect changes to the fixture before
changing metadata. A passing fixture covers only its listed zones and dates;
it is not a claim that all bundled metadata is current. The static display API
does not calculate historical offsets or transitions.

Dublin's negative-DST flags are mapped to this API's winter-standard/summer-daylight
convention. Morocco's 2026d rules move to permanent UTC+0 on September 20, 2026;
the 2027 fixtures intentionally do not apply that metadata to earlier Ramadan
exceptions. Santiago and Norfolk use standard/winter offsets below their summer
offsets; Lord Howe's seasonal adjustment is half an hour. Punta Arenas and
Bougainville have separate metadata so changes to Santiago and Port Moresby do
not alter their permanent offsets.

## Canadian permanent-offset metadata

The IANA 2026e `northamerica` source specifies permanent UTC-7 (MST) for Vancouver,
UTC-6 (CST) for Edmonton and Inuvik, and UTC-5 (EST) for Winnipeg. Dedicated
metazones keep US Pacific, Mountain, and Central seasonal metadata unchanged.
Existing informal aliases remain accepted for compatibility; explicit IANA
links such as `Canada/Pacific` and `America/Yellowknife` use the updated records.

This static API exposes the announced permanent regime, not the abbreviation
at a given historical instant. In 2026e, IANA temporarily retains the previous
DST abbreviations until November 1, 2026; Manitoba's legal change is October 31.
The offset fixtures sample every month of 2027, after those changes, and include
Los Angeles, Denver, and Chicago as controls. Use a date-aware implementation
for dates during the transition or before it.
