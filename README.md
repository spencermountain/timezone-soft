<div align="center">

  <div>interpret abbreviated and informal timezone names</div>
  <div><img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" /></div>

  <div align="center">
    <a href="https://npmjs.org/package/spacetime-informal">
      <img src="https://img.shields.io/npm/v/spacetime-informal.svg?style=flat-square" />
    </a>
    <!-- <a href="https://codecov.io/gh/spencermountain/spacetime-informal">
      <img src="https://codecov.io/gh/spencermountain/spacetime-informal/branch/master/graph/badge.svg" />
    </a> -->
    <a href="https://unpkg.com/spacetime-informal/builds/spacetime-informal.min.js">
      <img src="https://badge-size.herokuapp.com/spencermountain/spacetime-informal/master/builds/spacetime-informal.min.js" />
    </a>
  </div>
  <div align="center">
    <code>spacetime-informal</code>
  </div>
  <sub>
    by
    <a href="https://spencermountain.github.io/">Spencer Kelly</a>
  </sub>
</div>
<p></p>

The [IANA timezone database](https://www.iana.org/time-zones) is the official nomenclature for timezone information, and is what you should use, whenever possible.

Humans though, *are goofballs*, and use a whole different informal scheme.

---

* In (North) America, we use:  **PST, MST, EST**...
* in Europe (lately) they use: **WEST, CEST, EEST**...
* in Africa they use:          **EAT, CAT, WAST**...
* in Australia they use:       **AWST, AEDT, ACST**...
---

these line-up with the IANA timezones sometimes. Other times they don't.

These names collide all the time, (like IST - *irish/indian* stardard time).

These names produce all-sorts of ambiguities, regarding DST-changes -
Both Winnipeg and Mexico City are **CST**, but have a much different DST schedule:
![image](https://user-images.githubusercontent.com/399657/52489224-b34d0e00-2b8f-11e9-9de8-0688bec52464.png)

*(thanks [timeanddate.com](https://www.timeanddate.com)!)*

Of course, there's a bunch of political/historical/disputed stuff going on, too. Apologies if I step into this unknowingly.

This library is an attempt to 'soften' this exchange, between human-IANA, using some *opinionated-but-common-sense* rules and decision-making.

It was built for use in the [spacetime](https://github.com/spencermountain/spacetime) timezone library, but may be used without it.

```js
const informal = require('spacetime-informal')

informal.find('EST')
// 'America/New_York'

informal.find('central')
// 'America/Chicago'

informal.find('venezuela')
// 'America/Caracas'

informal.find('south east asia')
// 'Asia/Bangkok'

informal.display('Toronto')
/*{
  standard: { name: 'Eastern Standard Time', abbrev: 'EST' },
  daylight: { name: 'Eastern Daylight Time', abbrev: 'EDT' },
  iana: 'Canada/Toronto'
}*/
```

it was built to be as forgiving as possible, and return the most common-sense IANA timezone id from user-input.

---

along with [spacetime](https://github.com/spencermountain/spacetime), you can generate human-friendly time formats, like this:
```js
const spacetime = require('spacetime')
const informal = require('spacetime-informal')

let display = informal.display('montreal')
let s = spacetime.now(display.iana)
let abbrev = s.isDST() ? display.daylight.abbrev : display.standard.abbrev // (add some null-checks)
let time = `${s.time()} ${abbrev}`
// '4:20pm EDT'
```

work-in-progress.

MIT
