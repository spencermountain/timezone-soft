<div align="center">

  <div>parse abbreviated, sloppy, and informal timezone names</div>
  <div><img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" /></div>

  <div align="center">
    <a href="https://npmjs.org/package/timezone-soft">
      <img src="https://img.shields.io/npm/v/timezone-soft.svg?style=flat-square" />
    </a>
    <!-- <a href="https://codecov.io/gh/spencermountain/timezone-soft">
      <img src="https://codecov.io/gh/spencermountain/timezone-soft/branch/master/graph/badge.svg" />
    </a> -->
    <a href="https://unpkg.com/timezone-soft/builds/timezone-soft.min.js">
      <img src="https://badge-size.herokuapp.com/spencermountain/timezone-soft/master/builds/timezone-soft.min.js" />
    </a>
  </div>
  <div align="center">
    <code>npm install timezone-soft</code>
  </div>
  <div align="center">
    <sup><i>(formerly called 'spacetime-informal')</i></sup>
  </div>
  <sub>
    by
    <a href="https://spencermountain.github.io/">Spencer Kelly</a>
  </sub>
</div>
<p></p>

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

```js
const soft = require('timezone-soft')

let timezones = soft.find('milwaukee')
// ['America/Chicago']

let show = soft.display(timezones[0])
// ... { name: 'Central Standard Time', abbrev: 'CST' }
```

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


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

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


```js
const soft = require('timezone-soft')

soft.find('EST')
// 'America/New_York'

soft.find('central')
// 'America/Chicago'

soft.find('venezuela')
// 'America/Caracas'

soft.find('south east asia')
// 'Asia/Bangkok'

soft.display('Toronto')
/*{
  standard: { name: 'Eastern Standard Time', abbrev: 'EST' },
  daylight: { name: 'Eastern Daylight Time', abbrev: 'EDT' },
  iana: 'Canada/Toronto'
}*/
```

it was built to be as forgiving as possible, and return the most common-sense IANA timezone id from user-input.

<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221814-05ed1680-ffb8-11e9-8b6b-c7528d163871.png"/>
</div>

---

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


along with [spacetime](https://github.com/spencermountain/spacetime), you can generate human-friendly time formats, like this:
```js
const spacetime = require('spacetime')
const soft = require('timezone-soft')

let display = soft.display('montreal')
let s = spacetime.now(display.iana)
let abbrev = s.isDST() ? display.daylight.abbrev : display.standard.abbrev // (add some null-checks)
let time = `${s.time()} ${abbrev}`
// '4:20pm EDT'
```

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

work-in-progress.

MIT
