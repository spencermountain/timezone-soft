# timezone-soft

Parse abbreviated and informal timezone names into IANA timezone candidates.

```sh
npm install timezone-soft
```

```js
import soft from 'timezone-soft'

const matches = soft('milwaukee')
const timezone = matches[0]
if (timezone) {
  console.log(timezone.iana) // 'America/Chicago'
  console.log(timezone.standard.abbr) // 'CST'
  console.log(timezone.daylight?.abbr) // 'CDT'
}
```

CommonJS is supported too:

```js
const soft = require('timezone-soft')

soft('EST')[0].iana // 'America/New_York'
soft('central')[0].iana // 'America/Chicago'
soft('venezuela')[0].iana // 'America/Caracas'
soft('south east asia')[0].iana // 'Asia/Bangkok'
```

## API

### `soft(input: string)`

Returns an array of matching timezone objects, ordered by preference. An empty or
unrecognized string returns `[]`. Other input types throw a `TypeError` with the
message `timezone-soft expects a string`.

A match looks like this:

```js
{
  name: 'Central Time',
  iana: 'America/Chicago',
  standard: {
    name: 'Central Standard Time',
    abbr: 'CST',
    offset: -6
  },
  daylight: {
    name: 'Central Daylight Time',
    abbr: 'CDT',
    offset: -5,
    start: '2nd-sun-mar-2h',
    end: '1st-sun-nov-2h'
  },
  long: '(UTC-06:00) Central Time (US & Canada)'
}
```

Offsets are hours east of UTC; negative values are west of UTC. `daylight` can be
`null`. Its `start` and `end` values are descriptive rule strings, not timestamps.
TypeScript declarations support ESM imports and CommonJS `import = require()`.

### `soft.version`

The package version as a string. The older `soft.prototype.version` remains
available for compatibility.

## Ambiguous inputs

Abbreviations can describe several places. For example:

```js
soft('IST').map(zone => zone.iana)
// ['Asia/Kolkata', 'Europe/Dublin', 'Asia/Jerusalem', 'Asia/Colombo']
```

Exact supported IANA IDs select that zone directly. Alias matches are sorted by
the number of packed aliases associated with each zone, descending. Ties preserve
insertion order in the source data. This is a heuristic, not a population ranking
or a confidence score; adding aliases can change the preferred result.

Show all candidates when ambiguity matters, or ask for a city or IANA ID. The
library does not use the user's location to choose a result. Regression fixtures
cover the ordering of `CST`, `IST`, and `BST`.

## UTC and GMT offsets

Whole-hour offsets from UTC-12 through UTC+14 are supported:

```js
soft('UTC+0')[0].iana // 'Etc/GMT'
soft('UTC+14')[0].iana // 'Etc/GMT-14'
soft('-5h')[0].iana // 'Etc/GMT+5'
```

Surrounding whitespace is accepted for offset inputs. `UTC-5` means five hours
behind UTC. For compatibility, `GMT+5` follows the reversed IANA `Etc/GMT+5`
convention; its numeric offset and `long` description use the normal UTC sign.

Fractional offset strings such as `UTC+5:30` return `[]`: the IANA fixed-offset
`Etc/GMT` IDs have whole-hour precision. Use a named zone such as `Asia/Kolkata` or
`india` instead. See the [IANA definitions](https://data.iana.org/time-zones/tzdb/etcetera).

## Dates and daylight saving time

This package finds timezone names and supplies curated display metadata. Its
bundled DST rules are approximate, are not versioned by year, and are not suitable
for calculating historical or future transitions. See the
[data notes](data/README.md) for the rule syntax and provenance limitations.

Use a date-aware timezone library to determine the applicable abbreviation at a
specific instant. For example, with [spacetime](https://github.com/spencermountain/spacetime):

```js
const spacetime = require('spacetime')
const soft = require('timezone-soft')

const display = soft('montreal')[0]
if (display) {
  const now = spacetime.now(display.iana)
  const info = now.isDST() && display.daylight ? display.daylight : display.standard
  console.log(now.time() + ' ' + info.abbr)
}
```

The returned metadata is only as current as this package's data. Current runtime
coverage checks track known missing records for `America/Ciudad_Juarez` and
`America/Coyhaique`; these currently return `[]`.

## Browsers and supported runtimes

The package exports ESM and CommonJS builds. `builds/timezone-soft.min.cjs` is also
a standalone UMD script: when loaded with a classic `<script>` tag, it exposes
`timezoneSoft` globally and includes its dependencies.

CI is configured for Node.js 22, 24, and 26. Development requires Node 22.13+ on
22.x, or Node 24+; `.nvmrc` selects Node 24. Browser bundles receive isolated
JavaScript-context smoke tests, not a full browser compatibility matrix.

## Development

Use npm as the primary package manager:

```sh
npm ci
npm run check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the project layout, adding aliases,
tests, and releases. See [changelog.md](changelog.md) for changes.

## Background

Humans use a different informal scheme from [IANA timezone IDs](https://www.iana.org/time-zones):
PST, EST, CEST, IST, city names, and regional names. Those names collide and their
meaning can depend on the date. This library applies opinionated heuristics to
help turn that input into useful candidates.

Originally built for [spacetime](https://github.com/spencermountain/spacetime),
and formerly called `spacetime-informal`.

By [Spencer Kelly](https://spencermountain.github.io/). [MIT](LICENSE).

Related: [TimeZoneNames](https://github.com/mattjohnsonpint/TimeZoneNames) for .NET.
