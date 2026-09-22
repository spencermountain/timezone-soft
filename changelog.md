### 1.6.0 [Sep 2026]

- **[fix]** - point the legacy `types` entry to CommonJS declarations so Node10 resolution matches `main`
- **[change]** - canonicalize returned IDs using pinned IANA 2026d links and deduplicate equivalent candidates; retain old spellings as input aliases
- **[fix]** - preserve explicit IANA identifiers, including Urumqi, Berlin, Simferopol, and Palmer, instead of guessing from informal aliases
- **[fix]** - prefer Etc/UTC for UTC and reject nonexistent Etc/GMT+13 and Etc/GMT+14 IDs
- **[fix]** - name Dublin's winter GMT correctly and document its compatible winter/summer display convention
- **[change]** - organize editable data under `data/`, generated files under `src/generated/`, and historical test fixtures under `test/fixtures/`
- **[change]** - validate data before packing and test ambiguous ranking plus current runtime timezone coverage
- **[change]** - document data provenance, ranking, DST limitations, contribution steps, and the release process
- **[change]** - add Node 22/24/26 CI and isolated npm tarball tests
- **[fix]** - expose `soft.version` and throw a clear `TypeError` for non-string input
- **[fix]** - bundle dependencies in all builds, including standalone browser bundles
- **[fix]** - resolve zero offsets correctly and support UTC+13 and UTC+14
- **[fix]** - correct UTC signs in GMT zone descriptions and reject offset strings with unrelated prefixes
- **[fix]** - typescript declarations for nullable daylight information, DST start/end rules, and CommonJS imports
- **[update]** - README examples, return-value documentation, and fractional-offset limitations
- **[update]** - dependencies and lockfiles
- **[change]** - add offset regression tests, distribution smoke tests, and typescript consumer checks
- **[change]** - fail builds on unresolved dependencies or missing browser globals; add `npm run check`
- **[update]** - dependencies

### 1.5.2 [Jan 2024]

- **[fix]** - AEDT Brisbane issue #27
- **[update]** - dependencies

### 1.5.1 [Nov 2023]

- **[fix]** - inverted typescript issue #25
- **[update]** - deps

### 1.5.0 [April 2023]

- **[fix]** - inverted GMT zones #21
- **[change]** - add GMT+14, -14
- **[change]** - update dependencies

### 1.4.1 [August 2022]

- **[change]** - move ireland off of british standard time

### 1.4.0 [July 2022]

- **[change]** - internal refactor
- **[change]** - add dst date
- **[fix]** - fix missing timezones #17

### 1.3.1 [July 2021]

- **[fix]** - path to esmodule build

### 1.3.0 [July 2021]

- **[change]** - convert to esmodules (should not be breaking)
- **[change]** - update IANA zones (thanks mchangrh!)
- **[fix]** - mis-encoded iana codes with underscores
- **[change]** - update dependencies

### 1.2.0 [March 2021]

- **[change]** - return abbr instead of sometimes 'abbrev'
- **[change]** - improved metazone results & abbreviations
- **[change]** - shorten abbrev: 'GMT+8' instead of etc/gmt+8

### 1.0.0 [March 2021]

- **[breaking]** - return an array for `.find()`
- rename library to _timezone-soft_

### 0.6.1 [March 2021]

- better support for GMT-X offsets

### 0.6.0 [March 2021]

- add (way) more cities and provinces & compression scheme using efrt-unpack
- update deps

### 0.4.0

- add more formats from tzinfo db
- fix case-sensitivity issue
- more testing

### 0.3.0

- add more zones for new zealand #3

### 0.2.0

- add more abbreviations from [wikipedia](https://En.wikipedia.org/Wiki/List_Of_Time_Zone_Abbreviations)
