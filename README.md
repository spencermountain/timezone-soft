<div align="center">
  <a href="https://npmjs.org/package/spacetime-informal">
    <img src="https://img.shields.io/npm/v/spacetime-informal.svg?style=flat-square" />
  </a>
  <a href="https://unpkg.com/spacetime-informal/builds/spacetime.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/spacetime-informal/master/builds/spacetime-informal.min.js" />
  </a>
  <hr/>
  <div>npm i <b>spacetime-informal</b></div>
  support informal timezone-names
</div>

The IANA timezone database is the official nomenclature for timezone information, and is what you should use, whenever possible.

Humans though, are goofballs, and use a whole different informal scheme.

In (North) America, we use **PST, MST, EST**

in Europe (lately) they use **WEST, CEST, EEST**..

in Africa they use **EAT, CAT, WAST**

in australia they use **AWST, AEDT, ACST**

these line-up with the IANA timezones sometimes. Other times they don't.

These names collide all the time, (like IST - irish/indian stardard time).

These names produce all-sorts of ambiguities, in regards to DST-changes.

There's a bunch of political/historical/disputed cruft going on, too.

This library is an attempt to 'soften' this exchange, using some *opinionated-but-common-sense* rules and decision-making.

```js
const informal=require('spacetime-informal')

informal.guess('EST')
//'America/New_York'
informal.guess('central')
//'america/chicago'

informal.display('Canada/Toronto')
/*{
  abbreviation:'EST',
  title:'Eastern'
}*/



```

work-in-progress
MIT
