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
