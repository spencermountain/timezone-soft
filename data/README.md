# Timezone data

## Source of truth

Edit `zones/*.json`, `metas.json`, `dst-patterns.json`, and `countries.json`.
`index.js` aggregates the regional records for build and maintenance scripts.
Running `pnpm run build` validates these sources, writes the packed modules in
`src/_generated/`, and builds the distributable bundles.

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
| `meta` | Key into `metas.json` |
| `hem` | `n` or `s`; maintenance metadata omitted from runtime records |
| `dst` | Optional key into `dst-patterns.json` |
| `offset` | Legacy offset in hours, kept equal to spacetime's zonefile; not a runtime standard-offset source |
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
`data/metas.json`.

Metazones use `std: [abbr, offset, optionalName]` and optionally the same tuple for
`dst`. Offsets are hours east of UTC. `name` and `long` customize display text.
Some inherited metadata fields are informational and are not read by the formatter.

There is no separate alias table: every extra spelling lives in a zone's `names`.
That includes non-IANA IDs other libraries still emit, such as `us/pacific-new`
or `asia/volgograd`. Cross-zone alias collisions are expected and preserved.
Lookup candidates are deduplicated, then ranked by packed alias count, with
insertion order breaking ties. IANA IDs containing `/` bypass alias ranking; bare
links such as `EST` and `MST` are ranked like any other abbreviation. Returned
candidates are mapped through `iana-identifiers.json` and deduplicated after ranking.

A few inputs are handled in code rather than data: `utc/gmt+5` is read as
`Etc/GMT+5`, and the placeholders `Factory` and `Etc/Unknown` resolve to `Etc/UTC`.

`iana-identifiers.json` is an imported IANA 2026d Zone/Link catalog (main source
files plus `backward`, excluding `backzone`). It versions identifier relationships
only, not offsets or DST metadata. Releases 2026e and 2026f added or renamed no
identifiers, so it is still current. Its importer, `scripts/import/iana-identifiers.js`,
was removed in commit `0fcadb0`; recover it from git history to refresh the table.
It reads the archive version, resolves link chains, and rejects cycles or missing
targets. Review canonical-ID changes and run the full check suite.
Every editable zone must have a bundled record for its canonical target.

The generated catalog groups canonical basenames by directory, then lists aliases
after each basename. Each directory and canonical name is stored once. A leading
`/` on an alias reuses the canonical ID's directory; bare and
cross-directory aliases remain literal. The module reconstructs the same full
lookup object at import time. The build uses `test/_lib/serialize-identifiers.js`
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
one-off transitions.

`start` is always when DST turns on (clocks go forward) and `end` when it turns
off. Southern-hemisphere zones therefore start late in the year and end early in
the next: Sydney is `1st-sun-oct-2h|1st-sun-apr-3h`. Remove a pattern once no zone
references it.

Use a maintained, date-aware timezone implementation for actual transitions,
historical dates, or future scheduling. Validation checks references and shapes;
it does not prove the political or historical accuracy of these patterns.

## Validation and refresh

`pnpm run validate:data` checks zone shapes, metazone tuples, and DST pattern syntax. The build runs it before packing.

For a refresh, identify the upstream version, review affected zone IDs and aliases,
update display metadata and patterns together, and add representative tests.
Review ranking changes and remove resolved entries from the runtime Intl known-gap
list. Regenerate and commit the outputs. `test/fixtures/README.md` describes the
older snapshots used for compatibility testing.

`pnpm run upkeep:spacetime` compares every zone with the installed spacetime
zonefile: unresolved IDs, offsets, next year's DST dates, and the legacy `offset`
and `hem` fields. Run it after updating spacetime. Accepted differences are listed
at the top of `scripts/upkeep/spacetime.js`; it exits non-zero on anything else.
Havana is reported while its 2027 one-off change cannot be written as a rule.

`test/dst-rules.test.js` checks every DST pattern against the runtime's own
transitions for the coming year, and that zones without a pattern have none.
`pnpm run upkeep` normalizes zone `names`; `pnpm run upkeep:overlap` lists the
most widely shared names.

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

Its generator, `scripts/import/offset-fixtures.py`, was removed in commit `0fcadb0`.
To regenerate, recover it from git history; it needs Python 3.9+ and `zic`. The
only future change in 2026f is Cuba, which is not in the fixture.

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

Display abbreviations follow the provinces rather than IANA's placeholders:
PCT (Pacific Time) for Vancouver, ABT (Alberta Time) for Edmonton, and MBT
(Manitoba Standard Time) for Winnipeg, as published by
[British Columbia](https://news.gov.bc.ca/releases/2026CITZ0009-001073),
[Alberta](https://www.alberta.ca/albertas-new-time-system-abt), and
[Manitoba](https://www.gov.mb.ca/timechange/index.html). IANA's MST, CST, and
EST still find these zones. Inuvik keeps CST: the Northwest Territories names
its time "Northwest Territories Time" without an abbreviation. Dawson Creek and
Fort Nelson keep their existing MST, which British Columbia did not change.

This static API exposes the announced permanent regime, not the abbreviation
at a given historical instant. In 2026e, IANA temporarily retains the previous
DST abbreviations until November 1, 2026; Manitoba's legal change is October 31.
The offset fixtures sample every month of 2027, after those changes, and include
Los Angeles, Denver, and Chicago as controls. Use a date-aware implementation
for dates during the transition or before it.
