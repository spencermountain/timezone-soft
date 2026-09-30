<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />
  <div>informal timezone lookup</div>
  <a href="https://npmjs.org/package/timezone-soft">
    <img src="https://img.shields.io/npm/v/timezone-soft.svg?style=flat-square" />
  </a>
  <a href="https://bundlephobia.com/result?p=timezone-soft@latest">
    <img src="https://badgen.net/bundlejs/min/timezone-soft" />
  </a>
  <div><code>npm install timezone-soft</code></div>
</div>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

```js
import tzSoft from 'timezone-soft'

const matches = tzSoft('milwaukee')
matches[0].iana // 'America/Chicago'
```

People are not often aware of timezone [IANA IDs](https://www.iana.org/time-zones), and tend to use informal schemes to refer to timezones - things like `'PST'`, `'eastern time'`, `'vancouver bc'`, and `'china'`. 

These names have cultural overlap, and their meaning can depend on the date. 

This library applies opinionated heuristics to help turn this user-input into ranked matching IANA candidates.

Originally built for [spacetime](https://github.com/spencermountain/spacetime),
and formerly called `timezone-soft-informal`. This is a compressed dictionary of lookup terms for timezone ids, and some basic ranking heuristics when >1 results.

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />
</div>

### Usage
```js
const tzSoft = require('timezone-soft') //commonjs supported

tzSoft('EST')[0].iana // 'America/New_York'
tzSoft('central')[0].iana // 'America/Chicago'
tzSoft('venezuela')[0].iana // 'America/Caracas'
tzSoft('south east asia')[0].iana // 'Asia/Bangkok'
```

`tzSoft(input: string)`

This returns an array of matching timezone objects, ordered by preference. An empty or
unrecognized string returns `[]`

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
`null`. 

`start` and `end` values are descriptive rule strings.


## Ambiguous inputs

Abbreviations can describe several places. For example:

```js
soft('IST').map(zone => zone.iana)
// ['Asia/Kolkata', 'Europe/Dublin', 'Asia/Jerusalem', 'Asia/Colombo']
```

Explicit IANA IDs containing `/` are resolved case-insensitively through the pinned
IANA **2026d** Zone/Link table before informal matching. Unknown IDs are not guessed
from their city component. A recognized ID without bundled display metadata returns
`[]`. Curated non-IANA phrases containing `/` can still match registered aliases.

All returned IDs use that table's canonical targets. For example, `Europe/Kiev`
returns `Europe/Kyiv`, `Asia/Kashgar` returns `Asia/Urumqi` (UTC+6, distinct from
Shanghai's UTC+8), and `America/Yellowknife` returns `America/Edmonton`.
This policy uses the main IANA files plus `backward`, not the optional `backzone`
historical split. Ordinary abbreviations such as `EST` remain informal queries.

Alias matches are sorted by
the number of packed aliases associated with each zone, descending. Ties preserve
insertion order in the source data. Canonicalization then merges duplicate targets
while preserving their first occurrence. This is a heuristic, not a population ranking
or a confidence score; adding aliases can change the preferred result.

Show all candidates when ambiguity matters, or ask for a city or IANA ID. The
library does not use the user's location to choose a result. Regression fixtures
cover the ordering of `CST`, `IST`, and `BST`.

## Combined lookup strings

When the whole string does not match, commas and parentheses split it into
additional lookups using the existing aliases:

```js
soft('Springfield, Missouri')[0].iana // 'America/Chicago' (matches Missouri)
soft('Springfield (Missouri)')[0].iana // 'America/Chicago'
soft('Toronto, Ontario, Canada')[0].iana // 'America/Toronto'
soft('CST China')[0].iana // 'Asia/Shanghai'
```

Recognized parts are intersected, preserving the first part's result order.
Unknown comma-separated or parenthesized parts are ignored; conflicting known
parts return `[]`. Without punctuation, both sides of a word-boundary split must
match, so `Springfield Missouri` still returns `[]` while `CST China` resolves.

These are alias fallbacks, not geographic validation. No additional city/country
dataset is stored: the Springfield examples resolve through `Missouri`, not through
a Springfield city record. Existing whole-string matches take precedence.

## UTC and GMT offsets

`UTC` (including lowercase or surrounding whitespace) resolves only to `Etc/UTC`,
with abbreviation `UTC` and name `Coordinated Universal Time`. The aliases `UCT`,
`universal`, `zulu`, and `coordinated universal time` resolve to the same record.
`GMT` resolves to `Etc/GMT`. Geographic aliases cannot outrank these inputs.

Whole-hour offsets from UTC-12 through UTC+14 are supported:

```js
soft('UTC+0')[0].iana // 'Etc/GMT'
soft('UTC+14')[0].iana // 'Etc/GMT-14'
soft('-5h')[0].iana // 'Etc/GMT+5'
```

Surrounding whitespace is accepted for offset inputs. `UTC-5` means five hours
behind UTC. For compatibility, `GMT+5` follows the reversed IANA `Etc/GMT+5`
convention; its numeric offset and `long` description use the normal UTC sign.
`Etc/GMT+13` and `Etc/GMT+14` return `[]` because they are not IANA IDs;
`Etc/GMT-13` and `Etc/GMT-14` remain valid.

Fractional offset strings such as `UTC+5:30` return `[]`: the IANA fixed-offset
`Etc/GMT` IDs have whole-hour precision. Use a named zone such as `Asia/Kolkata` or
`india` instead. See the [IANA definitions](https://data.iana.org/time-zones/tzdb/etcetera).

## Dates and daylight saving time

This package finds timezone names and supplies curated display metadata. Its
bundled DST rules are approximate, are not versioned by year, and are not suitable
for calculating historical or future transitions. See the
[data notes](data/README.md) for the rule syntax and provenance limitations.

Use a date-aware timezone library to determine the applicable abbreviation at a
specific instant. For example, with [spacetime](https://github.com/spencermountain/timezone-soft):

```js
import spacetime from 'spacetime'
import tzSoft from 'timezone-soft'

const display = tzSoft('montreal')[0]
if (display) {
  const now = spacetime.now(display.iana)
  const info = now.isDST() && display.daylight ? display.daylight : display.standard
  console.log(now.time() + ' ' + info.abbr)
}
```

The `standard` and `daylight` fields are conventional display categories, not
IANA's `tm_isdst` flags. In Dublin, `standard` means winter GMT (UTC+0, Greenwich
Mean Time), and `daylight` means summer IST (UTC+1, Irish Standard Time). IANA's
native model treats Irish summer as standard and winter as negative DST; this API
retains its existing winter/summer arrangement for compatibility. Do not select a
field using a raw IANA DST flag without reconciling those conventions.

The identifier table is versioned independently of display metadata. The returned
metadata is only as current as this package's curated data. Coverage includes
`America/Ciudad_Juarez` (Mountain time with US DST rules) and
`America/Coyhaique` (permanent UTC−3). Runtime coverage checks flag new missing
records.


## TypeScript

```ts
import tzSoft, { type DisplayFormat } from 'timezone-soft'

const matches: DisplayFormat[] = tzSoft('montreal')
const zone = matches[0]

if (zone) {
  console.log(zone.iana) // 'America/Toronto'
  console.log(zone.standard.abbr) // 'EST'
  console.log(zone.daylight?.abbr) // 'EDT'; undefined for zones without DST
} else {
  console.log('No matching timezone')
}
```

### See also

- [city-timezones](https://github.com/kevinroberts/city-timezones) — find IANA timezones by city, state, or country.
- [@vvo/tzdb](https://github.com/vvo/tzdb) — timezone data with friendly names and major cities for timezone selectors.
- [@coroboros/location-timezone](https://github.com/elysiumphase/node-location-timezone) — timezone lookups by city, country, or capital.
- [chrono-node](https://github.com/wanasit/chrono) — natural-language date parsing with timezone abbreviation support.
- [tz-lookup](https://github.com/darkskyapp/tz-lookup-oss) — approximate timezone lookup from latitude and longitude.
- [TimeZoneNames](https://github.com/mattjohnsonpint/TimeZoneNames) for .NET.

MIT, PRs welcome
