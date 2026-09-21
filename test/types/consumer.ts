import soft, { type DisplayFormat, type DaylightTimeZoneInfo } from 'timezone-soft'

const matches: DisplayFormat[] = soft('Toronto')
const zone = matches[0]
const daylight: DaylightTimeZoneInfo | null = zone.daylight
if (daylight) {
  const start: string = daylight.start
  const end: string = daylight.end
  const offset: number = daylight.offset
  void [start, end, offset]
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
