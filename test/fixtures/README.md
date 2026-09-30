# Test fixtures

- `intl-timezones-2022-08.js`: timezone list originally embedded in `intl.test.js`,
  labeled August 2022. Retained for historical input compatibility.
- `spacetime-zones-2022.js`: inherited `zonefile.2022.js` snapshot used by the
  diagnostic offset script. Its exact upstream release is not recorded.
- `legacy-zone-records.js`: inherited `_current.js` reference records. The capture
  date and tzdb release are unknown; the filename no longer implies freshness.
- `legacy-alias-ids.js`: inherited `_outdated.js` list, retained as historical
  reference material. It is not a current authoritative list of deprecated IDs.
- `ambiguous-ranking.json`: expected ordered candidates for CST, IST, and BST,
  captured in September 2026 before the data-layout refactor, then mapped through
  the IANA 2026d canonical IDs. The duplicate Rainy River/Winnipeg CST candidate
  was merged; Ojinaga was subsequently added to CST after correcting its Central
  timezone metadata. All preexisting CST candidates retain their relative order. Review changes as
  public behavior changes rather than blindly regenerating this file.
- `intl-known-gaps.js`: explicit missing records discovered in the September 2026
  runtime audit. These are coverage limitations, not substitute aliases. The
  runtime coverage test fails on additional missing IDs and on resolved exceptions.

`intl-current.test.js` independently checks `Intl.supportedValuesOf('timeZone')`
from the installed runtime and reports its Node, ICU, and tz versions. Differences
between runtimes are expected. The legacy fixtures and Intl checks validate name coverage, not metadata freshness.

`offsets-2026e.json` separately validates display offsets across twelve dates in
2027 for 48 reviewed zones. It comes from compiled IANA 2026e data, records the
archive hash, and handles Dublin and Morocco explicitly. Regenerate with
`python3 scripts/import-offset-fixtures.py /path/to/tzdata2026e.tar.gz`; see
`data/README.md` for scope and update instructions.
