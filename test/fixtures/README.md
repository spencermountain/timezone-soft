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
  captured in September 2026 before the data-layout refactor. Review changes as
  public behavior changes rather than blindly regenerating this file.
- `intl-known-gaps.js`: explicit missing records discovered in the September 2026
  runtime audit. These are coverage limitations, not substitute aliases. The
  runtime coverage test fails on additional missing IDs and on resolved exceptions.

`intl-current.test.js` independently checks `Intl.supportedValuesOf('timeZone')`
from the installed runtime and reports its Node, ICU, and tz versions. Differences
between runtimes are expected. These fixtures and checks validate name coverage;
they do not establish that all offsets or DST metadata are current.
