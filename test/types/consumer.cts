import soft = require('timezone-soft')

const matches: soft.DisplayFormat[] = soft('Toronto')
const zone = matches[0]
if (zone.daylight) {
  const start: string = zone.daylight.start
  const end: string = zone.daylight.end
  void [start, end]
}
zone.daylight = null
// @ts-expect-error daylight requires a null check
matches[0].daylight.abbr
// @ts-expect-error the property is abbr, not abbrev
zone.standard.abbrev
// @ts-expect-error input must be a string
soft(5)

const version: string = soft.version
void version
